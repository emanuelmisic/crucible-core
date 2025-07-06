import { useEffect, useState } from "react";
import { formatNumber } from "@/helpers/helperFunctions";
import SelectResourcesDialog from "@/components/dialogs/SelectResourcesDialog";
import Image from "@/components/ui/Image";

interface ResourcesPanelProps {
  ores: GameResourceOre[];
  alloys: GameResourceAlloy[];
}

function ResourcesPanel({ ores, alloys }: ResourcesPanelProps) {
  const [displayedOres, setDisplayedOres] = useState<GameResourceOre[]>(
    ores.filter((ore) => ore.isDisplayed)
  );
  const [displayedAlloys, setDisplayedAlloys] = useState<GameResourceAlloy[]>(
    alloys.filter((alloy) => alloy.isDisplayed)
  );
  const [showOresDialog, setShowOresDialog] = useState(false);
  const [showAlloysDialog, setShowAlloysDialog] = useState(false);

  useEffect(() => {
    setDisplayedOres(ores.filter((ore) => ore.isDisplayed));
    setDisplayedAlloys(alloys.filter((alloy) => alloy.isDisplayed));
  }, [ores]);

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
        {displayedOres.map((ore) => (
          <p key={ore.name}>
            <Image resource={ore} />
            {formatNumber(ore.amount)}
          </p>
        ))}
        <button onClick={() => setShowOresDialog(true)}>Choose ores</button>
      </div>
      <div className="resources-panel__section">
        {displayedAlloys.map((alloy) => (
          <p key={alloy.name}>
            <Image resource={alloy} />
            {alloy.amount}
          </p>
        ))}
        <button onClick={() => setShowAlloysDialog(true)}>Choose alloys</button>
      </div>
    </div>
  );
}

export default ResourcesPanel;
