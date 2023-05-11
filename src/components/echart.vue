<template>
  <input type="file" id="btn" @change="inputChange" multiple/>
  <div id="echarts" style="width: 600px;height:400px;"></div>
</template>

<script>
import * as echarts from 'echarts';
import {convertAllLog} from '@/parseNginxLog'
import FormData from "form-data";
import axios from 'axios';

export default {
  name: 'my-chart',
  data() {
    return {
      myChart: null
    }
  },
  components: {},
  mounted() {
    this.myChart = echarts.init(document.getElementById('echarts'));

    // const response = getParseCode('');
    // console.log('response', response)

    // TODO 传参数每一种日志选一个字段来显示
    // let result = convertAllLog('', 'requestTime')
    // let result = convertAllLog('', 'Rows_sent')
    // console.log('result', result)
  },
  methods: {
    // 文件上传事件
    inputChange(e) {
      console.log('inputChange', e)
      let _this = this
      const files = e.target.files
      console.log('files', files)
      for(let i = 0; i < files.length; i++) {
        const file = files[i]
        let reader = new FileReader();
        reader.onload = function(e){
          console.log('here')
          const fileContent = e.target.result
          let subStr = fileContent.substring(0, 500);
          console.log('subStr', subStr)

          let baseMessage = `你是一个js函数生成器, 生成js代码来解析nginx, mysql-slow等日志，函数名为parselog，输入为logContent，输出是一个对象数组，你需要识别有哪些字段并命名，对象包含每条日志提取出的字段名，字段类型，字段值，结果只有parselog函数，不需要其他任何回复，不需要解释
例如：
# Time: 2023-05-02T20:07:41.658728Z
# User@Host: ones[ones] @  [127.0.0.1]  Id: 975945
# Query_time: 1.715076  Lock_time: 0.000024 Rows_sent: 278686  Rows_examined: 336258
SET timestamp=1683058061;
SELECT uuid, team_uuid, org_uuid, context_type, context_param_1, context_param_2, user_domain_type, user_domain_param, permission, create_time, status, read_only, position FROM permission_rule WHERE team_uuid='RZxvwUZ8' AND permission IN (1202) AND status=1;
你应该返回 function parselog(logContent){const State={Start:0,Time:1,User:2,Host:3,Id:4,QueryTime:5,LockTime:6,RowsSent:7,RowsExamined:8,Timestamp:9,Sql:10,};function parseQueryTime(logLine){const aMap={};const queryTimeParts=logLine.substring("# Query_time: ".length).split("  Lock_time: ");const queryTime=queryTimeParts[0];const lockTimeParts=queryTimeParts[1].split("Rows_sent: ");const lockTime=lockTimeParts[0].trim();const rowsParts=lockTimeParts[1].split("Rows_examined: ");const rowsSent=rowsParts[0].trim();const rowsExamined=rowsParts[1].trim();aMap["Query_time"]={Type:"number",Value:queryTime};aMap["Lock_time"]={Type:"number",Value:lockTime};aMap["Rows_sent"]={Type:"number",Value:rowsSent};aMap["Rows_examined"]={Type:"number",Value:rowsExamined};return aMap}const results=[];let state=State.Start;let currentResult={};const lines=logContent.split('\\n');for(let i=0;i<lines.length;i++){const line=lines[i];switch(state){case State.Start:if(line.startsWith("# Time: ")){state=State.Time;currentResult={};currentResult["time"]={Type:"string",Value:line.substring("# Time: ".length)}}break;case State.Time:if(line.startsWith("# User@Host: ")){state=State.User;const parts=line.substring("# User@Host: ".length).split("  Id: ");currentResult["User"]={Type:"string",Value:parts[0]};currentResult["Host"]={Type:"string",Value:parts[1]}}break;case State.User:if(line.startsWith("# Query_time: ")){state=State.QueryTime;const queryTimeMap=parseQueryTime(line);currentResult={...currentResult,...queryTimeMap}}break;case State.QueryTime:if(line.startsWith("SET timestamp=")){state=State.Timestamp;currentResult["timestamp"]={Type:"number",Value:parseInt(line.substring("SET timestamp=".length))}}break;case State.Timestamp:if(line.trim()!==""){state=State.Start;currentResult["sql"]={Type:"string",Value:line};results.push(currentResult)}break}}return results}

现在输入是：
`
          let content = baseMessage + subStr
          // content = 'hi'
          console.log('content', content)
          const baseURL = "http://task.xiaohuasheng.cc"
          // const baseURL = "http://localhost:9091"
          var data = new FormData();
          data.append('content', content);

          var config = {
            method: 'post',
            url: baseURL + '/api/chatgpt',
            headers: {
              'Cookie': 'beegosessionID=018d39ffedf3de285eed2099cb1d751d; language=zh'
            },
            data: data
          };

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
            let result = convertAllLog(code, fileContent)
            let legendData = result.datasets.map(item => item.label)
            const option = _this.getOptions('', legendData, result.labels, result.datasets)
            _this.myChart.setOption(option);
          })
          .catch(function (error) {
                console.log(error);
              });
        };

        reader.readAsText(file);
      
      }
    },
    getOptions(text, legendData, xAxisData, seriesData) {
      const option = {
        title: {
          text: text || 'Line'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: legendData || ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: xAxisData || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: seriesData
      };
      return option
    }
  }
}
</script>

<style>
</style>
