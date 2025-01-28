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

document.addEventListener("DOMContentLoaded", () => {
  document
    .querySelector(".signup-button")
    .addEventListener("click", async function () {
      event.preventDefault();
      await handleRegister();
    });
  document
    .querySelector(".signup-button")
    .addEventListener("keydown", async function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        await handleRegister();
      }
    });
  document
    .querySelector(".login-button")
    .addEventListener("click", async function () {
      event.preventDefault();
      await handleLogin();
    });
  document
    .querySelector(".login-button")
    .addEventListener("keydown", async function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        await handleLogin();
      }
    });
});

async function handleRegister() {
  const userType = document.querySelector(
    'input[name="userType"]:checked'
  )?.value;
  const name = document.getElementById("fullNameInput").value.trim();
  const email = document.getElementById("emailInputSignup").value.trim();
  const username = document.getElementById("usernameInputSignup").value.trim();
  const facultyNumber = document
    .getElementById("facultyNumberInput")
    .value.trim();
  const password = document.getElementById("passwordInputSignup").value.trim();
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
    showToast("all-fields-required", "warning");
    return;
  }

  if (password !== confirmPassword) {
    showToast("passwords-dont-match", "warning");
    return;
  }

  const formData = new FormData();
  formData.append("userType", userType);
  formData.append("name", name);
  formData.append("email", email);
  formData.append("username", username);
  if (userType === "student") {
    formData.append("facultyNumber", facultyNumber);
  }
  formData.append("password", password);

  try {
    const response = await fetch("../../../backend/register.php", {
      method: "POST",
      body: formData,
    });

    const contentType = response.headers.get("Content-Type");

    if (contentType && contentType.includes("application/json")) {
      const result = await response.json();
      if (result.status === "success") {
        setUserInLocalStorage(result.user);
        window.location.href = "home.html";
      } else {
        showToast("error-register", "error");
      }
    } else {
      const text = await response.text();
      console.error("Unexpected response:", text);
      showToast("error-register", "error");
    }
  } catch (error) {
    console.error("Error:", error);
    showToast("error-register", "error");
  }
}

async function handleLogin() {
  const username = document.getElementById("textInput").value.trim();
  const password = document.getElementById("passwordInput").value.trim();

  if (!username || !password) {
    showToast("all-fields-required", "warning");
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

    const result = await response.json();

    if (response.ok && result.status === "success") {
      setUserInLocalStorage(result.user);
      window.location.href = "home.html";
    } else {
      showToast("error-login", "error");
    }
  } catch (error) {
    console.error("Error:", error);
    showToast("error-login", "error");
  }
}

function setUserInLocalStorage(result) {
  localStorage.setItem("user_type", result.user_type);
  localStorage.setItem("user_id", result.user_id);
  localStorage.setItem("username", result.username);
  localStorage.setItem("faculty_number", result.faculty_number);
  localStorage.setItem("name", result.name);
  localStorage.setItem("project_id", result.project_id);
  localStorage.setItem("essay_id", result.essay_id);
  localStorage.setItem(
    "essay_presentation_datetime",
    result.essay_presentation_datetime
  );
  localStorage.setItem(
    "project_presentation_datetime",
    result.project_presentation_datetime
  );
}

async function checkUserSession() {
  try {
    const response = await fetch("../../../validate_session.php");
    if (response.status === 401) {
      console.warn("User is not logged in, redirecting...");
      if (!window.location.pathname.includes("auth.html")) {
        window.location.href = "auth.html";
      }
      return;
    }

    const data = await response.json();

    if (response.ok && data.status === "success") {
      setUserInLocalStorage(data.user);
      console.log("User session validated");
    } else {
      console.warn("Clearing session and redirecting...");
      localStorage.clear();
      if (!window.location.pathname.includes("auth.html")) {
        window.location.href = "auth.html";
      }
    }
  } catch (error) {
    console.error("Error validating session:", error);
    if (!window.location.pathname.includes("auth.html")) {
      window.location.href = "auth.html";
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("auth.html")) {
    checkUserSession();
  }
});

function preventAuthPageAccess() {
  const userId = localStorage.getItem("user_id");

  if (userId && window.location.pathname.includes("auth.html")) {
    console.warn("You are already logged in!");
    window.location.href = "home.html";
  }
}

document.addEventListener("DOMContentLoaded", preventAuthPageAccess);

window.addEventListener("popstate", (event) => {
  preventAuthPageAccess();
});
