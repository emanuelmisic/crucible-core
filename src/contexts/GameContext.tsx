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

  // Game loop - ticks every 100ms
  useEffect(() => {
    const interval = setInterval(() => {
      generateResources();
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // STORAGE LOGIC

  function calculateStorageCapacity(resourceType: string): number {
    const initialResource = INITIAL_RESOURCES.find(
      (r) => r.value === resourceType
    );
    const baseCapacity = initialResource?.storageCapacity || 0;

    const bonusCapacity = structures
      .filter((s) => s.structureType === "storage" && s.level > 0)
      .reduce((total, structure) => {
        const providedValue = structure.storageProvided?.[resourceType];
        let providedCapacity = 0;

        if (Array.isArray(providedValue)) {
          providedCapacity = providedValue[structure.level - 1] || 0;
        } else if (typeof providedValue === "number") {
          providedCapacity = providedValue;
        }

        return total + providedCapacity;
      }, 0);

    return baseCapacity + bonusCapacity;
  }

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

  function generateResources() {
    const tickRate = 0.1;

    setStructures((prev) =>
      prev.map((structure) => {
        if (structure.level === 0) return structure;

        if (structure.structureType === "mining") {
          const generationRate = Array.isArray(structure.generationRate)
            ? structure.generationRate[structure.level - 1] || 0
            : structure.generationRate;

          const generated = generationRate * tickRate;
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

          const generationRate = Array.isArray(structure.generationRate)
            ? structure.generationRate[structure.level - 1] || 0
            : structure.generationRate;

          const fuelConsumptionRate = Array.isArray(
            structure.fuelConsumptionRate
          )
            ? structure.fuelConsumptionRate[structure.level - 1] || 0
            : structure.fuelConsumptionRate || 0;

          const generated = generationRate * tickRate;
          const fuelConsumed = fuelConsumptionRate * tickRate;

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
  }

  function purchaseStructure(structureId: string) {
    const structure = structures.find((s) => s.id === structureId);
    if (!structure) return;

    if (structure.level > 0) {
      console.warn("Structure already owned");
      return;
    }

    const purchaseCost = Array.isArray(structure.cost)
      ? structure.cost[0]
      : structure.cost;

    if (money < purchaseCost) {
      console.warn("Not enough money");
      return;
    }

    setMoney((prev) => prev - purchaseCost);

    setStructures((prev) =>
      prev.map((s) => (s.id === structureId ? { ...s, level: 1 } : s))
    );
  }

  function collectResources(structureId: string) {
    const structure = structures.find((s) => s.id === structureId);
    if (!structure || structure.accumulated < 1) return;

    const amountToCollect = Math.floor(structure.accumulated);

    const resourceType = structure.structureType === "mining" ? "ore" : "alloy";
    const resource = resources.find(
      (r) => r.value === structure.resource && r.type === resourceType
    );
    if (!resource) return;

    const spaceAvailable = resource.storageCapacity - resource.amount;
    const actualCollected = Math.min(amountToCollect, spaceAvailable);

    if (actualCollected <= 0) {
      console.warn("Storage is full - cannot collect resources");
      return;
    }

    setResources((prev) =>
      prev.map((r) =>
        r.value === structure.resource && r.type === resourceType
          ? { ...r, amount: r.amount + actualCollected }
          : r
      )
    );

    setStructures((prev) =>
      prev.map((s) =>
        s.id === structureId
          ? { ...s, accumulated: s.accumulated - actualCollected }
          : s
      )
    );
  }

  function refuelStructure(structureId: string, amount: number) {
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
  }

  function inputOre(structureId: string, amount: number) {
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
  }

  // HQ AND UPGRADE LOGIC

  function getHQLevel(): number {
    const hq = structures.find((s) => s.structureType === "hq");
    return hq?.level || 1;
  }

  function calculateUpgradeCost(structure: GameStructure): number {
    if (structure.structureType === "hq") {
      if (structure.level === 1) return 2000;
      return 0;
    } else {
      const baseStructure = STRUCTURES.find((s) => s.id === structure.id);
      if (baseStructure && Array.isArray(baseStructure.cost)) {
        return baseStructure.cost[structure.level] || 0;
      }
      return 0;
    }
  }

  function calculateMaxLevel(structureType: string, hqLevel: number): number {
    if (structureType === "hq") return 2;
    let maxLevel = 5;
    if (hqLevel >= 2) maxLevel += 2;
    return maxLevel;
  }

  function upgradeStructure(structureId: string) {
    const structure = structures.find((s) => s.id === structureId);

    if (!structure) return;
    if (structure.level >= (structure.maxLevel || 5)) {
      console.warn("Structure is already at max level");
      return;
    }

    const upgradeCost = calculateUpgradeCost(structure);
    const resourceCosts = structure.upgradeResourceCost || {};

    if (money < upgradeCost) {
      console.warn("Not enough money to upgrade");
      return;
    }

    for (const [resourceId, amount] of Object.entries(resourceCosts)) {
      const resource = resources.find((r) => r.value === resourceId);
      if (!resource || resource.amount < amount) {
        console.warn(`Not enough ${resourceId} to upgrade`);
        return;
      }
    }

    setMoney((prev) => prev - upgradeCost);

    setResources((prev) =>
      prev.map((r) => {
        const cost = resourceCosts[r.value];
        if (cost) {
          return { ...r, amount: r.amount - cost };
        }
        return r;
      })
    );

    setStructures((prev) =>
      prev.map((s) => {
        if (s.id !== structureId) return s;

        const newLevel = s.level + 1;
        const baseStructure = STRUCTURES.find((base) => base.id === s.id);
        if (!baseStructure) return s;

        const newStats: Partial<GameStructure> = {};

        if (s.structureType === "mining") {
          if (Array.isArray(baseStructure.generationRate)) {
            newStats.generationRate = baseStructure.generationRate[newLevel - 1];
          }
        } else if (s.structureType === "smelting") {
          if (Array.isArray(baseStructure.generationRate)) {
            newStats.generationRate = baseStructure.generationRate[newLevel - 1];
          }
          if (Array.isArray(baseStructure.fuelConsumptionRate)) {
            newStats.fuelConsumptionRate =
              baseStructure.fuelConsumptionRate[newLevel - 1];
          }
        } else if (s.structureType === "storage") {
          if (baseStructure.storageProvided) {
            const newStorageProvided: { [resource: string]: number } = {};
            for (const [resource, values] of Object.entries(
              baseStructure.storageProvided
            )) {
              if (Array.isArray(values)) {
                newStorageProvided[resource] = values[newLevel - 1];
              }
            }
            newStats.storageProvided = newStorageProvided;
          }
        }

        return {
          ...s,
          level: newLevel,
          upgradeCost: calculateUpgradeCost({ ...s, level: newLevel }),
          ...newStats,
        };
      })
    );
  }

  function updateUnlocks() {
    const hqLevel = getHQLevel();

    setStructures((prev) =>
      prev.map((structure) => {
        const unlockRequirements: { [key: string]: number } = {
          basic_iron_drill: 1,
          basic_warehouse: 1,
          basic_bronze_drill: 2,
          basic_silver_drill: 2,
          basic_iron_smelter: 2,
        };

        const requiredLevel = unlockRequirements[structure.id] || 1;
        const isUnlocked = hqLevel >= requiredLevel;

        const newMaxLevel = calculateMaxLevel(structure.structureType, hqLevel);

        return {
          ...structure,
          unlocked: structure.structureType === "hq" ? true : isUnlocked,
          maxLevel: newMaxLevel,
        };
      })
    );

    setResources((prev) =>
      prev.map((resource) => {
        const resourceUnlockRequirements: { [key: string]: number } = {
          iron: 1,
          "iron alloy": 2,
          bronze: 2,
          silver: 2,
        };

        const requiredLevel = resourceUnlockRequirements[resource.value] || 1;
        const isUnlocked = hqLevel >= requiredLevel;

        return {
          ...resource,
          unlocked: isUnlocked,
          isDisplayed: isUnlocked,
        };
      })
    );
  }

  useEffect(() => {
    updateUnlocks();
  }, [structures.find((s) => s.structureType === "hq")?.level]);

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
    upgradeStructure,
    getHQLevel,
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
