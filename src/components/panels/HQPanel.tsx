import { useGame } from "@/contexts/GameContext";
import { formatNumber } from "@/helpers/helperFunctions";
import Image from "@/components/ui/image/ResourceImage";

function HQPanel() {
  const {
    structures,
    money,
    resources,
    upgradeStructure,
    getHQLevel,
    getResourceCapacity,
  } = useGame();

  const hq = structures.find((s) => s.structureType === "hq");

  if (!hq) return null;

  const hqLevel = getHQLevel();
  const upgradeCost = hq.cost[hqLevel];
  const resourceCosts = hq.resourceCost?.[hqLevel] || {};

  const canAffordMoney = money >= upgradeCost;
  const canAffordResources = Object.entries(resourceCosts).every(
    ([resourceId, amount]) => {
      const resource = resources.find((r) => r.value === resourceId);
      return resource && resource.amount >= amount;
    }
  );

  const canAfford = canAffordMoney && canAffordResources;
  const isMaxLevel = hqLevel >= hq.maxLevel[0];

  return (
    <div className="panel hq-panel">
      <div className="panel__header">
        <span>{hq.name}</span>
        <div className="hq-level">level {hqLevel}</div>
      </div>

      <div className="hq-info">
        <div className="hq-storage-info">
          <span>Ores storage: {getResourceCapacity("ore")}</span>
          <span>Alloys storage: {getResourceCapacity("alloy")}</span>
        </div>

        {!isMaxLevel && (
          <div className="hq-upgrade">
            <h3>Requirements for level {hqLevel + 1}</h3>
            <div className="hq-upgrade__costs">
              <div
                className={`hq-upgrade__cost ${
                  !canAffordMoney ? "insufficient" : ""
                }`}
              >
                <span>💲{formatNumber(upgradeCost)}</span>
              </div>
              {Object.entries(resourceCosts).map(([resourceId, amount]) => {
                const resource = resources.find((r) => r.value === resourceId);
                const hasEnough = resource && resource.amount >= amount;
                return (
                  <div
                    key={resourceId}
                    className={`hq-upgrade__cost ${
                      !hasEnough ? "insufficient" : ""
                    }`}
                  >
                    <Image value={resourceId} size={20} />
                    <span>{amount}</span>
                  </div>
                );
              })}
            </div>

            <button
              className="btn btn--upgrade"
              onClick={() => upgradeStructure(hq.id)}
              disabled={!canAfford}
            >
              {canAfford ? "UPGRADE" : "REQUIREMENTS NOT MET"}
            </button>
          </div>
        )}

        {isMaxLevel && (
          <div className="hq-max-level">
            <p>Max Level Reached</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default HQPanel;
