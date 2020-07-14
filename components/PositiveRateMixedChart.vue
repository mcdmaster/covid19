<template>
  <data-view
    :title="title"
    :title-id="titleId"
    :date="date"
    :head-title="title + infoTitles.join(',')"
  >
    <ul
      :class="$style.GraphLegend"
      :style="{ display: canvas ? 'block' : 'none' }"
    >
      <li
        v-for="(dataLabel, i) in dataLabels"
        :key="i"
        @click="onClickLegend(i)"
      >
        <button>
          <div
            v-if="i === 4"
            :style="{
              background: `repeating-linear-gradient(90deg, ${colors[i].fillColor}, ${colors[i].fillColor} 2px, #fff 2px, #fff 4px)`,
              border: 0,
              height: '3px'
            }"
          />
          <div
            v-else-if="i === 5"
            :style="{
              background: `repeating-linear-gradient(90deg, ${colors[2].fillColor}, ${colors[2].fillColor} 20%, ${colors[4].fillColor})`,
              border: 0,
              height: '3px'
            }"
          />
          <div
            v-else
            :style="{
              backgroundColor: colors[i].fillColor,
              borderColor: colors[i].strokeColor
            }"
          />
          <span
            :style="{
              textDecoration: displayLegends[i] ? 'none' : 'line-through'
            }"
            >{{ dataLabel }}</span
          >
        </button>
      </li>
    </ul>
    <h4 :id="`${titleId}-graph`" class="visually-hidden">
      {{ $t(`{title}のグラフ`, { title }) }}
    </h4>
    <scrollable-chart v-show="canvas" :display-data="displayData">
      <template v-slot:chart="{ chartWidth }">
        <bar
          :ref="'barChart'"
          :chart-id="chartId"
          :chart-data="displayData"
          :options="displayOption"
          :display-legends="displayLegends"
          :height="240"
          :width="chartWidth"
        />
      </template>
      <template v-slot:sticky-chart>
        <bar
          class="sticky-legend"
          :chart-id="`${chartId}-header-right`"
          :chart-data="displayDataHeader"
          :options="displayOptionHeader"
          :plugins="yAxesBgRightPlugin"
          :display-legends="displayLegends"
          :height="240"
        />
      </template>
    </scrollable-chart>
    <template v-slot:additionalDescription>
      <slot name="additionalDescription" />
    </template>
    <template v-slot:dataTable>
      <data-view-table :headers="tableHeaders" :items="tableData" />
    </template>
    <template v-slot:dataSetPanel>
      <data-view-data-set-panel
        :title="infoTitles[0]"
        :l-text="displayInfo[0].lText"
        :s-text="displayInfo[0].sText"
        :unit="displayInfo[0].unit"
      />
      <data-view-data-set-panel
        :title="infoTitles[1]"
        :l-text="displayInfo[1].lText"
        :s-text="displayInfo[1].sText"
        :unit="displayInfo[1].unit"
      />
    </template>
  </data-view>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { TranslateResult } from 'vue-i18n'
import { Chart } from 'chart.js'
import dayjs from 'dayjs'
import DataView from '@/components/DataView.vue'
import DataViewTable, {
  TableHeader,
  TableItem
} from '@/components/DataViewTable.vue'
import DataViewDataSetPanel from '@/components/DataViewDataSetPanel.vue'
import ScrollableChart from '@/components/ScrollableChart.vue'
import {
  DisplayData,
  yAxesBgPlugin,
  yAxesBgRightPlugin
} from '@/plugins/vue-chart'
import {
  getGraphSeriesStyle,
  getGraphSeriesColor,
  SurfaceStyle
} from '@/utils/colors'
import { getNumberToFixedFunction } from '@/utils/monitoringStatusValueFormatters'

interface HTMLElementEvent<T extends HTMLElement> extends MouseEvent {
  currentTarget: T
}
type Data = {
  canvas: boolean
  displayLegends: boolean[]
  colors: SurfaceStyle[]
}
type Methods = {
  pickLastNumber: (chartDataArray: number[][]) => number[]
  pickLastSecondNumber: (chartDataArray: number[][]) => number[]
  onClickLegend: (i: number) => void
  formatDayBeforeRatio: (dayBeforeRatio: number, formatter: number) => string
}
type DisplayInfo = {
  lText: string
  sText: string
  unit: string
}
type Computed = {
  displayData: DisplayData
  displayDataHeader: DisplayData
  displayTransitionRatio: string
  displayInspectionsTransitionRatio: string
  displayInfo: DisplayInfo[]
  displayOption: Chart.ChartOptions
  displayOptionHeader: Chart.ChartOptions
  scaledTicksYAxisMax: number
  scaledTicksYAxisMaxRight: number
  tableHeaders: TableHeader[]
  tableData: TableItem[]
}
type Props = {
  title: string
  titleId: string
  infoTitles: string[]
  chartId: string
  chartData: number[][]
  getFormatter: Function
  date: string
  labels: string[]
  dataLabels: string[] | TranslateResult[]
  tableLabels: string[] | TranslateResult[]
  unit: string
  optionUnit: string
  yAxesBgPlugin: Chart.PluginServiceRegistrationOptions[]
  yAxesBgRightPlugin: Chart.PluginServiceRegistrationOptions[]
}

const options: ThisTypedComponentOptionsWithRecordProps<
  Vue,
  Data,
  Methods,
  Computed,
  Props
> = {
  created() {
    // canvas = process.browser
  },
  components: {
    DataView,
    DataViewTable,
    DataViewDataSetPanel,
    ScrollableChart
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    titleId: {
      type: String,
      required: false,
      default: ''
    },
    infoTitles: {
      type: Array,
      required: false,
      default: () => []
    },
    chartId: {
      type: String,
      default: 'PositiveRateMixedChart'
    },
    chartData: {
      type: Array,
      required: false,
      default: () => []
    },
    getFormatter: {
      type: Function,
      required: false,
      default: (_any: number) => getNumberToFixedFunction()
    },
    date: {
      type: String,
      required: true,
      default: ''
    },
    labels: {
      type: Array,
      default: () => []
    },
    dataLabels: {
      type: Array,
      default: () => []
    },
    tableLabels: {
      type: Array,
      default: () => []
    },
    unit: {
      type: String,
      default: ''
    },
    optionUnit: {
      type: String,
      required: false,
      default: ''
    },
    yAxesBgPlugin: {
      type: Array,
      default: () => yAxesBgPlugin
    },
    yAxesBgRightPlugin: {
      type: Array,
      default: () => yAxesBgRightPlugin
    }
  },
  data() {
    return {
      displayLegends: [true, true, true, true, true, true],
      colors: [...getGraphSeriesStyle(4), getGraphSeriesColor('E')],
      canvas: true
    }
  },
  computed: {
    displayData() {
      const self = this
      // let ret = false
      let gradientStroke: any = self.colors[4].fillColor
      // while (ret === false) {
      //   async () => {
      //     try {
      // await
      const ctx = (self.$refs[
        `${this.chartId}`
      ] as HTMLCanvasElement).getContext('2d')
      if (ctx) {
        const beginning = dayjs('2020-02-15').unix()
        const earlyDays = dayjs('2020-05-07').unix() - beginning
        const wholeDays =
          dayjs(new Date(self.labels[self.labels.length - 1])).unix() -
          beginning
        const gradientRatio = parseFloat((earlyDays / wholeDays).toPrecision(2))
        gradientStroke = ctx.createLinearGradient(0, 0, 300, 0)
        gradientStroke.addColorStop(0, self.colors[2].fillColor)
        if (gradientRatio > 0 && gradientRatio < 1) {
          gradientStroke.addColorStop(gradientRatio, self.colors[2].fillColor)
        }
        gradientStroke.addColorStop(1, self.colors[4].fillColor)
        //        ret = true
        //       } else {
        //         ret = false
        //       }
        //     } catch(error) {
        //       ret = false
        //    }
        //  }
      }

      return {
        labels: self.labels,
        datasets: [
          {
            type: 'bar',
            yAxisID: 'y-axis-1',
            label: self.dataLabels[0],
            data: self.chartData[0],
            backgroundColor: self.colors[0].fillColor,
            borderColor: self.colors[0].strokeColor,
            borderWidth: 1,
            borderDash: [0],
            order: 1,
            tension: 0
          },
          {
            type: 'bar',
            yAxisID: 'y-axis-1',
            label: self.dataLabels[1],
            data: self.chartData[1],
            backgroundColor: self.colors[1].fillColor,
            borderColor: self.colors[1].strokeColor,
            borderWidth: 1,
            borderDash: [0],
            order: 2,
            tension: 0
          },
          {
            type: 'bar',
            yAxisID: 'y-axis-1',
            label: self.dataLabels[2],
            data: self.chartData[2],
            backgroundColor: self.colors[2].fillColor,
            borderColor: self.colors[2].strokeColor,
            borderWidth: 1,
            borderDash: [0],
            order: 3,
            tension: 0
          },
          {
            type: 'bar',
            yAxisID: 'y-axis-1',
            label: self.dataLabels[3],
            data: self.chartData[3],
            backgroundColor: self.colors[3].fillColor,
            borderColor: self.colors[3].strokeColor,
            borderWidth: 1,
            borderDash: [0],
            order: 4,
            tension: 0
          },
          {
            type: 'line',
            yAxisID: 'y-axis-1',
            label: self.dataLabels[4],
            data: self.chartData[4],
            backgroundColor: 'rgba(0,0,0,0)',
            borderColor: self.colors[4].strokeColor,
            borderWidth: 3,
            borderDash: [4, 4],
            order: 0,
            tension: 0
          },
          {
            type: 'line',
            yAxisID: 'y-axis-2',
            label: self.dataLabels[5],
            data: self.chartData[5],
            backgroundColor: 'rgba(0,0,0,0)',
            borderColor: gradientStroke,
            borderWidth: 3,
            borderDash: [0],
            order: 0,
            tension: 0
          }
        ]
      }
    },
    displayDataHeader() {
      let n = 0
      let max = 0
      for (const i in this.displayData.datasets[0].data) {
        const current =
          this.displayData.datasets[0].data[i] +
          this.displayData.datasets[1].data[i] +
          this.displayData.datasets[2].data[i] +
          this.displayData.datasets[3].data[i]
        if (current > max) {
          max = current
          n = Number(i)
        }
      }

      return {
        labels: ['2020/1/1'],
        datasets: [
          {
            data: [this.displayData.datasets[0].data[n]],
            backgroundColor: 'transparent',
            yAxisID: 'y-axis-1',
            borderWidth: 0
          },
          {
            data: [this.displayData.datasets[1].data[n]],
            backgroundColor: 'transparent',
            yAxisID: 'y-axis-1',
            borderWidth: 0
          },
          {
            data: [this.displayData.datasets[2].data[n]],
            backgroundColor: 'transparent',
            yAxisID: 'y-axis-1',
            borderWidth: 0
          },
          {
            data: [this.displayData.datasets[3].data[n]],
            backgroundColor: 'transparent',
            yAxisID: 'y-axis-1',
            borderWidth: 0
          },
          {
            data: [0],
            backgroundColor: 'transparent',
            yAxisID: 'y-axis-1',
            borderWidth: 0
          },
          {
            data: [this.displayData.datasets[5].data[n]],
            backgroundColor: 'transparent',
            yAxisID: 'y-axis-2',
            borderWidth: 0
          }
        ]
      }
    },
    displayTransitionRatio() {
      const lastDay = this.pickLastNumber(this.chartData)[5]
      const lastDayBefore = this.pickLastSecondNumber(this.chartData)[5]
      return this.formatDayBeforeRatio(lastDay - lastDayBefore, 5)
    },
    displayInspectionsTransitionRatio() {
      const lastDay = this.pickLastNumber(this.chartData)[4]
      const lastDayBefore = this.pickLastSecondNumber(this.chartData)[4]
      return this.formatDayBeforeRatio(lastDay - lastDayBefore, 4)
    },
    displayInfo() {
      const date = this.$d(
        new Date(this.labels[this.labels.length - 1]),
        'dateWithoutYear'
      )
      return [
        {
          lText: this.getFormatter(5)(this.pickLastNumber(this.chartData)[5]),
          sText: `${this.$t('{date}の数値', {
            date
          })}（${this.$t('前日比')}: ${this.displayTransitionRatio} ${
            this.unit
          }）`,
          unit: this.unit
        },
        {
          lText: this.getFormatter(4)(this.pickLastNumber(this.chartData)[4]),
          sText: `${this.$t('{date}の数値', {
            date
          })}（${this.$t('前日比')}: ${
            this.displayInspectionsTransitionRatio
          } ${this.optionUnit}）`,
          unit: this.optionUnit
        }
      ]
    },
    tableHeaders() {
      return [
        { text: this.$t('日付'), value: 'text' },
        ...(this.tableLabels as string[]).map((text, i) => {
          return { text, value: String(i), align: 'end' }
        })
      ]
    },
    tableData() {
      return this.labels
        .map((label, i) => {
          return Object.assign(
            { text: dayjs(label).format('M/D') },
            ...(this.dataLabels as string[]).map((_any, j) => {
              if (this.chartData[j][i] === null) {
                return {
                  [j]: ''
                }
              }
              return {
                [j]: this.getFormatter(j)(this.chartData[j][i])
              }
            })
          )
        })
        .sort((a, b) => dayjs(a.text).unix() - dayjs(b.text).unix())
        .reverse()
    },
    displayOption() {
      const self = this
      const unit = this.unit
      const options: Chart.ChartOptions = {
        tooltips: {
          displayColors: false,
          callbacks: {
            label: tooltipItem => {
              const cases = this.getFormatter(tooltipItem.datasetIndex!)(
                parseFloat(tooltipItem.value!)
              )
              let label = `${
                this.dataLabels[tooltipItem.datasetIndex!]
              } : ${cases} ${this.$t('人')}`
              if (tooltipItem.datasetIndex! >= 5) {
                label = `${
                  this.dataLabels[tooltipItem.datasetIndex!]
                } : ${cases} ${unit}`
              }
              return label
            },
            title(tooltipItem, data) {
              const label = data.labels![tooltipItem[0].index!].toString()
              return self.$d(new Date(label), 'dateWithoutYear')
            }
          }
        },
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        scales: {
          xAxes: [
            {
              id: 'day',
              stacked: true,
              gridLines: {
                display: false
              },
              ticks: {
                fontSize: 9,
                maxTicksLimit: 20,
                fontColor: '#808080',
                maxRotation: 0,
                callback: (label: string) => {
                  return dayjs(label).format('D')
                }
              }
              // #2384: If you set "type" to "time", make sure that the bars at both ends are not hidden.
              // #2384: typeをtimeに設定する時はグラフの両端が見切れないか確認してください
            },
            {
              id: 'month',
              stacked: true,
              gridLines: {
                drawOnChartArea: false,
                drawTicks: true,
                drawBorder: false,
                tickMarkLength: 10
              },
              ticks: {
                fontSize: 11,
                fontColor: '#808080',
                padding: 3,
                fontStyle: 'bold'
              },
              type: 'time',
              time: {
                unit: 'month',
                displayFormats: {
                  month: 'MMM'
                }
              }
            }
          ],
          yAxes: [
            {
              id: 'y-axis-1',
              position: 'left',
              stacked: true,
              gridLines: {
                display: true,
                drawOnChartArea: true,
                color: '#E5E5E5' // #E5E5E5
              },
              ticks: {
                suggestedMin: 0,
                maxTicksLimit: 8,
                fontColor: '#808080', // #808080
                suggestedMax: this.scaledTicksYAxisMax
              }
            },
            {
              id: 'y-axis-2',
              position: 'right',
              gridLines: {
                display: true,
                drawOnChartArea: false,
                color: '#E5E5E5' // #E5E5E5
              },
              ticks: {
                suggestedMin: 0,
                maxTicksLimit: 8,
                fontColor: '#808080', // #808080
                suggestedMax: this.scaledTicksYAxisMaxRight,
                callback(value) {
                  return `${value}%`
                }
              }
            }
          ]
        }
      }
      if (this.$route.query.ogp === 'true') {
        Object.assign(options, { animation: { duration: 0 } })
      }
      return options
    },
    displayOptionHeader() {
      const options: Chart.ChartOptions = {
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        tooltips: { enabled: false },
        scales: {
          xAxes: [
            {
              id: 'day',
              stacked: true,
              gridLines: {
                display: false
              },
              ticks: {
                fontSize: 9,
                maxTicksLimit: 20,
                fontColor: 'transparent',
                maxRotation: 0,
                minRotation: 0,
                callback: (label: string) => {
                  return dayjs(label).format('D')
                }
              }
            },
            {
              id: 'month',
              stacked: true,
              gridLines: {
                drawOnChartArea: false,
                drawTicks: false, // true -> false
                drawBorder: false,
                tickMarkLength: 10
              },
              ticks: {
                fontSize: 11,
                fontColor: 'transparent', // #808080
                padding: 13, // 3 + 10(tickMarkLength)
                fontStyle: 'bold'
              },
              type: 'time',
              time: {
                unit: 'month'
              }
            }
          ],
          yAxes: [
            {
              id: 'y-axis-1',
              type: 'linear',
              position: 'left',
              stacked: true,
              gridLines: {
                display: true,
                drawOnChartArea: false,
                color: '#E5E5E5' // #E5E5E5
              },
              ticks: {
                suggestedMin: 0,
                maxTicksLimit: 8,
                fontColor: '#808080', // #808080
                suggestedMax: this.scaledTicksYAxisMax
              }
            },
            {
              id: 'y-axis-2',
              type: 'linear',
              position: 'right',
              stacked: true,
              gridLines: {
                display: true,
                drawOnChartArea: false,
                color: '#E5E5E5' // #E5E5E5
              },
              ticks: {
                suggestedMin: 0,
                maxTicksLimit: 8,
                fontColor: '#808080', // #808080
                suggestedMax: this.scaledTicksYAxisMaxRight,
                callback(value) {
                  return `${value}%`
                }
              }
            }
          ]
        },
        animation: { duration: 0 }
      }
      return options
    },
    scaledTicksYAxisMax() {
      let max = 0
      for (const i in this.chartData[0]) {
        max = Math.max(
          max,
          this.chartData[0][i] +
            this.chartData[1][i] +
            this.chartData[2][i] +
            this.chartData[3][i]
        )
      }
      return max
    },
    scaledTicksYAxisMaxRight() {
      let max = 0
      for (const i in this.chartData[5]) {
        max = Math.max(max, this.chartData[5][i])
      }
      return max
    }
  },
  methods: {
    onClickLegend(_i: number) {
      this.displayLegends[_i] = !this.displayLegends[_i]
      this.displayLegends = this.displayLegends.slice()
    },
    pickLastNumber(chartDataArray: number[][]) {
      return chartDataArray.map((array, _i) => {
        return array[array.length - 1]
      })
    },
    pickLastSecondNumber(chartDataArray: number[][]) {
      return chartDataArray.map((array, _i) => {
        return array[array.length - 2]
      })
    },
    formatDayBeforeRatio(dayBeforeRatio: number, formatter: number): string {
      const dayBeforeRatioLocaleString = this.getFormatter(formatter)(
        dayBeforeRatio
      )
      switch (Math.sign(dayBeforeRatio)) {
        case 1:
          return `+${dayBeforeRatioLocaleString}`
        case -1:
          return `${dayBeforeRatioLocaleString}`
        default:
          return `${dayBeforeRatioLocaleString}`
      }
    }
  },
  mounted() {
    const vueCanvas = this.$refs[`${this.chartId}`] as Element
    if (vueCanvas) {
      const labelledbyId = `${this.titleId}-graph`
      vueCanvas.setAttribute('role', 'img')
      vueCanvas.setAttribute('aria-labelledby', labelledbyId)
    }
    const chart = this.$data._chart
    if (chart) {
      chart.update()
    }
  }
}

export default Vue.extend(options)
</script>

<style module lang="scss">
.Graph {
  &Legend {
    text-align: center;
    list-style: none;
    padding: 0 !important;
    li {
      display: inline-block;
      margin: 0 3px;
      div {
        height: 12px;
        margin: 2px 4px;
        width: 40px;
        display: inline-block;
        vertical-align: middle;
        border-width: 1px;
        border-style: solid;
      }
      button {
        color: $gray-3;
        @include font-size(12);
      }
    }
  }
}
</style>
