import { useState } from "react";
import { useGame } from "@/contexts/GameContext";

import ResourceTile from "@/components/ResourceTile";
import ProgressBar from "@/components/ui/ProgressBar";
import FocusOresDialog from "@/components/dialogs/FocusOresDialog";

function MiningPanel({ ores }: { ores: GameResourceOre[] }) {
  const game = useGame();
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <FocusOresDialog
        showDialog={showDialog}
        closeDialog={() => setShowDialog(false)}
        ores={ores}
      />
      <div className="panel mining-panel">
        <div className="panel__header">
          <button onClick={() => setShowDialog(true)}>Focus ores</button>
        </div>
        <div className="mining-panel__ore-container">
          {ores
            .filter((o) => o.active)
            .map((ore) => (
              <div key={ore.name} className="ore">
                <ResourceTile
                  resource={ore}
                  onClick={() => game.mineOre(ore)}
                />
                <ProgressBar
                  currentProgress={game.miningProgress[ore.value]}
                  maxProgress={ore.miningHardness}
                />
              </div>
            ))}
          {ores.filter((o) => o.active).length <= 3 &&
            [...Array(3 - ores.filter((o) => o.active).length).keys()].map(
              (i) => (
                <div key={`empty-${i}`} className="ore__empty">
                  ?
                </div>
              )
            )}
        </div>
      </div>
    </>
  );
}

export default MiningPanel;
