<template>
  <input type="file" id="btn" @change="inputChange" multiple/>
  
  <div id="echarts" style="width: 1200px;height:700px;"></div>
</template>

<script>
import * as echarts from 'echarts';
import { requestChatgpt } from '@/chatgpt'



export default {
  name: 'my-chart',
  data() {
    return {
      myChart: null,
      originData: [],
      field: []
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
    getDataField(data) {
      if (data.length <= 0) {
        return []
      }
      return Object.keys(data[0])
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
            self.field = field
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
