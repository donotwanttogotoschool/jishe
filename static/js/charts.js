const charts = {
    initAgricultureCharts: async () => {
        try {
            // 从Flask后端获取数据
            const response = await fetch('/api/statistics');
            const data = await response.json();

            // 农业发展概况图表
            Highcharts.chart('agricultureChart', {
                chart: {
                    type: 'column'
                },
                title: {
                    text: '各朝代农业发展情况'
                },
                xAxis: {
                    categories: data.dynasties.map(d => d.name)
                },
                yAxis: {
                    title: {
                        text: '成就数量'
                    }
                },
                series: [{
                    name: '农业成就',
                    data: data.dynasties.map(d => d.count)
                }]
            });

            // 重要成就分布图表
            Highcharts.chart('achievementsChart', {
                chart: {
                    type: 'pie'
                },
                title: {
                    text: '领域分布'
                },
                series: [{
                    name: '占比',
                    data: data.categories.map(c => [c.name, c.y])
                }]
            });
        } catch (error) {
            console.error('加载图表数据出错:', error);
        }
    }
}; 