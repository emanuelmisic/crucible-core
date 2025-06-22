import "@/styles.scss";

import ResourcesPanel from "@/components/panels/ResourcesPanel";
import MiningPanel from "@/components/panels/MiningPanel";
import SmeltingPanel from "@/components/panels/SmeltingPanel";
import { useGame } from "@/contexts/GameContext";
import MerchantPanel from "@/components/panels/MerchantPanel";

function App() {
  const game = useGame();
  return (
    <>
      <div className="app-header">
        <ResourcesPanel
          ores={
            game.resources.filter((r) => r.type === "ore") as GameResourceOre[]
          }
          alloys={
            game.resources.filter(
              (r) => r.type === "alloy"
            ) as GameResourceAlloy[]
          }
        />
        <h1>Crucible Core: Humble Beginnings</h1>
        <div className="app-header__money-panel">
          <p>💲{game.money}</p>
        </div>
      </div>
      <div className="app-body">
        <div style={{ display: "flex", flexDirection: "column" }}>
          <MiningPanel
            ores={
              game.resources.filter(
                (r) => r.type === "ore"
              ) as GameResourceOre[]
            }
            miningProgress={game.miningProgress}
            mineOre={game.mineOre}
          />
          <SmeltingPanel
            ores={
              game.resources.filter(
                (r) => r.type === "ore"
              ) as GameResourceOre[]
            }
            alloys={
              game.resources.filter(
                (r) => r.type === "alloy"
              ) as GameResourceAlloy[]
            }
            smeltingProgress={game.smeltingProgress}
            smeltAlloy={game.smeltAlloy}
          />
        </div>
        <MerchantPanel
          ores={
            game.resources.filter((r) => r.type === "ore") as GameResourceOre[]
          }
          alloys={
            game.resources.filter(
              (r) => r.type === "alloy"
            ) as GameResourceAlloy[]
          }
		  sellAll={game.sellAll}
		  sellHalf={game.sellHalf}
		  unlockResource={game.unlockResource}
        />
      </div>
    </>
  );
}

export default App;
