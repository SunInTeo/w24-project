function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toast-message");
  toastMessage.setAttribute("data-i18n", message);
  toast.className = `toast show ${type}`;
  applyTranslations();

  setTimeout(() => {
    hideToast();
  }, 2000);
}

function hideToast() {
  const toast = document.getElementById("toast");
  toast.classList.remove("show");
  toast.classList.add("hidden");
}
