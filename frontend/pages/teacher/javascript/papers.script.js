const drawer = document.getElementById("drawer");
const overlay = document.getElementById("drawerOverlay");
const drawerHeader = document.querySelector(".drawer-header");
const drawerContent = document.querySelector(".drawer-content");
document.addEventListener("DOMContentLoaded", async () => {
  initializeTable();
  await fetchResearchPapers("papers_admin");

  initializeEventListeners();
});

function initializeEventListeners() {
  const selectAllCheckbox = document.querySelector("#select-all");
  if (selectAllCheckbox) {
    selectAllCheckbox.addEventListener("change", toggleSelectAll);
  }

  const deleteButton = document.getElementById("delete-selected");
  if (deleteButton) {
    deleteButton.addEventListener("click", () => {
      openModal("confirm-modal", "confirm-modal-overlay");
    });
  }

  document
    .querySelector("#research_papers tbody")
    ?.addEventListener("click", handleRowClick);
}

function renderTable(data) {
  const tableContainer = document.querySelector(".table-container");
  const table = document.querySelector("#research_papers");
  const noDataDiv = document.querySelector(".no-data-div");

  if (!table) {
    console.error("Table with ID 'research_papers' not found.");
    return;
  }

  let tbody = table.querySelector("tbody");
  if (!tbody) {
    console.warn("The <tbody> element does not exist. Creating one.");
    tbody = document.createElement("tbody");
    table.appendChild(tbody);
  }

  tbody.innerHTML = "";

  if (!data.length) {
    table.style.display = "none";
    noDataDiv.innerHTML = `
      <div class="card no-data-card">
        <div class="card-header" data-i18n="no-data-available">No Data Available</div>
        <div class="card-body">
          <span data-i18n="no-research-papers">No research papers available.</span>
        </div>
      </div>
    `;
    noDataDiv.style.display = "block";
    applyTranslations();
    return;
  }

  table.style.display = "table";
  noDataDiv.style.display = "none";

  data.forEach((item) => {
    const row = `
      <tr>
        <td><input type="checkbox" class="row-checkbox" data-id="${
          item.essay_id
        }" /></td>
        <td>${item.essay_id}</td>
        <td>${item.title}</td>
        <td>${item.faculty_number || "-"}</td>
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

  document.querySelectorAll(".row-checkbox").forEach((checkbox) => {
    checkbox.addEventListener("change", handleCheckboxChange);
  });

  tableContainer.style.display = "block";
}

function toggleSelectAll(event) {
  const isChecked = event.target.checked;
  document.querySelectorAll(".row-checkbox").forEach((checkbox) => {
    checkbox.checked = isChecked;
  });
  handleCheckboxChange();
}

function handleCheckboxChange() {
  const checkboxes = Array.from(document.querySelectorAll(".row-checkbox"));
  const deleteButton = document.getElementById("delete-selected");
  const allChecked = checkboxes.every((checkbox) => checkbox.checked);
  const anyChecked = checkboxes.some((checkbox) => checkbox.checked);

  document.querySelector("#select-all").checked = allChecked;
  deleteButton.disabled = !anyChecked;
}

async function deleteSelectedEssays() {
  const selectedIds = Array.from(
    document.querySelectorAll(".row-checkbox:checked")
  ).map((checkbox) => checkbox.dataset.id);

  if (!selectedIds.length) {
    showErrorModal("No rows selected for deletion.");
    return;
  }

  try {
    const response = await fetch("../../../backend/papers_admin.php", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: selectedIds }),
    });

    const data = await response.json();
    if (data.status === "success") {
      selectedIds.forEach((id) => {
        const row = document
          .querySelector(`.row-checkbox[data-id="${id}"]`)
          .closest("tr");
        if (row) row.remove();
      });

      document.getElementById("delete-selected").disabled = true;
      fetchResearchPapers("papers_admin");
      showToast("success-deleting-essays-admin");
    } else {
      showErrorModal(data.message || "Failed to delete rows.");
    }
  } catch (error) {
    console.error("Error deleting rows:", error);
    showToast("error-deleting-essays-admin", "error");
  } finally {
    closeModal("confirm-modal", "confirm-modal-overlay");
  }
}

function handleRowClick(event) {
  if (event.target.closest("input[type='checkbox']")) return;

  const row = event.target.closest("tr");
  if (!row) return;

  const cells = row.querySelectorAll("td");
  const rowData = {
    topicNumber: cells[1]?.textContent.trim(),
    topicName: cells[2]?.textContent.trim(),
    studentFN: cells[3]?.textContent.trim(),
    resources: cells[4]?.textContent.trim(),
    yourResources: cells[5]?.textContent.trim(),
    presentationContent: cells[6]?.textContent.trim(),
    sampleContent: cells[7]?.textContent.trim(),
    resumeOfPresentation: cells[8]?.textContent.trim(),
    keywords: cells[9]?.textContent.trim(),
    comments: cells[10]?.textContent.trim(),
  };

  openPageDrawer(rowData);
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
    <p><strong data-i18n="faculty-number-placeholder-team"></strong>
      <span class="student-fn">${data.studentFN || "неизбрана"}</span>
    </p>
    <p><strong data-i18n="table-topic-name"></strong>
     <div class="input-container">
            <input
              type="text"
              data-field="topicName"    
              value="${data.topicName}"       
            />
          </div>
    </p>
    <p><strong data-i18n="table-sample-resources"></strong>
      <textarea class="textarea-component" data-field="sampleResources" rows="5">${formatText(
        data.resources
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
        data.resumeOfPresentation
      )}</textarea>
    </p>
    <p><strong data-i18n="table-keywords"></strong>
      <textarea class="textarea-component" data-field="keywords" rows="3">${formatText(
        data.keywords
      )}</textarea>
    </p>
    <p><strong data-i18n="table-non-formal"></strong>
      <textarea class="textarea-component" data-field="nonFormal" rows="3">${formatText(
        data.comments
      )}</textarea>
    </p>
    <div class="flex-container">
      <button class="save-drawer-button" onclick="editEssay()" data-i18n="send-text"></button>
      <button class="cancel-drawer-button" onclick="closeDrawer()" data-i18n="cancel-text"></button>
    </div>
  `;

  applyTranslations();
}

async function addEssay(event) {
  event.preventDefault();

  const form = document.getElementById("add-topic-form");
  const title = form.querySelector("#addedTopic").value.trim();
  const resources = form
    .querySelector("#sampleResourcesTopicText")
    .value.trim();

  if (!title || !resources) {
    showToast("error-missing-fields", "error");
    return;
  }

  const formData = new FormData();
  formData.append("user_id", localStorage.getItem("user_id"));
  formData.append("title", title);
  formData.append("resources", resources);

  try {
    const response = await fetch("../../../backend/papers_admin.php", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (data.status === "success") {
      fetchResearchPapers("papers_admin");
      document
        .querySelector(".table-container")
        .classList.remove("hidden-content");
      showToast("success-adding-essay-admin");
      closeModal("add-topic-modal", "add-topic-modal-overlay");
    } else {
      showErrorModal(data.message);
    }
  } catch (error) {
    console.error("Error adding essay:", error);
    showToast("error-adding-essay-admin", "error");
  } finally {
    resetForm("add-topic-form");
  }
}

async function editEssay() {
  const essayData = {
    essay_id: document.querySelector("#topic-number-id").textContent.trim(),
    title: checkTextIfNull("input[data-field='topicName']"),
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

  try {
    const response = await fetch("../../../backend/papers_admin.php", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(essayData),
    });

    const data = await response.json();
    if (data.status === "success") {
      fetchResearchPapers("papers_admin");
      closeDrawer();
      showToast("success-editing-essay-admin");
    } else {
      showErrorModal(data.message || "Failed to update essay.");
    }
  } catch (error) {
    console.error("Error updating essay:", error);
    showToast("error-editing-essay-admin", "error");
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
