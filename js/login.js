document.querySelector("form").addEventListener("submit", function(e) {
    e.preventDefault();
    localStorage.setItem("adminLoggedIn", "true");
    showToast("Đăng nhập thành công!");
    setTimeout(() => window.location.href = "dashboard.html", 1500);
  });
  