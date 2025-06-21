import { useState } from "react";
import ResourceTile from "@/components/ResourceTile";
import ProgressBar from "@/components/ui/ProgressBar";
import FocusOresDialog from "@/components/dialogs/FocusOresDialog";

interface MiningPanelProps {
  miningPower: number;
  ores: GameResourceOre[];
}

function MiningPanel({ miningPower, ores }: MiningPanelProps) {
  const [progress, setProgress] = useState<{ [key: string]: number }>({
    iron: 0,
    bronze: 0,
    silver: 0,
    gold: 0,
    platinum: 0,
    diamond: 0,
    titanium: 0,
  });
  const [showDialog, setShowDialog] = useState(false);

  function mineOre(ore: GameResourceOre) {
    // check for storage
    let newMiningProgress = 0;
    if (progress[ore.value] < ore.miningHardness) {
      _addOreMiningProgress(ore.value);
      newMiningProgress = progress[ore.value] + miningPower;
    }
    _handleOreMiningStep(ore, newMiningProgress);
  }

  function _handleOreMiningStep(
    ore: GameResourceOre,
    newMiningProgress: number
  ) {
    if (newMiningProgress < ore.miningHardness) return;
    // if (miningPower > ore.miningHardness) {
    //   const amountToMine = Math.floor(miningPower / ore.miningHardness);
    //   addResource(ore.value, "ore", amountToMine);
    // } else {
    //   addResource(ore.value, "ore", 1);
    // }
    _resetOreMiningProgress(ore.value);
  }

  function _addOreMiningProgress(ore: string) {
    setProgress((prevState) => {
      return { ...prevState, [ore]: progress[ore] + miningPower };
    });
  }

  function _resetOreMiningProgress(ore: string) {
    setProgress((prevState) => {
      return { ...prevState, [ore]: 0 };
    });
  }

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
              <ResourceTile resource={ore} onClick={() => mineOre(ore)} />
              <ProgressBar
                currentProgress={progress[ore.value]}
                maxProgress={ore.miningHardness}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default MiningPanel;
