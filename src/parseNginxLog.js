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



export function convertAllLog(logContent2, showField) {
    console.log('nginxLog2', logContent2)
    let logContent = `# Time: 2023-05-02T20:07:41.658728Z
# User@Host: ones[ones] @  [127.0.0.1]  Id: 975945
# Query_time: 1.715076  Lock_time: 0.000024 Rows_sent: 278686  Rows_examined: 336258
SET timestamp=1683058061;
SELECT uuid, team_uuid, org_uuid, context_type, context_param_1, context_param_2, user_domain_type, user_domain_param, permission, create_time, status, read_only, position FROM permission_rule WHERE team_uuid='RZxvwUZ8' AND permission IN (1202) AND status=1;
# Time: 2023-05-02T21:00:01.084358Z
# User@Host: ones[ones] @  [127.0.0.1]  Id: 975990
# Query_time: 1.064522  Lock_time: 0.000029 Rows_sent: 0  Rows_examined: 62561
SET timestamp=1683061201;
SELECT team_uuid,COUNT(DISTINCT owner) AS count FROM \`task\` WHERE LEFT(create_time, 10) >= 1682956800 AND LEFT(create_time, 10) <= 1683043199 GROUP BY \`team_uuid\`;`
    let funcStr = `function parselog(logContent) {
  const State = {
    Start: 0,
    Time: 1,
    User: 2,
    Host: 3,
    Id: 4,
    QueryTime: 5,
    LockTime: 6,
    RowsSent: 7,
    RowsExamined: 8,
    Timestamp: 9,
    Sql: 10,
  };

  function parseQueryTime(logLine) {
    const aMap = {};
    const queryTimeParts = logLine.substring("# Query_time: ".length).split("  Lock_time: ");
    const queryTime = queryTimeParts[0];
    const lockTimeParts = queryTimeParts[1].split("Rows_sent: ");
    const lockTime = lockTimeParts[0].trim();
    const rowsParts = lockTimeParts[1].split("Rows_examined: ");
    const rowsSent = rowsParts[0].trim();
    const rowsExamined = rowsParts[1].trim();
    aMap["Query_time"] = { Type: "number", Value: queryTime };
    aMap["Lock_time"] = { Type: "number", Value: lockTime };
    aMap["Rows_sent"] = { Type: "number", Value: rowsSent };
    aMap["Rows_examined"] = { Type: "number", Value: rowsExamined };
    return aMap;
  }

  const results = [];
  let state = State.Start;
  let currentResult = {};

  const lines = logContent.split('\\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    switch (state) {
      case State.Start:
        if (line.startsWith("# Time: ")) {
          state = State.Time;
          currentResult = {};
          currentResult["time"] = { Type: "string", Value: line.substring("# Time: ".length) };
        }
        break;
      case State.Time:
        if (line.startsWith("# User@Host: ")) {
          state = State.User;
          const parts = line.substring("# User@Host: ".length).split("  Id: ");
          currentResult["User"] = { Type: "string", Value: parts[0] };
          currentResult["Host"] = { Type: "string", Value: parts[1] };
        }
        break;
      case State.User:
        if (line.startsWith("# Query_time: ")) {
          state = State.QueryTime;
          const queryTimeMap = parseQueryTime(line);
          currentResult = { ...currentResult, ...queryTimeMap };
        }
        break;
      case State.QueryTime:
        if (line.startsWith("SET timestamp=")) {
          state = State.Timestamp;
          currentResult["timestamp"] = { Type: "number", Value: parseInt(line.substring("SET timestamp=".length)) };
        }
        break;
      case State.Timestamp:
        if (line.trim() !== "") {
          state = State.Start;
          currentResult["sql"] = { Type: "string", Value: line };
          results.push(currentResult);
        }
        break;
    }
  }
  return results;
}`
    funcStr = 'return ' + funcStr
    let parselog = new Function('logContent', funcStr)()
    let data = parselog(logContent)

    console.log('data', data)
    console.log(showField);
    return transformData(data, showField)
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
function transformData(data, showField) {
    // TODO 需要调一次接口确认时间戳是哪个字段
    const labels = data.map(item => {
        if (item === undefined) {
            return
        }
        console.log('item', item)
        console.log('item.time', item.time)
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
