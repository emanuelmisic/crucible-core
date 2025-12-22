interface GameContext {
  money: number;
  setMoney: Dispatch<SetStateAction<number>>;
  resources: GameResource[];
  structures: GameStructure[];
  sellAll: (resource: GameResource) => void;
  sellHalf: (resource: GameResource) => void;
  unlockResource: (res: GameResource) => void;
  setResourceActiveState: (res: GameResource, value: boolean) => void;
  setResourceIsDisplayedState: (res: GameResource, value: boolean) => void;
  purchaseStructure: (structureId: string) => void;
  collectResources: (structureId: string) => void;
  refuelStructure: (structureId: string, amount: number) => void;
  inputOre: (structureId: string, amount: number) => void;
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
  storageCapacity: number;
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
  generationRate: number;
  cost: number;
  level: number;
  accumulated: number;
  structureType: "mining" | "smelting" | "storage";
  recipe?: { [resource: string]: number };
  fuelConsumptionRate?: number;
  fuelCapacity?: number;
  currentFuel?: number;
  oreCapacity?: number;
  currentOre?: number;
  storageProvided?: { [resource: string]: number };
}

interface DialogProps {
  showDialog: boolean;
  closeDialog: () => void;
}
