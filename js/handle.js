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
        console.log(data.value)
        return data.value
    })
})
