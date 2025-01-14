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

document
  .querySelector(".signup-button")
  .addEventListener("click", async function () {
    const userType = document.querySelector(
      'input[name="userType"]:checked'
    ).value;
    const name = document.getElementById("fullNameInput").value.trim();
    const email = document.getElementById("emailInputSignup").value.trim();
    const username = document
      .getElementById("usernameInputSignup")
      .value.trim();
    const facultyNumber = document
      .getElementById("facultyNumberInput")
      .value.trim();
    const password = document
      .getElementById("passwordInputSignup")
      .value.trim();
    const confirmPassword = document
      .getElementById("passwordRepeatInputSignup")
      .value.trim();

    if (
      !name ||
      !email ||
      !username ||
      !password ||
      (userType === "student" && !facultyNumber)
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    const formData = new FormData();
    formData.append("userType", userType);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("username", username);
    formData.append("facultyNumber", facultyNumber);
    formData.append("password", password);
    try {
      const response = await fetch("/w24-project/backend/register.php", {
        method: "POST",
        body: formData,
      });

      const contentType = response.headers.get("Content-Type");
      if (contentType && contentType.includes("application/json")) {
        const result = await response.json();
        if (response.ok) {
          setUserInLocalStorage(result);
          window.location.href = "/w24-project/frontend/pages/global/home.html";
        } else {
          alert(result.message || "Registration failed.");
        }
      } else {
        const text = await response.text();
        console.error("Unexpected response:", text);
        alert(
          "An unexpected error occurred. Please check the console for details."
        );
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while registering. Please try again later.");
    }
  });

document
  .querySelector(".login-button")
  .addEventListener("click", async function () {
    const username = document.getElementById("textInput").value.trim();
    const password = document.getElementById("passwordInput").value.trim();

    if (!username || !password) {
      alert("Please enter both username and password.");
      return;
    }

    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    try {
      const response = await fetch("../../../backend/login.php", {
        method: "POST",
        body: formData,
      });

      const contentType = response.headers.get("Content-Type");
      if (contentType && contentType.includes("application/json")) {
        const result = await response.json();
        console.log(result);
        console.log(response);

        if (response.ok) {
          setUserInLocalStorage(result);
          window.location.href = "/w24-project/frontend/pages/global/home.html";
        } else {
          alert(result.message || "Login failed.");
        }
      } else {
        const text = await response.text();
        console.error("Unexpected response:", text);
        alert("An unexpected error occurred. Please check the console.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while logging in. Please try again later.");
    }
  });

function setUserInLocalStorage(result) {
  if (result.user) {
    localStorage.setItem("user_type", result.user.user_type);
    localStorage.setItem("user_id", result.user.user_id);
    localStorage.setItem("username", result.user.username);
  }
}
