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

// 甘特图画线函数
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
            // 画甘特图
            drawGanttArea(today, LWDate, '今天', '上一周')

            // 画Echart
            let todayIdx = dataTime.indexOf(DateToYMD(today))
            let LWDateIdx = dataTime.indexOf(DateToYMD(LWDate))
            areaCoord = dataTime.slice(LWDateIdx, todayIdx + 1)
            yareaBCWP = yAllBCWP.slice(LWDateIdx, todayIdx + 1)
            yareaBCWS = yAllBCWS.slice(LWDateIdx, todayIdx + 1)
            yareaACWP = yAllACWP.slice(LWDateIdx, todayIdx + 1)
            drawEchart(areaCoord, yareaBCWP, yareaBCWS, yareaACWP)

            // 改变日期框日期
            timeChooseInput.value = DateToYMD(LWDate) + ' - ' + DateToYMD(today)
            /**
                如果当前日期已经超过项目截止日期
                就按截止日期计算
            **/
            if(today.getTime() - finishDate.getTime() >= 0) {
                // 往前推算7天
                LWDate = new Date(finishDate.getTime() - oneDay * 7)

                drawGanttArea(finishDate, LWDate, '今天', '上一周')

                let finishDateIdx = dataTime.indexOf(DateToYMD(finishDate))
                let LWDateIdx = dataTime.indexOf(DateToYMD(LWDate))
                areaCoord = dataTime.slice(LWDateIdx, finishDateIdx + 1)
                yareaBCWP = yAllBCWP.slice(LWDateIdx, finishDateIdx + 1)
                yareaBCWS = yAllBCWS.slice(LWDateIdx, finishDateIdx + 1)
                yareaACWP = yAllACWP.slice(LWDateIdx, finishDateIdx + 1)
                drawEchart(areaCoord, yareaBCWP, yareaBCWS, yareaACWP)

                timeChooseInput.value = DateToYMD(LWDate) + ' - ' + DateToYMD(finishDate)
            }
            if(LWDate.getTime() - startDate.getTime() <= 0) {

                drawGanttArea(today, startDate, '今天', '上一周')

                let startDateIdx = dataTime.indexOf(DateToYMD(startDate))
                let todayIdx = dataTime.indexOf(DateToYMD(today))
                areaCoord = dataTime.slice(startDateIdx, todayIdx + 1)
                yareaBCWP = yAllBCWP.slice(startDateIdx, todayIdx + 1)
                yareaBCWS = yAllBCWS.slice(startDateIdx, todayIdx + 1)
                yareaACWP = yAllACWP.slice(startDateIdx, todayIdx + 1)
                drawEchart(areaCoord, yareaBCWP, yareaBCWS, yareaACWP)

                timeChooseInput.value = DateToYMD(startDate) + ' - ' + DateToYMD(today)
            }
        }

        // 下一周
        if(sltVal == 'nextWeek') {
            drawGanttArea(today, NWDate, '今天', '下一周')

            let todayIdx = dataTime.indexOf(DateToYMD(today))
            let NWDateIdx = dataTime.indexOf(DateToYMD(NWDate))
            areaCoord = dataTime.slice(todayIdx, NWDateIdx + 1)
            yareaBCWP = yAllBCWP.slice(todayIdx, NWDateIdx + 1)
            yareaBCWS = yAllBCWS.slice(todayIdx, NWDateIdx + 1)
            yareaACWP = yAllACWP.slice(todayIdx, NWDateIdx + 1)
            drawEchart(areaCoord, yareaBCWP, yareaBCWS, yareaACWP)

            timeChooseInput.value = DateToYMD(today) + ' - ' + DateToYMD(NWDate)
            /**
                如果当前日期的下一周已经超过项目截止日期
                那么下一周就按截止日期计算
            **/
            if(NWDate.getTime() - finishDate.getTime() >= 0) {

                drawGanttArea(today, finishDate, '今天', '下一周')

                let todayIdx = dataTime.indexOf(DateToYMD(today))
                let finishDateIdx = dataTime.indexOf(DateToYMD(finishDate))
                areaCoord = dataTime.slice(todayIdx, finishDateIdx + 1)
                yareaBCWP = yAllBCWP.slice(todayIdx, finishDateIdx + 1)
                yareaBCWS = yAllBCWS.slice(todayIdx, finishDateIdx + 1)
                yareaACWP = yAllACWP.slice(todayIdx, finishDateIdx + 1)
                drawEchart(areaCoord, yareaBCWP, yareaBCWS, yareaACWP)

                timeChooseInput.value = DateToYMD(today) + ' - ' + DateToYMD(finishDate)
            }
            if(today.getTime() - startDate.getTime() <= 0) {

                drawGanttArea(startDate, NWDate, '今天', '下一周')

                let startDateIdx = dataTime.indexOf(DateToYMD(startDate))
                let NWDateIdx = dataTime.indexOf(DateToYMD(NWDate))
                areaCoord = dataTime.slice(startDateIdx, NWDateIdx + 1)
                yareaBCWP = yAllBCWP.slice(startDateIdx, NWDateIdx + 1)
                yareaBCWS = yAllBCWS.slice(startDateIdx, NWDateIdx + 1)
                yareaACWP = yAllACWP.slice(startDateIdx, NWDateIdx + 1)
                drawEchart(areaCoord, yareaBCWP, yareaBCWS, yareaACWP)

                timeChooseInput.value = DateToYMD(startDate) + ' - ' + DateToYMD(NWDate)
            }
        }

        // 上一月
        if(sltVal == 'lastMonth') {
            drawGanttArea(today, LMDate, '今天', '上一月')

            let todayIdx = dataTime.indexOf(DateToYMD(today))
            let LMDateIdx = dataTime.indexOf(DateToYMD(LMDate))
            areaCoord = dataTime.slice(LMDateIdx, todayIdx + 1)
            yareaBCWP = yAllBCWP.slice(LMDateIdx, todayIdx + 1)
            yareaBCWS = yAllBCWS.slice(LMDateIdx, todayIdx + 1)
            yareaACWP = yAllACWP.slice(LMDateIdx, todayIdx + 1)
            drawEchart(areaCoord, yareaBCWP, yareaBCWS, yareaACWP)

            timeChooseInput.value = DateToYMD(LMDate) + ' - ' + DateToYMD(today)
            /**
                如果当前日期已经超过项目截止日期
                就按截止日期计算
            **/
            if(today.getTime() - finishDate.getTime() >= 0) {
                // 往前推算一月
                LMDate = new Date(finishDate.getTime() - oneDay * 31)

                drawGanttArea(finishDate, LMDate, '今天', '上一月')

                let finishDateIdx = dataTime.indexOf(DateToYMD(finishDate))
                let LMDateIdx = dataTime.indexOf(DateToYMD(LMDate))
                areaCoord = dataTime.slice(LMDateIdx, finishDate + 1)
                yareaBCWP = yAllBCWP.slice(LMDateIdx, finishDate + 1)
                yareaBCWS = yAllBCWS.slice(LMDateIdx, finishDate + 1)
                yareaACWP = yAllACWP.slice(LMDateIdx, finishDate + 1)
                drawEchart(areaCoord, yareaBCWP, yareaBCWS, yareaACWP)

                timeChooseInput.value = DateToYMD(LMDate) + ' - ' + DateToYMD(finishDate)
            }
            if(LMDate.getTime() - startDate.getTime() <= 0) {

                drawGanttArea(today, startDate, '今天', '上一月')

                let todayIdx = dataTime.indexOf(DateToYMD(today))
                let startDateIdx = dataTime.indexOf(DateToYMD(startDate))
                areaCoord = dataTime.slice(startDateIdx, todayIdx + 1)
                yareaBCWP = yAllBCWP.slice(startDateIdx, todayIdx + 1)
                yareaBCWS = yAllBCWS.slice(startDateIdx, todayIdx + 1)
                yareaACWP = yAllACWP.slice(startDateIdx, todayIdx + 1)
                drawEchart(areaCoord, yareaBCWP, yareaBCWS, yareaACWP)

                timeChooseInput.value = DateToYMD(startDate) + ' - ' + DateToYMD(today)
            }
        }

        // 下一月
        if(sltVal == 'nextMonth') {
            drawGanttArea(today, NMDate, '今天', '下一月')

            let todayIdx = dataTime.indexOf(DateToYMD(today))
            let NMDateIdx = dataTime.indexOf(DateToYMD(NMDate))
            areaCoord = dataTime.slice(todayIdx, NMDateIdx + 1)
            yareaBCWP = yAllBCWP.slice(todayIdx, NMDateIdx + 1)
            yareaBCWS = yAllBCWS.slice(todayIdx, NMDateIdx + 1)
            yareaACWP = yAllACWP.slice(todayIdx, NMDateIdx + 1)
            drawEchart(areaCoord, yareaBCWP, yareaBCWS, yareaACWP)

            timeChooseInput.value = DateToYMD(today) + ' - ' + DateToYMD(NMDate)
            /**
                如果当前日期的下一月已经超过项目截止日期
                那么下一月就按截止日期计算
            **/
            if(NMDate.getTime() - finishDate.getTime() >= 0) {

                drawGanttArea(today, finishDate, '今天', '下一月')

                let todayIdx = dataTime.indexOf(DateToYMD(today))
                let finishDateIdx = dataTime.indexOf(DateToYMD(finishDate))
                areaCoord = dataTime.slice(todayIdx, finishDateIdx + 1)
                yareaBCWP = yAllBCWP.slice(todayIdx, finishDateIdx + 1)
                yareaBCWS = yAllBCWS.slice(todayIdx, finishDateIdx + 1)
                yareaACWP = yAllACWP.slice(todayIdx, finishDateIdx + 1)
                drawEchart(areaCoord, yareaBCWP, yareaBCWS, yareaACWP)

                timeChooseInput.value = DateToYMD(today) + ' - ' + DateToYMD(finishDate)
            }
            if(today.getTime() - startDate.getTime() <= 0) {

                drawGanttArea(startDate, NMDate, '今天', '下一月')

                let startDateIdx = dataTime.indexOf(DateToYMD(startDate))
                let NMDateIdx = dataTime.indexOf(DateToYMD(NMDate))
                areaCoord = dataTime.slice(startDateIdx, NMDateIdx + 1)
                yareaBCWP = yAllBCWP.slice(startDateIdx, NMDateIdx + 1)
                yareaBCWS = yAllBCWS.slice(startDateIdx, NMDateIdx + 1)
                yareaACWP = yAllACWP.slice(startDateIdx, NMDateIdx + 1)
                drawEchart(areaCoord, yareaBCWP, yareaBCWS, yareaACWP)

                timeChooseInput.value = DateToYMD(startDate) + ' - ' + DateToYMD(NMDate)
            }
        }

        // 上一季度
        if(sltVal == 'lastQuarter') {
            drawGanttArea(today, LQDate, '今天', '上一季度')

            let todayIdx = dataTime.indexOf(DateToYMD(today))
            let LQDateIdx = dataTime.indexOf(DateToYMD(LQDate))
            areaCoord = dataTime.slice(LQDateIdx, todayIdx + 1)
            yareaBCWP = yAllBCWP.slice(LQDateIdx, todayIdx + 1)
            yareaBCWS = yAllBCWS.slice(LQDateIdx, todayIdx + 1)
            yareaACWP = yAllACWP.slice(LQDateIdx, todayIdx + 1)
            drawEchart(areaCoord, yareaBCWP, yareaBCWS, yareaACWP)

            timeChooseInput.value = DateToYMD(LQDate) + ' - ' + DateToYMD(today)
            /**
                如果当前日期已经超过项目截止日期
                就按截止日期计算
            **/
            if(today.getTime() - finishDate.getTime() >= 0) {
                // 往前推算一季度
                LQDate = new Date(finishDate.getTime() - oneDay * 31 * 3)

                drawGanttArea(finishDate, LQDate, '今天', '上一季度')

                let finishDateIdx = dataTime.indexOf(DateToYMD(finishDate))
                let LQDateIdx = dataTime.indexOf(DateToYMD(LQDate))
                areaCoord = dataTime.slice(LQDateIdx, finishDateIdx + 1)
                yareaBCWP = yAllBCWP.slice(LQDateIdx, finishDateIdx + 1)
                yareaBCWS = yAllBCWS.slice(LQDateIdx, finishDateIdx + 1)
                yareaACWP = yAllACWP.slice(LQDateIdx, finishDateIdx + 1)
                drawEchart(areaCoord, yareaBCWP, yareaBCWS, yareaACWP)

                timeChooseInput.value = DateToYMD(LQDate) + ' - ' + DateToYMD(finishDate)
            }
            if(LQDate.getTime() - startDate.getTime() <= 0) {

                drawGanttArea(today, startDate, '今天', '上一季度')

                let todayIdx = dataTime.indexOf(DateToYMD(today))
                let startDateIdx = dataTime.indexOf(DateToYMD(startDate))
                areaCoord = dataTime.slice(startDateIdx, todayIdx + 1)
                yareaBCWP = yAllBCWP.slice(startDateIdx, todayIdx + 1)
                yareaBCWS = yAllBCWS.slice(startDateIdx, todayIdx + 1)
                yareaACWP = yAllACWP.slice(startDateIdx, todayIdx + 1)
                drawEchart(areaCoord, yareaBCWP, yareaBCWS, yareaACWP)

                timeChooseInput.value = DateToYMD(startDate) + ' - ' + DateToYMD(today)
            }
        }

        // 下一季度
        if(sltVal == 'nextQuarter') {
            drawGanttArea(today, NQDate, '今天', '下一季度')

            let todayIdx = dataTime.indexOf(DateToYMD(today))
            let NQDateIdx = dataTime.indexOf(DateToYMD(NQDate))
            areaCoord = dataTime.slice(todayIdx, NQDateIdx + 1)
            yareaBCWP = yAllBCWP.slice(todayIdx, NQDateIdx + 1)
            yareaBCWS = yAllBCWS.slice(todayIdx, NQDateIdx + 1)
            yareaACWP = yAllACWP.slice(todayIdx, NQDateIdx + 1)
            drawEchart(areaCoord, yareaBCWP, yareaBCWS, yareaACWP)

            timeChooseInput.value = DateToYMD(today) + ' - ' + DateToYMD(NQDate)
            /**
                如果当前日期的下一季度已经超过项目截止日期
                那么下一季度就按截止日期计算
            **/
            if(NQDate.getTime() - finishDate.getTime() >= 0) {

                drawGanttArea(today, finishDate, '今天', '下一季度')

                let todayIdx = dataTime.indexOf(DateToYMD(today))
                let finishDateIdx = dataTime.indexOf(DateToYMD(finishDate))
                areaCoord = dataTime.slice(todayIdx, finishDateIdx + 1)
                yareaBCWP = yAllBCWP.slice(todayIdx, finishDateIdx + 1)
                yareaBCWS = yAllBCWS.slice(todayIdx, finishDateIdx + 1)
                yareaACWP = yAllACWP.slice(todayIdx, finishDateIdx + 1)
                drawEchart(areaCoord, yareaBCWP, yareaBCWS, yareaACWP)

                timeChooseInput.value = DateToYMD(today) + ' - ' + DateToYMD(finishDate)
            }
            if(today.getTime() - startDate.getTime() <= 0) {

                drawGanttArea(startDate, NQDate, '今天', '下一季度')

                let startDateIdx = dataTime.indexOf(DateToYMD(startDate))
                let NQDateIdx = dataTime.indexOf(DateToYMD(NQDate))
                areaCoord = dataTime.slice(startDateIdx, NQDateIdx + 1)
                yareaBCWP = yAllBCWP.slice(startDateIdx, NQDateIdx + 1)
                yareaBCWS = yAllBCWS.slice(startDateIdx, NQDateIdx + 1)
                yareaACWP = yAllACWP.slice(startDateIdx, NQDateIdx + 1)
                drawEchart(areaCoord, yareaBCWP, yareaBCWS, yareaACWP)

                timeChooseInput.value = DateToYMD(startDate) + ' - ' + DateToYMD(NQDate)
            }
        }

        // 上一年
        if(sltVal == 'lastYear') {
            drawGanttArea(today, LYDate, '今天', '上一年')

            let todayIdx = dataTime.indexOf(DateToYMD(today))
            let LYDateIdx = dataTime.indexOf(DateToYMD(LYDate))
            areaCoord = dataTime.slice(LYDateIdx, todayIdx + 1)
            yareaBCWP = yAllBCWP.slice(LYDateIdx, todayIdx + 1)
            yareaBCWS = yAllBCWS.slice(LYDateIdx, todayIdx + 1)
            yareaACWP = yAllACWP.slice(LYDateIdx, todayIdx + 1)
            drawEchart(areaCoord, yareaBCWP, yareaBCWS, yareaACWP)

            timeChooseInput.value = DateToYMD(LYDate) + ' - ' + DateToYMD(today)
            /**
                如果当前日期已经超过项目截止日期
                就按截止日期计算
            **/
            if(today.getTime() - finishDate.getTime() >= 0) {
                // 往前推算一年
                LYDate = new Date(finishDate.getTime() - oneDay * 365)

                drawGanttArea(finishDate, LYDate, '今天', '上一年')

                let finishDateIdx = dataTime.indexOf(DateToYMD(finishDate))
                let LYDateIdx = dataTime.indexOf(DateToYMD(LYDate))
                areaCoord = dataTime.slice(LYDateIdx, finishDate + 1)
                yareaBCWP = yAllBCWP.slice(LYDateIdx, finishDate + 1)
                yareaBCWS = yAllBCWS.slice(LYDateIdx, finishDate + 1)
                yareaACWP = yAllACWP.slice(LYDateIdx, finishDate + 1)
                drawEchart(areaCoord, yareaBCWP, yareaBCWS, yareaACWP)

                timeChooseInput.value = DateToYMD(LYDate) + ' - ' + DateToYMD(finishDate)
            }
            if(LYDate.getTime() - startDate.getTime() <= 0) {

                drawGanttArea(today, startDate, '今天', '上一年')

                let todayIdx = dataTime.indexOf(DateToYMD(today))
                let startDateIdx = dataTime.indexOf(DateToYMD(startDate))
                areaCoord = dataTime.slice(startDateIdx, todayIdx + 1)
                yareaBCWP = yAllBCWP.slice(startDateIdx, todayIdx + 1)
                yareaBCWS = yAllBCWS.slice(startDateIdx, todayIdx + 1)
                yareaACWP = yAllACWP.slice(startDateIdx, todayIdx + 1)
                drawEchart(areaCoord, yareaBCWP, yareaBCWS, yareaACWP)

                timeChooseInput.value = DateToYMD(startDate) + ' - ' + DateToYMD(today)
            }
        }

        // 下一年
        if(sltVal == 'nextYear') {
            drawGanttArea(today, NYDate, '今天', '下一年')

            let todayIdx = dataTime.indexOf(DateToYMD(today))
            let NYDateIdx = dataTime.indexOf(DateToYMD(NYDate))
            areaCoord = dataTime.slice(todayIdx, NYDateIdx + 1)
            yareaBCWP = yAllBCWP.slice(todayIdx, NYDateIdx + 1)
            yareaBCWS = yAllBCWS.slice(todayIdx, NYDateIdx + 1)
            yareaACWP = yAllACWP.slice(todayIdx, NYDateIdx + 1)
            drawEchart(areaCoord, yareaBCWP, yareaBCWS, yareaACWP)

            timeChooseInput.value = DateToYMD(today) + ' - ' + DateToYMD(NYDate)
            /**
                如果当前日期的下一季度已经超过项目截止日期
                那么下一季度就按截止日期计算
            **/
            if(NYDate.getTime() - finishDate.getTime() >= 0) {

                drawGanttArea(today, finishDate, '今天', '下一年')

                let todayIdx = dataTime.indexOf(DateToYMD(today))
                let finishDateIdx = dataTime.indexOf(DateToYMD(finishDate))
                areaCoord = dataTime.slice(todayIdx, finishDateIdx + 1)
                yareaBCWP = yAllBCWP.slice(todayIdx, finishDateIdx + 1)
                yareaBCWS = yAllBCWS.slice(todayIdx, finishDateIdx + 1)
                yareaACWP = yAllACWP.slice(todayIdx, finishDateIdx + 1)
                drawEchart(areaCoord, yareaBCWP, yareaBCWS, yareaACWP)

                timeChooseInput.value = DateToYMD(today) + ' - ' + DateToYMD(finishDate)
            }
            if(today.getTime() - startDate.getTime() <= 0) {

                drawGanttArea(startDate, NYDate, '今天', '下一年')

                let startDateIdx = dataTime.indexOf(DateToYMD(startDate))
                let NYDateIdx = dataTime.indexOf(DateToYMD(NYDate))
                areaCoord = dataTime.slice(startDateIdx, NYDateIdx + 1)
                yareaBCWP = yAllBCWP.slice(startDateIdx, NYDateIdx + 1)
                yareaBCWS = yAllBCWS.slice(startDateIdx, NYDateIdx + 1)
                yareaACWP = yAllACWP.slice(startDateIdx, NYDateIdx + 1)
                drawEchart(areaCoord, yareaBCWP, yareaBCWS, yareaACWP)

                timeChooseInput.value = DateToYMD(startDate) + ' - ' + DateToYMD(NYDate)
            }
        }
    })
})
