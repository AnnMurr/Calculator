import Decimal from "decimal.js";

const input = document.querySelector(".calculator__input");
const btns = document.querySelectorAll(".calculator__btn");

btns.forEach((btn) => btn.addEventListener("click", showNumber, true));

input.value = "0";
let lastCount = "";
let count = "";
let raiseToPowerCount = "";
let signraiseToPower = "";
let countRoot = "";
let signRoot = "";
let sing = "";
let result;
let percent = false;

function showNumber(event) {
  const btn = event.target.closest(".calculator__btn");
  const value = btn.innerText;
  const numericValue = parseFloat(value);

  if (value === "10x") {
    raiseTenToPower();
  } else if (value === "1∕x") {
    calculateReciprocal();
  } else if (value === "2√x") {
    calculateSquareRoot();
  } else if (value === "3√x") {
    calculateCubeRoot();
  } else if (value === "y√x") {
    calculateRoot(event.target.innerText);
  } else if (value === "ln") {
    calculateNaturalLog();
  } else if (value === "log10") {
    calculateLog10();
  } else if (value === "sin") {
    calculateSin();
  } else if (value === "cos") {
    calculateCos();
  } else if (value === "tan") {
    calculateTan();
  } else if (value === "cosh") {
    calculateCosh();
  } else if (value === "tanh") {
    calculateTanh();
  } else if (value === "sinh") {
    calculateSinh();
  } else if (value === "e") {
    calculateExponential();
  } else if (value === "x!") {
    getfactorial();
  } else if (value === ".") {
    !input.value.includes(".") && typeNumber(value);
  } else if (value === "AC") {
    resetValues();
  } else if (value === "=") {
    countNumber();
  } else if (value === "+/-") {
    getNegativeOrPositiveNumber();
  } else if (value === "%") {
    toglePercent();
  } else if (value === "Rand") {
    getRandomNamber();
  } else if (value === "x2") {
    toSquare();
  } else if (value === "x3") {
    raiseToThirdPower();
  } else if (value === "xy") {
    raiseToPower(event.target.innerText);
  } else if (value === "ex") {
    exponentToPower();
  } else if (value === "×" || value === "÷" || value === "-" || value === "+") {
    getOperations(event.target.innerText);
  } else if (!isNaN(numericValue)) {
    count === "0" && (count = "");
    input.value === "0" && (input.value = "");
    console.log(input.value === "NaN");
    (input.value.includes("NaN") ||
      input.value.includes("Error") ||
      input.value.includes("Infinity")) &&
      (input.value = "");
    typeNumber(value);
  }
}

function toglePercent() {
  if (lastCount && !count) {
    result = lastCount * 0.01;
    input.value = removeTrailingZeros(result.toFixed(7));
  } else {
    if (sing === "+" || sing === "-") {
      const value = (+lastCount * +count) / 100;
      input.value = removeTrailingZeros(value.toFixed(7));
    } else if (sing === "×" || sing === "÷") {
      const value = +count / 100;
      input.value = removeTrailingZeros(value.toFixed(7));
    }
    percent = true;
  }
}

function countPercent() {
  if (percent) {
    if (lastCount) {
      const lastCountDecimal = new Decimal(+lastCount);
      const countDecimal = new Decimal(+count);
      if (sing === "-") {
        result = lastCountDecimal.minus(
          lastCountDecimal.times(countDecimal).dividedBy(100)
        );
      } else if (sing === "+") {
        result = lastCountDecimal.plus(
          lastCountDecimal.times(countDecimal).dividedBy(100)
        );
      } else if (sing === "×") {
        result = lastCountDecimal.times(countDecimal).dividedBy(100);
      } else if (sing === "÷") {
        result = lastCountDecimal.dividedBy(countDecimal.dividedBy(100));
      }
    }
  }
  percent = false;
}

function getNegativeOrPositiveNumber() {
  let target = result || count || lastCount;

  if (target) {
    target = +target >= 0 ? `-${target}` : `${target.slice(1)}`;
    input.value = target;
  }

  result ? (result = target) : count ? (count = target) : (lastCount = target);
}

function resetValues() {
  lastCount = count = sing = result = "";
  input.value = "0";
}

function countNumber() {
  countPercent();

  if (result) {
    input.value = removeTrailingZeros(result.toFixed(7));
  } else if ((lastCount && count && sing) || signraiseToPower || signRoot) {
    result = returnOperation();
    input.value = removeTrailingZeros(result.toFixed(7));
  }
}

function typeNumber(value) {
  if (sing || signraiseToPower || signRoot) {
    count += value;
    input.value = count;
  } else {
    input.value += value;
    lastCount += value;
  }
}

function getOperations(value) {
  countPercent();

  if (result) {
    input.value = removeTrailingZeros(result.toFixed(7));
    lastCount = result;
    result = count = "";
  }

  if (sing || signraiseToPower || (signRoot && lastCount && count && !result)) {
    const resultOfOperation = returnOperation();
    input.value = lastCount = removeTrailingZeros(resultOfOperation.toFixed(7));
    count = "";
    sing = value;
  } else {
    sing = value;
  }
}

function returnOperation() {
  const lastCountDecimal = new Decimal(+lastCount);
  const countDecimal = new Decimal(+count);

  if (lastCount && count && raiseToPowerCount) {
    const raiseToPowerCountDecimal = new Decimal(+raiseToPowerCount);
    raiseToPowerCount = signraiseToPower = "";
    const raiseToPowerResult = lastCountDecimal.pow(countDecimal);

    return sing === "×"
      ? raiseToPowerCountDecimal.times(raiseToPowerResult)
      : sing === "+"
      ? raiseToPowerCountDecimal.plus(raiseToPowerResult)
      : sing === "-"
      ? raiseToPowerCountDecimal.minus(raiseToPowerResult)
      : sing === "÷"
      ? raiseToPowerCountDecimal.dividedBy(raiseToPowerResult)
      : null;
  } else if (lastCount && count && countRoot) {
    const countRootDecimal = new Decimal(+countRoot);
    countRoot = signRoot = "";
    const countRootResult = Math.pow(+lastCount, 1 / +count);
    const countRootResultDecimal = new Decimal(countRootResult);

    return sing === "×"
      ? countRootDecimal.times(countRootResultDecimal)
      : sing === "+"
      ? countRootDecimal.plus(countRootResultDecimal)
      : sing === "-"
      ? countRootDecimal.minus(countRootResultDecimal)
      : sing === "÷"
      ? countRootDecimal.dividedBy(countRootResultDecimal)
      : null;
  } else if (signraiseToPower) {
    signraiseToPower = "";
    return lastCountDecimal.pow(countDecimal);
  } else if (signRoot) {
    signRoot = "";
    const countRootResult = Math.pow(+lastCount, 1 / +count);
    return Decimal(countRootResult);
  } else {
    return sing === "×"
      ? lastCountDecimal.times(countDecimal)
      : sing === "+"
      ? lastCountDecimal.plus(countDecimal)
      : sing === "-"
      ? lastCountDecimal.minus(countDecimal)
      : sing === "÷"
      ? lastCountDecimal.dividedBy(countDecimal)
      : null;
  }
}

function toSquare() {
  const resultOfOperation = input.value * input.value;
  valueAssignment(resultOfOperation);
}

function raiseToThirdPower() {
  const resultOfOperation = input.value * input.value * input.value;
  valueAssignment(resultOfOperation);
}

function getRandomNamber() {
  const randomNum = Math.floor(Math.random() * 1000000);
  valueAssignment(randomNum);
}

function raiseTenToPower() {
  const resultOfOperation = Math.pow(10, +input.value);
  valueAssignment(resultOfOperation);
}

function exponentToPower() {
  const resultOfOperation = Math.exp(input.value);
  valueAssignment(resultOfOperation);
}

function calculateReciprocal() {
  const resultOfOperation = (input.value = 1 / input.value);
  valueAssignment(resultOfOperation);
}

function calculateSquareRoot() {
  const resultOfOperation = Math.sqrt(input.value);
  valueAssignment(resultOfOperation);
}

function calculateCubeRoot() {
  const resultOfOperation = Math.cbrt(input.value);
  valueAssignment(resultOfOperation);
}

function calculateNaturalLog() {
  const resultOfOperation = Math.log(input.value);
  valueAssignment(resultOfOperation);
}

function calculateLog10() {
  const resultOfOperation = Math.log10(input.value);
  valueAssignment(resultOfOperation);
}

function getfactorial() {
  const factorialResult = calculateFactorial(input.value);
  valueAssignment(factorialResult);
}

function calculateFactorial(value) {
  try {
    return value === 1 ? 1 : value * calculateFactorial(value - 1);
  } catch (e) {
    console.error(e);
  }
}

function calculateSin() {
  const radians = (Math.PI / 180) * input.value;
  const resultOfOperation = Math.sin(radians);
  valueAssignment(resultOfOperation);
}

function calculateCos() {
  const radians = (Math.PI / 180) * input.value;
  const resultOfOperation = Math.cos(radians);
  valueAssignment(resultOfOperation);
}

function calculateTan() {
  const radians = (Math.PI / 180) * input.value;
  const resultOfOperation = Math.tan(radians);
  valueAssignment(resultOfOperation);
}

function calculateExponential() {
  const resultOfOperation = Math.E;
  valueAssignment(resultOfOperation);
}

function calculateCosh() {
  const resultOfOperation = Math.cosh(input.value);
  valueAssignment(resultOfOperation);
}

function calculateTanh() {
  const resultOfOperation = Math.tanh(input.value);
  valueAssignment(resultOfOperation);
}

function calculateSinh() {
  const resultOfOperation = Math.sinh(input.value);
  valueAssignment(resultOfOperation);
}

function calculateRoot(value) {
  processValues("countRoot", "signRoot", value);
}

function raiseToPower(value) {
  processValues("raiseToPowerCount", "signraiseToPower", value);
}

function processValues(valueCount, valueSign, value) {
  if (lastCount && sing) {
    valueCount === "countRoot"
      ? (countRoot = lastCount)
      : (raiseToPowerCount = lastCount);
    lastCount = count;
    count = "";
  }
  if (result) {
    lastCount = result;
    result = count = "";
  }
  valueSign === "signRoot" ? (signRoot = value) : (signraiseToPower = value);
}

function valueAssignment(value) {
  result ? (result = value) : count ? (count = value) : (lastCount = value);
  input.value = removeTrailingZeros(value.toFixed(7));
}

function removeTrailingZeros(number) {
  let str = number.toString();
  let trimmed = str.replace(/\.?0+$/, "");
  let res;
  trimmed.length > 10 && (res = trimmed.slice(0, 13));

  return res ? res : trimmed;
}
