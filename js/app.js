document.addEventListener('DOMContentLoaded', async () => {
  await loadFacilities();
  await loadHomeAnnouncements();
});
async function loadFacilities() {
  const list = document.getElementById('facilityList');
  if (!list) return;
  const { data, error } = await supabaseClient.from('facility').select('*').order('id');
  if (error) { list.innerHTML = `<p>Unable to load facilities. ${error.message}</p>`; return; }
  if (!data || data.length === 0) { list.innerHTML = '<p>No facilities available.</p>'; return; }
  list.innerHTML = data.map(f => {
    const closed = String(f.status || '').toLowerCase() === 'closed';
    return `<div class="facility-photo">
      <h3>${f.name}</h3>
      <img src="${f.photo_url || ''}" alt="${f.name}" onclick="${closed ? '' : `location.href='detail.html?id=${f.id}'`}">
      ${closed ? '<button style="background-color: grey; cursor: not-allowed;">Under Maintenance</button>' : `<button onclick="location.href='detail.html?id=${f.id}'">More Description</button>`}
    </div>`;
  }).join('');
}
async function loadHomeAnnouncements() {
  const box = document.getElementById('announcementList');
  if (!box) return;
  const { data, error } = await supabaseClient.from('announcements').select('*').order('date', { ascending: false }).limit(3);
  if (error) { box.innerHTML = `<p>Unable to load announcements. ${error.message}</p>`; return; }
  if (!data || data.length === 0) { box.innerHTML = '<p>No announcements available.</p>'; return; }
  box.innerHTML = data.map(a => `<div class="announcement"><h3>${a.title}</h3><p>${a.message}</p><small>${a.date ? new Date(a.date).toLocaleString() : ''}</small></div>`).join('');
}
