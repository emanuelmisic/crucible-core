function formatNumber(number: number): string {
  if (number >= 10000 && number < 1000000) {
    let calculatedValue = (number / 1000).toString().slice(0, 5);
    return `${_removeExcessZero(calculatedValue)}k`;
  } else if (number >= 1000000 && number < 1000000000) {
    let calculatedValue = (number / 1000000).toString().slice(0, 5);
    return `${_removeExcessZero(calculatedValue)}M`;
  } else if (number >= 1000000000 && number < 1000000000000) {
    let calculatedValue = (number / 1000000000).toString().slice(0, 5);
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

export { formatNumber };
