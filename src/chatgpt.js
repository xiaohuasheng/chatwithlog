/* eslint-disable */

import axios from 'axios';
import FormData from "form-data";
import {convertAllLog} from '@/parseNginxLog'

// export default {
//     async getParseCode(message) {
//         let baseMessage = `你后面是作为一个nginx, mysql-slow
// 等日志的解析生成器，根据日志内容生成解析日志的js代码，函数名为parselog，输入为logContent，输出是一个对象数组，你需要识别有哪些字段并命名，对象包含每条日志提取出的字段名，字段类型，字段值，结果只有parselog函数，不需要其他任何回复，不需要解释
// 例如：
// # Time: 2023-05-02T20:07:41.658728Z
// # User@Host: ones[ones] @  [127.0.0.1]  Id: 975945
// # Query_time: 1.715076  Lock_time: 0.000024 Rows_sent: 278686  Rows_examined: 336258
// SET timestamp=1683058061;
// SELECT uuid, team_uuid, org_uuid, context_type, context_param_1, context_param_2, user_domain_type, user_domain_param, permission, create_time, status, read_only, position FROM permission_rule WHERE team_uuid='RZxvwUZ8' AND permission IN (1202) AND status=1;
// 你应该返回 function parselog(logContent){const State={Start:0,Time:1,User:2,Host:3,Id:4,QueryTime:5,LockTime:6,RowsSent:7,RowsExamined:8,Timestamp:9,Sql:10,};function parseQueryTime(logLine){const aMap={};const queryTimeParts=logLine.substring("# Query_time: ".length).split("  Lock_time: ");const queryTime=queryTimeParts[0];const lockTimeParts=queryTimeParts[1].split("Rows_sent: ");const lockTime=lockTimeParts[0].trim();const rowsParts=lockTimeParts[1].split("Rows_examined: ");const rowsSent=rowsParts[0].trim();const rowsExamined=rowsParts[1].trim();aMap["Query_time"]={Type:"number",Value:queryTime};aMap["Lock_time"]={Type:"number",Value:lockTime};aMap["Rows_sent"]={Type:"number",Value:rowsSent};aMap["Rows_examined"]={Type:"number",Value:rowsExamined};return aMap}const results=[];let state=State.Start;let currentResult={};const lines=logContent.split('\\n');for(let i=0;i<lines.length;i++){const line=lines[i];switch(state){case State.Start:if(line.startsWith("# Time: ")){state=State.Time;currentResult={};currentResult["time"]={Type:"string",Value:line.substring("# Time: ".length)}}break;case State.Time:if(line.startsWith("# User@Host: ")){state=State.User;const parts=line.substring("# User@Host: ".length).split("  Id: ");currentResult["User"]={Type:"string",Value:parts[0]};currentResult["Host"]={Type:"string",Value:parts[1]}}break;case State.User:if(line.startsWith("# Query_time: ")){state=State.QueryTime;const queryTimeMap=parseQueryTime(line);currentResult={...currentResult,...queryTimeMap}}break;case State.QueryTime:if(line.startsWith("SET timestamp=")){state=State.Timestamp;currentResult["timestamp"]={Type:"number",Value:parseInt(line.substring("SET timestamp=".length))}}break;case State.Timestamp:if(line.trim()!==""){state=State.Start;currentResult["sql"]={Type:"string",Value:line};results.push(currentResult)}break}}return results}

export const mysql = `你是一个js函数生成器, 生成js代码来解析nginx, mysql-slow等日志，函数名为parselog，输入为logContent，输出是一个对象数组，你需要识别有哪些字段并命名，对象包含每条日志提取出的字段名，字段类型，字段值，结果只有parselog函数，不需要其他任何回复，不需要解析数据，只是返回函数
    例如：
    # Time: 2023-05-02T20:07:41.658728Z
    # User@Host: ones[ones] @  [127.0.0.1]  Id: 975945
    # Query_time: 1.715076  Lock_time: 0.000024 Rows_sent: 278686  Rows_examined: 336258
    SET timestamp=1683058061;
    SELECT uuid, team_uuid, org_uuid, context_type, context_param_1, context_param_2, user_domain_type, user_domain_param, permission, create_time, status, read_only, position FROM permission_rule WHERE team_uuid='RZxvwUZ8' AND permission IN (1202) AND status=1;
    你应该返回 function parselog(logContent){const State={Start:0,Time:1,User:2,Host:3,Id:4,QueryTime:5,LockTime:6,RowsSent:7,RowsExamined:8,Timestamp:9,Sql:10,};function parseQueryTime(logLine){const aMap={};const queryTimeParts=logLine.substring("# Query_time: ".length).split("  Lock_time: ");const queryTime=queryTimeParts[0];const lockTimeParts=queryTimeParts[1].split("Rows_sent: ");const lockTime=lockTimeParts[0].trim();const rowsParts=lockTimeParts[1].split("Rows_examined: ");const rowsSent=rowsParts[0].trim();const rowsExamined=rowsParts[1].trim();aMap["Query_time"]={Type:"number",Value:queryTime};aMap["Lock_time"]={Type:"number",Value:lockTime};aMap["Rows_sent"]={Type:"number",Value:rowsSent};aMap["Rows_examined"]={Type:"number",Value:rowsExamined};return aMap}const results=[];let state=State.Start;let currentResult={};const lines=logContent.split('\\n');for(let i=0;i<lines.length;i++){const line=lines[i];switch(state){case State.Start:if(line.startsWith("# Time: ")){state=State.Time;currentResult={};currentResult["time"]={Type:"string",Value:line.substring("# Time: ".length)}}break;case State.Time:if(line.startsWith("# User@Host: ")){state=State.User;const parts=line.substring("# User@Host: ".length).split("  Id: ");currentResult["User"]={Type:"string",Value:parts[0]};currentResult["Host"]={Type:"string",Value:parts[1]}}break;case State.User:if(line.startsWith("# Query_time: ")){state=State.QueryTime;const queryTimeMap=parseQueryTime(line);currentResult={...currentResult,...queryTimeMap}}break;case State.QueryTime:if(line.startsWith("SET timestamp=")){state=State.Timestamp;currentResult["timestamp"]={Type:"number",Value:parseInt(line.substring("SET timestamp=".length))}}break;case State.Timestamp:if(line.trim()!==""){state=State.Start;currentResult["sql"]={Type:"string",Value:line};results.push(currentResult)}break}}return results}

    现在输入是：
    `
export const nginx = `
你是一个js函数生成器, 生成js代码来解析nginx日志，注意，你不要解析，返回函数即可，函数名为parselog，输入为logContent，输出是一个对象数组，你需要识别有哪些字段并命名，对象包含每条日志提取出的字段名，字段类型，字段值，结果只有parselog函数，不需要其他任何回复，不需要解析数据，只是返回函数
    例如：
    172.31.0.123 - - [05/May/2023:09:40:00 +0800] "POST /project/api/project/team/RZxvwUZ8/items/graphql?t=group-task-data HTTP/1.0" 200 7227 "https://ones.bangcle.com/project/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36" "106.38.121.194, 172.31.0.123" "1.107"
    你应该返回 function parselog(logContent){const lines=logContent.split('\\n');const result=[];lines.forEach((line)=>{const lineArr=line.split(' ');if(lineArr.length<7){return}let ip=lineArr[0];let time=lineArr[3]+' '+lineArr[4];let method=lineArr[5];let path=lineArr[6];let status=lineArr[8];let requestTime=lineArr[lineArr.length-1];requestTime=parseFloat(requestTime.replace(/"/g,''));if(isNaN(requestTime)){return}let resultObj={ip:{Type:'string',Value:ip},time:{Type:'string',Value:time},method:{Type:'string',Value:method+' '+path},status:{Type:'string',Value:status},requestTime:{Type:'number',Value:requestTime}}result.push(resultObj)})return result}

    现在输入是
`

const BaseMessageMap = {
    mysql,
    nginx
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


function parseNginxlog(logContent) {
    const lines = logContent.split('\\n');
    const result = [];
    lines.forEach((line) => {
        const lineArr = line.split(' ');
        if (lineArr.length < 7) {
            return;
        }
        let ip = lineArr[0];
        let time = lineArr[3] + ' ' + lineArr[4];
        let method = lineArr[5];
        let path = lineArr[6];
        let status = lineArr[8];
        let requestTime = lineArr[lineArr.length - 1];
        requestTime = parseFloat(requestTime.replace(/"/g, ''));
        if (isNaN(requestTime)) {
            return;
        }
        let resultObj = {
            ip: {
                Type: 'string',
                Value: ip
            },
            time: {
                Type: 'string',
                Value: time
            },
            method: {
                Type: 'string',
                Value: method + ' ' + path
            },
            status: {
                Type: 'string',
                Value: status
            },
            // client: client,
            requestTime: {
                Type: 'number',
                Value: requestTime
            }
        }
        result.push(resultObj);
    })
    return result;
}

function parseMysqllog(logContent) {
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
        aMap["Query_time"] = {Type: "number", Value: queryTime};
        aMap["Lock_time"] = {Type: "number", Value: lockTime};
        aMap["Rows_sent"] = {Type: "number", Value: rowsSent};
        aMap["Rows_examined"] = {Type: "number", Value: rowsExamined};
        return aMap
    }

    const results = [];
    let state = State.Start;
    let currentResult = {};
    const lines = logContent.split('\n');
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        switch (state) {
            case State.Start:
                if (line.startsWith("# Time: ")) {
                    state = State.Time;
                    currentResult = {};
                    currentResult["time"] = {Type: "string", Value: line.substring("# Time: ".length)}
                }
                break;
            case State.Time:
                if (line.startsWith("# User@Host: ")) {
                    state = State.User;
                    const parts = line.substring("# User@Host: ".length).split("  Id: ");
                    currentResult["User"] = {Type: "string", Value: parts[0]};
                    currentResult["Host"] = {Type: "string", Value: parts[1]}
                }
                break;
            case State.User:
                if (line.startsWith("# Query_time: ")) {
                    state = State.QueryTime;
                    const queryTimeMap = parseQueryTime(line);
                    currentResult = {...currentResult, ...queryTimeMap}
                }
                break;
            case State.QueryTime:
                if (line.startsWith("SET timestamp=")) {
                    state = State.Timestamp;
                    currentResult["timestamp"] = {
                        Type: "number",
                        Value: parseInt(line.substring("SET timestamp=".length))
                    }
                }
                break;
            case State.Timestamp:
                if (line.trim() !== "") {
                    state = State.Start;
                    currentResult["sql"] = {Type: "string", Value: line};
                    results.push(currentResult)
                }
                break
        }
    }
    return results
}

const parseMap = {
    nginx: parseNginxlog,
    mysql: parseMysqllog,
}



export const requestChatgpt = (subStr, fileContent, baseMessage = 'mysql') => {
    return new Promise((resolve, reject) => {
        const msg = BaseMessageMap[baseMessage]
        let content = msg + subStr
        const baseURL = "http://task.xiaohuasheng.cc"
        // const baseURL = "http://localhost:9091"
        var data = new FormData();
        // data.append('model', 'gpt-4');
        data.append('model', 'gpt-3.5-turbo');
        data.append('content', content);

        var config = {
            method: 'post',
            url: baseURL + '/api/chatgpt',
            headers: {
                'Cookie': 'beegosessionID=018d39ffedf3de285eed2099cb1d751d; language=zh'
            },
            data: data
        };
        // setTimeout(() => {
        //     console.log('fileContent', fileContent)
        //
        // }, 100)


        axios(config).then(function (response) {
            if (response.data.code !== 0) {
                console.log(response.data.msg);
                return;
            }
            if (!response.data.data) {
                console.log('没有返回数据');
                return;
            }
            const code = response.data.data;
            // const code = `function parselog(logContent){const State={Start:0,Time:1,User:2,Host:3,Id:4,QueryTime:5,LockTime:6,RowsSent:7,RowsExamined:8,Timestamp:9,Sql:10,};function parseQueryTime(logLine){const aMap={};const queryTimeParts=logLine.substring("# Query_time: ".length).split("  Lock_time: ");const queryTime=queryTimeParts[0];const lockTimeParts=queryTimeParts[1].split("Rows_sent: ");const lockTime=lockTimeParts[0].trim();const rowsParts=lockTimeParts[1].split("Rows_examined: ");const rowsSent=rowsParts[0].trim();const rowsExamined=rowsParts[1].trim();aMap["Query_time"]={Type:"number",Value:queryTime};aMap["Lock_time"]={Type:"number",Value:lockTime};aMap["Rows_sent"]={Type:"number",Value:rowsSent};aMap["Rows_examined"]={Type:"number",Value:rowsExamined};return aMap}const results=[];let state=State.Start;let currentResult={};const lines=logContent.split('\\n');for(let i=0;i<lines.length;i++){const line=lines[i];switch(state){case State.Start:if(line.startsWith("# Time: ")){state=State.Time;currentResult={};currentResult["time"]={Type:"string",Value:line.substring("# Time: ".length)}}break;case State.Time:if(line.startsWith("# User@Host: ")){state=State.User;const parts=line.substring("# User@Host: ".length).split("  Id: ");currentResult["User"]={Type:"string",Value:parts[0]};currentResult["Host"]={Type:"string",Value:parts[1]}}break;case State.User:if(line.startsWith("# Query_time: ")){state=State.QueryTime;const queryTimeMap=parseQueryTime(line);currentResult={...currentResult,...queryTimeMap}}break;case State.QueryTime:if(line.startsWith("SET timestamp=")){state=State.Timestamp;currentResult["timestamp"]={Type:"number",Value:parseInt(line.substring("SET timestamp=".length))}}break;case State.Timestamp:if(line.trim()!==""){state=State.Start;currentResult["sql"]={Type:"string",Value:line};results.push(currentResult)}break}}return results}            `
            eval(extractFunction(code))
            let result = convertAllLog('code', fileContent, parseMap[baseMessage], baseMessage)
            resolve(result)
        })
            .catch(function (error) {
                console.log(error);
                reject(error)
            });
    })

}
