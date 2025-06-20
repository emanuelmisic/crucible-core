import ResourceTile from "@/components/ResourceTile";
import ProgressBar from "@/components/ui/ProgressBar";

interface MiningPanelProps {
  ores: GameResourceOre[];
}

function MiningPanel({ ores }: MiningPanelProps) {
  return (
    <>
      <div className="mining-panel">
        <div className="mining-panel__header">
          <button>Focus ores</button>
        </div>
        <div className="mining-panel__ore-container">
          {ores.map((ore) => (
            <div key={ore.name} className="ore">
              <ResourceTile resource={ore} />
              <ProgressBar currentProgress={0} maxProgress={5} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default MiningPanel;
