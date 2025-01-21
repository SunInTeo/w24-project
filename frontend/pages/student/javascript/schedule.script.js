let days = [];
let selectedDay;
const daysContainer = document.getElementById("days");
const mainContainer = document.getElementsByClassName("main-container")[0];
const container = document.getElementsByClassName("container")[0];
const timetableContainer = document.getElementsByClassName(
  "timetable-card-container"
)[0];
const essayId = localStorage.getItem("essay_id");
const userId = localStorage.getItem("user_id");
const projectId = localStorage.getItem("project_id");

const noDataCard = `    
<div class="card">
    <div class="card-header"><span data-i18n="hey"></span></div>
        <div class="card-body">
          <span data-i18n="no-data-available"></span>
          </div>
    </div>`;

const selectDataCard = `    
<div class="card">
    <div class="card-header"><span data-i18n="hey"></span></div>
        <div class="card-body">
          <span data-i18n="info-please-select-day"></span>
          </div>
    </div>`;
document.addEventListener("DOMContentLoaded", async function () {
  fetchPresentationDays();
  fetchUserById(userId);
});

async function fetchPresentationDays() {
  try {
    const response = await fetch("/w24-project/backend/schedule_admin.php", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    daysContainer.innerHTML = "";

    if (data.status === "success" && data.data.length > 0) {
      mainContainer.style.display = "flex";
      timetableContainer.innerHTML = selectDataCard;
      days = data.data;

      days.forEach((day, index) => {
        const button = document.createElement("button");
        button.setAttribute("data-day-id", day.day_id);
        button.textContent = `${day.day_date} (${day.presentation_type})`;
        button.classList.add("day-button");
        button.onclick = () =>
          showDayData(day.day_id, index, day.day_date, day.presentation_type);
        daysContainer.appendChild(button);
      });
    } else {
      mainContainer.style.display = "none";
      container.innerHTML = noDataCard;

      days = [];
    }
  } catch (error) {
    console.error("Error fetching presentation days:", error);
    mainContainer.style.display = "none";
    container.innerHTML = noDataCard;
    days = [];
  }
  applyTranslations();
}

async function showDayData(dayId, dayIndex, date, presentationType) {
  assignButtonActiveClass(dayIndex);

  try {
    const response = await fetch(
      `/w24-project/backend/fetch_schedule_by_day.php?day_date=${date}&presentation_type=${presentationType}`
    );
    const data = await response.json();

    if (data.status !== "success") {
      throw new Error("Failed to fetch presentation day data.");
    }

    renderDayData(data.users, dayId);
  } catch (error) {
    console.error("Error fetching day data:", error);
    document.getElementById("timetable").innerHTML = `
      <div class="timetable-card-container">
        <div class="card">
          <div class="card-header"><span data-i18n="hey"></span></div>
          <div class="card-body">
            <span data-i18n="info-no-data-available-for-day"></span>
          </div>
        </div>
      </div>`;
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
        class="propose-button"
        data-i18n="add-me-to-timetable"
        onclick="openAddToTimetableModal('add-timeslot-modal','add-timeslot-modal-overlay', ${dayId})"
      ></button>
    </div>
  `;

  if (
    localStorage.getItem("essay_presentation_datetime") &&
    localStorage.getItem("essay_presentation_datetime") !== "null" &&
    localStorage.getItem("essay_presentation_datetime") !== "undefined" &&
    localStorage.getItem("user_id")
  ) {
    tableHTML += `
      <button
        class="delete-button small"
        onclick="removeFromSchedule(${localStorage.getItem(
          "user_id"
        )}, 'Essay')"
        data-i18n="remove-from-essays-schedule"
      ></button>
    `;
  }

  if (
    localStorage.getItem("project_presentation_datetime") &&
    localStorage.getItem("project_presentation_datetime") !== "null" &&
    localStorage.getItem("project_presentation_datetime") !== "undefined" &&
    localStorage.getItem("user_id")
  ) {
    tableHTML += `
      <button
        class="delete-button small"
        onclick="removeFromSchedule(${localStorage.getItem(
          "user_id"
        )}, 'Project')"
        data-i18n="remove-from-project-schedule"
      ></button>
    `;
  }

  if (!dayData || dayData.length === 0) {
    tableHTML += `
      <div class="timetable-card-container">
        <div class="card">
          <div class="card-header"><span data-i18n="hey"></span></div>
          <div class="card-body">
            <span data-i18n="info-no-data-available-for-day"></span>
          </div>
        </div>
      </div>`;
  } else {
    dayData.sort((a, b) => {
      return a.presentation_time.localeCompare(b.presentation_time);
    });

    const groupedData = {};
    dayData.forEach((entry) => {
      if (!groupedData[entry.presentation_time]) {
        groupedData[entry.presentation_time] = {
          presentation_id: entry.presentation_id,
          presentation_title: entry.presentation_title,
          faculty_numbers: [],
          names: [],
        };
      }
      groupedData[entry.presentation_time].faculty_numbers.push(
        entry.faculty_number
      );
      groupedData[entry.presentation_time].names.push(entry.name);
    });

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

    Object.keys(groupedData).forEach((time) => {
      const entry = groupedData[time];
      tableHTML += `
        <tr>
          <td>${time}</td>
          <td>${entry.faculty_numbers.join(", ")}</td>
          <td>${entry.names.join(", ")}</td>
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
function hasValidPresentation(presentationKey) {
  const value = localStorage.getItem(presentationKey);
  return value && value !== "null" && value !== "undefined";
}
window.addEventListener("storage", (event) => {
  if (
    event.key === "essay_presentation_datetime" ||
    event.key === "project_presentation_datetime"
  ) {
    renderRemoveScheduleButtons();
  }
});

function renderRemoveScheduleButtons() {
  let tableHTML = `
    <div class="flex-container page-actions" id="page-actions">
      <button
        class="propose-button"
        data-i18n="add-me-to-timetable"
        onclick="openAddToTimetableModal('add-timeslot-modal','add-timeslot-modal-overlay')"
      ></button>
  `;

  if (
    hasValidPresentation("essay_presentation_datetime") &&
    localStorage.getItem("user_id")
  ) {
    tableHTML += `
      <button
        class="delete-button small"
        onclick="removeFromSchedule(${localStorage.getItem(
          "user_id"
        )}, 'Essay')"
        data-i18n="remove-from-essays-schedule"
      ></button>
    `;
  }

  if (
    hasValidPresentation("project_presentation_datetime") &&
    localStorage.getItem("user_id")
  ) {
    tableHTML += `
      <button
        class="delete-button small"
        onclick="removeFromSchedule(${localStorage.getItem(
          "user_id"
        )}, 'Project')"
        data-i18n="remove-from-project-schedule"
      ></button>
    `;
  }

  tableHTML += `</div>`;
  document.getElementById("page-actions").innerHTML = tableHTML;

  applyTranslations();
}
async function fetchFreeTimeSlots(dayDate, presentationType) {
  try {
    const response = await fetch(
      `/w24-project/backend/fetch_free_time_slots.php?day_date=${encodeURIComponent(
        dayDate
      )}&presentation_type=${encodeURIComponent(presentationType)}`
    );

    const data = await response.json();

    if (data.status === "success") {
      populateTimetableDropdown(data.free_slots);
    } else {
      console.error("No available slots:", data.message);
    }
  } catch (error) {
    console.error("Error fetching free time slots:", error);
  }
}

function populateTimetableDropdown(freeSlots) {
  const dropdown = document.getElementById("timetable-dropdown");
  dropdown.innerHTML = "";

  if (!freeSlots.length) {
    const option = document.createElement("option");
    option.textContent = "No available slots";
    option.disabled = true;
    dropdown.appendChild(option);
    return;
  }

  freeSlots.forEach((slot) => {
    const option = document.createElement("option");
    option.textContent = slot;
    option.value = slot;
    dropdown.appendChild(option);
  });
}

function openAddToTimetableModal(modalID, modalOverlayID, dayId) {
  selectedDay = days.find((day) => day.day_id === dayId);
  if (!selectedDay) {
    console.error("Selected day not found.");
    return;
  }

  if (essayId === "null" && selectedDay.presentation_type === "Essay") {
    showToast("add-essay-first", "warning");
    return;
  }
  if (projectId === "null" && selectedDay.presentation_type === "Project") {
    showToast("add-project-first", "warning");
    return;
  }

  if (!document.getElementById("add-timeslot-modal")) {
    renderAddTimeslotModal(selectedDay.presentation_type);
  }
  fetchFreeTimeSlots(selectedDay.day_date, selectedDay.presentation_type);
  openModal(modalID, modalOverlayID);
}

function assignButtonActiveClass(dayIndex) {
  const buttons = document.querySelectorAll(".day-button");

  buttons.forEach((btn, idx) => {
    if (idx === dayIndex) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
}

function renderAddTimeslotModal(presentationType) {
  const facultyNumber = localStorage.getItem("faculty_number");
  const studentName = localStorage.getItem("name");

  const presentationInfo =
    presentationType === "Essay"
      ? `<p><strong><span data-i18n="current-essay-id"></span>${essayId}</strong></p>`
      : `<p><strong><span data-i18n="current-project-id"></span>${projectId}</strong></p>`;

  let modal = document.getElementById("add-timeslot-modal");

  if (!modal) {
    const modalHTML = `
      <div class="modal-overlay" id="add-timeslot-modal-overlay"></div>
      <div class="modal" id="add-timeslot-modal">
        <div class="modal-header">
          <span data-i18n="adding-student-to-timetable">Adding student to timetable</span>
          <button class="modal-close-button" onclick="closeModal('add-timeslot-modal','add-timeslot-modal-overlay');clearModal()">&times;</button>
        </div>
        <div class="modal-body">
          <form id="add-timeslot-form">
            <div id="presentation-info">${presentationInfo}</div>
            <div class="select-container">
              <select id="timetable-dropdown"></select>
            </div>
            <div class="input-row">
              <div class="input-container small-width">
                <input type="text" id="facultyNumberInput" value="${facultyNumber}" readonly data-i18n-placeholder="faculty-number-placeholder-team"/>
              </div>
              <div class="input-container">
                <input type="text" id="studentNameInput" value="${studentName}" readonly data-i18n-placeholder="student-name-placeholder-team"/>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="primary" onclick="submitTimeslotForm()" data-i18n="save-text"></button>
          <button class="secondary" onclick="closeModal('add-timeslot-modal','add-timeslot-modal-overlay');resetForm('add-timeslot-form')" data-i18n="cancel-text"></button>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML("beforeend", modalHTML);
  } else {
    document.getElementById("presentation-info").innerHTML = presentationInfo;
    document.getElementById("facultyNumberInput").value = facultyNumber;
    document.getElementById("studentNameInput").value = studentName;
  }

  applyTranslations();
  openModal("add-timeslot-modal", "add-timeslot-modal-overlay");
}

function clearModal() {
  const modal = document.getElementById("add-timeslot-modal");
  const overlay = document.getElementById("add-timeslot-modal-overlay");

  if (modal) modal.remove();
  if (overlay) overlay.remove();
}

async function submitTimeslotForm() {
  const facultyNumber = document.getElementById("facultyNumberInput").value;
  const studentName = document.getElementById("studentNameInput").value;
  const selectedSlot = document.getElementById("timetable-dropdown").value;
  const presentationType = selectedDay.presentation_type;

  if (!facultyNumber || !studentName || !selectedSlot) {
    showToast("error-adding-to-schedule", "error");
    return;
  }

  const presentationDatetime = `${selectedDay.day_date} ${selectedSlot}:00`;

  const timeslotData = {
    user_id: localStorage.getItem("user_id"),
    faculty_number: facultyNumber,
    student_name: studentName,
    presentation_datetime: presentationDatetime,
    presentation_type: presentationType,
  };

  try {
    const response = await fetch("/w24-project/backend/schedule_student.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(timeslotData),
    });

    const data = await response.json();

    if (data.status === "success") {
      if (presentationType === "Essay") {
        localStorage.setItem(
          "essay_presentation_datetime",
          presentationDatetime
        );
      } else if (presentationType === "Project") {
        localStorage.setItem(
          "project_presentation_datetime",
          presentationDatetime
        );
      }

      showToast("success-adding-to-schedule");
      closeModal("add-timeslot-modal", "add-timeslot-modal-overlay");
      resetForm("add-timeslot-form");

      await showDayData(
        selectedDay.day_id,
        null,
        selectedDay.day_date,
        presentationType
      );
    } else {
      showToast("error-adding-to-schedule", "error");
    }
  } catch (error) {
    console.error("Error submitting timeslot:", error);
    showToast("error-adding-to-schedule", "error");
  }
}

async function removeFromSchedule(userId, presentationType) {
  try {
    const response = await fetch("/w24-project/backend/schedule_student.php", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        presentation_type: presentationType,
      }),
    });

    const result = await response.json();
    if (response.ok) {
      showToast("success-remove-from-schedule");
      if (presentationType === "Essay") {
        localStorage.setItem("essay_presentation_datetime", "null");
      } else if (presentationType === "Project") {
        localStorage.setItem("project_presentation_datetime", "null");
      }
      window.location.reload();
    } else {
      console.error("Error:", result.message);
      showToast("error-remove-from-schedule", "error");
    }
  } catch (error) {
    console.error("Request failed:", error);
  }
}
