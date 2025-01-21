const nav = document.querySelector(".nav");
if (nav) {
  nav.innerHTML = `
    <div class="left" onclick="navigateToHome()">            
    <img src="../../assets/images/logo.png" id="logo" alt="Logo" />
</div>
    <div class="center" data-i18n="nav-welcome"></div>
    <div class="right">
      <button class="logout-button" data-i18n="nav-logout" onclick="handleLogout()"></button>
    </div>
  `;

  applyTranslations();
}

document.addEventListener("DOMContentLoaded", async () => {
  const user_id = localStorage.getItem("user_id");
  const user = await fetchUserById(user_id);
  localStorage.setItem("project_id", user.project_id);
  localStorage.setItem("essay_id", user.essay_id);
  localStorage.setItem("email", user.email);
});

function navigateToHome() {
  if (localStorage.getItem("username")) {
    window.location.href = `../global/home.html`;
  }
}

async function handleLogout() {
  try {
    const response = await fetch("/w24-project/backend/logout.php");

    if (response.ok) {
      const result = await response.json();
      if (result.status === "success") {
        localStorage.clear();
        window.location.href = "../global/auth.html";
      } else {
        console.error("Logout failed:", result.message);
      }
    } else {
      console.error("Failed to connect to the server for logout.");
    }
  } catch (error) {
    console.error("Error logging out:", error);
  }
}

function navigateTo(location) {
  const user_type = localStorage.getItem("user_type");
  if (user_type) {
    window.location.href = `../${user_type}/${location}.html`;
  }
}

async function fetchUserById(userId) {
  if (!userId) {
    console.error("User ID is required.");
    return;
  }

  try {
    const response = await fetch(
      `/w24-project/backend/fetch_user_by_id.php?user_id=${encodeURIComponent(
        userId
      )}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (data.status === "success") {
      return data.user;
    } else {
      console.error("Error fetching user:", data.message);
      return null;
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}
