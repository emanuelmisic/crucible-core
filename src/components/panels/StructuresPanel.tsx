import { useGame } from "@/contexts/GameContext";
import { formatNumber } from "@/helpers/helperFunctions";

function StructuresPanel() {
  const game = useGame();

  return (
    <div className="panel structures-panel">
      <div className="panel__header structures-panel__header">
        <h2>Structures</h2>
      </div>
      <div className="structures-panel__structure-container">
        {game.structures.map(structure => (
          <div key={structure.id} className="structure-card">
            <h3>{structure.name}</h3>
            <p>Generates {structure.generationRate}/s {structure.resourceType}</p>

            {structure.level === 0 ? (
              <button
                onClick={() => game.purchaseStructure(structure.id)}
                disabled={game.money < structure.cost}
              >
                Purchase for ${formatNumber(structure.cost)}
              </button>
            ) : (
              <div className="structure-active">
                <p>Status: Active (Level {structure.level})</p>
                <p>Accumulated: {structure.accumulated.toFixed(2)} {structure.resourceType}</p>
                <button
                  onClick={() => game.collectResources(structure.id)}
                  disabled={structure.accumulated < 1}
                >
                  Collect {Math.floor(structure.accumulated)} {structure.resourceType}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default StructuresPanel;
