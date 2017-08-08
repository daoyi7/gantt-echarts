function runGantt(startDate, finishDate, speed, time) {
    var dom = document.getElementById("container");
    dom.style.width = "100%";
    dom.style.height = "400px";

    var myChart = echarts.init(dom);
    var app = {};
    option = null;
    window.addEventListener("resize", function () {
        myChart.resize();
    });

    $(hsz).each(function () {
        var arr = $(this);
        var start = arr[0].StartDate;
        var finish = arr[0].FinishDate;
        var startDateFN = mini.decode(mini.encode(start));
        startDate = startDate
            || new Date(startDateFN - ((startDateFN.getHours() * 60 * 60 * 1000) + (startDateFN.getMinutes() * 60 * 1000) + (startDateFN.getSeconds() * 1000)));
        var finishDateFN = mini.decode(mini.encode(finish));
        finishDate = finishDate
            || new Date(finishDateFN - ((finishDateFN.getHours() * 60 * 60 * 1000) + (finishDateFN.getMinutes() * 60 * 1000) + (finishDateFN.getSeconds() * 1000)));

        var btn = document.getElementById("btn"),
            g = 0,
            e = 0,
            oneDay = 24 * 60 * 60 * 1000,                   //一天的毫秒数
            timer = null,
            // runTime = new Date(+startDate - oneDay * 30),
            beginDate = new Date(+startDate - oneDay * 30),                     //开始日期是所给日期的前一个月，x轴原点为前一个月
            // endDate = new Date(2007, 9, 5, 00, 00, 00),
            // moreDate = new Date(2007, 0, 15, 00, 00, 00),
            yData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],                //提前定义折线图节点数组
            yAll = [0],                 //折线图节点和
            yDataSort = [],             //折线图节点和集
            xCoord = [],                //横坐标
            yCoord,                     //纵坐标
            runName = "时间线",            //运动竖线的文字内容
            endName = "终点线",            //终点竖线的文字内容
            runPos = "bottom",          //运动竖线的文字位置
            endPos = "top",             //终点竖线的文字位置
            runColor = "red",           //运动竖线的颜色
            endColor = "green",         //终点竖线的颜色
            runW = 2,               //运动竖线的宽
            endW = 2,               //终点竖线的宽
            hourTime = 3600,        //一小时的时间（秒数）
            dayTime = 86400;        //一天的事件（秒数）
        speed = speed || dayTime;        //定义运动竖线按什么速度走（一天或者一小时）
        time = time || 1000;

        //设置时间线
        // project.setTimeLines([
        //     {
        //         date: startDate,
        //         text: runName,
        //         position: runPos,
        //         style: "width:" + runW + "px;background:" + runColor + ";"
        //     },
        //     {date: finishDate, text: endName, position: endPos, style: "width:" + endW + "px;background:" + endColor + ";"}
        // ]);

        // 横坐标日期集合
        for (var i = 0; i < 31; i++) {
            var now = new Date(+beginDate + oneDay * i);                                            //开始日期加i天
            var xItem = [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('-');                 //取日期节点坐横坐标
            xCoord.push(xItem);
        }

        //折线图节点数字求和
        yAll = yData.reduce(function (sum, value) {
            return sum + value;
        })

        //折线图节点数字求和 数组
        yDataSort = yData.reduce(function (sum, value) {
            var all = sum.length === 0 ? 0 : sum[sum.length - 1];
            sum.push(all + value);
            return sum;
        }, [])

        //纵坐标重点max值
        yCoord = Math.ceil(yAll * 1.15);


        option = {
            title: {
                text: '黑沙洲水道航道整治二期工程',
                left: 'center'
            },
            tooltip: {
                trigger: 'axis',
                formatter: '{a} <br/>{b} : {c}',
                axisPointer: {
                    type: 'line',
                },
            },
            xAxis: {
                type: 'category',
                name: '时间',
                boundaryGap: false,
                splitLine: {show: false},
                data: xCoord,
            },
            yAxis: {
                type: 'value',
                name: '总金额',
                min: 0,
                max: yCoord,
                splitLine: {show: false},
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            series: [
                {
                    name: '总金额',
                    type: 'line',
                    itemStyle: {
                        normal: {
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [{
                                    offset: 0, color: 'red' // 0% 处的颜色
                                }, {
                                    offset: 1, color: '#FFAF00' // 100% 处的颜色
                                }],
                                globalCoord: false // 缺省为 false
                            }
                        }
                    },
                    markLine: {
                        silent: true,
                        lineStyle: {
                            normal: {
                                type: 'solid',
                                color: {
                                    type: 'linear',
                                    x: 0,
                                    y: 0,
                                    x2: 0,
                                    y2: 1,
                                    colorStops: [{
                                        offset: 0, color: 'red' // 0% 处的颜色
                                    }, {
                                        offset: 1, color: '#FFAF00' // 100% 处的颜色
                                    }],
                                    globalCoord: false // 缺省为 false
                                },
                            }
                        },
                        data: [
                            [{coord: [30, 0], symbol: 'none'}, {coord: [30, yAll], symbol: 'none'}],
                            [{coord: [0, yAll], symbol: 'none'}, {coord: [30, yAll], symbol: 'none'}],
                        ]
                    },
                    markPoint: {
                        silent: true,
                        symbol: 'circle',
                        symbolSize: 9,
                        label: {
                            normal: {
                                offset: [-15, -15],
                                textStyle: {
                                    color: '#000'
                                },
                            },
                        },
                        itemStyle: {
                            normal: {
                                type: 'solid',
                                borderColor: {
                                    type: 'linear',
                                    x: 0,
                                    y: 0,
                                    x2: 0,
                                    y2: 1,
                                    colorStops: [{
                                        offset: 0, color: 'red' // 0% 处的颜色
                                    }, {
                                        offset: 1, color: '#FFAF00' // 100% 处的颜色
                                    }],
                                    globalCoord: false // 缺省为 false
                                },
                                borderWidth: 1,
                                color: '#fff'
                            }
                        },
                        data: [{
                            coord: [30, yAll]
                        }]
                    },
                    data: yDataSort
                },
                // {
                //     name: '1/2的指数',
                //     type: 'bar',
                //     itemStyle: {
                //         normal: {
                //             color:'green'
                //         }
                //     },
                //     data: [yData[1],yData[2],yData[3],yData[4],yData[5]]
                // }
            ]
        };

        if (option && typeof option === "object") {
            myChart.setOption(option, true);
        }

        btn.onclick = function () {
            clearInterval(timer);
            timer = setInterval(function () {
                //甘特图部分
                g = g + 1;
                //  开始运动
                var runDate = new Date((startDate / 1000 + speed * g) * 1000);
                project.setTimeLines([
                    {
                        date: finishDate,
                        text: endName,
                        position: endPos,
                        style: "width:" + endW + "px;background:" + endColor + ";"
                    },
                    {
                        date: runDate,
                        text: runName,
                        position: runPos,
                        style: "width:" + runW + "px;background:" + runColor + ";"
                    }
                ]);
                project.scrollToDate(runDate);

                //echarts部分
                e = e + 1;
                var more = Math.ceil((Math.random() * 1000) * 21 - 10);                            //生成一个新折线图数据节点
                var moreSort = yDataSort[yDataSort.length - 1] + more;      //继续求和
                var newDay = new Date(+beginDate + oneDay * (30 + e));       //生成一个月后新的一天
                var moreDay = [newDay.getFullYear(), newDay.getMonth() + 1, newDay.getDate()].join('-');

                yData.shift();                                              //去掉折线图节点数字数组的第一个点
                yData.push(more);                                           //把新的折线图数据节点加到折线图节点数字数组里去
                yDataSort.shift();                                          //去掉折线图节点数字和数组的第一个点
                yDataSort.push(moreSort);                                   //把新的和加到数组里去
                xCoord.shift();                                             //去掉日期数组的第一个值
                xCoord.push(moreDay);                                       //把新的日期加到数组里去

                yAll = yDataSort[yDataSort.length - 1];                     //重新赋值和数组的最大值
                yCoord = Math.ceil(yAll * 1.15);                            //重新赋值纵坐标最大值

                option = {
                    title: {
                        text: '黑沙洲水道航道整治二期工程',
                        left: 'center'
                    },
                    tooltip: {
                        trigger: 'axis',
                        formatter: '{a} <br/>{b} : {c}',
                        axisPointer: {
                            type: 'line',
                        },
                    },
                    legend: {
                        left: '2%',
                        top: '1%',
                        data: [{
                            name: '总金额'
                        }]
                    },
                    xAxis: {
                        type: 'category',
                        name: '时间',
                        boundaryGap: false,
                        splitLine: {show: false},
                        data: xCoord,
                    },
                    yAxis: {
                        type: 'value',
                        name: '总金额',
                        min: 0,
                        max: yCoord,
                        splitLine: {show: false},
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    series: [
                        {
                            name: '总金额',
                            type: 'line',
                            itemStyle: {
                                normal: {
                                    color: {
                                        type: 'linear',
                                        x: 0,
                                        y: 0,
                                        x2: 0,
                                        y2: 1,
                                        colorStops: [{
                                            offset: 0, color: 'red' // 0% 处的颜色
                                        }, {
                                            offset: 1, color: '#FFAF00' // 100% 处的颜色
                                        }],
                                        globalCoord: false // 缺省为 false
                                    }
                                }
                            },
                            markLine: {
                                silent: true,
                                lineStyle: {
                                    normal: {
                                        type: 'dashed',
                                        color: {
                                            type: 'linear',
                                            x: 0,
                                            y: 0,
                                            x2: 0,
                                            y2: 1,
                                            colorStops: [{
                                                offset: 0, color: 'red' // 0% 处的颜色
                                            }, {
                                                offset: 1, color: '#FFAF00' // 100% 处的颜色
                                            }],
                                            globalCoord: false // 缺省为 false
                                        },
                                    }
                                },
                                data: [
                                    [{coord: [30, 0], symbol: 'none'}, {coord: [30, yAll], symbol: 'none'}],
                                    [{coord: [0, yAll], symbol: 'none'}, {coord: [30, yAll], symbol: 'none'}],
                                ]
                            },
                            markPoint: {
                                silent: true,
                                symbol: 'circle',
                                symbolSize: 8,
                                label: {
                                    normal: {
                                        offset: [-15, -15],
                                        textStyle: {
                                            color: '#000'
                                        },
                                    },
                                },
                                itemStyle: {
                                    normal: {
                                        type: 'solid',
                                        show: true,
                                        borderColor: {
                                            type: 'linear',
                                            x: 0,
                                            y: 0,
                                            x2: 0,
                                            y2: 1,
                                            colorStops: [{
                                                offset: 0, color: 'red' // 0% 处的颜色
                                            }, {
                                                offset: 1, color: '#FFAF00' // 100% 处的颜色
                                            }],
                                            globalCoord: false // 缺省为 false
                                        },
                                        color: '#fff'
                                    }
                                },
                                data: [{
                                    coord: [30, yAll]
                                }]
                            },
                            data: yDataSort
                        },
                        // {
                        //     name: '1/2的指数',
                        //     type: 'bar',
                        //     itemStyle: {
                        //         normal: {
                        //             color:'green'
                        //         }
                        //     },
                        //     data: [yData[1],yData[2],yData[3],yData[4],yData[5]]
                        // }
                    ]
                };

                if (option && typeof option === "object") {
                    myChart.setOption(option, true);
                }


                if (runDate / 1000 >= finishDate / 1000) {
                    clearInterval(timer);
                }
            }, time);
        }
    })
}
