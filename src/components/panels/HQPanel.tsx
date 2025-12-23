import { useGame } from "@/contexts/GameContext";
import { formatNumber } from "@/helpers/helperFunctions";
import ResourceImage from "@/components/ui/image/ResourceImage";

const HQPanel: React.FC = () => {
  const { structures, money, resources, upgradeStructure, getHQLevel } =
    useGame();

  const hq = structures.find((s) => s.structureType === "hq");

  if (!hq) return null;

  const hqLevel = getHQLevel();
  const upgradeCost = hq.upgradeCost || 0;
  const resourceCosts = hq.upgradeResourceCost || {};

  const canAffordMoney = money >= upgradeCost;

  const canAffordResources = Object.entries(resourceCosts).every(
    ([resourceId, amount]) => {
      const resource = resources.find((r) => r.value === resourceId);
      return resource && resource.amount >= amount;
    }
  );

  const canAfford = canAffordMoney && canAffordResources;
  const isMaxLevel = hqLevel >= (hq.maxLevel || 10);

  const unlockedResources = resources.filter((r) => r.unlocked);

  return (
    <div className="panel hq-panel">
      <div className="panel__header">
        <h2>Mining HQ</h2>
        <div className="hq-level">
          <span className="hq-level__value">{hqLevel}</span>
          {!isMaxLevel && <span className="hq-level__max">/ {hq.maxLevel}</span>}
        </div>
      </div>

      <div className="hq-info">
        <div className="hq-storage">
          <h3>Storage</h3>
          <div className="hq-storage__resources">
            {unlockedResources.map((resource) => (
              <div key={resource.value} className="hq-storage__resource" title={`${resource.name}: ${formatNumber(resource.amount)} / ${formatNumber(resource.storageCapacity)}`}>
                <ResourceImage
                  type={resource.type}
                  value={resource.value}
                  size={32}
                />
              </div>
            ))}
          </div>
        </div>

        {!isMaxLevel && (
          <div className="hq-upgrade">
            <h3>Upgrade to Level {hqLevel + 1}</h3>
            <div className="hq-upgrade__costs">
              <div className={`hq-upgrade__cost ${!canAffordMoney ? "insufficient" : ""}`}>
                <span className="hq-upgrade__cost-label">Money:</span>
                <span>${formatNumber(upgradeCost)}</span>
              </div>
              {Object.entries(resourceCosts).map(([resourceId, amount]) => {
                const resource = resources.find((r) => r.value === resourceId);
                const hasEnough = resource && resource.amount >= amount;
                return (
                  <div
                    key={resourceId}
                    className={`hq-upgrade__cost ${!hasEnough ? "insufficient" : ""}`}
                  >
                    <ResourceImage
                      type={resource?.type || "ore"}
                      value={resourceId}
                      size={20}
                    />
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
              {canAfford ? "UPGRADE" : "INSUFFICIENT"}
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
};

export default HQPanel;
