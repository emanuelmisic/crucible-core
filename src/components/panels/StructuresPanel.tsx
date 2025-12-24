import { useGame } from "@/contexts/GameContext";
import SmeltingStructure from "@/components/structures/SmeltingStructure";
import MiningStructure from "@/components/structures/MiningStructure";
import HQPanel from "@/components/panels/HQPanel";
import StorageStructure from "../structures/StorageStructure";

function StructuresPanel() {
  const {
    structures,
    money,
    resources,
    options,
    collectResources,
    refuelStructure,
    inputOre,
    upgradeStructure,
    getHQLevel,
  } = useGame();

  const ownedStructures = structures.filter((s) => s.level > 0);
  const ownedMining = ownedStructures.filter(
    (s) => s.structureType === "mining"
  );
  const ownedSmelting = ownedStructures.filter(
    (s) => s.structureType === "smelting"
  );
  const ownedStorage = ownedStructures.filter(
    (s) => s.structureType === "storage"
  );

  return (
    <div className="panel structures-panel">
      <div className="structures-section">
        <HQPanel />
      </div>

      {/* Mining Drills Section */}
      {options.showMiningStructures && (
        <div className="structures-section">
          <h3 className="structures-section__title">Mines & Storage</h3>
          <div className="structures-grid">
            {ownedMining.length > 0 &&
              ownedMining.map((structure) => (
                <MiningStructure
                  key={structure.id}
                  structure={structure}
                  hqLevel={getHQLevel()}
                  money={money}
                  onCollect={collectResources}
                  onUpgrade={upgradeStructure}
                />
              ))}
            {ownedStorage.length > 0 &&
              ownedStorage.map((structure) => (
                <StorageStructure
                  key={structure.id}
                  structure={structure}
                  hqLevel={getHQLevel()}
                  money={money}
                  onUpgrade={upgradeStructure}
                />
              ))}
          </div>
        </div>
      )}

      {/* Smelters Section */}
      {options.showSmeltingStructures && ownedSmelting.length > 0 && (
        <div className="structures-section">
          <h3 className="structures-section__title">Smelters</h3>
          <div className="structures-grid">
            {ownedSmelting.map((structure) => (
              <SmeltingStructure
                key={structure.id}
                structure={structure}
                hqLevel={getHQLevel()}
                money={money}
                resources={resources}
                onCollect={collectResources}
                onRefuel={refuelStructure}
                onInputOre={inputOre}
                onUpgrade={upgradeStructure}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default StructuresPanel;
