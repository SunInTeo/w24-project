//--------------------------------------------FAQ----------------------------------

function fetchFAQ() {
  fetch('/w24-project/backend/faq_teacher.php', {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
      }
  })
  .then(response => response.json())
  .then(data => {
      if (data.status === 'success') {
          renderFAQList(data.data);
      } else {
          console.error('Error fetching questions:', data.message);
      }
  })
  .catch(error => {
      console.error('Request failed:', error);
  });
}

function renderFAQList(faqs) {
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

      const answerInput = document.createElement("textarea");
      answerInput.placeholder = "Enter your answer here...";
      content.appendChild(answerInput);

      const addAnswerBtn = document.createElement("button");
      addAnswerBtn.textContent = "Add Answer";
      addAnswerBtn.onclick = function() {
          addAnswer(faq.question, answerInput.value);
      };
      content.appendChild(addAnswerBtn);

      const deleteQuestionBtn = document.createElement("button");
      deleteQuestionBtn.textContent = "Delete Question";
      deleteQuestionBtn.onclick = function() {
          deleteQuestion(faq.question);
      };
      content.appendChild(deleteQuestionBtn);

      accordionItem.appendChild(header);
      accordionItem.appendChild(content);
      accordion.appendChild(accordionItem);
  });
}

function toggleAccordion(index) {
  const accordionItems = document.querySelectorAll(".accordion-item");
  const content = accordionItems[index].querySelector(".accordion-content");

  content.style.display = content.style.display === "block" ? "none" : "block";
}

function addQuestionAnswer() {
  const questionInput = document.getElementById("questionInput");
  const answerInput = document.getElementById("answerInput");

  const question = questionInput.value.trim();
  const answer = answerInput.value.trim();

  if (!question || !answer) {
      alert("Both question and answer are required.");
      return;
  }

  const payload = {
      question: question,
      answer: answer
  };

  fetch('/w24-project/backend/faq_teacher.php', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
  })
  .then(response => response.json())
  .then(data => {
      if (data.status === 'success') {
          alert(data.message);
          questionInput.value = '';
          answerInput.value = '';
          fetchFAQ();
      } else {
          console.error('Failed to add question and answer:', data.message);
      }
  })
  .catch(error => {
      console.error('Request failed:', error);
  });
}

function deleteQuestion(question) {
  const payload = {
      question: question
  };

  fetch('/w24-project/backend/faq_teacher.php', {
      method: 'DELETE',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
  })
  .then(response => response.json())
  .then(data => {
      if (data.status === 'success') {
          alert(data.message);
          fetchFAQ();
      } else {
          console.error('Failed to delete question:', data.message);
      }
  })
  .catch(error => {
      console.error('Request failed:', error);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  fetchFAQ();

  const addFAQButton = document.createElement("button");
  addFAQButton.setAttribute("data-i18n", "add-faq");
  addFAQButton.classList.add("add-faq-button");
  addFAQButton.classList.add("secondary");
  addFAQButton.classList.add("small");
  addFAQButton.addEventListener("click", openAddFAQModal);
  document.querySelector(".faq-header").appendChild(addFAQButton);
  applyTranslations();
});

//------------------------------------------------------CHANGE PASSWORD--------------------------------------------------------