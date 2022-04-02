import type {
  APIHandler,
} from 'aleph/types'

export const handler: APIHandler = async ({ router, response }) => {
  response.json({
    pathname: router.pathname,
    routePath: router.routePath,
    posts: [{ id: 123, title: 'Hi:)', date: Date.now() }],
  })
}
