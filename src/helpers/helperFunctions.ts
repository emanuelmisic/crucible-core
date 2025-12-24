import { STRUCTURES } from "@/constants/structures";

function calculateStructureUpgradeCost(str: GameStructure): number {
  const baseStructure = STRUCTURES.find((s) => s.id === str.id);
  if (baseStructure && Array.isArray(baseStructure.cost)) {
    return baseStructure.cost[str.level] || 0;
  }
  return 0;
}

function formatNumber(number: number): string {
  let calculatedValue = "";
  if (number >= 10000 && number < 1000000) {
    calculatedValue = (number / 1000).toString().slice(0, 5);
    return `${_removeExcessZero(calculatedValue)}k`;
  } else if (number >= 1000000 && number < 1000000000) {
    calculatedValue = (number / 1000000).toString().slice(0, 4);
    return `${_removeExcessZero(calculatedValue)}M`;
  } else if (number >= 1000000000 && number < 1000000000000) {
    calculatedValue = (number / 1000000000).toString().slice(0, 4);
    return `${_removeExcessZero(calculatedValue)}B`;
  }
  return number.toString();
}

function _removeExcessZero(value: string): string {
  let newValue = "";
  const list: string[] = value.split("");
  if (!list.includes(".")) return value;
  if (list[list.length - 1] === "0" || list[list.length - 1] === ".") {
    list.pop();
    newValue = list.join("");
    return _removeExcessZero(newValue);
  } else {
    newValue = list.join("");
    return newValue;
  }
}

export { formatNumber, calculateStructureUpgradeCost };
