const drawer = document.getElementById("drawer");
const overlay = document.getElementById("drawerOverlay");
const drawerHeader = document.querySelector(".drawer-header");
const drawerContent = document.querySelector(".drawer-content");

async function fetchProjects(endpoint) {
  const spinner = document.getElementById("spinner");
  const tableContainer = document.querySelector(".table-container");

  try {
    spinner.style.display = "flex";
    tableContainer.style.display = "none";

    const response = await fetch(`../../../backend/projects_${endpoint}.php`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    if (data.status === "success") {
      const sortedData = data.data.sort((a, b) => a.project_id - b.project_id);
      const projectTopics = sortedData.map((project) => ({
        projectId: project.project_id,
        projectTitle: project.title,
      }));

      localStorage.setItem("project_topics", JSON.stringify(projectTopics));
      renderProjects(sortedData);
      tableContainer.style.display = "block";
    } else {
      console.error("Error fetching projects:", data.message);
      showToast("error-fetching", "error");
    }
  } catch (error) {
    console.error("Error fetching projects:", error);
    showToast("error-fetching", "error");
  } finally {
    spinner.style.display = "none";
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
