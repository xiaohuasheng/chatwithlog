
/* eslint-disable */

<template>
  <input style="opacity: 0; position: fixed;" id="file-input" type="file" @change="inputChange" multiple/>
  <el-button type="primary" @click="btnClick">上传文件</el-button>
<!--  <label for="field-select">Select a field:</label>-->
<!--  <el-select v-model="selectedField" placeholder="Select" v-on:change="onFieldSelected">-->
<!--    <el-option-->
<!--      v-for="item in fields"-->
<!--      :key="item"-->
<!--      :label="item"-->
<!--      :value="item"-->
<!--    />-->
<!--  </el-select>-->
<!--  <p>You selected: {{ selectedField }}</p>-->
<!--  <el-input-->
<!--    v-model="textarea"-->
<!--    :rows="2"-->
<!--    type="textarea"-->
<!--    placeholder="Please input"-->
<!--    @change="inputTextareaChange"-->
<!--  />-->
  
  <div id="echarts" style="width: 1200px;height:700px;"></div>
</template>

<script>
import * as echarts from 'echarts';
import { requestChatgpt } from '@/chatgpt'
import {transformMysqlData, findFirstNumberProperty} from "@/parseNginxLog";
/* eslint-disable */



export default {
  name: 'my-chart',
  data() {
    return {
      myChart: null,
      originData: [],
      fields: [],
      selectedField: '',
      textarea: ''
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
    btnClick() {
      const ele = document.getElementById('file-input')
      ele.click();
    },
    inputTextareaChange(e) {
      console.log('e', e, e?.target.value)
    },
    getDataField(data) {
      if (data.length <= 0) {
        return []
      }
      return Object.keys(data[0])
    },
    onFieldSelected() {
      console.log(`Selected field: ${this.selectedField}`)
      // do something with the selected field value
      let chartData = transformMysqlData(this.originData, this.selectedField)
      this.setOption(chartData)
    },


    getSerieaData(resList, field) {
      console.log('resList', resList)
      let list = []
      let map = {}
      resList.forEach(item => {
        const labels = item.chartData.labels
        list.push(...labels)
        map = Object.assign(map, item.chartData.labelMap)
      })
      list = list.sort((a, b) => a.split('-')[1] - b.split('-')[1])
      const mysqlValue = []
      const nginxValue = []
      console.log('list', list)
      list.forEach((item) => {
        if (!field) {
          field = findFirstNumberProperty(map[item])
        }
        console.log('field', field, item, map[item])
        mysqlValue.push(map[item][field]?.Value || 0)
        nginxValue.push(map[item][field]?.Value || 0)
      })
      function formatDate(time) {
        const d = new Date(time * 1000)
        const yy = d.getFullYear()
        const mm = d.getMonth() + 1
        const dd = d.getDate()

        const hh = d.getHours()
        const m = d.getMinutes()
        const ss = d.getSeconds();
        const fill = (value) => {
          return value < 10 ? `0${value}` : value
        }


        return `${yy}-${fill(mm)}-${fill(dd)} ${fill(hh)}:${fill(m)}:${fill(ss)}`
      }
      const xAxisData = list.map(item => {
        const time = item.split('-')[1]
        return formatDate(time)
      })

      return {
        xAxisData,
        mysqlValue,
        nginxValue
      }
    },

    // 文件上传事件
    inputChange(e) {
      const files = e.target.files
      let self = this
      const promiseList = []
      for(let i = 0; i < files.length; i++) {
        const file = files[i]
        const isMysql = file.name.includes('mysql')
        let reader = new FileReader();
        reader.onload = function(e){
          const fileContent = e.target.result
          let subStr = fileContent.substring(0, 500);
          promiseList.push(requestChatgpt(subStr, fileContent, isMysql ? 'mysql' : 'nginx'))
          if (i === files.length - 1) {
            Promise.all(promiseList).then(resList => {
              const { mysqlValue, nginxValue, xAxisData } = self.getSerieaData(resList)
              const seriesData = [
                  {
                    name: 'mysql',
                    type: 'line',
                    stack: 'Total',
                    data: mysqlValue,
                  },
                  {
                    name: 'nginx',
                    type: 'line',
                    stack: 'Total',
                    data: nginxValue,
                  },
              ]
              const option = self.getOptions('日志分析图表', xAxisData, seriesData)

              self.myChart.setOption(option);
            })
          }
        };

        reader.readAsText(file);
      }
    },
    getOptions(text, xAxisData, seriesData) {
      const option = {
        title: {
          text: text || 'Line'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['mysql', 'nginx']
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
          data: xAxisData
        },
        yAxis: {
          type: 'value'
        },
        series: seriesData
      };
      return option
    },
    setOption(result) {
      let legendData = result.datasets.map(item => item.label)
      const option = this.getOptions('', legendData, result.labels, result.datasets)
      this.myChart.setOption(option);
    }
  }
}
</script>

<style>
</style>
