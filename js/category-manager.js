document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("subject-modal");
  const openModalBtn = document.getElementById("open-modal");
  const closeModalBtn = document.getElementById("close-modal");
  const cancelBtn = document.getElementById("cancel-btn");
  const saveBtn = document.getElementById("save-btn");
  const form = document.getElementById("subject-form");
  const subjectNameInput = document.getElementById("subject-name");
  const modalTitle = document.getElementById("modal-title");
  const confirmModal = document.getElementById("confirm-modal");
  const confirmMessage = document.getElementById("confirm-message");
  const confirmCancelBtn = document.getElementById("confirm-cancel");
  const confirmDeleteBtn = document.getElementById("confirm-delete");
  const logoutIcon = document.getElementById("login-icon"); // Đảm bảo có element với id "login-icon"
  const logoutOverlay = document.createElement("div");
  
  let isEdit = false;
  let currentEditIndex = null;
  let subjectList = [];
  let currentPage = 1;
  const itemsPerPage = 5;
  let currentSearch = "";
  let currentFilter = "all";
  let currentSort = "asc";

  const initialSubjects = [
    { 
      id: 1, 
      name: "Lập trình C", 
      status: "active" 
    },
    { 
      id: 2, 
      name: "Lập trình Frontend với ReactJS", 
      status: "inactive" 
    },
    { 
      id: 3, 
      name: "Lập trình Backend với Spring boot", 
      status: "active" 
    },
    { 
      id: 4, 
      name: "Lập trình Frontend với VueJS", 
      status: "inactive" 
    },
    { 
      id: 5,
      name: "Cấu trúc dữ liệu và giải thuật", 
      status: "inactive" 
    },
    { 
      id: 6, 
      name: "Phân tích và thiết kế hệ thống", 
      status: "active" 
    },
    { 
      id: 7, 
      name: "Toán cao cấp", 
      status: "inactive" 
    },
    { 
      id: 8, 
      name: "Tiếng Anh chuyên ngành", 
      status: "active" 
    }
  ];

  function saveToStorage() {
    localStorage.setItem("subjectList", JSON.stringify(subjectList));
  }

  function loadFromStorage() {
    const data = localStorage.getItem("subjectList");
    subjectList = data ? JSON.parse(data) : initialSubjects;
    saveToStorage();
  }

  openModalBtn.addEventListener("click", () => {
    isEdit = false;
    modalTitle.textContent = "Thêm mới môn học";
    form.reset();
    removeError();
    saveBtn.textContent = "Thêm";
    modal.style.display = "flex";
  });

  const closeModal = () => modal.style.display = "none";
  closeModalBtn.addEventListener("click", closeModal);
  cancelBtn.addEventListener("click", closeModal);

  function removeError() {
    const error = form.querySelector(".error");
    if (error) error.remove();
    subjectNameInput.classList.remove("invalid");
  }

  function showError(message) {
    removeError();
    const errorEl = document.createElement("span");
    errorEl.className = "error";
    errorEl.textContent = message;
    subjectNameInput.classList.add("invalid");
    subjectNameInput.insertAdjacentElement("afterend", errorEl);
  }

  function showToast(title, message) {
    const toast = document.getElementById("toast");
    document.getElementById("toast-title").textContent = title;
    document.getElementById("toast-message").textContent = message;
    toast.classList.remove("hidden");
    setTimeout(() => toast.classList.add("hidden"), 3000);
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    removeError();
    const name = subjectNameInput.value.trim();
    const status = form.status.value;
    if (!name) {
      showError("Tên môn học không được để trống");
      return;
    }

    if (isEdit && currentEditIndex !== null) {
      subjectList[currentEditIndex] = { ...subjectList[currentEditIndex], name, status };
      showToast("Thành công", "Cập nhật môn học thành công!");
    } else {
      const id = Date.now();
      subjectList.push({ id, name, status });
      showToast("Thành công", "Thêm môn học thành công!");
    }

    saveToStorage();
    renderTable();
    closeModal();
  });

  function renderTable() {
    const filtered = subjectList
      .filter(s => s.name.toLowerCase().includes(currentSearch.toLowerCase()))
      .filter(s => currentFilter === "all" || s.status === currentFilter)
      .sort((a, b) => currentSort === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));

    const start = (currentPage - 1) * itemsPerPage;
    const pageItems = filtered.slice(start, start + itemsPerPage);

    const tbody = document.getElementById("category-list");
    tbody.innerHTML = "";

    pageItems.forEach((item, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.name}</td>
        <td><span class="status ${item.status}">${item.status === "active" ? " Đang hoạt động" : " Ngừng hoạt động"}</span></td>
        <td>
          <button class="action-btn delete" data-index="${subjectList.indexOf(item)}"><img src="/assets/icons/thungrac.png" alt="delete"></button>
          <button class="action-btn edit" data-index="${subjectList.indexOf(item)}"><img src="/assets/icons/sua.png" alt="edit"></button>
        </td>
      `;
      tbody.appendChild(row);
    });

    renderPagination(filtered.length);
  }

  function renderPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      btn.className = i === currentPage ? "active" : "";
      btn.addEventListener("click", () => {
        currentPage = i;
        renderTable();
      });
      pagination.appendChild(btn);
    }
  }

  document.getElementById("category-list").addEventListener("click", (e) => {
    const deleteBtn = e.target.closest(".action-btn.delete");
    const editBtn = e.target.closest(".action-btn.edit");

    if (deleteBtn) {
      const index = parseInt(deleteBtn.dataset.index);
      const subjectName = subjectList[index].name;
      confirmMessage.innerHTML = `Bạn có chắc chắn muốn xóa môn học <strong>${subjectName}</strong> không?`;
      confirmModal.classList.add("show");
      confirmDeleteBtn.onclick = () => {
        subjectList.splice(index, 1);
        saveToStorage();
        renderTable();
        confirmModal.classList.remove("show");
        showToast("Thành công", "Xóa môn học thành công!");
      };
    }

    if (editBtn) {
      const index = parseInt(editBtn.dataset.index);
      const subject = subjectList[index];
      isEdit = true;
      currentEditIndex = index;
      subjectNameInput.value = subject.name;
      form.status.value = subject.status;
      saveBtn.textContent = "Lưu";
      modalTitle.textContent = "Cập nhật môn học";
      modal.style.display = "flex";
    }
  });

  document.getElementById("search-input").addEventListener("input", (e) => {
    currentSearch = e.target.value;
    currentPage = 1;
    renderTable();
  });

  document.getElementById("filter-status").addEventListener("change", (e) => {
    currentFilter = e.target.value;
    currentPage = 1;
    renderTable();
  });

  document.querySelector("th:nth-child(1)").addEventListener("click", () => {
    currentSort = currentSort === "asc" ? "desc" : "asc";
    renderTable();
  });

  confirmCancelBtn.addEventListener("click", () => {
    confirmModal.classList.remove("show");
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
    if (e.target === confirmModal) confirmModal.classList.remove("show");
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal();
      confirmModal.classList.remove("show");
    }
  });

  // Handle logout icon click
  logoutIcon.addEventListener("click", () => {
    const overlay = document.createElement("div");
    overlay.className = "logout-overlay";
    overlay.innerHTML = `
      <div class="logout-modal-content">
        <h3>Xác nhận đăng xuất</h3>
        <p>Bạn có chắc muốn đăng xuất không?</p>
        <button id="confirm-logout">Đăng xuất</button>
        <button id="cancel-logout">Hủy</button>
      </div>
    `;
    document.body.appendChild(overlay);

    // Handle cancel and confirm buttons
    document.getElementById("cancel-logout").addEventListener("click", () => {
      overlay.remove();
    });

    document.getElementById("confirm-logout").addEventListener("click", () => {
      localStorage.removeItem("loggedInUser");
      window.location.href = "login.html"; // Redirect to login page
    });
  });

  loadFromStorage();
  renderTable();
});
