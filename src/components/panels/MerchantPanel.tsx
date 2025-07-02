import { useState } from "react";
import { useGame } from "@/contexts/GameContext";
import Image from "@/components/ui/Image";

function MerchantPanel({ isVisible }: { isVisible: boolean }) {
  const game = useGame();
  const [selectedTab, setSelectedTab] = useState<"ore" | "alloy">("ore");

  function selectResources(res: "ore" | "alloy") {
    // TODO: set active tab class logic
    setSelectedTab(res);
  }

  return (
    <div
      className="panel merchant-panel"
      style={{ display: isVisible ? "block" : "none" }}
    >
      <div className="panel__header merchant-panel__header">
        <button onClick={() => selectResources("ore")}>Ores</button>
        <button onClick={() => selectResources("alloy")}>Alloys</button>
      </div>
      <div className="merchant-panel__item-container">
        {game.resources
          .filter((res) => res.type === selectedTab && res.unlocked)
          .map((res) => (
            <div key={res.name} className="item">
              <Image size={75} resource={res} />
              <span className="item__price">${res.sellingPrice}</span>
              <button onClick={() => game.sellHalf(res)}>SELL HALF</button>
              <button onClick={() => game.sellAll(res)}>SELL ALL</button>
            </div>
          ))}
        {
          game.resources
            .filter((res) => res.type === selectedTab && !res.unlocked)
            .map((res) => (
              <div key={res.name} className="item">
                <div className="item__empty">?</div>
                <span className="item__price">${res.unlockedFor}</span>
                <button onClick={() => game.unlockResource(res)}>
                  DISCOVER
                </button>
              </div>
            ))[0]
        }
      </div>
    </div>
  );
}

export default MerchantPanel;
