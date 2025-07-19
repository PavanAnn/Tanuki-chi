export interface ExtensionStatus {
  key: string
  extension: string
  status: Status[]
}

export type Status = {
  name: string
  status: StatusOptions
}

export type StatusOptions = 'OK' | 'MAINTENCE' | 'DOWN'
