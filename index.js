import Decimal from 'decimal.js';

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
  switch (event.target.innerText) {
    case "0":
    case "1":
    case "2":
    case "3":
    case "4":
    case "5":
    case "6":
    case "7":
    case "8":
    case "9":
        input.value === "0" && (input.value = "");
        typeNumber(event.target.innerText);
    break;
    case ".":
      typeNumber(event.target.innerText);
      break;
    case "AC":
      resetValues();
      break;
    case "×":
    case "÷":
    case "-":
    case "+":
      getOperations(event.target.innerText);
      break;
    case "=":
      countNumber();
      break;
    case "+/-":
      getNegativeOrPositiveNumber();
      break;
    case "%":
      toglePercent();
      break;
  }
}

function toglePercent() {
    if(lastCount && !count) {
        result = result = lastCount * 0.01; 
        input.value = result;
    } else {
      if(sing === '+' || sing === '-') {
        const value = +lastCount * +count / 100
        input.value = removeTrailingZeros(value.toFixed(7));
      } else if (sing === "×" || sing === "÷") {
        const value = +count / 100
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
        result = lastCountDecimal.minus(lastCountDecimal.times(countDecimal).dividedBy(100));
      } else if (sing === "+") {
        result = lastCountDecimal.plus(lastCountDecimal.times(countDecimal).dividedBy(100));
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
  lastCount = "";
  count = "";
  sing = "";
  result = "";
  input.value = "0";
}

function countNumber() {
  const lastCountDecimal = new Decimal(+lastCount);
  const countDecimal = new Decimal(+count);
  countPercent();

  if (result) {
    input.value = removeTrailingZeros(result.toFixed(7));
  } else if (lastCount && count && sing) {
    result =
      sing === "×"
        ? lastCountDecimal.times(countDecimal)
        : sing === "+"
        ? lastCountDecimal.plus(countDecimal)
        : sing === "-"
        ? lastCountDecimal.minus(countDecimal)
        : sing === "÷"
        ? lastCountDecimal.dividedBy(countDecimal)
        : null;
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
    lastCount = result;
    result = "";
    count = "";
  }

  if (sing && lastCount && count && !result) {
    const result =
      sing === "×"
        ? +lastCount * +count
        : sing === "+"
        ? +lastCount + +count
        : sing === "-"
        ? +lastCount - +count
        : sing === "÷"
        ? +lastCount / +count
        : null;

    input.value = result;
    lastCount = result;
    count = "";
    sing = value;
  } else {
    sing = value;
  }
}

function removeTrailingZeros(number) {
  let str = number.toString();
  let trimmed = str.replace(/\.?0+$/, '');
  return trimmed;
}
