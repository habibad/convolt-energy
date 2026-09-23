from PIL import Image
import numpy as np

im = Image.open('reference/main_ui_crop.png')
w, h = im.size
print('Main UI Crop Size:', w, h)

arr = np.array(im)
green_mask = (arr[:, :, 1] > 110) & (arr[:, :, 1] - arr[:, :, 0] > 30) & (arr[:, :, 1] - arr[:, :, 2] > 30)
y_idx, x_idx = np.where(green_mask)

clusters = []
for x, y in zip(x_idx, y_idx):
    found = False
    for c in clusters:
        if abs(c['x'] - x) < 25 and abs(c['y'] - y) < 25:
            c['pts'].append((x, y))
            c['x'] = sum(p[0] for p in c['pts']) / len(c['pts'])
            c['y'] = sum(p[1] for p in c['pts']) / len(c['pts'])
            found = True
            break
    if not found:
        clusters.append({'x': float(x), 'y': float(y), 'pts': [(x, y)]})

clusters = [c for c in clusters if len(c['pts']) >= 4]
clusters.sort(key=lambda c: c['x'])
print('Found green clusters:')
for i, c in enumerate(clusters):
    px = round(c['x'], 1)
    py = round(c['y'], 1)
    pct_x = round((c['x'] / w) * 100, 1)
    pct_y = round((c['y'] / h) * 100, 1)
    cnt = len(c['pts'])
    print(f'Cluster {i}: x={px} ({pct_x}%), y={py} ({pct_y}%), count={cnt}')
