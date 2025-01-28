async function fetchPresentationDays() {
  try {
    const response = await fetch("../../../backend/schedule_admin.php", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    if (data.status === "success") {
      renderPresentationDays(data.data);

      return data.data;
    } else {
      console.error("Error:", data.message);
      return [];
    }
  } catch (error) {
    console.error("Error fetching presentation days:", error);
    return [];
  }
}
document.addEventListener("DOMContentLoaded", async function () {
  const days = await fetchPresentationDays();
  if (days.length > 0) {
    showDayData(days[0].day_id);
    assignButtonActiveClass(0);
  }
});

function renderPresentationDays(days) {
  const daysContainer = document.getElementById("days");
  daysContainer.innerHTML = "";

  if (!days || days.length === 0) {
    daysContainer.innerHTML = `<p data-i18n="no-data-available"></p>`;
    applyTranslations();
    return;
  }

  days.forEach((day, index) => {
    const button = document.createElement("button");
    button.textContent = `${day.day_date} (${day.presentation_type})`;
    button.classList.add("day-button");

    button.onclick = () => {
      showDayData(day.day_id);
      assignButtonActiveClass(index);
    };

    daysContainer.appendChild(button);
  });

  applyTranslations();
}

function assignButtonActiveClass(index) {
  const buttons = document.querySelectorAll(".day-button");

  buttons.forEach((btn, idx) => {
    if (idx === index) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
}

function sortDays(data) {
  return data.slice().sort((a, b) => {
    const timeA = new Date(`1970-01-01T${a.time}:00`);
    const timeB = new Date(`1970-01-01T${b.time}:00`);
    return timeA - timeB;
  });
}

async function fetchUsersPresentationsByDay(dayDate, presentationType, dayId) {
  if (!dayDate || !presentationType) {
    console.error("Day date and presentation type are required.");
    return;
  }

  try {
    const response = await fetch(
      `../../../backend/fetch_schedule_by_day.php?day_date=${encodeURIComponent(
        dayDate
      )}&presentation_type=${encodeURIComponent(presentationType)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (data.status === "success") {
      renderDayData(data.users, dayId);
    } else {
      console.error("Error fetching users:", data.message);
      showToast("error-fetching-day", "error");
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    showToast("error-fetching-day", "error");
  }
}

async function showDayData(dayId) {
  assignButtonActiveClass(dayId);

  try {
    const response = await fetch(
      `../../../backend/schedule_admin.php?day_id=${dayId}`
    );
    const data = await response.json();

    if (data.status !== "success") {
      throw new Error("Failed to fetch presentation day data.");
    }

    fetchUsersPresentationsByDay(
      data.data.day_date,
      data.data.presentation_type,
      dayId
    );
  } catch (error) {
    console.error("Error fetching day data:", error);
    document.getElementById("timetable").innerHTML = `
      <div class="timetable-card-container">
        <div class="card">
          <div class="card-header"><span data-i18n="hey"></span></div>
          <div class="card-body">
            <span data-i18n="info-no-data-available-for-day-admin"></span>
          </div>
        </div>
      </div>`;
    applyTranslations();
  }
}

function renderDayData(dayData, dayId) {
  const timetableContainer = document.getElementById("timetable");

  let tableHTML = `
    <div class="flex-container page-actions" id="page-actions">
  `;

  if (dayData && dayData.length > 0) {
    tableHTML += `
      <button
        class="download-table-button"
        onclick="downloadTableAsExcel('timetable')"
        data-i18n="download-xlsx"
      ></button>
    `;
  }

  tableHTML += `
      <button
        class="delete-button small"
        onclick="confirmDeleteSelectedDay(${dayId})"
        data-i18n="delete-timetable"
      ></button>
    </div>
  `;

  if (!dayData || dayData.length === 0) {
    tableHTML += `
      <div class="timetable-card-container">
        <div class="card">
          <div class="card-header"><span data-i18n="hey"></span></div>
          <div class="card-body">
            <span data-i18n="info-no-data-available-for-day-admin"></span>
          </div>
        </div>
      </div>`;
  } else {
    dayData.sort((a, b) => {
      return a.presentation_time.localeCompare(b.presentation_time);
    });
    const groupedData = dayData.reduce((acc, entry) => {
      if (!acc[entry.presentation_time]) {
        acc[entry.presentation_time] = {
          presentation_time: entry.presentation_time,
          faculty_numbers: [],
          student_names: [],
          presentation_id: entry.presentation_id,
          presentation_title: entry.presentation_title,
        };
      }
      acc[entry.presentation_time].faculty_numbers.push(entry.faculty_number);
      acc[entry.presentation_time].student_names.push(entry.name);
      return acc;
    }, {});

    tableHTML += `
      <div class="table-container">
        <table border="1" style="width: 100%; border-collapse: collapse;" class="table" id="timetable">
          <thead>
            <tr>
              <th data-i18n="hour"></th>
              <th data-i18n="faculty-number-placeholder-team"></th>
              <th data-i18n="student-name-placeholder-team"></th>
              <th data-i18n="table-topic-number"></th>
              <th data-i18n="table-topic-name"></th>
            </tr>
          </thead>
          <tbody>
    `;

    Object.values(groupedData).forEach((entry) => {
      tableHTML += `
        <tr>
          <td>${entry.presentation_time}</td>
          <td>${entry.faculty_numbers.join(", ")}</td>
          <td>${entry.student_names.join(", ")}</td>
          <td>${entry.presentation_id}</td>
          <td>${entry.presentation_title}</td>
        </tr>
      `;
    });

    tableHTML += `
          </tbody>
        </table>
      </div>
    `;
  }

  timetableContainer.innerHTML = tableHTML;
  applyTranslations();
}

function confirmDeleteSelectedDay(dayId) {
  openModal("confirm-modal", "confirm-modal-overlay");
  const confirmButton = document.getElementById("confirm");
  confirmButton.onclick = () => {
    deleteDay(dayId);
  };
}
async function deleteDay(dayId) {
  try {
    const response = await fetch("../../../backend/schedule_admin.php", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ day_id: dayId }),
    });

    const data = await response.json();

    if (data.status === "success") {
      showToast("success-deleting-day");
      fetchPresentationDays();

      document.querySelectorAll(".day-button").forEach((btn) => {
        btn.classList.remove("active");
      });

      document.getElementById("timetable").innerHTML = `
         <div class="timetable-card-container">
           <div class="card">
             <div class="card-header"><span data-i18n="hey"></span></div>
             <div class="card-body">
               <span data-i18n="info-please-select-day"></span>
             </div>
           </div>
         </div>`;

      applyTranslations();
    } else {
      showToast("error-deleting-day", "error");
    }
  } catch (error) {
    console.error("Error deleting presentation day:", error);
    showToast("error-deleting-day", "error");
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
    { wch: 30 },
    { wch: 15 },
    { wch: 15 },
    { wch: 60 },
  ];
  worksheet["!cols"] = columnWidths;

  XLSX.utils.book_append_sheet(workbook, worksheet, "Schedule");

  XLSX.writeFile(workbook, `presentation_day_${tableID}.xlsx`);
}

function openAddToTimetableModal(modalID, modalOverlayID) {
  openModal(modalID, modalOverlayID);
}

async function saveDay() {
  const dayInput = document.getElementById("dayInput").value;
  const startTimeInput = document.getElementById("startTimeInput").value;
  const intervalsInput = document.getElementById("intervalsInput").value;
  const endTimeInput = document.getElementById("endtimeInput").value;

  if (!dayInput || !startTimeInput || !intervalsInput || !endTimeInput) {
    displayErrorMessage("Please fill in all fields correctly.");
    return;
  }

  const timeslotData = {
    day_date: dayInput,
    start_time: startTimeInput,
    end_time: endTimeInput,
    interval_count: parseInt(intervalsInput, 10),
    presentation_type:
      document.querySelector('input[name="presentationType"]:checked')?.value ||
      "Essay",
  };

  try {
    const response = await fetch("../../../backend/schedule_admin.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(timeslotData),
    });

    const data = await response.json();

    if (data.status === "success") {
      showToast("success-adding-day");

      const days = await fetchPresentationDays();
      const newDayIndex = days.findIndex((day) => day.day_date === dayInput);

      if (newDayIndex !== -1) {
        showDayData(days[newDayIndex].day_id);
        assignButtonActiveClass(newDayIndex);
      }
    } else {
      showToast("error-adding-day", "error");
    }
  } catch (error) {
    console.error("Error adding timeslot:", error);
    showToast("error-adding-day", "error");
  } finally {
    closeModal("add-timeslot-modal", "add-timeslot-modal-overlay");
    resetForm("add-timeslot-form");
  }
}

function displayErrorMessage(message) {
  const errorContainer = document.createElement("div");
  errorContainer.classList.add("toast", "error", "show");
  errorContainer.textContent = message;
  document.body.appendChild(errorContainer);
  setTimeout(() => errorContainer.remove(), 3000);
}
