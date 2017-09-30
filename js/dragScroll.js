const dragLine = document.getElementById('dragLine'); //长线条
const dragBtn = document.getElementById('dragBtn'); //小方块
const msg = document.getElementById("msg");
const dragTips = document.getElementById("dragTips");
let is_down = false; //判断鼠标是否按下
let dragPercent // 拖动百分比
let dragIdx // 拖动百分比在日期数组的位置
let finishDateText // 项目截止日期转成文字
let realDataTime = [] // 真实项目日期数组
let ysrlBCWP = []
let ysrlBCWS = []
let ysrlACWP = []

let timeChooseInputValueArray = timeChooseInput.value.split(' ')
// 默认时间字符串数组
let timeChooseInputPlaceholderArray = timeChooseInput.placeholder.split(' ')

// 判断横坐标运动开始时间和结束时间
valueStart = timeChooseInputValueArray[0] ? new Date(timeChooseInputValueArray[0]) : new Date(timeChooseInputPlaceholderArray[0])

dragTips.innerText = dataTime[0]

if ((finishDate.getMonth() + 1) < 10 && (finishDate.getDate()) > 10) {
    finishDateText = finishDate.getFullYear() + '-0' + (finishDate.getMonth() + 1) + '-' + finishDate.getDate()
}
if ((finishDate.getMonth() + 1) < 10 && (finishDate.getDate()) < 10) {
    finishDateText = finishDate.getFullYear() + '-0' + (finishDate.getMonth() + 1) + '-0' + finishDate.getDate()
}
if ((finishDate.getMonth() + 1) > 10 && (finishDate.getDate()) < 10) {
    finishDateText = finishDate.getFullYear() + '-' + (finishDate.getMonth() + 1) + '-0' + finishDate.getDate()
}
if ((finishDate.getMonth() + 1) > 10 && (finishDate.getDate()) > 10) {
    finishDateText = finishDate.getFullYear() + '-' + (finishDate.getMonth() + 1) + '-' + finishDate.getDate()
}

realDataTime = dataTime.slice(0, dataTime.indexOf(finishDateText) + 1)


//获取元素的绝对位置方法封装
function getPosition(node) {
    let left = node.offsetLeft; //获取元素相对于其父元素的left值var left
    let top = node.offsetTop;
    current = node.offsetParent; // 取得元素的offsetParent
    　　
    if (current != null) {　　
        left += current.offsetLeft;　　
        top += current.offsetTop;　　
        current = current.offsetParent;　　
    }

    return {
        "left": left,
        "top": top
    }
}

//鼠标按下方块
dragBtn.addEventListener("mousedown", function(e) {
    e.stopPropagation(); //防止冒泡

    is_down = true;
})

//拖动
window.addEventListener("mousemove", function(e) {
    if (is_down) {
        let x = e.pageX || e.clientX //鼠标横坐标var x
        let lineLeft = getPosition(dragLine).left; //长线条的横坐标
        let btnLeft = x - lineLeft //小方块相对于父元素（长线条）的left值

        if (btnLeft >= dragLine.offsetWidth - 8) {
            btnLeft = dragLine.offsetWidth - 8;
        }

        if (btnLeft < 0) {
            btnLeft = 0;
        }
        //设置拖动过程中 小块的left值
        dragBtn.style.left = btnLeft + "px";
    }
})

//鼠标松开
window.addEventListener("mouseup", function(e) {
    if (is_down) {
        let x = e.pageX || e.clientX //鼠标横坐标var x
        let lineLeft = getPosition(dragLine).left; //长线条的横坐标
        let btnLeft = x - lineLeft //小方块相对于父元素（长线条）的left值

        if (btnLeft >= dragLine.offsetWidth - 8) {
            btnLeft = dragLine.offsetWidth - 8;
        }

        if (btnLeft < 0) {
            btnLeft = 0;
        }
        //设置拖动过程中 小块的left值
        dragBtn.style.left = btnLeft + "px";

        // 获取拖动的百分比 取三位小树
        dragPercent = (btnLeft / (dragLine.offsetWidth - 8)).toFixed(3)
        // 根据百分比查找在日期数组的位置
        dragIdx = parseInt(dragPercent * realDataTime.length)

        /**
            如果百分比是一的话 就让线到终点
            如果不是一的话 按正常百分比运动
        **/
        if (dragPercent == 1) {
            // 甘特图部分
            dragTips.innerText = realDataTime[realDataTime.length - 1]

            let dragDate = new Date(realDataTime[realDataTime.length - 1])

            queryFn(dragDate)

        } else {
            // 甘特图部分
            dragTips.innerText = realDataTime[dragIdx]

            let dragDate = new Date(realDataTime[dragIdx])

            queryFn(dragDate)

        }
    }
    /**
        判断完毕
    **/

    is_down = false;
})
