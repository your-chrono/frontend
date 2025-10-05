import { makeAutoObservable, reaction, runInAction } from 'mobx'
import { ApiService, container } from 'src/shared/lib'

type UserFragment = {
  email: string
}

const TOKEN_KEY = 'token'

export class AuthService {
  public isLoaded = false

  public user: UserFragment | null = null
  public token: string | null = null

  constructor(
    private readonly storage: Storage,
    private readonly apiService: ApiService,
    private readonly onLogin: () => void,
    private readonly onLogout: () => void,
  ) {
    makeAutoObservable(this)
  }

  public async setToken(token: string | null) {
    this.token = token
    this.apiService.setToken(this.token)

    if (this.token) {
      await this.fetchMe()
    }
  }

  public async init() {
    this.signToToken()
    this.signToUser()

    await this.setToken(this.loadToken())

    this.setIsChecked(true)
  }

  private loadToken() {
    return this.storage.getItem(TOKEN_KEY)
  }

  public async fetchMe() {
    try {
      const result = { user: { email: 'test' } }
      runInAction(() => {
        this.user = result.user
      })
    } catch (e) {
      console.error(e)
      runInAction(() => {
        this.token = null
      })
    }
  }

  public async loginWithYandexToken(accessToken: string) {
    try {
      const result = await this.apiService.client.login({ data: { accessToken } })
      await this.setToken(result.login.token)
      return result
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  public logout() {
    this.token = null
    this.user = null
    this.apiService.setToken(null)

    this.apiService.updateHeaders()
  }

  public updateUser(data: Partial<{ firstName: string; lastName: string }>) {
    if (this.user) {
      Object.assign(this.user, data)
    }
  }

  private setIsChecked(value: boolean) {
    this.isLoaded = value
  }

  private signToToken() {
    reaction(
      () => this.token,
      (nextToken) => {
        if (nextToken) {
          this.storage.setItem(TOKEN_KEY, nextToken)
        } else {
          this.storage.removeItem(TOKEN_KEY)
        }
      },
    )
  }

  private signToUser() {
    reaction(
      () => this.user,
      (user, previousUser) => {
        if (user && !previousUser) {
          this.onLogin()
        } else if (!user) {
          this.onLogout()
        }
      },
    )
  }
}

const onLogin = () => {
  container.startSession()
}

const onLogout = () => {
  container.stopSession()
}

container.register(
  AuthService,
  () => {
    const apiService = container.get(ApiService)

    return new AuthService(localStorage, apiService, onLogin, onLogout)
  },
  { scope: 'singleton' },
)
