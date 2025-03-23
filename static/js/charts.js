const charts = {
    initAgricultureCharts: () => {
        // 农业发展概况图表
        Highcharts.chart('agricultureChart', {
            chart: {
                type: 'column'
            },
            title: {
                text: '各朝代农业发展情况'
            },
            xAxis: {
                categories: ['秦', '汉', '唐', '宋', '元', '明', '清']
            },
            yAxis: {
                title: {
                    text: '成就数量'
                }
            },
            series: [{
                name: '农业成就',
                data: [3, 7, 5, 9, 4, 8, 6]
            }]
        });

        // 重要成就分布图表
        Highcharts.chart('achievementsChart', {
            chart: {
                type: 'pie'
            },
            title: {
                text: '农业成就类型分布'
            },
            series: [{
                name: '占比',
                data: [
                    ['农具改良', 30],
                    ['灌溉技术', 25],
                    ['种植技术', 20],
                    ['农学著作', 15],
                    ['其他', 10]
                ]
            }]
        });
    }
}; 