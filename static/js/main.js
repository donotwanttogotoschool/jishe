// 页面内容管理
const contentManager = {
    // 加载搜索页面
    loadSearch: async () => {
        const content = `
            <div class="card">
                <div class="card-body">
                    <form id="searchForm">
                        <div class="input-group">
                            <input type="text" class="form-control" placeholder="请输入关键词...">
                            <button class="btn btn-primary" type="submit">
                                <i class="fas fa-search"></i> 搜索
                            </button>
                        </div>
                    </form>
                    <div class="search-results" id="searchResults">
                        <!-- 搜索结果将被动态插入 -->
                    </div>
                </div>
            </div>
        `;
        document.getElementById('contentArea').innerHTML = content;
        document.getElementById('pageTitle').textContent = '搜索查询';
    },

    // 加载农业概览页面
    loadAgricultureOverview: async () => {
        const content = `
            <div class="row">
                <div class="col-lg-6">
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">农业发展概况</h3>
                        </div>
                        <div class="card-body">
                            <div id="agricultureChart" style="height: 300px;"></div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6">
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">重要成就分布</h3>
                        </div>
                        <div class="card-body">
                            <div id="achievementsChart" style="height: 300px;"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.getElementById('contentArea').innerHTML = content;
        document.getElementById('pageTitle').textContent = '农业领域概览';
        
        // 初始化图表
        charts.initAgricultureCharts();
    },

    // 搜索API调用
    handleSearch: async (searchInput) => {
        try {
            const response = await fetch(`/api/search?query=${encodeURIComponent(searchInput)}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('搜索出错:', error);
            return { type: "none", data: [] };
        }
    },

    // 获取统计数据
    loadStatistics: async () => {
        try {
            const response = await fetch('/api/statistics');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('获取统计数据出错:', error);
            return null;
        }
    },

    // 加载页面内容
    loadPage: async (pageName) => {
        // 直接进行页面跳转
        window.location.href = `/${pageName}`;
    }
};

// 页面事件处理
document.addEventListener('DOMContentLoaded', function() {
    // 初始化侧边栏树形菜单
    document.querySelectorAll('.nav-sidebar .has-treeview').forEach(item => {
        item.querySelector('.nav-link').addEventListener('click', function(e) {
            e.preventDefault();
            
            // 切换菜单展开状态
            const menuItem = this.parentElement;
            menuItem.classList.toggle('menu-open');
            
            // 旋转箭头
            const arrow = this.querySelector('.fa-angle-left');
            if (menuItem.classList.contains('menu-open')) {
                arrow.style.transform = 'rotate(-90deg)';
            } else {
                arrow.style.transform = 'rotate(0)';
            }
        });
    });

    // 处理子菜单项的点击事件
    document.querySelectorAll('.nav-treeview .nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('href').replace('/', '');
            contentManager.loadPage(page);
        });
    });

    // 处理其他导航链接
    document.querySelectorAll('.nav-link[data-page]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.dataset.page;
            contentManager.loadPage(page);
        });
    });

    // 搜索表单提交处理
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const searchInput = document.getElementById('searchInput').value.trim();
            if (!searchInput) {
                displaySearchResults([]);
                return;
            }
            const results = await contentManager.handleSearch(searchInput);
            displaySearchResults(results);
        });
    }
});

// 添加防抖函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function displaySearchResults(data) {
    const container = document.getElementById('searchResults');
    container.innerHTML = '';
    if (data.type === "none" || data.data.length === 0) {
        container.innerHTML = '<p>未找到相关结果，请尝试其他关键词。</p>';
        return;
    }
    const iconMap = {
        '农业': '🌾',
        '化学': '🧪',
        '医学生物': '🌿',
        '天文地理': '🔭',
        '工程建筑': '🏗️',
        '数学计量': '📐',
        '物理': '⚙️'
    };
    if (data.type === "csv") {
        data.data.forEach(categoryResult => {
            const categoryDiv = document.createElement('div');
            const icon = iconMap[categoryResult.category] || '📚';
            categoryDiv.innerHTML = `<h3 data-icon="${icon}">${categoryResult.category}</h3>`;
            const table = document.createElement('table');
            table.className = 'table table-bordered';
            const thead = document.createElement('thead');
            const tbody = document.createElement('tbody');
            const columns = Object.keys(categoryResult.results[0]);
            const headerRow = document.createElement('tr');
            columns.forEach(col => {
                const th = document.createElement('th');
                th.textContent = col;
                headerRow.appendChild(th);
            });
            thead.appendChild(headerRow);
            categoryResult.results.forEach(row => {
                const tr = document.createElement('tr');
                columns.forEach(col => {
                    const td = document.createElement('td');
                    td.textContent = row[col];
                    tr.appendChild(td);
                });
                tbody.appendChild(tr);
            });
            table.appendChild(thead);
            table.appendChild(tbody);
            categoryDiv.appendChild(table);
            container.appendChild(categoryDiv);
        });
    }
}

// 添加相关的 CSS
const style = document.createElement('style');
style.textContent = `
    .scientist-card {
        opacity: 1;
        transition: opacity 0.3s ease-in-out;
        margin-bottom: 1rem;
        padding: 1rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        background-color: #fff;
    }

    .search-message {
        opacity: 1;
        transition: opacity 0.3s ease-in-out;
        padding: 1rem;
        text-align: center;
        color: #666;
    }

    #searchResults {
        transition: opacity 0.3s ease-in-out;
    }

    body {
        background-color: #f4f1ea;
        font-family: 'Microsoft YaHei', sans-serif;
        color: #333;
    }

    h3 {
        font-family: 'Microsoft YaHei', sans-serif;
        color: #5a4d41;
        margin-top: 20px;
    }

    .table {
        width: 100%;
        margin-bottom: 1rem;
        color: #212529;
        border-collapse: collapse;
    }

    .table th,
    .table td {
        padding: 0.75rem;
        vertical-align: top;
        border-top: 1px solid #dee2e6;
    }

    .table thead th {
        vertical-align: bottom;
        border-bottom: 2px solid #dee2e6;
        background-color: #eae0d5;
        color: #5a4d41;
    }

    .table tbody tr:nth-child(odd) {
        background-color: #f9f6f2;
    }

    .table tbody tr:hover {
        background-color: #e0d6c9;
    }

    .search-results {
        padding: 20px;
        background-color: #f4f1ea;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
`;
document.head.appendChild(style); 