function showAuthTab(id) {
  ['loginBox','registerBox','resetBox'].forEach(x => document.getElementById(x).style.display = x === id ? 'block' : 'none');
}
document.getElementById('registerBox').addEventListener('submit', async (e) => {
  e.preventDefault();
  const type = document.getElementById('reg_type').value;
  const block = document.getElementById('reg_block').value.trim();
  const msg = document.getElementById('registerMessage');
  if (type === 'resident' && !block) { msg.textContent = 'Block is required for residents.'; return; }
  const user_name = document.getElementById('reg_username').value.trim();
  const { data: existing } = await supabaseClient.from('register').select('id').eq('user_name', user_name).maybeSingle();
  if (existing) { msg.textContent = 'Username already exists.'; return; }
  const payload = {
    user_name,
    password: document.getElementById('reg_password').value,
    full_name: document.getElementById('reg_fullname').value.trim(),
    phone_number: document.getElementById('reg_phone').value.trim(),
    email: document.getElementById('reg_email').value.trim(),
    block: block || null,
    type,
    is_verified: type === 'resident' ? 0 : 1,
    verify_status: type === 'resident' ? 'pending' : 'verified',
    verified_at: type === 'resident' ? null : new Date().toISOString()
  };
  const { error } = await supabaseClient.from('register').insert(payload);
  msg.textContent = error ? error.message : (type === 'resident' ? 'Registration submitted. Your resident account is pending admin verification.' : 'Registration successful. You can now login.');
  if (!error) e.target.reset();
});

document.getElementById('loginBox').addEventListener('submit', async (e) => {
  e.preventDefault();
  const msg = document.getElementById('loginMessage');
  const user_name = document.getElementById('login_username').value.trim();
  const password = document.getElementById('login_password').value;
  const { data: user, error } = await supabaseClient.from('register').select('*').eq('user_name', user_name).eq('password', password).maybeSingle();
  if (error || !user) { msg.textContent = 'Wrong username or password.'; return; }
  if (user.type === 'resident' && Number(user.is_verified) === 0) { msg.textContent = 'Your account is pending admin verification.'; return; }
  if (user.verify_status === 'rejected') { msg.textContent = 'Your registration was rejected. Please contact management.'; return; }
  setCurrentUser(user);
  location.href = 'index.html';
});

document.getElementById('resetBox').addEventListener('submit', async (e) => {
  e.preventDefault();
  const msg = document.getElementById('resetMessage');
  const user_name = document.getElementById('reset_username').value.trim();
  const password = document.getElementById('reset_password').value;
  const { data: user } = await supabaseClient.from('register').select('id').eq('user_name', user_name).maybeSingle();
  if (!user) { msg.textContent = 'Username is wrong.'; return; }
  const { error } = await supabaseClient.from('register').update({ password }).eq('id', user.id);
  msg.textContent = error ? error.message : 'Password reset successfully.';
});
