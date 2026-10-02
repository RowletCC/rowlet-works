# The Pass

A small, playable restaurant-management interface. Select a table, serve a finished order, clear a table, seat the next party, or adjust the menu's prices.

**[Open the demo](https://rowletcc.github.io/the-pass-ui/)**

The main screen connects a dining-room floor plan to a kitchen docket. A price change only affects new orders; seated guests retain their original ticket prices. Ingredient contribution is labelled separately from restaurant profit.

## Run

Open `index.html` directly in a browser. There are no dependencies, external assets, trackers, network requests, accounts, or payment functionality. State stays in memory and resets on reload.

## Context

This is an independent interface study prompted by HNTR Studios' public Food Empire Simulator GUI brief. It is not commissioned, approved, affiliated with HNTR, or integrated into Unreal Engine. All restaurant names, customers, dishes, prices and service states are fictional. It demonstrates an interaction direction, not a completed game UI.

## Inputs

- Mouse or touch: choose a table and use its current action.
- Keyboard: Tab through controls; Left/Right or Home/End switch the two management tabs; native arrow keys adjust prices.
- **Advance 10 min** simulates cooking and dining completion.
- **Reset demo** restores the initial service and prices.

See [VALIDATION.md](VALIDATION.md) for the checks actually performed.

Created by Jianhao Cheng / [RowletCC](https://github.com/RowletCC).
