import Image from "@/components/ui/Image";
import { useEffect, useState } from "react";
import { formatNumber } from "@/helpers/helperFunctions";

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

  useEffect(() => {
    setDisplayedOres(ores.filter((ore) => ore.isDisplayed));
	setDisplayedAlloys(alloys.filter((alloy) => alloy.isDisplayed));
  }, [ores]);

  return (
    <div className="resources-panel">
      <div className="resources-panel__section">
        {displayedOres.map((ore) => (
          <p key={ore.name}>
            <Image resource={ore} />
            {formatNumber(ore.amount)}
          </p>
        ))}
        <button>Choose ores</button>
      </div>
      <div className="resources-panel__section">
        {displayedAlloys.map((alloy) => (
          <p key={alloy.name}>
            <Image resource={alloy} />
            {alloy.amount}
          </p>
        ))}
        <button>Choose alloys</button>
      </div>
    </div>
  );
}

export default ResourcesPanel;
