import { STRUCTURES } from "@/constants/structures";
import { formatNumber } from "@/helpers/helperFunctions";

interface StorageStructureProps {
  structure: GameStructure;
  hqLevel: number;
  money: number;
  onUpgrade: (id: string) => void;
}

function StorageStructure({
  structure,
  hqLevel,
  money,
  onUpgrade,
}: StorageStructureProps) {
  function calculateUpgradeCost(): number {
    const baseStructure = STRUCTURES.find((s) => s.id === structure.id);
    if (baseStructure && Array.isArray(baseStructure.cost)) {
      return baseStructure.cost[structure.level] || 0;
    }
    return 0;
  }

  const upgradeCost = calculateUpgradeCost();
  const canAfford = money >= upgradeCost;
  const isMaxLevel = structure.level >= structure.maxLevel[hqLevel - 1];

  return (
    <div className="structure-card structure-card--storage">
      <div className="structure-card__header">
        <h4 className="structure-card__name">{structure.name}</h4>
        <span className="structure-card__level">Level {structure.level}</span>
      </div>
      <div className="structure-card__content">
        <div className="storage-info">
          <p>
            Provides {structure.storageProvided?.[structure.level - 1]} storage
          </p>
        </div>

        {!isMaxLevel && (
          <div className="structure-card__upgrade">
            <button
              className="btn btn--upgrade-sm"
              onClick={() => onUpgrade(structure.id)}
              disabled={!canAfford}
            >
              Upgrade (${formatNumber(upgradeCost)})
            </button>
          </div>
        )}
        {isMaxLevel && <p className="structure-card__max-level">MAX LEVEL</p>}
      </div>
    </div>
  );
}

export default StorageStructure;
