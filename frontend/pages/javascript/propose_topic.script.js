function sendProposeTopic(type) {
  const form = document.getElementById("propose-topic-form");

  const proposedTopic = form.querySelector("#proposedTopic").value.trim();
  const proposeTopicText = form.querySelector("#proposeTopicText").value.trim();

  if (!proposedTopic || !proposeTopicText) {
    displayErrorMessage("all-fields-required");
    return;
  }
  proposeTopic(proposedTopic, proposeTopicText, type);
}

async function proposeTopic(topicLabel, topicInfo, type) {
  try {
    const response = await fetch("/w24-project/backend/propose_topic.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        proposal_type: type,
        topic_label: topicLabel,
        topic_info: topicInfo,
        proposed_by_user_id: localStorage.getItem("faculty_number"),
        proposed_by_user_name: localStorage.getItem("name"),
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (data.success) {
      showToast("success-propose-topic");
    } else {
      showToast("error-propose-topic", "error");
    }
  } catch (error) {
    console.error("Error:", error);
    showToast("error-propose-topic", "error");
  } finally {
    resetForm("propose-topic-form");
    closeModal("propose-topic-modal", "propose-topic-modal-overlay");
  }
}

async function fetchAndDisplayProposedTopics(type) {
  try {
    const response = await fetch(
      `/w24-project/backend/get_proposed_topics.php?proposal_type=${type}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    const container = document.getElementById("proposed-topics-container");
    container.innerHTML = "";

    if (!data.success) {
      throw new Error("Error fetching topics: " + data.message);
    }

    if (data.topics.length === 0) {
      container.innerHTML = "<p data-i18n='no-proposed-topics'></p>";
      return;
    }

    const section = document.createElement("section");

    const accordionDiv = document.createElement("div");
    accordionDiv.classList.add("accordion");

    data.topics.forEach((topic, index) => {
      const accordionItem = document.createElement("div");
      accordionItem.classList.add("accordion-item");

      const accordionHeader = document.createElement("div");
      accordionHeader.classList.add("accordion-header");
      accordionHeader.onclick = function () {
        toggleAccordion(this);
      };

      const headerTitle = document.createElement("h4");
      headerTitle.textContent = topic.topic_label;

      const deleteButton = document.createElement("button");
      deleteButton.classList.add("delete-topic");
      deleteButton.innerHTML = `<i class="fa-solid fa-trash"></i>`;
      deleteButton.setAttribute("aria-label", "Delete topic");
      deleteButton.title = "Delete topic";

      deleteButton.addEventListener("click", (e) => {
        e.stopPropagation();
        deleteProposedTopic(topic.topic_id, accordionItem);
      });

      accordionHeader.appendChild(headerTitle);
      accordionHeader.appendChild(deleteButton);

      const accordionContent = document.createElement("div");
      accordionContent.classList.add("accordion-content");

      const contentHTML = `
        <p>${topic.topic_info}</p>
        <p><strong data-i18n="proposed-by-user"></strong> ${topic.proposed_by_user_name}, ${topic.proposed_by_user_id}</p>
      `;
      accordionContent.innerHTML = contentHTML;

      accordionItem.appendChild(accordionHeader);
      accordionItem.appendChild(accordionContent);
      accordionDiv.appendChild(accordionItem);
    });

    section.appendChild(accordionDiv);
    container.appendChild(section);
  } catch (error) {
    console.error("Error:", error);
  }
}

async function deleteProposedTopic(topicId, topicElement) {
  try {
    const response = await fetch(
      `/w24-project/backend/get_proposed_topics.php?topic_id=${topicId}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to delete topic. HTTP Status: ${response.status}`
      );
    }

    const result = await response.json();

    if (result.success) {
      topicElement.remove();
    } else {
      showToast("error-delete-topic-proposal", "error");
    }
  } catch (error) {
    console.error("Error deleting topic:", error);
    showToast("error-delete-topic-proposal", "error");
  }
}
