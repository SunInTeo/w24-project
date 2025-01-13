const sampleData = [
  {
    topicNumber: 1,
    topicName: "AI in Healthcare",
    description: "Exploring AI's role in diagnostics and treatment.",
    sampleDistribution: "Data collection, algorithm training, testing.",
    participant1: "Alice Johnson",
    participant2: "Bob Smith",
    participant3: "Charlie Brown",
    integration: "Collaboration with bioinformatics team.",
    requirements: "HIPAA compliance, scalability, accuracy benchmarks.",
  },
  {
    topicNumber: 2,
    topicName: "Blockchain for Supply Chain",
    description: "Enhancing transparency and efficiency in logistics.",
    sampleDistribution: "Blockchain setup, integration, and testing.",
    participant1: "Daniel Craig",
    participant2: "Emily White",
    participant3: "Frank Green",
    integration: "Works well with inventory management systems.",
    requirements: "Network reliability, transaction speed.",
  },
  {
    topicNumber: 3,
    topicName: "IoT in Smart Cities",
    description: "Leveraging IoT for urban management.",
    sampleDistribution: "Sensor installation, data aggregation.",
    participant1: "Grace Lee",
    participant2: "Henry Ford",
    participant3: "Ivy Adams",
    integration: "Potential for integration with traffic systems.",
    requirements: "Real-time data, low latency.",
  },
  {
    topicNumber: 4,
    topicName: "Cybersecurity in Cloud",
    description: "Exploring strategies for secure cloud computing.",
    sampleDistribution: "Threat modeling, implementation, testing.",
    participant1: "Jack Davis",
    participant2: "Karen Taylor",
    participant3: "Liam Wilson",
    integration: "Collaboration with DevSecOps team.",
    requirements: "Encryption, multi-factor authentication.",
    comments: "Critical area for most businesses.",
  },
  {
    topicNumber: 5,
    topicName: "Augmented Reality in Education",
    description: "Using AR for immersive learning experiences.",
    sampleDistribution: "Content creation, software development.",
    participant1: "Mia Brown",
    participant2: "Noah Evans",
    participant3: "Olivia Harris",
    integration: "Could be paired with VR projects.",
    requirements: "High-performance hardware, intuitive UI.",
  },
  {
    topicNumber: 6,
    topicName: "Quantum Computing",
    description: "Introduction to quantum algorithms and applications.",
    sampleDistribution: "Theory research, algorithm testing.",
    participant1: "Paul Walker",
    participant2: "Quincy Smith",
    participant3: "Rachel Adams",
    integration: "Collaborate with cryptography teams.",
    requirements: "Access to quantum simulators.",
  },
  {
    topicNumber: 7,
    topicName: "Sustainable Energy Solutions",
    description: "Analyzing renewable energy options.",
    sampleDistribution: "Data analysis, prototyping.",
    participant1: "Sam Green",
    participant2: "Tina Brown",
    participant3: "Uma Lee",
    integration: "Integration with grid systems.",
    requirements: "Feasibility analysis, government compliance.",
  },
  {
    topicNumber: 8,
    topicName: "Natural Language Processing",
    description: "Advancing NLP for better human-machine interaction.",
    sampleDistribution: "Dataset preparation, model training.",
    participant1: "Victor Black",
    participant2: "Wendy White",
    participant3: "Xander Gray",
    integration: "Application in customer service systems.",
    requirements: "Labeled datasets, high computational resources.",
  },
];

const drawer = document.getElementById("drawer");
const overlay = document.getElementById("drawerOverlay");
const drawerHeader = document.querySelector(".drawer-header");
const drawerContent = document.querySelector(".drawer-content");

const registerTeamButton = document.querySelector(".register-team-button");
const editTeamButton = document.querySelector(".edit-team-button");
const pageActionsContainer = document.getElementById("page-actions");

function updateLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
  if (key === "project") {
    const isProjectStored = Boolean(value);
    createActionButtons(isProjectStored, pageActionsContainer);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.querySelector("#project_topics tbody");
  sampleData.forEach((data) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${data.topicNumber}</td>
      <td>${data.topicName}</td>
      <td>${data.description}</td>
      <td>${data.sampleDistribution}</td>
      <td>${data.participant1}</td>
      <td>${data.participant2}</td>
      <td>${data.participant3}</td>
      <td>${data.integration}</td>
      <td>${data.requirements}</td>
    `;
    row.addEventListener("click", () => openReviewDrawer(data));
    tableBody.appendChild(row);
  });
  populateTopicDropdown("topic-dropdown");
  hideErrorMessage();
});

document.addEventListener("DOMContentLoaded", () => {
  const isProjectStored = Boolean(localStorage.getItem("project"));
  createActionButtons(isProjectStored, pageActionsContainer);
});

window.addEventListener("storage", (event) => {
  if (event.key === "project") {
    console.log("Storage change detected:", event);
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
    registerTeamButton.onclick = () =>
      openModal("register-team-modal", "register-team-modal-overlay");
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
  drawerHeader.innerHTML = `
    <span><strong data-i18n="table-topic-number"></strong> ${data.topicNumber}</span>
    <button class="close-drawer-button" aria-label="Close drawer" onclick="closeDrawer()">&times;</button>
  `;
  drawerContent.innerHTML = `
    <p><strong data-i18n="table-topic-name"></strong> ${data.topicName}</p>
    <p><strong data-i18n="table-description"></strong>
      <textarea class="textarea-component" data-field="description" rows="4" disabled>${data.description}</textarea>
    </p>
    <p><strong data-i18n="table-sample-distribution"></strong>
      <textarea class="textarea-component" data-field="sampleDistribution" rows="4" disabled>${data.sampleDistribution}</textarea>
    </p>
    <p><strong data-i18n="table-participant-1"></strong>
      <textarea class="textarea-component" data-field="participant1" rows="4" disabled>${data.participant1}</textarea>
    </p>
    <p><strong data-i18n="table-participant-2"></strong>
      <textarea class="textarea-component" data-field="participant2" rows="4" disabled>${data.participant2}</textarea>
    </p>
    <p><strong data-i18n="table-participant-3"></strong>
      <textarea class="textarea-component" data-field="participant3" rows="4" disabled>${data.participant3}</textarea>
    </p>
    <p><strong data-i18n="table-integration"></strong>
      <textarea class="textarea-component" data-field="integration" rows="3" disabled>${data.integration}</textarea>
    </p>
    <p><strong data-i18n="table-requirements"></strong>
      <textarea class="textarea-component" data-field="requirements" rows="3" disabled>${data.requirements}</textarea>
    </p>
  `;
  applyTranslations();
}

function populateTopicDropdown(id) {
  const topicDropdown = document.getElementById(id);
  topicDropdown.innerHTML = "";
  sampleData.forEach((topic) => {
    const option = document.createElement("option");
    option.value = topic.topicNumber;
    option.textContent = `${topic.topicNumber} - ${topic.topicName}`;
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
      <div class="input-container row-input">
        <i class="input-icon fa-regular fa-user"></i>
        <input
          type="text"
          class="studentName"
          data-i18n-placeholder="student-name-placeholder-team"
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
  project.team.forEach((member) => {
    const teammateRow = document.createElement("div");
    teammateRow.classList.add("flex-container", "row", "teammate-row");
    teammateRow.innerHTML = `
      <div class="input-container row-input">
        <i class="input-icon fa-solid fa-hashtag"></i>
        <input
          type="text"
          class="facultyNumber"
          value="${member.facultyNumber}"
          data-i18n-placeholder="faculty-number-placeholder-team"
        />
      </div>
      <div class="input-container row-input">
        <i class="input-icon fa-regular fa-user"></i>
        <input
          type="text"
          class="studentName"
          value="${member.studentName}"
          data-i18n-placeholder="student-name-placeholder-team"
        />
      </div>
      <button class="remove-button" onclick="removeTeammateRow(this,'teammates-edit-container')">-</button>
    `;
    teammatesContainer.appendChild(teammateRow);
  });

  editFields.innerHTML = "";
  project.team.forEach((_, index) => {
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
      >${project.distribution?.[participantKey] || ""}</textarea>
    `;
    editFields.appendChild(participantField);
  });

  commentsField.value = project.distribution?.comments || "";

  applyTranslations();
  forceApplyPlaceholders();

  openModal("edit-team-modal", "edit-team-modal-overlay");
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
    const facultyNumber = row.querySelector(".facultyNumber").value.trim();
    const studentName = row.querySelector(".studentName").value.trim();

    if (!facultyNumber || !studentName) {
      displayErrorMessage("error-no-details-team-members");
      throw new Error("Validation Error: Missing teammate details.");
    }

    return { facultyNumber, studentName };
  });

  const team = { topicNumber: selectedTopic, team: teamDetails };

  updateLocalStorage("project", team);

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
    const facultyNumber = row.querySelector(".facultyNumber").value.trim();
    const studentName = row.querySelector(".studentName").value.trim();

    if (!facultyNumber || !studentName) {
      displayErrorMessage("error-no-details-team-members");
      throw new Error("Validation Error: Missing teammate details.");
    }

    return { facultyNumber, studentName };
  });

  const participant1 = document.getElementById("participant1")?.value.trim();
  const participant2 = document.getElementById("participant2")?.value.trim();
  const participant3 = document.getElementById("participant3")?.value.trim();
  const comments = document.getElementById("comments")?.value.trim();

  const distribution = {};
  if (participant1) distribution.participant1 = participant1;
  if (participant2) distribution.participant2 = participant2;
  if (participant3) distribution.participant3 = participant3;
  if (comments) distribution.comments = comments;

  const updatedProject = {
    topicNumber: selectedTopic,
    team: teamDetails,
    ...(Object.keys(distribution).length > 0 && { distribution }),
  };

  console.log(updatedProject);

  updateLocalStorage("project", updatedProject);

  closeModal("edit-team-modal", "edit-team-modal-overlay");
}
