document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const toast = createToast();

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

    showToast("Thành công", "Đăng nhập thành công!");
    setTimeout(() => {
      window.location.href = "/pages/category-manager.html";
    }, 1500);
  });

  function showError(input, message) {
    input.classList.add("invalid");
    const existingError = input.parentElement.querySelector(".error-message");
    if (!existingError) {
      const error = document.createElement("div");
      error.className = "error-message";
      error.textContent = message;
      input.parentElement.appendChild(error);
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
