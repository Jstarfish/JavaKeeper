import { PluginFunc, ConfigType } from 'dayjs/esm'

declare const plugin: PluginFunc
export = plugin

declare module 'dayjs/esm' {
  interface Dayjs {
    tz(timezone: string): Dayjs
  }

  interface DayjsTimezone {
    (date: ConfigType, timezone: string): Dayjs
    guess(): string
  }

  const tz: DayjsTimezone
}
