const data = $.ajax({
    type: 'GET',
    url: 'http://10.20.0.118:8042/getDailyCost.php',
    async: false,
})

const dataEchart = JSON.parse(data.responseText)
const LEN = dataEchart.data.length

const startDateGantt = '2016-12-09T08:00:00'
const FinishDateGantt = '2017-12-02T15:00:00'

const timeChooseInput = document.getElementById("timeChooseInput")

const dom = document.getElementById("container")
dom.style.width = "100%"
dom.style.height = "250px"

const myChart = echarts.init(dom)
const app = {};
option = null;
window.addEventListener("resize", function() {
    myChart.resize()
});

function runGantt(startDate, finishDate, speed, time) {

    // let start = arr[0].StartDate
    // let finish = arr[0].FinishDate
    let startDateFN = new Date(dataEchart.data[0].SGRQ)
    startDate = startDate ||
        new Date(startDateFN - ((startDateFN.getHours() * 60 * 60 * 1000) + (startDateFN.getMinutes() * 60 * 1000) + (startDateFN.getSeconds() * 1000)))
    let finishDateFN = new Date(dataEchart.data[LEN - 1].SGRQ)
    finishDate = finishDate ||
        new Date(finishDateFN - ((finishDateFN.getHours() * 60 * 60 * 1000) + (finishDateFN.getMinutes() * 60 * 1000) + (finishDateFN.getSeconds() * 1000)))

    let fBackBtn = document.getElementById("fBackBtn"), //快退
        backBtn = document.getElementById("backBtn"), //后退
        beginBtn = document.getElementById("beginBtn"), //开始按钮
        pauseBtn = document.getElementById("pauseBtn"), //暂停
        stopBtn = document.getElementById("stopBtn"), //停止
        // forwardBtn = document.getElementById("forwardBtn"), //前进
        fForwardBtn = document.getElementById("fForwardBtn"), //快进
        todayBtn = document.getElementById("todayBtn"), //查看今天
        g = 0,
        e = 0,
        oneDay = 24 * 60 * 60 * 1000, //一天的毫秒数
        timer = null,
        beginDate = new Date(+startDate - oneDay * 30), //开始日期是所给日期的前一个月，x轴原点为前一个月
        yData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //提前定义折线图节点数组
        yDataB = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //提前定义折线图节点数组
        yDataC = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //提前定义折线图节点数组
        yAll = [0], //折线图节点和
        yAllB = [0], //折线图节点和
        yAllC = [0], //折线图节点和
        yDataSort = [], //折线图节点和集
        yDataSortB = [], //折线图节点和集
        yDataSortC = [], //折线图节点和集
        xCoord = [], //横坐标
        yCoord, //纵坐标
        runName = "时间线", //运动竖线的文字内容
        endName = "终点线", //终点竖线的文字内容
        runPos = "bottom", //运动竖线的文字位置
        endPos = "top", //终点竖线的文字位置
        tdyPos = "bottom", //今天竖线的文字位置
        runColor = "red", //运动竖线的颜色
        endColor = "green", //终点竖线的颜色
        tdyColor = "#32ceff", //今天竖线的颜色
        runW = 2, //运动竖线的宽
        endW = 2, //终点竖线的宽
        tdyW = 2, //今天竖线的宽度
        hourTime = 3600, //一小时的时间（秒数）
        dayTime = 86400; //一天的事件（秒数）
    speed = speed || dayTime; //定义运动竖线按什么速度走（一天或者一小时）
    time = time || 1000;

    // 横坐标日期集合
    for (var i = 0; i < 31; i++) {
        var now = new Date(+beginDate + oneDay * i); //开始日期加i天
        var xItem = [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('-'); //取日期节点坐横坐标
        xCoord.push(xItem);
    }

    //折线图节点数字求和
    yAll = yData.reduce(function(sum, value) {
        return sum + value
    })
    yAllB = yDataB.reduce(function(sum, value) {
        return sum + value
    })
    yAllC = yDataC.reduce(function(sum, value) {
        return sum + value
    })

    //折线图节点数字求和 数组
    yDataSort = yData.reduce(function(sum, value) {
        var all = sum.length === 0 ? 0 : sum[sum.length - 1];
        sum.push(all + value)
        return sum
    }, [])
    yDataSortB = yDataB.reduce(function(sum, value) {
        var all = sum.length === 0 ? 0 : sum[sum.length - 1];
        sum.push(all + value)
        return sum
    }, [])
    yDataSortC = yDataC.reduce(function(sum, value) {
        var all = sum.length === 0 ? 0 : sum[sum.length - 1];
        sum.push(all + value)
        return sum
    }, [])

    //纵坐标重点max值
    yCoord = Math.ceil(yAll * 1.15)

    option = {
        title: {
            text: '黑沙洲水道航道整治二期工程',
            left: 'center'
        },
        tooltip: {
            trigger: 'axis',
            // formatter: '{a} <br/>{b} : {c}',
            axisPointer: {
                type: 'line',
            },
        },
        legend: {
            right: '2%',
            top: '8%',
            data: ['BCWP', 'BCWS', 'ACWP']
        },
        xAxis: {
            type: 'category',
            name: '时间',
            boundaryGap: false,
            splitLine: {
                show: false
            },
            data: xCoord,
        },
        yAxis: {
            type: 'value',
            name: '总金额',
            min: 0,
            max: yCoord,
            splitLine: {
                show: false
            },
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        series: [{
                name: 'BCWP',
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
                                offset: 0,
                                color: 'red' // 0% 处的颜色
                            }, {
                                offset: 1,
                                color: '#FFAF00' // 100% 处的颜色
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
                                    offset: 0,
                                    color: 'red' // 0% 处的颜色
                                }, {
                                    offset: 1,
                                    color: '#FFAF00' // 100% 处的颜色
                                }],
                                globalCoord: false // 缺省为 false
                            },
                        }
                    },
                    data: [
                        [{
                            coord: [30, 0],
                            symbol: 'none'
                        }, {
                            coord: [30, yAll],
                            symbol: 'none'
                        }],
                        [{
                            coord: [0, yAll],
                            symbol: 'none'
                        }, {
                            coord: [30, yAll],
                            symbol: 'none'
                        }],
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
                                    offset: 0,
                                    color: 'red' // 0% 处的颜色
                                }, {
                                    offset: 1,
                                    color: '#FFAF00' // 100% 处的颜色
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
            {
                name: 'BCWS',
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
                                offset: 0,
                                color: '#97baf3' // 0% 处的颜色
                            }, {
                                offset: 1,
                                color: '#3fa7dc' // 100% 处的颜色
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
                                    offset: 0,
                                    color: '#97baf3' // 0% 处的颜色
                                }, {
                                    offset: 1,
                                    color: '#3fa7dc' // 100% 处的颜色
                                }],
                                globalCoord: false // 缺省为 false
                            },
                        }
                    },
                    data: [
                        [{
                            coord: [30, 0],
                            symbol: 'none'
                        }, {
                            coord: [30, yAll],
                            symbol: 'none'
                        }],
                        [{
                            coord: [0, yAll],
                            symbol: 'none'
                        }, {
                            coord: [30, yAll],
                            symbol: 'none'
                        }],
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
                                    offset: 0,
                                    color: '#97baf3' // 0% 处的颜色
                                }, {
                                    offset: 1,
                                    color: '#3fa7dc' // 100% 处的颜色
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
                data: yDataSortB
            },
            {
                name: 'ACWP',
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
                                offset: 0,
                                color: '#a5efb6' // 0% 处的颜色
                            }, {
                                offset: 1,
                                color: '#28a745' // 100% 处的颜色
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
                                    offset: 0,
                                    color: '#a5efb6' // 0% 处的颜色
                                }, {
                                    offset: 1,
                                    color: '#28a745' // 100% 处的颜色
                                }],
                                globalCoord: false // 缺省为 false
                            },
                        }
                    },
                    data: [
                        [{
                            coord: [30, 0],
                            symbol: 'none'
                        }, {
                            coord: [30, yAll],
                            symbol: 'none'
                        }],
                        [{
                            coord: [0, yAll],
                            symbol: 'none'
                        }, {
                            coord: [30, yAll],
                            symbol: 'none'
                        }],
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
                                    offset: 0,
                                    color: '#a5efb6' // 0% 处的颜色
                                }, {
                                    offset: 1,
                                    color: '#28a745' // 100% 处的颜色
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
                data: yDataSortC
            },
        ]
    };

    if (option && typeof option === "object") {
        myChart.setOption(option, true)
    }

    // 前进运动函数
    function fwGantt() {

        timeChooseInputValueArray = timeChooseInput.value.split(' ')

        valueStart = timeChooseInputValueArray[0] ? new Date(timeChooseInputValueArray[0]) : startDate
        valueFinish = timeChooseInputValueArray[2] ? new Date(timeChooseInputValueArray[2]) : finishDate

        //甘特图部分
        g = g + 1
        //  开始运动
        var runDate = new Date((valueStart / 1000 + speed * g) * 1000)
        project.setTimeLines([{
                date: valueFinish,
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
        project.scrollToDate(runDate)

        //echarts部分
        e = e + 1
        var sortMore = []
        var moreA = Math.ceil((Math.random() * 1000) * 21 - 18) //生成一个新折线图数据节点
        var moreB = Math.ceil((Math.random() * 1000) * 21 - 18) //生成一个新折线图数据节点
        var moreC = Math.ceil((Math.random() * 1000) * 21 - 18) //生成一个新折线图数据节点

        var moreSortA = yDataSort[yDataSort.length - 1] + moreA //继续求和
        var moreSortB = yDataSortB[yDataSortB.length - 1] + moreB //继续求和
        var moreSortC = yDataSortC[yDataSortC.length - 1] + moreC //继续求和
        var newDay = new Date(+beginDate + oneDay * (30 + e)) //生成一个月后新的一天
        var moreDay = [newDay.getFullYear(), newDay.getMonth() + 1, newDay.getDate()].join('-')

        yData.shift() //去掉折线图节点数字数组的第一个点
        yDataB.shift()
        yDataC.shift()
        yData.push(moreA) //把新的折线图数据节点加到折线图节点数字数组里去
        yDataB.push(moreB)
        yDataC.push(moreC)
        yDataSort.shift(); //去掉折线图节点数字和数组的第一个点
        yDataSort.push(moreSortA) //把新的和加到数组里去
        yDataSortB.shift() //去掉折线图节点数字和数组的第一个点
        yDataSortB.push(moreSortB) //把新的和加到数组里去
        yDataSortC.shift() //去掉折线图节点数字和数组的第一个点
        yDataSortC.push(moreSortC) //把新的和加到数组里去
        xCoord.shift() //去掉日期数组的第一个值
        xCoord.push(moreDay) //把新的日期加到数组里去

        sortMore = yDataSort.concat(yDataSortB, yDataSortC).sort(function(a, b) {
            return a - b
        })

        yAll = sortMore[sortMore.length - 1] //重新赋值和数组的最大值
        yCoord = Math.ceil(yAll * 1.15) //重新赋值纵坐标最大值

        option = {
            title: {
                text: '黑沙洲水道航道整治二期工程',
                left: 'center'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'line',
                },
            },
            legend: {
                right: '2%',
                top: '8%',
                data: ['BCWP', 'BCWS', 'ACWP']
            },
            xAxis: {
                type: 'category',
                name: '时间',
                boundaryGap: false,
                splitLine: {
                    show: false
                },
                data: xCoord,
            },
            yAxis: {
                type: 'value',
                name: '总金额',
                min: 0,
                max: yCoord,
                splitLine: {
                    show: false
                },
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            series: [{
                    name: 'BCWP',
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
                                    offset: 0,
                                    color: 'red' // 0% 处的颜色
                                }, {
                                    offset: 1,
                                    color: '#FFAF00' // 100% 处的颜色
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
                                        offset: 0,
                                        color: 'red' // 0% 处的颜色
                                    }, {
                                        offset: 1,
                                        color: '#FFAF00' // 100% 处的颜色
                                    }],
                                    globalCoord: false // 缺省为 false
                                },
                            }
                        },
                        data: [
                            [{
                                coord: [30, 0],
                                symbol: 'none'
                            }, {
                                coord: [30, yAll],
                                symbol: 'none'
                            }],
                            [{
                                coord: [0, yAll],
                                symbol: 'none'
                            }, {
                                coord: [30, yAll],
                                symbol: 'none'
                            }],
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
                                        offset: 0,
                                        color: 'red' // 0% 处的颜色
                                    }, {
                                        offset: 1,
                                        color: '#FFAF00' // 100% 处的颜色
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
                {
                    name: 'BCWS',
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
                                    offset: 0,
                                    color: '#97baf3' // 0% 处的颜色
                                }, {
                                    offset: 1,
                                    color: '#3fa7dc' // 100% 处的颜色
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
                                        offset: 0,
                                        color: '#97baf3' // 0% 处的颜色
                                    }, {
                                        offset: 1,
                                        color: '#3fa7dc' // 100% 处的颜色
                                    }],
                                    globalCoord: false // 缺省为 false
                                },
                            }
                        },
                        data: [
                            [{
                                coord: [30, 0],
                                symbol: 'none'
                            }, {
                                coord: [30, yAll],
                                symbol: 'none'
                            }],
                            [{
                                coord: [0, yAll],
                                symbol: 'none'
                            }, {
                                coord: [30, yAll],
                                symbol: 'none'
                            }],
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
                                        offset: 0,
                                        color: '#97baf3' // 0% 处的颜色
                                    }, {
                                        offset: 1,
                                        color: '#3fa7dc' // 100% 处的颜色
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
                    data: yDataSortB
                },
                {
                    name: 'ACWP',
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
                                    offset: 0,
                                    color: '#a5efb6' // 0% 处的颜色
                                }, {
                                    offset: 1,
                                    color: '#28a745' // 100% 处的颜色
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
                                        offset: 0,
                                        color: '#a5efb6' // 0% 处的颜色
                                    }, {
                                        offset: 1,
                                        color: '#28a745' // 100% 处的颜色
                                    }],
                                    globalCoord: false // 缺省为 false
                                },
                            }
                        },
                        data: [
                            [{
                                coord: [30, 0],
                                symbol: 'none'
                            }, {
                                coord: [30, yAll],
                                symbol: 'none'
                            }],
                            [{
                                coord: [0, yAll],
                                symbol: 'none'
                            }, {
                                coord: [30, yAll],
                                symbol: 'none'
                            }],
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
                                        offset: 0,
                                        color: '#a5efb6' // 0% 处的颜色
                                    }, {
                                        offset: 1,
                                        color: '#28a745' // 100% 处的颜色
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
                    data: yDataSortC
                }
            ]
        }

        if (option && typeof option === "object") {
            myChart.setOption(option, true)
        }


        if (runDate / 1000 >= valueFinish / 1000) {
            clearInterval(timer)
        }
    }

    // 后退运动函数
    function bkGantt() {

        timeChooseInputValueArray = timeChooseInput.value.split(' ')

        valueStart = timeChooseInputValueArray[0] ? new Date(timeChooseInputValueArray[0]) : startDate
        valueFinish = timeChooseInputValueArray[2] ? new Date(timeChooseInputValueArray[2]) : finishDate

        //甘特图部分
        g = g - 1
        //  开始运动
        var runDate = new Date((valueStart / 1000 + speed * g) * 1000)
        project.setTimeLines([{
                date: valueFinish,
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
        project.scrollToDate(runDate)



        if (runDate / 1000 <= valueStart / 1000) {
            clearInterval(timer)
        }
    }

    /**
        运动计时器函数
        开始函数
    **/
    function startGantt() {
        clearInterval(timer)
        timer = setInterval(fwGantt, time)
    }

    // 停止函数
    function pauseGantt() {
        clearInterval(timer)
    }

    // 快退按钮事件
    fBackBtn.onclick = function() {
        clearInterval(timer)
        timer = setInterval(bkGantt, time / 2)
    }

    // 后退按钮事件
    backBtn.onclick = function() {
        clearInterval(timer)
        timer = setInterval(bkGantt, time)
    }

    // 开始按钮事件
    beginBtn.onclick = function() {
        startGantt()
    }

    // 暂停按钮事件
    pauseBtn.onclick = function() {
        pauseGantt()
    }

    // 停止按钮事件
    stopBtn.onclick = function() {
        clearInterval(timer)
        g = 0

        project.setTimeLines([{
            date: startDate,
            text: ' ',
            position: runPos,
            style: "width:" + tdyW + "px;background:transparent;"
        }])
    }

    // 前进按钮事件
    // forwardBtn.onclick = function() {
    //
    // }

    // 快进按钮事件
    fForwardBtn.onclick = function() {
        clearInterval(timer)
        timer = setInterval(fwGantt, time / 2)
    }

    // 查看今天事件
    todayBtn.onclick = function() {
        let today = new Date()

        todayText = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()

        project.setTimeLines([{
            date: today,
            text: todayText,
            position: runPos,
            style: "width:" + tdyW + "px;background:" + tdyColor + ";"
        }])
        project.scrollToDate(today)
    }
}

runGantt()
