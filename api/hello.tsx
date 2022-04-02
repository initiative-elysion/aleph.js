import type {
  APIHandler,
} from 'aleph/types'
import { h, Fragment } from 'preact';
import render from 'preact-render-to-string';

export const handler: APIHandler = async ({ router, request, respondWith }) => {
  respondWith(new Response(
    render(
      <>
        <p><strong>Aleph.js</strong> Function for Vercel - deno {Deno.version.deno} 🦕</p>
        <p><small>RoutePath: {router.routePath}</small></p>
        <p><small>Location: {location.toString()}</small></p>
        <p><small>User-Agent: {request.headers.get('User-Agent')}</small></p>
      </>
    ),
    {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    },
  ))
}
