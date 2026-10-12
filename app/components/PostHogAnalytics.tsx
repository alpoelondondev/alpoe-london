"use client";

import { useEffect } from "react";

const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;
let started = false;

export default function PostHogAnalytics() {
  useEffect(() => {
    if (!token || !host || started) return;
    started = true;

    void import("posthog-js").then(({ default: posthog }) => {
      posthog.init(token, {
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
          // Visitors who declined the old consent prompt are recorded too.
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
  }, []);

  return null;
}
