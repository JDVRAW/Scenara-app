import sys; sys.path.insert(0,'.')
from render_lib import *
W,H=1800,1200; OUT='out'
y=np.arange(H)[:,None]; x=np.arange(W)

def forest():
    img=grad(H,W,[(0,'#9fb8a2'),(0.5,'#5f7d66'),(1,'#1a2a20')])
    r=np.random.default_rng(3)
    # god rays from top-right
    yy,xx=np.mgrid[0:H,0:W]
    ang=np.arctan2(yy+200,(W*0.8)-xx)
    rays=(np.sin(ang*60+1.3)*0.5+0.5)**6*np.clip(1-yy/H,0,1)
    blend(img,blur(rays,8)*0.35,'#e8f0c8','screen')
    for layer in range(5):
        depth=layer/4  # 0 far ->1 near
        col=np.array([0.42,0.55,0.45])*(1-depth)+np.array([0.03,0.05,0.04])*depth
        fogt=1-depth
        n=int(9-layer)
        def trees(d,s):
            for i in range(n):
                tx=r.random()*W; w=6+depth*38+r.random()*8
                d.rectangle([(tx-w/2)*s,0,(tx+w/2)*s,H*s],fill=255)
                # a few branches
                for k in range(3):
                    by=r.random()*H*0.6; L=w*3+r.random()*60
                    dirn=1 if r.random()>0.5 else -1
                    d.line([(tx)*s,by*s,(tx+dirn*L)*s,(by-L*0.5)*s],fill=255,width=int(max(2,w/4)*s))
        m=shapes_mask(H,W,trees,0.6+fogt*1.5)
        # ground for layer
        g=ridge(W,H*(0.78+depth*0.12),10+depth*20,400,40+layer)
        gm=np.clip((y-g[None,:])/2+0.5,0,1)
        m=np.maximum(m*(y<g[None,:]+20),gm)
        blend(img,m,col)
        # fog between layers
        fog=np.clip(noise2(H,W,600,4,50+layer)*1.2-0.2,0,1)*np.clip(y/H*1.4-0.2,0,1)
        blend(img,fog*0.35*(1-depth*0.5),'#b8c8b0','screen')
    finish(img,f'{OUT}/jungle.jpg',lift='#080b09',grain=0.04)

def fogmount():
    img=grad(H,W,[(0,'#c9ced2'),(0.5,'#a7b0b6'),(1,'#5a646b')])
    blend(img,radial(H,W,W*0.3,H*0.25,W*0.6,2)*0.5,'#f2efe8','screen')
    cols=['#8d989f','#6f7b83','#525d65','#363f45','#1c2226']
    for i,c in enumerate(cols):
        line=ridge(W,H*(0.40+i*0.11),70-i*6,600-i*60,70+i)
        fill_below(img,H,W,line,c,soft=4-i*0.6)
        mist=np.clip(1-np.abs(y-line[None,:]-40)/90,0,1)*np.clip(noise2(H,W,500,3,80+i)*1.4-0.3,0,1)
        blend(img,mist*0.45,'#d8dde0','screen')
    # small figure on nearest ridge
    line=ridge(W,H*(0.40+4*0.11),70-24,600-240,74)
    fx=W*0.58; fy=line[int(fx)]+4; h=70
    m=shapes_mask(H,W,lambda d,s:(d.ellipse([(fx-6)*s,(fy-h)*s,(fx+6)*s,(fy-h+13)*s],fill=255),d.polygon([((fx-11)*s,(fy-h+15)*s),((fx+11)*s,(fy-h+15)*s),((fx+8)*s,fy*s),((fx-8)*s,fy*s)],fill=255)),0.6)
    blend(img,m,'#15191c')
    finish(img,f'{OUT}/fog.jpg',lift='#101315',vignette=0.45,bloom=0.1)

def raincity():
    img=grad(H,W,[(0,'#0a1016'),(0.5,'#18242d'),(1,'#0b1014')])
    r=np.random.default_rng(9)
    # buildings
    for layer,(col,base,hmin,hmax) in enumerate([('#141d24',0.75,0.25,0.55),('#0c1217',0.92,0.35,0.75)]):
        bx=0
        while bx<W:
            bw=80+r.random()*160; bh=H*(hmin+r.random()*(hmax-hmin)); top=H*base-bh
            m=shapes_mask(H,W,lambda d,s:d.rectangle([bx*s,top*s,(bx+bw)*s,H*s],fill=255),0.5)
            blend(img,m,col)
            # windows
            for wy in np.arange(top+20,H*base,26):
                for wx in np.arange(bx+12,bx+bw-12,22):
                    if r.random()<0.22:
                        c=['#ffd9a0','#9fd0ff','#ffe8c0'][r.integers(3)]
                        wm=shapes_mask(H,W,lambda d,s:d.rectangle([wx*s,wy*s,(wx+9)*s,(wy+13)*s],fill=255),0.4) if False else None
                        img[int(wy):int(wy+13),int(wx):int(wx+9)]=img[int(wy):int(wy+13),int(wx):int(wx+9)]*0.3+hexrgb(c)*(0.5-layer*0.15)
            bx+=bw+4
    # bokeh
    for i in range(30):
        cx=r.random()*W; cy=H*(0.55+r.random()*0.38); rad=20+r.random()*70
        c=['#ffb35a','#7fc4ff','#ff6a5a','#ffd9a0'][r.integers(4)]
        d=np.clip(1-np.hypot(*(np.mgrid[0:H,0:W][::-1]-np.array([cx,cy])[:,None,None]))/rad,0,1) if False else None
        yy0,yy1=int(max(0,cy-rad)),int(min(H,cy+rad)); xx0,xx1=int(max(0,cx-rad)),int(min(W,cx+rad))
        yy,xx=np.mgrid[yy0:yy1,xx0:xx1]; dd=np.hypot(xx-cx,yy-cy)/rad
        disk=np.clip((1-dd)*8,0,1)*(0.25+0.15*np.clip((dd-0.8)*5,0,1))
        img[yy0:yy1,xx0:xx1]=1-(1-img[yy0:yy1,xx0:xx1])*(1-hexrgb(c)*disk[...,None]*0.8)
    # wet street reflections bottom
    street=(y>H*0.92).astype(float)
    refl=np.flipud(img.copy()); 
    img[:]=img*(1-street[...,None]*0.6)+np.roll(refl,-int(H*0.16),0)*street[...,None]*0.35
    # rain
    rain=np.zeros((H,W)); rr=np.random.default_rng(2)
    for i in range(2500):
        rx=rr.random()*W; ry=rr.random()*H; L=20+rr.random()*40
        x0=int(rx); 
        for k in range(int(L)):
            yy_=int(ry+k); xx_=int(rx+k*0.18)
            if 0<=yy_<H and 0<=xx_<W: rain[yy_,xx_]=0.35
    blend(img,blur(rain,0.6),'#cfe2f0','screen')
    finish(img,f'{OUT}/steel.jpg',lift='#070a0c',bloom=0.35)

def neon():
    img=grad(H,W,[(0,'#14101c'),(0.6,'#2a1f38'),(1,'#0c0a10')])
    r=np.random.default_rng(12)
    # big bokeh gold and violet
    for i in range(34):
        cx=r.random()*W; cy=H*(0.1+r.random()*0.75); rad=30+r.random()*110
        c=['#d6b37a','#a77bd6','#ff9a6a','#f0d9a8'][r.integers(4)]
        yy0,yy1=int(max(0,cy-rad)),int(min(H,cy+rad)); xx0,xx1=int(max(0,cx-rad)),int(min(W,cx+rad))
        yy,xx=np.mgrid[yy0:yy1,xx0:xx1]; dd=np.hypot(xx-cx,yy-cy)/rad
        disk=np.clip((1-dd)*6,0,1)*(0.18+0.12*np.clip((dd-0.85)*6,0,1))
        img[yy0:yy1,xx0:xx1]=1-(1-img[yy0:yy1,xx0:xx1])*(1-hexrgb(c)*disk[...,None])
    # silhouette of person in coat with hat? person shoulders centered, backlit
    fx=W*0.5; top=H*0.26
    m=bust(H,W,fx,top,1.5)
    blend(img,m,'#09070c')
    edge=np.clip(m-blur(m,6),0,1)*2
    blend(img,blur(edge,2)*0.9,'#e0b878','screen')
    finish(img,f'{OUT}/velvet.jpg',lift='#09070c',bloom=0.35)

def portrait_warm():
    img=grad(H,W,[(0,'#2a1f16'),(1,'#120d09')])
    # window light from left
    blend(img,radial(H,W,W*0.15,H*0.35,W*0.6,1.6)*0.9,'#f0c890','screen')
    # window frame bars shadow
    for bx in (W*0.08,W*0.24):
        blend(img,shapes_mask(H,W,lambda d,s:d.rectangle([bx*s,0,(bx+24)*s,H*s],fill=255),6)*0.5,'#1a120c')
    fx=W*0.58; top=H*0.18
    m=bust(H,W,fx,top,1.9,1.5)
    blend(img,m,'#140e0a')
    # warm rim on left edge
    rim=np.clip(m-np.roll(m,14,axis=1),0,1)
    blend(img,blur(rim,3)*0.9,'#f3c48a','screen')
    blend(img,blur(rim,18)*0.4,'#e0a060','screen')
    finish(img,f'{OUT}/skin.jpg',lift='#0d0a08')

for f in sys.argv[1:]: globals()[f]()
