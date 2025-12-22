export const FUEL_COST_PER_UNIT = 2;

export const STRUCTURES: GameStructure[] = [
  // Mining structures
  {
    id: "basic_iron_drill",
    name: "Basic Iron Drill",
    resource: "iron",
    generationRate: 1.5,
    cost: 100,
    level: 0,
    accumulated: 0,
    structureType: "mining",
  },
  {
    id: "basic_bronze_drill",
    name: "Basic Bronze Drill",
    resource: "bronze",
    generationRate: 1.0,
    cost: 300,
    level: 0,
    accumulated: 0,
    structureType: "mining",
  },
  {
    id: "basic_silver_drill",
    name: "Basic Silver Drill",
    resource: "silver",
    generationRate: 0.6,
    cost: 800,
    level: 0,
    accumulated: 0,
    structureType: "mining",
  },

  // Smelting structures
  {
    id: "basic_iron_smelter",
    name: "Basic Iron Smelter",
    resource: "iron",
    generationRate: 0.5,
    cost: 800,
    level: 0,
    accumulated: 0,
    structureType: "smelting",
    recipe: { iron: 10 },
    fuelConsumptionRate: 0.1,
    fuelCapacity: 100,
    currentFuel: 0,
    oreCapacity: 500,
    currentOre: 0,
  },

  // Storage structures
  {
    id: "basic_warehouse",
    name: "Basic Warehouse",
    generationRate: 0,
    cost: 400,
    level: 0,
    accumulated: 0,
    structureType: "storage",
    storageProvided: {
      iron: 200,
      bronze: 200,
    },
  },
];
