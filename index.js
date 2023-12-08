import Decimal from "decimal.js";

const input = document.querySelector(".calculator__input");
const btns = document.querySelectorAll(".calculator__btn");

btns.forEach((btn) => btn.addEventListener("click", showNumber, true));

input.value = "0";
let lastCount = "";
let count = "";
let sing = "";
let result;
let percent = false;

function showNumber(event) {
  const btn = event.target.closest('.calculator__btn');
  const value = btn.innerText;
  const numericValue = parseFloat(value);

  if (value === "10x") {
    raiseTenToPower();
  } else if (value === "1∕x") {
    calculateReciprocal()
  } else if (value === "2√x") {
    calculateSquareRoot()
  } else if (value === "3√x") {
    calculateCubeRoot()
  } else if (!isNaN(numericValue)) {
    count === "0" && (count = "");
    input.value === "0" && (input.value = "");
    typeNumber(value);
  } else if (value === ".") {
    !input.value.includes(".") && typeNumber(value);
  } else if (value === "AC") {
    resetValues();
  } else if (value === "×" || value === "÷" || value === "-" || value === "+") {
    getOperations(event.target.innerText);
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
  } 
}

function toglePercent() {
  if (lastCount && !count) {
    result = lastCount * 0.01;
    input.value = result;
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
  } else if (lastCount && count && sing) {
    result = returnOperation();
    input.value = removeTrailingZeros(result.toFixed(7));
  }
}

function typeNumber(value) {
  if (sing) {
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

  if (sing && lastCount && count && !result) {
    const resultOfOperation = returnOperation();
    input.value = lastCount = resultOfOperation;
    count = "";
    sing = value;
  } else {
    sing = value;
  }
}

function returnOperation() {
  const lastCountDecimal = new Decimal(+lastCount);
  const countDecimal = new Decimal(+count);

  return sing === "×"
    ? lastCountDecimal.times(countDecimal)
    : sing === "+"
    ? lastCountDecimal.plus(countDecimal)
    : sing === "-"
    ? lastCountDecimal.minus(countDecimal)
    : sing === "÷"
    ? lastCountDecimal.dividedBy(countDecimal)
    : sing === "xy"
    ? lastCountDecimal.pow(countDecimal)
    : null;
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
  const resultOfOperation = input.value = 1 / input.value
  valueAssignment(resultOfOperation)
}

function calculateSquareRoot() {
  const resultOfOperation = Math.sqrt(input.value);
  valueAssignment(resultOfOperation)
}

function calculateCubeRoot() {
  const resultOfOperation = Math.cbrt(input.value);
  valueAssignment(resultOfOperation)
}

function raiseToPower(value) {
 
  if (result) {
    lastCount = result;
    result = count = "";
  }
  sing = value;
}

function valueAssignment(value) {
  result ? (result = value) : count ? (count = value) : (lastCount = value);
  input.value = value;
}

function removeTrailingZeros(number) {
  let str = number.toString();
  let trimmed = str.replace(/\.?0+$/, "");
  return trimmed;
}
