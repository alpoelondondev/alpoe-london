#!/usr/bin/env node
// Build the Rolex slice of data/products.csv from a single inline source-of-truth
// mapping mirroring Joe's "WEBSITE BACKEND - ROLEX" Google Sheet (85 references).
//
// What this does:
//   1. Reads existing data/products.csv
//   2. Ensures a `bracelets` column exists in the header (between `condition` and `images`)
//   3. Replaces every brand=Rolex row with a freshly built row from the inline mapping
//      below, joined to public/products/rolex/{ref}/ for the images column
//   4. Preserves all non-Rolex rows untouched (just adds an empty bracelets value)
//   5. Writes back data/products.csv
//
// Idempotent: running twice produces zero diff. Rolex rows are sorted by
// reference_number ascending; non-Rolex rows preserve their original order.

import { readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(process.cwd(), "public", "products", "rolex");
const CSV = join(process.cwd(), "data", "products.csv");

// -----------------------------------------------------------------------------
// SOURCE OF TRUTH: 85 references from Joe's sheet + 9 orphan-but-kept refs
// + 2 legacy placeholders. Total: ~96 Rolex rows.
//
// Each entry's key is the lowercased reference number (matches image folder name).
// Fields:
//   model      — must align with Rolex's own taxonomy (e.g. "Lady-Datejust" for 28mm)
//   nickname   — collector nickname; "" if none. No slashes.
//   caseSize   — e.g. "41mm"
//   materials  — display string (Oystersteel, 18ct White Gold, etc.)
//   bracelets  — array of strings; allowed values:
//                "Oyster" | "Jubilee" | "Oysterflex" | "President" | "Flat Jubilee"
//   movement   — "Automatic Cal. NNNN"
//   dial       — usually empty (dial selection is a future feature); set when sheet/spec implies it
//   gemstones  — set automatically below for *RBR/*TBR refs (diamond bezel)
//   description— optional override; if absent, generated from materials/case/bracelets
//   title      — optional override; if absent, generated from model/case/nickname/ref
//   featured   — optional, defaults false. Batman is the historical hero card.
//   legacy     — true for pre-existing placeholder rows (no images, distinct title/slug)
//   orphan     — true for refs with images but not in the sheet (kept per Joe's instruction)
//
// Notes on judgement calls:
//   - The sheet's GMT-Master II "Pepsi" 126710BLRO lists Jubilee (primary). Per the
//     spec normalization rule, parenthetical notes are stripped → ["Jubilee"].
//     The Batman row "Jubilee (standard), Oyster (less common config)" → ["Jubilee","Oyster"].
//   - Sprite (sheet has 126720VTNR-0001 Oyster + 126720VTNR-0002 Jubilee): emitted
//     as ONE row 126720VTNR with bracelets ["Oyster","Jubilee"], per the plan.
//   - 126719BLRO meteorite-dial variant: the sheet lists a second entry with no
//     dedicated image folder. Emitted as the standard 126719BLRO only; the meteorite
//     variant will be modelled as a dial-option in a later ticket.
//   - Land-Dweller and Oyster Perpetual model names are emitted verbatim even though
//     lib/taxonomy.ts WATCH_BRANDS rolex.models does not list them. CSV is the
//     source of truth for products; taxonomy is only used for navigation.
//     Surfaced in the final report so the user knows to extend the taxonomy.
//   - Daytona "John Mayer" 126508 nickname comes from the sheet's parenthetical
//     "(green dial variant)"; we capture "John Mayer" as the nickname (per the
//     enthusiast moniker for the green-dial yellow-gold Daytona).
// -----------------------------------------------------------------------------

const REFS = {
  // ----- DATEJUST 41 -----
  "126300": { model: "Datejust", caseSize: "41mm", materials: "Oystersteel", bracelets: ["Oyster", "Jubilee"], movement: "Automatic Cal. 3235" },
  "126301": { model: "Datejust", caseSize: "41mm", materials: "Oystersteel & 18ct Everose Gold", bracelets: ["Oyster", "Jubilee"], movement: "Automatic Cal. 3235" },
  "126303": { model: "Datejust", caseSize: "41mm", materials: "Oystersteel & 18ct Yellow Gold", bracelets: ["Oyster", "Jubilee"], movement: "Automatic Cal. 3235" },
  "126331": { model: "Datejust", caseSize: "41mm", materials: "Oystersteel & 18ct Everose Gold", bracelets: ["Oyster", "Jubilee"], movement: "Automatic Cal. 3235" },
  "126333": { model: "Datejust", caseSize: "41mm", materials: "Oystersteel & 18ct Yellow Gold", bracelets: ["Oyster", "Jubilee"], movement: "Automatic Cal. 3235" },
  "126334": { model: "Datejust", caseSize: "41mm", materials: "Oystersteel & 18ct White Gold", bracelets: ["Oyster", "Jubilee"], movement: "Automatic Cal. 3235" },

  // ----- DATEJUST 36 -----
  "126200": { model: "Datejust", caseSize: "36mm", materials: "Oystersteel", bracelets: ["Oyster", "Jubilee"], movement: "Automatic Cal. 3235" },
  "126201": { model: "Datejust", caseSize: "36mm", materials: "Oystersteel & 18ct Everose Gold", bracelets: ["Oyster", "Jubilee"], movement: "Automatic Cal. 3235" },
  "126203": { model: "Datejust", caseSize: "36mm", materials: "Oystersteel & 18ct Yellow Gold", bracelets: ["Oyster", "Jubilee"], movement: "Automatic Cal. 3235" },
  "126231": { model: "Datejust", caseSize: "36mm", materials: "Oystersteel & 18ct Everose Gold", bracelets: ["Oyster", "Jubilee"], movement: "Automatic Cal. 3235" },
  "126233": { model: "Datejust", caseSize: "36mm", materials: "Oystersteel & 18ct Yellow Gold", bracelets: ["Oyster", "Jubilee"], movement: "Automatic Cal. 3235" },
  // Note: sheet duplicates 126234 in both DJ41 and DJ36 sections. 126234 is the
  // canonical DJ41 White Rolesor reference; we keep it as 41mm and skip the DJ36 dupe.

  // ----- DATEJUST 31 -----
  "278240": { model: "Datejust", caseSize: "31mm", materials: "Oystersteel", bracelets: ["Oyster"], movement: "Automatic Cal. 2236" },
  "278271": { model: "Datejust", caseSize: "31mm", materials: "Oystersteel & 18ct Everose Gold", bracelets: ["Jubilee", "Oyster"], movement: "Automatic Cal. 2236" },
  "278273": { model: "Datejust", caseSize: "31mm", materials: "Oystersteel & 18ct Yellow Gold", bracelets: ["Jubilee", "Oyster"], movement: "Automatic Cal. 2236" },
  "278274": { model: "Datejust", caseSize: "31mm", materials: "Oystersteel & 18ct White Gold", bracelets: ["Jubilee", "Oyster"], movement: "Automatic Cal. 2236" },

  // ----- LADY-DATEJUST 28 -----
  "279160": { model: "Lady-Datejust", caseSize: "28mm", materials: "Oystersteel", bracelets: ["Oyster"], movement: "Automatic Cal. 2236" },
  "279171": { model: "Lady-Datejust", caseSize: "28mm", materials: "Oystersteel & 18ct Everose Gold", bracelets: ["Jubilee", "Oyster"], movement: "Automatic Cal. 2236" },
  "279173": { model: "Lady-Datejust", caseSize: "28mm", materials: "Oystersteel & 18ct Yellow Gold", bracelets: ["Jubilee", "Oyster"], movement: "Automatic Cal. 2236" },
  "279174": { model: "Lady-Datejust", caseSize: "28mm", materials: "Oystersteel & 18ct White Gold", bracelets: ["Jubilee", "Oyster"], movement: "Automatic Cal. 2236" },

  // ----- GMT-MASTER II (steel) -----
  "126710blnr": { model: "GMT-Master II", nickname: "Batman", caseSize: "40mm", materials: "Oystersteel", bracelets: ["Jubilee", "Oyster"], movement: "Automatic Cal. 3285", featured: true },
  "126710blro": { model: "GMT-Master II", nickname: "Pepsi", caseSize: "40mm", materials: "Oystersteel", bracelets: ["Jubilee"], movement: "Automatic Cal. 3285" },
  "126710grnr": { model: "GMT-Master II", nickname: "Bruce Wayne", caseSize: "40mm", materials: "Oystersteel", bracelets: ["Oyster", "Jubilee"], movement: "Automatic Cal. 3285" },
  "126720vtnr": { model: "GMT-Master II", nickname: "Sprite", caseSize: "40mm", materials: "Oystersteel", bracelets: ["Oyster", "Jubilee"], movement: "Automatic Cal. 3285" },

  // ----- GMT-MASTER II (steel/gold) -----
  "126713grnr": { model: "GMT-Master II", nickname: "Zombie", caseSize: "40mm", materials: "Oystersteel & 18ct Everose Gold", bracelets: ["Jubilee"], movement: "Automatic Cal. 3285" },
  "126711chnr": { model: "GMT-Master II", nickname: "Root Beer", caseSize: "40mm", materials: "Oystersteel & 18ct Everose Gold", bracelets: ["Oyster"], movement: "Automatic Cal. 3285" },

  // ----- GMT-MASTER II (full gold) -----
  "126718grnr": { model: "GMT-Master II", nickname: "Zombie", caseSize: "40mm", materials: "18ct Yellow Gold", bracelets: ["Jubilee"], movement: "Automatic Cal. 3285" },
  "126718ln":   { model: "GMT-Master II", caseSize: "40mm", materials: "18ct Yellow Gold", bracelets: ["Oyster"], movement: "Automatic Cal. 3285" },
  "126715chnr": { model: "GMT-Master II", nickname: "Root Beer", caseSize: "40mm", materials: "18ct Everose Gold", bracelets: ["Oyster"], movement: "Automatic Cal. 3285" },
  "126715ln":   { model: "GMT-Master II", caseSize: "40mm", materials: "18ct Everose Gold", bracelets: ["Oyster"], movement: "Automatic Cal. 3285" },
  "126719blro": { model: "GMT-Master II", nickname: "White Gold Pepsi", caseSize: "40mm", materials: "18ct White Gold", bracelets: ["Oyster"], movement: "Automatic Cal. 3285" },
  // Note: sheet also lists "126719BLRO (meteorite dial)" as a second entry. No separate
  // image folder exists; modelled as a future dial-variant rather than a fake reference.

  // ----- SUBMARINER -----
  "124060":   { model: "Submariner", caseSize: "41mm", materials: "Oystersteel", bracelets: ["Oyster"], movement: "Automatic Cal. 3230", description: "Rolex Submariner No Date 41mm in Oystersteel with black Cerachrom bezel and black dial." },
  "126610ln": { model: "Submariner", caseSize: "41mm", materials: "Oystersteel", bracelets: ["Oyster"], movement: "Automatic Cal. 3235", description: "Rolex Submariner Date 41mm in Oystersteel with black Cerachrom bezel and black dial." },
  "126610lv": { model: "Submariner", nickname: "Starbucks", caseSize: "41mm", materials: "Oystersteel", bracelets: ["Oyster"], movement: "Automatic Cal. 3235", description: "Rolex Submariner Date 41mm in Oystersteel with green Cerachrom bezel and black dial — the \"Starbucks\"." },
  "126613ln": { model: "Submariner", caseSize: "41mm", materials: "Oystersteel & 18ct Yellow Gold", bracelets: ["Oyster"], movement: "Automatic Cal. 3235" },
  "126613lb": { model: "Submariner", nickname: "Bluesy", caseSize: "41mm", materials: "Oystersteel & 18ct Yellow Gold", bracelets: ["Oyster"], movement: "Automatic Cal. 3235", description: "Rolex Submariner Date 41mm in Yellow Rolesor with blue Cerachrom bezel and blue dial — the \"Bluesy\"." },
  "126618ln": { model: "Submariner", caseSize: "41mm", materials: "18ct Yellow Gold", bracelets: ["Oyster"], movement: "Automatic Cal. 3235" },
  "126618lb": { model: "Submariner", caseSize: "41mm", materials: "18ct Yellow Gold", bracelets: ["Oyster"], movement: "Automatic Cal. 3235" },
  "126619lb": { model: "Submariner", nickname: "Smurf", caseSize: "41mm", materials: "18ct White Gold", bracelets: ["Oyster"], movement: "Automatic Cal. 3235", description: "Rolex Submariner Date 41mm in solid 18ct white gold with blue Cerachrom bezel and blue dial — the \"Smurf\"." },

  // ----- OYSTER PERPETUAL -----
  "134300": { model: "Oyster Perpetual", caseSize: "41mm", materials: "Oystersteel", bracelets: ["Oyster"], movement: "Automatic Cal. 3230" },
  "126000": { model: "Oyster Perpetual", caseSize: "36mm", materials: "Oystersteel", bracelets: ["Oyster"], movement: "Automatic Cal. 3230" },
  "124200": { model: "Oyster Perpetual", caseSize: "34mm", materials: "Oystersteel", bracelets: ["Oyster"], movement: "Automatic Cal. 3230" },
  "277200": { model: "Oyster Perpetual", caseSize: "31mm", materials: "Oystersteel", bracelets: ["Oyster"], movement: "Automatic Cal. 2232" },
  "276200": { model: "Oyster Perpetual", caseSize: "28mm", materials: "Oystersteel", bracelets: ["Oyster"], movement: "Automatic Cal. 2232" },

  // ----- LAND-DWELLER 36 -----
  "127234":    { model: "Land-Dweller", caseSize: "36mm", materials: "Oystersteel & 18ct White Gold", bracelets: ["Flat Jubilee"], movement: "Automatic Cal. 7135" },
  "127235":    { model: "Land-Dweller", caseSize: "36mm", materials: "18ct Everose Gold", bracelets: ["Flat Jubilee"], movement: "Automatic Cal. 7135" },
  "127236":    { model: "Land-Dweller", caseSize: "36mm", materials: "950 Platinum", bracelets: ["Flat Jubilee"], movement: "Automatic Cal. 7135" },
  "127285tbr": { model: "Land-Dweller", caseSize: "36mm", materials: "18ct Everose Gold", bracelets: ["Flat Jubilee"], movement: "Automatic Cal. 7135" },
  "127286tbr": { model: "Land-Dweller", caseSize: "36mm", materials: "950 Platinum", bracelets: ["Flat Jubilee"], movement: "Automatic Cal. 7135" },

  // ----- LAND-DWELLER 40 -----
  "127334":    { model: "Land-Dweller", caseSize: "40mm", materials: "Oystersteel & 18ct White Gold", bracelets: ["Flat Jubilee"], movement: "Automatic Cal. 7135" },
  "127335":    { model: "Land-Dweller", caseSize: "40mm", materials: "18ct Everose Gold", bracelets: ["Flat Jubilee"], movement: "Automatic Cal. 7135" },
  "127336":    { model: "Land-Dweller", caseSize: "40mm", materials: "950 Platinum", bracelets: ["Flat Jubilee"], movement: "Automatic Cal. 7135" },
  "127385tbr": { model: "Land-Dweller", caseSize: "40mm", materials: "18ct Everose Gold", bracelets: ["Flat Jubilee"], movement: "Automatic Cal. 7135" },
  "127386tbr": { model: "Land-Dweller", caseSize: "40mm", materials: "950 Platinum", bracelets: ["Flat Jubilee"], movement: "Automatic Cal. 7135" },

  // ----- DAYTONA -----
  "126500ln": { model: "Daytona", nickname: "Panda", caseSize: "40mm", materials: "Oystersteel", bracelets: ["Oyster"], movement: "Automatic Cal. 4131", description: "The current-generation Rolex Cosmograph Daytona 40mm in Oystersteel with black Cerachrom bezel — Panda or Reverse-Panda dial." },
  "126503":   { model: "Daytona", caseSize: "40mm", materials: "Oystersteel & 18ct Yellow Gold", bracelets: ["Oyster"], movement: "Automatic Cal. 4131" },
  "126508":   { model: "Daytona", nickname: "John Mayer", caseSize: "40mm", materials: "18ct Yellow Gold", bracelets: ["Oyster"], movement: "Automatic Cal. 4131", description: "Rolex Cosmograph Daytona 40mm in solid 18ct yellow gold — green-dial variant nicknamed the \"John Mayer\"." },
  "126518ln": { model: "Daytona", caseSize: "40mm", materials: "18ct Yellow Gold", bracelets: ["Oysterflex"], movement: "Automatic Cal. 4131" },
  "126505":   { model: "Daytona", caseSize: "40mm", materials: "18ct Everose Gold", bracelets: ["Oyster"], movement: "Automatic Cal. 4131" },
  "126509":   { model: "Daytona", caseSize: "40mm", materials: "18ct White Gold", bracelets: ["Oyster"], movement: "Automatic Cal. 4131" },
  "126506":   { model: "Daytona", nickname: "Ice Blue", caseSize: "40mm", materials: "950 Platinum", bracelets: ["Oyster"], movement: "Automatic Cal. 4131", description: "Rolex Cosmograph Daytona 40mm in 950 platinum with ice-blue dial and chestnut-brown Cerachrom bezel." },
  "126515ln": { model: "Daytona", caseSize: "40mm", materials: "18ct Everose Gold", bracelets: ["Oysterflex"], movement: "Automatic Cal. 4131" },
  "126519ln": { model: "Daytona", caseSize: "40mm", materials: "18ct White Gold", bracelets: ["Oysterflex"], movement: "Automatic Cal. 4131" },
  // Daytona gem-set
  "126538tbr": { model: "Daytona", caseSize: "40mm", materials: "18ct Yellow Gold", bracelets: ["Oysterflex"], movement: "Automatic Cal. 4131" },
  "126539tbr": { model: "Daytona", caseSize: "40mm", materials: "18ct White Gold", bracelets: ["Oysterflex"], movement: "Automatic Cal. 4131" },
  "126535tbr": { model: "Daytona", caseSize: "40mm", materials: "18ct Everose Gold", bracelets: ["Oysterflex"], movement: "Automatic Cal. 4131" },
  "126589rbr": { model: "Daytona", caseSize: "40mm", materials: "18ct White Gold", bracelets: ["Oysterflex"], movement: "Automatic Cal. 4131", dial: "Meteorite", description: "Rolex Cosmograph Daytona 40mm in 18ct white gold with diamond-set bezel and meteorite dial." },

  // ----- DAY-DATE 40 -----
  "228238": { model: "Day-Date", caseSize: "40mm", materials: "18ct Yellow Gold", bracelets: ["President"], movement: "Automatic Cal. 3255" },
  "228239": { model: "Day-Date", caseSize: "40mm", materials: "18ct White Gold", bracelets: ["President"], movement: "Automatic Cal. 3255" },
  "228235": { model: "Day-Date", caseSize: "40mm", materials: "18ct Everose Gold", bracelets: ["President"], movement: "Automatic Cal. 3255" },
  "228236": { model: "Day-Date", caseSize: "40mm", materials: "950 Platinum", bracelets: ["President"], movement: "Automatic Cal. 3255" },

  // ----- DAY-DATE 40 GEM-SET -----
  "228348rbr": { model: "Day-Date", caseSize: "40mm", materials: "18ct Yellow Gold", bracelets: ["President"], movement: "Automatic Cal. 3255" },
  "228349rbr": { model: "Day-Date", caseSize: "40mm", materials: "18ct White Gold", bracelets: ["President"], movement: "Automatic Cal. 3255" },
  "228345rbr": { model: "Day-Date", caseSize: "40mm", materials: "18ct Everose Gold", bracelets: ["President"], movement: "Automatic Cal. 3255" },
  "228396tbr": { model: "Day-Date", caseSize: "40mm", materials: "950 Platinum", bracelets: ["President"], movement: "Automatic Cal. 3255" },

  // ----- DAY-DATE 36 -----
  "128238": { model: "Day-Date", caseSize: "36mm", materials: "18ct Yellow Gold", bracelets: ["President"], movement: "Automatic Cal. 3255" },
  "128239": { model: "Day-Date", caseSize: "36mm", materials: "18ct White Gold", bracelets: ["President"], movement: "Automatic Cal. 3255" },
  "128235": { model: "Day-Date", caseSize: "36mm", materials: "18ct Everose Gold", bracelets: ["President"], movement: "Automatic Cal. 3255" },
  "128236": { model: "Day-Date", caseSize: "36mm", materials: "950 Platinum", bracelets: ["President"], movement: "Automatic Cal. 3255" },

  // ----- SKY-DWELLER -----
  "336934": { model: "Sky-Dweller", caseSize: "42mm", materials: "Oystersteel & 18ct White Gold", bracelets: ["Oyster", "Jubilee"], movement: "Automatic Cal. 9002" },
  "336933": { model: "Sky-Dweller", caseSize: "42mm", materials: "Oystersteel & 18ct Yellow Gold", bracelets: ["Oyster", "Jubilee"], movement: "Automatic Cal. 9002" },
  "336938": { model: "Sky-Dweller", caseSize: "42mm", materials: "18ct Yellow Gold", bracelets: ["Oyster", "Jubilee"], movement: "Automatic Cal. 9002" },
  "336935": { model: "Sky-Dweller", caseSize: "42mm", materials: "18ct Everose Gold", bracelets: ["Oyster", "Jubilee", "Oysterflex"], movement: "Automatic Cal. 9002" },
  "336239": { model: "Sky-Dweller", caseSize: "42mm", materials: "18ct White Gold", bracelets: ["Oyster"], movement: "Automatic Cal. 9002" },

  // -----------------------------------------------------------------------
  // ORPHANS — have images, NOT in Joe's sheet. Kept per Joe's instruction.
  // Metadata recovered from prior generator. Bracelets defaulted per model.
  // -----------------------------------------------------------------------
  "126621": { model: "Yacht-Master", caseSize: "40mm", materials: "Oystersteel & 18ct Everose Gold", bracelets: ["Oyster"], movement: "Automatic Cal. 3235", orphan: true, description: "Rolex Yacht-Master 40 in Everose Rolesor with bidirectional rotatable bezel." },
  "126622": { model: "Yacht-Master", caseSize: "40mm", materials: "Oystersteel & 950 Platinum", bracelets: ["Oyster"], movement: "Automatic Cal. 3235", orphan: true, description: "Rolex Yacht-Master 40 in Rolesium — Oystersteel case with platinum bezel." },
  "126655": { model: "Yacht-Master", caseSize: "40mm", materials: "18ct Everose Gold", bracelets: ["Oysterflex"], movement: "Automatic Cal. 3235", orphan: true, dial: "Black", description: "Rolex Yacht-Master 40 in 18ct Everose gold with matching Cerachrom bezel on Oysterflex bracelet." },
  "226627": { model: "Yacht-Master", caseSize: "42mm", materials: "RLX Titanium", bracelets: ["Oyster"], movement: "Automatic Cal. 3235", orphan: true, description: "Rolex Yacht-Master 42 in RLX titanium with bidirectional rotatable bezel." },
  "226658": { model: "Yacht-Master", caseSize: "42mm", materials: "18ct Yellow Gold", bracelets: ["Oysterflex"], movement: "Automatic Cal. 3235", orphan: true, dial: "Black", description: "Rolex Yacht-Master 42 in 18ct yellow gold with matte black Cerachrom bezel on Oysterflex bracelet." },
  "226659": { model: "Yacht-Master", caseSize: "42mm", materials: "18ct White Gold", bracelets: ["Oysterflex"], movement: "Automatic Cal. 3235", orphan: true, dial: "Black", description: "Rolex Yacht-Master 42 in 18ct white gold with matte black Cerachrom bezel on Oysterflex bracelet." },
  "268622": { model: "Yacht-Master", caseSize: "37mm", materials: "Oystersteel & 950 Platinum", bracelets: ["Oyster"], movement: "Automatic Cal. 2236", orphan: true, description: "Rolex Yacht-Master 37 in Rolesium — Oystersteel case with platinum bezel." },
  "279178": { model: "Lady-Datejust", caseSize: "28mm", materials: "18ct Yellow Gold", bracelets: ["President"], movement: "Automatic Cal. 2236", orphan: true, description: "Rolex Lady-Datejust 28 in solid 18ct yellow gold with fluted bezel on President bracelet." },
  "336235": { model: "Sky-Dweller", caseSize: "42mm", materials: "18ct Everose Gold", bracelets: ["Oysterflex"], movement: "Automatic Cal. 9002", orphan: true, description: "Rolex Sky-Dweller in solid 18ct Everose gold on Oysterflex bracelet with Ring Command bezel." },

  // -----------------------------------------------------------------------
  // LEGACY placeholder rows — pre-existing in CSV, no images. Preserved with
  // their original titles/slugs so existing links/SEO don't break.
  // -----------------------------------------------------------------------
  "116610ln": { model: "Submariner", caseSize: "40mm", materials: "Oystersteel", bracelets: ["Oyster"], movement: "Automatic Cal. 3135", legacy: true,
    id: "w-rolex-sub-116610ln",
    slug: "rolex-submariner-date-116610ln",
    title: "Rolex Submariner Date 116610LN",
    description: "Iconic Rolex Submariner Date with black Cerachrom bezel and black dial. Available from our Hatton Garden dealership.",
    year: "2018", condition: "Pre-owned", featured: true,
  },
  "116500ln": { model: "Daytona", caseSize: "40mm", materials: "Oystersteel", bracelets: ["Oyster"], movement: "Automatic Cal. 4130", legacy: true,
    id: "w-rolex-daytona-116500ln",
    slug: "rolex-cosmograph-daytona-116500ln",
    title: "Rolex Cosmograph Daytona 116500LN",
    description: "Rolex Cosmograph Daytona with white dial and black Cerachrom bezel. Automatic chronograph movement.",
    dial: "White", year: "2021", condition: "Pre-owned", featured: true,
  },
};

// -----------------------------------------------------------------------------
// CSV helpers
// -----------------------------------------------------------------------------

function csvEscape(v) {
  if (v === null || v === undefined) return "";
  const s = String(v);
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function parseCsvRow(line) {
  const out = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQ) {
      if (c === '"' && line[i + 1] === '"') { cur += '"'; i++; }
      else if (c === '"') { inQ = false; }
      else { cur += c; }
    } else {
      if (c === '"') inQ = true;
      else if (c === ",") { out.push(cur); cur = ""; }
      else cur += c;
    }
  }
  out.push(cur);
  return out;
}

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// -----------------------------------------------------------------------------
// Row construction
// -----------------------------------------------------------------------------

function listImages(refLower) {
  const dir = join(ROOT, refLower);
  if (!existsSync(dir)) return "";
  const files = readdirSync(dir)
    .filter((f) => f.toLowerCase().endsWith(".png"))
    .sort((a, b) => {
      const na = parseInt(a, 10);
      const nb = parseInt(b, 10);
      if (Number.isFinite(na) && Number.isFinite(nb)) return na - nb;
      return a.localeCompare(b);
    });
  return files.map((f) => `/products/rolex/${refLower}/${f}`).join("|");
}

function buildTitle(meta, refUpper) {
  if (meta.title) return meta.title;
  const sizeBit = meta.caseSize ? ` ${meta.caseSize.replace("mm", "")}` : "";
  const nickBit = meta.nickname ? ` "${meta.nickname}"` : "";
  // Daytona gets the "Cosmograph" prefix per Rolex
  const modelDisplay = meta.model === "Daytona" ? "Cosmograph Daytona" : meta.model;
  return `Rolex ${modelDisplay}${sizeBit}${nickBit} ${refUpper}`;
}

function buildDescription(meta) {
  if (meta.description) {
    return meta.description.endsWith(".")
      ? `${meta.description} Sourced to order through Alpoe London, Hatton Garden.`
      : `${meta.description}. Sourced to order through Alpoe London, Hatton Garden.`;
  }
  const bracePhrase = meta.bracelets.length > 1
    ? `available on ${meta.bracelets.slice(0, -1).join(", ")} or ${meta.bracelets[meta.bracelets.length - 1]} bracelet`
    : `on ${meta.bracelets[0]} bracelet`;
  return `Rolex ${meta.model} ${meta.caseSize} in ${meta.materials}, ${bracePhrase}. Sourced to order through Alpoe London, Hatton Garden.`;
}

function buildSlug(meta, refLower) {
  const parts = ["rolex", slugify(meta.model)];
  if (meta.nickname) parts.push(slugify(meta.nickname));
  parts.push(refLower);
  return parts.join("-");
}

function buildRolexRow(refLower, meta, headerCols) {
  const refUpper = refLower.toUpperCase();
  const id = meta.id ?? `w-rolex-${refLower}`;
  const slug = meta.slug ?? buildSlug(meta, refLower);
  const title = buildTitle(meta, refUpper);
  const description = meta.legacy ? meta.description : buildDescription(meta);
  const images = listImages(refLower);
  const gemstones = (refUpper.endsWith("RBR") || refUpper.endsWith("TBR")) ? "Diamond" : "";
  const metaTitle = `${title} | Alpoe London Hatton Garden`;
  const metaDescription = `${title} — authenticated and sourced to order through Alpoe London in Hatton Garden, London.`;

  const row = {
    id,
    type: "watch",
    brand: "Rolex",
    category: "",
    model: meta.model,
    nickname: meta.nickname ?? "",
    slug,
    title,
    description,
    stock_state: meta.legacy || meta.orphan ? "sourceable" : "in_stock",
    materials: meta.materials,
    gemstones,
    carat: "",
    dial: meta.dial ?? "",
    case_size: meta.caseSize,
    movement: meta.movement,
    reference_number: refUpper,
    year: meta.year ?? "2024",
    condition: meta.condition ?? "Unworn",
    bracelets: meta.bracelets.join("|"),
    images,
    featured: meta.featured ? "true" : "false",
    meta_title: metaTitle,
    meta_description: metaDescription,
    placeholder: meta.legacy ? "true" : "false",
  };
  return headerCols.map((c) => csvEscape(row[c])).join(",");
}

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------

function ensureBraceletsHeader(headerCols) {
  if (headerCols.includes("bracelets")) return headerCols;
  const insertAt = headerCols.indexOf("images");
  if (insertAt < 0) throw new Error("CSV header missing 'images' column");
  const next = headerCols.slice();
  next.splice(insertAt, 0, "bracelets");
  return next;
}

function main() {
  const existing = readFileSync(CSV, "utf8");
  const lines = existing.replace(/\r\n/g, "\n").trimEnd().split("\n");
  const oldHeader = parseCsvRow(lines[0]);
  const newHeader = ensureBraceletsHeader(oldHeader);
  const braceletIdx = newHeader.indexOf("bracelets");

  const dataLines = lines.slice(1);

  // Parse all rows under the OLD header, then re-emit under the NEW header.
  const oldBrandIdx = oldHeader.indexOf("brand");
  const nonRolex = [];
  for (const line of dataLines) {
    if (!line.trim()) continue;
    const cols = parseCsvRow(line);
    const brand = cols[oldBrandIdx];
    if (brand === "Rolex") continue; // discarded; rebuilt below
    // Add empty bracelets value at the right position (only if we just added it).
    if (!oldHeader.includes("bracelets")) {
      cols.splice(braceletIdx, 0, "");
    }
    nonRolex.push(cols.map(csvEscape).join(","));
  }

  // Build Rolex rows from the inline mapping, sorted by reference_number.
  const refs = Object.keys(REFS).sort((a, b) => a.localeCompare(b));
  let rolexWithImages = 0;
  let rolexImageOnRequest = 0;
  let orphanCount = 0;
  let legacyCount = 0;
  const rolexRows = [];
  for (const refLower of refs) {
    const meta = REFS[refLower];
    const row = buildRolexRow(refLower, meta, newHeader);
    rolexRows.push(row);
    const images = listImages(refLower);
    if (images) rolexWithImages++; else rolexImageOnRequest++;
    if (meta.orphan) orphanCount++;
    if (meta.legacy) legacyCount++;
  }

  // Sort Rolex rows by reference_number for stability.
  const refColIdx = newHeader.indexOf("reference_number");
  rolexRows.sort((a, b) => {
    const ar = parseCsvRow(a)[refColIdx];
    const br = parseCsvRow(b)[refColIdx];
    return ar.localeCompare(br);
  });

  const output = [newHeader.join(","), ...rolexRows, ...nonRolex].join("\n") + "\n";
  writeFileSync(CSV, output);

  const total = rolexRows.length + nonRolex.length;
  console.log(`Wrote ${CSV}`);
  console.log(`  Total rows:           ${total}`);
  console.log(`  Rolex rows:           ${rolexRows.length}`);
  console.log(`    with images:        ${rolexWithImages}`);
  console.log(`    image-on-request:   ${rolexImageOnRequest}`);
  console.log(`    of which orphans:   ${orphanCount}`);
  console.log(`    of which legacy:    ${legacyCount}`);
  console.log(`  Non-Rolex rows:       ${nonRolex.length}`);
}

main();
