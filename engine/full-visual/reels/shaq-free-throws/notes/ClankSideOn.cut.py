import sys
from PIL import Image, ImageDraw
import numpy as np, cv2
from scipy import ndimage
src, outdir = sys.argv[1], sys.argv[2]
im = np.array(Image.open(src)).astype(np.int32)
R,G,B,A = [im[...,i] for i in range(4)]
H,W = A.shape
skin = (R>B+10)&(R>G)&((R-G)>12)&(A>128)
grey = (abs(R-G)<30)&(abs(G-B)<40)&(R>110)&(A>128)
poly = [(318,545),(335,590),(340,720),(360,820),(410,920),(480,1000),(445,1025),(452,1075),(495,1080),(560,1120),(565,1235),(625,1240),(655,1140),(625,1075),(618,1020),(592,968),(570,918),(532,868),(503,790),(500,650),(503,650),(522,605),(546,560),(548,545)]
pm = Image.new('L',(W,H),0); ImageDraw.Draw(pm).polygon(poly, fill=255)
P = np.array(pm)>0
yy,xx = np.mgrid[0:H,0:W]
m = (skin|(grey&~((xx>492)&(yy>560)&(yy<820)))) & P
m = ndimage.binary_closing(m, iterations=3) & P
m = ndimage.binary_opening(m, iterations=1)
lab,n = ndimage.label(m)
sizes = ndimage.sum(m, lab, range(1,n+1))
keep = [i+1 for i,s in enumerate(sizes) if s > 400]
arm = np.isin(lab, keep)
arm = ndimage.binary_fill_holes(arm)
arm = ndimage.binary_dilation(arm, iterations=2) & (A>0) & P
yy,xx = np.mgrid[0:H,0:W]
upper = arm & (yy<905)
fore = arm & (yy>=860)
def save(mask, name):
    out = im.copy().astype(np.uint8)
    a = ndimage.gaussian_filter(mask.astype(np.float32), 1.0)
    out[...,3] = (np.minimum(a, A/255.0)*255).astype(np.uint8)
    Image.fromarray(out).save(f"{outdir}/{name}")
save(upper, "clanksideon-shaq-upperarm.png")
save(fore, "clanksideon-shaq-forearm.png")
# the body with the near arm taken away: inpaint the jersey behind it, and drop what lay outside his silhouette
hole = ndimage.binary_dilation(arm, iterations=3)
rgb = im[...,:3].astype(np.uint8)[...,::-1].copy()
filled = np.zeros((H,W,3),np.float32)
for y in range(H):
    xs = np.where(hole[y])[0]
    if not xs.size: continue
    x0 = xs.min()
    filled[y,:,:] = np.median(im[y, max(0,x0-80):max(1,x0-30), :3],axis=0)
filled = cv2.GaussianBlur(filled,(1,0) if False else (0,0),sigmaX=0.1,sigmaY=5)
noise = np.random.default_rng(3).normal(0, 16, (H,W,1))
out = im.copy()
out[hole,:3] = np.clip(filled[hole] + noise[hole], 0, 255)
nonarm = (A>128)&~hole
for y in range(1000, 1300):
    xs = np.where(nonarm[y])[0]
    redge = xs.max() if xs.size else -1
    row = hole[y]
    out[y, (np.arange(W)>max(redge,600))&row, 3] = 0
Image.fromarray(out.astype(np.uint8)).save(f"{outdir}/clanksideon-shaq-body.png")
print("arm px", arm.sum(), "parts", len(keep))
