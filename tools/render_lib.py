import numpy as np
from PIL import Image, ImageFilter
rng = np.random.default_rng(7)

def hexrgb(h):
    h=h.lstrip('#'); return np.array([int(h[i:i+2],16)/255 for i in (0,2,4)])

def grad(H, W, stops):
    """vertical gradient: stops list of (pos, hex)"""
    y=np.linspace(0,1,H)[:,None]
    out=np.zeros((H,W,3))
    ps=[p for p,_ in stops]; cs=[hexrgb(c) for _,c in stops]
    for ch in range(3):
        out[:,:,ch]=np.interp(y[:,0],ps,[c[ch] for c in cs])[:,None]
    return out

def noise2(H,W,scale,octaves=4,seed=0):
    r=np.random.default_rng(seed); acc=np.zeros((H,W)); amp=1; tot=0
    for o in range(octaves):
        gh=max(2,int(H/scale*2**o)); gw=max(2,int(W/scale*2**o))
        g=r.random((gh,gw)).astype(np.float32)
        im=Image.fromarray((g*255).astype(np.uint8)).resize((W,H),Image.BICUBIC)
        acc+=np.asarray(im)/255*amp; tot+=amp; amp*=0.5
    return acc/tot

def ridge(W, base, amp, scale, seed, octaves=5):
    r=np.random.default_rng(seed); x=np.arange(W); y=np.zeros(W); a=amp; s=scale
    for o in range(octaves):
        n=max(2,int(W/s)+2); pts=r.random(n)*2-1
        y+=np.interp(x/s, np.arange(n), pts)*a; a*=0.5; s/=2.1
    return base+y

def fill_below(img, H, W, line, color, alpha=1.0, soft=1.5):
    yy=np.arange(H)[:,None]
    m=np.clip((yy-line[None,:])/soft+0.5,0,1)*alpha
    img[:]=img*(1-m[...,None])+hexrgb(color)*m[...,None] if isinstance(color,str) else img*(1-m[...,None])+color*m[...,None]
    return m

def blend(img, mask, color, mode='normal'):
    c=hexrgb(color) if isinstance(color,str) else color
    m=mask[...,None]
    if mode=='add': img[:]=img+c*m
    elif mode=='screen': img[:]=1-(1-img)*(1-c*m)
    else: img[:]=img*(1-m)+c*m

def radial(H,W,cx,cy,r,power=2.0,aspect=1.0):
    yy,xx=np.mgrid[0:H,0:W]
    d=np.sqrt(((xx-cx)/aspect)**2+(yy-cy)**2)/r
    return np.clip(1-d,0,1)**power

def blur(mask,rad):
    im=Image.fromarray(np.clip(mask*255,0,255).astype(np.uint8))
    return np.asarray(im.filter(ImageFilter.GaussianBlur(rad)))/255

def poly_mask(H,W,pts,rad=0.8):
    from PIL import ImageDraw
    im=Image.new('L',(W*2,H*2),0); d=ImageDraw.Draw(im)
    d.polygon([(x*2,y*2) for x,y in pts],fill=255)
    im=im.resize((W,H),Image.LANCZOS)
    m=np.asarray(im)/255
    return blur(m,rad) if rad else m

def shapes_mask(H,W,draw_fn,rad=0.8):
    from PIL import ImageDraw
    im=Image.new('L',(W*2,H*2),0); d=ImageDraw.Draw(im); draw_fn(d,2)
    im=im.resize((W,H),Image.LANCZOS); m=np.asarray(im)/255
    return blur(m,rad) if rad else m

def finish(img, path, grain=0.045, vignette=0.55, bloom=0.25, lift='#0b0b0d', tone=None):
    H,W,_=img.shape
    img=np.clip(img,0,None)
    # bloom
    bright=np.clip(img.max(-1)-0.65,0,1)
    if bloom:
        b=np.stack([blur(np.clip(img[...,c]*(bright>0),0,1)*1.0,max(W,H)/60) for c in range(3)],-1)
        img=1-(1-img)*(1-b*bloom)
    # filmic tone curve
    img=img/(1+img*0.15)
    img=np.clip(img,0,1)
    # S-curve
    img=img*img*(3-2*img)*0.6+img*0.4
    # vignette
    yy,xx=np.mgrid[0:H,0:W]
    d=np.sqrt(((xx-W/2)/(W/2))**2+((yy-H/2)/(H/2))**2)/1.41
    v=1-vignette*np.clip(d,0,1)**2.2
    img=img*v[...,None]
    # lift blacks
    l=hexrgb(lift); img=l+img*(1-l)
    if tone is not None:
        t=hexrgb(tone); img=img*(0.88+0.12*t)
    # grain
    g=np.random.default_rng(1).normal(0,grain,(H,W))[...,None]
    img=np.clip(img+g*(0.6+0.4*(1-img)),0,1)
    Image.fromarray((img*255).astype(np.uint8)).save(path,quality=86,optimize=True,progressive=True)

def streaks(H,W,seed=0,rows=None,cols=40):
    r=np.random.default_rng(seed); rows=rows or H//3
    g=r.random((rows,cols)).astype(np.float32)
    im=Image.fromarray((g*255).astype(np.uint8)).resize((W,H),Image.BILINEAR)
    s=np.asarray(im)/255
    return np.clip((s-0.55)*3.5,0,1)

def bust(H,W,cx,top,scale=1.0,blur_r=1.2):
    """head + neck + sloping shoulders silhouette mask. top = top of head."""
    s=scale; yy,xx=np.mgrid[0:H,0:W].astype(float)
    hw,hh=76*s,96*s; hcy=top+hh
    head=(((xx-cx)/hw)**2+((yy-hcy)/hh)**2)<=1
    nw=34*s; neck_top=hcy+hh*0.6; neck_bot=top+218*s
    neck=(np.abs(xx-cx)<nw)&(yy>neck_top)
    dx=np.abs(xx-cx)
    u=np.clip(dx-nw,0,None)
    curve=neck_bot+40*s*(1-np.exp(-u/(30*s)))+0.0004/s*u**2+0.006/s*np.clip(u-190*s,0,None)**2
    body=(yy>=curve)
    m=(head|neck|body).astype(float)
    return blur(m,blur_r)
