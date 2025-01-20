const drawer = document.getElementById("drawer");
const overlay = document.getElementById("drawerOverlay");
const drawerHeader = document.querySelector(".drawer-header");
const drawerContent = document.querySelector(".drawer-content");

async function fetchProjects(endpoint) {
  try {
    const response = await fetch(
      `/w24-project/backend/projects_${endpoint}.php`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    const data = await response.json();

    if (data.status === "success") {
      const projectTopics = data.data.map((project) => ({
        projectId: project.project_id,

        projectTitle: project.title,
      }));

      localStorage.setItem("project_topics", JSON.stringify(projectTopics));
      renderProjects(data.data);
    } else {
      console.error("Error:", data.message);
      showToast("error-fetching", "error");
    }
  } catch (error) {
    console.error("Error fetching projects:", error);
    showToast("error-fetching", "error");
  }
}

function openReviewDrawer(data) {
  populateDrawer(data);
  openDrawer("drawer", "drawerOverlay");
}

function displayErrorMessage(messageKey) {
  const errorMessage = document.getElementById("errorMessage");
  errorMessage.setAttribute("data-i18n", messageKey);
  applyTranslations();
  errorMessage.style.display = "flex";
  setTimeout(() => hideErrorMessage(), 2000);
}

function hideErrorMessage() {
  const errorMessage = document.getElementById("errorMessage");
  errorMessage.removeAttribute("data-i18n");
  errorMessage.style.display = "none";
}
