import { useEffect, useState } from "react";
import { useGame } from "@/contexts/GameContext";
import "@/styles.scss";

import ResourcesPanel from "@/components/panels/ResourcesPanel";
import MiningPanel from "@/components/panels/MiningPanel";
import SmeltingPanel from "@/components/panels/SmeltingPanel";
import MerchantPanel from "@/components/panels/MerchantPanel";
import VendorPanel from "@/components/panels/VendorPanel";

function App() {
  const game = useGame();
  const [ores, setOres] = useState<GameResourceOre[]>([]);
  const [alloys, setAlloys] = useState<GameResourceAlloy[]>([]);

  useEffect(() => {
    setOres(
      game.resources.filter((r) => r.type === "ore") as GameResourceOre[]
    );
    setAlloys(
      game.resources.filter((r) => r.type === "alloy") as GameResourceAlloy[]
    );
  }, [game.resources]);

  return (
    <>
      <div className="app-header">
        <ResourcesPanel ores={ores} alloys={alloys} />
        <h1>Crucible Core: Humble Beginnings</h1>
        <div className="app-header__money-panel">
          <p>💲{game.money}</p>
        </div>
      </div>
      <div className="app-body">
        <div style={{ display: "flex", flexDirection: "column" }}>
          <MiningPanel ores={ores} />
          {alloys.length > 0 && <SmeltingPanel ores={ores} alloys={alloys} />}
        </div>
        <MerchantPanel />
        <VendorPanel />
      </div>
    </>
  );
}

export default App;
