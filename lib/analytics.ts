'use client';

import { sendGTMEvent } from '@next/third-parties/google';

type EventPayload = Record<string, string | number | boolean | null | undefined>;

export function trackEvent(
  event: string,
  payload: EventPayload = {},
) {
  sendGTMEvent({
    event,
    ...payload,
  });
}
