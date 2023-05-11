<template>
  <div id="echarts" style="width: 600px;height:400px;"></div>
</template>

<script>
import * as echarts from 'echarts';
import {convertAllLog} from '@/parseNginxLog'
import {getParseCode} from '@/chatgpt'

export default {
  name: 'my-chart',
  components: {},
  mounted() {
    var myChart = echarts.init(document.getElementById('echarts'));

    const response = getParseCode('');
    console.log('response', response)

    // TODO 传参数每一种日志选一个字段来显示
    // let result = convertAllLog('', 'requestTime')
    let result = convertAllLog('', 'Rows_sent')
    console.log('result', result)
    let legendData = result.datasets.map(item => item.label)
    const option = this.getOptions('', legendData, result.labels, result.datasets)
    myChart.setOption(option);
  },
  methods: {
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
