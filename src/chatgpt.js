import axios from 'axios';

export function getParseCode(message) {
    message = `你后面是作为一个nginx, mysql-slow
等日志的解析生成器，根据日志内容生成解析日志的js代码，函数名为parselog，输入为logContent，输出是一个对象数组，你需要识别有哪些字段并命名，对象包含每条日志提取出的字段名，字段类型，字段值，结果只有parselog函数，不需要其他任何回复，不需要解释
例如：
# Time: 2023-05-02T20:07:41.658728Z
# User@Host: ones[ones] @  [127.0.0.1]  Id: 975945
# Query_time: 1.715076  Lock_time: 0.000024 Rows_sent: 278686  Rows_examined: 336258
SET timestamp=1683058061;
SELECT uuid, team_uuid, org_uuid, context_type, context_param_1, context_param_2, user_domain_type, user_domain_param, permission, create_time, status, read_only, position FROM permission_rule WHERE team_uuid='RZxvwUZ8' AND permission IN (1202) AND status=1;
你应该返回 function parselog(logContent){const State={Start:0,Time:1,User:2,Host:3,Id:4,QueryTime:5,LockTime:6,RowsSent:7,RowsExamined:8,Timestamp:9,Sql:10,};function parseQueryTime(logLine){const aMap={};const queryTimeParts=logLine.substring("# Query_time: ".length).split("  Lock_time: ");const queryTime=queryTimeParts[0];const lockTimeParts=queryTimeParts[1].split("Rows_sent: ");const lockTime=lockTimeParts[0].trim();const rowsParts=lockTimeParts[1].split("Rows_examined: ");const rowsSent=rowsParts[0].trim();const rowsExamined=rowsParts[1].trim();aMap["Query_time"]={Type:"number",Value:queryTime};aMap["Lock_time"]={Type:"number",Value:lockTime};aMap["Rows_sent"]={Type:"number",Value:rowsSent};aMap["Rows_examined"]={Type:"number",Value:rowsExamined};return aMap}const results=[];let state=State.Start;let currentResult={};const lines=logContent.split('\\n');for(let i=0;i<lines.length;i++){const line=lines[i];switch(state){case State.Start:if(line.startsWith("# Time: ")){state=State.Time;currentResult={};currentResult["time"]={Type:"string",Value:line.substring("# Time: ".length)}}break;case State.Time:if(line.startsWith("# User@Host: ")){state=State.User;const parts=line.substring("# User@Host: ".length).split("  Id: ");currentResult["User"]={Type:"string",Value:parts[0]};currentResult["Host"]={Type:"string",Value:parts[1]}}break;case State.User:if(line.startsWith("# Query_time: ")){state=State.QueryTime;const queryTimeMap=parseQueryTime(line);currentResult={...currentResult,...queryTimeMap}}break;case State.QueryTime:if(line.startsWith("SET timestamp=")){state=State.Timestamp;currentResult["timestamp"]={Type:"number",Value:parseInt(line.substring("SET timestamp=".length))}}break;case State.Timestamp:if(line.trim()!==""){state=State.Start;currentResult["sql"]={Type:"string",Value:line};results.push(currentResult)}break}}return results}

现在输入是：
# Time: 2023-05-02T21:00:01.084358Z
# User@Host: ones[ones] @  [127.0.0.1]  Id: 975990
# Query_time: 1.064522  Lock_time: 0.000029 Rows_sent: 0  Rows_examined: 62561
SET timestamp=1683061201;
SELECT team_uuid,COUNT(DISTINCT owner) AS count FROM \`task\` WHERE LEFT(create_time, 10) >= 1682956800 AND LEFT(create_time, 10) <= 1683043199 GROUP BY \`team_uuid\`;
`
    message = 'hi'
    const baseURL = "http://task.xiaohuasheng.cc"
    // const baseURL = "http://localhost:9091"
    var FormData = require('form-data');
    var data = new FormData();
    data.append('content', message);

    var config = {
        method: 'post',
        url: baseURL + '/api/chatgpt',
        headers: {
            'Cookie': 'beegosessionID=018d39ffedf3de285eed2099cb1d751d; language=zh'
        },
        data : data
    };

    axios(config).then(function (response) {
            if (response.data.code !== 0) {
                console.log(response.data.msg);
                return;
            }
            console.log(response.data.data);
        })
        .catch(function (error) {
            console.log(error);
        });
}
