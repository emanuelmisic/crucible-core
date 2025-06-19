const INITIAL_ORES: GameResourceOre[] = [
  {
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
    amount: 0,
    miningHardness: 20,
    name: "Gold ore",
    sellingPrice: 5,
    type: "ore",
    unlocked: false,
    unlockedFor: 2000,
    value: "gold",
  },
];

const INITIAL_ALLOYS: GameResourceAlloy[] = [
  {
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
