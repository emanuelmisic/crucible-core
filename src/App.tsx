import { useState } from "react";
import { INITIAL_RESOURCES } from "@/constants/resources";
import "@/styles.scss";

import ResourcesPanel from "@/components/panels/ResourcesPanel";

function App() {
  const [res, setRes] = useState(INITIAL_RESOURCES);
  return (
    <>
      <div className="app-header">
		<ResourcesPanel />
		<h1>Crucible Core: Humble Beginnings</h1>
		<p>💲0</p>
	  </div>
    </>
  );
}

export default App;
