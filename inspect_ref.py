from PIL import Image

im = Image.open('reference/approach-ui-reference.jpg')
w, h = im.size
print('Size:', w, h)

# Let's crop around where each label is located
crops = {
    '01_solar': (400, 80, 650, 260),
    '02_power': (900, 100, 1150, 260),
    '03_data': (1100, 440, 1350, 600),
    '04_recycling': (250, 420, 500, 580)
}

for name, box in crops.items():
    cropped = im.crop(box)
    cropped.save(f'reference/{name}.png')
    print('Saved', name, box)
