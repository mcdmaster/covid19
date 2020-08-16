<template>
  <v-col cols="12" md="6" class="DataCard">
    <client-only>
      <data-table
        :title="$t('陽性者の属性')"
        :title-id="'attributes-of-confirmed-cases'"
        :chart-data="patientsTable"
        :chart-option="{}"
        :date="date"
        :info="sumInfoOfPatients"
        :source="$t('オープンデータを入手')"
        :custom-sort="customSort"
      />
    </client-only>
  </v-col>
</template>

<script>
import formatGraph from '@/utils/formatGraph'
import formatTable from '@/utils/formatTable'
import { getDayjsObject } from '@/utils/formatDate'
import DataTable from '@/components/DataTable.vue'
import bent from 'bent'
const getJSON = bent('json')

export default {
  components: {
    DataTable,
  },
  props: {
    date: String,
    patientsTable: formatTable.TableDataType,
    sumInfoOfPatients: { lText: String, sText: String, unit: String, },
  },
  data () {
    // Base Data Retrieval
    let Data
    const promise = (async () => {
      return await getJSON('https://api.data.metro.tokyo.lg.jp/v1/Covid19Patient?limit=1000')
    }) ()
    promise.then(res => {
      Data = res
      // 感染者数
      this.patientsTable = formatTable(JSON.stringify(Data))
      // 感染者数グラフ
      // patientsGraph = formatGraph(Data.patients_summary.data)
      // 陽性者の属性 ヘッダー翻訳
      if (this.patientsTable !== 'undefined' && this.patientsTable.headers !== 'undefined') {
        for (const header of this.patientsTable.headers) {
          header.text =
            header.value === '公表日' ? this.$t('公表日') :
            header.value === '居住地' ? this.$t('居住地') :
            header.value === '性別' ? this.$t('性別') :
            header.value === '年代' ? this.$t('年代') :
            header.value === '退院' ? this.$t('退院※') :
            this.$t(header.value)
        }
      }
      // 日付
      const lastDay = this.patientsTable.datasets[patientsTable.datasets.length - 1]['公表日']
      this.date = this.$d(getDayjsObject(lastDay).toDate(), 'dateWithoutYear')

      sumInfoOfPatients = {
        // lText: this.patientsTable[
        //   this.patientsTable.length - 1
        // ].cumulative.toLocaleString(),
        lText: (this.patientsTable.length - 1).toLocaleString(),
        sText: this.$t('{date}の累計', { date }),
        unit: this.$t('人'),
      }
      // 陽性者の属性 中身の翻訳
      for (const row of this.patientsTable.datasets) {
        row['居住地'] = this.getTranslatedWording(row['居住地'])
        row['性別'] = this.getTranslatedWording(row['性別'])
        row['退院'] = this.getTranslatedWording(row['退院'])
        if (row['年代'].substr(-1, 1) === '代') {
          const age = row['年代'].substring(0, 2)
          row['年代'] = this.$t('{age}代', { age })
        } else {
          row['年代'] = this.$t(row['年代'])
        }
      }
    })
    return [
      Data,
      this.patientsTable,
      this.sumInfoOfPatients,
    ]
  },
  beforeRouteEnter (to, from, next) {
    getPost(to.params.id, (err, post) => {
      next(vm => vm.setData(err, post))
    })
  },
  // when route changes and this component is already rendered,
  // the logic will be slightly different.
  beforeRouteUpdate (to, from, next) {
    this.post = null
    getPost(to.params.id, (err, post) => {
      this.setData(err, post)
      next()
    })
  },
  methods: {
    setData (err, post) {
      if (err) {
        this.error = err.toString()
      } else {
        this.post = post
      }
    },
    getTranslatedWording(value) {
      if (value === '-' || value === '‐' || value === '―' || value == null) {
        // 翻訳しようとしている文字列が以下のいずれかだった場合、翻訳しない
        // - 全角のハイフン
        // - 半角のハイフン
        // - 全角のダッシュ
        // - null
        return value
      }
      return this.$t(value)
    },
    customSort(items, index, isDesc) {
      const lt10 = this.$t('10歳未満').toString()
      const lt100 = this.$t('100歳以上').toString()
      const unknown = this.$t('不明').toString()
      const investigating = this.$t('調査中').toString()
      items.sort((a, b) => {
        // 両者が等しい場合は 0 を返す
        if (a[index[0]] === b[index[0]]) {
          return 0
        }
        let comparison = 0
        // '10歳未満' < '10代' ... '90代' < '100歳以上' となるようにソートする
        // 「10歳未満」同士を比較する場合、と「100歳以上」同士を比較する場合、更にそうでない場合に場合分け
        if (
          index[0] === '年代' &&
          (a[index[0]] === lt10 || b[index[0]] === lt10)
        ) {
          comparison = a[index[0]] === lt10 ? -1 : 1
        } else if (
          index[0] === '年代' &&
          (a[index[0]] === lt100 || b[index[0]] === lt100)
        ) {
          comparison = a[index[0]] === lt100 ? 1 : -1
        } else {
          comparison = String(a[index[0]]) < String(b[index[0]]) ? -1 : 1
        }
        // 公表日のソートを正しくする
        if (index[0] === '公表日') {
          // 2/29と3/1が正しくソートできないため、以下は使えない。
          // 公表日に年まで含む場合は以下が使用可能になり、逆に今使用しているコードが使用不可能となる。
          // comparison = new Date(a[index[0]]) < new Date(b[index[0]]) ? -1 : 1
          const aDate = a[index[0]].split('/').map((d) => {
            return parseInt(d)
          })
          const bDate = b[index[0]].split('/').map((d) => {
            return parseInt(d)
          })
          comparison = aDate[1] > bDate[1] ? 1 : -1
          if (aDate[0] > bDate[0]) {
            comparison = 1
          } else if (aDate[0] < bDate[0]) {
            comparison = -1
          }
        }
        // 「調査中」は年代に限らず、居住地にも存在するので、年代ソートの外に置いている。
        // 内容としては、「不明」の次に高い(大きい)ものとして扱う。
        // 日本語の場合、「調査中」は「不明」より低い(小さい)ものとして扱われるが、
        // 他言語の場合はそうではないため、ここで統一している。
        if (a[index[0]] === investigating || b[index[0]] === investigating) {
          comparison = a[index[0]] === investigating ? 1 : -1
        }
        // 「不明」は年代に限らず、性別にも存在するので、年代ソートの外に置いている。
        // 内容としては一番高い(大きい)ものとして扱う。
        if (a[index[0]] === unknown || b[index[0]] === unknown) {
          comparison = a[index[0]] === unknown ? 1 : -1
        }
        return isDesc[0] ? comparison * -1 : comparison
      })
      return items
    },
  },
}
</script>
