document.addEventListener('DOMContentLoaded', () => {
  const user = getCurrentUser(); if (!user) { location.href = 'login.html'; return; }
  document.getElementById('fb_fullname').value = user.full_name || '';
  document.getElementById('fb_phone').value = user.phone_number || '';
  document.getElementById('fb_email').value = user.email || '';
});
document.getElementById('feedbackForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const user = getCurrentUser();
  const payload = { register_id: user.id, full_name: document.getElementById('fb_fullname').value, phone_number: document.getElementById('fb_phone').value, email: document.getElementById('fb_email').value, description: document.getElementById('fb_description').value };
  const { error } = await supabaseClient.from('feedback').insert(payload);
  document.getElementById('feedbackMessage').textContent = error ? error.message : 'Feedback submitted successfully.';
  if (!error) e.target.reset();
});
