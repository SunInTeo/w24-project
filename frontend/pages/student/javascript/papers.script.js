const drawer = document.getElementById("drawer");
const overlay = document.getElementById("drawerOverlay");
const drawerHeader = document.querySelector(".drawer-header");
const drawerContent = document.querySelector(".drawer-content");
let topicName = "";

document.addEventListener("DOMContentLoaded", () => {
  initializeTable();
  fetchResearchPapers("papers_student");
});

function renderTable(data) {
  const table = document.querySelector("#research_papers");
  if (!table) {
    console.error("Table with ID 'research_papers' not found.");
    return;
  }

  let tbody = table.querySelector("tbody");
  if (!tbody) {
    console.error("The <tbody> element does not exist.");
    tbody = document.createElement("tbody");
    table.appendChild(tbody);
  }
  if (!data.length) {
    document.querySelector(".table-container").innerHTML = `
      <div class="card no-data-card">
        <div class="card-header" data-i18n="no-data-available">No Data Available</div>
        <div class="card-body">
          <span data-i18n="no-research-papers"></span>
        </div>
      </div>`;
    applyTranslations();
    return;
  }

  tbody.innerHTML = "";
  data.forEach((item) => {
    const row = `
      <tr>
        <td>${item.essay_id}</td>
        <td>${item.title}</td>
        <td>${item.resources || "-"}</td>
        <td>${item.own_resources || "-"}</td>
        <td>${item.content_of_presentation || "-"}</td>
        <td>${item.content_of_examples || "-"}</td>
        <td>${item.resume_of_presentation || "-"}</td>
        <td>${item.keywords || "-"}</td>
        <td>${item.comments || "-"}</td>
      </tr>`;
    tbody.insertAdjacentHTML("beforeend", row);
  });
}

function populateDrawer(data) {
  const formatText = (text) => {
    if (!text || text === "-") return "";
    return text.replace(/(\d+\.+\D)/g, "\n$1").replace(/(\[\d+\])/g, "\n$1");
  };

  drawerHeader.innerHTML = `
  <span><strong data-i18n="table-topic-number"></strong>     <span id="topic-number-id">${data.topicNumber}</span></span>
    <button class="close-drawer-button" aria-label="Close drawer" onclick="closeDrawer()">
      &times;
    </button>
  `;

  drawerContent.innerHTML = `
      <p><strong data-i18n="table-topic-name"></strong>
      <span id="topic-name-id">${data.topicName}</span>
    </p>
    <p><strong data-i18n="table-sample-resources"></strong>
      <textarea class="textarea-component" disabled data-field="sampleResources" rows="5">${formatText(
        data.sampleResources
      )}</textarea>
    </p>
    <p><strong data-i18n="table-your-resources"></strong>
      <textarea class="textarea-component" data-field="yourResources" rows="5">${formatText(
        data.yourResources
      )}</textarea>
    </p>
    <p><strong data-i18n="table-presentation-content"></strong>
      <textarea class="textarea-component" data-field="presentationContent" rows="5">${formatText(
        data.presentationContent
      )}</textarea>
    </p>
    <p><strong data-i18n="table-sample-content"></strong>
      <textarea class="textarea-component" data-field="sampleContent" rows="5">${formatText(
        data.sampleContent
      )}</textarea>
    </p>
    <p><strong data-i18n="table-presentation-resume"></strong>
      <textarea class="textarea-component" data-field="presentationResume" rows="5">${formatText(
        data.presentationResume
      )}</textarea>
    </p>
    <p><strong data-i18n="table-keywords"></strong>
      <textarea class="textarea-component" data-field="keywords" rows="3">${formatText(
        data.keywords
      )}</textarea>
    </p>
    <p><strong data-i18n="table-non-formal"></strong>
      <textarea class="textarea-component" data-field="nonFormal" rows="3">${formatText(
        data.nonFormal
      )}</textarea>
    </p>
    <div class="flex-container">
    <button class="save-drawer-button" onclick="editEssayStudent()" data-i18n="send-text"></button>
    <button class="cancel-drawer-button" onclick="closeDrawer()" data-i18n="cancel-text"></button>
    </div>
  `;

  applyTranslations();
}

document
  .querySelector("#research_papers tbody")
  .addEventListener("click", (event) => {
    const row = event.target.closest("tr");
    if (row) {
      const cells = row.querySelectorAll("td");
      const rowData = {
        topicNumber: cells[0].textContent.trim(),
        topicName: cells[1].textContent.trim(),
        sampleResources: cells[2].textContent.trim(),
        yourResources: cells[3].textContent.trim(),
        presentationContent: cells[4].textContent.trim(),
        sampleContent: cells[5].textContent.trim(),
        presentationResume: cells[6].textContent.trim(),
        keywords: cells[7].textContent.trim(),
        nonFormal: cells[8].textContent.trim(),
      };
      topicName = rowData.topicName;
      openPageDrawer(rowData);
    }
  });

async function editEssayStudent() {
  const essayData = {
    user_id: localStorage.getItem("user_id"),
    essay_id: document.querySelector("#topic-number-id").textContent.trim(),
    title: document.querySelector("#topic-name-id").textContent.trim(),
    resources: checkTextIfNull("textarea[data-field='sampleResources']"),
    own_resources: checkTextIfNull("textarea[data-field='yourResources']"),
    content_of_presentation: checkTextIfNull(
      "textarea[data-field='presentationContent']"
    ),
    content_of_examples: checkTextIfNull(
      "textarea[data-field='sampleContent']"
    ),
    resume_of_presentation: checkTextIfNull(
      "textarea[data-field='presentationResume']"
    ),
    keywords: checkTextIfNull("textarea[data-field='keywords']"),
    comments: checkTextIfNull("textarea[data-field='nonFormal']"),
  };

  if (!essayData.essay_id) {
    showToast("essay-id-required", "error");
    return;
  }

  try {
    const response = await fetch("../../../backend/papers_student.php", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(essayData),
    });

    const data = await response.json();
    if (data.status === "success") {
      fetchResearchPapers("papers_student");
      closeDrawer();
      showToast("success-editing-essay-student");
      localStorage.setItem("essay_id", essayData.essay_id);
    } else {
      showErrorModal(data.message || "Failed to update essay.");
    }
  } catch (error) {
    console.error("Error updating essay:", error);
    showToast("error-editing-essay-student", "error");
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
    { wch: 30 },
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
    { hpt: 55 },
  ];
  worksheet["!rows"] = rowHeights;

  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  XLSX.writeFile(workbook, "research_papers_table.xlsx");
}

document
  .getElementById("propose-topic-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const proposedTopic = document.getElementById("proposedTopic").value.trim();
    const proposeTopicText = document
      .getElementById("proposeTopicText")
      .value.trim();

    if (!proposedTopic || !proposeTopicText) {
      showToast("all-fields-required", "warning");
      return;
    }

    try {
      const response = await fetch("../../../propose_topic.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: proposedTopic,
          description: proposeTopicText,
        }),
      });

      const data = await response.json();

      if (data.status === "success") {
        showToast("success-propose-topic");
        closeModal("propose-topic-modal", "propose-topic-modal-overlay");
        resetForm("propose-topic-form");
      } else {
        showToast("error-propose-topic", "error");
      }
    } catch (error) {
      console.error("Error proposing topic:", error);
    }
  });
