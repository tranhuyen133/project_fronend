const form = document.getElementById("add-form");
const input = document.getElementById("subject-input");
const list = document.getElementById("category-list");

const subjects = ["Lập trình C", "JavaScript cơ bản", "React JS"];

function renderList() {
  list.innerHTML = "";
  subjects.forEach((sub, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${sub}</span>
      <button onclick="deleteSubject(${index})">Xoá</button>
    `;
    list.appendChild(li);
  });
}

function deleteSubject(index) {
  subjects.splice(index, 1);
  renderList();
}

form.addEventListener("submit", function(e) {
  e.preventDefault();
  if (input.value.trim()) {
    subjects.push(input.value.trim());
    input.value = "";
    renderList();
  }
});

renderList();
