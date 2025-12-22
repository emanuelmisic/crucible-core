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
  const [miningPower, setMiningPower] = useState(1000000);
  const [smeltingPower, setSmeltingPower] = useState(1);
  const [resources, setResources] = useState<GameResource[]>(INITIAL_RESOURCES);
  const [structures, setStructures] = useState<GameStructure[]>(STRUCTURES);

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
    }, 100); // Tick every 100ms

    return () => clearInterval(interval);
  }, []); // Run once on mount

  // Generate resources function
  const generateResources = () => {
    const tickRate = 0.1; // 100ms = 0.1 seconds

    setStructures((prev) =>
      prev.map((structure) => {
        if (structure.level === 0) return structure; // Not owned

        // Handle MINING structures (simple generation, no fuel)
        if (structure.structureType === "mining") {
          const generated = structure.generationRate * tickRate;
          return {
            ...structure,
            accumulated: structure.accumulated + generated,
          };
        }

        // Handle SMELTING structures (fuel + ore consumption)
        if (structure.structureType === "smelting" && structure.recipe) {
          // Check 1: Does structure have fuel?
          if (!structure.currentFuel || structure.currentFuel <= 0) {
            return structure; // No fuel - stop generating
          }

          // Check 2: Does structure have ore in storage?
          const currentOre = structure.currentOre || 0;
          const oreNeeded = Object.values(structure.recipe)[0] || 0;

          if (currentOre < oreNeeded) {
            return structure; // Not enough ore in storage - stop generating
          }

          // All checks passed - generate resources and consume fuel + ore
          const generated = structure.generationRate * tickRate;
          const fuelConsumed = (structure.fuelConsumptionRate || 0) * tickRate;

          // Calculate new accumulated
          const newAccumulated = structure.accumulated + generated;

          // Check if we crossed a whole number (completed a unit)
          let newOreAmount = currentOre;
          if (Math.floor(newAccumulated) > Math.floor(structure.accumulated)) {
            // Consume ore from structure storage
            newOreAmount = Math.max(0, currentOre - oreNeeded);
          }

          // Update structure with new values
          return {
            ...structure,
            accumulated: newAccumulated,
            currentFuel: Math.max(0, structure.currentFuel - fuelConsumed),
            currentOre: newOreAmount,
          };
        }

        return structure; // Fallback (shouldn't reach here)
      })
    );
  };

  // Purchase a structure (deduct money, set level to 1)
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

    // Deduct money
    setMoney((prev) => prev - structure.cost);

    // Set structure to level 1 (active)
    setStructures((prev) =>
      prev.map((s) => (s.id === structureId ? { ...s, level: 1 } : s))
    );
  };

  // Collect accumulated resources from a structure
  const collectResources = (structureId: string) => {
    const structure = structures.find((s) => s.id === structureId);
    if (!structure || structure.accumulated < 1) return;

    // Add accumulated resources to inventory
    const amount = Math.floor(structure.accumulated);
    setResources((prev) => {
      const existingResource = prev.find(
        (r) => r.value === structure.resourceType
      );
      if (existingResource) {
        return prev.map((r) =>
          r.value === structure.resourceType
            ? { ...r, amount: r.amount + amount }
            : r
        );
      }
      return prev;
    });

    // Reset accumulated to 0
    setStructures((prev) =>
      prev.map((s) => (s.id === structureId ? { ...s, accumulated: 0 } : s))
    );
  };

  // Refuel a structure directly with money
  const refuelStructure = (structureId: string, amount: number) => {
    const structure = structures.find((s) => s.id === structureId);
    if (!structure || structure.structureType !== "smelting") {
      console.warn("Structure not found or is not a smelting structure");
      return;
    }

    // Calculate how much fuel we can actually add (respect capacity)
    const currentFuel = structure.currentFuel || 0;
    const capacity = structure.fuelCapacity || 0;
    const spaceAvailable = capacity - currentFuel;
    const fuelToAdd = Math.min(amount, spaceAvailable);

    if (fuelToAdd <= 0) {
      console.warn("Structure fuel tank is full");
      return;
    }

    // Calculate cost
    const totalCost = fuelToAdd * FUEL_COST_PER_UNIT;

    // Check if player has enough money
    if (money < totalCost) {
      console.warn("Not enough money to refuel");
      return;
    }

    // Deduct money and add fuel to structure (single atomic operation)
    setMoney((prev) => prev - totalCost);
    setStructures((prev) =>
      prev.map((s) =>
        s.id === structureId
          ? { ...s, currentFuel: currentFuel + fuelToAdd }
          : s
      )
    );
  };

  // Input ore into a structure from inventory
  const inputOre = (structureId: string, amount: number) => {
    const structure = structures.find((s) => s.id === structureId);
    if (!structure || structure.structureType !== "smelting") {
      console.warn("Structure not found or is not a smelting structure");
      return;
    }

    // Determine which ore type this smelter needs
    if (!structure.recipe) {
      console.warn("Structure has no recipe");
      return;
    }

    // Get the ore type from the recipe (first key)
    const oreType = Object.keys(structure.recipe)[0];
    if (!oreType) {
      console.warn("No ore type found in recipe");
      return;
    }

    // Find the ore resource in inventory
    const oreResource = resources.find(
      (r) => r.value === oreType && r.type === "ore"
    );

    if (!oreResource || oreResource.amount <= 0) {
      console.warn("Not enough ore in inventory");
      return;
    }

    // Calculate how much ore we can actually add (respect capacity and inventory)
    const currentOre = structure.currentOre || 0;
    const capacity = structure.oreCapacity || 0;
    const spaceAvailable = capacity - currentOre;
    const oreToAdd = Math.min(amount, spaceAvailable, oreResource.amount);

    if (oreToAdd <= 0) {
      console.warn("Structure ore storage is full or no ore available");
      return;
    }

    // Deduct ore from inventory and add to structure
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
    miningPower,
    smeltingPower,
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
