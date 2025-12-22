import { useGame } from "@/contexts/GameContext";
import SmeltingStructure from "@/components/structures/SmeltingStructure";
import MiningStructure from "@/components/structures/MiningStructure";

function StructuresPanel() {
  const {
    structures,
    money,
    resources,
    collectResources,
    refuelStructure,
    inputOre,
  } = useGame();

  const ownedStructures = structures.filter((s) => s.level > 0);
  const ownedMining = ownedStructures.filter(
    (s) => s.structureType === "mining"
  );
  const ownedSmelting = ownedStructures.filter(
    (s) => s.structureType === "smelting"
  );

  return (
    <div className="panel structures-panel">
      {ownedStructures.length === 0 && (
        <div className="structures-empty">
          <p>No active structures. Visit the Vendor to purchase structures.</p>
        </div>
      )}

      {/* Mining Drills Section */}
      {ownedMining.length > 0 && (
        <div className="structures-section">
          <h3 className="structures-section__title">Mining Drills</h3>
          <div className="structures-grid">
            {ownedMining.map((structure) => (
              <MiningStructure
                key={structure.id}
                structure={structure}
                onCollect={collectResources}
              />
            ))}
          </div>
        </div>
      )}

      {/* Smelters Section */}
      {ownedSmelting.length > 0 && (
        <div className="structures-section">
          <h3 className="structures-section__title">Smelters</h3>
          <div className="structures-grid">
            {ownedSmelting.map((structure) => (
              <SmeltingStructure
                key={structure.id}
                structure={structure}
                money={money}
                resources={resources}
                onCollect={collectResources}
                onRefuel={refuelStructure}
                onInputOre={inputOre}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default StructuresPanel;
