import {
  InteractionType,
  ResourceType,
  Scenario,
  SimulationResultsType,
  SpeciesType,
} from "./api";
import { rk4Step } from "./numeric";

const EVENT_TIME_TOLERANCE = 1e-6;

const functionalResponse = (
  interaction: InteractionType,
  predatorBiomass: number,
  preyBiomass: number,
): number => {
  const a = interaction.consumptionRate;
  const h = interaction.handlingTime || 0;
  const type = interaction.functionalResponse || "Type II";

  switch (type) {
    case "Type I":
      return a * predatorBiomass * preyBiomass;
    case "Type II":
      return (a * predatorBiomass * preyBiomass) / (1 + a * h * preyBiomass);
    case "Type III":
      return (
        (a * predatorBiomass * preyBiomass ** 2) /
        (1 + a * h * preyBiomass ** 2)
      );
    default:
      throw new Error(`Unknown functional response type: ${type}`);
  }
};

// TODO: Resources
// function updateResources(
//   resources: { [resourceName: string]: ResourceType },
//   populations: { [speciesName: string]: number },
//   timeStep: number,
// ): void {
//   Object.values(resources).forEach((resource) => {
//     // Regenerate resources
//     resource.availability += resource.regenerationRate * timeStep;

//     // Reduce resources based on consumption
//     Object.keys(resource.consumptionRate).forEach((speciesName) => {
//       const consumption =
//         resource.consumptionRate[speciesName] *
//         populations[speciesName] *
//         timeStep;
//       resource.availability = Math.max(resource.availability - consumption, 0);
//     });
//   });
// }

function populationDerivative(
  _: number,
  y: number,
  species: SpeciesType,
  interactions: InteractionType[],
  populations: { [speciesName: string]: number },
): number {
  let growth = species.growthRate;
  if (species.carryingCapacity) {
    growth *= 1 - y / species.carryingCapacity;
  }

  // How much of the species biomass will be lost due to predation
  let predationLoss = 0;
  interactions
    .filter((i) => i.prey === species.name)
    .forEach((interaction) => {
      const predatorBiomass = populations[interaction.predator];
      const preyBiomass = y;
      const consumption = functionalResponse(
        interaction,
        predatorBiomass,
        preyBiomass,
      );
      predationLoss += consumption;
    });

  // How much of the species biomass will increase due to predation
  let predationGain = 0;
  interactions
    .filter((i) => i.predator === species.name)
    .forEach((interaction) => {
      const predatorBiomass = y;
      const preyBiomass = populations[interaction.predator];
      const consumption = functionalResponse(
        interaction,
        predatorBiomass,
        preyBiomass,
      );

      const efficiency = interaction.energyTransferEfficiency || 1; // If not given, assume 100%, which is clearly impossible
      predationGain += consumption * efficiency;
    });

  const netChangeDerivative = growth - predationLoss + predationGain;
  return netChangeDerivative;
}

export const runRK4Simulation = (scenario: Scenario): SimulationResultsType => {
  let results: SimulationResultsType = {
    populationOverTime: {},
    energyFlowOverTime: {},
  };

  let h = scenario.timeStep;
  const populations: { [speciesName: string]: number } = {};
  scenario.species.forEach((species) => {
    populations[species.name] = species.biomass;
    results.populationOverTime[species.name] = [];
  });

  for (let t = 0; t < scenario.duration; t += h) {
    if (scenario.events) {
      for (let event of scenario.events) {
        if (Math.abs(t - event.time) < EVENT_TIME_TOLERANCE) {
          event.effect(scenario, t);
          event.handled = true;
        }
      }
    }

    const currentPopulations = { ...populations };

    scenario.species.forEach((species) => {
      const odeFn = (t: number, y: number) =>
        populationDerivative(
          t,
          y,
          species,
          scenario.interactions,
          currentPopulations,
        );
      const speciesBiomass = populations[species.name];
      const newPredictedBiomass = rk4Step(t, speciesBiomass, h, odeFn);
      const newBiomass = Math.max(0, newPredictedBiomass);
      populations[species.name] = newBiomass;

      results.populationOverTime[species.name].push({
        species: species.name,
        time: t,
        biomass: newBiomass,
      });
    });
  }

  return results;
};
