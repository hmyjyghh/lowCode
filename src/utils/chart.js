import $ from 'jquery'

function getSourceValue(column = [], item = {}) {
    let list = []
    column.forEach(obj => {
        Object.keys(item).forEach(o => {
            if (obj.showMetaColumn == o) {
                list.push(item[o])
            }
        })
    })
    return list
}

function dataSourceToTable(data) {
    let table = {
        title: [],
        data: []
    }

    if (data && data.showColumn && data.showColumn.length > 0) {
        data.showColumn.forEach(obj => {
            table.title.push(obj.showName)
        })
    }

    if (data && data.datas && data.datas.length > 0) {
        data.datas.forEach(obj => {
            table.data.push(getSourceValue(data.showColumn, obj))
        })
    }
    return table
}

function dataSourceToBarChart(dataSource) {
    let data = $.extend(true, {}, dataSource);
    let chart = {
        legend: [],
        names: [],
        values: []
    }

    if (data && data.showColumn && data.showColumn.length >= 3) {
        data.showColumn.forEach((obj, index) => {
            if (index > 0) {
                chart.legend.push(obj.showName)
            }

        })
    }

    if (data && data.datas && data.datas.length > 0) {
        let li = []
        data.datas.forEach(obj => {
            chart.names.push(obj[data.showColumn[0].showMetaColumn])
            let val = getSourceValue(data.showColumn, obj)
            val = val.splice(1)
            li.push(val)
        })

        let cloums = data.showColumn.splice(1)
        cloums.forEach((obj, index) => {
            let param = {
                name: obj.showName,
                value: []
            }
            li.forEach(item => {
                param.value.push(item[index])
            })
            chart.values.push(param)
        })
    }
    console.log(chart)
    return chart
}

function dataSourceToPieChart(dataSource) {
    let data = $.extend(true, {}, dataSource);
    let chart = {
        names: [],
        values: []
    }

    if (data && data.datas && data.datas.length > 0) {
        let li = []
        data.datas.forEach(obj => {
            chart.names.push(obj[Object.keys(obj)[0]])
            let p = {}
            p.name = obj[Object.keys(obj)[0]];
            p.value = obj[Object.keys(obj)[1]];
            chart.values.push(p)
        })
    }
    return chart
}

export default {
    dataSourceToPieChart,
    dataSourceToBarChart,
    dataSourceToTable
}