import { useGame } from "@/contexts/GameContext";
import { useEffect, useState } from "react";
import Image from "@/components/ui/Image";

interface Powers {
  mining: number;
  smelting: number;
  storage: number;
}
type VendorTab = "mine" | "fuel" | "storage";

function VendorPanel({isVisible}: { isVisible: boolean }) {
  const game = useGame();
  const [powers, setPowers] = useState<Powers>({
    mining: game.miningPower,
    smelting: game.smeltingPower,
    storage: game.storage,
  });
  const [selectedTab, setSelectedTab] = useState<VendorTab>("mine");

  function selectUpgrades(type: VendorTab) {
    // active class logic
    setSelectedTab(type);
  }

  function displayPower() {
    switch (selectedTab) {
      case "mine":
        return `Mining power: ${powers.mining}`;
      case "fuel":
        return `Smelting power: ${powers.smelting}`;
      case "storage":
        return `Storage: ${powers.storage}`;
      default:
        return "";
    }
  }

  useEffect(() => {
    setPowers({
      mining: game.miningPower,
      smelting: game.smeltingPower,
      storage: game.storage,
    });
  }, [game.miningPower, game.smeltingPower, game.storage]);

  return (
    <div className="panel vendor-panel" style={{ display: isVisible ? "block" : "none" }}>
      <div className="panel__header vendor-panel__header">
        <button onClick={() => selectUpgrades("mine")}>Mining tools</button>
        <button onClick={() => selectUpgrades("fuel")}>Fuel</button>
        <button onClick={() => selectUpgrades("storage")}>Storage</button>
        <div className="power">{displayPower()}</div>
      </div>
      <div className="vendor-panel__item-container">
        {game.upgrades
          .filter((u) => u.type === selectedTab && u.unlocked)
          .map((upgrade) => (
            <div className="item item__bought">
              <span>{upgrade.name}</span>
              <Image resource={upgrade} size={75} />
              <button>BOUGHT</button>
            </div>
          ))}
        {
          game.upgrades
            .filter((u) => u.type === selectedTab && !u.unlocked)
            .map((upgrade) => (
              <div className="item">
                <span>{upgrade.name}</span>
                <Image resource={upgrade} size={75} />
                <span className="item__price">${upgrade.cost}</span>
                <button onClick={() => game.unlockUpgrade(upgrade)}>
                  BUY ({game.miningPower} =&gt; {upgrade.power})
                </button>
              </div>
            ))[0]
        }
        {game.upgrades.filter((u) => u.type === selectedTab && !u.unlocked)
          .length > 0 && <div className="item item__empty">?</div>}
      </div>
    </div>
  );
}

export default VendorPanel;
