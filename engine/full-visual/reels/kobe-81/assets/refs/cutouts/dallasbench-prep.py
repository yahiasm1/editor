import sys
from PIL import Image, ImageFilter, ImageEnhance
dl, pub = sys.argv[1], sys.argv[2]
# Kobe print: Lee photo, head to chest, above the ball (960-px coords x 60-900, y 110-1040)
im = Image.open(f"{dl}/lee.jpg").convert("RGB")
k = im.width / 960
c = im.crop((int(60*k), int(110*k), int(900*k), int(1040*k)))
c = c.resize((560, int(560 * c.height / c.width)), Image.LANCZOS)
c.save(f"{pub}/dallasbench-kobe-print.jpg", quality=90)
print("print", c.size)
# STAPLES courtside: Niv Singer, the empty courtside row (1280-px coords x 805-1055, y 455-635)
src = sys.argv[3]
im = Image.open(src).convert("RGB")
k = im.width / 1280
# the Bobcats player's head pokes up in front of chair 2 (x 796-866, y 622-668): fill it from the identical chair one
# seat to the right (the row repeats every 82 px), feathered. The print covers this spot once it lands.
from PIL import ImageDraw
patch = im.crop((int((796+82)*k), int(618*k), int((866+82)*k), int(672*k)))
m = Image.new("L", patch.size, 0); ImageDraw.Draw(m).rounded_rectangle((4, 4, patch.width-4, patch.height-1), 10, fill=255)
m = m.filter(ImageFilter.GaussianBlur(3))
im.paste(patch, (int(796*k), int(618*k)), m)
c = im.crop((int(690*k), int(400*k), int(1062*k), int(668*k)))
c = c.resize((1350, int(1350 * c.height / c.width)), Image.LANCZOS)
c.save(f"{pub}/dallasbench-courtside-row.jpg", quality=90)
print("row", c.size, "from", im.size)
