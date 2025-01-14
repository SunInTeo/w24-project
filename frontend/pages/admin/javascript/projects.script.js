const sampleData = [
  {
    topicNumber: 1,
    topicName: "AI in Healthcare",
    description: "Exploring AI's role in diagnostics and treatment.",
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

document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.querySelector("#project_topics tbody");
  const removeButton = document.createElement("button");
  removeButton.id = "delete-selected";
  removeButton.setAttribute("data-i18n", "delete-selected");

  removeButton.classList.add("delete-selected");
  removeButton.classList.add("delete-button");
  removeButton.classList.add("small");
  removeButton.disabled = true;
  removeButton.addEventListener("click", removeSelectedRows);
  document.getElementById("page-actions").appendChild(removeButton);

  sampleData.forEach((data) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><input type="checkbox" class="row-checkbox" data-id="${data.topicNumber}"></td>
      <td>${data.topicNumber}</td>
      <td>${data.topicName}</td>
      <td>${data.description}</td>
      <td>${data.participant1}</td>
      <td>${data.participant2}</td>
      <td>${data.participant3}</td>
      <td>${data.integration}</td>
      <td>${data.requirements}</td>
    `;
    row.addEventListener("click", (event) => {
      if (event.target.type === "checkbox") return;
      openReviewDrawer(data);
    });

    row
      .querySelector(".row-checkbox")
      .addEventListener("change", handleRowCheckbox);
    tableBody.appendChild(row);
  });
  document
    .getElementById("select-all")
    .addEventListener("change", handleSelectAllCheckbox);
});

document.addEventListener("DOMContentLoaded", () => {
  createActionButtons(pageActionsContainer);
});

function createActionButtons(container) {
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
    <p><strong data-i18n="table-topic-name"></strong>  
            <textarea
            class="textarea-component"
              data-field="topic-name"
            >${data.topicName}
            </textarea>
          </p>
    <p><strong data-i18n="table-description"></strong>
      <textarea class="textarea-component" data-field="description" rows="4" >${data.description}</textarea>
    </p>

    <p><strong data-i18n="table-participant-1"></strong>
      <textarea class="textarea-component" data-field="participant1" rows="4" >${data.participant1}</textarea>
    </p>
    <p><strong data-i18n="table-participant-2"></strong>
      <textarea class="textarea-component" data-field="participant2" rows="4" >${data.participant2}</textarea>
    </p>
    <p><strong data-i18n="table-participant-3"></strong>
      <textarea class="textarea-component" data-field="participant3" rows="4" >${data.participant3}</textarea>
    </p>
    <p><strong data-i18n="table-integration"></strong>
      <textarea class="textarea-component" data-field="integration" rows="3" >${data.integration}</textarea>
    </p>
    <p><strong data-i18n="table-requirements"></strong>
      <textarea class="textarea-component" data-field="requirements" rows="3" >${data.requirements}</textarea>
    </p>
    <div class="flex-container">
    <button data-i18n="save-text" class="primary"></button>
    <button data-i18n="cancel-text" onclick=closeDrawer()></button>
    </div>
  `;
  applyTranslations();
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

function removeSelectedRows() {
  document.querySelectorAll(".row-checkbox:checked").forEach((checkbox) => {
    checkbox.closest("tr").remove();
  });
  document.querySelector("#select-all").checked = false;
  updateRemoveButtonState();
}
