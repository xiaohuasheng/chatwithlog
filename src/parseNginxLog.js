

// function parselog(logContent) {
//     const lines = logContent.split('\\n');
//     const result = [];
//     lines.forEach((line) => {
//         const lineArr = line.split(' ');
//         if (lineArr.length < 7) {
//             return;
//         }
//         let ip = lineArr[0];
//         let time = lineArr[3] + ' ' + lineArr[4];
//         let method = lineArr[5];
//         let path = lineArr[6];
//         let status = lineArr[8];
//         let requestTime = lineArr[lineArr.length - 1];
//         requestTime = parseFloat(requestTime.replace(/"/g, ''));
//         if (isNaN(requestTime)) {
//             return;
//         }
//         let resultObj = {
//             ip: {
//                 Type: 'string',
//                 Value: ip
//             },
//             time: {
//                 Type: 'string',
//                 Value: time
//             },
//             method: {
//                 Type: 'string',
//                 Value: method + ' ' + path
//             },
//             status: {
//                 Type: 'string',
//                 Value: status
//             },
//             // client: client,
//             requestTime: {
//                 Type: 'number',
//                 Value: requestTime
//             }
//         }
//         result.push(resultObj);
//     })
//     return result;
// }

// eslint-disable-next-line no-unused-vars
function convertDateToTimestamp(dateString) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dateParts = dateString.match(/\[(\d{2})\/(\w{3})\/(\d{4}):(\d{2}):(\d{2}):(\d{2}) (\+\d{4})\]/);
    if (!dateParts) {
        return null; // invalid date string
    }
    const monthIndex = months.indexOf(dateParts[2]);
    const date = new Date(Date.UTC(dateParts[3], monthIndex, dateParts[1], dateParts[4], dateParts[5], dateParts[6]));
    let timestamp = date.getTime() / 1000; // convert milliseconds to seconds
    timestamp = timestamp - 8 * 60 * 60; // convert UTC time to Beijing time
    return timestamp;
}


export function transformNginxData(data, showField) {
    // TODO 需要调一次接口确认时间戳是哪个字段
    if (data.length > 0) {
        if (showField === undefined) {
            showField = findFirstNumberProperty(data[0]);
        }
    }
    const labelMap = {}
    const labels = data.map(item => {
        if (item === undefined) {
            return
        }
        if (item.time === undefined) {
            return
        }
        const time = convertDateToTimestamp(item.time.Value)
        labelMap[`nginx-${time}`] = item
        return `nginx-${time}`
    });
    const datasets = Object.keys(data[0]).filter(key => key === showField).map(key => {
        const values = data.map(item => item[key].Value);
        return {
            label: key,
            type: 'line',
            stack: 'Total',
            data: values,
        };
    });
    return {
        labels,
        datasets,
        labelMap,
    };
}

export function transformMysqlData(data, showField) {
    // TODO 需要调一次接口确认时间戳是哪个字段
    if (data.length > 0) {
        if (showField === undefined) {
            showField = findFirstNumberProperty(data[0]);
        }
    }
    const labelMap = {}
    const labels = data.map(item => {
        if (item === undefined) {
            return
        }
        if (item.time === undefined) {
            return
        }
        // labelMap[`mysql-${item.timestamp.Value + 28800}`] = item
        labelMap[`mysql-${item.timestamp.Value}`] = item
        return `mysql-${item.timestamp.Value}`
    });
    const datasets = Object.keys(data[0]).filter(key => key === showField).map(key => {
        const values = data.map(item => item[key].Value);
        return {
            label: key,
            type: 'line',
            stack: 'Total',
            data: values
        };
    });
    return {
        labels,
        datasets,
        labelMap
    };
}

const transformDataMap = {
    nginx: transformNginxData,
    mysql: transformMysqlData,
}


function parselog(logContent){
    const lines=logContent.split('\n');
    const result=[];

    lines.forEach((line)=>{
        const lineArr=line.split(' ');
        if(lineArr.length<7){return}

        let ip=lineArr[0];
        let time=lineArr[3]+' '+lineArr[4];
        let method=lineArr[5].replace(/"/g,'');
        let path=lineArr[6];
        let status=lineArr[8];
        let referer=lineArr[10].replace(/"/g,'');
        let userAgent=lineArr.slice(11,lineArr.length-2).join(' ').replace(/"/g,'');
        let remoteAddr=lineArr[lineArr.length-2];
        let requestTime=lineArr[lineArr.length-1].replace(/"/g,'');
        requestTime=parseFloat(requestTime);
        if(isNaN(requestTime)){return}

        let resultObj={
            ip: {Type:'string', Value:ip},
            time: {Type:'string', Value:time},
            method: {Type:'string', Value:method},
            path: {Type:'string', Value:path},
            status: {Type:'string', Value:status},
            referer: {Type:'string', Value:referer},
            userAgent: {Type:'string', Value:userAgent},
            remoteAddr: {Type:'string', Value:remoteAddr},
            requestTime: {Type:'number', Value:requestTime},
        };

        result.push(resultObj);
    })

    return result;
}

export function convertAllLog(code, logContent, callback, baseMessage) {
    // code = extractFunction(code)

    // let funcStr = 'return ' + code
    // let parselog = new Function('logContent', funcStr)()
    let data = callback(logContent)
    if (baseMessage === 'nginx') {
        data = parselog(logContent)
    }
    console.log('data', data)
    const transformData = transformDataMap[baseMessage]
    return {
        chartData: transformData(data),
        originData: data
    }
}



export function findFirstNumberProperty(obj) {
    for (let prop in obj) {
        if (obj[prop].Type === 'number') {
            return prop;
        }
    }
    return null;
}



/*
  let data = [
    {
      ip: { type: 'string', value: '172.31.0.123' },
      method: { type: 'string', value: '"GET /project/api/project/team/RZxvwUZ8/notices/info?type=1' },
      requestTime: { type: 'number', value: 0.012 },
      status: { type: 'string', value: '200' },
      time: { type: 'string', value: '[04/May/2023:23:59:04 +0800]' }
    }
  ];


  {
  labels: ['[04/May/2023:23:59:04 +0800]'],
    datasets: [
      [label: 'ip', type: 'line', stack: 'Total', data: ['172.31.0.123']],
      [label: 'method', type: 'line', stack: 'Total', data: ['"GET /project/api/project/team/RZxvwUZ8/notices/info?type=1']],
      [label: 'requestTime', type: 'line', stack: 'Total', data: [0.012]],
      [label: 'status', type: 'line', stack: 'Total', data: ['200']]
    ]
  }
* */