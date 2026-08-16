# 🧾 Online Shopping Bill Generator

A lightweight, single-page web app that generates itemized shopping bills with automatic discount and VAT calculation — built with plain HTML, CSS, and JavaScript. No frameworks, no build tools, no dependencies.

**🔗 Live Demo:** _[add your GitHub Pages link here once it's live]_

---

## ✨ Features

- Real-time input validation (quantities, empty fields, out-of-range values)
- Automatic bill generation for purchased items only
- Tiered discount logic — 10% discount applied when total exceeds Tk. 10,000
- VAT calculation (15%) on the post-discount taxable amount
- Dark and light theme toggle, switches instantly with no page reload
- Fully responsive — bill tables scroll horizontally on smaller screens
- Works completely offline — just open `index.html` in any browser

---

## 🛠️ Tech Stack

`HTML5` · `CSS3` · `Vanilla JavaScript`

---

## 🚀 Getting Started

No installation or server required.

```bash
# Clone the repo
git clone https://github.com/Mojahidul21/online-shopping-bill-generator.git

# Open index.html in your browser
```

---

## 📋 How It Works

1. Enter a quantity (0–10) for any of the five products.
2. Click **Generate Bill** — at least one product must have a quantity greater than 0.
3. View the itemized invoice with total, discount, VAT, and final payable amount.
4. Click **Reset** to clear everything, or use the theme toggle in the header.

**Calculation logic:**

```
Subtotal              = Unit Price × Quantity
Total Amount           = Sum of all Subtotals
Discount               = 10% of Total Amount, if Total Amount > Tk. 10,000
Taxable Amount          = Total Amount − Discount
VAT                    = 15% of Taxable Amount
Final Payable Amount    = Taxable Amount + VAT
```

**Example:**

| Product | Qty |
|---|---|
| Laptop | 1 |
| Mouse | 2 |
| Keyboard | 1 |
| Pendrive | 3 |

→ Total: Tk. 59,900.00 → Discount: Tk. 5,990.00 → VAT: Tk. 8,086.50 → **Final: Tk. 61,996.50**

---

## 💰 Product Prices

| Product | Price |
|---|---|
| Laptop | Tk. 55,000 |
| Mouse | Tk. 800 |
| Keyboard | Tk. 1,500 |
| Headphones | Tk. 2,500 |
| Pendrive | Tk. 600 |

---

## 📁 Project Structure

```
├── index.html
├── css/
│   └── style.css
└── js/
    └── script.js
```

---

## 🎨 Customization

| To change... | Edit... |
|---|---|
| Products / prices | `js/script.js` → `PRODUCTS` array |
| Discount / VAT rules | `js/script.js` → `calculateBill()` |
| Colors / theme | `css/style.css` → `:root` / `[data-theme]` blocks |
| Page text / layout | `index.html` |
