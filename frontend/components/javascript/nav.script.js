(function () {


  function isPageExists(path) {
    try {
      const http = new XMLHttpRequest();
      http.open("HEAD", path, false);
      http.send();
      return http.status !== 404;
    } catch (e) {
      return false;
    }
  }


  function checkAuthenticationAndNavigate() {
    const username = localStorage.getItem("username");
    if (!username) {
      window.location.href = "../global/auth.html";
      return;
    }

    const currentPath = window.location.pathname;
    const isValidPage = isPageExists(currentPath);
    if (!isValidPage) {
      navigateToHome();
    }
  }

  checkAuthenticationAndNavigate();
})();
