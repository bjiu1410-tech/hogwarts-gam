"""art/original/*.png (고해상도 원본) → 게임용 초상화 (176x176)로 줄여서 저장.
사용법: python3 art/export_portraits.py
"""
import glob, os
from PIL import Image

SIZE = 176
SRC = os.path.join(os.path.dirname(__file__), 'original')
DST = os.path.join(os.path.dirname(__file__), '..', 'app/src/main/assets/www/img/portrait')

os.makedirs(DST, exist_ok=True)
for path in sorted(glob.glob(os.path.join(SRC, '*.png'))):
    im = Image.open(path).convert('RGBA')
    # 배경 제거 잔여물(반투명 얼룩) 정리
    r, g, b, a = im.split()
    a = a.point(lambda v: 0 if v < 70 else (255 if v > 200 else v))
    im = Image.merge('RGBA', (r, g, b, a))
    bbox = a.getbbox()
    if bbox:
        # 정사각형 유지한 채 위쪽 여백만 살짝 다듬기
        top = max(0, bbox[1] - 20)
        side = im.width - top
        left = max(0, (im.width - side) // 2)
        im = im.crop((left, top, left + side, top + side))
    im = im.resize((SIZE, SIZE), Image.LANCZOS)
    out = os.path.join(DST, os.path.basename(path))
    im.save(out, optimize=True)
    print(out, im.size, os.path.getsize(out), 'bytes')
