import ResourceTile from "@/components/ResourceTile";
import ProgressBar from "@/components/ui/ProgressBar";

interface SmeltingPanelProps {
  alloys: GameResourceAlloy[];
}

function SmeltingPanel({ alloys }: SmeltingPanelProps) {
  return (
    <>
      <div className="smelting-panel">
        <div className="smelting-panel__header">
          <button>Choose alloy</button>
        </div>
        <div className="smelting-panel__alloy-container">
          {alloys.map((alloy) => (
            <div key={alloy.name} className="alloy">
              <ResourceTile resource={alloy} />
              <ProgressBar type="smelting" currentProgress={0} maxProgress={5} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default SmeltingPanel;
