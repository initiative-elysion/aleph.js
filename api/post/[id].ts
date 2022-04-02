import type {
  APIHandler,
} from 'aleph/types'

export const handler: APIHandler = async ({ router, response }) => {
  response.json({
    pathname: router.pathname,
    routePath: router.routePath,
    params: router.params,
    query: router.query.toString()
  })
}
