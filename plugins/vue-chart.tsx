import Vue, { CreateElement } from 'vue'
import NuxtOptionsRender, { NuxtConfig, NuxtAppOptions, Plugin } from '@nuxt/types'
import { Chart, ChartData, ChartOptions, ChartType } from 'chart.js'
import { PropType } from 'vue'
import mixins, { Line, Bar, Doughnut } from 'react-chartjs-2'

import { useDayjsAdapter } from '@/plugins/chartjs-adapter-dayjs'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      yAxesBgPlugin: Object,
      yAxesBgRightPlugin: Object,
    }
  }
}

const VueChartPlugin: Plugin = ({ app }) => {
  useDayjsAdapter(app.i18n)
  createCustomChart(app)
}

const createCustomChart = (app: NuxtAppOptions) => {
  const { reactiveProp } = mixins

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

  const rgba0 = 'rgba(255,255,255,0)'
  const rgba1 = 'rgba(255,255,255,1)'
  
  const yAxesBgPlugin = () => [
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
  
  const yAxesBgRightPlugin = () => [
    {
      beforeDraw(chartInstance: any): void {
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

  const generalChart: NuxtConfig = {
    // eslint-disable-next-line vue/one-component-per-file
    mixins: [reactiveProp],
    computed: {
      h: (_: any) => { return (_) as CreateElement },
      render (): typeof NuxtOptionsRender {
        return (
          <HTMLCanvasElement>
            <Line />
            <Bar />
            <Doughnut />
          </HTMLCanvasElement>
        )
      },
    },
    props: {
      displayLegends: Array<boolean>(),
      options: {
        type: Object as PropType<ChartOptions>,
        default: () => {},
      },
    },
    data(): Object {
      return {
        chartData: {
          type: Object as PropType<ChartData>,
          default: () => {},
        },
        counter: 0,
        focusing: false,
      }
    },
    methods: {
      // ported from vue-chartjs@3.5.1/src/BaseChart.js
      renderChart (chartData: ChartData, options: ChartOptions): void {
        let chartType = {} as ChartType 
        if (this.$data._chart) {
          chartType = this.$data._chart.chartType
          this.$data._chart.destroy()
        }
        if (!this.$refs.canvas) throw new Error('Please remove the <template></template> tags from your chart component. See https://vue-chartjs.org/guide/#vue-single-file-components')
        this.$data._chart = new Chart(
          this.$refs.canvas.getContext('2d'), {
            type: chartType,
            data: chartData,
            options,
            plugins: this.$data._plugins
          }
        )
      },
    },
    $watch: {
      displayLegends: watchDisplayLegends,
      width() {
        setTimeout(() => app._chart.resize())
        app.$emit('update-width')
      },
    },
    async mounted() {
      // setTimeout(() => this.renderChart(this.$data.chartData, this.$props.options))
      await this.methods.renderChart(this.$data.chartData, this.$props.options)
    },
  }

  const h = generalChart.computed.h
  Vue.component('LineChart', <Line />)
  Vue.component('Bar', <Bar />)
  Vue.component('Doughnut', <Doughnut />)
}

export const yAxesBgRightPlugin = []
export const yAxesBgPlugin = []

export default VueChartPlugin

export interface DataSets<T = number> extends ChartData {
  data(): T[]
}

export interface DataSetsPoint<T = { x: string; y: number }> extends ChartData {
  data(): T[]
}

export interface DisplayData<T = number, U = string> {
  labels?: U[]
  datasets: DataSets<T>[]
}
