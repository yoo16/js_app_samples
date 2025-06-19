const order = {};
const categoryTabs = document.getElementById("category-tabs");
const menuArea = document.getElementById("menu-area");
const orderList = document.getElementById("order-list");
const totalDisplay = document.getElementById("total");

let allItems = [];
let currentCategory = "";

async function loadMenu() {
    try {
        const res = await fetch("api/products.json");
        allItems = await res.json();

        const categories = [...new Set(allItems.map(item => item.category))];

        // 最初のカテゴリを選択状態に
        currentCategory = categories[0];

        renderCategoryTabs(categories);
        renderMenu(currentCategory);
    } catch (err) {
        console.error("メニューの読み込み失敗", err);
    }
}

function renderCategoryTabs(categories) {
    categoryTabs.innerHTML = "";

    categories.forEach(category => {
        const btn = document.createElement("button");
        btn.textContent = category;
        btn.className = `px-4 py-1 rounded border 
      ${category === currentCategory ? "bg-sky-600 text-white" : "bg-white hover:bg-sky-100"}`;
        btn.onclick = () => {
            currentCategory = category;
            renderCategoryTabs(categories);
            renderMenu(category);
        };
        categoryTabs.appendChild(btn);
    });
}

function renderMenu(category) {
    menuArea.innerHTML = "";

    const items = allItems.filter(item => item.category === category);
    const grid = document.createElement("div");
    grid.className = "grid grid-cols-1 sm:grid-cols-2 gap-4";

    items.forEach(item => {
        const card = document.createElement("div");
        card.className = "bg-white rounded shadow p-4 flex flex-col items-center";
        card.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="w-32 rounded mb-2">
      <h3 class="text-lg font-semibold">${item.name}</h3>
      <p class="text-sm text-gray-600 mb-2">¥${item.price}</p>
      <button class="bg-sky-500 hover:bg-sky-600 text-white px-4 py-1 rounded"
        onclick="addToOrder(${item.id}, '${item.name}', ${item.price})">注文する</button>
    `;
        grid.appendChild(card);
    });

    menuArea.appendChild(grid);
}

function addToOrder(id, name, price) {
    if (!order[id]) {
        order[id] = { name, price, count: 0 };
    }
    order[id].count++;
    renderOrder();
}

function renderOrder() {
    orderList.innerHTML = "";
    let total = 0;

    for (const id in order) {
        const item = order[id];
        total += item.price * item.count;

        const li = document.createElement("li");
        li.textContent = `${item.name} × ${item.count}`;
        orderList.appendChild(li);
    }

    totalDisplay.textContent = `合計：¥${total}`;
}

loadMenu();
