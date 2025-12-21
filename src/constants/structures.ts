// Fuel system constants
export const FUEL_COST_PER_UNIT = 2;

// Refuel package options (amount: cost)
export const REFUEL_PACKAGES = {
  small: 10, // 10 fuel for $20
  medium: 50, // 50 fuel for $100
  large: 100, // 100 fuel for $200
  // "max" is calculated dynamically based on structure capacity
};

export const STRUCTURES: GameStructure[] = [
  // Mining structures
  {
    id: 'basic_iron_drill',
    name: 'Basic Iron Drill',
    resourceType: 'iron',
    generationRate: 1.5,
    cost: 100,
    level: 0,
    accumulated: 0,
    structureType: 'mining',
  },
  {
    id: 'basic_bronze_drill',
    name: 'Basic Bronze Drill',
    resourceType: 'bronze',
    generationRate: 1.0,
    cost: 300,
    level: 0,
    accumulated: 0,
    structureType: 'mining',
  },
  {
    id: 'basic_silver_drill',
    name: 'Basic Silver Drill',
    resourceType: 'silver',
    generationRate: 0.6,
    cost: 800,
    level: 0,
    accumulated: 0,
    structureType: 'mining',
  },

  // Smelting structures
  {
    id: 'basic_iron_smelter',
    name: 'Basic Iron Smelter',
    resourceType: 'iron', // Produces iron INGOTS (alloy type)
    generationRate: 0.5, // 0.5 ingots per second
    cost: 800,
    level: 0,
    accumulated: 0,
    structureType: 'smelting',
    recipe: { iron: 10 }, // Consumes 10 iron ore per ingot
    fuelConsumptionRate: 0.1, // 0.1 coal per second = 1 coal per 10 seconds
    fuelCapacity: 100, // Can hold 100 coal (1000 seconds / ~16 minutes)
    currentFuel: 0, // Starts empty
  },
];
