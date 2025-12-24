import { FUEL_COST_PER_UNIT } from "@/constants/structures";
import {
  calculateStructureUpgradeCost,
  formatNumber,
} from "@/helpers/helperFunctions";

interface SmeltingStructureProps {
  structure: GameStructure;
  hqLevel: number;
  money: number;
  resources: GameResource[];
  onCollect: (id: string) => void;
  onRefuel: (id: string, amount: number) => void;
  onInputOre: (id: string, amount: number) => void;
  onUpgrade: (id: string) => void;
}

function SmeltingStructure({
  structure,
  hqLevel,
  money,
  resources,
  onCollect,
  onRefuel,
  onInputOre,
  onUpgrade,
}: SmeltingStructureProps) {
  const upgradeCost = calculateStructureUpgradeCost(structure);
  const canAffordUpgrade = money >= upgradeCost;
  const isMaxLevel = structure.level >= structure.maxLevel[hqLevel - 1];

  const canCollect = structure.accumulated >= 1;

  const currentFuel = structure.currentFuel || 0;
  const fuelCapacity = structure.fuelCapacity || 100;
  const fuelPercentage = (currentFuel / fuelCapacity) * 100;
  const isLowFuel = fuelPercentage < 25;
  const isOutOfFuel = currentFuel <= 0;

  const currentOre = structure.currentOre || 0;
  const oreCapacity = structure.oreCapacity || 500;
  const orePercentage = (currentOre / oreCapacity) * 100;
  const isLowOre = orePercentage < 25;
  const oreNeeded = Object.values(structure.recipe || {})[0] || 0;
  const isOutOfOre = currentOre < oreNeeded;

  const oreType = Object.keys(structure.recipe || {})[0] || "";
  const availableOre =
    resources.find((r) => r.value === oreType && r.type === "ore")?.amount || 0;

  const refuelOptions = [
    { amount: 10, label: "10" },
    { amount: 50, label: "50" },
    { amount: 100, label: "100" },
    { amount: fuelCapacity - currentFuel, label: "Max" },
  ];

  const oreInputOptions = [
    { amount: 10, label: "10" },
    { amount: 50, label: "50" },
    { amount: 100, label: "100" },
    { amount: Math.min(oreCapacity - currentOre, availableOre), label: "Max" },
  ];

  const handleRefuel = (amount: number) => {
    if (amount <= 0) return;
    onRefuel(structure.id, amount);
  };

  const handleInputOre = (amount: number) => {
    if (amount <= 0) return;
    onInputOre(structure.id, amount);
  };

  return (
    <div
      className={`structure-card structure-card--smelting ${
        isOutOfFuel || isOutOfOre ? "structure-card--stopped" : ""
      }`}
    >
      <div className="structure-card__header">
        <h4 className="structure-card__name">{structure.name}</h4>
        <span className="structure-card__level">Level {structure.level}</span>
        <span
          className={`structure-card__status ${
            isOutOfFuel || isOutOfOre ? "status--stopped" : "status--active"
          }`}
        >
          {isOutOfFuel || isOutOfOre ? "STOPPED" : "ACTIVE"}
        </span>
      </div>

      <div className="structure-card__content">
        <div className="fuel-section">
          <div className="fuel-header">
            <span className="fuel-label">Fuel</span>
            <span
              className={`fuel-value ${isLowFuel ? "fuel-value--low" : ""}`}
            >
              {currentFuel.toFixed(1)} / {fuelCapacity}
            </span>
          </div>
          <div className="progress-bar">
            <div
              className={`progress-bar__fill ${
                isLowFuel ? "progress-bar__fill--low" : ""
              }`}
              style={{ width: `${fuelPercentage}%` }}
            />
          </div>
        </div>

        <div className="refuel-section">
          <p className="refuel-label">Refuel Options:</p>
          <div className="refuel-buttons">
            {refuelOptions.map((option) => {
              const cost = option.amount * FUEL_COST_PER_UNIT;
              const canAfford = money >= cost;
              const hasSpace = option.amount > 0;

              return (
                <button
                  key={option.label}
                  className="btn btn--refuel"
                  onClick={() => handleRefuel(option.amount)}
                  disabled={!canAfford || !hasSpace}
                  title={
                    !canAfford
                      ? "Not enough money"
                      : !hasSpace
                      ? "Tank is full"
                      : `Add ${option.amount} fuel for $${cost.toFixed(2)}`
                  }
                >
                  {option.label}{" "}
                  <span className="refuel-cost">(${cost.toFixed(2)})</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="fuel-section">
          <div className="fuel-header">
            <span className="fuel-label">Ore ({oreType})</span>
            <span className={`fuel-value ${isLowOre ? "fuel-value--low" : ""}`}>
              {currentOre.toFixed(1)} / {oreCapacity}
            </span>
          </div>
          <div className="progress-bar">
            <div
              className={`progress-bar__fill ${
                isLowOre ? "progress-bar__fill--low" : ""
              }`}
              style={{ width: `${orePercentage}%` }}
            />
          </div>
        </div>

        <div className="refuel-section">
          <p className="refuel-label">Input Ore (Available: {availableOre}):</p>
          <div className="refuel-buttons">
            {oreInputOptions.map((option) => {
              const hasOre = availableOre >= option.amount;
              const hasSpace = option.amount > 0;

              return (
                <button
                  key={option.label}
                  className="btn btn--refuel"
                  onClick={() => handleInputOre(option.amount)}
                  disabled={!hasOre || !hasSpace}
                  title={
                    !hasOre
                      ? "Not enough ore in inventory"
                      : !hasSpace
                      ? "Storage is full"
                      : `Add ${option.amount} ${oreType} ore`
                  }
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {!isMaxLevel && (
          <div className="structure-card__upgrade">
            <button
              className="btn btn--upgrade-sm"
              onClick={() => onUpgrade(structure.id)}
              disabled={!canAffordUpgrade}
            >
              Upgrade (${formatNumber(upgradeCost)})
            </button>
          </div>
        )}
        {isMaxLevel && <p className="structure-card__max-level">MAX LEVEL</p>}

        <button
          className="btn btn--collect"
          onClick={() => onCollect(structure.id)}
          disabled={!canCollect}
        >
          {canCollect
            ? `Collect ${Math.floor(structure.accumulated)}`
            : "Not ready"}
        </button>
      </div>
    </div>
  );
}

export default SmeltingStructure;
