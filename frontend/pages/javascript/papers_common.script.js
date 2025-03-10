function initializeTable() {
  document.querySelector(".table-container").style.display = "block";
  const table = document.querySelector("#research_papers");
  if (!table) {
    console.error("Table with ID 'research_papers' not found.");
    return;
  }

  const tbody = table.querySelector("tbody");
  if (!tbody) {
    const newTbody = document.createElement("tbody");
    table.appendChild(newTbody);
  }
}

async function fetchResearchPapers(endpoint) {
  const spinner = document.getElementById("spinner");
  const tableContainer = document.querySelector(".table-container");

  try {
    spinner.style.display = "flex";
    tableContainer.style.display = "none";

    const response = await fetch(`../../../backend/${endpoint}.php`);
    const data = await response.json();

    if (data.status === "success") {
      tableContainer.style.display = "block";
      const sortedData = data.data.sort((a, b) => a.essay_id - b.essay_id);
      renderTable(sortedData);
    } else {
      console.error("Error fetching research papers:", data.message);
      showToast("error-fetching", "error");
    }
    tableContainer.style.display = "block";
  } catch (error) {
    console.error("Error fetching research papers:", error);
    showToast("error-fetching", "error");
  } finally {
    spinner.style.display = "none";
  }
}

function openPageDrawer(data) {
  populateDrawer(data);
  openDrawer("drawer", "drawerOverlay");
}

function checkTextIfNull(querySelectorName) {
  const element = drawer.querySelector(querySelectorName);
  return element ? element.value.trim() : "";
}
