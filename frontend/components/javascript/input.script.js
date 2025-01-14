document.addEventListener("DOMContentLoaded", function () {
  const inputs = document.querySelectorAll(".input-container input");

  inputs.forEach((input) => {
    const container = input.closest(".input-container");
    const clearButton = container.querySelector(".clear-button");
    const toggleButton = container.querySelector(".toggle-password");

    if (clearButton) {
      clearButton.addEventListener("click", () => {
        input.value = "";
        input.focus();
      });
    }

    if (toggleButton) {
      toggleButton.addEventListener("click", () => {
        const isPassword = input.getAttribute("type") === "password";
        input.setAttribute("type", isPassword ? "text" : "password");
        toggleButton.innerHTML = isPassword
          ? '<i class="fa-solid fa-eye-slash"></i>'
          : '<i class="fa-solid fa-eye"></i>';
        input.focus();
      });
    }
  });
});

function resetForm(formId) {
  document.getElementById(formId).reset();
}
