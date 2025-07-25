import { createContext, useContext, useState, type ReactNode } from "react";
import {
  INITIAL_MINING_PROGRESS,
  INITIAL_RESOURCES,
  INITIAL_SMELTING_PROGRESS,
} from "@/constants/resources";
import { INITIAL_UPGRADES } from "@/constants/upgrades";

const GameContext = createContext<GameContext | undefined>(undefined);

function GameContextComposer({ children }: { children: ReactNode }) {
  const [money, setMoney] = useState(5000);
  const [storage, setStorage] = useState(100000000);
  const [miningPower, setMiningPower] = useState(1000000);
  const [smeltingPower, setSmeltingPower] = useState(1);
  const [resources, setResources] = useState<GameResource[]>(INITIAL_RESOURCES);
  const [upgrades, setUpgrades] = useState<GameUpgrade[]>(INITIAL_UPGRADES);

  const [miningProgress, setMiningProgress] = useState<{
    [key: string]: number;
  }>(INITIAL_MINING_PROGRESS);
  const [smeltingProgress, setSmeltingProgress] = useState<{
    [key: string]: number;
  }>(INITIAL_SMELTING_PROGRESS);

  //   MINING LOGIC

  function mineOre(ore: GameResourceOre) {
    if (ore.amount >= storage) return;
    let newMiningProgress = 0;
    if (miningProgress[ore.value] < ore.miningHardness) {
      _addOreMiningProgress(ore.value);
      newMiningProgress = miningProgress[ore.value] + miningPower;
    }
    _handleOreMiningStep(ore, newMiningProgress);
  }

  function _handleOreMiningStep(
    ore: GameResourceOre,
    newMiningProgress: number
  ) {
    if (newMiningProgress < ore.miningHardness) return;
    if (miningPower > ore.miningHardness) {
      const amountToMine = Math.floor(miningPower / ore.miningHardness);
      addResource(ore.value, "ore", amountToMine);
    } else {
      addResource(ore.value, "ore", 1);
    }
    _resetOreMiningProgress(ore.value);
  }

  function _addOreMiningProgress(ore: string) {
    setMiningProgress((prevState) => {
      return { ...prevState, [ore]: miningProgress[ore] + miningPower };
    });
  }

  function _resetOreMiningProgress(ore: string) {
    setMiningProgress((prevState) => {
      return { ...prevState, [ore]: 0 };
    });
  }

  // SMELTING LOGIC

  function smeltAlloy(alloy: GameResourceAlloy) {
    if (!_isSmeltable(alloy.smeltingRecipe)) return;
    let newSmeltingProgress = 0;
    if (smeltingProgress[alloy.value] < alloy.smeltingDifficulty) {
      _addAlloySmeltingProgress(alloy.value);
      newSmeltingProgress = smeltingProgress[alloy.value] + smeltingPower;
    }
    _handleSmeltingStep(alloy, newSmeltingProgress);
  }

  function _handleSmeltingStep(
    alloy: GameResourceAlloy,
    newSmeltingProgress: number
  ) {
    if (newSmeltingProgress < alloy.smeltingDifficulty) return;
    _turnOresToAlloy(alloy);
    _resetAlloySmeltingProgress(alloy.value);
  }

  function _addAlloySmeltingProgress(alloy: string) {
    setSmeltingProgress((prevState) => {
      return { ...prevState, [alloy]: prevState[alloy] + smeltingPower };
    });
  }

  function _resetAlloySmeltingProgress(alloy: string) {
    setSmeltingProgress((prevState) => {
      return { ...prevState, [alloy]: 0 };
    });
  }

  function _isSmeltable(recipe: { [key: string]: number }): boolean {
    const ores = resources.filter((r) => r.type === "ore") as GameResourceOre[];
    for (const k in ores) {
      if (!recipe[ores[k].value]) continue;
      if (ores[k].amount < recipe[ores[k].value]) {
        return false;
      }
    }
    return true;
  }

  function _turnOresToAlloy(alloy: GameResourceAlloy) {
    const ores = resources.filter((r) => r.type === "ore") as GameResourceOre[];
    const recipe = alloy.smeltingRecipe;
    for (const k in ores) {
      if (!recipe[ores[k].value]) continue;
      setResource(
        ores[k].value,
        ores[k].type,
        ores[k].amount - recipe[ores[k].value]
      );
    }
    addResource(alloy.value, alloy.type, 1);
  }

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

  // OTHER

  function addResource(
    name: string,
    materialType: "ore" | "alloy",
    amount: number
  ) {
    setResources((prevState) => {
      return prevState.map((e) => {
        if (e.type === materialType && e.value === name) {
          return { ...e, amount: e.amount + amount };
        }
        return e;
      });
    });
  }

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

  function unlockUpgrade(tool: GameUpgrade) {
    if (money < tool.cost) return;
    setMoney(money - tool.cost);

    setUpgrades((prevState) => {
      return prevState.map((e) => {
        if (e.value === tool.value) return { ...e, unlocked: true };
        return e;
      });
    });

    switch (tool.type) {
      case "mine":
        setMiningPower(tool.power);
        break;
      case "fuel":
        setSmeltingPower(tool.power);
        break;
      case "storage":
        setStorage(tool.power);
        break;
    }
  }

  const contextValue: GameContext = {
    money,
    setMoney,
    resources,
    upgrades,
    miningProgress,
    smeltingProgress,
    mineOre,
    smeltAlloy,
    miningPower,
    smeltingPower,
    storage,
    sellAll,
    sellHalf,
    unlockResource,
    unlockUpgrade,
    setResourceActiveState,
    setResourceIsDisplayedState,
  };

  return (
    <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>
  );
}

export function GameProvider({ children }: { children: ReactNode }) {
  return <GameContextComposer>{children}</GameContextComposer>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used within GameProvider");
  return context;
}
