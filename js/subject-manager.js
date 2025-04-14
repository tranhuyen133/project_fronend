document.addEventListener("DOMContentLoaded", () => {
  const sessionTableBody = document.getElementById("category-list");
  const pagination = document.getElementById("pagination");
  const addSessionForm = document.getElementById("subject-form-create");
  const sessionInput = document.getElementById("subject-name");
  const categoryInput = document.getElementById("subject-category");
  const timeInput = document.getElementById("subject-time");
  const modal = document.getElementById("subject-create-modal");
  const closeModalBtn = document.getElementById("close-create-modal");
  const filterSubject = document.getElementById("filter-subject");
  const searchInput = document.getElementById("search-input");
  const updateModal = document.getElementById("subject-update-modal");
  const closeUpdateModalBtn = document.getElementById("close-update-modal");
  const confirmModal = document.getElementById("confirm-modal");
  const confirmDeleteBtn = document.getElementById("confirm-delete");
  const confirmCancelBtn = document.getElementById("confirm-cancel");

  const SESSIONS_KEY = "sessionList";

  // Dữ liệu môn học
  const subjectMap = {
    1: "Lập trình C",
    2: "Lập trình Frontend với ReactJS",
    3: "Lập trình Backend với Spring boot",
  };

  // Dữ liệu ban đầu
  const initialSessions = [
    // Các bài học mẫu đã có sẵn
    {
      id: 1,
      lesson_name: "Session 01 - Tổng quan về HTML",
      time: 45,
      status: "complete",
      subject_id: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      lesson_name: "Session 02 - Thẻ Inline và Block",
      time: 60,
      status: "incomplete",
      subject_id: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: 3,
      lesson_name: "Session 03 - Form và Table",
      time: 40,
      status: "complete",
      subject_id: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: 4,
      lesson_name: "Session 04 - CSS cơ bản",
      time: 45,
      status: "incomplete",
      subject_id: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: 5,
      lesson_name: "Session 05 - CSS layout",
      time: 60,
      status: "incomplete",
      subject_id: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: 6,
      lesson_name: "Session 06 - CSS Flex box",
      time: 45,
      status: "incomplete",
      subject_id: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: 7,
      lesson_name: "Session 12 - Con trỏ trong C",
      time: 45,
      status: "complete",
      subject_id: 2,
      created_at: new Date().toISOString(),
    },
    {
      id: 8,
      lesson_name: "Session 15 - Đọc và ghi file",
      time: 60,
      status: "incomplete",
      subject_id: 2,
      created_at: new Date().toISOString(),
    },
  ];

  // Khởi tạo sessionList từ localStorage hoặc dữ liệu ban đầu
  let sessionList = [];
  try {
    const storedSessions = localStorage.getItem(SESSIONS_KEY);
    sessionList = storedSessions ? JSON.parse(storedSessions) : initialSessions;
  } catch (error) {
    console.error("Lỗi khi parse localStorage:", error);
    sessionList = initialSessions;
  }

  let currentPage = 1;
  const itemsPerPage = 5;
  let currentFilter = "all";
  let sessionToDelete = null;
  let currentSearchTerm = "";
  let currentSortField = "lesson_name";
  let currentSortOrder = "asc";

  // Lưu danh sách bài học vào localStorage
  function saveToStorage() {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessionList));
  }

  // Kiểm tra trùng tên bài học nhưng không trùng môn học
  function isNameDuplicate(name, category, excludeId = null) {
    return sessionList.some(
      (session) =>
        session.lesson_name.toLowerCase() === name.toLowerCase() &&
        session.subject_id === parseInt(category) &&  // Kiểm tra môn học giống nhau
        session.id !== excludeId  // Kiểm tra không phải là bài học hiện tại
    );
  }

  // Hiển thị danh sách bài học
  function renderSessions() {
    sessionTableBody.innerHTML = "";
    const filteredSessions = filterSessions(sessionList, currentFilter);
    const searchedSessions = searchSessions(filteredSessions, currentSearchTerm);
    const sortedSessions = sortSessions(searchedSessions);
    const totalPages = Math.ceil(sortedSessions.length / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    const currentItems = sortedSessions.slice(start, start + itemsPerPage);

    if (currentItems.length === 0) {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td colspan="5" style="text-align: center; padding: 20px;">
          Không có bài học nào để hiển thị
        </td>
      `;
      sessionTableBody.appendChild(row);
    } else {
      currentItems.forEach((item) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td><input type="checkbox" class="status-toggle" data-id="${item.id}" ${
            item.status === "complete" ? "checked" : ""
          }></td>
          <td>${item.lesson_name}</td>
          <td>${item.time} phút</td>
          <td><span class="status ${item.status}">${
            item.status === "complete" ? "Đã hoàn thành" : "Chưa hoàn thành"
          }</span></td>
          <td>
            <button class="action-btn delete" data-id="${item.id}"><img src="/assets/icons/thungrac.png" alt="delete"></button>
            <button class="action-btn edit" data-id="${item.id}"><img src="/assets/icons/sua.png" alt="edit"></button>
          </td>
        `;
        sessionTableBody.appendChild(row);
      });
    }

    renderPagination(totalPages);
  }

  // Lọc bài học theo môn học
  function filterSessions(sessions, subject) {
    if (subject === "all") {
      return sessions;
    }
    return sessions.filter((session) => session.subject_id === parseInt(subject));
  }

  // Tìm kiếm bài học theo tên
  function searchSessions(sessions, searchTerm) {
    if (!searchTerm) return sessions;
    return sessions.filter((session) =>
      session.lesson_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Sắp xếp bài học
  function sortSessions(sessions) {
    return [...sessions].sort((a, b) => {
      let fieldA = a[currentSortField];
      let fieldB = b[currentSortField];

      // Chuyển đổi kiểu dữ liệu cho thời gian nếu cần
      if (currentSortField === "time") {
        fieldA = parseInt(fieldA);
        fieldB = parseInt(fieldB);
      }

      if (currentSortOrder === "asc") {
        return fieldA < fieldB ? -1 : fieldA > fieldB ? 1 : 0;
      } else {
        return fieldA > fieldB ? -1 : fieldA < fieldB ? 1 : 0;
      }
    });
  }

  // Hiển thị phân trang
  function renderPagination(totalPages) {
    pagination.innerHTML = "";
    if (totalPages <= 1 && totalPages !== 0) {
      return;
    }
    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      if (i === currentPage) btn.classList.add("active");
      btn.onclick = () => {
        currentPage = i;
        renderSessions();
      };
      pagination.appendChild(btn);
    }
  }

  // Kiểm tra trường thông tin và hiển thị thông báo lỗi
  function validateForm(name, category, time, excludeId = null) {
    let isValid = true;

    document.querySelectorAll(".error").forEach((el) => el.classList.remove("error"));
    document.querySelectorAll(".error-message").forEach((el) => el.remove());

    if (!name) {
      isValid = false;
      sessionInput.classList.add("error");
      const errorMessage = document.createElement("div");
      errorMessage.classList.add("error-message");
      errorMessage.textContent = "Tên bài học không được để trống";
      sessionInput.parentNode.appendChild(errorMessage);
    } else if (isNameDuplicate(name, category, excludeId)) {
      isValid = false;
      sessionInput.classList.add("error");
      const errorMessage = document.createElement("div");
      errorMessage.classList.add("error-message");
      errorMessage.textContent = "Tên bài học đã tồn tại trong môn học này";
      sessionInput.parentNode.appendChild(errorMessage);
    }

    if (!category) {
      isValid = false;
      categoryInput.classList.add("error");
      const errorMessage = document.createElement("div");
      errorMessage.classList.add("error-message");
      errorMessage.textContent = "Môn học không được để trống";
      categoryInput.parentNode.appendChild(errorMessage);
    }

    if (!time || time <= 0) {
      isValid = false;
      timeInput.classList.add("error");
      const errorMessage = document.createElement("div");
      errorMessage.classList.add("error-message");
      errorMessage.textContent = "Thời gian học phải lớn hơn 0";
      timeInput.parentNode.appendChild(errorMessage);
    } else if (time > 999) {
      isValid = false;
      timeInput.classList.add("error");
      const errorMessage = document.createElement("div");
      errorMessage.classList.add("error-message");
      errorMessage.textContent = "Thời gian học không được vượt quá 999 phút";
      timeInput.parentNode.appendChild(errorMessage);
    }

    return isValid;
  }

  // Thêm mới bài học
  addSessionForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = sessionInput.value.trim();
    const category = categoryInput.value;
    const time = parseInt(timeInput.value);

    if (validateForm(name, category, time)) {
      const newSession = {
        id: Date.now(),
        subject_id: parseInt(category),
        lesson_name: name,
        time: time,
        status: "incomplete",
        created_at: new Date().toISOString(),
      };
      sessionList.push(newSession);
      saveToStorage();
      renderSessions();
      modal.style.display = "none";
      addSessionForm.reset();
      showToast("Thêm bài học thành công!");
    } else {
      showToast("Vui lòng điền đầy đủ thông tin bài học!");
    }
  });

  // Mở modal thêm môn học
  document.getElementById("open-modal").addEventListener("click", () => {
    modal.style.display = "flex";
  });

  closeModalBtn.addEventListener("click", () => {
    modal.style.display = "none";
    addSessionForm.reset();
    document.querySelectorAll(".error").forEach((el) => el.classList.remove("error"));
    document.querySelectorAll(".error-message").forEach((el) => el.remove());
  });

  // Xử lý chỉnh sửa và xóa bài học
  sessionTableBody.addEventListener("click", (e) => {
    const editBtn = e.target.closest(".action-btn.edit");
    if (editBtn) {
      const id = editBtn.getAttribute("data-id");
      const session = sessionList.find((session) => session.id === parseInt(id));

      // Điền dữ liệu vào modal cập nhật
      document.getElementById("subject-name-update").value = session.lesson_name;
      document.getElementById("subject-category").value = session.subject_id;
      document.getElementById("subject-time-update").value = session.time;

      updateModal.style.display = "flex";

      document.getElementById("subject-form-update").onsubmit = (e) => {
        e.preventDefault();

        const updatedName = document.getElementById("subject-name-update").value.trim();
        const updatedCategory = document.getElementById("subject-category").value;
        const updatedTime = parseInt(document.getElementById("subject-time-update").value);

        // Kiểm tra tính hợp lệ của dữ liệu
        if (validateForm(updatedName, updatedCategory, updatedTime, session.id)) {
          // Cập nhật bài học
          session.lesson_name = updatedName;
          session.subject_id = parseInt(updatedCategory);
          session.time = updatedTime;

          saveToStorage();
          renderSessions();
          updateModal.style.display = "none";
          showToast("Cập nhật bài học thành công!");
        } else {
          showToast("Vui lòng kiểm tra lại thông tin!");
        }
      };
    }

    const deleteBtn = e.target.closest(".action-btn.delete");
    if (deleteBtn) {
      sessionToDelete = parseInt(deleteBtn.getAttribute("data-id"));
      confirmModal.style.display = "flex";
    }

    // Cập nhật trạng thái khi click checkbox
    if (e.target.closest(".status-toggle")) {
      const id = e.target.closest(".status-toggle").getAttribute("data-id");
      const session = sessionList.find((item) => item.id === parseInt(id));

      session.status = session.status === "complete" ? "incomplete" : "complete";

      saveToStorage();
      renderSessions();
    }
  });

  // Xử lý xác nhận xóa
  confirmDeleteBtn.addEventListener("click", () => {
    if (sessionToDelete !== null) {
      sessionList = sessionList.filter((item) => item.id !== sessionToDelete);
      saveToStorage();
      renderSessions();
      confirmModal.style.display = "none";
      showToast("Xóa bài học thành công!");
      sessionToDelete = null;
    }
  });

  confirmCancelBtn.addEventListener("click", () => {
    confirmModal.style.display = "none";
    sessionToDelete = null;
  });

  closeUpdateModalBtn.addEventListener("click", () => {
    updateModal.style.display = "none";
  });

  // Xử lý tìm kiếm
  searchInput.addEventListener("input", (e) => {
    currentSearchTerm = e.target.value.trim();
    currentPage = 1;
    renderSessions();
  });

  // Xử lý sắp xếp
  document.querySelectorAll("th img").forEach((img) => {
    img.addEventListener("click", () => {
      const field = img.closest("th").textContent.trim();
      if (field === "Tên bài học") {
        currentSortField = "lesson_name";
      } else if (field === "Thời gian học") {
        currentSortField = "time";
      }

      // Chuyển đổi thứ tự sắp xếp
      if (img.src.includes("down.png")) {
        img.src = "/assets/icons/up.png";
        currentSortOrder = "asc";
      } else {
        img.src = "/assets/icons/down.png";
        currentSortOrder = "desc";
      }

      renderSessions();
    });
  });

  // Xử lý lọc môn học
  filterSubject.addEventListener("change", (e) => {
    currentFilter = e.target.value;
    currentPage = 1;
    renderSessions();
  });

  // Hiển thị thông báo Toast
  function showToast(message) {
    const toast = document.getElementById("toast");
    const toastMessage = document.getElementById("toast-message");
    toastMessage.textContent = message;
    toast.classList.remove("hidden");

    setTimeout(() => toast.classList.add("hidden"), 3000);
  }

  window.hideToast = () => {
    document.getElementById("toast").classList.add("hidden");
  };

  // Lưu dữ liệu ban đầu vào localStorage nếu chưa có
  saveToStorage();
  renderSessions();
});
