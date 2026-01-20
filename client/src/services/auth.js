export async function verifyToken() {
  try {
    const userdata = JSON.parse(localStorage.getItem('userdata')) || {};
    const token = userdata.token;
    if (!token) return { ok: false, message: 'No token found' };
    const res = await fetch('https://hotel-management-system-2spj.onrender.com/api/users/verify', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Invalid token' }));
      return { ok: false, status: res.status, message: err.message || 'Invalid token' };
    }
    const data = await res.json();
    return { ok: true, data };
  } catch (err) {
    return { ok: false, message: err.message };
  }
}
