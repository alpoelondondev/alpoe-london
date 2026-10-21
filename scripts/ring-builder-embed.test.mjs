import { test } from "node:test";
import assert from "node:assert/strict";
import { builderAddresses, BUILDER_EMBED, BUILDER_HOSTED } from "../lib/ring-builder.ts";

test("a fresh visit opens Alpoe's full 3D builder in the site's light theme", () => {
  assert.deepEqual(builderAddresses(new URLSearchParams()), {
    embed: `${BUILDER_EMBED}?theme=light`, hosted: BUILDER_HOSTED,
  });
});

test("old catalogue and shared designs keep all selections through the Photo builder", () => {
  const params = new URLSearchParams({ band: "twist-pave", head: "classic-basket", shape: "oval", metal: "18ct-yellow", headMetal: "platinum-950", ct: "1.5", origin: "laboratory-grown", quality: "exceptional", size: "N", engraving: "A & B" });
  const result = builderAddresses(params);
  assert.equal(new URL(result.embed).pathname, new URL(BUILDER_EMBED).pathname + "/2d");
  const restored = new URL(result.hosted).searchParams;
  assert.equal(restored.size, params.size);
  for (const [name, value] of params) assert.equal(restored.get(name), value);
  assert.equal(restored.has("theme"), false);
});

test("the incoming URL cannot change the client, destination, theme or recipient", () => {
  const result = builderAddresses(new URLSearchParams({ key: "someone-else", seller: "cus_wrong", theme: "dark", to: "other@example.test", next: "https://elsewhere.test", engraving: "x".repeat(201) }));
  assert.deepEqual(result, { embed: `${BUILDER_EMBED}?theme=light`, hosted: BUILDER_HOSTED });
});

test("the Virtual try-on card opens the introduction in Alpoe's 3D builder", () => {
  const result = builderAddresses(new URLSearchParams({ experience: "try-on" }));
  assert.equal(result.embed, `${BUILDER_EMBED}?experience=try-on&theme=light`);
  assert.equal(result.hosted, `${BUILDER_HOSTED}?experience=try-on`);
});
