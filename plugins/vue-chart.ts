import { NuxtAppOptions, NuxtConfig, Plugin } from '@nuxt/types'
import { Chart, ChartData, ChartOptions, ChartType } from 'chart.js'
import CreateElement from 'vue'
import Vue from 'vue/types/umd'

import { useDayjsAdapter } from '@/plugins/chartjs-adapter-dayjs'

const VueChartPlugin: Plugin = (app) => {
  useDayjsAdapter((app as NuxtAppOptions).i18n)
  createCustomChart(app)
}

const createCustomChart = (app: any) => {
  const watchDisplayLegends = function (this: Vue, v?: boolean[] | null) {
    if (v == null || v.length === 0) {
      return
    }
    const chart: Chart = app.$data._chart
    v.forEach((display, i) => {
      chart.getDatasetMeta(i).hidden = !display
    })
    chart.update()
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _generalChart: NuxtConfig = {
    // eslint-disable-next-line vue/one-component-per-file
    props: {
      displayLegends: {
        type: Array,
        default: null,
      },
      options: {
        // eslint-disable-next-line no-new-object
        type: Object,
        default: {} as ChartOptions,
      },
    },
    data() {
      return {
        chartData: {} as Object,
      }
    },
    created() {
      this.$watch(
        'update-width',
        () => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const _width = (): void => {
            this.$props.displayLegends = watchDisplayLegends
            setTimeout(() => app._chart.resize())
            app.$emit('update-width')
          }
        },
        { immediate: true }
      )
    },
    // ported from vue-chartjs@3.5.1
    mounted() {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      function _renderChart(data: ChartData, options: ChartOptions) {
        let chartType = {} as ChartType
        if (app._chart) {
          chartType = app._chart.chartType
          app._chart.destroy()
        }
        if (!app.$refs.canvas) {
          throw new Error(
            'Please remove the <template></template> tags from your chart component. See https://vue-chartjs.org/guide/#vue-single-file-components'
          )
        }
        app._chart = new Chart(app._chart.ctx, {
          type: chartType,
          data,
          options,
          plugins: app._plugins,
        })
      }
    },
  }
}
// eslint-disable-next-line vue/one-component-per-file
Vue.component('LineChart', {
  render() {
    return new CreateElement({ name: 'lineChart' })
  },
})
// eslint-disable-next-line vue/one-component-per-file
Vue.component('Bar', {
  render() {
    return new CreateElement({ name: 'bar' })
  },
})
// eslint-disable-next-line vue/one-component-per-file
Vue.component('Doughnut', {
  render() {
    return new CreateElement({ name: 'doughnut' })
  },
})

export default VueChartPlugin

const rgba0 = 'rgba(255,255,255,0)'
const rgba1 = 'rgba(255,255,255,1)'

const yAxesBgPlugin = [
  {
    beforeDraw(chartInstance: Chart) {
      const ctx = chartInstance.ctx as CanvasRenderingContext2D

      // プロットエリアマスク用
      ctx.fillStyle = '#fff'
      ctx.fillRect(
        0,
        0,
        chartInstance.chartArea.left,
        chartInstance.chartArea.bottom + 1
      )

      // 横軸マスク用
      const gradient = ctx.createLinearGradient(
        0,
        0,
        chartInstance.chartArea.left,
        0
      )
      gradient.addColorStop(0, rgba1)
      gradient.addColorStop(1, rgba0)
      ctx.fillStyle = gradient
      ctx.fillRect(
        0,
        chartInstance.chartArea.bottom + 1,
        chartInstance.chartArea.left,
        (chartInstance.height as number) - chartInstance.chartArea.bottom - 1
      )
    },
  },
]

const yAxesBgRightPlugin = [
  {
    beforeDraw(chartInstance: Chart) {
      const ctx = chartInstance.ctx as CanvasRenderingContext2D

      // プロットエリアマスク用
      ctx.fillStyle = '#fff'
      ctx.fillRect(
        chartInstance.chartArea.right,
        0,
        chartInstance.width as number,
        chartInstance.chartArea.bottom + 1
      )
      ctx.fillRect(
        0,
        0,
        chartInstance.chartArea.left,
        chartInstance.chartArea.bottom + 1
      )
      // 横軸マスク用
      const gradientr = ctx.createLinearGradient(
        chartInstance.chartArea.right,
        0,
        chartInstance.width as number,
        0
      )
      const gradient = ctx.createLinearGradient(
        0,
        0,
        chartInstance.chartArea.left,
        0
      )
      gradient.addColorStop(0, rgba1)
      gradient.addColorStop(1, rgba0)
      gradientr.addColorStop(0, rgba0)
      gradientr.addColorStop(1, rgba1)
      ctx.fillStyle = gradientr
      ctx.fillRect(
        chartInstance.chartArea.right,
        chartInstance.chartArea.bottom + 1,
        chartInstance.width as number,
        (chartInstance.height as number) - chartInstance.chartArea.bottom - 1
      )
      ctx.fillStyle = gradient
      ctx.fillRect(
        0,
        chartInstance.chartArea.bottom + 1,
        chartInstance.chartArea.left,
        (chartInstance.height as number) - chartInstance.chartArea.bottom - 1
      )
    },
  },
]

export { yAxesBgPlugin, yAxesBgRightPlugin }

export interface DataSets<T = number> extends ChartData {
  data(): (Object | T)[] | Object
}

export interface DataSetsPoint<T = { x: string; y: number }> extends ChartData {
  data(): (Object | T)[] | Object
}

export interface DisplayData<T = number, U = string> {
  labels?: U[]
  datasets: DataSets<T>[]
}
