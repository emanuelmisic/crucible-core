import { useState } from "react";
import ResourceTile from "@/components/ResourceTile";
import ProgressBar from "@/components/ui/ProgressBar";
import Image from "../ui/Image";

interface SmeltingPanelProps {
  ores: GameResourceOre[];
  alloys: GameResourceAlloy[];
  smeltingProgress: { [key: string]: number };
  smeltAlloy: (alloy: GameResourceAlloy) => void;
}

function SmeltingPanel({
  ores,
  alloys,
  smeltingProgress,
  smeltAlloy,
}: SmeltingPanelProps) {
  const [selectedAlloy, setSelectedAlloy] = useState<GameResourceAlloy>(
    alloys[0]
  );

  return (
    <>
      <div className="smelting-panel">
        <div className="smelting-panel__header">
          <button>Choose alloy</button>
        </div>
        <div className="smelting-panel__alloy-container">
          <div className="alloy-recipe">
            <span>RECIPE:</span>
            {Object.entries(selectedAlloy.smeltingRecipe).map(
              ([key, value]) => (
                <span key={key}>
                  <Image
                    type="icon"
                    resource={ores.filter((ore) => ore.value === key)[0]}
                  />{" "}
                  {value}
                </span>
              )
            )}
          </div>
          <div key={selectedAlloy.name} className="alloy">
            <ResourceTile
              resource={selectedAlloy}
              onClick={() => smeltAlloy(selectedAlloy)}
            />
            <ProgressBar
              type="smelting"
              currentProgress={smeltingProgress[selectedAlloy.value]}
              maxProgress={selectedAlloy.smeltingDifficulty}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default SmeltingPanel;
