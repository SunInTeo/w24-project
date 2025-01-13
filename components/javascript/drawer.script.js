let drawer_id = "";
let overlay_id = "";

function openDrawer(drawerID, drawerOverlayID) {
  drawer_id = drawerID;
  overlay_id = drawerOverlayID;
  document.getElementById(drawerID).classList.add("open");
  document.getElementById(drawerOverlayID).classList.add("show");
}

function closeDrawer(drawerID = drawer_id, drawerOverlayID = overlay_id) {
  document.getElementById(drawerID).classList.remove("open");
  document.getElementById(drawerOverlayID).classList.remove("show");
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && drawer.classList.contains("open")) {
    closeDrawer(drawer_id, overlay_id);
  }
});
