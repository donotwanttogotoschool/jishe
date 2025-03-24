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

    // 搜索API调用
    handleSearch: async (searchInput) => {
        try {
            const response = await fetch(`/api/search?query=${encodeURIComponent(searchInput)}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('搜索出错:', error);
            return [];
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
            const searchInput = document.getElementById('searchInput').value;
            
            if (!searchInput.trim()) {
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

// 修改搜索结果显示函数
function displaySearchResults(data) {
    const container = document.getElementById('searchResults');
    
    // 添加淡入效果的CSS类
    container.style.opacity = '0';
    container.style.transition = 'opacity 0.3s ease-in-out';

    // 清空之前的结果
    setTimeout(() => {
        container.innerHTML = '';

        if (!data || data.length === 0) {
            container.innerHTML = `
                <div class="search-message">
                    未找到相关结果，请尝试其他关键词
                </div>
            `;
        } else {
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
        
        // 淡入显示结果
        requestAnimationFrame(() => {
            container.style.opacity = '1';
        });
    }, 150); // 短暂延迟以确保过渡效果平滑
}

// 修改搜索处理函数
const handleSearch = debounce(async (event) => {
    if (event) {
        event.preventDefault();
    }
    
    const searchInput = document.querySelector('#searchInput').value.trim();
    
    if (!searchInput) {
        displaySearchResults([]);
        return;
    }

    try {
        const response = await fetch(`/api/search?query=${encodeURIComponent(searchInput)}`);
        if (!response.ok) {
            throw new Error('搜索请求失败');
        }
        const data = await response.json();
        displaySearchResults(data);
    } catch (error) {
        console.error('搜索出错:', error);
        displaySearchResults([]);
    }
}, 300); // 300ms 的防抖延迟

// 绑定搜索事件
document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.querySelector('#searchForm');
    const searchInput = document.querySelector('#searchInput');

    if (searchForm) {
        searchForm.addEventListener('submit', handleSearch);
    }

    if (searchInput) {
        // 添加输入事件监听
        searchInput.addEventListener('input', handleSearch);
    }
});

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
`;
document.head.appendChild(style); 