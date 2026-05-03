document.addEventListener('DOMContentLoaded', async () => {
  const user = getCurrentUser(); if (!user) { location.href = 'login.html'; return; }
  const bookingId = new URLSearchParams(location.search).get('booking_id');
  const { data, error } = await supabaseClient.from('booking').select('*, facility(name)').eq('id', bookingId).eq('register_id', user.id).maybeSingle();
  const box = document.getElementById('paymentSummary');
  if (error || !data) { box.innerHTML = '<p>Booking not found.</p>'; return; }
  box.innerHTML = `<h2>${data.facility?.name || 'Facility Booking'}</h2><p>Date: ${data.booking_date}</p><p>Time: ${data.booking_time}</p><p>Duration: ${data.booking_duration} hours</p><p>Amount: RM ${Number(data.fees).toFixed(2)}</p>`;
  document.getElementById('paymentForm').style.display = 'block';
  document.getElementById('paymentForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const { error: payErr } = await supabaseClient.from('payment').insert({ booking_id: data.id, amount: data.fees, payment_method: document.getElementById('payment_method').value, type: user.type });
    document.getElementById('paymentMessage').textContent = payErr ? payErr.message : 'Payment saved successfully. You can view it in booking history.';
  });
});
