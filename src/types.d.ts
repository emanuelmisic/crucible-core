interface GameContext {
  money: number;
  setMoney: Dispatch<SetStateAction<number>>;
  resources: GameResource[];
  structures: GameStructure[];
  miningPower: number;
  smeltingPower: number;
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
  resourceType: string; // Output resource (e.g., "iron" for iron ingots)
  generationRate: number; // Resources per second
  cost: number; // Purchase cost
  level: number; // 0 = not owned, 1+ = placed and active
  accumulated: number; // Output resources waiting to be collected
  structureType: "mining" | "smelting" | "storage"; // Structure category
  recipe?: { [resource: string]: number }; // Input resources (for smelting)
  fuelConsumptionRate?: number; // Fuel units consumed per second
  fuelCapacity?: number; // Max fuel this structure can hold
  currentFuel?: number; // Current fuel level
  oreCapacity?: number; // Max ore this structure can hold
  currentOre?: number; // Current ore stored
}

interface DialogProps {
  showDialog: boolean;
  closeDialog: () => void;
}
