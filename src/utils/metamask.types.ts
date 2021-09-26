declare global {
  interface Window {
    ethereum?: ExternalProvider
    BinanceChain?: any
  }
}

export interface RequestArguments {
  readonly method: string
  readonly params?: readonly unknown[] | object
}

export interface ProviderRpcError extends Error {
  code: number
  data?: unknown
}

export interface ProviderMessage {
  readonly type: string
  readonly data: unknown
}

export interface ProviderConnectInfo {
  readonly chainId: string
}

export interface EthereumEvent {
  connect: ProviderConnectInfo
  disconnect: ProviderRpcError
  accountsChanged: Array<string>
  chainChanged: string
  message: ProviderMessage
}

type EventKeys = keyof EthereumEvent
type EventHandler<K extends EventKeys> = (event: EthereumEvent[K]) => void

export interface Ethereumish {
  autoRefreshOnNetworkChange: boolean
  chainId: string
  isMetaMask?: boolean
  isStatus?: boolean
  networkVersion: string
  selectedAddress: any

  on<K extends EventKeys>(event: K, eventHandler: EventHandler<K>): void
  enable(): Promise<any>
  request?: (request: { method: string; params?: Array<any> }) => Promise<any>
  /**
   * @deprecated
   */
  send?: (
    request: { method: string; params?: Array<any> },
    callback: (error: any, response: any) => void
  ) => void
  sendAsync: (request: RequestArguments) => Promise<unknown>
}

export interface ExternalProvider {
  isMetaMask: boolean
  isStatus: boolean
  host: string
  path: string
  on<K extends EventKeys>(event: K, eventHandler: EventHandler<K>): void
  isConnected: () => boolean
  sendAsync?: (
    request: { method: string; params?: Array<any> },
    callback: (error: any, response: any) => void
  ) => void
  send?: (
    request: { method: string; params?: Array<any> },
    callback: (error: any, response: any) => void
  ) => void
  _metamask: any
  request: (request: { method: string; params?: Array<any> }) => Promise<any>
}
