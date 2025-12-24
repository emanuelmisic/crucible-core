import Image from "@/components/ui/image/ResourceImage";
import {
  calculateStructureUpgradeCost,
  formatNumber,
} from "@/helpers/helperFunctions";

interface MiningStructureProps {
  structure: GameStructure;
  hqLevel: number;
  money: number;
  onCollect: (id: string) => void;
  onUpgrade: (id: string) => void;
}

function MiningStructure({
  structure,
  hqLevel,
  money,
  onCollect,
  onUpgrade,
}: MiningStructureProps) {
  const upgradeCost = calculateStructureUpgradeCost(structure);
  const canAfford = money >= upgradeCost;
  const isMaxLevel = structure.level >= structure.maxLevel[hqLevel - 1];
  const canCollect = structure.accumulated >= 1;

  return (
    <div className="structure-card structure-card--mining">
      <div className="structure-card__header">
        <Image value={structure.resource} size={42} />
        <h4 className="structure-card__name">{structure.name}</h4>
        <span className="structure-card__level">Level {structure.level}</span>
      </div>

      <div className="structure-card__content">
        <span>Accumulated: {Math.floor(structure.accumulated)}</span>
        <div className="progress-bar">
          <div className={`progress-bar__fill`} style={{ width: `${10}%` }} />
        </div>
        <button
          className="btn btn--collect"
          onClick={() => onCollect(structure.id)}
          disabled={!canCollect}
        >
          Collect
        </button>
      </div>

      <div className="structure-card__actions">
        {!isMaxLevel && (
          <div className="structure-card__upgrade">
            <button
              className="btn btn--upgrade-sm"
              onClick={() => onUpgrade(structure.id)}
              disabled={!canAfford}
            >
              Upgrade (💲{formatNumber(upgradeCost)})
            </button>
          </div>
        )}
        {isMaxLevel && <p className="structure-card__max-level">MAX LEVEL</p>}
      </div>
    </div>
  );
}

export default MiningStructure;
