type PlausibleFn = (event: string) => void;

/** Custom event names sent to Plausible. Each needs a matching custom-event
 *  goal in the dashboard (Settings → Goals); names must match exactly,
 *  including capitalisation. Compound "Name: Action" names instead of custom
 *  properties: property breakdowns are a Business-plan feature. The "404"
 *  event is sent separately by NotFoundTracker via the events API. */
type AnalyticsEventName =
  | "Orientation Card: Dismiss"
  | "Orientation Card: Introduction"
  | "Orientation Card: Executive Summary"
  | "Copy Page: Markdown"
  | "Copy Page: Citation"
  | "Copy Page: ChatGPT"
  | "Copy Page: Claude"
  | "Copy Page: Share Link"
  | "Copy Page: Print"
  | "Search: Open"
  | "Search: Result Click"
  | "Language Switch";

export function trackEvent(name: AnalyticsEventName): void {
  const w = window as { plausible?: PlausibleFn };
  w.plausible?.(name);
}
