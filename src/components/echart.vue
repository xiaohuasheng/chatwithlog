<template>
  <input style="opacity: 0; position: fixed;" id="file-input" type="file" @change="inputChange" multiple/>
  <el-button type="primary" @click="btnClick">上传文件</el-button>
  <label for="field-select">Select a field:</label>
  <el-select v-model="selectedField" placeholder="Select" v-on:change="onFieldSelected">
    <el-option
      v-for="item in fields"
      :key="item"
      :label="item"
      :value="item"
    />
  </el-select>
  <p>You selected: {{ selectedField }}</p>
  <el-input
    v-model="textarea"
    :rows="2"
    type="textarea"
    placeholder="Please input"
    @change="inputTextareaChange"
  />
  
  <div id="echarts" style="width: 1200px;height:700px;"></div>
</template>

<script>
import * as echarts from 'echarts';
import { requestChatgpt } from '@/chatgpt'
import {transformData} from "@/parseNginxLog";



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
      let chartData = transformData(this.originData, this.selectedField)
      this.setOption(chartData)
    },
    // 文件上传事件
    inputChange(e) {
      console.log('inputChange', e)
      const files = e.target.files
      console.log('files', files)
      let self = this
      for(let i = 0; i < files.length; i++) {
        const file = files[i]
        let reader = new FileReader();
        reader.onload = function(e){
          const fileContent = e.target.result
          let subStr = fileContent.substring(0, 500);
          requestChatgpt(subStr, fileContent).then(({ chartData, originData }) => {
            console.log('chartData', chartData, originData);
            
            const field = self.getDataField(originData)
            console.log('field', field)
            self.fields = field
            self.originData = originData
            self.setOption(chartData)
          })
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
