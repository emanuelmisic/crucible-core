import React from "react";
import { useGame } from "@/contexts/GameContext";

import { FUEL_COST_PER_UNIT } from "@/constants/structures";

function StructuresPanel() {
  const { structures, money, resources, collectResources, refuelStructure, inputOre } = useGame();

  // ONLY show owned structures
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
              <MiningStructureCard
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
              <SmeltingStructureCard
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

interface MiningStructureCardProps {
  structure: GameStructure;
  onCollect: (id: string) => void;
}

const MiningStructureCard: React.FC<MiningStructureCardProps> = ({
  structure,
  onCollect,
}) => {
  const canCollect = structure.accumulated >= 1;

  return (
    <div className="structure-card structure-card--mining">
      <div className="structure-card__header">
        <h4 className="structure-card__name">{structure.name}</h4>
        <span className="structure-card__level">Level {structure.level}</span>
      </div>

      <div className="structure-card__content">
        <div className="structure-card__stat">
          <span className="stat__label">Output:</span>
          <span className="stat__value">
            {structure.generationRate}/s {structure.resourceType}
          </span>
        </div>

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
};

// Smelting structure card (with fuel and ore management)
interface SmeltingStructureCardProps {
  structure: GameStructure;
  money: number;
  resources: GameResource[];
  onCollect: (id: string) => void;
  onRefuel: (id: string, amount: number) => void;
  onInputOre: (id: string, amount: number) => void;
}

const SmeltingStructureCard: React.FC<SmeltingStructureCardProps> = ({
  structure,
  money,
  resources,
  onCollect,
  onRefuel,
  onInputOre,
}) => {
  const canCollect = structure.accumulated >= 1;

  // Fuel state
  const currentFuel = structure.currentFuel || 0;
  const fuelCapacity = structure.fuelCapacity || 100;
  const fuelPercentage = (currentFuel / fuelCapacity) * 100;
  const isLowFuel = fuelPercentage < 25;
  const isOutOfFuel = currentFuel <= 0;

  // Ore state
  const currentOre = structure.currentOre || 0;
  const oreCapacity = structure.oreCapacity || 500;
  const orePercentage = (currentOre / oreCapacity) * 100;
  const isLowOre = orePercentage < 25;
  const oreNeeded = Object.values(structure.recipe || {})[0] || 0;
  const isOutOfOre = currentOre < oreNeeded;

  // Get ore type and available amount from inventory
  const oreType = Object.keys(structure.recipe || {})[0] || "";
  const availableOre = resources.find(
    (r) => r.value === oreType && r.type === "ore"
  )?.amount || 0;

  // Refuel package amounts
  const refuelOptions = [
    { amount: 10, label: "10" },
    { amount: 50, label: "50" },
    { amount: 100, label: "100" },
    { amount: fuelCapacity - currentFuel, label: "Max" },
  ];

  // Ore input package amounts
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
        <span
          className={`structure-card__status ${
            isOutOfFuel || isOutOfOre ? "status--stopped" : "status--active"
          }`}
        >
          {isOutOfFuel || isOutOfOre ? "STOPPED" : "ACTIVE"}
        </span>
      </div>

      <div className="structure-card__content">
        {/* Stats */}
        <div className="structure-card__stats">
          <div className="structure-card__stat">
            <span className="stat__label">Output:</span>
            <span className="stat__value">
              {structure.generationRate}/s {structure.resourceType} ingots
            </span>
          </div>
          {structure.recipe && (
            <div className="structure-card__stat">
              <span className="stat__label">Consumes:</span>
              <span className="stat__value">
                {Object.entries(structure.recipe)
                  .map(([res, amt]) => `${amt} ${res}`)
                  .join(", ")}
              </span>
            </div>
          )}
        </div>

        {/* Fuel Bar */}
        <div className="fuel-section">
          <div className="fuel-header">
            <span className="fuel-label">Fuel</span>
            <span
              className={`fuel-value ${isLowFuel ? "fuel-value--low" : ""}`}
            >
              {currentFuel.toFixed(1)} / {fuelCapacity}
            </span>
          </div>
          <div className="fuel-bar">
            <div
              className={`fuel-bar__fill ${
                isLowFuel ? "fuel-bar__fill--low" : ""
              }`}
              style={{ width: `${fuelPercentage}%` }}
            />
          </div>
        </div>

        {/* Refuel Controls */}
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

        {/* Ore Bar */}
        <div className="fuel-section">
          <div className="fuel-header">
            <span className="fuel-label">Ore ({oreType})</span>
            <span
              className={`fuel-value ${isLowOre ? "fuel-value--low" : ""}`}
            >
              {currentOre.toFixed(1)} / {oreCapacity}
            </span>
          </div>
          <div className="fuel-bar">
            <div
              className={`fuel-bar__fill ${
                isLowOre ? "fuel-bar__fill--low" : ""
              }`}
              style={{ width: `${orePercentage}%` }}
            />
          </div>
        </div>

        {/* Ore Input Controls */}
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

        {/* Collect Button */}
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
};

export default StructuresPanel;
