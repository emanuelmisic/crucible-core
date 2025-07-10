import { useEffect, useState } from "react";
import { useGame } from "@/contexts/GameContext";

import SelectAlloyDialog from "@/components/dialogs/SelectAlloyDialog";
import SmeltingItemTile from "@/components/SmeltingItemTile";

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
          <SmeltingItemTile ores={ores} selectedAlloy={selectedAlloy} />
        </div>
		<span className="fire"></span>
      </div>
    </>
  );
}

export default SmeltingPanel;
