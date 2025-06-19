const INITIAL_MINING_TOOLS: GameUpgrade[] = [
  {
    cost: 0,
    name: "Iron Pickaxe",
    power: 1,
    type: "mine",
    unlocked: true,
    value: "ironPickaxe",
  },
  {
    cost: 15,
    name: "Gold Pickaxe",
    power: 2,
    type: "mine",
    unlocked: false,
    value: "goldPickaxe",
  },
];

const INITIAL_FUEL: GameUpgrade[] = [
  {
    cost: 0,
    name: "Basic fuel",
    power: 1,
    type: "fuel",
    unlocked: true,
    value: "basicFuel",
  },
  {
    cost: 1000,
    name: "Advanced fuel",
    power: 2,
    type: "fuel",
    unlocked: false,
    value: "advancedFuel",
  },
];

const INITIAL_STORAGE_ITEMS: GameUpgrade[] = [
  {
    cost: 0,
    name: "Small container",
    power: 100,
    type: "storage",
    unlocked: true,
    value: "smallContainer",
  },
  {
    cost: 1000,
    name: "Medium crate",
    power: 1000,
    type: "storage",
    unlocked: false,
    value: "mediumCrate",
  },
];

function generateUpgrades(): GameUpgrade[] {
  let result: GameUpgrade[] = [];
  INITIAL_MINING_TOOLS.forEach((ore) => {
    result.push(ore);
  });
  INITIAL_FUEL.forEach((alloy) => {
    result.push(alloy);
  });
  INITIAL_STORAGE_ITEMS.forEach((alloy) => {
    result.push(alloy);
  });
  return result;
}

const INITIAL_UPGRADES: GameUpgrade[] = generateUpgrades();

export { INITIAL_UPGRADES };
