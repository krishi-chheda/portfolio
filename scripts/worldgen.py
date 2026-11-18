"""Generates every KRISHI.WORLD map file and validates it (overlaps, doors, warps, reachability).
Run from anywhere: python scripts/worldgen.py   (rewrites src/game/maps/<name>.ts for all five maps)
Spots listed per map (NPCs, crystals, inspectables) must match src/game/content.ts."""
import os
import random
from collections import deque

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'src', 'game', 'maps')
W, H = 40, 30
SIZES = {'tree': (2, 2), 'house': (5, 4), 'university': (8, 5), 'sign': (1, 1), 'mailbox': (1, 1), 'lamp': (1, 1),
         'fountain': (3, 3), 'bldg-accessvision': (6, 5), 'bldg-clinicalbrief': (6, 5), 'bldg-traffic': (6, 5),
         'bldg-os': (6, 5), 'lab': (6, 4), 'computer': (1, 1), 'arena': (8, 5), 'office': (5, 5), 'flag': (1, 1),
         'palm': (1, 1), 'hut': (4, 3), 'buoy': (1, 1), 'tripod': (1, 1), 'mat': (1, 1)}
DOORS = {'house': [(2, 3)], 'university': [(3, 4), (4, 4)], 'lab': [(2, 3), (3, 3)], 'arena': [(3, 4), (4, 4)],
         'office': [(2, 4)], 'hut': [(1, 2)], **{k: [(2, 4), (3, 4)] for k in SIZES if k.startswith('bldg-')}}
WALKABLE = set('.,^p=*:d')  # terrain the player can stand on (water ~ and fence F are blocked)


class Map:
    def __init__(self, map_id, name, var, seed, fill='.'):
        self.id, self.name, self.var = map_id, name, var
        self.g = [[fill] * W for _ in range(H)]
        self.objects, self.warps, self.border_gaps = [], [], []
        self.border = True
        self.reserved = set()  # tiles scatter must not touch
        random.seed(seed)

    def rect(self, ch, x0, y0, x1, y1):
        for y in range(y0, y1 + 1):
            for x in range(x0, x1 + 1):
                self.g[y][x] = ch

    def speckle(self, ch, n, allowed='.'):
        for _ in range(n):
            x, y = random.randrange(W), random.randrange(H)
            if self.g[y][x] in allowed:
                self.g[y][x] = ch

    def add(self, kind, x, y):
        self.objects.append((kind, x, y))

    def border_tiles(self):
        trees = [(x, 0) for x in range(0, W, 2)] + [(x, H - 2) for x in range(0, W, 2)]
        trees += [(0, y) for y in range(2, H - 2, 2)] + [(W - 2, y) for y in range(2, H - 2, 2)]
        return [t for t in trees if t not in self.border_gaps] if self.border else []

    def occupied(self):
        occ = {}
        for (x, y) in self.border_tiles():
            for dx in range(2):
                for dy in range(2):
                    occ[(x + dx, y + dy)] = 'border'
        for kind, ox, oy in self.objects:
            w, h = SIZES[kind]
            for dx in range(w):
                for dy in range(h):
                    key = (ox + dx, oy + dy)
                    assert key not in occ, f'{self.id}: {kind}@{ox},{oy} overlaps {occ[key]} at {key}'
                    ch = self.g[key[1]][key[0]]
                    ok = ch == '~' if kind == 'buoy' else ch in WALKABLE
                    assert ok, f'{self.id}: {kind}@{ox},{oy} sits on {ch!r} at {key}'
                    occ[key] = f'{kind}@{ox},{oy}'
        return occ

    def scatter_trees(self, n, area):
        """Random 2x2 trees inside area (x0,y0,x1,y1) on grass, avoiding reserved tiles and everything placed."""
        x0, y0, x1, y1 = area
        placed = 0
        for _ in range(n * 30):
            if placed >= n:
                break
            x, y = random.randrange(x0, x1 - 1), random.randrange(y0, y1 - 1)
            cells = [(x + dx, y + dy) for dx in range(2) for dy in range(2)]
            occ = self.occupied()
            if any(c in occ or c in self.reserved or self.g[c[1]][c[0]] not in '.,^' for c in cells):
                continue
            self.add('tree', x, y)
            placed += 1

    def validate(self, spawn, spots):
        occ = self.occupied()
        blocked = lambda x, y: (x, y) in occ or self.g[y][x] not in WALKABLE
        for kind, ox, oy in self.objects:
            for (dx, dy) in DOORS.get(kind, []):
                below = (ox + dx, oy + dy + 1)
                assert not blocked(*below), f'{self.id}: door of {kind}@{ox},{oy} opens onto a blocked tile {below}'
        # NPC / crystal spots become solid at runtime; check they're free now, then treat them as blocked for BFS
        for name, (x, y) in spots.items():
            if name.startswith(('npc:', 'crystal:')):
                assert not blocked(x, y), f'{self.id}: spot {name} at {x},{y} is not on free walkable ground'
        solid_spots = {xy for n, xy in spots.items() if n.startswith(('npc:', 'crystal:'))}
        seen, q = {spawn}, deque([spawn])
        assert not blocked(*spawn), f'{self.id}: spawn blocked'
        while q:
            x, y = q.popleft()
            for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
                if 0 <= nx < W and 0 <= ny < H and (nx, ny) not in seen and not blocked(nx, ny) and (nx, ny) not in solid_spots:
                    seen.add((nx, ny))
                    q.append((nx, ny))
        near = lambda x, y: any(n in seen for n in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)))
        for name, (x, y) in spots.items():
            assert near(x, y), f'{self.id}: {name} at {x},{y} cannot be reached'
        for kind, ox, oy in self.objects:
            for (dx, dy) in DOORS.get(kind, []):
                assert (ox + dx, oy + dy + 1) in seen, f'{self.id}: door of {kind}@{ox},{oy} unreachable'
        for w in self.warps:
            assert (w['x'], w['y']) in seen, f'{self.id}: warp at {w["x"]},{w["y"]} unreachable'
        return len(seen)

    def write(self, spawn, spots):
        reach = self.validate(spawn, spots)
        rows = [''.join(r) for r in self.g]
        trees = self.border_tiles()
        gaps = ', '.join(f'{{ x: {x}, y: {y} }}' for x, y in self.border_gaps)
        border = (f'    ...borderTrees({W}, {H}{", [" + gaps + "]" if gaps else ""}),\n') if self.border else ''
        objs = '\n'.join(f'    {{ kind: "{k}", x: {x}, y: {y} }},' for k, x, y in self.objects)
        warps = '\n'.join(f'    {{ x: {w["x"]}, y: {w["y"]}, to: "{w["to"]}", spawn: {{ x: {w["sx"]}, y: {w["sy"]} }}, facing: "{w["f"]}" }},' for w in self.warps)
        imports = 'borderTrees, type MapDef' if self.border else 'type MapDef'
        out = f'''import {{ {imports} }} from "./legend";

// {self.name}. Generated by scripts/worldgen.py: validates overlaps, doors, warps and that every
// character, crystal, sign and door is reachable from the spawn. Hand edits are still validated by buildMap().
export const {self.var}: MapDef = {{
  id: "{self.id}",
  name: "{self.name}",
  spawn: {{ x: {spawn[0]}, y: {spawn[1]} }},
  terrain: [
{chr(10).join(f'    "{r}",' for r in rows)}
  ],
  objects: [
{border}{objs}
  ],
  warps: [
{warps}
  ],
}};
'''
        with open(os.path.join(OUT, f'{self.var}.ts'), 'w', encoding='utf-8', newline='\n') as fh:
            fh.write(out)
        print(f'{self.id}: ok, {len(self.objects)} objects, {reach} reachable tiles')


def warp(m, x, y, to, sx, sy, f):
    m.warps.append({'x': x, 'y': y, 'to': to, 'sx': sx, 'sy': sy, 'f': f})


# ---------------- Origin Valley (centre) ----------------
o = Map('origin', 'Origin Valley', 'originValley', 4)
random.seed(4)
for _ in range(90):
    o.g[random.randrange(H)][random.randrange(W)] = ','
o.rect('=', 2, 14, W - 1, 15)             # east road -> Project Metropolis
o.rect('=', 19, 0, 20, H - 1)             # north road -> Innovation Forest, south road -> Adventure Coast
o.border_gaps = [(W - 2, 14), (18, 0), (20, 0), (18, H - 2), (20, H - 2)]
o.add('house', 4, 3); o.add('mailbox', 9, 6); o.add('house', 11, 3); o.add('mailbox', 16, 6)
o.rect('=', 6, 7, 6, 13); o.rect('=', 13, 7, 13, 13)
o.rect('*', 4, 9, 5, 10); o.rect('*', 7, 9, 8, 10); o.rect('*', 11, 9, 12, 10); o.rect('*', 14, 9, 15, 10)
o.add('university', 24, 2)
o.rect('=', 27, 7, 28, 13)
o.rect('*', 24, 9, 25, 10); o.rect('*', 30, 9, 31, 10)
o.rect(':', 3, 18, 12, 25); o.rect('~', 4, 19, 11, 24)
for (x, y) in [(4, 19), (11, 19), (4, 24), (11, 24)]:
    o.g[y][x] = ':'
o.rect('^', 14, 21, 17, 24); o.rect('^', 33, 2, 36, 5)
o.rect('F', 24, 20, 34, 25); o.rect('*', 25, 21, 33, 24)
o.rect('=', 29, 16, 30, 20)
for (x, y) in [(15, 18), (22, 22), (35, 16), (2, 10), (9, 11), (33, 11), (14, 26), (6, 26), (36, 22)]:
    o.add('tree', x, y)
o.add('sign', 18, 13)
warp(o, W - 1, 14, 'metropolis', 1, 14, 'right'); warp(o, W - 1, 15, 'metropolis', 1, 15, 'right')
warp(o, 19, 0, 'forest', 19, 28, 'up'); warp(o, 20, 0, 'forest', 20, 28, 'up')
warp(o, 19, H - 1, 'coast', 19, 1, 'down'); warp(o, 20, H - 1, 'coast', 20, 1, 'down')
o.write((21, 17), {'npc:guide': (23, 16), 'npc:neighbour': (10, 8), 'npc:professor': (26, 9), 'npc:gardener': (27, 22),
                   'crystal:ai-explorer': (32, 8), 'sign': (18, 13), 'mailbox': (9, 6), 'mailbox2': (16, 6)})

# ---------------- Project Metropolis (east of Origin) ----------------
m = Map('metropolis', 'Project Metropolis', 'projectMetropolis', 9)
m.speckle(',', 40)
m.rect('p', 3, 3, W - 4, H - 4)
m.rect('=', 0, 14, 2, 15)
m.rect('=', W - 3, 14, W - 1, 15)          # east road -> Leadership Frontier
m.border_gaps = [(0, 14), (W - 2, 14)]
for kind, x, y in [('bldg-accessvision', 7, 4), ('bldg-clinicalbrief', 27, 4), ('bldg-traffic', 7, 19), ('bldg-os', 27, 19)]:
    m.add(kind, x, y); m.add('sign', x + 1, y + 5); m.rect('*', x + 4, y + 5, x + 5, y + 5)
m.add('fountain', 18, 13)
for (x, y) in [(5, 11), (34, 11), (5, 18), (34, 18), (15, 10), (24, 10), (15, 18), (24, 18)]:
    m.add('lamp', x, y)
for (x, y) in [(15, 4), (22, 4), (15, 23), (22, 23)]:
    m.add('tree', x, y)
warp(m, 0, 14, 'origin', 38, 14, 'left'); warp(m, 0, 15, 'origin', 38, 15, 'left')
warp(m, W - 1, 14, 'frontier', 1, 14, 'right'); warp(m, W - 1, 15, 'frontier', 1, 15, 'right')
m.write((1, 14), {'npc:engineer': (17, 17), 'npc:commuter': (5, 12)})

# ---------------- Innovation Forest (north of Origin) ----------------
f = Map('forest', 'Innovation Forest', 'innovationForest', 21, fill=',')
f.speckle('.', 220, ',')
f.rect('=', 19, 12, 20, H - 1)            # trail in from the south
f.rect('=', 6, 12, 33, 13)                # east-west trail
f.rect('=', 10, 8, 11, 11); f.rect('=', 28, 8, 29, 11)
f.border_gaps = [(18, H - 2), (20, H - 2)]
f.add('lab', 8, 4); f.add('lab', 26, 4)
for (x, y) in [(8, 11), (14, 11), (24, 11), (32, 11)]:
    f.add('computer', x, y)
f.add('sign', 21, 26)
f.rect('^', 3, 15, 8, 18); f.rect('^', 31, 15, 36, 17); f.rect('^', 13, 22, 16, 25); f.rect('^', 23, 20, 27, 22)
forest_spots = {'npc:researcher': (16, 11), 'npc:intern': (25, 14),
                'crystal:python-developer': (4, 19), 'crystal:app-builder': (35, 20), 'crystal:deep-learning': (11, 25),
                'crystal:agent-builder': (28, 25), 'crystal:toolsmith': (35, 7)}
# Hidden trails from the main paths to each crystal (kept free of trees)
trails = [((6, 13), (4, 19)), ((33, 13), (35, 20)), ((19, 25), (11, 25)), ((20, 25), (28, 25)), ((33, 12), (35, 7))]
for (ax, ay), (bx, by) in trails:
    for x in range(min(ax, bx), max(ax, bx) + 1):
        f.reserved.add((x, ay))
    for y in range(min(ay, by), max(ay, by) + 1):
        f.reserved.add((bx, y))
for (x, y) in forest_spots.values():
    for dx in (-1, 0, 1):
        for dy in (-1, 0, 1):
            f.reserved.add((x + dx, y + dy))
for x in range(W):
    for y in range(H):
        if f.g[y][x] == '=':
            f.reserved.add((x, y))
f.scatter_trees(46, (2, 2, W - 2, H - 2))
warp(f, 19, H - 1, 'origin', 19, 1, 'down'); warp(f, 20, H - 1, 'origin', 20, 1, 'down')
f.write((19, 27), {**forest_spots, 'sign': (21, 26), 'pc1': (8, 11), 'pc2': (14, 11), 'pc3': (24, 11), 'pc4': (32, 11)})

# ---------------- Leadership Frontier (east of Metropolis) ----------------
l = Map('frontier', 'Leadership Frontier', 'leadershipFrontier', 33)
l.speckle(',', 60)
l.rect('p', 3, 7, W - 4, 20)
l.rect('=', 0, 14, 2, 15)
l.border_gaps = [(0, 14)]
l.add('office', 4, 2); l.add('arena', 16, 2); l.add('office', 31, 2)
for (x, y) in [(12, 9), (27, 9), (12, 18), (27, 18)]:
    l.add('flag', x, y)
l.add('sign', 2, 12)
l.rect('*', 6, 22, 33, 22)
l.rect('^', 4, 24, 9, 26); l.rect('^', 30, 24, 35, 26)
for (x, y) in [(13, 24), (24, 24), (18, 25)]:
    l.add('tree', x, y)
warp(l, 0, 14, 'metropolis', 38, 14, 'left'); warp(l, 0, 15, 'metropolis', 38, 15, 'left')
l.write((1, 14), {'npc:host': (19, 9), 'npc:coordinator': (9, 15), 'npc:mentor': (8, 8), 'npc:volunteer': (34, 8),
                  'crystal:team-leader': (35, 19), 'crystal:community-builder': (4, 19), 'crystal:professional': (4, 9),
                  'crystal:helping-hand': (35, 10), 'sign': (2, 12)})

# ---------------- Adventure Coast (south of Origin) ----------------
c = Map('coast', 'Adventure Coast', 'adventureCoast', 45)
c.border = False  # trees only along the top and upper sides; the ocean runs off the map
c.speckle(',', 40)
c.rect(':', 0, 7, W - 1, 14)
c.rect('~', 0, 15, W - 1, H - 1)
c.rect(':', 6, 20, 13, 24); c.rect(':', 25, 20, 33, 24)        # two islands
c.rect('d', 9, 15, 9, 19); c.rect('d', 29, 15, 29, 19)         # docks out to them
c.rect('d', 18, 10, 23, 12)                                    # yoga deck on the sand
c.rect('=', 19, 0, 20, 6)
for x in range(0, W, 2):
    if x not in (18, 20):
        c.add('tree', x, 0)
for y in (2, 4):
    c.add('tree', 0, y); c.add('tree', W - 2, y)
c.add('hut', 31, 8)
for (x, y) in [(3, 9), (15, 8), (26, 8), (37, 12), (7, 21), (12, 23), (26, 21), (32, 23)]:
    c.add('palm', x, y)
c.add('tripod', 5, 11); c.add('mat', 19, 11); c.add('mat', 21, 11); c.add('buoy', 34, 22); c.add('sign', 21, 6)
warp(c, 19, 0, 'origin', 19, 28, 'up'); warp(c, 20, 0, 'origin', 20, 28, 'up')
c.write((19, 2), {'npc:photographer': (7, 11), 'npc:instructor': (20, 9), 'npc:diver': (35, 11), 'npc:traveller': (28, 22),
                  'crystal:photographer': (11, 21), 'crystal:ocean-explorer': (31, 21), 'crystal:mindful-mover': (23, 11),
                  'tripod': (5, 11), 'mat': (19, 11), 'mat2': (21, 11), 'buoy': (34, 22), 'sign': (21, 6)})
