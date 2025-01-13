function openModal(modalID, modalOverlayID) {
  document.getElementById(modalID).style.display = "block";
  document.getElementById(modalOverlayID).style.display = "block";
}

function closeModal(modalID, modalOverlayID) {
  document.getElementById(modalID).style.display = "none";
  document.getElementById(modalOverlayID).style.display = "none";
}
