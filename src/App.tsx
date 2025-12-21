import { useEffect, useState } from "react";
import { useGame } from "@/contexts/GameContext";
import { formatNumber } from "@/helpers/helperFunctions";
import "@/styles.scss";

import ResourcesPanel from "@/components/panels/ResourcesPanel";
import MerchantPanel from "@/components/panels/MerchantPanel";
import VendorPanel from "@/components/panels/VendorPanel";
import StructuresPanel from "@/components/panels/StructuresPanel";

function App() {
  const game = useGame();
  const [ores, setOres] = useState<GameResourceOre[]>([]);
  const [alloys, setAlloys] = useState<GameResourceAlloy[]>([]);
  const [vendorVisible, setVendorVisible] = useState(false);
  const [merchantVisible, setMerchantVisible] = useState(false);

  function toggleVisibility(panelName: string) {
    if (panelName === "vendor") {
      setMerchantVisible(false);
      setVendorVisible(!vendorVisible);
    } else if (panelName === "merchant") {
      setVendorVisible(false);
      setMerchantVisible(!merchantVisible);
    }
  }

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
          <p>💲{formatNumber(game.money)}</p>
        </div>
      </div>
      <div className="app-body">
        <div className="game-area">
          <StructuresPanel />
        </div>
        <div className="shop-area">
          {merchantVisible && <MerchantPanel isVisible={merchantVisible} />}
          {vendorVisible && <VendorPanel isVisible={vendorVisible} />}
          {!merchantVisible && !vendorVisible && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                color: "#888",
                fontSize: "1.2rem",
              }}
            >
              Select a menu from the navigation below
            </div>
          )}
        </div>
      </div>
      <nav>
        <button onClick={() => toggleVisibility("merchant")}>Merchant</button>
        <button onClick={() => toggleVisibility("vendor")}>Vendor</button>
      </nav>
    </>
  );
}

export default App;
