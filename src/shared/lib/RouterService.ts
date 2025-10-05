//@ts-expect-error can't find type
import { Router } from '@remix-run/router'
import { reaction } from 'mobx'
import { createBrowserRouter, type RouteObject } from 'react-router-dom'
import { type IBootstrapService } from 'src/shared/config'

export class RouterService {
  private reactionDisposer: (() => void) | null = null

  constructor(private readonly bootstrapService: IBootstrapService) {
    this.init()
  }

  private _router: Router | null = null
  private _routes: RouteObject[] | null = null

  public addRootRoutes(routes: RouteObject[]) {
    this._routes = routes
  }

  public get router() {
    if (!this._router) {
      throw new Error('Router not found')
    }

    return this._router
  }

  public navigate(...args: Parameters<Router['navigate']>) {
    return this.router.navigate(...args)
  }

  private init() {
    this.reactionDisposer = reaction(
      () => this.bootstrapService.isLoaded,
      (isLoaded) => {
        if (isLoaded) {
          if (!this._routes) {
            throw new Error('Invalid _routes')
          }

          this._router = createBrowserRouter(this._routes)
          this.reactionDisposer?.()
          this.reactionDisposer = null
        }
      },
    )
  }

  public dispose() {
    this.reactionDisposer?.()
    this.reactionDisposer = null
  }
}
