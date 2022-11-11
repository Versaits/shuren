//二级展开列表列表
(function (jQuery) {
    jQuery.fn.extend({
        lvs_chart_demo: function (token, idxid, curdata) {
            var listbox = $(this);


            //柱状图
            curdata.barchart = { title: { text: '衣物销量统计' }, tooltip: {}, legend: { data: ['数量'] },
                toolbox: {
                    show: true,
                    feature: {
                        magicType: { type: ['line', 'bar']}//此处最新版本echarts可设置三个值（stack-堆叠模式）,可自行查看echarts文档
                    }
                },
                xAxis: {
                    data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
                },
                yAxis: {
                    type: 'value',
                    name: '日销量（万）',
                    min: 0,
                    max: 4,
                    axisLabel: {
                        formatter: function (value) {
                            var texts = [];
                            if (value == 0) {
                                texts.push('woo');
                            } else if (value <= 1) {
                                texts.push('好');
                            } else if (value <= 2) {
                                texts.push('很好');
                            } else if (value <= 3) {
                                texts.push('非常好');
                            } else {
                                texts.push('完美');
                            }
                            return texts;

                        }
                    }
                },
                series: [{
                    name: '数量',
                    type: 'bar',
                    //柱状宽度
                    barWidth: 60,
                    data: [1, 4, 2, 3, 2, 1]
                }]
            };

            //折线图
            curdata.linechart = {
                title: {
                    text: 'Stacked Line'
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine']
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}//是否要提供保存
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                },
                yAxis: {
                    type: 'value'
                },
                series: [
    {
        name: 'Email',
        type: 'line',
        stack: 'Total',
        data: [120, 132, 101, 134, 90, 230, 210]
    },
    {
        name: 'Union Ads',
        type: 'line',
        stack: 'Total',
        data: [220, 182, 191, 234, 290, 330, 310]
    },
    {
        name: 'Video Ads',
        type: 'line',
        stack: 'Total',
        data: [150, 232, 201, 154, 190, 330, 410]
    },
    {
        name: 'Direct',
        type: 'line',
        stack: 'Total',
        data: [320, 332, 301, 334, 390, 330, 320]
    },
    {
        name: 'Search Engine',
        type: 'line',
        stack: 'Total',
        data: [820, 932, 901, 934, 1290, 1330, 1320]
    }
  ]
            };


            //饼图
            curdata.piechart = { tooltip: {
                trigger: 'item'
            },
                legend: {
                    top: '5%',
                    left: 'center'
                },
             
                series: [
    {
        name: 'Access From',
        type: 'pie',
        radius: ['40 %', '60%'],
        avoidLabelOverlap: false,
        label: {//带标注
            show: true,
            
        },
        emphasis: {
            label: {
                show: true, //点击后对应label会凸显
                fontSize: '40',
                fontWeight: 'bold'
            }
        },
        labelLine: {
            show: true,
            length: 5
        },
        data: [
        { value: 1048, name: 'Search Engine' },
        { value: 735, name: 'Direct' },
        { value: 580, name: 'Email' },
        { value: 484, name: 'Union Ads' },
        { value: 300, name: 'Video Ads' }
      ]
    }
  ]
            };
            curdata.radarchart = { title: {
                text: 'Basic Radar Chart'
            },
                legend: {
                    data: ['Allocated Budget', 'Actual Spending']
                },
                radar: {
                    // shape: 'circle',
                    indicator: [
      { name: 'Sales', max: 6500 },
      { name: 'Administration', max: 16000 },
      { name: 'Information Technology', max: 30000 },
      { name: 'Customer Support', max: 38000 },
      { name: 'Development', max: 52000 },
      { name: 'Marketing', max: 25000 }
    ]
                },
                series: [
    {
        name: 'Budget vs spending',
        type: 'radar',
       /* label: {
                    normal: {
                        show: true,
                        formatter:function(data) {
                            return data.value;
                        }
                    }
                },增加标注*/
         emphasis: {     //鼠标移动后出现数据  
                label: {
                  show: true,
                  color: '#000000',
                  formatter: '{c}%',       // 鼠标悬浮时展示数据加上单位
                  fontSize: 20,
                }
              },
        data: [
        {
            value: [4200, 3000, 20000, 35000, 50000, 18000],
            name: 'Allocated Budget'

        },
        {
            value: [5000, 14000, 28000, 26000, 42000, 21000],
            name: 'Actual Spending'
        }
      ]
    }
  ]
            };

            curdata.gaugechart = {  series: [
    {
      type: 'gauge',
      progress: {
        show: true,
        width: 18
      },
      axisLine: {
        
        lineStyle: {
          width: 18
        }
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        show:false,
        distance: 25,
        color: '#999',
        fontSize: 20
      },
       splitLine:{show:false},
      anchor: {
        show: true,
        showAbove: true,
        size: 25,
        itemStyle: {
          borderWidth: 10
        }
      },
      title: {
        show: false
      },
      detail: {
        valueAnimation: true,
        fontSize: 30,
       
      },
      data: [
        {
          value: 70
        }
      ]
    }
  ]              
};

            return this;
        }
    });
})(jQuery);


//饼图
(function (jQuery) {
    jQuery.fn.extend({
        lvs_elchart: function (token, idxid, curdata) {
            var chartbox = $(this);

            //初始化echarts实例
            var myChart = echarts.init($(chartbox).find('#chartmain')[0]);

            //使用制定的配置项和数据显示图表
            myChart.setOption(curdata.chart);
            //根据窗口的大小变动图表 --- 重点
            window.addEventListener('resize', function () {
                myChart.resize()
            });
        }

    });
})(jQuery);

//饼图
(function (jQuery) {
    jQuery.fn.extend({
        lvs_elchart_gauge: function (token, idxid, curdata) {
            var chartbox = $(this);

            var chartwidth = $(chartbox).find('#chartmain').width();
            //初始化echarts实例
            var myChart = echarts.init($(chartbox).find('#chartmain')[0]);

            curdata.chart = {  series: [
            {
                type: 'gauge',
                progress: {
                    show: true,
                    width: parseInt( chartwidth / 20 )
                },
                axisLine: {
                    lineStyle: {
                    width: parseInt( chartwidth / 20 )
                }
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                show:false,
                distance: 25,
                color: '#999',
                fontSize: 20
            },
            splitLine:{show:false},
            anchor: {
               show: true,
               showAbove: true,
               size: parseInt( chartwidth / 15 ),
               itemStyle: {
                   borderWidth: parseInt( chartwidth / 30 )
               }
            },
            title: {
                show: curdata.title != undefined? true: false,
                title: curdata.title
            },
            detail: {
                valueAnimation: true,
                fontSize: parseInt( chartwidth / 8 )
            },
            data: [{value: curdata.vnum}]
            }] };
            //使用制定的配置项和数据显示图表
            myChart.setOption(curdata.chart);
            //根据窗口的大小变动图表 --- 重点
            window.addEventListener('resize', function () {
                myChart.resize()
            });
        }

    });
})(jQuery);
