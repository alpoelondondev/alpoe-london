# Ring Builder — photography shot list

The builder's option tiles use **real photography wherever it exists** and fall back to the
live 3D render where it doesn't. Nothing breaks while this list is being worked through:
each photograph that lands replaces one render, and the only code change is adding a line to
`lib/ring/photos.ts`.

## Why photographs and not renders

The live 3D is genuinely good at one thing no photograph can do — showing *your* stone in
*your* setting in *your* metal, turned in the light. It is not good at looking like a
photograph, and on a phone GPU it never will be.

The tiles have the opposite job. They are a shop window: they need to make the piece
desirable and let someone tell fifteen settings apart at a glance. That is what a lit product
shot is for.

Worth knowing that the reference site everyone points at works the same way — its option
tiles are static imagery, and the WebGL view is opt-in behind a play control rather than the
default. We are not conceding anything by doing this; we are doing what the category leader
does, and our 3D viewer is better than theirs.

## Do not use

The images under `docs/reference/57-jewellers/` are a competitor's copyrighted CGI, including
the set with "ALPOE LONDON" added to the band. Those are worse than the originals, not better
— adding text makes a derivative work, and presenting a competitor's product photograph as an
Alpoe ring is a misleading action under the DMCC Act 2024 quite separately from the
copyright. They stay as reference for framing and lighting only.

## File naming — strict, because paths resolve by id

```
public/ring-builder/settings/{settingId}.jpg
public/ring-builder/shapes/{shapeId}.jpg
```

All lowercase, hyphens, no spaces, no capitals. The ids are exactly the strings below.

## Specification

These now do two jobs, so shoot them properly. As well as the option tiles, each setting's
photograph appears **full size beside the live 3D preview**, at roughly 340px on desktop and
larger on a big screen. It is the first thing anyone sees and it is carrying the quality of
the piece, so it wants real lighting rather than a phone snap on a windowsill.

| | |
|---|---|
| Crop | Square, 2000 × 2000 (downscaled for tiles automatically) |
| Weight | Under 600 KB at full size (the site serves AVIF/WebP from this) |
| Focus | Stacked if possible — a ring at close range has almost no depth of field, and a soft claw ruins the shot |
| Ground | Plain, near-white — tiles sit on `#f4f1ee`, so a white sweep matches |
| Angle | Three-quarter, slightly above, matching the viewer's default camera |
| Metal | **The same metal in every shot** |
| Stone | **The same centre stone in every shot** |

The last two matter more than they sound. The tile exists to show the *setting*; if the metal
changes between tiles the grid reads as a jumble and the eye compares the wrong thing.
**Platinum with a 1.00ct round brilliant** is the right constant, because it is the builder's
default configuration — click a tile and the viewer shows you the same thing.

Shooting three-quarter from slightly above rather than dead-on means selecting a tile is
continuous with the viewer rather than a jump cut.

## The list

### Settings — priority 1 (built and live in the builder now)

| id | Name | Notes |
|---|---|---|
| `solitaire` | Solitaire | Four claw. The default, so shoot this one best. |
| `rubover` | Rubover | Full metal wall around the girdle |
| `halo` | Halo | Single ring of grain-set melee |
| `grain-set` | Grain Set | Diamond-set shoulders, plain head |
| `hidden-halo` | Hidden Halo | Angle must show the melee under the girdle — dead-on hides the whole point |
| `double-halo` | Double Halo | Two concentric rings |
| `knife-edge` | Knife Edge | Light along the ridge is the shot; a flat key kills it |

### Settings — priority 2 (recipes still being built)

`trilogy` · `side-stone` · `channel-set` · `split-shank` · `crossover` · `cluster` ·
`vintage` · `trellis` · `tension` · `toi-et-moi`

### Shapes — loose stones, same ground

Ordered by UK demand. Round and oval together are about 69% of the British market, so those
two carry the most weight.

`round` · `oval` · `cushion` · `emerald` · `pear` · `radiant` · `marquise` · `asscher`

Loose stones face-up, same lighting as the settings. These matter less than the setting tiles
— a shape is easier to read than a setting — so they are the lower priority of the two lists.

## Wiring a photograph up

Drop the file in, then add one line to `lib/ring/photos.ts`:

```ts
const SETTING_PHOTOS: Partial<Record<SettingId, string>> = {
  solitaire: "/ring-builder/settings/solitaire.jpg",
};
```

The tile switches from render to photograph on the next load, and stops asking the thumbnail
forge to render it at all.
