const productForm = document.getElementById("add-product-form");
const productInput = document.getElementById("product-input");
const productList = document.getElementById("product-list");
const searchInput = document.getElementById("search-input");
const pagination = document.getElementById("pagination");

const PRODUCTS_KEY = "productList";
let products = JSON.parse(localStorage.getItem(PRODUCTS_KEY)) || ["Laptop HP", "MacBook Pro", "Chuột không dây"];
let currentPage = 1;
const itemsPerPage = 5;

function saveToLocalStorage() {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

function renderProducts() {
  const searchTerm = searchInput.value.toLowerCase();
  const filtered = products.filter(p => p.toLowerCase().includes(searchTerm));
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const currentItems = filtered.slice(start, start + itemsPerPage);

  productList.innerHTML = "";
  currentItems.forEach((item, index) => {
    const actualIndex = products.indexOf(filtered[start + index]);
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${item}</span>
      <button onclick="deleteProduct(${actualIndex})">Xoá</button>
    `;
    productList.appendChild(li);
  });

  pagination.innerHTML = "";
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    if (i === currentPage) btn.classList.add("active");
    btn.onclick = () => {
      currentPage = i;
      renderProducts();
    };
    pagination.appendChild(btn);
  }
}

function deleteProduct(index) {
  products.splice(index, 1);
  saveToLocalStorage();
  renderProducts();
}

productForm.addEventListener("submit", function(e) {
  e.preventDefault();
  const name = productInput.value.trim();
  if (name) {
    products.push(name);
    productInput.value = "";
    saveToLocalStorage();
    renderProducts();
  }
});

searchInput.addEventListener("input", () => {
  currentPage = 1;
  renderProducts();
});

renderProducts();
