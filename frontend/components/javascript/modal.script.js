function openModal(modalID, modalOverlayID) {
  document.getElementById(modalID).style.display = "block";
  document.getElementById(modalOverlayID).style.display = "block";
}

function closeModal(modalID, modalOverlayID) {
  document.getElementById(modalID).style.display = "none";
  document.getElementById(modalOverlayID).style.display = "none";
}

function showErrorModal(message) {
  const modalBody = document.querySelector("#error-modal .modal-body");

  if (modalBody) {
    modalBody.textContent = message;
  } else {
    console.error("Error modal body not found.");
    return;
  }
  openModal("error-modal", "error-modal-overlay");
}
