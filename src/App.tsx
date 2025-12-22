import { useEffect, useState } from "react";
import { useGame } from "@/contexts/GameContext";
import { formatNumber } from "@/helpers/helperFunctions";
import "@/styles.scss";

import ResourcesPanel from "@/components/panels/ResourcesPanel";
import MerchantPanel from "@/components/panels/MerchantPanel";
import VendorPanel from "@/components/panels/VendorPanel";
import StructuresPanel from "@/components/panels/StructuresPanel";
import { DIALOG_ANIMATION_TIME } from "./constants";

function App() {
  const game = useGame();
  const [ores, setOres] = useState<GameResourceOre[]>([]);
  const [alloys, setAlloys] = useState<GameResourceAlloy[]>([]);
  const [vendorOpen, setVendorOpen] = useState(false);
  const [merchantOpen, setMerchantOpen] = useState(false);

  const openMerchant = () => {
    if (vendorOpen) {
      setVendorOpen(false);
      setTimeout(() => setMerchantOpen(true), DIALOG_ANIMATION_TIME);
    } else {
      setMerchantOpen(true);
    }
  };

  const openVendor = () => {
    if (merchantOpen) {
      setMerchantOpen(false);
      setTimeout(() => setVendorOpen(true), DIALOG_ANIMATION_TIME);
    } else {
      setVendorOpen(true);
    }
  };

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
      </div>
      <MerchantPanel
        isOpen={merchantOpen}
        onClose={() => setMerchantOpen(false)}
      />
      <VendorPanel isOpen={vendorOpen} onClose={() => setVendorOpen(false)} />
      <nav>
        <button onClick={openMerchant}>Merchant</button>
        <button onClick={openVendor}>Vendor</button>
      </nav>
    </>
  );
}

export default App;
