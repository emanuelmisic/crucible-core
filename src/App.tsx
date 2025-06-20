import { useState } from "react";
import { INITIAL_RESOURCES } from "@/constants/resources";
import "@/styles.scss";

import ResourcesPanel from "@/components/panels/ResourcesPanel";
import MiningPanel from "@/components/panels/MiningPanel";

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
        <p>💲0</p>
      </div>
	  <div className="app-body">
		<MiningPanel ores={res.filter((r) => r.type === "ore") as GameResourceOre[]} />
	  </div>
    </>
  );
}

export default App;
