export function convertAllLog2(nginxLog2, showField) {
    console.log('nginxLog2', nginxLog2)
    let nginxLog = `172.31.0.123 - - [04/May/2023:23:59:04 +0800] "GET /project/api/project/team/RZxvwUZ8/notices/info?type=1 HTTP/1.0" 200 587 "https://ones.bangcle.com/project/" "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.1.12.0 Safari/537.36 Language/zh wxwork/4.1.3 (MicroMessenger/6.2) WindowsWechat  MailPlugin_Electron WeMail embeddisk" "106.38.121.197, 172.31.0.123" "0.012"
172.31.0.123 - - [04/May/2023:23:59:04 +0800] "GET /project/api/project/team/RZxvwUZ8/notices/info?type=1 HTTP/1.0" 200 490 "https://ones.bangcle.com/project/" "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.1.12.0 Safari/537.36 Language/zh wxwork/4.1.3 (MicroMessenger/6.2) WindowsWechat  MailPlugin_Electron WeMail embeddisk" "106.38.121.197, 172.31.0.123" "0.010"
172.31.0.123 - - [04/May/2023:23:59:04 +0800] "POST /project/api/project/team/RZxvwUZ8/card/5CRXLgun/data HTTP/1.0" 200 639 "https://ones.bangcle.com/project/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36" "106.38.121.194, 172.31.0.123" "0.017"
172.31.0.123 - - [04/May/2023:23:59:05 +0800] "POST /project/api/project/team/RZxvwUZ8/card/NZyQ1vaK/data HTTP/1.0" 200 106 "https://ones.bangcle.com/project/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36" "106.38.121.194, 172.31.0.123" "0.036"`
    let funcStr = `function parselog(logContent) {
    const logs = logContent.trim().split('\\n');
    return logs.map(log => {
        const record = {};
        const regex = /\\[([^\\]]+)]|"([^"]*)"|(\\d+\\.\\d+\\.\\d+\\.\\d+)|-|(\\w+)\\s+|-|\\d+/g;
    
        const keys = ['IP', 'timestamp', 'request', 'status', 'size', 'referer', 'user_agent', 'forwarded_for', 'response_time'];
        let match;
        let i = 0;

        while ((match = regex.exec(log)) !== null) {
            const value = match[1] || match[2] || match[3] || match[4];
            const key = keys[i];
            i++;
        
            if (/^\\d+$/.test(value)) {
                record[key] = { type: 'number', value: parseInt(value) };
            } else {
                record[key] = { type: 'string', value };
            }
        }
        
        return record;
    });
}
`
    funcStr = 'return ' + funcStr
    let parselog = new Function('logContent', funcStr)()
    let data = parselog(nginxLog)

    console.log(data);
    return transformData(data, showField)
}

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


export function convertAllLog(code, logContent) {
    code = extractFunction(code)

    let funcStr = 'return ' + code
    let parselog = new Function('logContent', funcStr)()
    let data = parselog(logContent)

    console.log('data', data)
    return {
        chartData: transformData(data),
        originData: data
    }
}

export function transformData(data, showField = 'Rows_examined') {
    // TODO 需要调一次接口确认时间戳是哪个字段
    const labels = data.map(item => {
        if (item === undefined) {
            return
        }
        if (item.time === undefined) {
            console.log('time is undefined, item', item)
            return
        }
        // 是否是 NaN
        if (isNaN(item.Rows_examined.Value)) {
            showField = 'Rows_sent'
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
