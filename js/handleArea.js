let today = new Date()
let LWDate = new Date(+today - oneDay * 7)
let NWDate = new Date(+today + oneDay * 7)
let LMDate = new Date(+today - oneDay * 31)
let NMDate = new Date(+today + oneDay * 31)
let LQDate = new Date(+today - oneDay * 31 * 3)
let NQDate = new Date(+today + oneDay * 31 * 3)
let LYDate = new Date(+today - oneDay * 365)
let NYDate = new Date(+today + oneDay * 365)
let areaCoord = []
let yareaBCWP = []
let yareaBCWS = []
let yareaACWP = []

let t1
let t2
let t3
let t4


// 甘特图画线函数 前面一天，后面一天，前面一天的日期文字，后面一天的日期文字
function drawGanttArea(BFDay, BHDay, BFDayText, BHDayText) {
    project.setTimeLines([{
            date: BFDay,
            text: BFDayText,
            position: 'bottom',
            style: "width:" + tdyW + "px;background:" + tdyColor + ";"
        },
        {
            date: BHDay,
            text: BHDayText,
            position: 'bottom',
            style: "width:" + tdyW + "px;background:" + tdyColor + ";"
        }
    ]);
    project.scrollToDate(BHDay)
}


// 日历函数
layui.use('laydate', function() {
    const laydate = layui.laydate;

    laydate.render({
        elem: '#timeChooseInput',
        range: true,
        theme: '#32ceff',
        min: '2016-12-09',
        max: '2017-12-03',
        done: function(value) {
            return value
        }
    })
})
layui.use('form', function() {
    const form = layui.form;

    form.on('select', function(data) {
        const sltVal = data.value

        // 上一周
        if(sltVal == 'lastWeek') {
            t1 = today
            t2 = LWDate
            t3 = '今天'
            t4 = '上一周'

            /**
                如果当前日期已经超过项目截止日期
                就按截止日期计算
            **/
            if(today.getTime() - finishDate.getTime() >= 0) {
                // 往前推算7天
                LWDate = new Date(finishDate.getTime() - oneDay * 7)

                t1 = finishDate
                t2 = LWDate
            }
            if(LWDate.getTime() - startDate.getTime() <= 0) {
                t1 = today
                t2 = startDate
            }
        }

        // 下一周
        if(sltVal == 'nextWeek') {
            t1 = NWDate
            t2 = today
            t3 = '下一周'
            t4 = '今天'

            /**
                如果当前日期的下一周已经超过项目截止日期
                那么下一周就按截止日期计算
            **/
            if(NWDate.getTime() - finishDate.getTime() >= 0) {

                t1 = finishDate
                t2 = today

            }
            if(today.getTime() - startDate.getTime() <= 0) {

                NWDate = new Date(startDate.getTime() + oneDay * 7)

                t1 = NWDate
                t2 = startDate
            }
        }

        // 上一月
        if(sltVal == 'lastMonth') {
            t1 = today
            t2 = LMDate
            t3 = '今天'
            t4 = '上一月'

            /**
                如果当前日期已经超过项目截止日期
                就按截止日期计算
            **/
            if(today.getTime() - finishDate.getTime() >= 0) {
                // 往前推算一月
                LMDate = new Date(finishDate.getTime() - oneDay * 31)

                t1 = finishDate
                t2 = LMDate
            }
            if(LMDate.getTime() - startDate.getTime() <= 0) {

                t1 = today
                t2 = startDate
            }
        }

        // 下一月
        if(sltVal == 'nextMonth') {
            t1 = NMDate
            t2 = today
            t3 = '下一月'
            t4 = '今天'

            /**
                如果当前日期的下一月已经超过项目截止日期
                那么下一月就按截止日期计算
            **/
            if(NMDate.getTime() - finishDate.getTime() >= 0) {

                t1 = finishDate
                t2 = today

            }
            if(today.getTime() - startDate.getTime() <= 0) {

                NMDate = new Date(startDate.getTime() + oneDay * 31)

                t1 = NMDate
                t2 = startDate

            }
        }

        // 上一季度
        if(sltVal == 'lastQuarter') {
            t1 = today
            t2 = LQDate
            t3 = '今天'
            t4 = '上一季度'

            /**
                如果当前日期已经超过项目截止日期
                就按截止日期计算
            **/
            if(today.getTime() - finishDate.getTime() >= 0) {
                // 往前推算一季度
                LQDate = new Date(finishDate.getTime() - oneDay * 31 * 3)

                t1 = finishDate
                t2 = LQDate

            }
            if(LQDate.getTime() - startDate.getTime() <= 0) {

                t1 = today
                t2 = startDate

            }
        }

        // 下一季度
        if(sltVal == 'nextQuarter') {
            t1 = NQDate
            t2 = today
            t3 = '下一季度'
            t4 = '今天'

            /**
                如果当前日期的下一季度已经超过项目截止日期
                那么下一季度就按截止日期计算
            **/
            if(NQDate.getTime() - finishDate.getTime() >= 0) {

                t1 = finishDate
                t2 = today

            }
            if(today.getTime() - startDate.getTime() <= 0) {

                NQDate = new Date(startDate.getTime() + oneDay * 31 * 3)

                t1 = NQDate
                t2 = startDate

            }
        }

        // 上一年
        if(sltVal == 'lastYear') {
            t1 = today
            t2 = LYDate
            t3 = '今天'
            t4 = '上一年'

            /**
                如果当前日期已经超过项目截止日期
                就按截止日期计算
            **/
            if(today.getTime() - finishDate.getTime() >= 0) {
                // 往前推算一年
                LYDate = new Date(finishDate.getTime() - oneDay * 365)

                t1 = finishDate
                t2 = LYDate

            }
            if(LYDate.getTime() - startDate.getTime() <= 0) {

                t1 = today
                t2 = startDate

            }
        }

        // 下一年
        if(sltVal == 'nextYear') {
            t1 = NYDate
            t2 = today
            t3 = '下一年'
            t4 = '今天'

            /**
                如果当前日期的下一季度已经超过项目截止日期
                那么下一季度就按截止日期计算
            **/
            if(NYDate.getTime() - finishDate.getTime() >= 0) {

                t1 = finishDate
                t2 = today

            }
            if(today.getTime() - startDate.getTime() <= 0) {

                NYDate = new Date(startDate.getTime() + oneDay * 365)

                t1 = NYDate
                t2 = startDate

            }
        }

        // 画甘特图
        drawGanttArea(t1, t2, t3, t4)

        // 画Echart
        let t1Idx = dataTime.indexOf(DateToYMD(t1))
        let t2Idx = dataTime.indexOf(DateToYMD(t2))
        areaCoord = dataTime.slice(t2Idx, t1Idx + 1)
        yareaBCWP = yAllBCWP.slice(t2Idx + 31, t1Idx + 31 + 1)
        yareaBCWS = yAllBCWS.slice(t2Idx + 31, t1Idx + 31 + 1)
        yareaACWP = yAllACWP.slice(t2Idx + 31, t1Idx + 31 + 1)
        drawEchart(areaCoord, yareaBCWP, yareaBCWS, yareaACWP)

        // 改变日期框日期
        timeChooseInput.value = DateToYMD(t2) + ' - ' + DateToYMD(t1)
    })
})
