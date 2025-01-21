const languages = {
  en: {
    "auth-title": "Authentication",
    "auth-forgotten-password": "Forgotten Password",
    "auth-enter-email":
      "Please enter your registered email to recover your password:",
    "auth-placeholder-email": "Enter your email",
    "auth-recover-password": "Recover Password",
    "auth-no-account":
      "Don't have an account? It takes a minute to create one...",
    "auth-signup": "Sign up",
    "auth-has-account": "Already have an account?",
    "auth-login": "Login",
    "auth-login-title": "Login",
    "auth-placeholder-username": "Enter your username",
    "auth-placeholder-password": "Enter your password",
    "auth-signup-title": "Sign Up",
    "auth-teacher": "I'm a teacher",
    "auth-student": "I'm a student",
    "auth-placeholder-fullname": "Enter your full name",
    "auth-placeholder-facultynumber": "Enter your faculty number",
    "auth-placeholder-reenter-password": "Re-enter your password",
    "home-title": "Home",
    "nav-brand": "Panda",
    "nav-welcome": "Welcome!",
    "nav-logout": "Logout",
    "card-paper": "Papers",
    "card-project-topics": "Project Topics",
    "card-timetable": "Timetable",
    "card-my-account": "My Account",
    "table-topic-number": "№ of topic",
    "table-topic-name": "Name of topic",
    "table-sample-resources": "Sample resources",
    "table-your-resources": "Your resources (links)",
    "table-presentation-content": "Presentation content",
    "table-sample-content": "Content of samples",
    "table-presentation-resume": "Resume of presentation",
    "table-keywords": "Key words",
    "table-non-formal": "(Non)formal comments ",
    "download-xlsx": "Download XLSX",
    "propose-topic": "Propose Topic",
    "propose-topic-text":
      "Here you can propose a topic taht seems interesting.",
    "propose-topic-modal":
      "Topic, for example: AI integration in applications,...",
    "propose-topic-textarea":
      "Here you can write your arguments on why do you think this topic is interesting as well as some resources you found usefull",
    "send-text": "Send",
    "save-text": "Save",
    "cancel-text": "Cancel",
    "table-topic-number": "№ of topic",
    "table-topic-name": "Name of topic",
    "table-description": "Description",
    "table-sample-distribution": "Sample Distribution",
    "table-participant-1": "Participant 1",
    "table-participant-2": "Participant 2",
    "table-participant-3": "Participant 3",
    "table-integration": "Integration with Project",
    "table-requirements": "Requirements",
    "table-comments": "Your Comments",
    "table-participants-fn": "FN of students",
    "table-participants-names": "Name of students",
    "register-team": "Register your team",
    "faculty-number-placeholder-team": "Student FN",
    "student-name-placeholder-team": "Student name",
    "error-students-exceeded": "Students in a team must be max 3",
    "error-students-not-enough": "The must be at least one student",
    "error-no-details-team-creation":
      "Please select a topic and add teammates.",
    "error-no-details-team-members": "All teammate fields are required!",
    "edit-team": "Edit your team",
    "participant1-placeholder":
      "Here you can write what participant 1 is responsible for in your team",
    "participant2-placeholder":
      "Here you can write what participant 2 is responsible for in your team",
    "participant3-placeholder":
      "Here you can write what participant 3 is responsible for in your team",
    "comments-placeholder":
      "Here you can add comments about the topic that you consider important",
    "teammates-section": "Team",
    "edit-fields-section": "Distribution",
    "add-teammate": "Add a teammate",
    hour: "Time",
    group: "Group",
    "add-me-to-timetable": "Add to schedule",
    "adding-student-to-timetable": "Adding student to schedule",
    oops: "Oops...",
    hey: "Hey!",
    "info-please-select-day":
      "To see the schedule details of a day, select one from the list on the left.",
    "info-no-data-available-for-day":
      "Be the first to add yourself to the schedule!",
    "info-no-data-available-for-day-admin":
      "Nobody has added a timeslot on this day.",
    "change-password": "Change password",
    "user-details": "User Details",
    faq: "FAQ (Frequently asked questions)",
    "old-password": "Old Password",
    "new-password": "New Password",
    "confirm-password": "Confirm Password",
    "save-changes": "Save Changes",
    "password-not-match": "Passwords do not match",
    "add-topic": "Add Topic",
    "add-topic-name": "Name of topic",
    "sample-resources-textarea": "Here you can add sample resources",
    "search-project": "Search Project",
    search: "Search",
    "delete-selected": "Delete Selected",
    "delete-timetable": "Delete timetable",
    date: "Date",
    "start-time": "Start time",
    "end-time": "End time",
    "number-of-intervals": "Number of intervals",
    "add-time-slot": "Add day slot",
    question: "Question",
    answer: "Answer",
    "add-faq": "Add FAQ",
    "no-data-available": "No data available",
    "error-title-required": "Essay title is required",
    "error-resources-required": "Essay resources are required",
    "delete-text": "Delete",
    "success-project-team-edit": "Successfully edited team!",
    "error-project-team-edit": "Failed to edit team!",
    "success-deleting-team": "Successfully deleted team!",
    "error-deleting-team": "Failed to delete team!",
    "error-fetching": "Failed to fetch data!",
    "error-assign-team": "Failed to create team!",
    "success-assign-team": "Successfully created team!",
    "essay-id-required": "Essay id is required",
    "success-editing-essay-student": "Successfully edited essay!",
    "error-editing-essay-student": "Failed to edit essay!",
    "success-deleting-essays-admin": "Successfully deleted selected eassays!",
    "error-deleting-essays-admin": "Failed to delete selected eassays!",
    "success-adding-essay-admin": "Successfully added a new essay!",
    "error-adding-essay-admin": "Failed to add a new essay!",
    "success-editing-essay-admin": "Successfully edited essay!",
    "error-editing-essay-admin": "Failed to edit essay!",
    "success-creating-project-admin": "Successfully created a new project!",
    "error-creating-project-admin": "Failed to create a new project!",
    "success-editing-project-admin": "Successfully edited project!",
    "error-editing-project-admin": "Failed to edit project!",
    "success-deleting-projects-admin":
      "Successfully deleted selected projects!",
    "error-deleting-projects-admin": "Failed to delete selected projects!",
    "error-fetching-teams-admin": "Failed to fetch teams for project!",
    "confirm-modal-header": "Warning",
    "confirm-modal-message": "Are you sure you want to execute this?",
    "comments-team": "Team comments:",
    "distribution-team": "Team distribution:",
    "member-1": "Member 1: ",
    "member-2": "Member 2: ",
    "member-3": "Member 3: ",
    "success-adding-day": "Successfully added a presentation day!",
    "success-deleting-day": "Successfully deleted a presentation day!",
    "error-adding-day": "Failed to add a presentation day!",
    "error-deleting-day": "Failed to delete a presentation day!",
    "error-fetching-day": "Failed to fetch a presentation day!",
    "error-adding-to-schedule": "Failed to add you to schedule!",
    "success-adding-to-schedule": "Successfully added you to schedule!",
    "add-essay-first": "You need to edit your essay details first!",
    "add-project-first": "You need to register for a project first!",
    "current-essay-id": " Current essay topic №",
    "current-project-id": " Current project topic №",
    "presentation-type": "Pick presentation type",
    essays: "Essays",
    projects: "Projects",
    "no-research-papers":
      "No research papers are available at the moment. Please add new topics to display them here.",
    "no-projects-papers":
      "No projects are available at the moment. Please add new topics to display them here.",
    "success-propose-topic": "Successfully proposed topic!",
    "error-propose-topic": "Failed to propose topic!",
    "all-fields-required": "All fields are required!",
    "proposed-topics": "See proposed topics",
    "proposed-by-user": "Proposed by",
    "proposed-topics": "Proposed Topics",
    "no-proposed-topics": "No proposed topics",
    "error-delete-topic-proposal": "Failed to delete the proposed topic!",
    "success-change-password": "Password changed successfully!",
    "error-change-password": "Failed to change the password!",
    "passwords-dont-match": "Password confirmation failed!",
    "error-register": "Registration failed!",
    "error-login": "Login failed!",
    "no-faqs": "No FAQs",
  },
  bg: {
    "auth-title": "Автентикация",
    "auth-forgotten-password": "Забравена парола",
    "auth-enter-email":
      "Моля, въведете вашия регистриран имейл, за да възстановите паролата си:",
    "auth-placeholder-email": "Въведете вашия имейл",
    "auth-recover-password": "Възстановете паролата",
    "auth-no-account": "Нямате акаунт? Отнема само минута...",
    "auth-signup": "Регистрация",
    "auth-has-account": "Вече имате акаунт?",
    "auth-login": "Вход",
    "auth-login-title": "Вход",
    "auth-placeholder-username": "Въведете потребителско име",
    "auth-placeholder-password": "Въведете парола",
    "auth-signup-title": "Регистрация",
    "auth-teacher": "Аз съм преподавател",
    "auth-student": "Аз съм студент",
    "auth-placeholder-fullname": "Въведете пълното си име",
    "auth-placeholder-facultynumber": "Въведете факултетния номер",
    "auth-placeholder-reenter-password": "Повторете паролата",
    "home-title": "Начало",
    "nav-brand": "Панда",
    "nav-welcome": "Добре дошли!",
    "nav-logout": "Изход",
    "card-paper": "Реферати",
    "card-project-topics": "Теми за проекти",
    "card-timetable": "График",
    "card-my-account": "Моят профил",
    "table-topic-number": "№ на тема",
    "table-topic-name": "Име на тема",
    "table-sample-resources": "Примерни ресурси",
    "table-your-resources": "Вашите ресурси (връзки)",
    "table-presentation-content": "Съдържание на презентация",
    "table-sample-content": "Съдържание на примерите",
    "table-presentation-resume": "Резюме на презентацията",
    "table-keywords": "Ключови думи",
    "table-non-formal": "(не)формални коментари",
    "download-xlsx": "Изтегляне на XLSX",
    "propose-topic": "Предложи тема",
    "propose-topic-text": "Тук можеш да предложиш интересна тема.",
    "propose-topic-modal":
      "Тема, например: Интеграция на ИИ в приложения и др...",
    "propose-topic-textarea":
      "Напиши обосновка защо темата е интересна и добави полезни ресурси.",
    "send-text": "Изпрати",
    "save-text": "Запази",
    "cancel-text": "Отмени",
    "table-description": "Описание",
    "table-sample-distribution": "Примерно разпределение",
    "table-participant-1": "Участник 1",
    "table-participant-2": "Участник 2",
    "table-participant-3": "Участник 3",
    "table-integration": "Интеграция с проект",
    "table-requirements": "Изисквания",
    "table-comments": "Ваши коментари",
    "table-participants-fn": "ФН на студенти",
    "table-participants-names": "Имена на студенти",
    "register-team": "Регистрирай своя отбор",
    "faculty-number-placeholder-team": "ФН на студент",
    "student-name-placeholder-team": "Име на студент",
    "error-students-exceeded": "Максимум 3 студенти в отбор",
    "error-students-not-enough": "Минимум 1 студент в отбор",
    "error-no-details-team-creation": "Изберете тема и добавете участници.",
    "error-no-details-team-members":
      "Всички полета за участници са задължителни!",
    "edit-team": "Редактирай отбора",
    "participant1-placeholder": "Отговорности на участник 1",
    "participant2-placeholder": "Отговорности на участник 2",
    "participant3-placeholder": "Отговорности на участник 3",
    "comments-placeholder": "Добавете коментари относно темата",
    "teammates-section": "Отбор",
    "edit-fields-section": "Разпределение",
    "add-teammate": "Добави съотборник",
    hour: "Час",
    group: "Група",
    "add-me-to-timetable": "Записване в графика",
    "adding-student-to-timetable": "Добавяне на студент в графика",
    oops: "Опа...",
    hey: "Ехо!",
    "info-please-select-day": "Изберете ден от списъка, за да видите графика.",
    "info-no-data-available-for-day":
      "Бъдете първи да се запишете за този ден!",
    "info-no-data-available-for-day-admin":
      "Никой не се е записал за този ден.",
    "change-password": "Смени парола",
    "user-details": "Моите данни",
    "old-password": "Стара парола",
    "new-password": "Нова парола",
    "confirm-password": "Потвърди паролата",
    "save-changes": "Запази промените",
    "password-not-match": "Паролите не съвпадат",
    "add-topic": "Добави тема",
    "add-topic-name": "Името на темата",
    "sample-resources-textarea": "Добавете примерни ресурси тук",
    "search-project": "Търсене на проект",
    search: "Търсене",
    "delete-selected": "Премахни избрани",
    "delete-timetable": "Изтрий този ден",
    date: "Дата",
    "start-time": "Начален час",
    "end-time": "Краен час",
    "number-of-intervals": "Брой слотове м/у часовете",
    "add-time-slot": "Добави ден за представяне",
    question: "Въпрос",
    answer: "Отговор",
    "add-faq": "Добави ЧЗВ",
    "no-data-available": "Няма налични данни.",
    "error-title-required": "Името на темата е задължително",
    "error-resources-required": "Ресурсите към темата са задължителни",
    "delete-text": "Изтрий",
    "confirm-modal-header": "Внимание",
    "confirm-modal-message": "Сигурни ли сте, че искате да продължите?",
    "comments-team": "Коментари на отбора:",
    "distribution-team": "Разпределение на отбора:",
    "member-1": "Участник 1: ",
    "member-2": "Участник 2: ",
    "member-3": "Участник 3: ",
    "success-project-team-edit": "Отборът беше успешно редактиран!",
    "error-project-team-edit": "Неуспешно редактиране на отбора!",
    "success-deleting-team": "Отборът беше успешно изтрит!",
    "error-deleting-team": "Неуспешно изтриване на отбора!",
    "error-fetching": "Неуспешно извличане на данни!",
    "error-assign-team": "Неуспешно създаване на отбор!",
    "success-assign-team": "Отборът беше успешно създаден!",
    "essay-id-required": "Номерът на есето е задължителен",
    "success-editing-essay-student": "Есето беше успешно редактирано!",
    "error-editing-essay-student": "Неуспешно редактиране на есето!",
    "success-deleting-essays-admin": "Избраните есета бяха успешно изтрити!",
    "error-deleting-essays-admin": "Неуспешно изтриване на есетата!",
    "success-adding-essay-admin": "Есето беше успешно добавено!",
    "error-adding-essay-admin": "Неуспешно добавяне на есето!",
    "success-editing-essay-admin": "Есето беше успешно редактирано!",
    "error-editing-essay-admin": "Неуспешно редактиране на есето!",
    "success-creating-project-admin": "Проектът беше успешно създаден!",
    "error-creating-project-admin": "Неуспешно създаване на проект!",
    "success-editing-project-admin": "Проектът беше успешно редактиран!",
    "error-editing-project-admin": "Неуспешно редактиране на проект!",
    "success-deleting-projects-admin":
      "Избраните проекти бяха успешно изтрити!",
    "error-deleting-projects-admin": "Неуспешно изтриване на проектите!",
    "error-fetching-teams-admin": "Неуспешно извличане на отборите за проекта!",
    "success-adding-day": "Денят за презентация беше успешно добавен!",
    "success-deleting-day": "Денят за презентация беше успешно изтрит!",
    "error-adding-day": "Неуспешно добавяне на ден за презентация!",
    "error-deleting-day": "Неуспешно изтриване на ден за презентация!",
    "error-fetching-day": "Неуспешно извличане на ден за презентация!",
    "error-adding-to-schedule": "Неуспешно добавяне в графика!",
    "success-adding-to-schedule": "Успешно добавяне в графика!",
    "add-essay-first": "Първо трябва да редактирате детайлите на есето си!",
    "add-project-first": "Първо трябва да се регистрирате за проект!",
    "current-essay-id": "Текущо есе тема №",
    "current-project-id": "Текущ проект тема №",
    "presentation-type": "Избери типа на презентации в този ден",
    essays: "Реферати",
    projects: "Проекти",
    "no-research-papers": "За момента няма теми за реферати.",
    "no-projects-papers": "За момента няма теми за проекти.",
    "success-propose-topic": "Успешно предложихте тема!",
    "error-propose-topic": "Неуспешно предлагане на тема!",
    "all-fields-required": "Всички полета са задължителни!",
    "proposed-topics": "Виж предложени теми",
    "proposed-by-user": "Предложено от ",
    "proposed-topics": "Предложени теми",
    "no-proposed-topics": "Няма предложени теми",
    "error-delete-topic-proposal": "Неуспешно изтриване на предложена тема!",
    "success-change-password": "Успешна промяна на паролата!",
    "error-change-password": "Неуспешна промяна на паролата!",
    "passwords-dont-match": "Неуспешно потвърждение на новата парола!",
    "error-register": "Неуспешна регистрация!",
    "error-login": "Неуспешен вход!",
    "no-faqs": "Няма ЧЗВ",
  },
};

let currentLanguage = localStorage.getItem("language") || "bg";

const langElement = document.querySelector(".language-toggle");
langElement.innerHTML = `
  <input type="checkbox" id="languageSwitch" />
      <label for="languageSwitch" class="toggle-label">
        <span class="lang-en">EN</span>
        <span class="lang-bg">БГ</span>
      </label>
`;

const languageSwitch = document.getElementById("languageSwitch");

function updateLanguage(lang) {
  currentLanguage = lang;
  const langData = languages[lang] || languages.en;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n");
    if (langData[key]) {
      element.textContent = langData[key];
    }
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    const key = element.getAttribute("data-i18n-placeholder");
    if (langData[key]) {
      element.placeholder = langData[key];
    }
  });
  localStorage.setItem("language", lang);
}

function applyTranslations() {
  const langData = languages[currentLanguage] || languages.bg;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n");
    if (langData[key]) {
      element.textContent = langData[key];
    }
  });
}

languageSwitch.addEventListener("change", (event) => {
  const selectedLanguage = event.target.checked ? "bg" : "en";
  updateLanguage(selectedLanguage);
});

languageSwitch.checked = currentLanguage === "bg";
updateLanguage(currentLanguage);

function forceApplyPlaceholders() {
  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    const placeholderKey = element.getAttribute("data-i18n-placeholder");
    const translation = getTranslation(placeholderKey);
    if (translation) {
      element.setAttribute("placeholder", translation);
    }
  });
}

function getTranslation(key) {
  return languages[currentLanguage][key] || key;
}
