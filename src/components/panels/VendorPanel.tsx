import { useState } from "react";
import { useGame } from "@/contexts/GameContext";
import { formatNumber } from "@/helpers/helperFunctions";
import Image from "@/components/ui/Image";
import TabBtn from "@/components/ui/TabBtn";

type VendorTab = "structures" | "mine" | "fuel" | "storage";

function VendorPanel({ isVisible }: { isVisible: boolean }) {
  const game = useGame();
  const [selectedTab, setSelectedTab] = useState<VendorTab>("structures");

  return (
    <div
      className="panel vendor-panel"
      style={{ display: isVisible ? "block" : "none" }}
    >
      <div className="panel__header vendor-panel__header">
        <TabBtn
          isSelected={selectedTab === "structures"}
          onClick={() => setSelectedTab("structures")}
        >
          Structures
        </TabBtn>
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
      </div>

      <div className="vendor-panel__item-container">
        {/* Structures Tab */}
        {selectedTab === "structures" && (
          <>
            <div className="vendor-section">
              <h3 className="vendor-section__title">Mining Drills</h3>
              {game.structures
                .filter((s) => s.structureType === "mining")
                .map((structure) => (
                  <StructureItem
                    key={structure.id}
                    structure={structure}
                    money={game.money}
                    onPurchase={game.purchaseStructure}
                  />
                ))}
            </div>

            <div className="vendor-section">
              <h3 className="vendor-section__title">Smelters</h3>
              {game.structures
                .filter((s) => s.structureType === "smelting")
                .map((structure) => (
                  <StructureItem
                    key={structure.id}
                    structure={structure}
                    money={game.money}
                    onPurchase={game.purchaseStructure}
                  />
                ))}
            </div>
          </>
        )}

        {/* Fuel Tab - Keep existing upgrades only */}
        {selectedTab === "fuel" && (
          <div className="vendor-section">
            <h3 className="vendor-section__title">Fuel Efficiency Upgrades</h3>
            <p className="vendor-section__description">
              Refuel your smelters directly from the Structures panel. These
              upgrades may reduce fuel consumption or improve smelting
              efficiency.
            </p>

            {game.upgrades
              .filter((u) => u.type === "fuel" && u.unlocked)
              .map((upgrade) => (
                <div className="item item__bought" key={upgrade.value}>
                  <span>{upgrade.name}</span>
                  <Image resource={upgrade} size={75} />
                  <button>BOUGHT</button>
                </div>
              ))}
            {
              game.upgrades
                .filter((u) => u.type === "fuel" && !u.unlocked)
                .map((upgrade) => (
                  <div className="item" key={upgrade.value}>
                    <span>{upgrade.name}</span>
                    <Image resource={upgrade} size={75} />
                    <span className="item__price">
                      ${formatNumber(upgrade.cost)}
                    </span>
                    <button onClick={() => game.unlockUpgrade(upgrade)}>
                      BUY
                    </button>
                  </div>
                ))[0]
            }
          </div>
        )}

        {/* Mining and Storage tabs - unchanged */}
        {(selectedTab === "mine" || selectedTab === "storage") && (
          <>
            {game.upgrades
              .filter((u) => u.type === selectedTab && u.unlocked)
              .map((upgrade) => (
                <div className="item item__bought" key={upgrade.value}>
                  <span>{upgrade.name}</span>
                  <Image resource={upgrade} size={75} />
                  <button>BOUGHT</button>
                </div>
              ))}
            {
              game.upgrades
                .filter((u) => u.type === selectedTab && !u.unlocked)
                .map((upgrade) => (
                  <div className="item" key={upgrade.value}>
                    <span>{upgrade.name}</span>
                    <Image resource={upgrade} size={75} />
                    <span className="item__price">
                      ${formatNumber(upgrade.cost)}
                    </span>
                    <button onClick={() => game.unlockUpgrade(upgrade)}>
                      BUY
                    </button>
                  </div>
                ))[0]
            }
          </>
        )}
      </div>
    </div>
  );
}

// Structure item component
interface StructureItemProps {
  structure: GameStructure;
  money: number;
  onPurchase: (id: string) => void;
}

const StructureItem: React.FC<StructureItemProps> = ({
  structure,
  money,
  onPurchase,
}) => {
  const isOwned = structure.level > 0;
  const canAfford = money >= structure.cost;

  return (
    <div className={`item ${isOwned ? "item__bought" : ""}`}>
      <span className="item__name">{structure.name}</span>
      <div className="item__details">
        <p className="item__stat">
          Output: {structure.generationRate}/s {structure.resourceType}
        </p>
        {structure.recipe && (
          <p className="item__stat item__recipe">
            Consumes:{" "}
            {Object.entries(structure.recipe)
              .map(([res, amt]) => `${amt} ${res}`)
              .join(", ")}
          </p>
        )}
      </div>

      {isOwned ? (
        <button className="btn" disabled>
          OWNED
        </button>
      ) : (
        <>
          <span className="item__price">${formatNumber(structure.cost)}</span>
          <button
            className="btn btn--purchase"
            onClick={() => onPurchase(structure.id)}
            disabled={!canAfford}
          >
            BUY
          </button>
        </>
      )}
    </div>
  );
};

export default VendorPanel;
