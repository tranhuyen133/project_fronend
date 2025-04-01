// dashboard.js
const loginIcon = document.getElementById("login-icon");
const isLoggedIn = localStorage.getItem("adminLoggedIn") === "true";

if (!isLoggedIn) {
  loginIcon.addEventListener("click", (e) => {
    e.preventDefault();
    const confirmLogin = confirm("Bạn có tài khoản chưa? OK để đăng nhập, Cancel để đăng ký.");
    if (confirmLogin) {
      window.location.href = "login.html";
    } else {
      window.location.href = "register.html";
    }
  });
} else {
  const adminAvatar = document.createElement("img");
  adminAvatar.src = "../assets/images/admin-avatar.png";
  adminAvatar.className = "user-icon";
  loginIcon.innerHTML = "";
  loginIcon.appendChild(adminAvatar);
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "custom-toast";
  toast.innerHTML = `
    <div class="toast-content">
      <span class="status-icon">✅</span>
      <div>
        <strong>Thành công</strong><br>
        <span>${message}</span>
      </div>
      <button class="toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
    </div>
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// login.js
document.querySelector("form").addEventListener("submit", function(e) {
  e.preventDefault();
  localStorage.setItem("adminLoggedIn", "true");
  showToast("Đăng nhập thành công!");
  setTimeout(() => window.location.href = "dashboard.html", 1500);
});

// register.js
document.querySelector("form").addEventListener("submit", function(e) {
  e.preventDefault();
  localStorage.setItem("adminLoggedIn", "true");
  showToast("Đăng ký thành công!");
  setTimeout(() => window.location.href = "dashboard.html", 1500);
});