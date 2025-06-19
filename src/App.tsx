import { useState } from "react";
import { INITIAL_RESOURCES } from "@/constants/resources";
import "@/styles.scss";

import ResourcesPanel from "@/components/panels/ResourcesPanel";

function App() {
  const [res, setRes] = useState(INITIAL_RESOURCES);
  return (
    <>
      <ResourcesPanel />
    </>
  );
}

export default App;
