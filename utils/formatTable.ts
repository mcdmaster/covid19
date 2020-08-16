import dayjs from 'dayjs'

type Header = {
  text: string
  value: string
  align?: string
}

type DataType = {
  公表_年月日: string
  都道府県名: string | null
  患者_年代: string | null
  患者_性別: '男性' | '女性' | string
  退院: '◯' | null
  [key: string]: any
}

type ColDataType = {
  公表日: string
  居住地: DataType['都道府県名']
  年代: DataType['患者_年代']
  性別: DataType['患者_性別'] | '不明'
  退院: DataType['退院']
}

type TableDataType = {
  headers: Header[]
  datasets: ColDataType[]
}

/**
 * Format for DataTable component
 *
 * @param data - Raw data
 */
export default function formatTable (data: DataType[]): TableDataType | undefined {
  let datasets = {} as ColDataType []
  if (data) {
    Array.from(data).forEach((d: DataType, index) => {
      datasets[index] = {
        '公表日': formatDateString(d['公表_年月日']) ?? '不明',
        '居住地': d['都道府県名'] ?? '調査中',
        '年代': d['患者_年代'] ?? '不明',
        '性別': d['患者_性別'] ?? '不明',
        '退院': d['退院'],
      }
    })
  }
  if (datasets.length > 0) {
    datasets.sort(
      function(a, b) {
        return b.公表日.localeCompare(a.公表日) // 降順 B -> A
      }
    )
    return {
      headers: [
        { text: '公表日', value: '公表日', },
        { text: '居住地', value: '居住地', },
        { text: '年代', value: '年代', },
        { text: '性別', value: '性別', },
        { text: '退院※', value: '退院', align: 'center', },
      ],
      datasets,
    }
  } else {
    return undefined
  }
}

function formatDateString(date: string): string | undefined {
  const day = dayjs(date)
  if (day.isValid()) {
    return dayjs(day.toDate()).format('M/D')
  }
}
