function toggleAccordion(element) {
  const item = element.parentElement;
  const isActive = item.classList.contains("active");

  document.querySelectorAll(".accordion-item").forEach((accordionItem) => {
    accordionItem.classList.remove("active");
  });

  if (!isActive) {
    item.classList.add("active");
  }
}
