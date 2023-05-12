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
    console.log('code', code)
    code = extractFunction(code)
    console.log('code after extract', code)
    console.log('logContent', logContent)
//     console.log('nginxLog2', logContent2)
//     let logContent = `# Time: 2023-05-02T20:07:41.658728Z
// # User@Host: ones[ones] @  [127.0.0.1]  Id: 975945
// # Query_time: 1.715076  Lock_time: 0.000024 Rows_sent: 278686  Rows_examined: 336258
// SET timestamp=1683058061;
// SELECT uuid, team_uuid, org_uuid, context_type, context_param_1, context_param_2, user_domain_type, user_domain_param, permission, create_time, status, read_only, position FROM permission_rule WHERE team_uuid='RZxvwUZ8' AND permission IN (1202) AND status=1;
// # Time: 2023-05-02T21:00:01.084358Z
// # User@Host: ones[ones] @  [127.0.0.1]  Id: 975990
// # Query_time: 1.064522  Lock_time: 0.000029 Rows_sent: 0  Rows_examined: 62561
// SET timestamp=1683061201;
// SELECT team_uuid,COUNT(DISTINCT owner) AS count FROM \`task\` WHERE LEFT(create_time, 10) >= 1682956800 AND LEFT(create_time, 10) <= 1683043199 GROUP BY \`team_uuid\`;`
//     let funcStr = `function parselog(logContent) {
//     const State = {
//         Start: 0, Time: 1, UserHost: 2, Id: 3, QueryTime: 4, LockTime: 5, RowsSent: 6, RowsExamined: 7, Timestamp: 8, Sql: 9,
//     };
//     const results = [];
//     let state = State.Start;
//     let currentResult = {};
//     const lines = logContent.split('\\n');
//
//     for (let i = 0; i < lines.length; i++) {
//         const line = lines[i];
//
//         switch (state) {
//             case State.Start:
//                 if (line.startsWith("# Time: ")) {
//                     state = State.Time;
//                     currentResult = {};
//                     currentResult["time"] = { Type: "string", Value: line.substring("# Time: ".length) }
//                 }
//                 break;
//
//             case State.Time:
//                 if (line.startsWith("# User@Host: ")) {
//                     state = State.UserHost;
//                     const userHostParts = line.substring("# User@Host: ".length).split(" Id: ");
//                     currentResult["UserHost"] = { Type: "string", Value: userHostParts[0] };
//                     currentResult["Id"] = { Type: "string", Value: userHostParts[1] }
//                 }
//                 break;
//
//             case State.UserHost:
//                 if (line.startsWith("# Query_time: ")) {
//                     state = State.QueryTime;
//                     const queryTimeParts = line.split(" ");
//                     currentResult["Query_time"] = { Type: "number", Value: parseFloat(queryTimeParts[2]) };
//                     currentResult["Lock_time"] = { Type: "number", Value: parseFloat(queryTimeParts[5]) };
//                     currentResult["Rows_sent"] = { Type: "number", Value: parseFloat(queryTimeParts[7]) };
//                     currentResult["Rows_examined"] = { Type: "number", Value: parseFloat(queryTimeParts[9]) };
//                 }
//                 break;
//
//             case State.QueryTime:
//                 if (line.startsWith("SET timestamp=")) {
//                     state = State.Timestamp;
//                     currentResult["timestamp"] = { Type: "number", Value: parseInt(line.substring("SET timestamp=".length)) }
//                 }
//                 break;
//
//             case State.Timestamp:
//                 if (line.trim() !== "") {
//                     state = State.Start;
//                     currentResult["sql"] = { Type: "string", Value: line };
//                     results.push(currentResult);
//                 }
//                 break;
//         }
//     }
//
//     return results;
// }`
//     funcStr = 'return ' + funcStr
    let funcStr = 'return ' + code
    console.log('funcStr', funcStr)
    let parselog = new Function('logContent', funcStr)()
    let data = parselog(logContent)

    console.log('data', data)
    return transformData(data)
}

// function transformData(data) {
//     const labels = data.map(item => item.time.value);
//     const datasets = Object.keys(data[0]).map(key => {
//         const label = key;
//         const dataValues = data.map(item => item[key].value);
//         return {label, data: dataValues};
//     });
//     return {labels, datasets};
// }
function transformData(data) {
    // TODO 需要调一次接口确认时间戳是哪个字段
    let showField = 'Rows_examined';
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
