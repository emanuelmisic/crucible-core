import { getStructureResourceType } from "@/helpers/helperFunctions";
import ResourceImage from "@/components/ui/image/ResourceImage";

interface MiningStructureProps {
  structure: GameStructure;
  onCollect: (id: string) => void;
}

function MiningStructure({ structure, onCollect }: MiningStructureProps) {
  const canCollect = structure.accumulated >= 1;

  return (
    <div className="structure-card structure-card--mining">
      <div className="structure-card__header">
        <h4 className="structure-card__name">{structure.name}</h4>
        <span className="structure-card__level">Level {structure.level}</span>
      </div>

      <div className="structure-card__content">
        {/* TODO: Place an image here */}
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
