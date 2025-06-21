import { useState } from "react";
import ResourceTile from "@/components/ResourceTile";
import ProgressBar from "@/components/ui/ProgressBar";
import FocusOresDialog from "@/components/dialogs/FocusOresDialog";

interface MiningPanelProps {
  ores: GameResourceOre[];
}

function MiningPanel({ ores }: MiningPanelProps) {
  const [showDialog, setShowDialog] = useState(false);
  return (
    <>
      <FocusOresDialog
        showDialog={showDialog}
        closeDialog={() => setShowDialog(false)}
		ores={ores}
      />
      <div className="mining-panel">
        <div className="mining-panel__header">
          <button onClick={() => setShowDialog(true)}>Focus ores</button>
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
