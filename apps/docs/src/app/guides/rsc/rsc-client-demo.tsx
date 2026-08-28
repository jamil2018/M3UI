'use client';

import { M3Provider, Button } from '@m3ui/react';

/** Client boundary wrapper for RSC guide — keeps server page free of client imports. */
export function RscClientDemo() {
  return (
    <M3Provider seed="#6750A4">
      <Button variant="filled-tonal">RSC-safe via client wrapper</Button>
    </M3Provider>
  );
}
