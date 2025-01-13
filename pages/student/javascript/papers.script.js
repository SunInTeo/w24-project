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
      <td>${item.number}</td>
      <td>${item.topicName}</td>
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
}

document.addEventListener("DOMContentLoaded", () => {
  const sampleData = generateSampleData(10);
  renderTable(sampleData);
});

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
    <p><strong data-i18n="table-topic-name"></strong>
      <span>${data.topicName}</span>
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
    <button class="save-drawer-button" onclick="saveDrawer()" data-i18n="send-text"></button>
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

function saveDrawer() {
  const editedData = {
    topicNumber: document
      .querySelector(".drawer-header span")
      .textContent.trim(),
    topicName: topicName,
    sampleResources: document
      .querySelector("textarea[data-field='sampleResources']")
      .value.trim(),
    yourResources: document
      .querySelector("textarea[data-field='yourResources']")
      .value.trim(),
    presentationContent: document
      .querySelector("textarea[data-field='presentationContent']")
      .value.trim(),
    sampleContent: document
      .querySelector("textarea[data-field='sampleContent']")
      .value.trim(),
    presentationResume: document
      .querySelector("textarea[data-field='presentationResume']")
      .value.trim(),
    keywords: document
      .querySelector("textarea[data-field='keywords']")
      .value.trim(),
    nonFormal: document
      .querySelector("textarea[data-field='nonFormal']")
      .value.trim(),
  };

  console.log("Edited Data:", editedData);
  closeDrawer();
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
