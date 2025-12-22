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
        <div className="structure-card__stat">
          <span className="stat__label">Output:</span>
          <span className="stat__value">
            {structure.generationRate}/s {structure.resourceType}
          </span>
        </div>

        <button
          className="btn btn--collect"
          onClick={() => onCollect(structure.id)}
          disabled={!canCollect}
        >
          {canCollect
            ? `Collect ${Math.floor(structure.accumulated)}`
            : "Not ready"}
        </button>
      </div>
    </div>
  );
}

export default MiningStructure;
