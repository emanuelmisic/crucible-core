import { useState } from "react";
import { INITIAL_RESOURCES } from "@/constants/resources";
import "@/styles.scss";

import ResourcesPanel from "@/components/panels/ResourcesPanel";
import MiningPanel from "@/components/panels/MiningPanel";
import SmeltingPanel from "@/components/panels/SmeltingPanel";

function App() {
  const [res, setRes] = useState(INITIAL_RESOURCES);
  return (
    <>
      <div className="app-header">
        <ResourcesPanel
          ores={res.filter((r) => r.type === "ore") as GameResourceOre[]}
          alloys={res.filter((r) => r.type === "alloy") as GameResourceAlloy[]}
        />
        <h1>Crucible Core: Humble Beginnings</h1>
        <div className="app-header__money-panel">
			<p>💲0</p>
		</div>
      </div>
	  <div className="app-body">
		<MiningPanel ores={res.filter((r) => r.type === "ore") as GameResourceOre[]} />
		<SmeltingPanel alloys={res.filter((r) => r.type === "alloy") as GameResourceAlloy[]} />
	  </div>
    </>
  );
}

export default App;
