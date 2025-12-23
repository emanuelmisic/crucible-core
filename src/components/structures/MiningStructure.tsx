import { getStructureResourceType, formatNumber } from "@/helpers/helperFunctions";
import ResourceImage from "@/components/ui/image/ResourceImage";
import { STRUCTURES } from "@/constants/structures";

interface MiningStructureProps {
  structure: GameStructure;
  money: number;
  onCollect: (id: string) => void;
  onUpgrade: (id: string) => void;
}

function MiningStructure({ structure, money, onCollect, onUpgrade }: MiningStructureProps) {
  const canCollect = structure.accumulated >= 1;

  const calculateUpgradeCost = (): number => {
    const baseStructure = STRUCTURES.find((s) => s.id === structure.id);
    if (baseStructure && Array.isArray(baseStructure.cost)) {
      return baseStructure.cost[structure.level] || 0;
    }
    return 0;
  };

  const upgradeCost = calculateUpgradeCost();
  const canAfford = money >= upgradeCost;
  const isMaxLevel = structure.level >= (structure.maxLevel || 5);

  const generationRate = Array.isArray(structure.generationRate)
    ? structure.generationRate[structure.level - 1]
    : structure.generationRate;

  return (
    <div className="structure-card structure-card--mining">
      <div className="structure-card__header">
        <h4 className="structure-card__name">{structure.name}</h4>
        <span className="structure-card__level">Level {structure.level}</span>
      </div>

      <div className="structure-card__content">
        <p className="structure-card__rate">
          Generating: {generationRate.toFixed(2)}/s
        </p>
        <p className="structure-card__accumulated">
          Ready: {Math.floor(structure.accumulated)}
        </p>

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
        {isMaxLevel && (
          <p className="structure-card__max-level">MAX LEVEL</p>
        )}
      </div>

      <div className="structure-card__actions">
        <button
          className="btn btn--collect"
          onClick={() => onCollect(structure.id)}
          disabled={!canCollect}
        >
          {canCollect ? (
            <span>
              + {Math.floor(structure.accumulated)}{" "}
              <ResourceImage
                type={
                  getStructureResourceType(structure.structureType) ?? "ore"
                }
                value={structure.resource}
              />
            </span>
          ) : (
            "Not ready"
          )}
        </button>
      </div>
    </div>
  );
}

export default MiningStructure;
