interface GameContext {
  money: number;
  setMoney: Dispatch<SetStateAction<number>>;
  resources: GameResource[];
  collectResources: (structureId: string) => void;
  setResourceActiveState: (res: GameResource, value: boolean) => void;
  setResourceIsDisplayedState: (res: GameResource, value: boolean) => void;
  sellAll: (resource: GameResource) => void;
  sellHalf: (resource: GameResource) => void;
  structures: GameStructure[];
  purchaseStructure: (structureId: string) => void;
  upgradeStructure: (structureId: string) => void;
  refuelStructure: (structureId: string, amount: number) => void;
  inputOre: (structureId: string, amount: number) => void;
  options: GameOptions;
  updateGameOption: (option: string, value: boolean) => void;
  getHQLevel: () => number;
  getResourceCapacity: (type: "ore" | "alloy") => number;
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
  unlockedAtHqLevel: number;
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
  resource: string;
  generationRate: number | number[];
  cost: number[];
  level: number;
  accumulated: number;
  structureType: "mining" | "smelting" | "storage" | "hq";
  maxLevel: number[];
  recipe?: { [resource: string]: number };
  fuelConsumptionRate?: number | number[];
  fuelCapacity?: number;
  currentFuel?: number;
  oreCapacity?: number;
  currentOre?: number;
  storageProvided?: number[];
  unlocked?: boolean;
  resourceCost?: { [resource: string]: number }[];
}

interface DialogProps {
  showDialog: boolean;
  closeDialog: () => void;
}

interface GameOptions {
  showMiningStructures: boolean;
  showSmeltingStructures: boolean;
  showStorageStructures: boolean;
}
