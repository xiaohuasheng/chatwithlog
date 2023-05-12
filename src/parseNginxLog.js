function extractFunction(str) {
    // 查找第一个 function 的位置
    const start = str.indexOf('function');
    if (start === -1) {
        // 如果字符串中没有 function，返回空字符串
        return '';
    }

    const end = str.lastIndexOf('}');
    if (end === -1) {
        // 如果字符串中没有 }，返回空字符串
        return '';
    }
    return str.substring(start, end + 1);
}

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

export function convertAllLog(code, logContent) {
    code = extractFunction(code)

    let funcStr = 'return ' + code
    let parselog = new Function('logContent', funcStr)()
    let data = parselog(logContent)
    return {
        chartData: transformData(data),
        originData: data
    }
}

function findFirstNumberProperty(obj) {
    for (let prop in obj) {
        if (obj[prop].Type === 'number') {
            return prop;
        }
    }
    return null;
}

export function transformData(data, showField) {
    // TODO 需要调一次接口确认时间戳是哪个字段
    if (data.length > 0) {
        if (showField === undefined) {
            showField = findFirstNumberProperty(data[0]);
        }
    }
    const labels = data.map(item => {
        if (item === undefined) {
            return
        }
        if (item.time === undefined) {
            console.log('time is undefined, item', item)
            return
        }
        return item.time.Value
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
        datasets
    };
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
