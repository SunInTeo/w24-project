const drawer = document.getElementById("drawer");
const overlay = document.getElementById("drawerOverlay");
const drawerHeader = document.querySelector(".drawer-header");
const drawerContent = document.querySelector(".drawer-content");
let topicName = "";

function generateSampleData(rowCount) {
  const sampleData = [];
  for (let i = 1; i <= rowCount; i++) {
    sampleData.push({
      number: i,
      topicName: `Example Topic ${i}`,
      studentFN: `${i}0000`,
      sampleResources: `Example Resource ${i}`,
      yourResources: `Your Link ${i}`,
      presentationContent: `Presentation Details ${i}`,
      sampleContent: `Sample Details ${i}`,
      presentationResume: `Presentation Summary ${i}`,
      keywords: `Keywords ${i}`,
      nonFormal: `Informal ${i}`,
    });
  }
  return sampleData;
}

function renderTable(data) {
  const tableBody = document.querySelector("#research_papers tbody");
  tableBody.innerHTML = "";

  data.forEach((item) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td><input type="checkbox" class="row-checkbox" data-id="${item.number}"></td>
      <td>${item.number}</td>
      <td>${item.topicName}</td>
      <td>${item.studentFN}</td>
      <td>${item.sampleResources}</td>
      <td>${item.yourResources}</td>
      <td>${item.presentationContent}</td>
      <td>${item.sampleContent}</td>
      <td>${item.presentationResume}</td>
      <td>${item.keywords}</td>
      <td>${item.nonFormal}</td>
    `;

    tableBody.appendChild(row);
  });

  document.querySelectorAll(".row-checkbox").forEach((checkbox) => {
    checkbox.addEventListener("change", handleCheckboxChange);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const sampleData = generateSampleData(10);
  renderTable(sampleData);

  document
    .getElementById("delete-selected")
    .addEventListener("click", deleteSelectedRows);

  const selectAllCheckbox = document.querySelector("#select-all");
  selectAllCheckbox.addEventListener("change", (event) => {
    const isChecked = event.target.checked;
    document.querySelectorAll(".row-checkbox").forEach((checkbox) => {
      checkbox.checked = isChecked;
    });
    handleCheckboxChange();
  });

  document
    .querySelector("#research_papers tbody")
    .addEventListener("click", (event) => {
      if (event.target.closest("input[type='checkbox']")) return;

      const row = event.target.closest("tr");
      if (row) {
        const cells = row.querySelectorAll("td");
        const rowData = {
          topicNumber: cells[1].textContent.trim(),
          topicName: cells[2].textContent.trim(),
          studentFN: cells[3].textContent.trim(),
          sampleResources: cells[4].textContent.trim(),
          yourResources: cells[5].textContent.trim(),
          presentationContent: cells[6].textContent.trim(),
          sampleContent: cells[7].textContent.trim(),
          presentationResume: cells[8].textContent.trim(),
          keywords: cells[9].textContent.trim(),
          nonFormal: cells[10].textContent.trim(),
        };
        topicName = rowData.topicName;
        openPageDrawer(rowData);
      }
    });
});

function handleCheckboxChange() {
  const checkboxes = document.querySelectorAll(".row-checkbox");
  const deleteButton = document.getElementById("delete-selected");
  const anyChecked = Array.from(checkboxes).some(
    (checkbox) => checkbox.checked
  );
  deleteButton.disabled = !anyChecked;

  const allChecked = Array.from(checkboxes).every(
    (checkbox) => checkbox.checked
  );
  document.querySelector("#select-all").checked = allChecked;
}

function deleteSelectedRows() {
  const selectedIds = Array.from(document.querySelectorAll(".row-checkbox:checked"))
    .map((checkbox) => checkbox.dataset.id);

  if (selectedIds.length > 0) {
    fetch("delete_endpoint.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: selectedIds }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          selectedIds.forEach((id) => {
            const row = document.querySelector(`.row-checkbox[data-id="${id}"]`).closest("tr");
            row.remove();
          });
          document.getElementById("delete-selected").disabled = true;
        } else {
          alert("Failed to delete rows.");
        }
      })
      .catch((error) => console.error("Error:", error));
  }
}

function openPageDrawer(data) {
  populateDrawer(data);
  openDrawer("drawer", "drawerOverlay");
}

function populateDrawer(data) {
  const formatText = (text) => {
    if (!text) return "";
    return text.replace(/(\d+\.+\D)/g, "\n$1").replace(/(\[\d+\])/g, "\n$1");
  };

  drawerHeader.innerHTML = `
    <span><strong data-i18n="table-topic-number"></strong> ${data.topicNumber}</span>
    <button class="close-drawer-button" aria-label="Close drawer" onclick="closeDrawer()">
      &times;
    </button>
  `;

  drawerContent.innerHTML = `
    <p><strong data-i18n="faculty-number-placeholder-team"></strong>
      <span class="student-fn">${data.studentFN || "неизбрана"}</span>
    </p>
    <p><strong data-i18n="table-topic-name"></strong>
      <span>${data.topicName}</span>
    </p>
    <p><strong data-i18n="table-sample-resources"></strong>
      <textarea class="textarea-component" data-field="sampleResources" rows="5">${formatText(
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
      <button class="save-drawer-button" onclick="saveDrawer()" data-i18n="send-text"></button>
      <button class="cancel-drawer-button" onclick="closeDrawer()" data-i18n="cancel-text"></button>
    </div>
  `;

  applyTranslations();
}

async function addTopic(event) {
  event.preventDefault();
  const formData = new FormData(document.getElementById("add-topic-form"));

  try {
    const response = await fetch("./research_papers.php", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();

    if (data.status === "success") {
      alert("Topic added successfully!");
      fetchResearchPapers(); // Refresh the table
      closeModal("add-topic-modal", "add-topic-modal-overlay");
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error("Error adding topic:", error);
  }
}

async function fetchResearchPapers() {
  try {
    const response = await fetch("./research_papers.php");
    const data = await response.json();

    if (data.status === "success") {
      const tbody = document.querySelector("#research_papers tbody");
      tbody.innerHTML = "";
      data.data.forEach((paper) => {
        const row = `
          <tr>
            <td><input type="checkbox" /></td>
            <td>${paper.essay_id}</td>
            <td>${paper.title}</td>
            <td>${paper.resources}</td>
            <td>${paper.own_resources}</td>
            <td>${paper.content_of_presentation}</td>
            <td>${paper.content_of_examples}</td>
            <td>${paper.resume_of_presentation}</td>
            <td>${JSON.parse(paper.keywords).join(", ")}</td>
          </tr>
        `;
        tbody.insertAdjacentHTML("beforeend", row);
      });
    } else {
      console.error(data.message);
    }
  } catch (error) {
    console.error("Error fetching research papers:", error);
  }
}

fetchResearchPapers();