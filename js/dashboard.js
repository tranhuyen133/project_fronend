document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const rememberMe = document.getElementById("remember");
  const toast = createToast();

  // Tự động đăng nhập nếu đã chọn "Nhớ tài khoản"
  const rememberedUser = JSON.parse(localStorage.getItem("rememberedUser"));
  if (rememberedUser) {
    localStorage.setItem("loggedInUser", JSON.stringify(rememberedUser));
    window.location.href = "dashboard.html";
    return;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    clearErrors();
    let isValid = true;

    const emailVal = email.value.trim();
    const passVal = password.value.trim();

    if (!emailVal) {
      showError(email, "Email không được để trống");
      isValid = false;
    }
    if (!passVal) {
      showError(password, "Mật khẩu không được để trống");
      isValid = false;
    }

    if (!isValid) return;

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.email === emailVal && u.password === passVal);

    if (!user) {
      showError(password, "Email hoặc Mật khẩu không đúng");
      return;
    }

    localStorage.setItem("loggedInUser", JSON.stringify(user));
    if (rememberMe && rememberMe.checked) {
      localStorage.setItem("rememberedUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("rememberedUser");
    }

    showToast("Thành công", "Đăng nhập thành công!");
    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 1500);
  });

  function showError(input, message) {
    input.classList.add("invalid");
    const group = input.closest(".input-group") || input.parentElement;
    const existingError = group.querySelector(".error-message");
    if (!existingError) {
      const error = document.createElement("div");
      error.className = "error-message";
      error.textContent = message;
      group.appendChild(error);
    }
  }

  function clearErrors() {
    document.querySelectorAll(".error-message").forEach(e => e.remove());
    document.querySelectorAll("input").forEach(i => i.classList.remove("invalid"));
  }

  function createToast() {
    const toast = document.createElement("div");
    toast.id = "toast";
    toast.style.position = "fixed";
    toast.style.top = "20px";
    toast.style.right = "20px";
    toast.style.background = "#2d3e5e";
    toast.style.color = "white";
    toast.style.padding = "14px 20px";
    toast.style.borderRadius = "8px";
    toast.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
    toast.style.display = "none";
    toast.style.zIndex = "10000";
    toast.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <div>z
          <strong id="toast-title">Thành công</strong>
          <div id="toast-message">Xử lý thành công</div>
        </div>
        <button style="background: none; color: #ccc; border: none; font-size: 16px; margin-left: 8px; cursor: pointer" onclick="this.parentElement.parentElement.style.display='none'">✕</button>
      </div>
    `;
    document.body.appendChild(toast);
    return toast;
  }

  function showToast(title, message) {
    const toast = document.getElementById("toast") || createToast();
    toast.querySelector("#toast-title").textContent = title;
    toast.querySelector("#toast-message").textContent = message;
    toast.style.display = "block";
    setTimeout(() => toast.style.display = "none", 3000);
  }

  // Đăng xuất bằng modal xác nhận
  const loginIcon = document.getElementById("login-icon");
  if (localStorage.getItem("loggedInUser")) {
    loginIcon.addEventListener("click", function(e) {
      e.preventDefault();
      showLogoutConfirm();
    });
  }

  function showLogoutConfirm() {
    const overlay = document.createElement("div");
    overlay.className = "logout-overlay";
    overlay.innerHTML = `
      <div class="logout-modal">
        <div class="logout-icon">❗</div>
        <h3>Xác nhận</h3>
        <p>Bạn có chắc chắn muốn đăng xuất khỏi hệ thống không?</p>
        <div class="logout-actions">
          <button id="cancel-logout">Hủy</button>
          <button id="confirm-logout" class="danger">Đăng xuất</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    document.getElementById("cancel-logout").onclick = () => overlay.remove();
    document.getElementById("confirm-logout").onclick = () => {
      localStorage.removeItem("loggedInUser");
      localStorage.removeItem("rememberedUser");
      window.location.href = "login.html";
    };
  }

  // Chặn truy cập dashboard nếu chưa đăng nhập
  if (window.location.pathname.includes("dashboard") && !localStorage.getItem("loggedInUser")) {
    alert("Vui lòng đăng nhập để tiếp tục");
    window.location.href = "login.html";
  }

  // Hiển thị tên người dùng nếu đã đăng nhập
  const userData = JSON.parse(localStorage.getItem("loggedInUser"));
  const icon = document.querySelector("login-icon img");
  if (userData && icon) {
    icon.title = userData.firstName;
  }
});
