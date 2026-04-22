document.addEventListener('DOMContentLoaded', initCatalog);

let allItems = [];
let filteredItems = [];
let displayedCount = 4;
const ITEMS_PER_PAGE = 4;
const favKey = 'myCatalogFavorites';

async function initCatalog() {
    const container = document.getElementById('catalogContainer');
    if (!container) return;

    await loadData();
    setupListeners();
}

async function loadData() {
    const loading = document.getElementById('loadingState');
    const error = document.getElementById('errorState');
    const container = document.getElementById('catalogContainer');

    try {
        const response = await fetch('./data/items.json');
        if (!response.ok) throw new Error('Network error');
        
        allItems = await response.json();
        filteredItems = [...allItems];
        
        loading.hidden = true;
        error.hidden = true;
        container.hidden = false;
        render();
    } catch (e) {
        loading.hidden = true;
        error.hidden = false;
    }
}

function render() {
    const container = document.getElementById('catalogContainer');
    const emptyState = document.getElementById('emptyState');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const favorites = JSON.parse(localStorage.getItem(favKey) || '[]');

    container.innerHTML = '';
    applyLogic();

    if (filteredItems.length === 0) {
        emptyState.hidden = false;
        loadMoreBtn.hidden = true;
        return;
    }
    emptyState.hidden = true;

    const toRender = filteredItems.slice(0, displayedCount);

    toRender.forEach(item => {
        const isFav = favorites.includes(item.id);
        const card = document.createElement('div');
        card.className = 'card catalog-card';
        card.innerHTML = `
            <img src="${item.image}" alt="" class="catalog-img">
            <div class="catalog-content">
                <div style="display:flex; justify-content: space-between; align-items: center;">
                    <span class="badge">${item.category}</span>
                    <button class="fav-btn" data-id="${item.id}">${isFav ? '❤️' : '🤍'}</button>
                </div>
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                <div class="catalog-footer">
                    <strong>${item.price} грн</strong>
                    <button class="btn btn-primary btn-sm details-trigger" data-id="${item.id}">Деталі</button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });

    loadMoreBtn.hidden = displayedCount >= filteredItems.length;
}

function applyLogic() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;
    const sort = document.getElementById('sortSelect').value;

    filteredItems = allItems.filter(item => {
        const matchSearch = item.title.toLowerCase().includes(search) || item.description.toLowerCase().includes(search);
        const matchCategory = category === 'all' || item.category === category;
        return matchSearch && matchCategory;
    });

    if (sort === 'price-asc') filteredItems.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') filteredItems.sort((a, b) => b.price - a.price);
    if (sort === 'title-asc') filteredItems.sort((a, b) => a.title.localeCompare(b.title));
}

function setupListeners() {
    document.getElementById('searchInput').addEventListener('input', () => { displayedCount = 4; render(); });
    document.getElementById('categoryFilter').addEventListener('change', () => { displayedCount = 4; render(); });
    document.getElementById('sortSelect').addEventListener('change', render);

    document.getElementById('loadMoreBtn').addEventListener('click', () => {
        displayedCount += ITEMS_PER_PAGE;
        render();
    });

    document.getElementById('catalogContainer').addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        
        if (e.target.classList.contains('fav-btn')) {
            let favorites = JSON.parse(localStorage.getItem(favKey) || '[]');
            if (favorites.includes(id)) {
                favorites = favorites.filter(favId => favId !== id);
            } else {
                favorites.push(id);
            }
            localStorage.setItem(favKey, JSON.stringify(favorites));
            render();
        }

        if (e.target.classList.contains('details-trigger')) {
            showDetails(id);
        }
    });

    document.getElementById('closeDetailsModal').onclick = () => {
        document.getElementById('detailsModal').hidden = true;
    };
}

function showDetails(id) {
    const item = allItems.find(i => i.id === id);
    if (!item) return;

    document.getElementById('modalTitle').textContent = item.title;
    document.getElementById('modalCategory').textContent = `Категорія: ${item.category}`;
    document.getElementById('modalDesc').textContent = item.description;
    document.getElementById('modalPrice').textContent = item.price;
    document.getElementById('detailsModal').hidden = false;
}