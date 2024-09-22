# **Voima Web**

** WARNING: This is a work in progress and is NOT suited for production just yet! **

**Voima Web** is an ecological modeling engine designed to simulate species interactions, population dynamics, and energy flows within ecosystems. Built on a flexible node-based architecture, Voima Web allows users to define custom ecosystems and simulate scenarios using a highly modular approach. The engine handles complex species relationships, including predator-prey interactions, competition, and environmental impacts such as fishing pressure or habitat degradation, all using SI units for consistency.

## **Features**

- **Species Dynamics**: Simulate the growth, consumption, and energy transfer of species over time.
- **Interaction Modeling**: Define predator-prey interactions, competition, and mutualism between species.
- **Environmental Effects**: Introduce external stressors like fishing pressure, habitat loss, and climate change.
- **Energy Flow**: Track the transfer of energy between trophic levels in the ecosystem.
- **Modular and Flexible**: Easily extend and add new nodes, interactions, or environmental parameters.

## **Standard Units (SI)**

Voima Web uses SI units to ensure consistency across all calculations:

- **Biomass**: Kilograms (kg) or metric tons (t).
- **Growth Rate**: Per year (\(\text{year}^{-1}\)).
- **Consumption Rate**: Kilograms per year (\(\text{kg/year}\)).
- **Time**: Years.
- **Energy**: Joules per year (\(\text{J/year}\)) for energy transfer between trophic levels.

## **Scenario Example**

Here’s an example of how a basic scenario is structured:

```ts
const scenario: Scenario = {
  species: [
    { name: 'Tuna', biomass: 500000, growthRate: 0.05 },  // 500,000 kg or 500 tons
    { name: 'Shark', biomass: 100000, consumptionRate: 2000 }, // 100,000 kg, consumes 2000 kg/year
  ],
  interactions: [
    { predator: 'Shark', prey: 'Tuna', consumptionRate: 1800 }, // 1800 kg/year consumption of tuna
  ],
  environment: {
    fishingEffort: { Tuna: 0.1 },  // 10% of Tuna population fished per year
    habitatLoss: 0.05,  // 5% habitat loss
  },
  timeStep: 1,  // 1 year
  duration: 10, // 10 years
};
```

## **Installation**

1. Clone the repository:
   ```bash
   git clone https://github.com/marciorvneto/voima-web 
   cd voima-web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the project:
   ```bash
   npm start
   ```

## **Usage**

1. Define your species, interactions, and environment in a **Scenario** object.
2. Use the exposed `VoimaWeb.simulate(scenario)` function to run the simulation.
3. Analyze the output, including population dynamics and energy flows, over time.

### Example Simulation:

```ts
import { VoimaWeb } from 'voima-web';

const scenario = {
  species: [
    { name: 'Tuna', biomass: 500000, growthRate: 0.05 },
    { name: 'Shark', biomass: 100000, consumptionRate: 2000 },
  ],
  interactions: [
    { predator: 'Shark', prey: 'Tuna', consumptionRate: 1800 },
  ],
  environment: {
    fishingEffort: { Tuna: 0.1 },
    habitatLoss: 0.05,
  },
  timeStep: 1,
  duration: 10,
};

// Run the simulation
const results = VoimaWeb.simulate(scenario);
console.log(results);
```

## **Output**

The simulation returns population dynamics and energy flow data in the form of an array of results. Example output:

```ts
{
  populationOverTime: [
    { species: 'Tuna', time: 1, biomass: 480000 },
    { species: 'Tuna', time: 2, biomass: 460000 },
    { species: 'Shark', time: 1, biomass: 105000 },
    { species: 'Shark', time: 2, biomass: 110000 },
  ],
  energyFlowOverTime: [
    { predator: 'Shark', prey: 'Tuna', time: 1, energyTransferred: 2000 },
    { predator: 'Shark', prey: 'Tuna', time: 2, energyTransferred: 1800 },
  ]
}
```

## **Contributing**

Feel free to fork this repository, submit issues, or contribute features by making pull requests. Contributions are always welcome!

## **License**

This project is licensed under the MIT License.
