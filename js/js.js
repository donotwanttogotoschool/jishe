 $(window).load(function(){$(".loading").fadeOut()})  
$(function () {
    echarts_1();
    echarts_2();
    echarts_3();
    echarts_4();
    echarts_5();
    echarts_6();
    echarts_7();
    echarts_8();
    echarts_9();
    echarts_15();
    echarts_10();
    echarts_16();

function echarts_1() {
        // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('echart1'));
     var data = [{
        title: '中国古代主要思想流派'
    },
    ['思想流派'],
    [{
        name: '仁义礼智(儒家)',
        max: 150
    }, {
        name: '道法自然(道家)',
        max: 150
    }, {
        name: '兼爱非攻(墨家)', 
        max: 150
    }, {
        name: '法治至上(法家)',
        max: 150
    }, {
        name: '谋略制胜(兵家)',
        max: 150
    }],
    [135, 125, 110, 120, 115],
]
option = {
    color: ['#9DD060', '#35C96E', '#4DCEF8'],
    tooltip: {},
    radar: {
        center: ['50%', '50%'],
        radius: ["25%", "70%"],
        name: {
            textStyle: {
                color: '#72ACD1'
            }
        },
        splitLine: {
            lineStyle: {
                color: 'rgba(255,255,255,.0',
                width: 2
            }
        },
        axisLine: {
            lineStyle: {
                color: 'rgba(255,255,255,0.2)',
                width: 1,
                type: 'dotted'
            },
        },
        splitArea: {
            areaStyle: {
                color: ['rgba(255,255,255,.1)', 'rgba(255,255,255,0)']
            }
        },
        indicator: data[2]
    },
    series: [{
        name: '',
        type: 'radar',
        data: [{
            areaStyle: {
                normal: {
                    opacity: 0.3,
                }
            },
            value: data[3],
            name: data[1][0]
        }]
    }]
};
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        window.addEventListener("resize",function(){
            myChart.resize();
        });
    }
function echarts_2() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('echart2'));
option = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    legend: {
        data: ['中国科技成就', '西方科技成就'],
        top:'5%',
        textStyle: {
            color: "#fff",
            fontSize: '12',
        },
        itemGap: 35
    },
    grid: {
        left: '0%',
        top:'40px',
        right: '0%',
        bottom: '0',
        containLabel: true
    },
    xAxis: [{
        type: 'category',
        data: ['公元前1000年', '公元前500年', '公元元年', '公元500年', '公元1000年', '公元1500年', '公元1800年'],
        axisLine: {
            show: true,
            lineStyle: {
                color: "rgba(255,255,255,.1)",
                width: 1,
                type: "solid"
            },
        },
        axisTick: {
            show: false,
        },
        axisLabel:  {
            interval: 0,
            show: true,
            splitNumber: 5,
            textStyle: {
                color: "rgba(255,255,255,.6)",
                fontSize: '12',
            },
            rotate: 15
        },
    }],
    yAxis: [{
        type: 'value',
        name: '重要成就',
        nameTextStyle: {
            color: 'rgba(255,255,255,.6)',
            fontSize: '12',
        },
        axisLabel: {
            show:true,
            textStyle: {
                color: "rgba(255,255,255,.6)",
                fontSize: '12',
            },
        },
        axisTick: {
            show: false,
        },
        axisLine: {
            show: true,
            lineStyle: {
                color: "rgba(255,255,255,.1)",
                width: 1,
                type: "solid"
            },
        },
        splitLine: {
            lineStyle: {
                color: "rgba(255,255,255,.1)",
            }
        }
    }],
    series: [{
        name: '中国科技成就',
        type: 'line',
        smooth: true,
        data: [45, 78, 125, 156, 189, 167, 145],
        areaStyle: {
            normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgba(47,137,207, 0.8)'
                }, {
                    offset: 1,
                    color: 'rgba(47,137,207, 0.1)'
                }]),
            }
        },
        itemStyle: {
            normal: {
                color: '#2f89cf',
                lineStyle: {
                    width: 2
                }
            }
        },
        symbol: 'circle',
        symbolSize: 8
    },
    {
        name: '西方科技成就',
        type: 'line',
        smooth: true,
        data: [65, 89, 76, 45, 89, 187, 256],
        areaStyle: {
            normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgba(135,189,90, 0.8)'
                }, {
                    offset: 1,
                    color: 'rgba(135,189,90, 0.1)'
                }]),
            }
        },
        itemStyle: {
            normal: {
                color: '#87bd5a',
                lineStyle: {
                    width: 2
                }
            }
        },
        symbol: 'circle',
        symbolSize: 8
    }]
};
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        window.addEventListener("resize",function(){
            myChart.resize();
        });
    }
function echarts_3() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('echart3'));
option = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    legend: {
        data: ['重要科学家', '其他学者'],
        top:'5%',
        textStyle: {
            color: "#fff",
            fontSize: '12',
        },
        itemGap: 35
    },
    grid: {
        left: '0%',
		top:'40px',
        right: '0%',
        bottom: '0',
       containLabel: true
    },
    xAxis: [{
        type: 'category',
        data: ['秦及以前', '汉', '唐', '宋', '元', '明', '清'],
        axisLine: {
            show: true,
         lineStyle: {
                color: "rgba(255,255,255,.1)",
                width: 1,
                type: "solid"
            },
        },
        axisTick: {
            show: false,
        },
        axisLabel: {
            interval: 0,
            show: true,
            textStyle: {
                color: "rgba(255,255,255,.6)",
                fontSize: '12',
            },
        },
    }],
    yAxis: [{
        type: 'value',
        name: '学者数量',
        nameTextStyle: {
            color: 'rgba(255,255,255,.6)',
            fontSize: '12',
        },
        axisLabel: {
            show:true,
            textStyle: {
                color: "rgba(255,255,255,.6)",
                fontSize: '12',
            },
        },
        axisTick: {
            show: false,
        },
        axisLine: {
            show: true,
            lineStyle: {
                color: "rgba(255,255,255,.1)",
                width: 1,
                type: "solid"
            },
        },
        splitLine: {
            lineStyle: {
               color: "rgba(255,255,255,.1)",
            }
        }
    }],
    series: [{
        name: '重要科学家',
        type: 'line',
        smooth: true,
        data: [15, 35, 48, 75, 25, 55, 68],
        itemStyle: {
            normal: {
                color:'#2f89cf',
                opacity: 1,
                barBorderRadius: 5,
            }
        }
    }, {
        name: '其他学者',
        type: 'line',
        smooth: true,
        data: [25, 55, 78, 120, 45, 85, 95],
        itemStyle: {
            normal: {
                color:'#62c98d',
                opacity: 1,
				barBorderRadius: 5,
            }
        }
    }]
};
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        window.addEventListener("resize",function(){
            myChart.resize();
        });
    }
function echarts_4() {
        var myChart = echarts.init(document.getElementById('echart4'));
var data = [78, 65, 82, 70, 75, 68, 55, 63]
var titlename = ['天文与地理学', '数学与计量', '医学与生物学', '工程技术与建筑', '农业科技', '军事科技', '化学与冶金', '物理'];
var valdata = [683, 534, 724, 623, 645, 568, 455, 523]

option = {
    grid: {
        left: '10',
		top: '20',
        right: '30',
        bottom: '-25',
        containLabel: true
    },
    xAxis: {
        show: false
    },
    yAxis: [{
        show: true,
        data: titlename,
        inverse: true,
        axisLine: {
            show: false
        },
        splitLine: {
            show: false
        },
        axisTick: {
            show: false
        },
        axisLabel: {
            textStyle: {
                color: "rgba(255,255,255,.6)",
                fontSize: '12',
            },
            formatter: function(value, index) {
                return [
                    '{title|' + value + '} '
                ].join('\n')
            },
            rich: {}
        },
    }, {
        show: true,
        inverse: true,
        data: valdata,
        axisLabel: {
            textStyle: {
                color: 'rgba(255,255,255,.5)',
                fontSize: '12',
            }
        },
        axisLine: {
            show: false
        },
        splitLine: {
            show: false
        },
        axisTick: {
            show: false
        },
    }],
    series: [{
        name: '科学家数量',
        type: 'bar',
        yAxisIndex: 0,
        data: data,
        barWidth: '40%',
        itemStyle: {
            normal: {
                barBorderRadius: 30,
                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                    offset: 0,
                    color: '#248ff7'
                }, {
                    offset: 1,
                    color: '#3893e5'
                }]),
            }
        },
        label: {
            normal: {
                show: false,
            }
        },
    }, {
        name: '框',
        type: 'bar',
        yAxisIndex: 1,
        barGap: '-100%',
        data: [100, 100, 100, 100, 100, 100, 100, 100],
        barWidth: '40%',
        itemStyle: {
            normal: {
                color: 'none',
                borderColor: 'rgba(255,255,255,.1)',
                borderWidth: 1,
                barBorderRadius: 15,
            }
        }
    }]
};
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        window.addEventListener("resize",function(){
            myChart.resize();
        });
    }
function echarts_5() {
 var myChart = echarts.init(document.getElementById('echart5'));
let inputValue =80
option = {
	title: {
        subtext: '文本2',
        left: 'center',
		bottom:15,
        subtextStyle: {
            color: 'rgba(255,255,255,.6)',
            fontSize: 12
        }
    },

  series: [
    {
      name: '',
      type: 'gauge',
 		radius: '90%',
      startAngle: 200,
      endAngle: -20,
      detail: {formatter: '{value}'},
      data: [{value: inputValue, name: ''}],
      axisLine: {
        lineStyle: {
			width: 10,
          color: [
            [
              0.8, new echarts.graphic.LinearGradient(//0.8值为颜色显示百分比80%
              0, 0, 1, 0, [{
              offset: 0,
              color: '#ae3df6'
            },
              {
                offset: 1,
                color: '#53bef9'
              }
            ]
              )
            ],
            [
              1, '#1c4e85'
            ]
          ]
        }
      },
	pointer: {       
                    show: false,         //不显示指针
                    length: "70%",         
                    width:3,              
                },
      axisLabel: {
        show: false
      },
      axisTick: {
        show: false
      },
      splitLine: {
        show: false
      },
      detail: {
        offsetCenter: [0, 1],
        color: '#fff',
		  fontSize: 16,
      }
    },


  ]

}
        myChart.setOption(option);
        window.addEventListener("resize",function(){
            myChart.resize();
        });
    }
function echarts_6() {
 var myChart = echarts.init(document.getElementById('echart6'));
let inputValue = 2
option = {
	title: {
        subtext: '文本2',
        left: 'center',
		bottom:15,
        subtextStyle: {
            color: 'rgba(255,255,255,.6)',
            fontSize: 12
        }
    },

  series: [
    {
      name: '',
      type: 'gauge',
 		radius: '90%',
      startAngle: 200,
      endAngle: -20,
      detail: {formatter: '{value}'},
      data: [{value: inputValue, name: ''}],
      axisLine: {
        lineStyle: {
			width: 10,
          color: [
            [
              0.7, new echarts.graphic.LinearGradient(//0.8值为颜色显示百分比%
              0, 0, 1, 0, [{
              offset: 0,
              color: '#1db0d2'
            },
              {
                offset: 1,
                color: '#44ceef'
              }
            ]
              )
            ],
            [
              1, '#1c4e85'
            ]
          ]
        }
      },
	pointer: {       
                    show: false,         //不显示指针
                    length: "70%",         
                    width:3,              
                },
      axisLabel: {
        show: false
      },
      axisTick: {
        show: false
      },
      splitLine: {
        show: false
      },
      detail: {
        offsetCenter: [0, 1],
        color: '#fff',
		  fontSize: 16,
      }
    },


  ]

}
        myChart.setOption(option);
        window.addEventListener("resize",function(){
            myChart.resize();
        });
    }
function echarts_7() {
 var myChart = echarts.init(document.getElementById('echart7'));
let inputValue = 10
option = {
	title: {
        subtext: '文本3',
        left: 'center',
		bottom:15,
        subtextStyle: {
            color: 'rgba(255,255,255,.6)',
            fontSize: 12
        }
    },

  series: [
    {
      name: '',
      type: 'gauge',
 		radius: '90%',
      startAngle: 200,
      endAngle: -20,
      detail: {formatter: '{value}'},
      data: [{value: inputValue, name: ''}],
      axisLine: {
        lineStyle: {
			width: 10,
          color: [
            [
              0.2, new echarts.graphic.LinearGradient(//0.8值为颜色显示百分比80%
              0, 0, 1, 0, [{
              offset: 0,
              color: '#1ea899'
            },
              {
                offset: 1,
                color: '#29c582'
              }
            ]
              )
            ],
            [
              1, '#1c4e85'
            ]
          ]
        }
      },
	pointer: {       
                    show: false,         //不显示指针
                    length: "70%",         
                    width:3,              
                },
      axisLabel: {
        show: false
      },
      axisTick: {
        show: false
      },
      splitLine: {
        show: false
      },
      detail: {
        offsetCenter: [0, 1],
        color: '#fff',
		  fontSize: 16,
      }
    },


  ]

}
        myChart.setOption(option);
        window.addEventListener("resize",function(){
            myChart.resize();
        });
    }
function echarts_8() {
 var myChart = echarts.init(document.getElementById('echart8'));
let inputValue = 2.5
option = {
	title: {
        subtext: '文本4',
        left: 'center',
		bottom:15,
        subtextStyle: {
            color: 'rgba(255,255,255,.6)',
            fontSize: 12
        }
    },

  series: [
    {
      name: '',
      type: 'gauge',
 		radius: '90%',
      startAngle: 200,
      endAngle: -20,
      detail: {formatter: '{value}'},
      data: [{value: inputValue, name: ''}],
      axisLine: {
        lineStyle: {
			width: 10,
          color: [
            [
              0.4, new echarts.graphic.LinearGradient(//0.8值为颜色显示百分比80%
              0, 0, 1, 0, [{
              offset: 0,
              color: '#e6658f'
            },
              {
                offset: 1,
                color: '#f8a58b'
              }
            ]
              )
            ],
            [
              1, '#1c4e85'
            ]
          ]
        }
      },
	pointer: {       
                    show: false,         //不显示指针
                    length: "70%",         
                    width:3,              
                },
      axisLabel: {
        show: false
      },
      axisTick: {
        show: false
      },
      splitLine: {
        show: false
      },
      detail: {
        offsetCenter: [0, 1],
        color: '#fff',
		  fontSize: 16,
      }
    },


  ]

}
        myChart.setOption(option);
        window.addEventListener("resize",function(){
            myChart.resize();
        });
    }
function echarts_9() {
        var myChart = echarts.init(document.getElementById('echart9'));
        option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {type: 'shadow'},
                formatter: '{b}领域成就分布'
            },
            legend: {
                x: 'center',
                y: '10',
                icon: 'circle',
                itemGap: 8,
                textStyle: {color: 'rgba(255,255,255,1)'},
                itemWidth: 10,
                itemHeight: 10,
                data: ['科学发现与创新', '技术发明', '工程应用']
            },
            grid: {
                left: '0',
                top: '40',
                right: '15',
                bottom: '0',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: ['天文地理', '数学计量', '医学生物', '工程建筑', '农业科技', '军事科技', '化学冶金', '物理'],
                axisLine: {show: false},
                axisLabel: {
                    textStyle: {
                        color: 'rgba(255,255,255,.5)',
                        fontSize: '12'
                    },
                    interval: 0,
                    rotate: 15
                }
            },
            yAxis: {
                type: 'value',
                name: '成就数量',
                nameTextStyle: {
                    color: 'rgba(255,255,255,.5)'
                },
                splitNumber: 4,
                axisLine: {show: false},
                axisTick: {show: false},
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: 'rgba(255,255,255,0.05)'
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: "rgba(255,255,255,.5)",
                    }
                }
            },
            series: [{
                name: '科学发现与创新',
                type: 'bar',
                barWidth: '20%',
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#8bd46e'
                        }, {
                            offset: 1,
                            color: '#03b48e'
                        }]),
                        barBorderRadius: 11,
                    }
                },
                data: [156, 142, 187, 134, 156, 98, 112, 86]
            },
            {
                name: '技术发明',
                type: 'bar',
                barWidth: '20%',
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#3893e5'
                        }, {
                            offset: 1,
                            color: '#248ff7'
                        }]),
                        barBorderRadius: 11,
                    }
                },
                data: [123, 165, 198, 245, 178, 167, 145, 92]
            },
            {
                name: '工程应用',
                type: 'bar',
                barWidth: '20%',
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#f5b44d'
                        }, {
                            offset: 1,
                            color: '#f89d39'
                        }]),
                        barBorderRadius: 11,
                    }
                },
                data: [134, 156, 167, 289, 198, 178, 156, 78]
            }]
        };
        myChart.setOption(option);
        window.addEventListener("resize", function() {
            myChart.resize();
        });
    }
function echarts_10() {
    var myChart = echarts.init(document.getElementById('echart10'));
    
    var data = [
        {
            name: '格物致知',
            value: 80,
            quote: '欲明天下之理，须要格物致知',
            author: '朱熹'
        },
        {
            name: '实践真知',
            value: 70,
            quote: '不闻不若闻之，闻之不若见之，见之不若知之，知之不若行之',
            author: '荀子'
        },
        {
            name: '医者仁心',
            value: 65,
            quote: '医者父母心，救死扶伤，无贵贱论',
            author: '孙思邈'
        },
        {
            name: '格物穷理',
            value: 60,
            quote: '察天地之微，故知造化之所为',
            author: '张衡'
        },
        {
            name: '科学精神',
            value: 55,
            quote: '凡物之理，欲其深察而实验之',
            author: '沈括'
        },
        {
            name: '农业科技',
            value: 50,
            quote: '上农抚时，中农力耕，下农逐时',
            author: '贾思勰'
        },
        {
            name: '医学理论',
            value: 45,
            quote: '有诸内者必形诸外，善诊者察色按脉',
            author: '李时珍'
        },
        {
            name: '天文观测',
            value: 40,
            quote: '测天之器，制于人手，不能违天之度',
            author: '郭守敬'
        }
    ];

    option = {
        backgroundColor: 'transparent',
        title: {
            text: '古代科学智慧录',
            textStyle: {
                color: '#fff',
                fontSize: 16
            },
            left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: function(params) {
                var info = params.data;
                return `${info.quote}<br/><br/>——${info.author}`;
            }
        },
        series: [{
            type: 'graph',
            layout: 'force',
            force: {
                repulsion: 200,
                edgeLength: 10
            },
            roam: true,
            label: {
                normal: {
                    show: true,
                    position: 'inside',
                    formatter: '{b}',
                    fontSize: 12,
                    color: '#fff'
                }
            },
            data: data.map(function (item) {
                return {
                    name: item.name,
                    value: item.value,
                    quote: item.quote,
                    author: item.author,
                    symbolSize: item.value / 2,
                    itemStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [{
                                offset: 0,
                                color: '#157eff'
                            }, {
                                offset: 1,
                                color: '#35c2ff'
                            }])
                        }
                    }
                };
            }),
            itemStyle: {
                normal: {
                    borderColor: '#fff',
                    borderWidth: 1,
                    shadowBlur: 10,
                    shadowColor: 'rgba(53,194,255,0.3)'
                }
            }
        }]
    };

    myChart.setOption(option);
    window.addEventListener("resize", function() {
        myChart.resize();
    });
}
function echarts_15() {
        var myChart = echarts.init(document.getElementById('map'));
        		
var data = [
   
    {name: '衢州', value: 177},
    {name: '广州', value: 277},
    {name: '廊坊', value: 193},
    {name: '菏泽', value: 194},
    {name: '合肥', value: 229},
    {name: '武汉', value: 273},
    {name: '大庆', value: 279},
    {name: '北京', value: 379},
    {name: '重庆', value: 120}
];
var geoCoordMap = {
    
   '海门':[121.15,31.89],
   '鄂尔多斯':[109.781327,39.608266],
   '招远':[120.38,37.35],
   '舟山':[122.207216,29.985295],
   '齐齐哈尔':[123.97,47.33],
   '盐城':[120.13,33.38],
   '赤峰':[118.87,42.28],
   '青岛':[120.33,36.07],
   '乳山':[121.52,36.89],
   '金昌':[102.188043,38.520089],
   '泉州':[118.58,24.93],
   '莱西':[120.53,36.86],
   '日照':[119.46,35.42],
   '胶南':[119.97,35.88],
   '南通':[121.05,32.08],
   '拉萨':[91.11,29.97],
   '云浮':[112.02,22.93],
   '梅州':[116.1,24.55],
   '文登':[122.05,37.2],
   '上海':[121.48,31.22],
   '攀枝花':[101.718637,26.582347],
   '威海':[122.1,37.5],
   '承德':[117.93,40.97],
   '厦门':[118.1,24.46],
   '汕尾':[115.375279,22.786211],
   '潮州':[116.63,23.68],
   '丹东':[124.37,40.13],
   '太仓':[121.1,31.45],
   '曲靖':[103.79,25.51],
   '烟台':[121.39,37.52],
   '福州':[119.3,26.08],
   '瓦房店':[121.979603,39.627114],
   '即墨':[120.45,36.38],
   '抚顺':[123.97,41.97],
   '玉溪':[102.52,24.35],
   '张家口':[114.87,40.82],
   '阳泉':[113.57,37.85],
   '莱州':[119.942327,37.177017],
   '湖州':[120.1,30.86],
   '汕头':[116.69,23.39],
   '昆山':[120.95,31.39],
   '宁波':[121.56,29.86],
   '湛江':[110.359377,21.270708],
   '揭阳':[116.35,23.55],
   '荣成':[122.41,37.16],
   '连云港':[119.16,34.59],
   '葫芦岛':[120.836932,40.711052],
   '常熟':[120.74,31.64],
   '东莞':[113.75,23.04],
   '河源':[114.68,23.73],
   '淮安':[119.15,33.5],
   '泰州':[119.9,32.49],
   '南宁':[108.33,22.84],
   '营口':[122.18,40.65],
   '惠州':[114.4,23.09],
   '江阴':[120.26,31.91],
   '蓬莱':[120.75,37.8],
   '韶关':[113.62,24.84],
   '嘉峪关':[98.289152,39.77313],
   '广州':[113.23,23.16],
   '延安':[109.47,36.6],
   '太原':[112.53,37.87],
   '清远':[113.01,23.7],
   '中山':[113.38,22.52],
   '昆明':[102.73,25.04],
   '寿光':[118.73,36.86],
   '盘锦':[122.070714,41.119997],
   '长治':[113.08,36.18],
   '深圳':[114.07,22.62],
   '珠海':[113.52,22.3],
   '宿迁':[118.3,33.96],
   '咸阳':[108.72,34.36],
   '铜川':[109.11,35.09],
   '平度':[119.97,36.77],
   '佛山':[113.11,23.05],
   '海口':[110.35,20.02],
   '江门':[113.06,22.61],
   '章丘':[117.53,36.72],
   '肇庆':[112.44,23.05],
   '大连':[121.62,38.92],
   '临汾':[111.5,36.08],
   '吴江':[120.63,31.16],
   '石嘴山':[106.39,39.04],
   '沈阳':[123.38,41.8],
   '苏州':[120.62,31.32],
   '茂名':[110.88,21.68],
   '嘉兴':[120.76,30.77],
   '长春':[125.35,43.88],
   '胶州':[120.03336,36.264622],
   '银川':[106.27,38.47],
   '张家港':[120.555821,31.875428],
   '三门峡':[111.19,34.76],
   '锦州':[121.15,41.13],
   '南昌':[115.89,28.68],
   '柳州':[109.4,24.33],
   '三亚':[109.511909,18.252847],
   '自贡':[104.778442,29.33903],
   '吉林':[126.57,43.87],
   '阳江':[111.95,21.85],
   '泸州':[105.39,28.91],
   '西宁':[101.74,36.56],
   '宜宾':[104.56,29.77],
   '呼和浩特':[111.65,40.82],
   '成都':[104.06,30.67],
   '大同':[113.3,40.12],
   '镇江':[119.44,32.2],
   '桂林':[110.28,25.29],
   '张家界':[110.479191,29.117096],
   '宜兴':[119.82,31.36],
   '北海':[109.12,21.49],
   '西安':[108.95,34.27],
   '金坛':[119.56,31.74],
   '东营':[118.49,37.46],
   '牡丹江':[129.58,44.6],
   '遵义':[106.9,27.7],
   '绍兴':[120.58,30.01],
   '扬州':[119.42,32.39],
   '常州':[119.95,31.79],
   '潍坊':[119.1,36.62],
   '重庆':[106.54,29.59],
   '台州':[121.420757,28.656386],
   '南京':[118.78,32.04],
   '滨州':[118.03,37.36],
   '贵阳':[106.71,26.57],
   '无锡':[120.29,31.59],
   '本溪':[123.73,41.3],
   '克拉玛依':[84.77,45.59],
   '渭南':[109.5,34.52],
   '马鞍山':[118.48,31.56],
   '宝鸡':[107.15,34.38],
   '焦作':[113.21,35.24],
   '句容':[119.16,31.95],
   '北京':[116.46,39.92],
   '徐州':[117.2,34.26],
   '衡水':[115.72,37.72],
   '包头':[110,40.58],
   '绵阳':[104.73,31.48],
   '乌鲁木齐':[87.68,43.77],
   '枣庄':[117.57,34.86],
   '杭州':[120.19,30.26],
   '淄博':[118.05,36.78],
   '鞍山':[122.85,41.12],
   '溧阳':[119.48,31.43],
   '库尔勒':[86.06,41.68],
   '安阳':[114.35,36.1],
   '开封':[114.35,34.79],
   '济南':[117,36.65],
   '德阳':[104.37,31.13],
   '温州':[120.65,28.01],
   '九江':[115.97,29.71],
   '邯郸':[114.47,36.6],
   '临安':[119.72,30.23],
   '兰州':[103.73,36.03],
   '沧州':[116.83,38.33],
   '临沂':[118.35,35.05],
   '南充':[106.110698,30.837793],
   '天津':[117.2,39.13],
   '富阳':[119.95,30.07],
   '泰安':[117.13,36.18],
   '诸暨':[120.23,29.71],
   '郑州':[113.65,34.76],
   '哈尔滨':[126.63,45.75],
   '聊城':[115.97,36.45],
   '芜湖':[118.38,31.33],
   '唐山':[118.02,39.63],
   '平顶山':[113.29,33.75],
   '邢台':[114.48,37.05],
   '德州':[116.29,37.45],
   '济宁':[116.59,35.38],
   '荆州':[112.239741,30.335165],
   '宜昌':[111.3,30.7],
   '义乌':[120.06,29.32],
   '丽水':[119.92,28.45],
   '洛阳':[112.44,34.7],
   '秦皇岛':[119.57,39.95],
   '株洲':[113.16,27.83],
   '石家庄':[114.48,38.03],
   '莱芜':[117.67,36.19],
   '常德':[111.69,29.05],
   '保定':[115.48,38.85],
   '湘潭':[112.91,27.87],
   '金华':[119.64,29.12],
   '岳阳':[113.09,29.37],
   '长沙':[113,28.21],
   '衢州':[118.88,28.97],
   '廊坊':[116.7,39.53],
   '菏泽':[115.480656,35.23375],
   '合肥':[117.27,31.86],
   '武汉':[114.31,30.52],
   '大庆':[125.03,46.58]
};
var convertData = function (data) {
   var res = [];
   for (var i = 0; i < data.length; i++) {
       var geoCoord = geoCoordMap[data[i].name];
       if (geoCoord) {
           res.push({
               name: data[i].name,
               value: geoCoord.concat(data[i].value)
           });
       }
   }
   return res;
};

option = {
  // backgroundColor: '#404a59',
 /***  title: {
       text: '实时行驶车辆',
       subtext: 'data from PM25.in',
       sublink: 'http://www.pm25.in',
       left: 'center',
       textStyle: {
           color: '#fff'
       }
   },**/
   tooltip : {
       trigger: 'item'
   },
 
   geo: {

       map: 'china',
       zoom: 1.1,//放大
       label: {
           emphasis: {
               show: false
           }
       },
       roam: true,
       itemStyle: {
        normal: {
            areaColor: 'rgba(2,37,101,.5)',
            borderColor: 'rgba(112,187,252,.5)'
        },
        emphasis: {
            areaColor: 'rgba(2,37,101,.8)'
        }
    }
   },
   series : [
       {
           name: '科学家或学者',
           type: 'effectScatter',
           coordinateSystem: 'geo',
           rippleEffect: {
            brushType: 'stroke'
        },
           data: convertData(data),
           symbolSize: function (val) {
               return val[2] / 15;
           },
           label: {
               normal: {
                   formatter: '{b}',
                   position: 'right',
                   show: false
               },
               emphasis: {
                   show: true
               }
           },
           itemStyle: {
               normal: {
                   color: '#ffeb7b'
               }
           }
       }
       
   ]
};
     
               myChart.setOption(option);
               window.addEventListener("resize",function(){
                   myChart.resize();
               });
    }
    
function echarts_16() {
    var myChart = echarts.init(document.getElementById('echart16'));
    var data = [
        {
            name: '格物致知',
            value: 80,
            textStyle: {
                color: '#9DD060'
            }
        },
        {
            name: '天人合一',
            value: 75,
            textStyle: {
                color: '#35C96E'
            }
        },
        {
            name: '实践真知',
            value: 70,
            textStyle: {
                color: '#4DCEF8'
            }
        },
        {
            name: '医者仁心',
            value: 65,
            textStyle: {
                color: '#9DD060'
            }
        },
        {
            name: '格物穷理',
            value: 60,
            textStyle: {
                color: '#35C96E'
            }
        },
        {
            name: '科学精神',
            value: 55,
            textStyle: {
                color: '#4DCEF8'
            }
        }
        // 可以继续添加更多词条
    ];

    option = {
        backgroundColor: 'transparent',
        tooltip: {
            show: true
        },
        series: [{
            type: 'wordCloud',
            shape: 'circle',
            gridSize: 1,
            sizeRange: [12, 40],
            rotationRange: [-90, 90],
            rotationStep: 45,
            drawOutOfBound: false,
            textStyle: {
                normal: {
                    fontFamily: 'sans-serif',
                    fontWeight: 'bold',
                    color: function () {
                        return 'rgb(' + [
                            Math.round(Math.random() * 160 + 95),
                            Math.round(Math.random() * 160 + 95),
                            Math.round(Math.random() * 160 + 95)
                        ].join(',') + ')';
                    }
                },
                emphasis: {
                    shadowBlur: 10,
                    shadowColor: '#333'
                }
            },
            data: data
        }]
    };

    // 使词云图3D旋转
    var angle = 0;
    setInterval(function () {
        angle += 0.1;
        myChart.setOption({
            series: [{
                rotationRange: [angle - 90, angle + 90]
            }]
        });
    }, 100);

    myChart.setOption(option);
    window.addEventListener("resize", function() {
        myChart.resize();
    });
    }
    
})





		
		
		


		









