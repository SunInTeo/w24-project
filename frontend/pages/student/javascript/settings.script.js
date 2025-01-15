const faqs = [
  {
    title: "What is your return policy?",
    content: "We offer a 30-day return policy for unused and unopened items.",
  },
  {
    title: "How can I track my order?",
    content:
      "You can track your order by logging into your account and checking the 'Order History' section.",
  },
  {
    title: "Do you offer international shipping?",
    content: "Yes, we ship internationally to over 50 countries.",
  },
  {
    title: "What is your return policy?",
    content: "We offer a 30-day return policy for unused and unopened items.",
  },
  {
    title: "How can I track my order?",
    content:
      "You can track your order by logging into your account and checking the 'Order History' section.",
  },
  {
    title: "Do you offer international shipping?",
    content: "Yes, we ship internationally to over 50 countries.",
  },
];

function renderFAQs() {
  const accordion = document.querySelector(".accordion");

  accordion.innerHTML = "";

  faqs.forEach((faq, index) => {
    const accordionItem = document.createElement("div");
    accordionItem.classList.add("accordion-item");

    const header = document.createElement("div");
    header.classList.add("accordion-header");
    header.setAttribute("onclick", "toggleAccordion(this)");
    header.innerHTML = `
        <h4>${faq.title}</h4>
        <span class="accordion-icon">+</span>
      `;

    const content = document.createElement("div");
    content.classList.add("accordion-content");
    content.innerHTML = `<p>${faq.content}</p>`;

    accordionItem.appendChild(header);
    accordionItem.appendChild(content);
    accordion.appendChild(accordionItem);
  });
}

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
