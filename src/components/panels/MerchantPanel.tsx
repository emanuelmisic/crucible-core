import { useState } from "react";
import { useGame } from "@/contexts/GameContext";
import Image from "@/components/ui/Image";
import TabBtn from "@/components/ui/TabBtn";
import Dialog from "@/components/ui/Dialog";

interface MerchantPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

function MerchantPanel({ isOpen, onClose }: MerchantPanelProps) {
  const game = useGame();
  const [selectedTab, setSelectedTab] = useState<"ore" | "alloy">("ore");

  return (
    <Dialog
      title="Merchant"
      isOpen={isOpen}
      closeDialog={onClose}
      width="40rem"
    >
      <div className="merchant-panel">
        <div className="panel__header merchant-panel__header">
          <TabBtn
            textDark
            isSelected={selectedTab === "ore"}
            onClick={() => setSelectedTab("ore")}
          >
            Ores
          </TabBtn>
          <TabBtn
            textDark
            isSelected={selectedTab === "alloy"}
            onClick={() => setSelectedTab("alloy")}
          >
            Alloys
          </TabBtn>
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
    </Dialog>
  );
}

export default MerchantPanel;
