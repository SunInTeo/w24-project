document.addEventListener("DOMContentLoaded", () => {
  fetchProjects("admin");
  initializeListeners();
});

function initializeListeners() {
  const deleteButton = document.getElementById("delete-selected");
  if (deleteButton) {
    deleteButton.addEventListener("click", () => {
      openModal("confirm-modal", "confirm-modal-overlay");
    });
  }

  const selectAllCheckbox = document.querySelector("#select-all");
  if (selectAllCheckbox) {
    selectAllCheckbox.addEventListener("change", handleSelectAllCheckbox);
  }
}

function renderProjects(projects) {
  const table = document.querySelector("#project_topics");
  if (!table) {
    console.error("Table with ID 'project_topics' not found.");
    return;
  }

  let tbody = table.querySelector("tbody");
  if (!tbody) {
    console.error("The <tbody> element does not exist.");
    tbody = document.createElement("tbody");
    table.appendChild(tbody);
  }
  if (!projects.length) {
    document.querySelector(".table-container").innerHTML = `
      <div class="card no-data-card">
        <div class="card-header" data-i18n="no-data-available">No Data Available</div>
        <div class="card-body">
          <span data-i18n="no-projects-papers"></span>
        </div>
      </div>`;
    applyTranslations();
    return;
  }

  tbody.innerHTML = "";

  projects.forEach((project) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><input type="checkbox" class="row-checkbox" data-id="${
        project.project_id
      }"></td>
      <td>${project.project_id}</td>
      <td>${project.title}</td>
      <td>${project.description}</td>
      <td>${project.example_distribution_1 || "-"}</td>
      <td>${project.example_distribution_2 || "-"}</td>
      <td>${project.example_distribution_3 || "-"}</td>
      <td>${project.integration || "-"}</td>
      <td>${project.requirements || "-"}</td>
    `;

    row.addEventListener("click", (event) => {
      if (event.target.type === "checkbox") return;
      openReviewDrawer(project);
    });

    row
      .querySelector(".row-checkbox")
      .addEventListener("change", handleRowCheckbox);

    tbody.appendChild(row);
  });
}

function populateDrawer(data) {
  const formatText = (text) => {
    if (!text || text === "-") return "";
    return text.replace(/(\d+\.+\D)/g, "\n$1").replace(/(\[\d+\])/g, "\n$1");
  };

  drawerHeader.innerHTML = `
    <span ><strong data-i18n="table-topic-number"></strong><span id="project-id"> ${data.project_id}</span></span>
    <button class="close-drawer-button" aria-label="Close drawer" onclick="closeDrawer()">&times;</button>
  `;

  drawerContent.innerHTML = `
    <p><strong data-i18n="table-topic-name"></strong>  
      <textarea class="textarea-component" data-field="topic-name">${
        data.title
      }</textarea>
    </p>
    <p><strong data-i18n="table-description"></strong>
      <textarea class="textarea-component" data-field="description" rows="4">${formatText(
        data.description
      )}</textarea>
    </p>
    <p><strong data-i18n="table-participant-1"></strong>
      <textarea class="textarea-component" data-field="participant1" rows="4">${formatText(
        data.example_distribution_1
      )}</textarea>
    </p>
    <p><strong data-i18n="table-participant-2"></strong>
      <textarea class="textarea-component" data-field="participant2" rows="4">${formatText(
        data.example_distribution_2
      )}</textarea>
    </p>
    <p><strong data-i18n="table-participant-3"></strong>
      <textarea class="textarea-component" data-field="participant3" rows="4">${formatText(
        data.example_distribution_3
      )}</textarea>
    </p>
    <p><strong data-i18n="table-integration"></strong>
      <textarea class="textarea-component" data-field="integration" rows="3">${formatText(
        data.integration
      )}</textarea>
    </p>
    <p><strong data-i18n="table-requirements"></strong>
      <textarea class="textarea-component" data-field="requirements" rows="3">${formatText(
        data.requirements
      )}</textarea>
    </p>
    <div class="flex-container">
      <button data-i18n="save-text" class="primary" onclick="editProject()"></button>
      <button data-i18n="cancel-text" class="secondary" onclick="closeDrawer()"></button>
    </div>
  `;

  applyTranslations();
}

function handleSelectAllCheckbox(event) {
  const isChecked = event.target.checked;
  document.querySelectorAll(".row-checkbox").forEach((checkbox) => {
    checkbox.checked = isChecked;
  });
  updateRemoveButtonState();
}

function handleRowCheckbox() {
  const allChecked = Array.from(
    document.querySelectorAll(".row-checkbox")
  ).every((checkbox) => checkbox.checked);
  document.querySelector("#select-all").checked = allChecked;
  updateRemoveButtonState();
}

function updateRemoveButtonState() {
  const anyChecked = Array.from(
    document.querySelectorAll(".row-checkbox")
  ).some((checkbox) => checkbox.checked);
  document.querySelector("#delete-selected").disabled = !anyChecked;
}

async function createNewProject() {
  const titleInput = document.getElementById("addedTopic");
  const descriptionInput = document.getElementById("sampleResourcesTopicText");

  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();

  if (!title) {
    showErrorMessage("error-title-required");
    return;
  }

  if (!description) {
    showErrorMessage("error-resources-required");
    return;
  }

  const projectData = {
    title: title,
    description: description,
    example_distribution_1: null,
    example_distribution_2: null,
    example_distribution_3: null,
    integration: null,
    requirements: null,
  };

  try {
    const response = await fetch("/w24-project/backend/projects_admin.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(projectData),
    });

    const data = await response.json();

    if (data.status === "success") {
      closeModal("add-topic-modal", "add-topic-modal-overlay");
      resetForm("add-topic-form");
      showToast("success-creating-project-admin");
      fetchProjects("admin");
    } else {
      showErrorMessage(data.message || "Failed to create project.");
    }
  } catch (error) {
    console.error("Error creating project:", error);
    showToast("error-creating-project-admin", "error");
  }
}
async function editProject() {
  const projectId = document.getElementById("project-id").textContent.trim();
  const projectData = {
    project_id: projectId,
    title: drawer
      .querySelector("textarea[data-field='topic-name']")
      .value.trim(),
    description: drawer
      .querySelector("textarea[data-field='description']")
      .value.trim(),
    example_distribution_1:
      drawer
        .querySelector("textarea[data-field='participant1']")
        .value.trim() || null,
    example_distribution_2:
      drawer
        .querySelector("textarea[data-field='participant2']")
        .value.trim() || null,
    example_distribution_3:
      drawer
        .querySelector("textarea[data-field='participant3']")
        .value.trim() || null,
    integration:
      drawer.querySelector("textarea[data-field='integration']").value.trim() ||
      null,
    requirements:
      drawer
        .querySelector("textarea[data-field='requirements']")
        .value.trim() || null,
  };

  if (!projectData.title || !projectData.description) {
    showErrorModal("Please fill in all required fields.");
    return;
  }

  try {
    const response = await fetch("/w24-project/backend/projects_admin.php", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(projectData),
    });

    const data = await response.json();

    if (data.status === "success") {
      showToast("success-editing-project-admin");
      fetchProjects("admin");
      closeDrawer();
    } else {
      showErrorModal(data.message || "Failed to update project.");
    }
  } catch (error) {
    console.error("Error updating project:", error);
    showToast("error-editing-project-admin", "error");
  }
}

async function deleteSelectedProjects() {
  const selectedIds = Array.from(
    document.querySelectorAll(".row-checkbox:checked")
  ).map((checkbox) => checkbox.dataset.id);

  if (selectedIds.length === 0) {
    showErrorModal("No projects selected for deletion.");
    return;
  }

  try {
    const response = await fetch("/w24-project/backend/projects_admin.php", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ project_ids: selectedIds }),
    });

    const data = await response.json();

    if (data.status === "success") {
      selectedIds.forEach((id) => {
        const checkbox = document.querySelector(
          `.row-checkbox[data-id="${id}"]`
        );
        if (checkbox) {
          checkbox.closest("tr").remove();
        }
      });
      document.querySelector("#select-all").checked = false;
      updateRemoveButtonState();
      showToast("success-deleting-projects-admin");
    } else {
      showErrorModal(data.message || "Failed to delete selected projects.");
    }
  } catch (error) {
    console.error("Error deleting projects:", error);
    showToast("error-deleting-projects-admin", "error");
  } finally {
    closeModal("confirm-modal", "confirm-modal-overlay");
  }
}

function downloadTableAsExcel(tableID) {
  const table = document.querySelector(`.table#${tableID}`);

  const data = [];
  const rows = table.querySelectorAll("tr");
  rows.forEach((row) => {
    const rowData = [];
    const cells = row.querySelectorAll("th, td");
    cells.forEach((cell) => {
      rowData.push(cell.innerText.trim());
    });
    data.push(rowData);
  });

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet(data);

  const columnWidths = [
    { wch: 15 },
    { wch: 20 },
    { wch: 40 },
    { wch: 40 },
    { wch: 40 },
    { wch: 40 },
    { wch: 40 },
    { wch: 40 },
  ];
  worksheet["!cols"] = columnWidths;

  const rowHeights = [
    { hpt: 25 },
    { hpt: 55 },
    { hpt: 55 },
    { hpt: 55 },
    { hpt: 55 },
    { hpt: 55 },
    { hpt: 55 },
    { hpt: 55 },
  ];
  worksheet["!rows"] = rowHeights;

  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  XLSX.writeFile(workbook, "projects_table.xlsx");
}

function populateTopicDropdown(id) {
  const projectTopics =
    JSON.parse(localStorage.getItem("project_topics")) || [];
  const topicDropdown = document.getElementById(id);

  if (!topicDropdown) {
    console.error(`Dropdown with ID "${id}" not found.`);
    return;
  }

  topicDropdown.innerHTML = "";

  if (projectTopics.length === 0) {
    const noOptions = document.createElement("option");
    noOptions.value = "";
    noOptions.textContent = "No topics available.";
    topicDropdown.appendChild(noOptions);
    return;
  }

  projectTopics.forEach((project) => {
    const option = document.createElement("option");
    option.value = project.projectId;
    option.textContent = `${project.projectId} - ${project.projectTitle}`;
    topicDropdown.appendChild(option);
  });
}

function searchByProject() {
  const projectDropdown = document.getElementById("topic-dropdown");
  const selectedProjectId = projectDropdown.value;

  fetchTeamsByProjectId(selectedProjectId);
}

async function fetchTeamsByProjectId(projectId) {
  try {
    const response = await fetch(
      `/w24-project/backend/fetch_teams_by_project.php?project_id=${encodeURIComponent(
        projectId
      )}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    const data = await response.json();

    if (data.status === "success") {
      if (data.data && data.data.length > 0) {
        displayTeams(data.data);
      } else {
        displayNoTeamsMessage();
      }
    } else {
      console.error("Error fetching teams:", data.message);
      showErrorModal(data.message || "An error occurred while fetching teams.");
    }
  } catch (error) {
    console.error("Error fetching teams:", error);
    showToast("error-fetching-teams-admin", "error");
  }
}

function displayTeams(teams) {
  const teamsContainer = document.getElementById("teams");
  teamsContainer.classList.remove("no-data");

  teamsContainer.style.display = "block";
  teamsContainer.innerHTML = "";

  const accordion = document.createElement("div");
  accordion.classList.add("accordion");

  teams.forEach((team) => {
    const teamMembers = team.team_members.split(",");
    const formattedMembers = teamMembers.join(", ");

    const accordionItem = document.createElement("div");
    accordionItem.classList.add("accordion-item");

    let distributionList = "";
    teamMembers.forEach((_, index) => {
      const distributionKey = `sample_distribution_${index + 1}`;
      distributionList += `<li><strong><span data-i18n="member-${
        index + 1
      }"></span></strong> ${team[distributionKey] || "-"}</li>`;
    });

    accordionItem.innerHTML = `
      <div class="accordion-header" onclick="toggleAccordion(this)">
        <h4>${formattedMembers}</h4>
        <span class="accordion-icon">+</span>
      </div>
      <div class="accordion-content">
        <p><strong> <span data-i18n="comments-team"></span></strong> ${
          team.team_comments || "-"
        }</p>
        <p><strong><span data-i18n="distribution-team"></span></strong></p>
        <ul>${distributionList}</ul>
      </div>
    `;

    accordion.appendChild(accordionItem);
  });
  teamsContainer.appendChild(accordion);
  applyTranslations();
}

function displayNoTeamsMessage() {
  const teamsContainer = document.getElementById("teams");
  teamsContainer.classList.add("no-data");

  teamsContainer.innerHTML = "<p>No teams available for this project.</p>";
}

function displayErrorMessage(message) {
  const errorContainer = document.getElementById("error-container");
  errorContainer.textContent = message;
  errorContainer.style.display = "block";

  setTimeout(() => {
    errorContainer.style.display = "none";
  }, 5000);
}

