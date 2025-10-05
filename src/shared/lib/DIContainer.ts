/* eslint-disable @typescript-eslint/no-explicit-any */

type Factory<T> = () => T

type Scope = 'singleton' | 'transient' | 'session'

export interface IDisposable {
  dispose: () => void | Promise<void>
}

interface Registration<T> {
  factory: Factory<T>
  scope: Scope
  instance?: T
}

class DIContainer {
  private readonly registrations = new Map<new (...args: any[]) => any, Registration<any>>()

  private sessionActive = false

  public startSession(): void {
    this.sessionActive = true
  }

  public stopSession(): void {
    this.sessionActive = false

    for (const registration of this.registrations.values()) {
      if (registration.scope === 'session' && registration.instance) {
        registration.instance.dispose?.()
        registration.instance = undefined
      }
    }
  }

  public register<T>(token: new (...args: any[]) => T, factory: Factory<T>, options: { scope: Scope }): void {
    this.registrations.set(token, {
      factory,
      scope: options.scope,
    })
  }

  public get<T>(token: new (...args: any[]) => T): T {
    const registration = this.registrations.get(token) as Registration<T>

    if (!registration) {
      throw new Error(`No provider found for ${token.name}`)
    }

    if (registration.scope === 'singleton') {
      registration.instance ??= registration.factory()

      return registration.instance
    } else if (registration.scope === 'transient') {
      return registration.factory()
    } else if (registration.scope === 'session') {
      if (!this.sessionActive) {
        throw new Error(`Session scope is not active`)
      }

      registration.instance ??= registration.factory()

      return registration.instance
    }

    throw new Error(`Unknown registration ${token.name}`)
  }
}

export const container = new DIContainer()
