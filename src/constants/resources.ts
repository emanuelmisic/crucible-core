const INITIAL_ORES: GameResourceOre[] = [
  {
    active: true,
    amount: 0,
    miningHardness: 5,
    name: "Iron ore",
    sellingPrice: 1,
    type: "ore",
    unlocked: true,
    unlockedFor: 0,
    value: "iron",
  },
  {
    active: false,
    amount: 0,
    miningHardness: 10,
    name: "Bronze ore",
    sellingPrice: 2,
    type: "ore",
    unlocked: false,
    unlockedFor: 200,
    value: "bronze",
  },
  {
    active: false,
    amount: 0,
    miningHardness: 20,
    name: "Silver ore",
    sellingPrice: 5,
    type: "ore",
    unlocked: false,
    unlockedFor: 1000,
    value: "silver",
  },
  {
    active: false,
    amount: 0,
    miningHardness: 60,
    name: "Gold ore",
    sellingPrice: 20,
    type: "ore",
    unlocked: false,
    unlockedFor: 2000,
    value: "gold",
  },
  {
    active: false,
    amount: 0,
    miningHardness: 100,
    name: "Platinum ore",
    sellingPrice: 35,
    type: "ore",
    unlocked: false,
    unlockedFor: 5000,
    value: "platinum",
  },
  {
    active: false,
    amount: 0,
    miningHardness: 200,
    name: "Diamond ore",
    sellingPrice: 100,
    type: "ore",
    unlocked: false,
    unlockedFor: 10000,
    value: "diamond",
  },
  {
    active: false,
    amount: 0,
    miningHardness: 500,
    name: "Titanium ore",
    sellingPrice: 250,
    type: "ore",
    unlocked: false,
    unlockedFor: 25000,
    value: "titanium",
  },
];

const INITIAL_ALLOYS: GameResourceAlloy[] = [
  {
    active: false,
    amount: 0,
    name: "Iron ingot",
    smeltingDifficulty: 5,
    smeltingRecipe: {
      iron: 10,
    },
    sellingPrice: 20,
    type: "alloy",
    unlocked: false,
    unlockedFor: 10,
    value: "iron",
  },
  {
    active: false,
    amount: 0,
    name: "Bronze ingot",
    smeltingDifficulty: 10,
    smeltingRecipe: {
      bronze: 10,
    },
    sellingPrice: 50,
    type: "alloy",
    unlocked: false,
    unlockedFor: 200,
    value: "bronze",
  },
  {
    active: false,
    amount: 0,
    name: "Silver bar",
    smeltingDifficulty: 20,
    smeltingRecipe: {
      bronze: 10,
    },
    sellingPrice: 50,
    type: "alloy",
    unlocked: false,
    unlockedFor: 200,
    value: "silver",
  },
  {
    active: false,
    amount: 0,
    name: "Gold bar",
    smeltingDifficulty: 10,
    smeltingRecipe: {
      bronze: 10,
    },
    sellingPrice: 50,
    type: "alloy",
    unlocked: false,
    unlockedFor: 200,
    value: "gold",
  },
  {
    active: false,
    amount: 0,
    name: "Platinum bar",
    smeltingDifficulty: 10,
    smeltingRecipe: {
      bronze: 10,
    },
    sellingPrice: 50,
    type: "alloy",
    unlocked: false,
    unlockedFor: 200,
    value: "platinum",
  },
];

function generateResources(): GameResource[] {
  let result: GameResource[] = [];
  INITIAL_ORES.forEach((ore) => {
    result.push(ore);
  });
  INITIAL_ALLOYS.forEach((alloy) => {
    result.push(alloy);
  });
  return result;
}

const INITIAL_RESOURCES: GameResource[] = generateResources();

export { INITIAL_RESOURCES };
