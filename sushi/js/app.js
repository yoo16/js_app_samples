const order = {}; // 商品IDごとの注文数

const menuDiv = document.getElementById("menu");
const orderList = document.getElementById("order-list");
const totalDisplay = document.getElementById("total");

// ✅ メニュー描画（非同期）
async function renderMenu() {
    try {
        const res = await fetch("api/products.json");
        const menuItems = await res.json();

        menuItems.forEach(item => {
            const card = document.createElement("div");
            card.className = "bg-white rounded shadow p-4 flex flex-col items-center";
            card.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="w-32 object-cover rounded mb-2">
        <h3 class="text-lg font-semibold">${item.name}</h3>
        <p class="text-sm text-gray-600 mb-2">¥${item.price}</p>
        <button class="bg-sky-500 hover:bg-sky-600 text-white px-4 py-1 rounded"
          onclick="addToOrder(${item.id}, '${item.name}', ${item.price})">注文する</button>
      `;
            menuDiv.appendChild(card);
        });
    } catch (err) {
        console.error("メニューの取得に失敗しました", err);
    }
}

// ✅ 注文処理
function addToOrder(id, name, price) {
    if (!order[id]) {
        order[id] = { name, price, count: 0 };
    }
    order[id].count++;
    renderOrder();
}

// ✅ 注文リストの再描画
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

// 初期表示
renderMenu();
