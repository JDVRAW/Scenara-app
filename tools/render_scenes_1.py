import sys; sys.path.insert(0,'.')
from render_lib import *
W,H=1800,1200
OUT='out'; import os; os.makedirs(OUT,exist_ok=True)

def lighthouse():
    hz=0.58*H
    img=grad(H,W,[(0,'#0b1724'),(0.32,'#1d3a4a'),(0.50,'#8a6a4a'),(0.57,'#e2b77c'),(0.58,'#f0cf98'),(1,'#f0cf98')])
    # clouds
    n=noise2(H,W,520,5,3); cl=np.clip((n-0.5)*3,0,1)*np.clip(1-np.abs(np.arange(H)[:,None]/H-0.3)/0.25,0,1)
    blend(img,cl*0.55,'#2a3b48')
    blend(img,cl*np.clip(np.arange(H)[:,None]/hz,0,1)**4*0.6,'#c98a5a')
    # sun glow near horizon left of center
    blend(img,radial(H,W,W*0.36,hz,W*0.5,2.2)*0.7,'#ffcf8a','screen')
    blend(img,radial(H,W,W*0.36,hz-8,60,1.2),'#fff3d6','screen')
    # sea
    y=np.arange(H)[:,None]; sea=(y>hz).astype(float)
    t=np.clip((y-hz)/(H-hz),0,1)
    seacol=grad(H,W,[(0,'#000000'),(0.58,'#6d5a48'),(0.75,'#24313a'),(1,'#0c1418')])
    img[:]=img*(1-sea[...,None])+seacol*sea[...,None]
    # sun reflection streaks
    streak=streaks(H,W,5)
    col=radial(H,W,W*0.36,hz,W*0.16,1.0,aspect=0.35)*sea*np.clip(1-t*1.4,0,1)
    blend(img,streak*col,'#ffd9a0','screen')
    # cliff right
    line=ridge(W,0,1,300,11)
    x=np.arange(W)
    u=np.clip((x-W*0.52)/(W*0.3),0,1)
    cliff=hz+40-(u**0.5)*340+line*22
    cliff=np.where(x<W*0.52,H+10,cliff)
    fill_below(img,H,W,cliff,'#07090b',soft=2)
    # lighthouse on cliff at x=0.78
    cx=W*0.79; base=cliff[int(cx)]+6; top=base-300
    tower=poly_mask(H,W,[(cx-34,base),(cx+34,base),(cx+20,top),(cx-20,top)])
    blend(img,tower,'#07090b')
    # stripes faint
    lamp=shapes_mask(H,W,lambda d,s:(d.rectangle([ (cx-24)*s,(top-46)*s,(cx+24)*s,top*s],fill=255)))
    blend(img,lamp,'#07090b')
    roof=poly_mask(H,W,[(cx-30,top-46),(cx+30,top-46),(cx,top-80)])
    blend(img,roof,'#07090b')
    lc=(cx,top-24)
    blend(img,radial(H,W,lc[0],lc[1],14,1.0),'#fff1c9','add')
    blend(img,radial(H,W,lc[0],lc[1],180,2.5)*0.8,'#ffd27a','screen')
    # beam to the left
    yy,xx=np.mgrid[0:H,0:W]
    ang=np.arctan2(yy-lc[1],lc[0]-xx)
    dist=np.hypot(xx-lc[0],yy-lc[1])
    beam=np.clip(1-np.abs(ang-0.06)/0.05,0,1)*(xx<lc[0])*np.clip(1-dist/(W*0.8),0,1)
    blend(img,blur(beam,6)*0.55,'#ffe2a8','screen')
    finish(img,f'{OUT}/dusk.jpg',lift='#0a0d10')

def lowtide():
    hz=0.55*H
    img=grad(H,W,[(0,'#120709'),(0.3,'#3d1410'),(0.48,'#9a3a22'),(0.55,'#e0683a'),(1,'#e0683a')])
    blend(img,radial(H,W,W*0.5,hz-30,W*0.45,2.0)*0.8,'#ff8a4a','screen')
    blend(img,radial(H,W,W*0.5,hz-40,70,0.6),'#ffd2a6','screen')
    # haze bands
    n=noise2(H,W,700,4,9); y=np.arange(H)[:,None]
    blend(img,np.clip((n-0.45)*2,0,1)*np.clip(1-np.abs(y/H-0.42)/0.12,0,1)*0.5,'#5a1a14')
    # sea and wet sand
    sea=(y>hz).astype(float); t=np.clip((y-hz)/(H-hz),0,1)
    seacol=grad(H,W,[(0,'#000000'),(0.55,'#7a2a1a'),(0.7,'#3a1410'),(0.82,'#1b0c0b'),(1,'#0b0606')])
    img[:]=img*(1-sea[...,None])+seacol*sea[...,None]
    streak=streaks(H,W,4)
    col=radial(H,W,W*0.5,hz,W*0.22,1.0,aspect=0.25)*sea
    blend(img,streak*col,'#ffb07a','screen')
    # shoreline foam
    shore=hz+H*0.22+ridge(W,0,1,200,3)*10
    foam=np.clip(1-np.abs(y-shore[None,:])/3,0,1)*0.5
    blend(img,blur(foam,1.5),'#ffb48a','screen')
    # wet sand mirror of sun
    sand=(y>shore[None,:]).astype(float)
    blend(img,sand*radial(H,W,W*0.5,H*0.95,W*0.3,1.5,aspect=0.5)*0.35,'#d4643a','screen')
    blend(img,sand*0.55,'#0d0707')
    # figure silhouette standing at x=0.5
    fx=W*0.5; fy=shore[int(fx)]+H*0.14; h=H*0.30
    def fig(d,s):
        hx=fx; hy=fy-h
        d.ellipse([(hx-h*0.055)*s,(hy)*s,(hx+h*0.055)*s,(hy+h*0.13)*s],fill=255)
        d.polygon([((hx-h*0.11)*s,(hy+h*0.16)*s),((hx+h*0.11)*s,(hy+h*0.16)*s),((hx+h*0.09)*s,(hy+h*0.55)*s),((hx-h*0.09)*s,(hy+h*0.55)*s)],fill=255)
        d.rectangle([(hx-h*0.07)*s,(hy+h*0.12)*s,(hx+h*0.07)*s,(hy+h*0.2)*s],fill=255)
        d.polygon([((hx-h*0.085)*s,(hy+h*0.54)*s),((hx-h*0.01)*s,(hy+h*0.54)*s),((hx-h*0.03)*s,fy*s),((hx-h*0.075)*s,fy*s)],fill=255)
        d.polygon([((hx+h*0.01)*s,(hy+h*0.54)*s),((hx+h*0.085)*s,(hy+h*0.54)*s),((hx+h*0.07)*s,fy*s),((hx+h*0.025)*s,fy*s)],fill=255)
        d.polygon([((hx-h*0.11)*s,(hy+h*0.17)*s),((hx-h*0.14)*s,(hy+h*0.5)*s),((hx-h*0.11)*s,(hy+h*0.5)*s),((hx-h*0.08)*s,(hy+h*0.2)*s)],fill=255)
        d.polygon([((hx+h*0.11)*s,(hy+h*0.17)*s),((hx+h*0.14)*s,(hy+h*0.5)*s),((hx+h*0.11)*s,(hy+h*0.5)*s),((hx+h*0.08)*s,(hy+h*0.2)*s)],fill=255)
    m=shapes_mask(H,W,fig,1.0); blend(img,m,'#0a0505')
    # reflection
    rm=np.flipud(m); sh=int(2*fy-H); 
    refl=np.zeros_like(m); 
    off=int(2*fy)-H
    if off>0: refl[off:]=rm[:H-off]
    else: refl[:H+off]=rm[-off:]
    blend(img,blur(refl,3)*0.35,'#000000')
    finish(img,f'{OUT}/crimson.jpg',lift='#0d0708')

def desert_camera():
    hz=0.62*H
    img=grad(H,W,[(0,'#2a170e'),(0.35,'#7a4224'),(0.55,'#d18a4b'),(0.62,'#f2c27d'),(1,'#f2c27d')])
    blend(img,radial(H,W,W*0.66,hz-20,W*0.5,2.0)*0.7,'#ffc98a','screen')
    blend(img,radial(H,W,W*0.66,hz-30,46,0.5),'#fff0d0','screen')
    y=np.arange(H)[:,None]
    for i,(base,amp,col,seed) in enumerate([(hz-30,30,'#a8603a',21),(hz,22,'#6a3620',22),(hz+70,40,'#3a1d12',23),(hz+190,50,'#1a0d08',24)]):
        line=ridge(W,base,amp,500-i*60,seed)
        fill_below(img,H,W,line,col,soft=3-i*0.5)
        if i<2: blend(img,np.clip(1-np.abs(y-line[None,:])/40,0,1)*0.25,'#f2b070','screen')
    # dust haze
    blend(img,np.clip(noise2(H,W,400,4,30)-0.45,0,1)*np.clip(1-np.abs(y/H-0.6)/0.2,0,1)*0.6,'#e0a066','screen')
    # camera on tripod silhouette, left third
    gx=W*0.34; gy=ridge(W,hz+190,50,440,24)[int(gx)]+30
    def cam(d,s):
        th=H*0.30; top=gy-th
        for dx in (-0.13,0.0,0.12):
            d.line([(gx*s,top*s),((gx+dx*th*1.9)*s,gy*s)],fill=255,width=int(9*s))
        d.rectangle([(gx-60)*s,(top-14)*s,(gx+60)*s,(top+6)*s],fill=255)
        d.rounded_rectangle([(gx-95)*s,(top-120)*s,(gx+70)*s,(top-14)*s],radius=10*s,fill=255)
        d.rectangle([(gx+70)*s,(top-100)*s,(gx+170)*s,(top-36)*s],fill=255)
        d.rectangle([(gx+170)*s,(top-110)*s,(gx+190)*s,(top-26)*s],fill=255)
        d.rectangle([(gx-70)*s,(top-150)*s,(gx+20)*s,(top-120)*s],fill=255)
        d.line([(gx-95)*s,(top-60)*s,(gx-170)*s,(top-20)*s],fill=255,width=int(8*s))
    m=shapes_mask(H,W,cam,0.9); blend(img,m,'#0d0705')
    # rim light on camera edge facing sun
    rim=np.clip(m-np.roll(m,5,axis=1),0,1)*(np.arange(H)[:,None]<gy-H*0.30+10)
    blend(img,blur(rim,1.2)*0.7,'#ffcf8a','screen')
    finish(img,f'{OUT}/ember.jpg',lift='#0e0907')

for f in sys.argv[1:]: globals()[f]()
