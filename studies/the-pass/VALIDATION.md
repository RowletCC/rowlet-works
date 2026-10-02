# Validation — 2 October 2026

Browser interactions were checked in Chromium through the Codex in-app browser, at the default 1280px viewport and a 390px mobile viewport.

- Initial state: 7 seated guests, 2/6 free tables, selected Table 04 ready to serve with a $48 ticket.
- Serve Table 04: it changes to Dining and disappears from the kitchen queue; its total remains $48.
- Advance three times: clock changes from 18:42 to 19:12; Table 01 becomes Ready and Tables 04/05 finish dining.
- Clear Table 04, seat the next party: Morgan's party of two goes to a suitable two-seat table; guest and free-table counts update together.
- Change Garden plate to $16.50 with the native numeric control: ingredient contribution is $13.30 and food cost is 19% after rounding.
- The existing Table 04 ticket remains $48 after that price change. Seating a new party of two creates a $33 Garden plate ticket.
- Set that price to zero: contribution displays -$3.20 in the loss color; percentage becomes a dash rather than Infinity.
- Reset restores prices, clock, queue, selected table and service states.
- ArrowLeft on the Menu pricing tab selects Dining room and moves focus to that tab.
- At 390px, document width remains 390px. The menu has its own horizontal scrolling container for its 650px table.
- JavaScript syntax check passed. No external asset URL is present in the HTML.

Limits: this is a browser concept, with no Unreal/UMG integration, controller navigation, saving/loading, multiplayer synchronization, live restaurant data or production performance claim. No full automated test suite is claimed.
