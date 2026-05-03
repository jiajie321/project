const facilityGrid = document.getElementById("facilityGrid");
const announcementList = document.getElementById("announcementList");
const modal = document.getElementById("loginModal");

function localImagePath(path) {
  if (!path) return "";
  return path.startsWith("uploads/") ? path : `uploads/${path}`;
}

async function loadFacilities() {
  const { data, error } = await supabaseClient
    .from("facility")
    .select("id, name, photo_url, status")
    .order("id", { ascending: true });

  if (error) {
    facilityGrid.innerHTML = `<p>Unable to load facilities. ${error.message}</p>`;
    return;
  }

  facilityGrid.innerHTML = data.map((facility) => {
    const isClosed = facility.status?.toLowerCase().trim() === "closed";
    return `
      <article class="facility-card">
        <h3>${facility.name}</h3>
        <img src="${localImagePath(facility.photo_url)}" alt="${facility.name}">
        <div class="status ${isClosed ? "closed" : ""}">
          ${isClosed ? "Under Maintenance" : "More Description"}
        </div>
      </article>
    `;
  }).join("");
}

async function loadAnnouncements() {
  const { data, error } = await supabaseClient
    .from("announcements")
    .select("id, title, message, date")
    .order("date", { ascending: false });

  if (error) {
    announcementList.innerHTML = `<p>Unable to load announcements. ${error.message}</p>`;
    return;
  }

  if (!data.length) {
    announcementList.innerHTML = `<p>No announcements yet.</p>`;
    return;
  }

  announcementList.innerHTML = data.map((item) => `
    <article class="announcement">
      <h3>${item.title}</h3>
      <p>${item.message}</p>
      <small>${new Date(item.date).toLocaleString()}</small>
    </article>
  `).join("");
}

document.querySelectorAll("[data-protected], #signupLink").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    modal.style.display = "grid";
  });
});

document.getElementById("closeModal").addEventListener("click", () => {
  modal.style.display = "none";
});

loadFacilities();
loadAnnouncements();
