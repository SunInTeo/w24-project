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
    `;

    const deleteIcon = document.createElement("button");
    deleteIcon.classList.add("delete-faq");
    deleteIcon.innerHTML = `<i class="fa-solid fa-trash"></i>`;
    deleteIcon.addEventListener("click", (e) => {
      e.stopPropagation();
      deleteFAQ(index);
    });

    header.appendChild(deleteIcon);

    const content = document.createElement("div");
    content.classList.add("accordion-content");
    content.innerHTML = `<p>${faq.content}</p>`;

    accordionItem.appendChild(header);
    accordionItem.appendChild(content);
    accordion.appendChild(accordionItem);
  });
}

function deleteFAQ(index) {
  if (confirm("Are you sure you want to delete this FAQ?")) {
    faqs.splice(index, 1);
    renderFAQs();
  }
}

function openAddFAQModal() {
  openModal("add-faq-modal", "add-faq-modal-overlay");
}

function addFAQ() {
  const questionInput = document.getElementById("faq-question").value.trim();
  const answerInput = document.getElementById("faq-answer").value.trim();

  if (questionInput && answerInput) {
    faqs.push({ title: questionInput, content: answerInput });
    closeModal("add-faq-modal", "add-faq-modal-overlay");
    renderFAQs();
  } else {
    alert("Please fill out both fields.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderFAQs();

  const addFAQButton = document.createElement("button");
  addFAQButton.setAttribute("data-i18n", "add-faq");
  addFAQButton.classList.add("add-faq-button");
  addFAQButton.classList.add("secondary");
  addFAQButton.classList.add("small");
  addFAQButton.addEventListener("click", openAddFAQModal);
  document.querySelector(".faq-header").appendChild(addFAQButton);
  applyTranslations();
});
