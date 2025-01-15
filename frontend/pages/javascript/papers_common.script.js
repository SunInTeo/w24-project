function initializeTable() {
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
  try {
    const response = await fetch(`/w24-project/backend/${endpoint}.php`);
    const data = await response.json();

    if (data.status === "success") {
      const sortedData = data.data.sort((a, b) => a.essay_id - b.essay_id);
      renderTable(sortedData);
    } else {
      console.error("Error fetching research papers:", data.message);
    }
  } catch (error) {
    console.error("Error fetching research papers:", error);
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
