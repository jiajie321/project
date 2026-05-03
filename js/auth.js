function getCurrentUser() {
  try { return JSON.parse(localStorage.getItem('currentUser')); } catch { return null; }
}
function setCurrentUser(user) { localStorage.setItem('currentUser', JSON.stringify(user)); }
function logout() { localStorage.removeItem('currentUser'); location.href = 'index.html'; }
function isLoggedIn() { return !!getCurrentUser(); }
function closeLoginModal() { const modal = document.getElementById('loginModal'); if (modal) modal.style.display = 'none'; }
function showLoginModal() { const modal = document.getElementById('loginModal'); if (modal) modal.style.display = 'block'; else location.href='login.html'; }
function requireLogin(e) { if (!isLoggedIn()) { e.preventDefault(); showLoginModal(); return false; } return true; }
function updateAuthArea() {
  const area = document.getElementById('authArea');
  if (!area) return;
  const user = getCurrentUser();
  if (user) {
    area.innerHTML = `<span style="color:white; margin-right:8px;">Welcome, ${user.full_name}</span><a href="reset_password.html" style="color:white; margin-right:8px;">Reset Password</a><a href="#" onclick="logout()" style="color:white;">Log Out</a>`;
  } else {
    area.innerHTML = `<a href="login.html" style="color:white;">Sign Up</a>`;
  }
}
document.addEventListener('DOMContentLoaded', () => {
  updateAuthArea();
  document.querySelectorAll('[data-protected]').forEach(a => a.addEventListener('click', requireLogin));
});
