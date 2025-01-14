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

document.addEventListener("DOMContentLoaded", renderFAQs);

