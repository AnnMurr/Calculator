const wrapper = document.querySelector(".wrapper");
const btnOpenMoreWrap = document.querySelector(".calculator__openMore");
const btnOpenMore = document.querySelector(".calculator__openMore-btn");
const buttonsAdditional = document.querySelector(".calculator__buttons-additional");

btnOpenMore.addEventListener("click", function () {
  if (!buttonsAdditional.classList.contains("active")) {
    wrapper.style.maxWidth = "600px";
    btnOpenMore.style.transform = "rotate(180deg)";
    btnOpenMoreWrap.style.left = "30px";
    setTimeout(() => buttonsAdditional.classList.add("active"), 1000);
  } else {
    wrapper.style.maxWidth = "330px";
    btnOpenMore.style.transform = "rotate(0deg)";
    btnOpenMoreWrap.style.left = "20px";
    buttonsAdditional.classList.remove("active")
  }
});
