export function convertAllLog(nginxLog2) {
    console.log('nginxLog2', nginxLog2)
    let nginxLog = `172.31.0.123 - - [04/May/2023:23:59:04 +0800] "GET /project/api/project/team/RZxvwUZ8/notices/info?type=1 HTTP/1.0" 200 587 "https://ones.bangcle.com/project/" "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.1.12.0 Safari/537.36 Language/zh wxwork/4.1.3 (MicroMessenger/6.2) WindowsWechat  MailPlugin_Electron WeMail embeddisk" "106.38.121.197, 172.31.0.123" "0.012"
172.31.0.123 - - [04/May/2023:23:59:04 +0800] "GET /project/api/project/team/RZxvwUZ8/notices/info?type=1 HTTP/1.0" 200 490 "https://ones.bangcle.com/project/" "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.1.12.0 Safari/537.36 Language/zh wxwork/4.1.3 (MicroMessenger/6.2) WindowsWechat  MailPlugin_Electron WeMail embeddisk" "106.38.121.197, 172.31.0.123" "0.010"
172.31.0.123 - - [04/May/2023:23:59:04 +0800] "POST /project/api/project/team/RZxvwUZ8/card/5CRXLgun/data HTTP/1.0" 200 639 "https://ones.bangcle.com/project/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36" "106.38.121.194, 172.31.0.123" "0.017"
172.31.0.123 - - [04/May/2023:23:59:05 +0800] "POST /project/api/project/team/RZxvwUZ8/card/NZyQ1vaK/data HTTP/1.0" 200 106 "https://ones.bangcle.com/project/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36" "106.38.121.194, 172.31.0.123" "0.036"`
    let funcStr = `function parselog(nginxLog) {
  const lines = nginxLog.split('\\n')
  // console.log(lines)
  const result = []
  // 统计 path 的请求次数
  const pathCount = {}
  lines.forEach((line) => {
    const lineArr = line.split(' ')
    if (lineArr.length < 7) {
      console.log('无法解析的行', line, 'lineArr.length', lineArr.length)
      return
    }
    let ip = lineArr[0]
    let time = lineArr[3] + ' ' + lineArr[4]
    let method = lineArr[5]
    let path = lineArr[6]
    // 统计 path 的请求次数
    if (pathCount[path]) {
      pathCount[path]++
    } else {
      pathCount[path] = 1
    }
    // 127.0.0.1 - - [21/Feb/2023:23:59:05 +0800] "GET /api/project/team/2vtyv8Uu/task/WPf96zgeCHUKVMFw/messages HTTP/1.1" 200 4617 "-" "Go-http-client/1.1" "192.168.24.5" "0.011"
    // 取状态码
    let status = lineArr[8]
    let requestTime = lineArr[lineArr.length - 1]
    requestTime = parseFloat(requestTime.replace(/"/g, ''))
    if (isNaN(requestTime)) {
      console.log('无法解析请求耗时', line, 'lineArr.length', lineArr.length)
      return
    }
    // 把数据放到对象里，按请求耗时排序，耗时相同按请求时间排序
    let resultObj = {
      ip: {
        type: 'string',
        value: ip
      },
      time: {
        type: 'string',
        value: time
      },
      method: {
        type: 'string',
        value: method + ' ' + path
      },
      status: {
        type: 'string',
        value: status
      },
      // client: client,
      requestTime: {
        type: 'number',
        value: requestTime
      }
    }
    result.push(resultObj)
  })
  return result
}
`
    funcStr = 'return ' + funcStr
    let parselog = new Function('nginxLog', funcStr)()
    let data = parselog(nginxLog)

    let result = transformData(data)
    console.log(result);

}

function transformData(data) {
    const labels = data.map(item => item.time.value);
    const datasets = Object.keys(data[0]).map(key => {
        const label = key;
        const dataValues = data.map(item => item[key].value);
        return {label, data: dataValues};
    });
    return {labels, datasets};
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
      [label: 'ip', data: ['172.31.0.123']],
      [label: 'method', data: ['"GET /project/api/project/team/RZxvwUZ8/notices/info?type=1']],
      [label: 'requestTime', data: [0.012]],
      [label: 'status', data: ['200']]
    ]
  }
* */
