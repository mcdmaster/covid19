import Vue from 'vue'
import { Plugin, NuxtConfig } from '@nuxt/types'
import { BarController, Chart, ChartData, ChartOptions, DoughnutController, LineController, registerables } from 'chart.js'

import { useDayjsAdapter } from '@/plugins/chartjs-adapter-dayjs'

type ChartVCData = { chartData: ChartData }
type ChartVCMethod = {
  renderChart(chartData: ChartData, options: ChartOptions): void
}
type ChartVCComputed = unknown
type ChartVCProps = { options: Object; displayLegends: boolean[] | null }

const VueChartPlugin: Plugin = ({ app }: any) => {
  useDayjsAdapter(app.i18n)
  createCustomChart(app)
}

const rgba0 = 'rgba(255,255,255,0)'
const rgba1 = 'rgba(255,255,255,1)'

const createCustomChart = (app: any) => {

  const watchDisplayLegends = function (this: Vue, v?: boolean[] | null) {
    if (v == null) {
      return
    }
    if (v.length === 0) {
      return
    }
    const chart: Chart = this.$data._chart
    v.forEach((display, i) => {
      chart.getDatasetMeta(i).hidden = !display
    })
    chart.update()
  }

  const generalChart: NuxtConfig = {
    // eslint-disable-next-line vue/one-component-per-file
    props: {
      displayLegends: {
        type: Array,
        default: () => null,
      },
      options: {
        type: Object as ChartOptions,
        default: () => {},
      },
    },
    $watch: {
      displayLegends: watchDisplayLegends,
      width() {
        setTimeout(() => app._chart.resize())
        app.$emit('update-width')
      },
    },
    mounted() {
      setTimeout(() => this.renderChart(this.chartData, this.options))
    },
  }

  Vue.component('LineChart', {
    data() { return { ...generalChart } },
    mixins: [LineController.defaults],
    render(h: any) { return h(this.data) },
  })
  Vue.component('Bar', {
    data() { return { ...generalChart } },
    mixins: [BarController.defaults],
    render(h: any) { return h(this.data) },
  })
  Vue.component('DoughnutChart', {
    data() { return { ...generalChart } },
    mixins: [DoughnutController.defaults],
    render(h: any) { return h(this.data) },
  })
}

export default VueChartPlugin

export const yAxesBgPlugin = [
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

export const yAxesBgRightPlugin = [
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

export interface DataSets<T = number> extends ChartData {
  data: T[]
}

export interface DataSetsPoint<T = { x: string; y: number }> extends ChartData {
  data: T[]
}

export interface DisplayData<T = number, U = string> {
  labels?: U[]
  datasets: DataSets<T>[]
}
