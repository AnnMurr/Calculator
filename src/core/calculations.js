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

  if (
    value === "10x" ||
    value === "log10" ||
    value === "ex" ||
    value === "ln"
  ) {
    performExponentialAndLogarithmicOperation(value);
  } else if (value === "2√x" || value === "3√x") {
    calculateSquareAndCubeRoot(value);
  } else if (value === "y√x" || value === "xy") {
    performPowerCalculation(value);
  } else if (value === "x2" || value === "x3") {
    toPower(value);
  } else if (value === "sin" || value === "cos" || value === "tan") {
    calculateTrigonometricFunction(value);
  } else if (value === "cosh" || value === "tanh" || value === "sinh") {
    calculateUniversalHyperbolic(value);
  } else if (value === "1∕x" || value === "x!" || value === "e") {
    performMathematicalOperation(value);
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
  } else if (value === "×" || value === "÷" || value === "-" || value === "+") {
    getOperations(event.target.innerText);
  } else if (!isNaN(numericValue)) {
    removeValue();
    typeNumber(value);
  }
}

function removeValue() {
  count === "0" && (count = "");
  (input.value === "0" ||
    input.value.includes("NaN") ||
    input.value.includes("Error") ||
    input.value.includes("Infinity")) &&
    (input.value = "");
}

function typeNumber(value) {
  if (result) {
    if (value === ".") {
      lastCount = result;
      result = count = "";
      input.value = lastCount += value;
    } else {
      result = count = lastCount = "";
      input.value = lastCount += value;
    }
  } else if (sing || signraiseToPower || signRoot) {
    count += value;
    input.value = count;
  } else {
    input.value += value;
    lastCount += value;
  }
}

function toglePercent() {
  if (result) {
    result = result * 0.01;
    input.value = removeTrailingZeros(result.toFixed(7));
  } else if (lastCount && !count) {
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
    Number(target);
    target = target >= 0 ? `-${target}` : `${target.toString().slice(1)}`;
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

function getOperations(value) {
  countPercent();

  if (result) {
    input.value = removeTrailingZeros(result);
    lastCount = result;
    result = count = "";
  } else if (
    sing ||
    signraiseToPower ||
    (signRoot && lastCount && count && !result)
  ) {
    console.log(lastCount);
    const resultOfOperation = returnOperation();
    input.value = lastCount = removeTrailingZeros(resultOfOperation.toFixed(7));
    count = "";
    sing = value;
  }

  sing = value;
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
    const operationResult =
      sing === "×"
        ? lastCountDecimal.times(countDecimal)
        : sing === "+"
        ? lastCountDecimal.plus(countDecimal)
        : sing === "-"
        ? lastCountDecimal.minus(countDecimal)
        : sing === "÷"
        ? lastCountDecimal.dividedBy(countDecimal)
        : null;

    sing = "";
    return operationResult;
  }
}

function calculateFactorial(value) {
  try {
    return value === 1 ? 1 : value * calculateFactorial(value - 1);
  } catch (e) {
    console.error(e);
  }
}

function getRandomNamber() {
  const randomNum = Math.floor(Math.random() * 1000000);
  valueAssignment(randomNum);
}

function calculateSquareAndCubeRoot(value) {
  const resultOfOperation =
    value === "2√x" ? Math.sqrt(input.value) : Math.cbrt(input.value);
  valueAssignment(resultOfOperation);
}

function toPower(value) {
  const resultOfOperation =
    value === "x2"
      ? input.value * input.value
      : input.value * input.value * input.value;
  valueAssignment(resultOfOperation);
}

function performExponentialAndLogarithmicOperation(value) {
  const resultOfOperation =
    value === "10x"
      ? Math.pow(10, +input.value)
      : value === "log10"
      ? Math.log10(input.value)
      : value === "ln"
      ? Math.log(input.value)
      : Math.exp(input.value);
  valueAssignment(resultOfOperation);
}

function performMathematicalOperation(value) {
  const resultOfOperation =
    value === "1∕x"
      ? (input.value = 1 / input.value)
      : value === "x!"
      ? calculateFactorial(input.value)
      : Math.E;

  valueAssignment(resultOfOperation);
}

function calculateTrigonometricFunction(value) {
  const radians = (Math.PI / 180) * input.value;
  console.log(value);
  const resultOfOperation =
    value === "sin"
      ? Math.sin(radians)
      : value === "cos"
      ? Math.cos(radians)
      : Math.tan(radians);
  valueAssignment(resultOfOperation);
}

function calculateUniversalHyperbolic(value) {
  const resultOfOperation =
    value === "cosh"
      ? Math.cosh(input.value)
      : value === "tanh"
      ? Math.tanh(input.value)
      : Math.sinh(input.value);
  valueAssignment(resultOfOperation);
}

function performPowerCalculation(value) {
  if (lastCount && sing) {
    value === "y√x" ? (countRoot = lastCount) : (raiseToPowerCount = lastCount);
    lastCount = count;
    count = "";
  }
  if (result) {
    lastCount = result;
    result = count = "";
  }
  value === "y√x" ? (signRoot = value) : (signraiseToPower = value);
}

function valueAssignment(value) {
  if (
    value.toString() !== "NaN" &&
    value.toString() !== "Error" &&
    value.toString() !== "Infinity"
  ) {
    result ? (result = value) : count ? (count = value) : (lastCount = value);
    input.value = value;
  } else {
    input.value = value;
  }
}

function removeTrailingZeros(number) {
  let str = number.toString();
  let trimmed = str.replace(/\.?0+$/, "");
  let res;
  trimmed.length > 10 && (res = trimmed.slice(0, 13));
  return res ? res : trimmed;
}
