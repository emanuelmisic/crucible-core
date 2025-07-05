function formatNumber(number: number): string {
  if (number >= 10000 && number < 1000000) {
    let calculatedValue = Math.fround(number / 1000)
      .toString()
      .slice(0, 5)
      .split("");
    const calculatedValueLength = calculatedValue.length;
    for (let i = calculatedValueLength; i > 0; i--) {
      if (calculatedValue[i] === "0") {
        calculatedValue.pop();
      } else return calculatedValue.join("") + "k";
    }
    return calculatedValue.join("") + "k";
  } else if (number >= 1000000 && number < 100000000) {
    let calculatedValue = Math.fround(number / 1000000)
      .toString()
      .slice(0, 5)
      .split("");
    const calculatedValueLength = calculatedValue.length;
    for (let i = calculatedValueLength; i > 0; i--) {
      if (calculatedValue[i] === "0") {
        calculatedValue.pop();
      } else return calculatedValue.join("") + "M";
    }
    return calculatedValue.join("") + "M";
  }
  return number.toString();
}

export { formatNumber };
