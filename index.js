import Decimal from "decimal.js";

const input = document.querySelector(".calculator__input");
const btns = document.querySelectorAll(".calculator__btn");

btns.forEach((btn) => btn.addEventListener("click", showNumber));

input.value = "0";
let lastCount = "";
let count = "";
let sing = "";
let result;
let percent = false;

function showNumber(event) {
  const value = event.target.innerText;
  const numericValue = parseFloat(value);

  if (!isNaN(numericValue)) {
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
    : null;
}

function removeTrailingZeros(number) {
  let str = number.toString();
  let trimmed = str.replace(/\.?0+$/, "");
  return trimmed;
}
