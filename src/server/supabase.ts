/* eslint-disable prettier/prettier */
import 'server-only';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/** Read-only client for Server Components (RSC). Never writes cookies. */
export async function getServerClientRSC() {
  const c = await cookies();
  return createServerClient(URL, ANON, {
    cookies: {
      get(name: string) {
        return c.get(name)?.value;
      },
      // NOOP in RSC to avoid Next.js error
      set() {},
      remove() {},
    },
  });
}

/** Full client for Server Actions / Route Handlers (allowed to write cookies). */
export async function getServerClientAction() {
  const c = await cookies();
  return createServerClient(URL, ANON, {
    cookies: {
      get(name: string) {
        return c.get(name)?.value;
      },
      set(name: string, value: string) {
        c.set(name, value);
      },
      remove(name: string) {
        c.set(name, '');
      },
    },
  });
}


