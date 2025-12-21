import React from "react";
import { useGame } from "@/contexts/GameContext";
import { formatNumber } from "@/helpers/helperFunctions";

function StructuresPanel() {
  const { structures, money, purchaseStructure, collectResources } = useGame();

  // Group structures by ownership for better UX
  const ownedStructures = structures.filter((s) => s.level > 0);
  const availableStructures = structures.filter((s) => s.level === 0);

  return (
    <div className="panel structures-panel">
      <div className="panel__header">
        <h2>Mining Structures</h2>
      </div>

      {/* Show owned structures first */}
      {ownedStructures.length > 0 && (
        <div className="structures-section">
          <h3 className="structures-section__title">Active Drills</h3>
          <div className="structures-grid">
            {ownedStructures.map((structure) => (
              <StructureCard
                key={structure.id}
                structure={structure}
                isOwned={true}
                onCollect={collectResources}
              />
            ))}
          </div>
        </div>
      )}

      {/* Show available structures to purchase */}
      {availableStructures.length > 0 && (
        <div className="structures-section">
          <h3 className="structures-section__title">Available for Purchase</h3>
          <div className="structures-grid">
            {availableStructures.map((structure) => (
              <StructureCard
                key={structure.id}
                structure={structure}
                isOwned={false}
                money={money}
                onPurchase={purchaseStructure}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Helper component for cleaner code
interface StructureCardProps {
  structure: GameStructure;
  isOwned: boolean;
  money?: number;
  onPurchase?: (id: string) => void;
  onCollect?: (id: string) => void;
}

const StructureCard: React.FC<StructureCardProps> = ({
  structure,
  isOwned,
  money,
  onPurchase,
  onCollect,
}) => {
  const canAfford = money !== undefined && money >= structure.cost;
  const canCollect = structure.accumulated >= 1;

  return (
    <div className={`structure-card ${isOwned ? "structure-card--owned" : ""}`}>
      <div className="structure-card__header">
        <h4 className="structure-card__name">{structure.name}</h4>
        <p className="structure-card__info">
          Generates {structure.generationRate}/s {structure.resourceType}
        </p>
      </div>

      {isOwned ? (
        <div className="structure-card__content">
          <p className="structure-card__status">
            Status:{" "}
            <span className="status--active">
              Active (Level {structure.level})
            </span>
          </p>
          <p className="structure-card__accumulated">
            Accumulated: <strong>{structure.accumulated.toFixed(2)}</strong>{" "}
            {structure.resourceType}
          </p>
          <button
            className="btn btn--collect"
            onClick={() => onCollect?.(structure.id)}
            disabled={!canCollect}
          >
            {canCollect
              ? `Collect ${Math.floor(structure.accumulated)} ${
                  structure.resourceType
                }`
              : "Not enough to collect"}
          </button>
        </div>
      ) : (
        <div className="structure-card__content">
          <button
            className="btn btn--purchase"
            onClick={() => onPurchase?.(structure.id)}
            disabled={!canAfford}
          >
            Purchase for ${formatNumber(structure.cost)}
          </button>
        </div>
      )}
    </div>
  );
};

export default StructuresPanel;
