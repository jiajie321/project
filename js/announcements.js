document.addEventListener('DOMContentLoaded', async () => {
  const box = document.getElementById('announcementPageList');
  const { data, error } = await supabaseClient.from('announcements').select('*').order('date', { ascending: false });
  if (error) { box.innerHTML = `<p>Unable to load announcements. ${error.message}</p>`; return; }
  if (!data || data.length === 0) { box.innerHTML = '<p>No announcements available.</p>'; return; }
  box.innerHTML = data.map(a => `<div class="announcement"><div class="announcement-title">${a.title}</div><div class="announcement-date">${a.date ? new Date(a.date).toLocaleString() : ''}</div><div class="announcement-message">${a.message || ''}</div></div>`).join('');
});
