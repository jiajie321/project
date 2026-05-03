document.addEventListener('DOMContentLoaded', async () => {
  const user = getCurrentUser(); if (!user) { location.href = 'login.html'; return; }
  const box = document.getElementById('bookingHistory');
  const { data, error } = await supabaseClient.from('booking').select('*, facility(name)').eq('register_id', user.id).order('booking_date', { ascending: false });
  if (error) { box.innerHTML = `<p>${error.message}</p>`; return; }
  if (!data || data.length === 0) { box.innerHTML = `<p>No booking records found for ${user.full_name}.</p>`; return; }
  box.innerHTML = `<table><thead><tr><th>Full Name</th><th>Facility</th><th>Date</th><th>Time</th><th>Duration</th><th>Status</th><th>Fees</th></tr></thead><tbody>${data.map(b => `<tr><td>${user.full_name}</td><td>${b.facility?.name || b.facility_id}</td><td>${b.booking_date}</td><td>${b.booking_time}</td><td>${b.booking_duration} hours</td><td>${b.status}</td><td>RM ${Number(b.fees).toFixed(2)}</td></tr>`).join('')}</tbody></table>`;
});
