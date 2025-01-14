const sampleDays = [
  "18.12.2024",
  "19.12.2024",
  "06.01.2025",
  "07.01.2025",
  "08.01.2025",
  "09.01.2025",
  "10.01.2025",
  "11.01.2025",
  "12.01.2025",
  "13.01.2025",
];

const Day1 = [
  {
    time: "08:00",
    facultyNumber: "88282",
    studentName: "John Doe",
    studentGroup: 3,
    topicNumber: 1,
    topicName: "Introduction to Programming",
  },
  {
    time: "08:10",
    facultyNumber: "88283",
    studentName: "Jane Smith",
    studentGroup: 3,
    topicNumber: 2,
    topicName: "Advanced Mathematics",
  },
  {
    time: "08:20",
    facultyNumber: "88284",
    studentName: "Alice Johnson",
    studentGroup: 2,
    topicNumber: 3,
    topicName: "Data Structures",
  },
  {
    time: "08:30",
    facultyNumber: "88285",
    studentName: "Bob Brown",
    studentGroup: 4,
    topicNumber: 4,
    topicName: "Operating Systems",
  },
  {
    time: "10:00",
    facultyNumber: "88286",
    studentName: "Charlie Davis",
    studentGroup: 1,
    topicNumber: 5,
    topicName: "Machine Learning Basics",
  },
  {
    time: "08:50",
    facultyNumber: "88287",
    studentName: "Diana Green",
    studentGroup: 2,
    topicNumber: 6,
    topicName: "Cybersecurity Fundamentals",
  },
  {
    time: "09:00",
    facultyNumber: "88288",
    studentName: "Edward Hall",
    studentGroup: 5,
    topicNumber: 7,
    topicName: "Introduction to Databases",
  },
  {
    time: "10:20",
    facultyNumber: "88289",
    studentName: "Fiona Gray",
    studentGroup: 3,
    topicNumber: 8,
    topicName: "Web Development Basics",
  },
  {
    time: "09:20",
    facultyNumber: "88290",
    studentName: "George White",
    studentGroup: 1,
    topicNumber: 9,
    topicName: "Computer Networks",
  },
  {
    time: "09:30",
    facultyNumber: "88291",
    studentName: "Helen Black",
    studentGroup: 4,
    topicNumber: 10,
    topicName: "Artificial Intelligence Overview",
  },
  {
    time: "09:40",
    facultyNumber: "88292",
    studentName: "Ian Wright",
    studentGroup: 2,
    topicNumber: 11,
    topicName: "Discrete Mathematics",
  },
  {
    time: "09:50",
    facultyNumber: "88293",
    studentName: "Julia Brown",
    studentGroup: 5,
    topicNumber: 12,
    topicName: "Mobile Application Development",
  },
];

const Day2 = [
  {
    time: "10:00",
    facultyNumber: "88284",
    studentName: "Alice Brown",
    studentGroup: 2,
    topicNumber: 3,
    topicName: "Data Structures",
  },
  {
    time: "11:00",
    facultyNumber: "88285",
    studentName: "Bob Martin",
    studentGroup: 2,
    topicNumber: 4,
    topicName: "Operating Systems",
  },
];

const Day3 = [
  {
    time: "09:00",
    facultyNumber: "88286",
    studentName: "Chris Johnson",
    studentGroup: 1,
    topicNumber: 5,
    topicName: "Database Management",
  },
  {
    time: "10:30",
    facultyNumber: "88287",
    studentName: "Diana Scott",
    studentGroup: 1,
    topicNumber: 6,
    topicName: "Machine Learning",
  },
];

const Day4 = [
  {
    time: "14:00",
    facultyNumber: "88288",
    studentName: "Eve Wilson",
    studentGroup: 4,
    topicNumber: 7,
    topicName: "Artificial Intelligence",
  },
  {
    time: "15:00",
    facultyNumber: "88289",
    studentName: "Frank White",
    studentGroup: 4,
    topicNumber: 8,
    topicName: "Cybersecurity",
  },
];

const Day5 = [
  {
    time: "13:00",
    facultyNumber: "88290",
    studentName: "Grace Lee",
    studentGroup: 5,
    topicNumber: 9,
    topicName: "Cloud Computing",
  },
  {
    time: "14:30",
    facultyNumber: "88291",
    studentName: "Hank Moore",
    studentGroup: 5,
    topicNumber: 10,
    topicName: "Web Development",
  },
];

const Day6 = [
  {
    time: "11:00",
    facultyNumber: "88292",
    studentName: "Ivy Taylor",
    studentGroup: 6,
    topicNumber: 11,
    topicName: "Mobile Application Development",
  },
  {
    time: "12:00",
    facultyNumber: "88293",
    studentName: "Jake Harris",
    studentGroup: 6,
    topicNumber: 12,
    topicName: "Computer Networks",
  },
];

const dayData = [Day1, Day2, Day3, Day4, Day5, Day6];
let dateIndexInDays = -1;
document.addEventListener("DOMContentLoaded", function () {
  const daysContainer = document.getElementById("days");

  sampleDays.forEach((day, index) => {
    const button = document.createElement("button");
    button.textContent = day;
    button.classList.add("day-button");
    button.onclick = () => showDayData(index);
    daysContainer.appendChild(button);
  });
});

function sortDays(data) {
  return data.slice().sort((a, b) => {
    const timeA = new Date(`1970-01-01T${a.time}:00`);
    const timeB = new Date(`1970-01-01T${b.time}:00`);
    return timeA - timeB;
  });
}

function assignButtonActiveClass(dayIndex) {
  const btn = document.getElementsByTagName("button");
  btn[dayIndex + 2].classList.add("active");
  for (let i = 2; i < btn.length; i++) {
    if (i !== dayIndex + 2) {
      btn[i].classList.remove("active");
    }
  }
}
function showDayData(dayIndex) {
  assignButtonActiveClass(dayIndex);

  dateIndexInDays = dayIndex;
  const timetableContainer = document.getElementById("timetable");
  const data = dayData[dayIndex];

  if (!data) {
    timetableContainer.innerHTML = `<div class="timetable-card-container">
        <div class="card">
            <div class="card-header"><span data-i18n="hey"></span></div>
              <div class="card-body">
                  <span data-i18n="info-no-data-available-for-day-admin"></span>
            </div>

        </div>
      </div> </div>`;
    applyTranslations();
    return;
  }
  const sortedData = sortDays(data);

  let tableHTML = `
   <div class="flex-container page-actions" id="page-actions">
          <button
            class="download-table-button"
            onclick="downloadTableAsExcel('timetable')"
            data-i18n="download-xlsx"
          ></button>
          <button
            class="delete-button small"
            onclick="deleteDay()"
            data-i18n="delete-timetable"
          ></button>
          
        </div>
          <div class="table-container">
    <table border="1" style="width: 100%; border-collapse: collapse;" class="table" id="timetable">
      <thead>
        <tr>
          <th data-i18n="hour"></th>
          <th data-i18n="faculty-number-placeholder-team"></th>
          <th data-i18n="student-name-placeholder-team"></th>
          <th data-i18n="group"></th>
          <th data-i18n="table-topic-number"></th>
          <th data-i18n="table-topic-name"></th>
        </tr>
      </thead>
      <tbody>
  `;

  sortedData.forEach((entry) => {
    tableHTML += `
      <tr>
        <td>${entry.time}</td>
        <td>${entry.facultyNumber}</td>
        <td>${entry.studentName}</td>
        <td>${entry.studentGroup}</td>
        <td>${entry.topicNumber}</td>
        <td>${entry.topicName}</td>
      </tr>
    `;
  });

  tableHTML += `
      </tbody>
    </table>
    </div>
  `;

  timetableContainer.innerHTML = tableHTML;
  applyTranslations();
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
    { wch: 30 },
    { wch: 15 },
    { wch: 15 },
    { wch: 60 },
  ];
  worksheet["!cols"] = columnWidths;

  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  XLSX.writeFile(workbook, `timetable_day${sampleDays[dateIndexInDays]}.xlsx`);
}

function openAddToTimetableModal(modalID, modalOverlayID) {
  openModal(modalID, modalOverlayID);
}
