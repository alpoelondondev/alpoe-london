# PostHog analytics and recordings

## Project-only MCP

Both clients register the same `https://mcp.posthog.com/mcp` endpoint for this repository:

- Codex reads `.codex/config.toml`. Run `codex mcp login posthog` from this
  folder and complete browser authorization, then start a new Codex session.
- Claude Code reads the root `.mcp.json`. Open Claude Code in this folder,
  accept the project MCP prompt, then use `/mcp` to authenticate PostHog.

Each client manages its own login; credentials are not stored in either project
configuration file. The endpoint routes to your account's EU or US region.
No global MCP server entry is installed. Keep both files when sharing the repo.
Repository scoping controls where Codex loads the server; PostHog account/project
access remains governed by the permissions granted during authorization.

## Website connection

Set these public build-time variables in `.env.local` and in the site's hosting environment:

```dotenv
NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN=your_public_project_token
NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com
```

Use `https://us.i.posthog.com` for a US project. Copy the project token from
PostHog project settings; never use a personal API key. Redeploy after setting
these values, because Next.js embeds public variables during the build.

In PostHog, enable Session Replay for the project. Confirm GeoIP enrichment is
enabled (and no transformation removes the GeoIP properties). The browser SDK
sends pageviews on initial load and client-side route changes. PostHog derives
approximate country, region and city from IP addresses; it does not provide exact
visitor locations. VPNs and mobile networks can affect accuracy.

Open **Web analytics** for traffic and geographic breakdowns, and **Session
replay** for recordings. Filter recordings using country or city properties.
New data starts after deployment; previous visits cannot be recovered.

## Visitor controls

Every visit is tracked and recorded from the first page. There is no consent
prompt and no on-site way for a visitor to opt out. Missing configuration leaves
PostHog inactive.

Form values are masked. The booking confirmation, including its message and
contact details, is blocked from replay. Add `data-private` to any future element
that displays customer data. Automatic click-event capture and console recording
are disabled. Replay still records visual interactions and navigation.
The existing Google Analytics and Vercel integrations are unchanged. The public
`/privacy` page declares all of this; update it whenever what is collected or the
retention settings in the dashboard change.

## Verify after connecting

1. In a fresh browser session, browse multiple pages and confirm no prompt
   appears, pageviews arrive in PostHog and one continuous recording appears.
2. Fill an enquiry and booking with dummy data; check the replay hides inputs and
   booking confirmation details.
3. Check new events for `$geoip_country_name` and `$geoip_city_name`.

References: https://posthog.com/docs/libraries/next-js and
https://posthog.com/docs/session-replay/privacy
