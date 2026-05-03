let selectedFacility = null;
document.addEventListener('DOMContentLoaded', async () => {
  const user = getCurrentUser();
  if (!user) { showLoginModal(); return; }
  const id = new URLSearchParams(location.search).get('id');
  const box = document.getElementById('facilityDetail');
  const { data, error } = await supabaseClient.from('facility').select('*').eq('id', id).maybeSingle();
  if (error || !data) { box.innerHTML = '<p>Facility not found.</p>'; return; }
  selectedFacility = data;
  const price = user.type === 'resident' ? data.resident_price : data.nonresident_price;
  box.innerHTML = `<h1>${data.name}</h1><img src="${data.photo_url}" style="max-width:100%;border-radius:10px;"><p>${data.benefits || ''}</p><p>Status: <strong>${data.status}</strong></p><p>Price: RM ${Number(price || 0).toFixed(2)} / hour</p>`;
  if (String(data.status).toLowerCase() !== 'closed') document.getElementById('bookingForm').style.display = 'block';
  updateFeeText();
});
document.getElementById('booking_duration').addEventListener('input', updateFeeText);
function updateFeeText(){
  const user = getCurrentUser(); if (!selectedFacility || !user) return;
  const price = user.type === 'resident' ? selectedFacility.resident_price : selectedFacility.nonresident_price;
  const hours = Number(document.getElementById('booking_duration').value || 1);
  document.getElementById('feeText').textContent = `Estimated fees: RM ${(Number(price || 0) * hours).toFixed(2)}`;
}
document.getElementById('bookingForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const user = getCurrentUser();
  const hours = Number(document.getElementById('booking_duration').value || 1);
  const price = user.type === 'resident' ? selectedFacility.resident_price : selectedFacility.nonresident_price;
  const payload = { register_id: user.id, facility_id: selectedFacility.id, booking_date: document.getElementById('booking_date').value, booking_time: document.getElementById('booking_time').value, booking_duration: hours, fees: Number(price || 0) * hours, status: 'Booked', type: user.type };
  const { data, error } = await supabaseClient.from('booking').insert(payload).select().single();
  const msg = document.getElementById('bookingMessage');
  if (error) { msg.textContent = error.message; return; }
  location.href = `payment.html?booking_id=${data.id}`;
});
