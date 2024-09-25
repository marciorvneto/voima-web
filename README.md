# **Voima Web**

**⚠️ WARNING: This is a work in progress and is NOT suited for production just yet!**

**Voima Web** is an ecological modeling engine designed to simulate complex ecosystems by modeling species interactions, population dynamics, and energy flows. Built on a flexible, node-based architecture, Voima Web allows users to define custom ecosystems and simulate scenarios using a highly modular approach. The engine handles intricate species relationships, including predator-prey interactions with different functional response types, competition, and environmental impacts such as fishing pressure or habitat degradation, all using SI units for consistency.

## **Features**

- **Species Dynamics**: Simulate growth, logistic population dynamics with carrying capacities, and energy transfers of species over time.
- **Functional Responses**: Model predator-prey interactions using Type I, II, and III functional responses.
- **Interaction Modeling**: Define multiple interactions, including predation, competition, and mutualism between species.
- **Environmental Effects**: Introduce external stressors like fishing pressure, habitat loss, climate change, and pollution.
- **Energy Flow Tracking**: Monitor the transfer of energy between trophic levels in the ecosystem.
- **Events and Management Actions**: Simulate random events or management interventions that affect the ecosystem.
- **Modular and Flexible**: Easily extend and add new nodes, interactions, or environmental parameters.

## **Standard Units (SI)**

Voima Web uses SI units to ensure consistency across all calculations:

- **Biomass**: Kilograms (kg) or metric tons (t).
- **Growth Rate**: Per year (\(\text{year}^{-1}\)).
- **Consumption Rate**: Kilograms per year (\(\text{kg/year}\)).
- **Time**: Years.
- **Energy**: Joules per year (\(\text{J/year}\)) for energy transfer between trophic levels.

## **Functional Response Types**

Voima Web supports three types of functional responses to model how a predator's consumption rate changes with prey density:

1. **Type I Functional Response**:
   - **Description**: Linear increase in consumption rate with prey density until satiation.
   - **Use Case**: Ideal for filter feeders or predators with minimal handling time.
2. **Type II Functional Response**:
   - **Description**: Consumption rate rises at a decelerating rate due to handling time, reaching a plateau.
   - **Use Case**: Common in predator-prey interactions where handling time limits consumption.
3. **Type III Functional Response**:
   - **Description**: S-shaped curve; low consumption at low prey densities, increasing rapidly at intermediate densities, then leveling off.
   - **Use Case**: Suitable for modeling prey switching or learning behaviors in predators.

## **Scenario Example**

Here’s an example of how a basic scenario is structured, incorporating the new features:

```typescript
import {
  Scenario,
  SpeciesType,
  InteractionType,
  EnvironmentType,
} from "voima-web";

const species: SpeciesType[] = [
  {
    name: "Rabbit",
    biomass: 1000, // kg
    growthRate: 1.0, // per year
    carryingCapacity: 5000, // kg
  },
  {
    name: "Fox",
    biomass: 100, // kg
    growthRate: 0.5, // per year
  },
];

const interactions: InteractionType[] = [
  {
    predator: "Fox",
    prey: "Rabbit",
    consumptionRate: 0.01, // attack rate
    functionalResponse: "Type II",
    energyTransferEfficiency: 0.1, // 10% efficiency
    handlingTime: 0.1, // years
  },
];

const environment: EnvironmentType = {
  fishingEffort: { Rabbit: 0.05 }, // 5% of Rabbit population hunted per year
  habitatLoss: 0.02, // 2% habitat loss per year
  climateChangeImpact: 0.01, // incremental impact per year
  temperature: 15, // degrees Celsius
  pollutionLevels: { CO2: 400 }, // ppm
};

const scenario: Scenario = {
  species,
  interactions,
  environment,
  timeStep: 0.1, // 0.1 year increments
  duration: 20, // simulate over 20 years
};
```

## **Installation**

1. **Clone the repository:**

   ```bash
   git clone https://github.com/marciorvneto/voima-web
   cd voima-web
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Build the project:**

   ```bash
   npm run build
   ```

4. **Run the project:**

   ```bash
   npm start
   ```

## **Usage**

1. **Define your species, interactions, and environment in a `Scenario` object.**
2. **Use the `runRK4Simulation(scenario)` function to run the simulation.**
3. **Analyze the output, including population dynamics and energy flows over time.**

### **Example Simulation**

```typescript
import { runRK4Simulation } from "voima-web";

// Define species
const prey: SpeciesType = {
  name: "Rabbit",
  biomass: 1000, // kg
  growthRate: 1.0, // per year
  carryingCapacity: 5000, // kg
};

const predator: SpeciesType = {
  name: "Fox",
  biomass: 100, // kg
  growthRate: 0.5, // per year
};

// Define interaction
const predation: InteractionType = {
  predator: "Fox",
  prey: "Rabbit",
  consumptionRate: 0.01, // attack rate
  functionalResponse: "Type II",
  energyTransferEfficiency: 0.1, // 10% efficiency
  handlingTime: 0.1, // years
};

// Define scenario
const scenario: Scenario = {
  species: [prey, predator],
  interactions: [predation],
  environment: {
    fishingEffort: { Rabbit: 0.05 },
    habitatLoss: 0.02,
    temperature: 15,
    pollutionLevels: { CO2: 400 },
  },
  timeStep: 0.1,
  duration: 20,
};

// Run the simulation
const results = runRK4Simulation(scenario);

// Access results
console.log("Population Over Time:", results.populationOverTime);
console.log("Energy Flow Over Time:", results.energyFlowOverTime);
```

## **Output**

The simulation output includes the population biomass of each species over time and the energy transferred between species due to predation.

```json
{
  "populationOverTime": {
    "Rabbit": [
      { "species": "Rabbit", "time": 0, "biomass": 1000 },
      { "species": "Rabbit", "time": 0.1, "biomass": 1049.5 }
      // ... more data points
    ],
    "Fox": [
      { "species": "Fox", "time": 0, "biomass": 100 },
      { "species": "Fox", "time": 0.1, "biomass": 102.5 }
      // ... more data points
    ]
  }
}
```

_Note: The above output is illustrative. Actual results will depend on the specific parameters and initial conditions of your simulation._

## **Contributing**

We welcome contributions! Feel free to fork this repository, submit issues, or contribute features by making pull requests. Please ensure that your code adheres to the existing style and include relevant tests.

## **License**

This project is licensed under the MIT License.
