import { useEffect, useState } from "react";
import { useGame } from "@/contexts/GameContext";
import { formatNumber } from "@/helpers/helperFunctions";
import Image from "@/components/ui/Image";
import TabBtn from "@/components/ui/TabBtn";

interface Powers {
  mining: number;
  smelting: number;
  storage: number;
}
type VendorTab = "mine" | "fuel" | "storage";

function VendorPanel({ isVisible }: { isVisible: boolean }) {
  const game = useGame();
  const [powers, setPowers] = useState<Powers>({
    mining: game.miningPower,
    smelting: game.smeltingPower,
    storage: game.storage,
  });
  const [selectedTab, setSelectedTab] = useState<VendorTab>("mine");

  function displayPower() {
    switch (selectedTab) {
      case "mine":
        return `Mining power: ${formatNumber(powers.mining)}`;
      case "fuel":
        return `Smelting power: ${formatNumber(powers.smelting)}`;
      case "storage":
        return `Storage: ${formatNumber(powers.storage)}`;
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
    <div
      className="panel vendor-panel"
      style={{ display: isVisible ? "block" : "none" }}
    >
      <div className="panel__header vendor-panel__header">
        <TabBtn
          isSelected={selectedTab === "mine"}
          onClick={() => setSelectedTab("mine")}
        >
          Mining tools
        </TabBtn>
        <TabBtn
          isSelected={selectedTab === "fuel"}
          onClick={() => setSelectedTab("fuel")}
        >
          Fuel
        </TabBtn>
        <TabBtn
          isSelected={selectedTab === "storage"}
          onClick={() => setSelectedTab("storage")}
        >
          Storage
        </TabBtn>
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
                <span className="item__price">
                  ${formatNumber(upgrade.cost)}
                </span>
                <button onClick={() => game.unlockUpgrade(upgrade)}>
                  BUY ({formatNumber(game.miningPower)} =&gt;{" "}
                  {formatNumber(upgrade.power)})
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
