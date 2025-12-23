import { useState } from "react";
import { useGame } from "@/contexts/GameContext";
import {
  formatNumber,
  getStructureResourceType,
} from "@/helpers/helperFunctions";
import TabBtn from "@/components/ui/TabBtn";
import Dialog from "@/components/ui/Dialog";
import ResourceImage from "@/components/ui/image/ResourceImage";

type VendorTab = "mining" | "smelting" | "storage";

interface VendorPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

function VendorPanel({ isOpen, onClose }: VendorPanelProps) {
  const game = useGame();
  const [selectedTab, setSelectedTab] = useState<VendorTab>("mining");

  return (
    <Dialog title="Vendor" isOpen={isOpen} closeDialog={onClose} width="40rem">
      <div className="vendor-panel">
        <div className="panel__header vendor-panel__header">
          <TabBtn
            isSelected={selectedTab === "mining"}
            onClick={() => setSelectedTab("mining")}
          >
            Mining
          </TabBtn>
          <TabBtn
            isSelected={selectedTab === "smelting"}
            onClick={() => setSelectedTab("smelting")}
          >
            Smelting
          </TabBtn>
          <TabBtn
            isSelected={selectedTab === "storage"}
            onClick={() => setSelectedTab("storage")}
          >
            Storage
          </TabBtn>
        </div>

        <div className="vendor-panel__item-container">
          {selectedTab === "mining" && (
            <>
              {game.structures
                .filter((s) => s.structureType === "mining")
                .map((structure) => (
                  <StructureItem
                    key={structure.id}
                    structure={structure}
                    money={game.money}
                    hqLevel={game.getHQLevel()}
                    onPurchase={game.purchaseStructure}
                  />
                ))}
            </>
          )}

          {selectedTab === "smelting" && (
            <>
              {game.structures
                .filter((s) => s.structureType === "smelting")
                .map((structure) => (
                  <StructureItem
                    key={structure.id}
                    structure={structure}
                    money={game.money}
                    hqLevel={game.getHQLevel()}
                    onPurchase={game.purchaseStructure}
                  />
                ))}
            </>
          )}

          {selectedTab === "storage" && (
            <>
              {game.structures
                .filter((s) => s.structureType === "storage")
                .map((structure) => (
                  <StructureItem
                    key={structure.id}
                    structure={structure}
                    money={game.money}
                    hqLevel={game.getHQLevel()}
                    onPurchase={game.purchaseStructure}
                  />
                ))}
            </>
          )}
        </div>
      </div>
    </Dialog>
  );
}

interface StructureItemProps {
  structure: GameStructure;
  money: number;
  hqLevel: number;
  onPurchase: (id: string) => void;
}

const StructureItem: React.FC<StructureItemProps> = ({
  structure,
  money,
  hqLevel,
  onPurchase,
}) => {
  const isOwned = structure.level > 0;
  const canAfford = money >= structure.cost[hqLevel - 1];

  return (
    <div className={`item ${isOwned ? "item__bought" : ""}`}>
      <span className="item__name">{structure.name}</span>
      <div className="item__details">
        <div>
          +
          <ResourceImage
            type={getStructureResourceType(structure.structureType) ?? "ore"}
            value={structure.resource ?? ""}
          />
        </div>
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
          <button
            className="btn"
            onClick={() => onPurchase(structure.id)}
            disabled={!canAfford}
          >
            ${formatNumber(structure.cost[hqLevel - 1])}
          </button>
        </>
      )}
    </div>
  );
};

export default VendorPanel;
