interface GameContext {
  money: number;
  setMoney: Dispatch<SetStateAction<number>>;
  resources: GameResource[];
  upgrades: GameUpgrade[];
  structures: GameStructure[];
  miningProgress: { [key: string]: number };
  smeltingProgress: { [key: string]: number };
  mineOre: (ore: GameResourceOre) => void;
  smeltAlloy: (alloy: GameResourceAlloy) => void;
  miningPower: number;
  smeltingPower: number;
  storage: number;
  sellAll: (resource: GameResource) => void;
  sellHalf: (resource: GameResource) => void;
  unlockResource: (res: GameResource) => void;
  unlockUpgrade: (upgrade: GameUpgrade) => void;
  setResourceActiveState: (res: GameResource, value: boolean) => void;
  setResourceIsDisplayedState: (res: GameResource, value: boolean) => void;
  purchaseStructure: (structureId: string) => void;
  collectResources: (structureId: string) => void;
}

interface GameResource {
  active: boolean;
  isDisplayed: boolean;
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

interface GameStructure {
  id: string;
  name: string;
  resourceType: string;
  generationRate: number; // Resources per second (e.g., 1)
  cost: number;
  level: number; // 0 = not owned, 1+ = placed and active
  accumulated: number; // Resources waiting to be collected
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
