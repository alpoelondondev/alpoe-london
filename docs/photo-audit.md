# Product Photo Audit

Audit of every prerendered product detail page. A page "missing photos" renders the
"High-resolution photography on request" placeholder instead of a gallery.

## Summary

| Section | With photos | Missing photos |
|---|---|---|
| Watches | 183 | 212 |
| Jewellery | 0 | 13 |

No broken image references were found (every image path used by a page exists in /public).

## How to add photos

- **Watches**: drop images into `public/products/<brand-slug>/<reference>/` (e.g. `public/products/rolex/126610ln/1.png`). The build regenerates the manifest automatically (`pnpm gen:data`). Photos are matched by reference number.
- **Jewellery**: put image paths in the `images` column of `data/products.csv` (pipe-separated, paths under /public). Currently **all 13 jewellery products have an empty images column**.

## Watch pages missing photos (212)

### audemars-piguet (83)

- /watches/audemars-piguet/audemars-piguet-royal-oak-15500st-blue
- /watches/audemars-piguet/code-11-59-black-dial-15210bc-oo-a002cr-01
- /watches/audemars-piguet/code-11-59-chronograph-41mm-smoked-blue-steel-26393st-oo-a020ca-01
- /watches/audemars-piguet/code-11-59-chronograph-41mm-smoked-grey-white-gold-26393bc-oo-a321cr-01
- /watches/audemars-piguet/code-11-59-chronograph-rose-gold-black-26393or-oo-a002cr-01
- /watches/audemars-piguet/code-11-59-chronograph-rose-gold-blue-26393or-oo-a321cr-01
- /watches/audemars-piguet/code-11-59-chronograph-steel-black-26393bc-oo-a002cr-01
- /watches/audemars-piguet/code-11-59-flying-tourbillon-steel-26393bc-oo-d321cr-01
- /watches/audemars-piguet/code-11-59-perpetual-calendar-rose-gold-26394or-oo-d321cr-01
- /watches/audemars-piguet/code-11-59-rose-gold-15210or-oo-a002cr-01
- /watches/audemars-piguet/code-11-59-rose-gold-white-dial-15210or-oo-a099cr-01
- /watches/audemars-piguet/code-11-59-selfwinding-41mm-smoked-blue-white-gold-15210bc-oo-a321cr-01
- /watches/audemars-piguet/code-11-59-selfwinding-41mm-smoked-grey-steel-15210st-oo-a007ca-01
- /watches/audemars-piguet/code-11-59-tourbillon-41mm-skeletonised-steel-26398st-oo-a002kb-01
- /watches/audemars-piguet/code-11-59-tourbillon-openworked-rose-gold-266000r-oo-d002cr-01
- /watches/audemars-piguet/royal-oak-bronze-15550ba-oo-1356ba-01
- /watches/audemars-piguet/royal-oak-bronze-alt-15550ba-oo-1356ba-02
- /watches/audemars-piguet/royal-oak-bronze-black-15551bc-zz-1356bc-01
- /watches/audemars-piguet/royal-oak-ceramic-emerald-77350ce-oo-1266ce-03-a
- /watches/audemars-piguet/royal-oak-chronograph-41mm-black-ceramic-26240ce-oo-1225ce-02
- /watches/audemars-piguet/royal-oak-chronograph-41mm-black-dial-steel-26240st-oo-1320st-06
- /watches/audemars-piguet/royal-oak-chronograph-41mm-blue-dial-steel-26240st-oo-1320st-05
- /watches/audemars-piguet/royal-oak-chronograph-41mm-green-dial-steel-26240st-oo-1320st-08
- /watches/audemars-piguet/royal-oak-chronograph-41mm-grey-dial-steel-26240st-oo-1320st-07
- /watches/audemars-piguet/royal-oak-chronograph-41mm-rose-gold-26240or-oo-1320or-05
- /watches/audemars-piguet/royal-oak-chronograph-41mm-white-gold-26240bc-oo-1320bc-04
- /watches/audemars-piguet/royal-oak-flying-tourbillon-41mm-steel-26730st-oo-1320st-05
- /watches/audemars-piguet/royal-oak-flying-tourbillon-41mm-titanium-26730ti-oo-1320ti-02
- /watches/audemars-piguet/royal-oak-frosted-gold-41mm-rose-gold-15412or-yg-1224or-01-b
- /watches/audemars-piguet/royal-oak-frosted-gold-41mm-white-gold-15412bc-yg-1224bc-03-b
- /watches/audemars-piguet/royal-oak-frosted-gold-41mm-yellow-gold-15412ba-yg-1224ba-01-b
- /watches/audemars-piguet/royal-oak-jumbo-extra-thin-39mm-steel-blue-16202st-oo-1240st-02
- /watches/audemars-piguet/royal-oak-jumbo-extra-thin-39mm-titanium-16202xt-oo-1240xt-01
- /watches/audemars-piguet/royal-oak-jumbo-extra-thin-39mm-white-gold-16202bc-oo-1240bc-02
- /watches/audemars-piguet/royal-oak-jumbo-extra-thin-39mm-yellow-gold-16202ba-hh-1241ba-01
- /watches/audemars-piguet/royal-oak-offshore-chrono-44mm-black-ceramic-26420ce-oo-a002ca-01
- /watches/audemars-piguet/royal-oak-offshore-chrono-44mm-black-steel-26420st-oo-a002ca-01
- /watches/audemars-piguet/royal-oak-offshore-chrono-44mm-blue-titanium-26400io-oo-a004ca-01
- /watches/audemars-piguet/royal-oak-offshore-chrono-44mm-brown-rose-gold-26470or-oo-1000or-01
- /watches/audemars-piguet/royal-oak-offshore-chrono-44mm-green-titanium-26400io-oo-a056ca-01
- /watches/audemars-piguet/royal-oak-offshore-chrono-44mm-grey-titanium-26420ti-oo-a027ca-01
- /watches/audemars-piguet/royal-oak-offshore-selfwinding-43mm-black-ceramic-15720ce-oo-a002ca-01
- /watches/audemars-piguet/royal-oak-offshore-selfwinding-43mm-blue-dial-15710st-oo-a002ca-01
- /watches/audemars-piguet/royal-oak-offshore-selfwinding-43mm-green-dial-15710st-oo-a020ca-01
- /watches/audemars-piguet/royal-oak-offshore-selfwinding-43mm-grey-titanium-15720ti-oo-a009ca-01
- /watches/audemars-piguet/royal-oak-offshore-selfwinding-43mm-silver-dial-15710st-oo-a009ca-01
- /watches/audemars-piguet/royal-oak-openworked-41mm-steel-15407st-oo-1220st-02
- /watches/audemars-piguet/royal-oak-openworked-41mm-yellow-gold-15407ba-oo-1220ba-01
- /watches/audemars-piguet/royal-oak-perpetual-calendar-41mm-bleu-nuit-ceramic-26674cd-oo-1225cd-01
- /watches/audemars-piguet/royal-oak-perpetual-calendar-41mm-steel-blue-26674st-oo-1320st-01
- /watches/audemars-piguet/royal-oak-rose-gold-15400or-oo-d088cr-01
- /watches/audemars-piguet/royal-oak-rose-gold-77351or-zz-1261or-01
- /watches/audemars-piguet/royal-oak-rose-gold-alt-15551or-zz-1356or-04
- /watches/audemars-piguet/royal-oak-rose-gold-alt-2-15551or-zz-1356or-05
- /watches/audemars-piguet/royal-oak-rose-gold-blue-leather-15510or-oo-d315cr-02
- /watches/audemars-piguet/royal-oak-rose-gold-bracelet-15500or-oo-1220or-01
- /watches/audemars-piguet/royal-oak-rose-gold-leather-15500or-oo-d002cr-01
- /watches/audemars-piguet/royal-oak-rose-gold-leather-15510or-oo-d002cr-02
- /watches/audemars-piguet/royal-oak-rose-gold-vintage-67650or-oo-1261or-01
- /watches/audemars-piguet/royal-oak-selfwinding-41mm-black-dial-steel-15510st-oo-1320st-08
- /watches/audemars-piguet/royal-oak-selfwinding-41mm-blue-dial-rose-gold-15510or-oo-1320or-03
- /watches/audemars-piguet/royal-oak-selfwinding-41mm-blue-dial-steel-15510st-oo-1320st-06
- /watches/audemars-piguet/royal-oak-selfwinding-41mm-blue-dial-white-gold-15510bc-oo-1320bc-04
- /watches/audemars-piguet/royal-oak-selfwinding-41mm-green-dial-steel-15510st-oo-1320st-09
- /watches/audemars-piguet/royal-oak-selfwinding-41mm-grey-dial-rose-gold-15510or-oo-1320or-04
- /watches/audemars-piguet/royal-oak-selfwinding-41mm-grey-dial-steel-15510st-oo-1320st-07
- /watches/audemars-piguet/royal-oak-selfwinding-41mm-salmon-dial-steel-15510st-oo-1320st-10
- /watches/audemars-piguet/royal-oak-selfwinding-41mm-yellow-gold-15513ba-oo-1320ba-01
- /watches/audemars-piguet/royal-oak-stainless-steel-red-15550sr-oo-1356sr-02
- /watches/audemars-piguet/royal-oak-stainless-steel-red-77350sr-oo-1261sr-01
- /watches/audemars-piguet/royal-oak-steel-15550st-oo-1356st-05
- /watches/audemars-piguet/royal-oak-steel-alt-15550st-oo-1356st-06
- /watches/audemars-piguet/royal-oak-steel-alt-2-15550st-oo-1356st-07
- /watches/audemars-piguet/royal-oak-steel-alt-3-15550st-oo-1356st-08
- /watches/audemars-piguet/royal-oak-steel-black-dial-15510bc-oo-1320bc-02
- /watches/audemars-piguet/royal-oak-steel-bracelet-15500st-oo-1220st-01
- /watches/audemars-piguet/royal-oak-steel-bracelet-alt-15500st-oo-1220st-02
- /watches/audemars-piguet/royal-oak-steel-bracelet-alt-2-15500st-oo-1220st-03
- /watches/audemars-piguet/royal-oak-steel-bracelet-alt-3-15500st-oo-1220st-04
- /watches/audemars-piguet/royal-oak-steel-ceramic-15551st-zz-1356st-04
- /watches/audemars-piguet/royal-oak-steel-ceramic-alt-15551st-zz-1356st-05
- /watches/audemars-piguet/royal-oak-steel-ceramic-alt-2-15551st-zz-1356st-06
- /watches/audemars-piguet/royal-oak-steel-yellow-77350st-oo-1261st-01

### breitling (1)

- /watches/breitling/breitling-navitimer-b01-chronograph-43-ab0138

### cartier (34)

- /watches/cartier/ballon-bleu-33mm-steel-and-rose-gold-w6920068
- /watches/cartier/ballon-bleu-36mm-steel-silver-wsbb0048
- /watches/cartier/ballon-bleu-40mm-steel-silver-wsbb0007
- /watches/cartier/ballon-bleu-42mm-rose-gold-silver-wsbb0026
- /watches/cartier/ballon-bleu-42mm-steel-silver-w69012z4
- /watches/cartier/cartier-santos-wssa0018
- /watches/cartier/panth-re-de-cartier-medium-steel-and-yellow-gold-w2pn0006
- /watches/cartier/panth-re-de-cartier-medium-steel-wspa0013
- /watches/cartier/panth-re-de-cartier-mini-steel-wspa0014
- /watches/cartier/panth-re-de-cartier-small-steel-wspa0012
- /watches/cartier/santos-de-cartier-large-adlc-black-wssa0037
- /watches/cartier/santos-de-cartier-large-rose-gold-silver-dial-wgsa0010
- /watches/cartier/santos-de-cartier-large-steel-and-gold-silver-w2sa0016
- /watches/cartier/santos-de-cartier-large-steel-blue-dial-wssa0030
- /watches/cartier/santos-de-cartier-large-steel-green-dial-wssa0061
- /watches/cartier/santos-de-cartier-large-steel-grey-dial-wssa0062
- /watches/cartier/santos-de-cartier-large-steel-silver-dial-wssa0018
- /watches/cartier/santos-de-cartier-medium-steel-and-gold-w2sa0011
- /watches/cartier/santos-de-cartier-medium-steel-silver-dial-wssa0020
- /watches/cartier/santos-de-cartier-xl-steel-black-dial-wssa0044
- /watches/cartier/santos-dumont-xl-yellow-gold-ivory-wgsa0021
- /watches/cartier/tank-am-ricaine-white-gold-silver-w2606956
- /watches/cartier/tank-fran-aise-large-steel-and-gold-silver-w51002q3
- /watches/cartier/tank-fran-aise-large-steel-silver-wsta0067
- /watches/cartier/tank-fran-aise-medium-steel-and-gold-w51012q4
- /watches/cartier/tank-louis-cartier-rose-gold-silver-wgta0091
- /watches/cartier/tank-louis-cartier-yellow-gold-silver-wgta0023
- /watches/cartier/tank-mc-steel-silver-wsta0010
- /watches/cartier/tank-must-large-steel-blue-wsta0052
- /watches/cartier/tank-must-large-steel-green-wsta0057
- /watches/cartier/tank-must-large-steel-silver-wsta0041
- /watches/cartier/tank-must-medium-steel-silver-wsta0060
- /watches/cartier/tank-solo-large-steel-silver-w5200003
- /watches/cartier/tank-solo-xl-steel-silver-w5200028

### hublot (1)

- /watches/hublot/hublot-big-bang-301-sx-130-rx

### iwc (1)

- /watches/iwc/iwc-portugieser-automatic-iw500109

### omega (1)

- /watches/omega/omega-speedmaster-moonwatch-310-30-42-50-01-001

### panerai (1)

- /watches/panerai/panerai-luminor-marina-pam00111

### patek-philippe (30)

- /watches/patek-philippe/annual-calendar-5205-white-gold-blue-5205g-013
- /watches/patek-philippe/annual-calendar-5396-white-gold-moon-5396g-014
- /watches/patek-philippe/aquanaut-5164-travel-time-rose-gold-5164r-001
- /watches/patek-philippe/aquanaut-5164-travel-time-steel-5164a-001
- /watches/patek-philippe/aquanaut-5167-ladies-rose-gold-chocolate-5067a-025
- /watches/patek-philippe/aquanaut-5167-steel-black-tropical-5167a-001
- /watches/patek-philippe/aquanaut-5167-steel-khaki-green-5167a-025
- /watches/patek-philippe/aquanaut-5168-white-gold-green-5168g-010
- /watches/patek-philippe/aquanaut-5968-chrono-steel-orange-5968a-001
- /watches/patek-philippe/calatrava-5116-white-gold-5116g-001
- /watches/patek-philippe/calatrava-5153-rose-gold-5153r-001
- /watches/patek-philippe/calatrava-5196-platinum-5196p-001
- /watches/patek-philippe/calatrava-5227-white-gold-5227g-001
- /watches/patek-philippe/calatrava-6000-yellow-gold-6000j-001
- /watches/patek-philippe/calatrava-6119-white-gold-ebony-black-6119g-010
- /watches/patek-philippe/chronograph-5172-white-gold-silver-5172g-001
- /watches/patek-philippe/cubitus-5821-steel-khaki-green-5821a-001
- /watches/patek-philippe/moonphase-5320-white-gold-5320g-011
- /watches/patek-philippe/nautilus-5712-moon-phases-rose-gold-5712-1r-001
- /watches/patek-philippe/nautilus-5712-moon-phases-steel-5712-1a-001
- /watches/patek-philippe/nautilus-5712-moon-phases-white-gold-5712-1g-001
- /watches/patek-philippe/nautilus-5726-annual-calendar-rose-gold-5726-1r-001
- /watches/patek-philippe/nautilus-5726-annual-calendar-steel-blue-dial-5726a-001
- /watches/patek-philippe/nautilus-5726-annual-calendar-steel-green-dial-5726-1a-014
- /watches/patek-philippe/nautilus-5726-annual-calendar-white-gold-5726-1g-001
- /watches/patek-philippe/nautilus-5811-white-gold-blue-dial-5811-1g-001
- /watches/patek-philippe/nautilus-5811-white-gold-white-dial-5811-1g-011
- /watches/patek-philippe/patek-philippe-nautilus-5711-1a-010
- /watches/patek-philippe/perpetual-calendar-5270-white-gold-5270g-014
- /watches/patek-philippe/world-time-5230-white-gold-5230g-010

### richard-mille (5)

- /watches/richard-mille/richard-mille-rm-011-felipe-massa
- /watches/richard-mille/rm-011-automatic-flyback-chronograph-rm-011
- /watches/richard-mille/rm-035-rafael-nadal-carbon-rm-35-02-rm-35-02
- /watches/richard-mille/rm-035-rafael-nadal-rm-35-03-rm-35-03
- /watches/richard-mille/rm-067-extra-flat-automatic-rm-67-01-rm-67-01

### rolex (54)

- /watches/rolex/datejust-41-chocolate-rose-gold-jubilee-126301
- /watches/rolex/datejust-41-silver-rose-gold-jubilee-126301
- /watches/rolex/datejust-41-slate-deco-jubilee-126303
- /watches/rolex/datejust-41-sundust-rose-gold-jubilee-126301
- /watches/rolex/datejust-41-white-gold-black-diamond-126339
- /watches/rolex/datejust-41-white-gold-blue-diamond-126339
- /watches/rolex/datejust-41-white-gold-silver-diamond-126339
- /watches/rolex/datejust-41-white-rose-gold-jubilee-126301
- /watches/rolex/datejust-41-yellow-gold-black-diamond-126348rbr
- /watches/rolex/datejust-41-yellow-gold-champagne-126338
- /watches/rolex/datejust-41-yellow-gold-silver-126338
- /watches/rolex/rolex-cosmograph-daytona-116500ln
- /watches/rolex/rolex-datejust-126200
- /watches/rolex/rolex-datejust-126201
- /watches/rolex/rolex-datejust-126203
- /watches/rolex/rolex-datejust-126231
- /watches/rolex/rolex-datejust-126233
- /watches/rolex/rolex-datejust-126301
- /watches/rolex/rolex-datejust-126303
- /watches/rolex/rolex-datejust-278240
- /watches/rolex/rolex-day-date-128235
- /watches/rolex/rolex-day-date-128236
- /watches/rolex/rolex-day-date-128238
- /watches/rolex/rolex-day-date-128239
- /watches/rolex/rolex-day-date-228348rbr
- /watches/rolex/rolex-day-date-228396tbr
- /watches/rolex/rolex-daytona-126515ln
- /watches/rolex/rolex-daytona-126518ln
- /watches/rolex/rolex-daytona-126535tbr
- /watches/rolex/rolex-daytona-126538tbr
- /watches/rolex/rolex-daytona-126539tbr
- /watches/rolex/rolex-daytona-126589rbr
- /watches/rolex/rolex-gmt-master-ii-126715ln
- /watches/rolex/rolex-gmt-master-ii-126718ln
- /watches/rolex/rolex-lady-datejust-279160
- /watches/rolex/rolex-lady-datejust-279173
- /watches/rolex/rolex-land-dweller-127234
- /watches/rolex/rolex-land-dweller-127235
- /watches/rolex/rolex-land-dweller-127236
- /watches/rolex/rolex-land-dweller-127285tbr
- /watches/rolex/rolex-land-dweller-127286tbr
- /watches/rolex/rolex-land-dweller-127334
- /watches/rolex/rolex-land-dweller-127335
- /watches/rolex/rolex-land-dweller-127336
- /watches/rolex/rolex-land-dweller-127385tbr
- /watches/rolex/rolex-land-dweller-127386tbr
- /watches/rolex/rolex-oyster-perpetual-124200
- /watches/rolex/rolex-oyster-perpetual-126000
- /watches/rolex/rolex-oyster-perpetual-134300
- /watches/rolex/rolex-oyster-perpetual-276200
- /watches/rolex/rolex-oyster-perpetual-277200
- /watches/rolex/rolex-submariner-126613ln
- /watches/rolex/rolex-submariner-126618ln
- /watches/rolex/rolex-submariner-date-116610ln

### vacheron-constantin (1)

- /watches/vacheron-constantin/vacheron-constantin-overseas-4500v-110a-b128

## Jewellery pages missing photos (13 — all of them)

- /jewellery/bracelets/diamond-tennis-bracelet-5ct-18ct-white-gold
- /jewellery/earrings/diamond-hoop-earrings-18ct-white-gold
- /jewellery/earrings/diamond-stud-earrings-2ct-platinum
- /jewellery/engagement-rings/oval-halo-1-5ct-platinum
- /jewellery/engagement-rings/round-brilliant-solitaire-2ct-platinum
- /jewellery/mens-jewellery/8mm-cuban-link-chain-18ct-yellow-gold
- /jewellery/mens-jewellery/onyx-signet-ring-18ct-yellow-gold
- /jewellery/necklaces-pendants/10mm-cuban-chain-18ct-yellow-gold
- /jewellery/necklaces-pendants/bespoke-ice-pendant-18ct-white-gold
- /jewellery/rings/emerald-cocktail-ring-18ct-yellow-gold
- /jewellery/rings/half-eternity-diamond-ring-platinum
- /jewellery/wedding-rings/court-wedding-band-4mm-platinum
- /jewellery/wedding-rings/diamond-full-eternity-platinum
