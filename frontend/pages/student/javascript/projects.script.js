const drawer = document.getElementById("drawer");
const overlay = document.getElementById("drawerOverlay");
const drawerHeader = document.querySelector(".drawer-header");
const drawerContent = document.querySelector(".drawer-content");

const registerTeamButton = document.querySelector(".register-team-button");
const editTeamButton = document.querySelector(".edit-team-button");
const pageActionsContainer = document.getElementById("page-actions");

function setUserInLocalStorage(key, value) {
  if (key === "project" && value.topicNumber) {
    // Spread team details directly into the project
    const flattenedValue = { topicNumber: value.topicNumber, ...value };
    localStorage.setItem(key, JSON.stringify(flattenedValue));
    const isProjectStored = Boolean(flattenedValue);
    createActionButtons(isProjectStored, pageActionsContainer);
  } else {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

async function fetchProjects() {
  try {
    const response = await fetch("/w24-project/backend/projects_student.php", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

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
    }
  } catch (error) {
    console.error("Error fetching projects:", error);
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
          No research papers are available at the moment. Please add new topics to display them here.
        </div>
      </div>`;
    applyTranslations();
    return;
  }

  tbody.innerHTML = "";

  projects.forEach((project) => {
    const row = document.createElement("tr");
    row.innerHTML = `

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

    tbody.appendChild(row);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const isProjectStored = Boolean(localStorage.getItem("project"));
  createActionButtons(isProjectStored, pageActionsContainer);
  fetchProjects();
  fetchUserTeam();
});

window.addEventListener("storage", (event) => {
  if (event.key === "project") {
    const isProjectStored = Boolean(localStorage.getItem("project"));
    createActionButtons(isProjectStored, pageActionsContainer);
  }
});

function createActionButtons(isProjectStored, container) {
  const teamButtons = container.querySelectorAll(
    ".register-team-button, .edit-team-button"
  );
  teamButtons.forEach((btn) => btn.remove());

  if (isProjectStored) {
    const editTeamButton = document.createElement("button");
    editTeamButton.classList.add("edit-team-button");
    editTeamButton.setAttribute("data-i18n", "edit-team");
    editTeamButton.onclick = () => openEditTeamModal();
    container.appendChild(editTeamButton);
  } else {
    const registerTeamButton = document.createElement("button");
    registerTeamButton.classList.add("register-team-button");
    registerTeamButton.setAttribute("data-i18n", "register-team");
    registerTeamButton.onclick = () => openRegisterTeamModal();
    container.appendChild(registerTeamButton);
  }

  if (!container.querySelector(".propose-button")) {
    const proposeTopicButton = document.createElement("button");
    proposeTopicButton.classList.add("propose-button");
    proposeTopicButton.setAttribute("data-i18n", "propose-topic");
    proposeTopicButton.onclick = () =>
      openModal("propose-topic-modal", "propose-topic-modal-overlay");
    container.appendChild(proposeTopicButton);
  }

  if (!container.querySelector(".download-table-button")) {
    const downloadXlsxButton = document.createElement("button");
    downloadXlsxButton.classList.add("download-table-button");
    downloadXlsxButton.setAttribute("data-i18n", "download-xlsx");
    downloadXlsxButton.onclick = () => downloadTableAsExcel("project_topics");
    container.appendChild(downloadXlsxButton);
  }

  applyTranslations();
}

function openReviewDrawer(data) {
  populateDrawer(data);
  openDrawer("drawer", "drawerOverlay");
}

function populateDrawer(data) {
  const formatText = (text) => {
    if (!text || text === "-") return "";
    return text.replace(/(\d+\.+\D)/g, "\n$1").replace(/(\[\d+\])/g, "\n$1");
  };
  drawerHeader.innerHTML = `
    <span><strong data-i18n="table-topic-number"></strong> ${data.project_id}</span>
    <button class="close-drawer-button" aria-label="Close drawer" onclick="closeDrawer()">&times;</button>
  `;
  drawerContent.innerHTML = `
    <p><strong data-i18n="table-topic-name"></strong> ${data.title}</p>
    <p><strong data-i18n="table-description"></strong>
      <textarea class="textarea-component" data-field="description" rows="4" disabled>${formatText(
        data.description
      )}</textarea>
    </p>
    <p><strong data-i18n="table-participant-1"></strong>
      <textarea class="textarea-component" data-field="participant1" rows="4" disabled>${formatText(
        data.example_distribution_1
      )}</textarea>
    </p>
    <p><strong data-i18n="table-participant-2"></strong>
      <textarea class="textarea-component" data-field="participant2" rows="4" disabled>${formatText(
        data.example_distribution_2
      )}</textarea>
    </p>
    <p><strong data-i18n="table-participant-3"></strong>
      <textarea class="textarea-component" data-field="participant3" rows="4" disabled>${formatText(
        data.example_distribution_3
      )}</textarea>
    </p>
    <p><strong data-i18n="table-integration"></strong>
      <textarea class="textarea-component" data-field="integration" rows="3" disabled>${formatText(
        data.integration
      )}</textarea>
    </p>
    <p><strong data-i18n="table-requirements"></strong>
      <textarea class="textarea-component" data-field="requirements" rows="3" disabled>${formatText(
        data.requirements
      )}</textarea>
    </p>
  `;
  applyTranslations();
}

function populateTopicDropdown(id) {
  const projectTopics =
    JSON.parse(localStorage.getItem("project_topics")) || [];
  const topicDropdown = document.getElementById(id);
  topicDropdown.innerHTML = "";
  projectTopics.forEach((project) => {
    const option = document.createElement("option");
    option.value = project.projectId;
    option.textContent = `${project.projectId} - ${project.projectTitle}`;
    topicDropdown.appendChild(option);
  });
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

function addTeammateRow(containerId, editFieldsId = null) {
  const container = document.getElementById(containerId);

  if (container.children.length < 3) {
    const newRow = document.createElement("div");
    newRow.classList.add("flex-container", "row", "teammate-row");

    newRow.innerHTML = `
      <div class="input-container row-input">
        <i class="input-icon fa-solid fa-hashtag"></i>
        <input
          type="text"
          class="facultyNumber"
          data-i18n-placeholder="faculty-number-placeholder-team"
        />
      </div>
      <button class="remove-button" onclick="removeTeammateRow(this, '${containerId}', '${editFieldsId}')">-</button>
    `;

    container.appendChild(newRow);

    if (editFieldsId) {
      const editFields = document.getElementById(editFieldsId);
      const participantIndex = container.children.length;
      const participantField = document.createElement("div");
      participantField.classList.add("input-container");

      participantField.innerHTML = `
        <label for="participant${participantIndex}" data-i18n="participant${participantIndex}-label"></label>
        <textarea
          id="participant${participantIndex}"
          class="textarea-component"
          rows="3"
          data-i18n-placeholder="participant${participantIndex}-placeholder"
        ></textarea>
      `;

      editFields.appendChild(participantField);
    }

    hideErrorMessage();
    applyTranslations();
    forceApplyPlaceholders();
  } else {
    displayErrorMessage("error-students-exceeded");
  }
}

function removeTeammateRow(button, containerId, editFieldsId = null) {
  const container = document.getElementById(containerId);

  if (container.children.length > 1) {
    const rowIndex =
      Array.from(container.children).indexOf(button.parentNode) + 1;
    container.removeChild(button.parentNode);

    if (editFieldsId != "null" && editFieldsId) {
      const editFields = document.getElementById(editFieldsId);
      const participantField = document.getElementById(
        `participant${rowIndex}`
      );
      if (participantField) {
        participantField.parentNode.remove();
      }

      Array.from(editFields.children).forEach((child, index) => {
        const newIndex = index + 1;
        const textarea = child.querySelector("textarea");
        const label = child.querySelector("label");
        if (textarea) {
          textarea.id = `participant${newIndex}`;
          textarea.setAttribute(
            "data-i18n-placeholder",
            `participant${newIndex}-placeholder`
          );
        }
        if (label) {
          label.setAttribute("for", `participant${newIndex}`);
          label.setAttribute("data-i18n", `participant${newIndex}-label`);
        }
      });
    }

    hideErrorMessage();
    applyTranslations();
  } else {
    displayErrorMessage("error-students-not-enough");
  }
}

function openEditTeamModal() {
  const project = JSON.parse(localStorage.getItem("project"));

  if (!project) {
    displayErrorMessage("error-no-project-found");
    return;
  }

  const topicDropdown = document.getElementById("topic-edit-dropdown");
  const teammatesContainer = document.getElementById(
    "teammates-edit-container"
  );
  const editFields = document.getElementById("edit-fields-section");
  const commentsField = document.getElementById("comments");

  populateTopicDropdown("topic-edit-dropdown");
  topicDropdown.value = project.topicNumber;

  teammatesContainer.innerHTML = "";
  project.members.forEach((member) => {
    const teammateRow = document.createElement("div");
    teammateRow.classList.add("flex-container", "row", "teammate-row");
    teammateRow.innerHTML = `
      <div class="input-container row-input">
        <i class="input-icon fa-solid fa-hashtag"></i>
        <input
          type="text"
          class="facultyNumber"
          value="${member.faculty_number}"
          data-i18n-placeholder="faculty-number-placeholder-team"
        />
      </div>
      <button class="remove-button" onclick="removeTeammateRow(this,'teammates-edit-container')">-</button>
    `;
    teammatesContainer.appendChild(teammateRow);
  });

  editFields.innerHTML = "";
  project.members.forEach((_, index) => {
    const participantKey = `participant${index + 1}`;
    const participantField = document.createElement("div");
    participantField.classList.add("input-container");
    participantField.innerHTML = `
      <label for="${participantKey}" data-i18n="${participantKey}-label"></label>
      <textarea
        id="${participantKey}"
        class="textarea-component"
        rows="3"
        data-i18n-placeholder="${participantKey}-placeholder"
      >${project[`sample_distribution_${index + 1}`] || ""}</textarea>
    `;
    editFields.appendChild(participantField);
  });

  commentsField.value = project?.comments || "";

  applyTranslations();
  forceApplyPlaceholders();

  openModal("edit-team-modal", "edit-team-modal-overlay");
}

function openRegisterTeamModal() {
  const projectTopics = JSON.parse(localStorage.getItem("project_topics"));
  if (!projectTopics || projectTopics.length === 0) {
    displayErrorMessage("error-no-project-topics-found");
    return;
  }

  const teammatesContainer = document.getElementById("teammates-container");

  populateTopicDropdown("topic-dropdown");

  teammatesContainer.innerHTML = "";

  const teammateRow = document.createElement("div");
  teammateRow.classList.add("flex-container", "row", "teammate-row");
  teammateRow.innerHTML = `
      <div class="input-container row-input">
        <i class="input-icon fa-solid fa-hashtag"></i>
        <input
          type="text"
          class="facultyNumber"
          placeholder="Faculty Number"
          data-i18n-placeholder="faculty-number-placeholder-team"
        />
      </div>
      <button class="remove-button" onclick="removeTeammateRow(this,'teammates-container')">-</button>
    `;
  teammatesContainer.appendChild(teammateRow);

  applyTranslations();
  forceApplyPlaceholders();

  openModal("register-team-modal", "register-team-modal-overlay");
}

function toggleSection(showId, hideId) {
  const showSection = document.getElementById(showId);
  const hideSection = document.getElementById(hideId);

  showSection.classList.remove("hidden");
  hideSection.classList.add("hidden");

  const toggleButtons = document.querySelectorAll(".toggle-button");
  toggleButtons.forEach((button) => {
    button.classList.remove("active");
  });

  const activeButton = document.querySelector(
    showId === "teammates-section" ? "#toggle-teammates" : "#toggle-edit-fields"
  );
  activeButton.classList.add("active");
}

async function assignTeamToProject(projectId, teamDetails) {
  try {
    const payload = {
      project_id: projectId,
      team: teamDetails,
    };

    const response = await fetch("/w24-project/backend/projects_student.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (data.status === "success") {
      setUserInLocalStorage("project", {
        topicNumber: projectId,
        ...teamDetails,
      });
      fetchProjects();
    } else {
      showErrorModal(data.message || "Failed to assign team.");
    }
  } catch (error) {
    console.error("Error assigning team:", error);
  }
}

async function editTeamDetails(projectId, updatedDetails) {
  try {
    const payload = {
      project_id: projectId,
      updated_details: updatedDetails,
    };

    const response = await fetch("/w24-project/backend/projects_student.php", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (data.status === "success") {
      fetchProjects(); // Refresh the project list
    } else {
      showErrorModal(data.message || "Failed to update team details.");
    }
  } catch (error) {
    console.error("Error updating team details:", error);
  }
}

function saveTeamDetails() {
  const selectedTopic = document.getElementById("topic-dropdown").value;
  const teammates = Array.from(
    document.querySelectorAll("#teammates-container .teammate-row")
  );

  if (!selectedTopic || teammates.length === 0) {
    displayErrorMessage("error-no-details-team-creation");
    return;
  }

  const teamDetails = teammates.map((row) => {
    const faculty_number = row.querySelector(".facultyNumber").value.trim();

    if (!faculty_number) {
      displayErrorMessage("error-no-details-team-members");
      throw new Error("Validation Error: Missing teammate details.");
    }

    return { faculty_number };
  });

  const team = { members: teamDetails, comments: "" };

  // Call assignTeamToProject
  assignTeamToProject(selectedTopic, team);

  closeModal("register-team-modal", "register-team-modal-overlay");
}

function saveEditTeamDetails() {
  const selectedTopic = document.getElementById("topic-edit-dropdown").value;
  const teammates = Array.from(
    document.querySelectorAll("#teammates-edit-container .teammate-row")
  );

  if (!selectedTopic || teammates.length === 0) {
    displayErrorMessage("error-no-details-team-creation");
    return;
  }

  const teamDetails = teammates.map((row) => {
    const faculty_number = row.querySelector(".facultyNumber").value.trim();

    if (!faculty_number) {
      displayErrorMessage("error-no-details-team-members");
      throw new Error("Validation Error: Missing teammate details.");
    }

    return { faculty_number };
  });

  const sample_distribution_1 =
    document.getElementById("participant1")?.value.trim() || null;
  const sample_distribution_2 =
    document.getElementById("participant2")?.value.trim() || null;
  const sample_distribution_3 =
    document.getElementById("participant3")?.value.trim() || null;
  const comments = document.getElementById("comments")?.value.trim() || "";

  const updatedProject = {
    topicNumber: selectedTopic,
    members: teamDetails,
    sample_distribution_1,
    sample_distribution_2,
    sample_distribution_3,
    comments,
  };

  // Call editTeamDetails
  editTeamDetails(selectedTopic, {
    members: teamDetails,
    sample_distribution_1,
    sample_distribution_2,
    sample_distribution_3,
    comments,
  });

  // Save to localStorage
  setUserInLocalStorage("project", updatedProject);

  closeModal("edit-team-modal", "edit-team-modal-overlay");
}

async function fetchUserTeam() {
  const user_id = localStorage.getItem("user_id");
  if (!user_id) {
    console.error("No user_id found in local storage.");
    return;
  }

  try {
    const response = await fetch(
      `/w24-project/backend/team_methods.php?user_id=${encodeURIComponent(
        user_id
      )}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    const data = await response.json();

    if (data.status === "success") {
      if (data.data) {
        const updatedProject = {
          topicNumber: data.data.project_id,
          members: data.data.team_members.split(",").map((member) => ({
            faculty_number: member.trim(),
          })),
          sample_distribution_1: data.data.sample_distribution_1 || "",
          sample_distribution_2: data.data.sample_distribution_2 || "",
          sample_distribution_3: data.data.sample_distribution_3 || "",
          comments: data.data.team_comments || "",
        };

        setUserInLocalStorage("project", updatedProject);
      } else {
        localStorage.removeItem("project"); // Clear project data if no team
      }
    } else {
      console.error("Error fetching user's team:", data.message);
      showErrorModal(
        data.message || "An error occurred while fetching the team."
      );
    }
  } catch (error) {
    console.error("Error fetching user's team:", error);
  }
}
