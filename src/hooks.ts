/* eslint-disable @typescript-eslint/no-unused-vars */
import cookie from 'cookie';
import db from '$lib/database';

export const handle = async ({ event, resolve }) => {
  // Connecting to DB
  // All database code can only run inside async functions as it uses await

  // Getting cookies from request headers - all requests have cookies on themimport clientPromise from '$lib/db'
  const cookies = cookie.parse(event.request.headers.cookie || '');
  console.log('handle cookies > ', cookies);

  return await resolve(event);
};
