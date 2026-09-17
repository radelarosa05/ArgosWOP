# Modular Card Catalogs

These XML files are the maintainable authoring layer for card content:

`cards.xml` is the canonical combined database used by the active game. It lives in this folder alongside the modular catalogs.

- `mythos.xml`: Mythos combat stats, roles, abilities, lore, and image paths
- `relics.xml`: equipment boosts, durations, passives, lore, and image paths
- `events.xml`: one-shot costs, Dominion damage, draws, effects, lore, and image paths
- `lands.xml`: territory categories, Dominion, energy, placement leadership, lore, and image paths

The active HTML loads `catalogs/cards.xml` first and keeps its embedded/generated database as a compatibility fallback. Add new records with unique IDs and then merge them into `cards.xml` or load them through the game XML import control. The SVG assets in `../assets/cards/` are intentionally built with the same dark cinematic framing, warm gold edge light, centered subject, and Philippine-inspired symbol language as the Supreme Leader cards.
