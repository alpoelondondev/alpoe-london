"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import type { PostHog } from "posthog-js";

const consentKey = "alpoe-posthog-consent-v1";
const consentEvent = "alpoe-posthog-consent-change";
const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;
let client: PostHog | undefined;
let memoryConsent: string | null = null;

function readConsent() {
  try {
    return localStorage.getItem(consentKey) ?? memoryConsent;
  } catch {
    return memoryConsent;
  }
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(consentEvent, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(consentEvent, callback);
  };
}

export default function PostHogAnalytics() {
  const consent = useSyncExternalStore(subscribe, readConsent, () => "pending");
  const [editing, setEditing] = useState(false);
  const configured = Boolean(token && host);

  useEffect(() => {
    if (!configured || consent !== "accepted") {
      client?.stopSessionRecording();
      client?.opt_out_capturing();
      return;
    }

    let cancelled = false;
    void import("posthog-js").then(({ default: posthog }) => {
      if (cancelled) return;
      if (client) {
        client.opt_in_capturing();
        client.startSessionRecording();
        client.capture("$pageview");
        return;
      }
      client = posthog.init(token!, {
        api_host: host,
        person_profiles: "identified_only",
        capture_pageview: "history_change",
        capture_pageleave: true,
        // GeoIP enrichment supplies approximate country/region/city.
        ip: true,
        autocapture: false,
        capture_performance: false,
        capture_exceptions: false,
        enable_recording_console_log: false,
        disable_session_recording: false,
        loaded: (instance) => {
          if (instance.has_opted_out_capturing()) {
            instance.opt_in_capturing();
            instance.capture("$pageview");
          }
          instance.startSessionRecording();
        },
        session_recording: {
          maskAllInputs: true,
          maskTextSelector: "[data-private], .ph-mask",
          blockSelector: "[data-private], .ph-no-capture",
          recordCrossOriginIframes: false,
          recordHeaders: false,
          recordBody: false,
          maskCapturedNetworkRequestFn: () => null,
        },
      });
    }).catch(() => {
      // Analytics must never interrupt shopping if the SDK cannot load.
    });
    return () => { cancelled = true; };
  }, [configured, consent]);

  function choose(value: "accepted" | "declined") {
    memoryConsent = value;
    try { localStorage.setItem(consentKey, value); } catch { /* Session-only choice. */ }
    window.dispatchEvent(new Event(consentEvent));
    setEditing(false);
  }

  if (!configured || consent === "pending") return null;
  if (consent !== null && !editing) {
    return (
      <button type="button" onClick={() => setEditing(true)}
        className="fixed bottom-3 left-3 z-[90] border border-fg/20 bg-bg px-3 py-2 text-[11px] text-fg max-md:bottom-24">
        Recording preferences
      </button>
    );
  }

  return (
    <section aria-label="Visitor analytics preferences" data-private
      className="fixed bottom-5 left-5 right-5 z-[100] max-w-lg border border-fg/20 bg-bg p-5 text-fg shadow-xl max-md:bottom-24 max-md:left-3 max-md:right-3">
      <h2 className="text-base font-medium">Help us improve your visit</h2>
      <p className="mt-2 text-sm leading-relaxed text-fg/80">
        With your permission, we use PostHog cookies to measure visits and record
        how you browse, including clicks, scrolling and approximate country or
        city. Form entries and booking details are hidden. You can change your
        choice in Recording preferences at any time.
      </p>
      <div className="mt-4 flex gap-3">
        <button type="button" onClick={() => choose("declined")}
          className="flex-1 border border-fg/30 px-4 py-3 text-sm hover:bg-fg/10">Decline</button>
        <button type="button" onClick={() => choose("accepted")}
          className="flex-1 border border-fg/30 px-4 py-3 text-sm hover:bg-fg/10">Allow recordings</button>
      </div>
    </section>
  );
}
