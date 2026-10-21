/** Alpoe's dedicated Complete builder. The embed key identifies the client; its domain lock lives at Softwarebosh. */
export const BUILDER_ORIGIN = "https://builder.softwarebosh.com";
export const BUILDER_EMBED = `${BUILDER_ORIGIN}/embed/03c25f34eac50fc57753ea6b9c814826a2c44e82`;
export const BUILDER_HOSTED = `${BUILDER_ORIGIN}/j/alpoe-london`;

// The old builder and the hosted Photo builder share these field names and ids.
// Existing catalogue and shared links enter Photos, where the builder carries
// their configuration across when the customer switches to 3D or Combined.
const FIELDS = ["band", "head", "shape", "ct", "origin", "quality", "headMetal", "metal", "size", "engraving"];

export function builderAddresses(params: { get(name: string): string | null }) {
  const query = new URLSearchParams();
  for (const field of FIELDS) {
    const value = params.get(field);
    if (value && value.length <= (field === "engraving" ? 200 : 80)) query.set(field, value);
  }
  const tab = query.size ? "/2d" : "";
  if (params.get("experience") === "try-on" && !tab) query.set("experience", "try-on");
  const hosted = `${BUILDER_HOSTED}${tab}${query.size ? `?${query}` : ""}`;
  query.set("theme", "light");
  return { embed: `${BUILDER_EMBED}${tab}?${query}`, hosted };
}
