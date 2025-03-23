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
                    <div id="searchResults" class="mt-4"></div>
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

    // 其他页面加载函数...
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
            
            // 显示/隐藏子菜单
            const submenu = menuItem.querySelector('.nav-treeview');
            if (menuItem.classList.contains('menu-open')) {
                submenu.style.display = 'block';
            } else {
                submenu.style.display = 'none';
            }
        });
    });

    // 处理页面切换
    document.querySelectorAll('.nav-link[data-page]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.target.closest('.nav-link').dataset.page;
            
            // 移除所有活动状态
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            // 设置当前项为活动状态
            e.target.closest('.nav-link').classList.add('active');

            // 加载相应页面
            switch(page) {
                case 'search':
                    contentManager.loadSearch();
                    break;
                case 'agriculture-overview':
                    contentManager.loadAgricultureOverview();
                    break;
                case 'statistics':
                    contentManager.loadStatistics();
                    break;
                // ... 其他页面处理 ...
            }
        });
    });

    // 搜索表单提交处理
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchInput = document.getElementById('searchInput').value;
            
            // 检查搜索词是否为空
            if (!searchInput.trim()) {
                displaySearchResults([]);
                return;
            }

            // 使用 Go 后端的搜索 API
            fetch(`/api/search?query=${encodeURIComponent(searchInput)}`, {
                method: 'GET',  // Go 后端使用 GET 请求
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => response.json())
            .then(results => {
                console.log('搜索结果:', results); // 调试用
                displaySearchResults(results);
            })
            .catch(error => {
                console.error('搜索出错:', error);
                displaySearchResults([]);
            });
        });
    }
});

function displaySearchResults(data) {
    const container = document.getElementById('searchResults');
    container.innerHTML = '';

    if (!data || data.length === 0) {
        container.innerHTML = `
            <div class="search-message">
                未找到相关结果，请尝试其他关键词
            </div>
        `;
        return;
    }

    // 显示搜索结果
    data.forEach(person => {
        const card = document.createElement('div');
        card.className = 'scientist-card';
        
        // 构建成就列表 HTML
        const achievementsHtml = person.achievements && person.achievements.length > 0
            ? `<div class="achievements">${person.achievements.join('、')}</div>`
            : '';
        
        card.innerHTML = `
            <h3 class="scientist-name">${person.name || ''}</h3>
            <div class="description">${person.description || ''}</div>
            ${achievementsHtml}
            <div class="category-dynasty">
                ${person.category || ''} · ${person.dynasty || ''}
            </div>
        `;
        
        container.appendChild(card);
    });
}

// 搜索处理函数
function handleSearch(event) {
    event.preventDefault();
    const searchInput = document.querySelector('#searchInput').value;
    
    // 这里应该是调用后端API的地方
    // 示例：
    fetch(`/api/search?q=${encodeURIComponent(searchInput)}`)
        .then(response => response.json())
        .then(data => displaySearchResults(data))
        .catch(error => console.error('搜索出错:', error));
}

// 绑定搜索表单提交事件
document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.querySelector('#searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', handleSearch);
    }
}); 