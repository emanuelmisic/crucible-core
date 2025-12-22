import { useGame } from "@/contexts/GameContext";
import SmeltingStructure from "@/components/structures/SmeltingStructure";
import MiningStructure from "@/components/structures/MiningStructure";
import { formatNumber } from "@/helpers/helperFunctions";

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
  const ownedStorage = ownedStructures.filter(
    (s) => s.structureType === "storage"
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

      {/* Storage Facilities Section */}
      {ownedStorage.length > 0 && (
        <div className="structures-section">
          <h3 className="structures-section__title">Storage Facilities</h3>
          <div className="structures-grid">
            {ownedStorage.map((structure) => (
              <div key={structure.id} className="structure-card structure-card--storage">
                <div className="structure-card__header">
                  <h4 className="structure-card__name">{structure.name}</h4>
                  <span className="structure-card__level">Level {structure.level}</span>
                </div>
                <div className="structure-card__content">
                  <div className="storage-info">
                    <p className="storage-info__title">Provides storage for:</p>
                    {structure.storageProvided &&
                      Object.entries(structure.storageProvided).map(([res, capacity]) => {
                        const resource = resources.find((r) => r.value === res);
                        const currentAmount = resource?.amount || 0;
                        const maxCapacity = resource?.storageCapacity || 0;

                        return (
                          <div key={res} className="storage-resource">
                            <span className="storage-resource__name">{res}:</span>
                            <span className="storage-resource__value">
                              +{formatNumber(capacity)} capacity
                            </span>
                            <span className="storage-resource__current">
                              ({formatNumber(currentAmount)} / {formatNumber(maxCapacity)} used)
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default StructuresPanel;
