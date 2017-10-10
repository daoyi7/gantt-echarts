/**
    -javascript runGantt.js
    -ECMAScript2016
    -write by kawhi
    -2017.09.27

**/


const log = console.log.bind(console)

/**
    绑定所有按钮
**/
const BTN = document.querySelectorAll(".btn") // 所有按钮
const fBackBtn = document.querySelector("#fBackBtn") //快退
const backBtn = document.querySelector("#backBtn") //后退
const beginBtn = document.querySelector("#beginBtn") //开始按钮
const pauseBtn = document.querySelector("#pauseBtn") //暂停
const stopBtn = document.querySelector("#stopBtn") //停止
//const forwardBtn = document.querySelector("#forwardBtn") //前进
const fForwardBtn = document.querySelector("#fForwardBtn") //快进
const initBtn = document.querySelector("#initBtn") //查看今天
const timeChooseInput = document.querySelector("#timeChooseInput") // 日期选择框

/**
    初始化运动值
    &&
    timer为关闭定时器做准备
**/
let g = 0
let timer = null


/**
    get方法从接口获取数据
    并用JSON.parse（）转成JSON
**/
const data = $.ajax({
    type: 'GET',
    url: 'http://10.20.0.118:8042/getDailyCost.php',
    async: false,
})
const dataEchart = JSON.parse(data.responseText)
const LEN = dataEchart.data.length // 所有数据的长度
let dataTime = [] // 初始化日期数组

/**
    填充日期数组
**/
for (var i = 0; i < LEN; i++) {
    dataTime.push(dataEchart.data[i].SGRQ)
}
dataTime = dataTime.sort()

// 选取日期数组中第一个日期为甘特图运动的起始时间服务
const timeFir = new Date(dataTime[0])

/**
    定义甘特图始末日期
**/
const startDateGantt = '2016-12-09T08:00:00'
const FinishDateGantt = '2017-12-02T17:00:00'

/**
    计算开始日期并转成中国标准时间
**/
const startDateFN = new Date(startDateGantt)
const startDate = new Date(startDateFN - ((startDateFN.getHours() * 60 * 60 * 1000) + (startDateFN.getMinutes() * 60 * 1000) + (startDateFN.getSeconds() * 1000)))
const finishDateFN = new Date(FinishDateGantt)
const finishDate = new Date(finishDateFN - ((finishDateFN.getHours() * 60 * 60 * 1000) + (finishDateFN.getMinutes() * 60 * 1000) + (finishDateFN.getSeconds() * 1000)))

/**
    开始日期是所给日期的前一个月，x轴原点为前一个月
**/
const oneDay = 24 * 60 * 60 * 1000 //一天的毫秒数
const oneMonth = 31 //一月的天数
let beginDate = new Date(+startDate - oneDay * 31) //由数据库里的开始日期往前推一个月，为静止状态的x轴所用
let pauseDate = null // 暂停时间 为后面暂停运动服务
let pauseDateText // 初始化暂停时间的字符串形式
let valueStart // 日期选择框时间字符串，可能是默认时间（placehoder）可能是认为选择时间（value）

/**
    初始化每天金额的数组
    提前定义每个折线的数组是 31 个 0
    为了看起来是数值从零开始
**/
let yBCWP = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] //提前定义折线图节点数组
let yBCWS = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] //提前定义折线图节点数组
let yACWP = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] //提前定义折线图节点数组
let yAllBCWP = [0]
let yAllBCWS = [0]
let yAllACWP = [0]

/**
    从接口取出三条线对应的数据
**/
for (let i = 0; i < LEN; i++) {
    yBCWP.push(dataEchart.data[i].BCWP)
    yBCWS.push(dataEchart.data[i].BCWS)
    yACWP.push(dataEchart.data[i].ACWP)
}

/**
    分别求三条折线各自的总和
**/
yAllBCWP = yBCWP.reduce(function(a, b) {
    var c = a.length === 0 ? 0 : a[a.length - 1];
    a.push(parseInt(c) + parseInt(b))

    return a
}, [])

yAllBCWS = yBCWS.reduce(function(a, b) {
    var c = a.length === 0 ? 0 : a[a.length - 1];
    a.push(parseInt(c) + parseInt(b))

    return a
}, [])

yAllACWP = yACWP.reduce(function(a, b) {
    var c = a.length === 0 ? 0 : a[a.length - 1];
    a.push(parseInt(c) + parseInt(b))

    return a
}, [])
/**
    求和完毕
**/


/**
    实例化Ehcart DOM节点
**/
const dom = document.getElementById("container")
dom.style.width = "100%"
dom.style.height = "250px"

/**
    Ehcart自适应窗口
    每当窗口大小变化的时候Echart都会重绘
    每当Echart中数值有变化也会重绘
**/
const myChart = echarts.init(dom)
const app = {}
option = null
window.addEventListener("resize", function() {
    myChart.resize()
})


let xCoord = [], //横坐标
    vxCoord = [],
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
    dayTime = 86400, //一天的事件（秒数）
    speed = dayTime, //定义运动竖线按什么速度走（一天或者一小时）
    time = 1000; // 定时器间隔时间

/**
    横坐标日期集合
**/
for (var i = 0; i < 31; i++) {
    var now = new Date(+beginDate + oneDay * i); //开始日期加i天
    var xItem = [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('-'); //取日期节点坐横坐标
    xCoord.push(xItem);
}

/**
    绘制Echart方法封装
**/
function drawEchart(x, y1, y2, y3) {
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
            data: ['已完工作预算费用', '计划工作预算费用', '已完成工作实际费用']
        },
        xAxis: {
            type: 'category',
            name: '日期',
            boundaryGap: false,
            splitLine: {
                show: false
            },
            data: x,
        },
        yAxis: {
            type: 'value',
            name: '总金额（元）',
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
                name: '已完工作预算费用',
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
                            coord: [x.length - 1, 0],
                            symbol: 'none'
                        }, {
                            coord: [x.length - 1, y1[x.length - 1]],
                            symbol: 'none'
                        }],
                        [{
                            coord: [0, y1[x.length - 1]],
                            symbol: 'none'
                        }, {
                            coord: [x.length - 1, y1[x.length - 1]],
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
                        coord: [x.length - 1, y1[x.length - 1]]
                    }]
                },
                data: y1
            },
            {
                name: '计划工作预算费用',
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
                            coord: [x.length - 1, 0],
                            symbol: 'none'
                        }, {
                            coord: [x.length - 1, y2[x.length - 1]],
                            symbol: 'none'
                        }],
                        [{
                            coord: [0, y2[x.length - 1]],
                            symbol: 'none'
                        }, {
                            coord: [x.length - 1, y2[x.length - 1]],
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
                        coord: [x.length - 1, y2[x.length - 1]]
                    }]
                },
                data: y2
            },
            {
                name: '已完成工作实际费用',
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
                            coord: [x.length - 1, 0],
                            symbol: 'none'
                        }, {
                            coord: [x.length - 1, y3[x.length - 1]],
                            symbol: 'none'
                        }],
                        [{
                            coord: [0, y3[x.length - 1]],
                            symbol: 'none'
                        }, {
                            coord: [x.length - 1, y3[x.length - 1]],
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
                        coord: [x.length - 1, y3[x.length - 1]]
                    }]
                },
                data: y3
            },
        ]
    };

    if (option && typeof option === "object") {
        myChart.setOption(option, true)
    }
}
/**
    绘制完毕
**/

/**
    日期转YY-MM-DD
**/
function DateToYMD(dateSTD) {
    let dateSTDText

    if ((dateSTD.getMonth() + 1) < 10 && (dateSTD.getDate()) >= 10) {
        dateSTDText = dateSTD.getFullYear() + '-0' + (dateSTD.getMonth() + 1) + '-' + dateSTD.getDate()
    }
    if ((dateSTD.getMonth() + 1) < 10 && (dateSTD.getDate()) < 10) {
        dateSTDText = dateSTD.getFullYear() + '-0' + (dateSTD.getMonth() + 1) + '-0' + dateSTD.getDate()
    }
    if ((dateSTD.getMonth() + 1) >= 10 && (dateSTD.getDate()) < 10) {
        dateSTDText = dateSTD.getFullYear() + '-' + (dateSTD.getMonth() + 1) + '-0' + dateSTD.getDate()
    }
    if ((dateSTD.getMonth() + 1) >= 10 && (dateSTD.getDate()) >= 10) {
        dateSTDText = dateSTD.getFullYear() + '-' + (dateSTD.getMonth() + 1) + '-' + dateSTD.getDate()
    }

    return dateSTDText
}
/**
    日期转YY-MM-DD完毕
**/

/**
    提前画静态初始化Echart
**/
drawEchart(xCoord, yAllBCWP, yAllBCWS, yAllACWP)
/**
    绘制完毕
**/


/**
    前进运动函数
**/
function fwGantt() {

    //甘特图部分
    g++

    // 每次运动自身加一天 为后面暂停重启动服务
    pauseDate = new Date(+pauseDate + oneDay)

    // 滑动小块的日期文字
    dragTips.innerText = DateToYMD(pauseDate)

    // 运动过程中当前日期所占总日期长度的百分比
    let dtPercent = (pauseDate.getTime() - valueStart.getTime()) / (valueFinish.getTime() - valueStart.getTime())

    // 滑动小块运动  左边距left = 滑动横线的总长度乘百分比
    dragBtn.style.left = dragLine.offsetWidth * dtPercent + 'px'

    //  甘特图开始运动 以speed的速度
    let runDate = new Date((timeFir / 1000 + speed * g) * 1000)

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
    let yAllBCWPCrd = yAllBCWP.slice(g, g + oneMonth)
    let yAllBCWSCrd = yAllBCWS.slice(g, g + oneMonth)
    let yAllACWPCrd = yAllACWP.slice(g, g + oneMonth)

    var moreDay = [pauseDate.getFullYear(), pauseDate.getMonth() + 1, pauseDate.getDate()].join('-')

    vxCoord.shift() //去掉日期数组的第一个值
    vxCoord.push(moreDay) //把新的日期加到数组里去

    drawEchart(vxCoord, yAllBCWPCrd, yAllBCWSCrd, yAllACWPCrd)

    if (runDate / 1000 >= valueFinish / 1000) {
        clearInterval(timer)

        pauseDate = null

        // 按钮回复初始状态
        stopBtn.className += " forbd"
        fBackBtn.className += " forbd"
        backBtn.className += " forbd"
        pauseBtn.className += " forbd"
        fForwardBtn.className += " forbd"
        beginBtn.classList.remove("forbd")

        beginBtn.setAttribute('disabled', 'disabled')
        stopBtn.removeAttribute('disabled')
        fBackBtn.removeAttribute('disabled')
        backBtn.removeAttribute('disabled')
        pauseBtn.removeAttribute('disabled')
        fForwardBtn.removeAttribute('disabled')

        // 甘特图标线消失
        project.setTimeLines([{
            date: startDate,
            text: ' ',
            position: runPos,
            style: "width:" + tdyW + "px;background:transparent;"
        }])

        // 滑动小块到最右
        dragBtn.style.left = '100%'
    }
}
/**
    前进运动函数完毕
**/


/**
    后退运动函数
**/
function bkGantt() {

    // 清空横坐标
    vxCoord = []

    // 日期选择框有选择的时候的时间字符串数组
    let timeChooseInputValueArray = timeChooseInput.value.split(' ')
    // 默认时间字符串数组
    let timeChooseInputPlaceholderArray = timeChooseInput.placeholder.split(' ')

    // 判断横坐标运动开始时间和结束时间
    valueStart = timeChooseInputValueArray[0] ? new Date(timeChooseInputValueArray[0]) : new Date(timeChooseInputPlaceholderArray[0])
    valueFinish = timeChooseInputValueArray[2] ? new Date(timeChooseInputValueArray[2]) : new Date(timeChooseInputPlaceholderArray[2])

    /*
        计算横坐标最大值
        如果puaseDate是空就把上面开始运动时间赋给它
        否则就是自己
    */
    pauseDate = pauseDate == null ? valueStart : pauseDate

    //甘特图部分
    g--

    // 每次运动自身减掉一天
    pauseDate = new Date(+pauseDate - oneDay)

    // 滑动小块的日期文字
    dragTips.innerText = DateToYMD(pauseDate)

    // 运动过程中当前日期所占总日期长度的百分比
    let dtPercent = (pauseDate.getTime() - valueStart.getTime()) / (valueFinish.getTime() - valueStart.getTime())

    // 滑动小块运动  左边距left = 滑动横线的总长度乘百分比
    dragBtn.style.left = dragLine.offsetWidth * dtPercent + 'px'

    //  开始运动
    var runDate = new Date((timeFir / 1000 + speed * g) * 1000)
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
    let yAllBCWPCrd = yAllBCWP.slice(g, g + oneMonth)
    let yAllBCWSCrd = yAllBCWS.slice(g, g + oneMonth)
    let yAllACWPCrd = yAllACWP.slice(g, g + oneMonth)

    var moreDay = [pauseDate.getFullYear(), pauseDate.getMonth() + 1, pauseDate.getDate()].join('-')

    xCoord.shift() //去掉日期数组的第一个值
    xCoord.push(moreDay) //把新的日期加到数组里去

    drawEchart(xCoord, yAllBCWPCrd, yAllBCWSCrd, yAllACWPCrd)

    if (runDate / 1000 <= valueStart / 1000) {
        clearInterval(timer)

        pauseDate = null

        // 按钮回复初始状态
        stopBtn.className += " forbd"
        fBackBtn.className += " forbd"
        backBtn.className += " forbd"
        pauseBtn.className += " forbd"
        fForwardBtn.className += " forbd"
        beginBtn.classList.remove("forbd")

        // 甘特图标线消失
        project.setTimeLines([{
            date: startDate,
            text: ' ',
            position: runPos,
            style: "width:" + tdyW + "px;background:transparent;"
        }])
    }
}
/**
    后退运动函数完毕
**/


/**
    运动计时器函数
    开始函数
**/
function startGantt() {
    clearInterval(timer)
    timer = setInterval(fwGantt, time)
}
/**
    运动计时器函数
    开始函数
    完毕
**/


/**
    停止函数
**/
function pauseGantt() {
    clearInterval(timer)
}
/**
    停止函数完毕
**/


/**
    开始按钮点击事件
**/
function beginBtnFn() {

    // 清空横坐标
    vxCoord = []

    // 日期选择框有选择的时候的时间字符串数组
    let timeChooseInputValueArray = timeChooseInput.value.split(' ')
    // 默认时间字符串数组
    let timeChooseInputPlaceholderArray = timeChooseInput.placeholder.split(' ')

    // 判断横坐标运动开始时间和结束时间
    valueStart = timeChooseInputValueArray[0] ? new Date(timeChooseInputValueArray[0]) : new Date(timeChooseInputPlaceholderArray[0])
    valueFinish = timeChooseInputValueArray[2] ? new Date(timeChooseInputValueArray[2]) : new Date(timeChooseInputPlaceholderArray[2])

    /*
        计算横坐标最大值
        如果puaseDate是空就把上面开始运动时间赋给它
        否则就是自己
    */
    pauseDate = pauseDate == null ? valueStart : pauseDate

    // 查找起始日期在日期数组的序数index
    let dataIdx = dataTime.indexOf(DateToYMD(pauseDate))

    g = dataIdx

    for (var i = 0; i < 31; i++) {
        var valueNow = new Date(+pauseDate - oneDay * i); //开始日期加i天
        var xItem = [valueNow.getFullYear(), valueNow.getMonth() + 1, valueNow.getDate()].join('-'); //取日期节点坐横坐标
        vxCoord.push(xItem);
    }

    // 颠倒日期数组
    vxCoord = vxCoord.reverse()

    startGantt()
}
/**
    开始按钮点击事件完毕
**/


/**
    停止按钮点击事件
**/
function stopBtnFn() {

    clearInterval(timer)

    // 回复状态
    g = 0
    pauseDate = null

    // 甘特图标记线初始化
    project.setTimeLines([{
        date: startDate,
        text: ' ',
        position: runPos,
        style: "width:" + tdyW + "px;background:transparent;"
    }])

    // Echart初始化
    drawEchart(xCoord, yAllBCWP, yAllBCWS, yAllACWP)

    // 按钮状态设置
    fBackBtn.className += " forbd"
    backBtn.className += " forbd"
    beginBtn.classList.remove("forbd")
    pauseBtn.className += " forbd"
    stopBtn.className += " forbd"
    fForwardBtn.className += " forbd"

    fBackBtn.setAttribute('disabled', 'disabled')
    backBtn.setAttribute('disabled', 'disabled')
    pauseBtn.setAttribute('disabled', 'disabled')
    stopBtn.setAttribute('disabled', 'disabled')
    fForwardBtn.setAttribute('disabled', 'disabled')
    beginBtn.removeAttribute('disabled')

}
/**
    停止按钮点击事件完毕
**/


/**
    查看某天按钮点击事件
    为进度条事件所用
**/
function queryFn(dt) {
    stopBtnFn()

    // 查找今天在日期数组的序数index
    let dataIdx = dataTime.indexOf(DateToYMD(dt))

    // 根据序数返回相应的金额总和以及前一个月的总和 作为折线图
    const yTodayBCWP = yAllBCWP.slice(dataIdx + 1, dataIdx + 32)
    const yTodayBCWS = yAllBCWS.slice(dataIdx + 1, dataIdx + 32)
    const yTodayACWP = yAllACWP.slice(dataIdx + 1, dataIdx + 32)

    // 根据序数返回相应的日期和前一个月的日期 作为横坐标
    const xTodayCoord = dataTime.slice(dataIdx - 30, dataIdx + 1)

    // 画甘特图的标记线到今天
    project.setTimeLines([{
        date: dt,
        text: DateToYMD(dt),
        position: runPos,
        style: "width:" + tdyW + "px;background:" + tdyColor + ";"
    }])
    project.scrollToDate(dt)

    // 画Echart
    drawEchart(xTodayCoord, yTodayBCWP, yTodayBCWS, yTodayACWP)
}
/**
    查看某天按钮点击事件完毕
**/


/**
    快退按钮事件
**/
fBackBtn.onclick = function() {
    // 禁止自己并且解禁播放
    this.className += " forbd"
    beginBtn.classList.remove("forbd")
    backBtn.classList.remove("forbd")
    pauseBtn.classList.remove("forbd")
    stopBtn.classList.remove("forbd")
    fForwardBtn.classList.remove("forbd")

    this.setAttribute('disabled', 'disabled')
    beginBtn.removeAttribute('disabled')
    backBtn.removeAttribute('disabled')
    pauseBtn.removeAttribute('disabled')
    stopBtn.removeAttribute('disabled')
    fForwardBtn.removeAttribute('disabled')

    clearInterval(timer)
    timer = setInterval(bkGantt, time / 2)
}
/**
    快退按钮事件完毕
**/


/**
    后退按钮事件
**/
backBtn.onclick = function() {
    // 禁止自己并且解禁播放
    this.className += " forbd"
    beginBtn.classList.remove("forbd")
    fBackBtn.classList.remove("forbd")
    pauseBtn.classList.remove("forbd")
    stopBtn.classList.remove("forbd")
    fForwardBtn.classList.remove("forbd")

    this.setAttribute('disabled', 'disabled')
    beginBtn.removeAttribute('disabled')
    fBackBtn.removeAttribute('disabled')
    pauseBtn.removeAttribute('disabled')
    stopBtn.removeAttribute('disabled')
    fForwardBtn.removeAttribute('disabled')

    clearInterval(timer)
    timer = setInterval(bkGantt, time)
}
/**
    后退按钮事件完毕
**/


/**
    播放按钮事件
**/
beginBtn.onclick = function() {
    // 解禁其他按钮
    fBackBtn.classList.remove("forbd")
    backBtn.classList.remove("forbd")
    pauseBtn.classList.remove("forbd")
    stopBtn.classList.remove("forbd")
    fForwardBtn.classList.remove("forbd")

    // 禁止播放按钮
    this.className += " forbd"

    this.setAttribute('disabled', 'disabled')
    fBackBtn.removeAttribute('disabled')
    backBtn.removeAttribute('disabled')
    pauseBtn.removeAttribute('disabled')
    stopBtn.removeAttribute('disabled')
    fForwardBtn.removeAttribute('disabled')

    beginBtnFn()
}
/**
    播放按钮事件完毕
**/


/**
    暂停按钮事件
**/
pauseBtn.onclick = function() {
    this.className += " forbd"
    beginBtn.classList.remove("forbd")
    fBackBtn.classList.remove("forbd")
    backBtn.classList.remove("forbd")
    stopBtn.classList.remove("forbd")
    fForwardBtn.classList.remove("forbd")

    this.setAttribute('disabled', 'disabled')
    beginBtn.removeAttribute('disabled')
    fBackBtn.removeAttribute('disabled')
    backBtn.removeAttribute('disabled')
    stopBtn.removeAttribute('disabled')
    fForwardBtn.removeAttribute('disabled')

    pauseGantt()
}
/**
    暂停按钮事件完毕
**/


/**
    停止按钮事件
**/
stopBtn.onclick = function() {
    stopBtnFn()

    // 滑动小块初始化
    dragBtn.style.left = 0 + 'px'
    dragTips.innerText = ' '
}
/**
    完停止按钮事件毕
**/


/**
    快进按钮事件
**/
fForwardBtn.onclick = function() {
    // 禁止自己并且解禁其他播放
    this.className += " forbd"
    fBackBtn.classList.remove("forbd")
    backBtn.classList.remove("forbd")
    beginBtn.classList.remove("forbd")
    pauseBtn.classList.remove("forbd")
    stopBtn.classList.remove("forbd")

    fForwardBtn.setAttribute('disabled', 'disabled')
    fBackBtn.removeAttribute('disabled')
    backBtn.removeAttribute('disabled')
    beginBtn.removeAttribute('disabled')
    pauseBtn.removeAttribute('disabled')
    stopBtn.removeAttribute('disabled')

    clearInterval(timer)
    timer = setInterval(fwGantt, time / 2)
}
/**
    快进按钮事件完毕
**/


/**
    初始化按钮
**/
initBtn.onclick = function() {
    stopBtnFn()

    // 滑动小块初始化
    dragBtn.style.left = 0 + 'px'
    dragTips.innerText = ' '
}
/**
    初始化按钮事件完毕
**/


/**
    禁止按钮事件
**/
for (let i = 0; i < BTN.length; i++) {
    if (BTN[i].classList.contains("forbd")) {
        // log(BTN[i].getAttribute('id'))
        BTN[i].setAttribute('disabled', 'disabled')
    }
}
/**
    禁止按钮事件完毕
**/
