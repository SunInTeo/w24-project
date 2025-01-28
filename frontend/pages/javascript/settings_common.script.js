async function changePassword() {
  const changePassForm = document.getElementById("changePasswordForm");

  const oldPassword = document.getElementById("oldPasswordInput").value.trim();
  const newPassword = document.getElementById("passwordInput").value.trim();
  const confirmPassword = document
    .querySelector('[data-i18n-placeholder="confirm-password"]')
    .value.trim();

  if (newPassword !== confirmPassword) {
    showToast("passwords-dont-match", "warning");
    return;
  }

  try {
    const response = await fetch("../../../backend/change_pass.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        oldPassword: oldPassword,
        newPassword: newPassword,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      showToast("error-change-password", "error");
      throw new Error(errorData.message || "Failed to change password.");
    }

    const result = await response.json();

    if (result.success) {
      showToast("success-change-password");
      changePassForm.reset();
    } else {
      showToast("error-change-password", "error");
    }
  } catch (error) {
    console.error("Error:", error);
    showToast("error-change-password", "error");
  } finally {
    closeModal("change-pass-modal", "change-pass-modal-overlay");
    changePassForm.reset();
  }
}

function renderUserDetails() {
  const nameInput = document.getElementById("nameInput");
  const emailInput = document.getElementById("emailInput");
  const userNameInput = document.getElementById("userName");
  const facultyNumberInput = document.getElementById("facultyNumber");

  nameInput.value = localStorage.getItem("name") || "";
  emailInput.value = localStorage.getItem("email") || "";
  userNameInput.value = localStorage.getItem("username") || "";
  if (facultyNumberInput) {
    facultyNumberInput.value = localStorage.getItem("faculty_number") || "";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderUserDetails();
});
