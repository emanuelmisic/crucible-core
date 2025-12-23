import { useGame } from "@/contexts/GameContext";
import { formatNumber } from "@/helpers/helperFunctions";
import { STRUCTURES } from "@/constants/structures";
import SmeltingStructure from "@/components/structures/SmeltingStructure";
import MiningStructure from "@/components/structures/MiningStructure";
import HQPanel from "@/components/panels/HQPanel";

function StructuresPanel() {
  const {
    structures,
    money,
    resources,
    collectResources,
    refuelStructure,
    inputOre,
    upgradeStructure,
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

  function calculateUpgradeCost(structure: GameStructure): number {
    const baseStructure = STRUCTURES.find((s) => s.id === structure.id);
    if (baseStructure && Array.isArray(baseStructure.cost)) {
      return baseStructure.cost[structure.level] || 0;
    }
    return 0;
  };

  return (
    <div className="panel structures-panel">
      <div className="structures-section">
        <HQPanel />
      </div>

      {/* Mining Drills Section */}
      {ownedMining.length > 0 && (
        <div className="structures-section">
          <h3 className="structures-section__title">Mining Drills</h3>
          <div className="structures-grid">
            {ownedMining.map((structure) => (
              <MiningStructure
                key={structure.id}
                structure={structure}
                money={money}
                onCollect={collectResources}
                onUpgrade={upgradeStructure}
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
                onUpgrade={upgradeStructure}
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
            {ownedStorage.map((structure) => {
              const upgradeCost = calculateUpgradeCost(structure);
              const canAfford = money >= upgradeCost;
              const isMaxLevel = structure.level >= (structure.maxLevel || 5);

              return (
                <div
                  key={structure.id}
                  className="structure-card structure-card--storage"
                >
                  <div className="structure-card__header">
                    <h4 className="structure-card__name">{structure.name}</h4>
                    <span className="structure-card__level">
                      Level {structure.level}
                    </span>
                  </div>
                  <div className="structure-card__content">
                    <div className="storage-info">
                      <p className="storage-info__title">
                        Provides storage for:
                      </p>
                      {structure.storageProvided &&
                        Object.entries(structure.storageProvided).map(
                          ([res, capacity]) => {
                            const resource = resources.find(
                              (r) => r.value === res
                            );
                            const currentAmount = resource?.amount || 0;
                            const maxCapacity = resource?.storageCapacity || 0;

                            const displayCapacity =
                              typeof capacity === "number" ? capacity : 0;

                            return (
                              <div key={res} className="storage-resource">
                                <span className="storage-resource__name">
                                  {res}:
                                </span>
                                <span className="storage-resource__value">
                                  +{formatNumber(displayCapacity)} capacity
                                </span>
                                <span className="storage-resource__current">
                                  ({formatNumber(currentAmount)} /{" "}
                                  {formatNumber(maxCapacity)} used)
                                </span>
                              </div>
                            );
                          }
                        )}
                    </div>

                    {!isMaxLevel && (
                      <div className="structure-card__upgrade">
                        <button
                          className="btn btn--upgrade-sm"
                          onClick={() => upgradeStructure(structure.id)}
                          disabled={!canAfford}
                        >
                          Upgrade (${formatNumber(upgradeCost)})
                        </button>
                      </div>
                    )}
                    {isMaxLevel && (
                      <p className="structure-card__max-level">MAX LEVEL</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default StructuresPanel;
