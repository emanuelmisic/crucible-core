interface GameResource {
  active: boolean;
  amount: number;
  name: string;
  miningHardness?: number;
  sellingPrice: number;
  smeltingDifficulty?: number;
  smeltingRecipe?: { [resource: string]: number };
  type: "ore" | "alloy";
  unlocked: boolean;
  unlockedFor: number;
  value: string;
}

interface GameResourceOre extends GameResource {
  miningHardness: number;
}

interface GameResourceAlloy extends GameResource {
  smeltingDifficulty: number;
  smeltingRecipe: { [resource: string]: number };
}

interface GameUpgrade {
  cost: number;
  name: string;
  power: number;
  type: "mine" | "fuel" | "storage";
  unlocked: boolean;
  value: string;
}
