const faqMsg = document.querySelector(".faq-msg");
const faqContainer = document.querySelector(".faq-content");
function fetchFAQ() {
  fetch("/w24-project/backend/faq_admin.php", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        renderFAQList(data.data);
      } else {
        console.error("Error fetching questions:", data.message);
      }
    })
    .catch((error) => {
      console.error("Request failed:", error);
    });
}

function renderFAQList(faqs) {
  if (faqs.length > 0) {
    faqContainer.style.display = "block";
    const accordion = document.querySelector(".accordion");

    faqMsg.innerHTML = "";
    accordion.innerHTML = "";

    faqs.forEach((faq, index) => {
      const accordionItem = document.createElement("div");
      accordionItem.classList.add("accordion-item");

      const header = document.createElement("div");
      header.classList.add("accordion-header");
      header.onclick = function () {
        toggleAccordion(this);
      };
      header.innerHTML = `
          <h4>${faq.question}</h4>
          <span class="accordion-icon">+</span>
      `;

      const content = document.createElement("div");
      content.classList.add("accordion-content");
      content.innerHTML = `<p>${faq.answer || "No answer available yet."}</p>`;

      const deleteQuestionBtn = document.createElement("button");
      deleteQuestionBtn.textContent = "Delete Question";
      deleteQuestionBtn.onclick = function () {
        deleteQuestion(faq.question);
      };
      content.appendChild(deleteQuestionBtn);

      accordionItem.appendChild(header);
      accordionItem.appendChild(content);
      accordion.appendChild(accordionItem);
    });
  } else {
    faqMsg.innerHTML = '<p data-i18n="no-faqs"></p>';
    faqContainer.style.display = "none";
    applyTranslations();
  }
}

async function addQuestionAnswer() {
  const questionInput = document.getElementById("questionInput");
  const answerInput = document.getElementById("answerInput");

  const question = questionInput.value.trim();
  const answer = answerInput.value.trim();

  if (!question || !answer) {
    return;
  }

  const payload = {
    question: question,
    answer: answer,
  };

  try {
    const response = await fetch("../../../backend/faq_admin.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (data.status === "success") {
      questionInput.value = "";
      answerInput.value = "";
      fetchFAQ();
    } else {
      throw new Error(data.message || "Failed to add question and answer.");
    }
  } catch (error) {
    console.error("Request failed:", error);
  } finally {
    closeModal("add-faq-modal", "add-faq-modal-overlay");
  }
}

async function deleteQuestion(question) {
  if (!question) {
    return;
  }

  const payload = {
    question: question,
  };

  try {
    const response = await fetch("../../../backend/faq_admin.php", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (data.status === "success") {
      fetchFAQ();
    } else {
      throw new Error(data.message || "Failed to delete the question.");
    }
  } catch (error) {
    console.error("Request failed:", error);
  }
}

function openAddFAQModal() {
  openModal("add-faq-modal", "add-faq-modal-overlay");
}

document.addEventListener("DOMContentLoaded", () => {
  fetchFAQ();
  document.querySelector(".section-title").setAttribute("data-i18n", "faq");

  const addFAQButton = document.createElement("button");
  addFAQButton.setAttribute("data-i18n", "add-faq");
  addFAQButton.classList.add("add-faq-button");
  addFAQButton.classList.add("secondary");
  addFAQButton.classList.add("small");
  addFAQButton.addEventListener("click", openAddFAQModal);
  document.querySelector(".faq-header").appendChild(addFAQButton);
  applyTranslations();
});
