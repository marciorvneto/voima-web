export type EnvironmentType = {
  fishingEffort?: { [species: string]: number }; // Dimensionless (fraction of population)
  habitatLoss?: number; // Dimensionless (fraction of habitat lost)
  climateChangeImpact?: number; // Dimensionless, could model temperature increases later
  temperature?: number;
  precipitation?: number;
  pollutionLevels?: { [pollutant: string]: number };
};

export type FunctionalResponseType = "Type I" | "Type II" | "Type III";
export type InteractionType = {
  predator: string;
  prey: string;
  consumptionRate: number; // in kg/year
  functionalResponse?: FunctionalResponseType;
  energyTransferEfficiency?: number;
  handlingTime?: number;
};

export type SpeciesType = {
  name: string;
  biomass: number; // in kg or tons
  growthRate: number; // in year^-1
  consumptionRate?: number; // in kg/year
  productionBiomassRatio?: number; // in year^-1
  carryingCapacity?: number; // Maximum sustainable population (logistic model)
  resourceConsumption?: { [resourceName: string]: number }; // Consumption per individual
};

export type PopulationOutputType = {
  species: string; // Species name
  time: number; // Time in the simulation (e.g., year)
  biomass: number; // Biomass at that time
};

export type EnergyFlowOutputType = {
  predator: string; // Predator species name
  prey: string; // Prey species name
  time: number; // Time in the simulation
  energyTransferred: number; // Amount of energy transferred at that time
};

export type SimulationResultsType = {
  populationOverTime: { [speciesName: string]: PopulationOutputType[] }; // Population data indexed by species name
  energyFlowOverTime?: { [interactionKey: string]: EnergyFlowOutputType[] }; // Energy flow data indexed by predator-prey pair
};

export type Event = {
  name: string;
  time: number; // Time at which the event occurs
  handled: boolean;
  effect: (scenario: Scenario, time: number) => void; // Function that applies the event's effect
};

export type Scenario = {
  species: SpeciesType[]; // List of species in the ecosystem
  interactions: InteractionType[]; // List of species interactions (predation, competition)
  environment?: EnvironmentType; // Environmental conditions affecting the ecosystem
  timeStep: number; // Duration of each time step (e.g., 1 year)
  duration: number; // Total duration of the simulation (e.g., 10 years)
  events?: Event[];
};

export type ResourceType = {
  name: string;
  availability: number; // Amount of resource available
  regenerationRate: number; // Rate at which the resource regenerates
  consumptionRate: { [speciesName: string]: number }; // Consumption rate per species
};
