// Simple client-side auth logic with optional remote API integration
// Not secure on its own for production — this calls a remote API and stores a session token in localStorage.

const LS_USERS = "cf_users_v1";
// Remote API base (change if needed)
const API_BASE = "https://api-novelchem.ajos.my.id";

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(LS_USERS) || "[]");
  } catch (e) {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(LS_USERS, JSON.stringify(users));
}

function hashPassword(pwd) {
  // simple non-secure transformation for demo - DO NOT use in production
  return btoa(pwd.split("").reverse().join(""));
}

function showMessage(el, text, isError) {
  el.textContent = text;
  el.classList.toggle("text-red-500", !!isError);
  el.classList.toggle("text-green-600", !isError);
}

// Register logic
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("registerName").value.trim();
    const email = document
      .getElementById("registerEmail")
      .value.trim()
      .toLowerCase();
    const usernameEl = document.getElementById("registerUsername");
    const username = usernameEl ? usernameEl.value.trim() : email.split("@")[0];
    const password = document.getElementById("registerPassword").value;
    const confirm = document.getElementById("registerConfirm").value;
    const msg = document.getElementById("registerMessage");

    if (password !== confirm) {
      showMessage(msg, "Password dan konfirmasi tidak cocok", true);
      return;
    }
    // Call remote API register endpoint
    const payload = { name, email, username, password };
    fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => null);
        if (!res.ok) {
          const err =
            (data && (data.message || data.error)) ||
            `Register failed (${res.status})`;
          showMessage(msg, err, true);
          return;
        }
        showMessage(
          msg,
          "Pendaftaran berhasil. Mengalihkan ke login...",
          false
        );
        const isInPages = window.location.pathname.includes("/pages/");
        const base = isInPages ? "./" : "pages/";
        setTimeout(() => {
          window.location.href = base + "login.html";
        }, 1000);
      })
      .catch((err) => {
        // On network error, fall back to client-side store (demo)
        const users = getUsers();
        if (users.some((u) => u.email === email)) {
          showMessage(msg, "Email sudah terdaftar (lokal)", true);
          return;
        }
        users.push({
          name,
          email,
          username,
          password: hashPassword(password),
          created: Date.now(),
        });
        saveUsers(users);
        showMessage(
          msg,
          "Pendaftaran (lokal) berhasil. Mengalihkan ke login...",
          false
        );
        const isInPages = window.location.pathname.includes("/pages/");
        const base = isInPages ? "./" : "pages/";
        setTimeout(() => {
          window.location.href = base + "login.html";
        }, 1000);
      });
  });
}

// Login logic
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document
      .getElementById("loginEmail")
      .value.trim()
      .toLowerCase();
    const password = document.getElementById("loginPassword").value;
    const msg = document.getElementById("loginMessage");
    // Try remote login first
    const payload = { username: email, password };
    fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => null);
        if (!res.ok) {
          // show server error message if present
          const err =
            (data && (data.message || data.error)) ||
            `Login failed (${res.status})`;
          showMessage(msg, err, true);
          return;
        }
        // Expecting token and user data in response
        const token =
          data?.token || data?.access_token || data?.data?.token || null;
        const user = data?.user || data?.data?.user || { email };
        localStorage.setItem(
          "cf_session",
          JSON.stringify({
            email: user.email || email,
            name: user.name || user.username || "User",
            token: token || btoa(email + ":" + Date.now()),
          })
        );
        showMessage(msg, "Login berhasil. Mengalihkan...", false);
        const params = new URLSearchParams(window.location.search);
        const redirectParam = params.get("redirect");
        const target = redirectParam || "/pages/dashboard.html";
        setTimeout(() => (window.location.href = target), 800);
      })
      .catch(() => {
        // network error -> fallback to client-side demo auth
        const users = getUsers();
        const hp = hashPassword(password);
        const user = users.find((u) => u.email === email && u.password === hp);
        if (!user) {
          showMessage(msg, "Email atau password salah (offline)", true);
          return;
        }
        localStorage.setItem(
          "cf_session",
          JSON.stringify({
            email: user.email,
            name: user.name,
            token: btoa(user.email + ":" + Date.now()),
          })
        );
        showMessage(msg, "Login berhasil (lokal). Mengalihkan...", false);
        const params = new URLSearchParams(window.location.search);
        const redirectParam = params.get("redirect");
        const target = redirectParam || "/pages/dashboard.html";
        setTimeout(() => (window.location.href = target), 800);
      });
  });
}

// Small helper to show login state; update nav if available
(function updateAuthNav() {
  const sess = JSON.parse(localStorage.getItem("cf_session") || "null");
  const navAuth = document.querySelectorAll("[data-auth]");
  if (!navAuth || navAuth.length === 0) return;
  // determine base path for auth links (root vs pages/)
  const isInPages = window.location.pathname.includes("/pages/");
  const base = isInPages ? "./" : "pages/";
  navAuth.forEach((el) => {
    if (sess) {
      el.innerHTML = `Hi, ${sess.name} <button id="logoutBtn" class="ml-2 text-sm text-red-500">Logout</button>`;
      const btn = document.getElementById("logoutBtn");
      if (btn)
        btn.addEventListener("click", () => {
          localStorage.removeItem("cf_session");
          // Redirect to home page after logout so user leaves protected area
          window.location.href = "/";
        });
    } else {
      el.innerHTML = `<a href="${base}login.html" class="text-sm text-primary hover:underline">Masuk</a> <a href="${base}register.html" class="ml-3 text-sm text-primary hover:underline">Daftar</a>`;
    }
  });
})();

// Expose a helper to check auth when clicking "Start Exploring"
window.handleStartExplore = function () {
  const sess = JSON.parse(localStorage.getItem("cf_session") || "null");
  if (sess) {
    window.location.href = "/pages/mainMenu.html";
    return;
  }
  // Not logged in -> redirect to login and pass redirect param
  const loginUrl = "/pages/login.html?redirect=/pages/mainMenu.html";
  window.location.href = loginUrl;
};
