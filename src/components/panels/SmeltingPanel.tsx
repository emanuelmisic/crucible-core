import { useEffect, useState } from "react";
import { useGame } from "@/contexts/GameContext";
import ResourceTile from "@/components/ResourceTile";
import ProgressBar from "@/components/ui/ProgressBar";
import Image from "@/components/ui/Image";
import SelectAlloyDialog from "@/components/dialogs/SelectAlloyDialog";
import { formatNumber } from "@/helpers/helperFunctions";

interface SmeltingPanelProps {
  ores: GameResourceOre[];
  alloys: GameResourceAlloy[];
}

function SmeltingPanel({ ores, alloys }: SmeltingPanelProps) {
  const game = useGame();
  const [selectedAlloy, setSelectedAlloy] = useState<GameResourceAlloy>(
    alloys[0]
  );
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    game.smeltingProgress[selectedAlloy.value] = 0;
  }, [selectedAlloy]);

  return (
    <>
      <SelectAlloyDialog
        showDialog={showDialog}
        closeDialog={() => setShowDialog(false)}
        alloys={alloys}
        setSelectedAlloy={setSelectedAlloy}
      />
      <div className="panel smelting-panel">
        <div className="panel__header">
          <button onClick={() => setShowDialog(true)}>Choose alloy</button>
        </div>
        <div className="smelting-panel__alloy-container">
          <div className="alloy-recipe">
            {Object.entries(selectedAlloy.smeltingRecipe).map(
              ([key, value]) => (
                <span key={key}>
                  <Image
                    resource={ores.filter((ore) => ore.value === key)[0]}
                  />{" "}
                  {formatNumber(
                    ores.filter((ore) => ore.value === key)[0].amount
                  )}
                  /{formatNumber(value)}
                </span>
              )
            )}
          </div>
          <div key={selectedAlloy.name} className="alloy">
            <ResourceTile
              resource={selectedAlloy}
              onClick={() => game.smeltAlloy(selectedAlloy)}
            />
            <ProgressBar
              type="smelting"
              currentProgress={game.smeltingProgress[selectedAlloy.value]}
              maxProgress={selectedAlloy.smeltingDifficulty}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default SmeltingPanel;
