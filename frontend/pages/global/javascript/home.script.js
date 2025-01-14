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

function navigateTo(location) {
  const user_type = localStorage.getItem("user_type");
  if (user_type) {
    window.location.href = `../${user_type}/${location}.html`;
  }
}
