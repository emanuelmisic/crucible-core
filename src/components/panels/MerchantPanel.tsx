import { useState } from "react";
import Image from "@/components/ui/Image";

interface MerchantPanelProps {
  ores: GameResourceOre[];
  alloys: GameResourceAlloy[];
  sellAll: (ore: GameResource) => void;
  sellHalf: (ore: GameResource) => void;
  unlockResource: (ore: GameResource) => void;
}

function MerchantPanel({
  ores,
  alloys,
  sellAll,
  sellHalf,
  unlockResource,
}: MerchantPanelProps) {
  const [selectedTab, setSelectedTab] = useState<"ores" | "alloys">("ores");
  function selectResources(res: "ores" | "alloys") {
    // TODO: set active tab class logic
    setSelectedTab(res);
  }
  return (
    <div className="panel merchant-panel">
      <div className="panel__header merchant-panel__header">
        <button onClick={() => selectResources("ores")}>Ores</button>
        <button onClick={() => selectResources("alloys")}>Alloys</button>
      </div>
      <div className="merchant-panel__item-container">
        {selectedTab === "ores" &&
          ores
            .filter((ore) => ore.unlocked)
            .map((ore) => (
              <div key={ore.name} className="item">
                <Image size={75} resource={ore} />
                <span className="item__price">${ore.sellingPrice}</span>
                <button onClick={() => sellHalf(ore)}>SELL HALF</button>
                <button onClick={() => sellAll(ore)}>SELL ALL</button>
              </div>
            ))}
        {selectedTab === "ores" &&
          ores
            .filter((ore) => !ore.unlocked)
            .map((ore) => (
              <div key={ore.name} className="item">
                <div className="item__empty">?</div>
                <span className="item__price">${ore.unlockedFor}</span>
                <button onClick={() => unlockResource(ore)}>DISCOVER</button>
              </div>
            ))[0]}
        {selectedTab === "alloys" &&
          alloys
            .filter((alloy) => alloy.unlocked)
            .map((alloy) => (
              <div key={alloy.name} className="item">
                <Image size={75} resource={alloy} />
                <span className="item__price">${alloy.sellingPrice}</span>
                <button onClick={() => sellHalf(alloy)}>SELL HALF</button>
                <button onClick={() => sellAll(alloy)}>SELL ALL</button>
              </div>
            ))}
        {selectedTab === "alloys" &&
          alloys
            .filter((alloy) => !alloy.unlocked)
            .map((alloy) => (
              <div key={alloy.name} className="item">
                <div className="item__empty">?</div>
                <span className="item__price">${alloy.unlockedFor}</span>
                <button onClick={() => unlockResource(alloy)}>DISCOVER</button>
              </div>
            ))[0]}
      </div>
    </div>
  );
}

export default MerchantPanel;
