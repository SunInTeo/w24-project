function navigateToHome() {
  window.location.href = `../global/home.html`;
}

const nav = document.querySelector(".nav");
if (nav) {
  nav.innerHTML = `
    <div class="left" data-i18n="nav-brand"></div>
    <div class="center" data-i18n="nav-welcome"></div>
    <div class="right">
      <button class="logout-button" data-i18n="nav-logout" onclick="handleLogout()"></button>
    </div>
  `;

  applyTranslations();
  const leftElement = nav.querySelector(".left");
  const logoutButton = nav.querySelector(".logout-button");

  if (leftElement) {
    leftElement.addEventListener("click", navigateToHome);
  }

  if (logoutButton) {
    logoutButton.addEventListener("click", handleLogout);
  }
}

function handleLogout() {
  console.log("Logging out...");
  window.location.href = `../global/auth.html`;
}
function navigateTo(location) {
  window.location.href = `../student/${location}.html`;
  //otherwhise admin
}
