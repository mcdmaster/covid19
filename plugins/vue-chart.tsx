import { Plugin } from '@nuxt/types'
import { Chart, ChartData, ChartOptions } from 'chart.js'
import { defineComponent, ref } from '@nuxtjs/composition-api'
import { LineChart, BarChart, DoughnutChart } from 'vue-chart-3'

import { useDayjsAdapter } from '@/plugins/chartjs-adapter-dayjs'

const VueChartPlugin: Plugin = ({ app }) => {
  useDayjsAdapter(app.i18n)
  const createCustomChart = {
    generalChart: () => defineComponent({ // eslint-disable-next-line vue/one-component-per-file
      id: 'GeneralChart',
      components: {
        LineChart,
        BarChart,
        DoughnutChart,
      },
      setup() {
        const lineRef = ref<typeof LineChart>()
        const barRef = ref<typeof BarChart>()
        const doughnutRef = ref<typeof DoughnutChart>()
        const optionRef = ref<ChartOptions>({
          responsive: true,
        })
      },
      methods: {
        watchDisplayLegends (this, v?: any): void {
          if (v == null) {
            return
          }
          if (v.length === 0) {
            return
          }
          const chart: Chart = app.$data._chart.chartInstance[0]
          v.forEach((display: any, i: number) => {
            chart.getDatasetMeta(i).hidden = !display
          })
          chart.update()
        },
        async width () {
          try {
            const chart = app.$data._chart 
            await chart.resize()
          } catch(e: any) {
          } finally {
            app.$emit('update-width')
          }
        },
      },
    }),
  }
}

export default VueChartPlugin

const rgba0 = 'rgba(255,255,255,0)'
const rgba1 = 'rgba(255,255,255,1)'

export const yAxesBgPlugin = [
  {
    beforeDraw(chartInstance: any) {
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
    beforeDraw(chartInstance: any) {
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
  data(): T[] []
}

export interface DataSetsPoint<T = { x: string; y: number }> extends ChartData {
  data(): T[] []
}

export interface DisplayData<T = number, U = string> {
  labels?: U[]
  datasets: DataSets<T>[]
}
