import { type LoaderFunction } from 'react-router-dom'

export const composeLoaders = (...loaders: LoaderFunction[]): LoaderFunction => {
  return async (args) => {
    let result: unknown

    for (const loader of loaders) {
      result = await loader(args)

      if (result && typeof result === 'object' && 'status' in result) {
        return result
      }
    }

    return result
  }
}
