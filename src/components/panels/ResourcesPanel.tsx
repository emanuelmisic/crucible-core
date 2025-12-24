import { useEffect, useState } from "react";
import { formatNumber } from "@/helpers/helperFunctions";
import SelectResourcesDialog from "@/components/dialogs/SelectResourcesDialog";
import Image from "@/components/ui/image/ResourceImage";
import { useGame } from "@/contexts/GameContext";

interface ResourcesPanelProps {
  ores: GameResourceOre[];
  alloys: GameResourceAlloy[];
}

function ResourcesPanel({ ores, alloys }: ResourcesPanelProps) {
  const { getResourceCapacity } = useGame();
  const [displayedOres, setDisplayedOres] = useState<GameResourceOre[]>(
    ores.filter((ore) => ore.isDisplayed)
  );
  const [displayedAlloys, setDisplayedAlloys] = useState<GameResourceAlloy[]>(
    alloys.filter((alloy) => alloy.isDisplayed)
  );
  const [showOresDialog, setShowOresDialog] = useState(false);
  const [showAlloysDialog, setShowAlloysDialog] = useState(false);
  const [showingOres, setShowingOres] = useState(true);

  useEffect(() => {
    setDisplayedOres(ores.filter((ore) => ore.isDisplayed));
    setDisplayedAlloys(alloys.filter((alloy) => alloy.isDisplayed));
  }, [ores]);

  function getStorageColor(amount: number, capacity: number): string {
    if (amount >= capacity) {
      return "orangered";
    } else if (amount > capacity / 2) {
      return "orange";
    }else if (amount > capacity / 3) {
      return "yellow";
    }
    return "inherit";
  }

  return (
    <div className="resources-panel">
      <SelectResourcesDialog
        resources={ores}
        showDialog={showOresDialog}
        closeDialog={() => setShowOresDialog(false)}
      />
      <SelectResourcesDialog
        resources={alloys}
        showDialog={showAlloysDialog}
        closeDialog={() => setShowAlloysDialog(false)}
      />
      <div className="resources-panel__section">
        {showingOres ? (
          <>
            {displayedOres.map((ore) => {
              const capacity = getResourceCapacity("ore");
              const color = getStorageColor(ore.amount, capacity);
              return (
                <p key={ore.name}>
                  <Image value={ore.value} />
                  <span style={{ color }}>{formatNumber(ore.amount)}</span>
                </p>
              );
            })}
            <button
              style={{ marginRight: "5rem" }}
              onClick={() => setShowingOres(false)}
            >
              Show alloys
            </button>
            <button onClick={() => setShowOresDialog(true)}>Choose ores</button>
          </>
        ) : (
          <>
            {displayedAlloys.map((alloy) => {
              const capacity = getResourceCapacity("alloy");
              const color = getStorageColor(alloy.amount, capacity);
              return (
                <p key={alloy.name}>
                  <Image value={alloy.value} />
                  <span style={{ color }}>{formatNumber(alloy.amount)}</span>
                </p>
              );
            })}
            <button
              style={{ marginRight: "5rem" }}
              onClick={() => setShowingOres(true)}
            >
              Show ores
            </button>
            <button onClick={() => setShowAlloysDialog(true)}>
              Choose alloys
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ResourcesPanel;
