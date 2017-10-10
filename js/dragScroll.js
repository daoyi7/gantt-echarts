const dragLine = document.getElementById('dragLine'); //长线条
const dragBtn = document.getElementById('dragBtn'); //小方块
const msg = document.getElementById("msg");
const dragTips = document.getElementById("dragTips");
let is_down = false; //判断鼠标是否按下
let dragPercent // 拖动百分比
let dragIdx // 拖动百分比在日期数组的位置
let finishDateText // 项目截止日期转成文字
let dragDataTime = []// 定义新的日期数组专为滑动所用 防止滑块拖出边界

//获取元素的绝对位置方法封装
function getPosition(point) {
    let left = point.offsetLeft; //获取元素相对于其父元素的left值var left
    let top = point.offsetTop;
    current = point.offsetParent; // 取得元素的offsetParent
    　　
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

        // 日期选择框有选择的时候的时间字符串数组
        let timeChooseInputValueArray = timeChooseInput.value.split(' ')
        // 默认时间字符串数组
        let timeChooseInputPlaceholderArray = timeChooseInput.placeholder.split(' ')

        // 判断横坐标运动开始时间和结束时间
        valueStart = timeChooseInputValueArray[0] ? new Date(timeChooseInputValueArray[0]) : new Date(timeChooseInputPlaceholderArray[0])
        valueFinish = timeChooseInputValueArray[2] ? new Date(timeChooseInputValueArray[2]) : new Date(timeChooseInputPlaceholderArray[2])

        // 输入框始末日期位于数据库日期数组的位置index
        let startIdx = dataTime.indexOf(DateToYMD(valueStart))
        let finishIdx = dataTime.indexOf(DateToYMD(valueFinish))

        // 截取新的日期数组
        dragDataTime = dataTime.slice(startIdx, finishIdx + 1)

        // 获取拖动的百分比 取三位小树
        dragPercent = (btnLeft / (dragLine.offsetWidth - 8)).toFixed(3)
        // 根据百分比查找在日期数组的位置
        dragIdx = parseInt(dragPercent * dragDataTime.length)

        /**
            如果百分比是一的话 就让线到终点
            如果不是一的话 按正常百分比运动
        **/
        if (dragPercent == 1) {
            // 滑动小块提示文字
            dragTips.innerText = dragDataTime[dragDataTime.length - 1]

            // 日期标准时间
            let dragDate = new Date(dragDataTime[dragDataTime.length - 1])

            // 根据日期标准时间执行查询事件
            queryFn(dragDate)

        } else {
            // 滑动小块提示文字
            dragTips.innerText = dragDataTime[dragIdx]

            // 日期标准时间
            let dragDate = new Date(dragDataTime[dragIdx])

            // 根据日期标准时间执行查询事件
            queryFn(dragDate)

        }
    }
    /**
        判断完毕
    **/

    is_down = false;
})
