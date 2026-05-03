document.addEventListener('DOMContentLoaded', async () => {
  const user = getCurrentUser(); if (!user) { location.href = 'login.html'; return; }
  await loadBookings();
});
async function loadBookings(){
  const user = getCurrentUser();
  const box = document.getElementById('cancelList');
  const { data, error } = await supabaseClient.from('booking').select('*, facility(name)').eq('register_id', user.id).neq('status', 'Cancelled').order('booking_date', { ascending: false });
  if (error) { box.innerHTML = `<p>${error.message}</p>`; return; }
  if (!data || data.length === 0) { box.innerHTML = '<p>No active bookings to cancel.</p>'; return; }
  box.innerHTML = data.map(b => `<div class="booking-card"><h3>${b.facility?.name || b.facility_id}</h3><p>${b.booking_date} ${b.booking_time} • ${b.booking_duration} hours</p><p>RM ${Number(b.fees).toFixed(2)}</p><button onclick="cancelBooking(${b.id})">Cancel Booking</button></div>`).join('');
}
async function cancelBooking(id){
  if (!confirm('Are you sure you want to cancel this booking?')) return;
  const { error } = await supabaseClient.from('booking').update({ status: 'Cancelled' }).eq('id', id);
  if (error) alert(error.message); else loadBookings();
}
