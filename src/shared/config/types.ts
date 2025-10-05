export interface IViewModel {
  init: (...args: unknown[]) => void | Promise<void>
  dispose: () => void
}
//---------
export interface ICartService {
  isLoading: boolean

  addItem(productId: string, quantity: number): Promise<void>

  updateItemQuantity(productId: string, quantity: number): Promise<void>

  removeItemFromCart(productId: string): Promise<void>

  isInCart(productId: string): boolean

  quantity(productId: string): number
}

export interface IProfileService {
  isUserExist: boolean
}

export interface IBootstrapService {
  isLoaded: boolean
}
