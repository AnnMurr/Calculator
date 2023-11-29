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
        percent = true;
    }
  
}

function countPercent() {
  if (percent) {
    if (lastCount) {
      if (sing === "-") {
            result = +lastCount - (+lastCount * +count) / 100;
      } else if (sing === "+") {
        result = +lastCount + (+lastCount * +count) / 100;
      } else if (sing === "×") {
        result = (+lastCount * +count) / 100;
      } else if (sing === "÷") {
        result = +lastCount / (+count / 100);
      }
    }
  }
  percent = false;
}

function getNegativeOrPositiveNumber() {
  let target = result || count || lastCount;

  if (target) {
    target = +target > 0 ? `-${target}` : `${target.slice(1)}`;
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
    console.log(lastCount)
    console.log(count)
    console.log(0.2 + 0.4)
  countPercent();

  if (result) {
    input.value = result;
  } else if (lastCount && count && sing) {
    result =
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
