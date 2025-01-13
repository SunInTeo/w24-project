const loginForm = document.querySelector(".login-form"),
  signupForm = document.querySelector(".signup-form"),
  backLayer = document.querySelector(".back-layer"),
  facultyNumberInput = document.querySelector(".faculty-number");
dividerPlaceholed = document.querySelector(".divider-placeholder");
dividerPlaceholed.style.display = "none";

document.querySelector(".login button").addEventListener("pointerdown", () => {
  signupForm.classList.remove("active");
  loginForm.classList.add("active");
  backLayer.style.clipPath = "";
});

document.querySelector(".signup button").addEventListener("pointerdown", () => {
  loginForm.classList.remove("active");
  signupForm.classList.add("active");
  backLayer.style.clipPath = "inset(0 0 0 50%)";
});

const userTypeRadios = document.querySelectorAll("input[name='userType']");
userTypeRadios.forEach((radio) => {
  radio.addEventListener("change", (event) => {
    if (event.target.value === "teacher") {
      facultyNumberInput.style.display = "none";
      dividerPlaceholed.style.display = "flex";
    } else {
      facultyNumberInput.style.display = "flex";
      dividerPlaceholed.style.display = "none";
    }
  });
});

document
  .querySelector(".forgotten-password-container a")
  .addEventListener("click", (event) => {
    event.preventDefault();
    openModal("forgotten-pass-modal", "forgotten-pass-modal-overlay");
  });

function navigateToHome() {
  window.location.href = "home.html";
}
