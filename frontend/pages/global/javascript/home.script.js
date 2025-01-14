const nav = document.querySelector(".nav");
if (nav) {
  nav.innerHTML = `
    <div class="left" data-i18n="nav-brand" onclick="navigateToHome()"></div>
    <div class="center" data-i18n="nav-welcome"></div>
    <div class="right">
      <button class="logout-button" data-i18n="nav-logout" onclick="handleLogout()"></button>
    </div>
  `;

  applyTranslations();
}

function navigateToHome() {
  if (localStorage.getItem("username")) {
    window.location.href = `../global/home.html`;
  }
}

function handleLogout() {
  localStorage.clear();
  window.location.href = "../global/auth.html";
}
