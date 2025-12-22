import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { INITIAL_RESOURCES } from "@/constants/resources";
import { STRUCTURES, FUEL_COST_PER_UNIT } from "@/constants/structures";

const GameContextInstance = createContext<GameContext | undefined>(undefined);

function GameContextComposer({ children }: { children: ReactNode }) {
  const [money, setMoney] = useState(1000);
  const [resources, setResources] = useState<GameResource[]>(INITIAL_RESOURCES);
  const [structures, setStructures] = useState<GameStructure[]>(STRUCTURES);

  // STORAGE LOGIC

  // Calculate storage capacity for a specific resource based on owned structures
  const calculateStorageCapacity = (resourceType: string): number => {
    // Get base capacity from initial resource definition
    const initialResource = INITIAL_RESOURCES.find((r) => r.value === resourceType);
    const baseCapacity = initialResource?.storageCapacity || 0;

    // Add capacity from owned storage structures
    const bonusCapacity = structures
      .filter((s) => s.structureType === "storage" && s.level > 0)
      .reduce((total, structure) => {
        const providedCapacity = structure.storageProvided?.[resourceType] || 0;
        return total + providedCapacity;
      }, 0);

    return baseCapacity + bonusCapacity;
  };

  // Update storage capacity whenever structures change
  useEffect(() => {
    setResources((prev) =>
      prev.map((res) => ({
        ...res,
        storageCapacity: calculateStorageCapacity(res.value),
      }))
    );
  }, [structures]);

  // MERCHANT LOGIC

  function sellAll(resource: GameResource) {
    const moneyToAdd = resource.amount * resource.sellingPrice;
    setResource(resource.value, resource.type, 0);
    setMoney(money + moneyToAdd);
  }

  function sellHalf(resource: GameResource) {
    const halfAmount = Math.floor(resource.amount / 2);
    const moneyToAdd = halfAmount * resource.sellingPrice;
    setResource(resource.value, resource.type, resource.amount - halfAmount);
    setMoney(money + moneyToAdd);
  }

  // STRUCTURES LOGIC

  // Game loop - ticks every 100ms
  useEffect(() => {
    const interval = setInterval(() => {
      generateResources();
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const generateResources = () => {
    const tickRate = 0.1;

    setStructures((prev) =>
      prev.map((structure) => {
        if (structure.level === 0) return structure;

        if (structure.structureType === "mining") {
          const generated = structure.generationRate * tickRate;
          return {
            ...structure,
            accumulated: structure.accumulated + generated,
          };
        }

        if (structure.structureType === "smelting" && structure.recipe) {
          if (!structure.currentFuel || structure.currentFuel <= 0) {
            return structure;
          }

          const currentOre = structure.currentOre || 0;
          const oreNeeded = Object.values(structure.recipe)[0] || 0;
          if (currentOre < oreNeeded) {
            return structure;
          }

          const generated = structure.generationRate * tickRate;
          const fuelConsumed = (structure.fuelConsumptionRate || 0) * tickRate;

          const newAccumulated = structure.accumulated + generated;

          let newOreAmount = currentOre;
          if (Math.floor(newAccumulated) > Math.floor(structure.accumulated)) {
            newOreAmount = Math.max(0, currentOre - oreNeeded);
          }

          return {
            ...structure,
            accumulated: newAccumulated,
            currentFuel: Math.max(0, structure.currentFuel - fuelConsumed),
            currentOre: newOreAmount,
          };
        }

        return structure;
      })
    );
  };

  const purchaseStructure = (structureId: string) => {
    const structure = structures.find((s) => s.id === structureId);
    if (!structure) return;

    if (structure.level > 0) {
      console.warn("Structure already owned");
      return;
    }

    if (money < structure.cost) {
      console.warn("Not enough money");
      return;
    }

    setMoney((prev) => prev - structure.cost);

    setStructures((prev) =>
      prev.map((s) => (s.id === structureId ? { ...s, level: 1 } : s))
    );
  };

  const collectResources = (structureId: string) => {
    const structure = structures.find((s) => s.id === structureId);
    if (!structure || structure.accumulated < 1) return;

    const amountToCollect = Math.floor(structure.accumulated);

    // Check storage capacity
    const resource = resources.find((r) => r.value === structure.resourceType);
    if (!resource) return;

    const spaceAvailable = resource.storageCapacity - resource.amount;
    const actualCollected = Math.min(amountToCollect, spaceAvailable);

    if (actualCollected <= 0) {
      console.warn("Storage is full - cannot collect resources");
      return;
    }

    // Add to resources (respecting storage limit)
    setResources((prev) =>
      prev.map((r) =>
        r.value === structure.resourceType
          ? { ...r, amount: r.amount + actualCollected }
          : r
      )
    );

    // Deduct collected amount from structure's accumulated
    setStructures((prev) =>
      prev.map((s) =>
        s.id === structureId
          ? { ...s, accumulated: s.accumulated - actualCollected }
          : s
      )
    );
  };

  const refuelStructure = (structureId: string, amount: number) => {
    const structure = structures.find((s) => s.id === structureId);
    if (!structure || structure.structureType !== "smelting") {
      console.warn("Structure not found or is not a smelting structure");
      return;
    }

    const currentFuel = structure.currentFuel || 0;
    const capacity = structure.fuelCapacity || 0;
    const spaceAvailable = capacity - currentFuel;
    const fuelToAdd = Math.min(amount, spaceAvailable);

    if (fuelToAdd <= 0) {
      console.warn("Structure fuel tank is full");
      return;
    }

    const totalCost = fuelToAdd * FUEL_COST_PER_UNIT;

    if (money < totalCost) {
      console.warn("Not enough money to refuel");
      return;
    }

    setMoney((prev) => prev - totalCost);
    setStructures((prev) =>
      prev.map((s) =>
        s.id === structureId
          ? { ...s, currentFuel: currentFuel + fuelToAdd }
          : s
      )
    );
  };

  const inputOre = (structureId: string, amount: number) => {
    const structure = structures.find((s) => s.id === structureId);
    if (!structure || structure.structureType !== "smelting") {
      console.warn("Structure not found or is not a smelting structure");
      return;
    }

    if (!structure.recipe) {
      console.warn("Structure has no recipe");
      return;
    }

    const oreType = Object.keys(structure.recipe)[0];
    if (!oreType) {
      console.warn("No ore type found in recipe");
      return;
    }

    const oreResource = resources.find(
      (r) => r.value === oreType && r.type === "ore"
    );

    if (!oreResource || oreResource.amount <= 0) {
      console.warn("Not enough ore in inventory");
      return;
    }

    const currentOre = structure.currentOre || 0;
    const capacity = structure.oreCapacity || 0;
    const spaceAvailable = capacity - currentOre;
    const oreToAdd = Math.min(amount, spaceAvailable, oreResource.amount);

    if (oreToAdd <= 0) {
      console.warn("Structure ore storage is full or no ore available");
      return;
    }

    setResources((prev) =>
      prev.map((r) =>
        r.value === oreType && r.type === "ore"
          ? { ...r, amount: r.amount - oreToAdd }
          : r
      )
    );

    setStructures((prev) =>
      prev.map((s) =>
        s.id === structureId ? { ...s, currentOre: currentOre + oreToAdd } : s
      )
    );
  };

  // OTHER

  function setResource(
    name: string,
    materialType: "ore" | "alloy",
    amount: number
  ) {
    setResources((prevState) => {
      return prevState.map((e) => {
        if (e.type === materialType && e.value === name) {
          return { ...e, amount: amount };
        }
        return e;
      });
    });
  }

  function unlockResource(res: GameResource) {
    if (money < res.unlockedFor) return;
    setMoney(money - res.unlockedFor);
    setResources((prevState) => {
      return prevState.map((e) => {
        if (e.value === res.value && e.type === res.type)
          return { ...e, unlocked: true };
        return e;
      });
    });
    if (res.type === "ore") {
      const ores = resources.filter(
        (r) => r.type === "ore"
      ) as GameResourceOre[];
      if (ores.filter((o) => o.active).length < 3) {
        setResourceActiveState(res, true);
      }
    } else {
      const alloys = resources.filter(
        (r) => r.type === "alloy"
      ) as GameResourceAlloy[];
      if (alloys.filter((a) => a.active).length === 0) {
        setResourceActiveState(res, true);
      }
    }
  }

  function setResourceActiveState(res: GameResource, value: boolean) {
    setResources((prevState) => {
      return prevState.map((e) => {
        if (e.type === res.type && e.value === res.value) {
          return { ...e, active: value };
        }
        return e;
      });
    });
  }

  function setResourceIsDisplayedState(res: GameResource, value: boolean) {
    setResources((prevState) => {
      return prevState.map((e) => {
        if (e.type === res.type && e.value === res.value) {
          return { ...e, isDisplayed: value };
        }
        return e;
      });
    });
  }

  const contextValue: GameContext = {
    money,
    setMoney,
    resources,
    structures,
    sellAll,
    sellHalf,
    unlockResource,
    setResourceActiveState,
    setResourceIsDisplayedState,
    purchaseStructure,
    collectResources,
    refuelStructure,
    inputOre,
  };

  return (
    <GameContextInstance.Provider value={contextValue}>
      {children}
    </GameContextInstance.Provider>
  );
}

export function GameProvider({ children }: { children: ReactNode }) {
  return <GameContextComposer>{children}</GameContextComposer>;
}

export function useGame() {
  const context = useContext(GameContextInstance);
  if (!context) throw new Error("useGame must be used within GameProvider");
  return context;
}
