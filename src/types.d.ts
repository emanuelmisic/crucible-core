interface GameContext {
  money: number;
  setMoney: Dispatch<SetStateAction<number>>;
  resources: GameResource[];
  upgrades: GameUpgrade[];
  miningProgress: { [key: string]: number };
  smeltingProgress: { [key: string]: number };
  mineOre: (ore: GameResourceOre) => void;
  smeltAlloy: (alloy: GameResourceAlloy) => void;
  miningPower: number;
  smeltingPower: number;
  sellAll: (resource: GameResource) => void;
  sellHalf: (resource: GameResource) => void;
  unlockResource: (res: GameResource) => void;
  setResourceActiveState: (res: GameResource, value: boolean) => void;
}

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

interface DialogProps {
  showDialog: boolean;
  closeDialog: () => void;
}
