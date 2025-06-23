import { useGame } from "@/contexts/GameContext";
import { useState } from "react";

type VendorTab = "mine" | "fuel" | "storage";

function VendorPanel() {
  const game = useGame();
  const [selectedTab, setSelectedTab] = useState<VendorTab>("mine");

  function selectUpgrades(type: VendorTab) {
    // active class logic
    setSelectedTab(type);
  }

  return (
    <div className="panel vendor-panel">
      <div className="panel__header vendor-panel__header">
        <button onClick={() => selectUpgrades("mine")}>Mining tools</button>
        <button onClick={() => selectUpgrades("fuel")}>Fuel</button>
        <button onClick={() => selectUpgrades("storage")}>Storage</button>
      </div>
      <div className="vendor-panel__item-container">
        {game.upgrades
          .filter((u) => u.type === selectedTab && u.unlocked)
          .map((upgrade) => (
            <div className="item item__bought">
              <span>{upgrade.name}</span>
              <button>BOUGHT</button>
            </div>
          ))}
        {game.upgrades
          .filter((u) => u.type === selectedTab)
          .map((upgrade) => (
            <div className="item">
              <span>{upgrade.name}</span>
              <span className="item__price">${upgrade.cost}</span>
              <button>BUY</button>
            </div>
          ))}
      </div>
    </div>
  );
}

export default VendorPanel;
