import { InteractionType, Scenario, SpeciesType } from "./api";
import { runRK4Simulation } from "./calculations";

// Define species
const prey: SpeciesType = {
  name: "Rabbit",
  biomass: 500, // kg
  growthRate: 0.8, // per year
  carryingCapacity: 1000, // kg
};

const predator: SpeciesType = {
  name: "Fox",
  biomass: 50, // kg
  growthRate: 0.2, // per year
};

// Define interaction
const predation: InteractionType = {
  predator: "Fox",
  prey: "Rabbit",
  consumptionRate: 0.01, // attack rate
  functionalResponse: "Type II",
  energyTransferEfficiency: 0.1,
  handlingTime: 0.5, // years
};

// Define scenario
const scenario: Scenario = {
  species: [prey, predator],
  interactions: [predation],
  environment: {
    temperature: 15, // degrees Celsius
  },
  timeStep: 0.1, // years
  duration: 20, // years
};

// Run simulation
const results = runRK4Simulation(scenario);

console.log(results.populationOverTime["Rabbit"].slice(0, 30));
