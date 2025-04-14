document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const lastName = document.getElementById("lastname");
  const firstName = document.getElementById("firstname");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const confirmPassword = document.getElementById("confirm-password");
  const toast = createToast();

  const fields = [
    { el: lastName, msg: "Họ và tên không được để trống" },
    { el: firstName, msg: "Tên không được để trống" },
    { el: email, msg: "Email không được để trống", validate: validateEmail, err: "Email phải đúng định dạng" },
    { el: password, msg: "Mật khẩu không được để trống", validate: val => val.length >= 8, err: "Mật khẩu tối thiểu 8 ký tự" },
    { el: confirmPassword, msg: "Mật khẩu xác nhận không được để trống", validate: val => val === password.value, err: "Mật khẩu không trùng khớp" }
  ];

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    let isValid = true;

    document.querySelectorAll(".error-message").forEach(el => el.remove());
    fields.forEach(f => f.el.classList.remove("invalid"));

    fields.forEach(f => {
      const val = f.el.value.trim();
      if (!val) {
        showError(f.el, f.msg);
        isValid = false;
      } else if (f.validate && !f.validate(val)) {
        showError(f.el, f.err || "Dữ liệu không hợp lệ");
        isValid = false;
      }
    });

    if (isValid) {
      const user = {
        firstName: firstName.value.trim(),
        lastName: lastName.value.trim(),
        email: email.value.trim(),
        password: password.value.trim()
      };

      const users = JSON.parse(localStorage.getItem("users")) || [];
      const emailExists = users.some(u => u.email === user.email);
      if (emailExists) {
        showError(email, "Email đã được sử dụng");
        return;
      }

      users.push(user);
      localStorage.setItem("users", JSON.stringify(users));

      showToast("Thành công", "Đăng ký thành công!");
      setTimeout(() => {
        window.location.href = "login.html";
      }, 1500);
    }
  });

  function showError(input, message) {
    input.classList.add("invalid");
    const error = document.createElement("div");
    error.className = "error-message";
    const parent = input.closest(".input-group") || input.parentElement;

    if (!parent.querySelector(".error-message")) {
      error.textContent = message;
      parent.appendChild(error);
    }
  }

  function validateEmail(email) {
    return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
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
        <span style="color: #4ade80;">✔</span>
        <div>
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
});
