/* ============================================================
   Online Shopping Bill Generator — Application Logic
   ============================================================ */

// ---------- Product data (fixed unit prices, in Taka) ----------
const PRODUCTS = [
  { id: "laptop", name: "Laptop", price: 55000 },
  { id: "mouse", name: "Mouse", price: 800 },
  { id: "keyboard", name: "Keyboard", price: 1500 },
  { id: "headphones", name: "Headphones", price: 2500 },
  { id: "pendrive", name: "Pendrive", price: 600 }
];

// ---------- DOM references ----------
const productTableBody = document.getElementById("productTableBody");
const formError = document.getElementById("formError");
const generateBtn = document.getElementById("generateBtn");
const resetBtn = document.getElementById("resetBtn");
const billSection = document.getElementById("billSection");
const billTableBody = document.getElementById("billTableBody");
const sumTotal = document.getElementById("sumTotal");
const sumDiscount = document.getElementById("sumDiscount");
const sumTaxable = document.getElementById("sumTaxable");
const sumVat = document.getElementById("sumVat");
const sumFinal = document.getElementById("sumFinal");
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const themeLabel = document.getElementById("themeLabel");

// ---------- Currency formatting helper ----------
function formatTaka(amount) {
  return (
    "৳" +
    amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  );
}

// ---------- Build the product input table ----------
function renderProductRows() {
  productTableBody.innerHTML = "";

  PRODUCTS.forEach((product) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${product.name}</td>
      <td>${formatTaka(product.price)}</td>
      <td>
        <div class="qty-cell">
          <input
            type="number"
            class="qty-input"
            id="qty-${product.id}"
            data-product-id="${product.id}"
            min="0"
            max="10"
            step="1"
            value="0"
            required
          />
          <span class="field-error" id="err-${product.id}" hidden></span>
        </div>
      </td>
    `;

    productTableBody.appendChild(row);
  });

  // Attach live validation to each quantity field
  PRODUCTS.forEach((product) => {
    const input = document.getElementById(`qty-${product.id}`);
    input.addEventListener("input", () => validateField(product.id));
  });
}

// ---------- Validate a single quantity field ----------
// Returns true if the field currently holds a valid whole number 0-10.
function validateField(productId) {
  const input = document.getElementById(`qty-${productId}`);
  const errorEl = document.getElementById(`err-${productId}`);
  const rawValue = input.value.trim();

  let isValid = true;
  let message = "";

  if (rawValue === "") {
    isValid = false;
    message = "Quantity is required.";
  } else {
    const numericValue = Number(rawValue);
    const isWholeNumber = Number.isInteger(numericValue);

    if (!isWholeNumber) {
      isValid = false;
      message = "Whole numbers only.";
    } else if (numericValue < 0 || numericValue > 10) {
      isValid = false;
      message = "Must be between 0 and 10.";
    }
  }

  if (isValid) {
    input.classList.remove("invalid");
    errorEl.hidden = true;
    errorEl.textContent = "";
  } else {
    input.classList.add("invalid");
    errorEl.hidden = false;
    errorEl.textContent = message;
  }

  return isValid;
}

// ---------- Validate all fields; returns array of {product, quantity} or null ----------
function validateInputs() {
  let allValid = true;

  PRODUCTS.forEach((product) => {
    const fieldIsValid = validateField(product.id);
    if (!fieldIsValid) {
      allValid = false;
    }
  });

  if (!allValid) {
    showFormError("Please correct the highlighted quantity fields.");
    return null;
  }

  const quantities = PRODUCTS.map((product) => {
    const input = document.getElementById(`qty-${product.id}`);
    return { product, quantity: Number(input.value) };
  });

  const hasAtLeastOne = quantities.some((entry) => entry.quantity > 0);

  if (!hasAtLeastOne) {
    showFormError("Please enter quantity for at least one product.");
    return null;
  }

  clearFormError();
  return quantities;
}

function showFormError(message) {
  formError.textContent = message;
  formError.hidden = false;
}

function clearFormError() {
  formError.textContent = "";
  formError.hidden = true;
}

// ---------- Calculate bill totals from validated quantities ----------
function calculateBill(quantities) {
  const lineItems = quantities
    .filter((entry) => entry.quantity > 0)
    .map((entry) => ({
      name: entry.product.name,
      quantity: entry.quantity,
      unitPrice: entry.product.price,
      subtotal: entry.product.price * entry.quantity
    }));

  const totalAmount = lineItems.reduce((sum, item) => sum + item.subtotal, 0);
  const discount = totalAmount > 10000 ? totalAmount * 0.1 : 0;
  const taxableAmount = totalAmount - discount;
  const vat = taxableAmount * 0.15;
  const finalAmount = taxableAmount + vat;

  return { lineItems, totalAmount, discount, taxableAmount, vat, finalAmount };
}

// ---------- Render the generated bill onto the page ----------
function renderBill(billData) {
  billTableBody.innerHTML = "";

  billData.lineItems.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.quantity}</td>
      <td>${formatTaka(item.unitPrice)}</td>
      <td>${formatTaka(item.subtotal)}</td>
    `;
    billTableBody.appendChild(row);
  });

  sumTotal.textContent = formatTaka(billData.totalAmount);
  sumDiscount.textContent = formatTaka(billData.discount);
  sumTaxable.textContent = formatTaka(billData.taxableAmount);
  sumVat.textContent = formatTaka(billData.vat);
  sumFinal.textContent = formatTaka(billData.finalAmount);

  billSection.hidden = false;
}

// ---------- Reset the form and hide the bill ----------
function resetForm() {
  PRODUCTS.forEach((product) => {
    const input = document.getElementById(`qty-${product.id}`);
    const errorEl = document.getElementById(`err-${product.id}`);
    input.value = "0";
    input.classList.remove("invalid");
    errorEl.hidden = true;
    errorEl.textContent = "";
  });

  clearFormError();
  billSection.hidden = true;
  billTableBody.innerHTML = "";
}

// ---------- Theme toggle ----------
function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.getAttribute("data-theme") === "dark";
  const nextTheme = isDark ? "light" : "dark";

  html.setAttribute("data-theme", nextTheme);
  themeIcon.textContent = nextTheme === "dark" ? "☀" : "🌙";
  themeLabel.textContent = nextTheme === "dark" ? "Light" : "Dark";
}

// ---------- Event wiring ----------
generateBtn.addEventListener("click", () => {
  const quantities = validateInputs();
  if (!quantities) return;

  const billData = calculateBill(quantities);
  renderBill(billData);
});

resetBtn.addEventListener("click", resetForm);
themeToggle.addEventListener("click", toggleTheme);

// ---------- Initial render ----------
renderProductRows();