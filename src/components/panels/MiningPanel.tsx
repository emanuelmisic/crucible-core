import { useEffect, useState } from "react";
import ResourceTile from "@/components/ResourceTile";
import ProgressBar from "@/components/ui/ProgressBar";
import FocusOresDialog from "@/components/dialogs/FocusOresDialog";

interface MiningPanelProps {
  miningProgress: { [key: string]: number };
  ores: GameResourceOre[];
  mineOre: (ore: GameResourceOre) => void;
}

function MiningPanel({ miningProgress, ores, mineOre }: MiningPanelProps) {
  const [selectedOres, setSelectedOres] = useState<GameResourceOre[]>([]);
  const [showDialog, setShowDialog] = useState(false);

  function generateInitialSelectedOres(ores: GameResourceOre[]) {
    setSelectedOres(ores.filter((ore) => ore.active));
  }

  useEffect(() => {
    generateInitialSelectedOres(ores);
  }, []);

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
          {selectedOres.map((ore) => (
            <div key={ore.name} className="ore">
              <ResourceTile resource={ore} onClick={() => mineOre(ore)} />
              <ProgressBar
                currentProgress={miningProgress[ore.value]}
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
