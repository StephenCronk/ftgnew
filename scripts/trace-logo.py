# Trace src/assets/img-src/ftg-roundlogo.png into the animated logo partial (src/_includes/partials/logo-anim.svg).
# Needs numpy, opencv-python and Pillow (macOS system python has them; run without -I so cv2 loads).
# Usage: /usr/bin/python3 scripts/trace-logo.py src/assets/img-src/ftg-roundlogo.png out.svg [epsilon=1.2]
# then wrap out.svg as the partial (class "intro__logo logo-anim").
import cv2, numpy as np, sys, math
from PIL import Image
src, out = sys.argv[1], sys.argv[2]
im = np.array(Image.open(src).convert('RGBA')).astype(float)
r,g,b,a=[im[...,i] for i in range(4)]
cyanmask=(a>200)&(r<=120)
print('cyan mean', [int(im[...,i][cyanmask].mean()) for i in range(3)])
S=4; EPS=float(sys.argv[3]) if len(sys.argv)>3 else 1.2
def trace(m):
    m=np.clip(m,0,255).astype(np.uint8)
    m=cv2.resize(m,None,fx=S,fy=S,interpolation=cv2.INTER_CUBIC)
    m=cv2.GaussianBlur(m,(5,5),0); _,m=cv2.threshold(m,127,255,cv2.THRESH_BINARY)
    cs,h=cv2.findContours(m,cv2.RETR_CCOMP,cv2.CHAIN_APPROX_NONE)
    shapes={}
    for i,c in enumerate(cs):
        if cv2.contourArea(c)/S/S<1: continue
        par=h[0][i][3]; key=i if par<0 else par
        pts=cv2.approxPolyDP(c,EPS,True).reshape(-1,2)/S
        d='M'+' '.join(f'{x:.1f} {y:.1f}'.replace('.0 ',' ') for x,y in pts)
        d=d.replace('.0 ',' ')+'Z'
        sh=shapes.setdefault(key,{'d':[],'box':None,'area':0})
        sh['d'].append(d)
        if par<0:
            x,y,w,hh=cv2.boundingRect(c); sh['box']=(x/S,y/S,w/S,hh/S); sh['area']=cv2.contourArea(c)/S/S
    return [s for s in shapes.values() if s['box']]
white=trace(a*(r>120)); cyan=trace(a*(r<=120))
def ang(s):
    x,y,w,h=s['box']; cx,cy=x+w/2,y+h/2
    t=math.degrees(math.atan2(250-cy,cx-250))
    return t+360 if t<-90 else t
tooth=[s for s in white if s['area']>1500 and 150<s['box'][0]<320 and s['box'][1]>200]
whead=[s for s in white if s not in tooth and abs(s['box'][2]-s['box'][3])<3 and 25<s['box'][2]<35 and 140<s['box'][0]<200][0]
letters_top=sorted([s for s in white if s not in tooth and s is not whead],key=ang,reverse=True)
big=sorted(cyan,key=lambda s:-s['area'])
body,heart=big[0],None
head=[s for s in cyan if s['box'][2]==s['box'][3]==30 or (abs(s['box'][2]-s['box'][3])<3 and s['box'][1]<200)][0]
heart=[s for s in cyan if s is not body and s['area']>1000][0]
arcs=[s for s in cyan if s['box'][3]>70 and s['box'][2]<40]
letters_bot=sorted([s for s in cyan if s not in (body,head,heart) and s not in arcs],key=lambda s:s['box'][0])
print('tooth',len(tooth),'top',len(letters_top),'arcs',len(arcs),'bottom',len(letters_bot))
def p(s,cls,extra=''):
    return f'<path class="{cls}"{extra} d="{" ".join(s["d"])}"/>'
o=[]
o.append('<g class="la-white">'+''.join(p(s,'la-draw',' pathLength="1"') for s in sorted(tooth,key=lambda s:-s['area']))+'</g>')
o.append(p(whead,'la-head la-head--white'))
o.append('<g class="la-arcs">'+''.join(p(s,'la-draw',' pathLength="1"') for s in sorted(arcs,key=lambda s:s['box'][0]))+'</g>')
o.append(p(heart,'la-heart'))
o.append(p(body,'la-draw la-body',' pathLength="1"'))
o.append(p(head,'la-head la-head--cyan'))
o.append('<g class="la-top">'+''.join(p(s,'la-letter',f' style="--i:{i}"') for i,s in enumerate(letters_top))+'</g>')
o.append('<g class="la-bottom">'+''.join(p(s,'la-letter',f' style="--i:{i}"') for i,s in enumerate(letters_bot))+'</g>')
svg='<svg class="logo-anim" viewBox="0 0 500 500" width="360" height="360" fill-rule="evenodd" aria-hidden="true" focusable="false" data-logo-anim>\n'+'\n'.join(o)+'\n</svg>\n'
open(out,'w').write(svg)
print('bytes',len(svg))
