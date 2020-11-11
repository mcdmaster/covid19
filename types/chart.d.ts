import { ConfigType, Dayjs, OpUnitType, QUnitType } from 'dayjs'

export type DateAdapterFormats = {
  datetime: string
  millisecond: string
  second: string
  minute: string
  hour: string
  day: string
  week: string
  month: string
  quarter: string
  year: string
}

declare module 'chart.js' {
  interface Options {
    _id: string
    formats: () => DateAdapterFormats
    parse: (time: ConfigType, format: string | undefined) => number | null
    format: (time: ConfigType, format: string) => string
    add: (time: ConfigType, amount: number, unit: OpUnitType) => Dayjs
    diff: (
      max: ConfigType,
      min: ConfigType,
      unit: QUnitType | OpUnitType
    ) => number
    startOf: (
      time: ConfigType,
      unit: OpUnitType,
      weekday: null | undefined
    ) => Dayjs
    endOf: (time: ConfigType, unit: OpUnitType) => Dayjs
  }

  interface DayjsDateAdapter {
    override: (options: Options) => void
  }

  export class _adapters {
    static _date: DayjsDateAdapter
  }
}
