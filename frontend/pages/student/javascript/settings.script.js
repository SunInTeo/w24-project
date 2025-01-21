//----------------------------------------------FAQ-----------------------------------------------------
const faqMsg = document.querySelector(".faq-msg");
const faqContainer = document.querySelector(".faq-content");

function fetchFAQ() {
  fetch("/w24-project/backend/faq_student.php", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        renderFAQs(data.data);
        applyTranslations();
      } else {
        console.error("Error fetching questions:", data.message);
      }
    })
    .catch((error) => {
      console.error("Request failed:", error);
    });
}
function renderFAQs(faqs) {
  const faqHeader = document.querySelector(".faq-header");
  const accordion = document.querySelector(".accordion");

  if (faqs.length > 0) {
    accordion.innerHTML = "";
    faqMsg.innerHTML = "";
    faqContainer.style.display = "block";
    faqHeader.style.display = "block";

    faqs.forEach((faq) => {
      const accordionItem = document.createElement("div");
      accordionItem.classList.add("accordion-item");

      const header = document.createElement("div");
      header.classList.add("accordion-header");
      header.onclick = function () {
        toggleAccordion(this);
      };
      header.innerHTML = `
        <h4 data-i18n="faq-question">${faq.question}</h4>
        <span class="accordion-icon">+</span>
      `;

      const content = document.createElement("div");
      content.classList.add("accordion-content");
      content.innerHTML = `<p>${faq.answer || "No answer available yet."}</p>`;

      accordionItem.appendChild(header);
      accordionItem.appendChild(content);
      accordion.appendChild(accordionItem);
    });

    // Reapply translations after DOM updates
    applyTranslations();
  } else {
    faqMsg.innerHTML = '<p data-i18n="no-faqs"></p>';
    faqContainer.style.display = "none";
    faqHeader.style.display = "none";
    applyTranslations();
  }
}

document.addEventListener("DOMContentLoaded", fetchFAQ);
document.addEventListener("DOMContentLoaded", applyTranslations());
