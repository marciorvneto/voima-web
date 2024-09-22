type EnvironmentType = {
  fishingEffort?: { [species: string]: number };  // Dimensionless (fraction of population)
  habitatLoss?: number;  // Dimensionless (fraction of habitat lost)
  climateChangeImpact?: number;  // Dimensionless, could model temperature increases later
};

type InteractionType = {
  predator: string;
  prey: string;
  consumptionRate: number; // in kg/year
  functionalResponse?: string;
};

type SpeciesType = {
  name: string;
  biomass: number;        // in kg or tons
  growthRate: number;     // in year^-1
  consumptionRate?: number; // in kg/year
  productionBiomassRatio?: number; // in year^-1
};

type PopulationOutputType = {
  species: string;       // Species name
  time: number;          // Time in the simulation (e.g., year)
  biomass: number;       // Biomass at that time
};

type EnergyFlowOutputType = {
  predator: string;      // Predator species name
  prey: string;          // Prey species name
  time: number;          // Time in the simulation
  energyTransferred: number;  // Amount of energy transferred at that time
};

type SimulationResultsType = {
  populationOverTime: PopulationOutputType[];  // Population or biomass for all species
  energyFlowOverTime?: EnergyFlowOutputType[]; // Energy flow between species (optional)
};

type Scenario = {
  species: SpeciesType[];  // List of species in the ecosystem
  interactions: InteractionType[];  // List of species interactions (predation, competition)
  environment?: EnvironmentType;  // Environmental conditions affecting the ecosystem
  timeStep: number;  // Duration of each time step (e.g., 1 year)
  duration: number;  // Total duration of the simulation (e.g., 10 years)
};

// Simulation code

// Define the function that calculates the derivative (population growth rate, predation, etc.)
function populationDerivative(t: number, y: number, species: SpeciesType, interaction?: InteractionType): number {
  let growth = species.growthRate * y;

  // Apply predation if applicable
  if (interaction) {
    const preyLoss = interaction.consumptionRate * y; // Prey consumed by predators
    growth -= preyLoss;
  }

  return growth;
}

// Implement the standard 4th-order Runge-Kutta (RK4) method with fixed step size
function rk4Step(
  t: number,
  y: number,
  h: number,
  species: SpeciesType,
  interaction?: InteractionType
): number {
  const k1 = h * populationDerivative(t, y, species, interaction);
  const k2 = h * populationDerivative(
    t + h / 2,
    y + k1 / 2,
    species,
    interaction
  );
  const k3 = h * populationDerivative(
    t + h / 2,
    y + k2 / 2,
    species,
    interaction
  );
  const k4 = h * populationDerivative(
    t + h,
    y + k3,
    species,
    interaction
  );

  // Update y using the weighted average of slopes
  const yNext = y + (1 / 6) * (k1 + 2 * k2 + 2 * k3 + k4);

  return yNext;
}


function runRK4Simulation(scenario: Scenario): SimulationResultsType {
  let results: SimulationResultsType = {
    populationOverTime: [],
    energyFlowOverTime: [],
  };

  let h = scenario.timeStep;  // Initial step size
  for (let t = 0; t < scenario.duration; t += h) {
    // Loop through each species and apply RK4 for population updates
    scenario.species.forEach(species => {
      // Handle predator-prey interactions if applicable
      const interaction = scenario.interactions.find(i => i.prey === species.name);
      
      // RK4 step for population update
      const newBiomass = rk4Step(t, species.biomass, h, species, interaction);
      
      // Store population over time for results
      results.populationOverTime.push({
        species: species.name,
        time: t,
        biomass: newBiomass,
      });

      // Update species biomass for the next step
      species.biomass = newBiomass;
    });
  }

  return results;
}




const scenario: Scenario = {
  species: [
    { name: 'Tuna', biomass: 500000, growthRate: 0.1 },  // Tuna with a 10% growth rate
    { name: 'Shark', biomass: 100000, growthRate: 0.02, consumptionRate: 500 }, // Sharks with a lower consumption rate
  ],
  interactions: [
    { predator: 'Shark', prey: 'Tuna', consumptionRate: 500 }, // Sharks consume 500 kg of tuna per year
  ],
  environment: {
    fishingEffort: { Tuna: 0.05 },  // 5% of Tuna population fished per year
    habitatLoss: 0.02,  // 2% habitat loss
  },
  timeStep: 10/10000,  // 1 year per time step
  duration: 10, // Simulate over 10 years
};

console.log(scenario)

const result = runRK4Simulation(scenario)

console.log(result.populationOverTime.slice(-10))


