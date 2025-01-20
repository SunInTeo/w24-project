//----------------------------------------------FAQ-----------------------------------------------------
function fetchFAQs() {
  fetch('/w24-project/backend/faq_student.php', {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
      }
  })
  .then(response => response.json())
  .then(data => {
      if (data.status === 'success') {
          renderFAQs(data.data);
      } else {
          console.error('Error fetching questions:', data.message);
      }
    })
  .catch(error => {
      console.error('Request failed:', error);
  });
}

function renderFAQs(faqs) {
  const accordion = document.querySelector(".accordion");

  accordion.innerHTML = "";

  faqs.forEach((faq, index) => {
    const accordionItem = document.createElement("div");
    accordionItem.classList.add("accordion-item");

    const header = document.createElement("div");
    header.classList.add("accordion-header");
    header.setAttribute("onclick", `toggleAccordion(${index})`);
    header.innerHTML = `
        <h4>${faq.question}</h4>
        <span class="accordion-icon">+</span>
      `;

    const content = document.createElement("div");
    content.classList.add("accordion-content");
    content.innerHTML = `<p>${faq.answer || 'No answer available yet.'}</p>`;

    accordionItem.appendChild(header);
    accordionItem.appendChild(content);
    accordion.appendChild(accordionItem);
  });
}
document.addEventListener('DOMContentLoaded', fetchFAQ);

// -----------------------------------------CHANGE PASSWORD-----------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const changePasswordForm = document.getElementById("changePasswordForm");

  document.querySelector(".primary[data-i18n='save-changes']").addEventListener("click", async (event) => {
      event.preventDefault();

      const oldPassword = document.getElementById("oldPasswordInput").value;
      const newPassword = document.getElementById("passwordInput").value;
      const confirmPassword = document.getElementById("passwordInput").value;

      if (!oldPassword || !newPassword || !confirmPassword) {
          alert("All fields are required.");
          return;
      }

      if (newPassword !== confirmPassword) {
          alert("New password and confirm password do not match.");
          return;
      }

      if (newPassword.length < 8) {
          alert("Password must be at least 8 characters long.");
          return;
      }

      try {
          const response = await fetch("../../../backend/change_pass.php", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify({
                  oldPassword,
                  newPassword,
              }),
          });

          const result = await response.json();

          if (response.ok) {
              alert(result.message);
              closeModal("change-pass-modal", "change-pass-modal-overlay");
          } else {
              alert(result.message || "An error occurred.");
          }
      } catch (error) {
          console.error("Error:", error);
          alert("An unexpected error occurred.");
      }
  });
});
