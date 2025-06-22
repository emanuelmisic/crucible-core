import { useEffect, useState } from "react";
import { useGame } from "@/contexts/GameContext";
import ResourceTile from "@/components/ResourceTile";
import ProgressBar from "@/components/ui/ProgressBar";
import FocusOresDialog from "@/components/dialogs/FocusOresDialog";

interface MiningPanelProps {
  ores: GameResourceOre[];
}

function MiningPanel({ ores }: MiningPanelProps) {
  const game = useGame();
  const [selectedOres, setSelectedOres] = useState<GameResourceOre[]>([]);
  const [showDialog, setShowDialog] = useState(false);

  function generateInitialSelectedOres(ores: GameResourceOre[]) {
    setSelectedOres(ores.filter((ore) => ore.active));
  }

  useEffect(() => {
    if (selectedOres.length === 3) return;
    generateInitialSelectedOres(ores);
  }, [ores]);

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
          {selectedOres.map((ore) => (
            <div key={ore.name} className="ore">
              <ResourceTile resource={ore} onClick={() => game.mineOre(ore)} />
              <ProgressBar
                currentProgress={game.miningProgress[ore.value]}
                maxProgress={ore.miningHardness}
              />
            </div>
          ))}
          {selectedOres.length <= 3 &&
            [...Array(3 - selectedOres.length).keys()].map((i) => (
              <div key={`empty-${i}`} className="ore__empty">
                ?
              </div>
            ))}
        </div>
      </div>
    </>
  );
}

export default MiningPanel;
