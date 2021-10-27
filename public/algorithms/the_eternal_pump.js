let pc="#f2f2f2",bgCols=["#f2c5d2","#e5bb57","#9c96cd","#76b995","#70a7c5","#f8e6d1","#dfbcab","#f1e7e1",pc,pc,pc,pc,pc,pc,pc,pc,pc,pc,pc,pc,pc,pc],chill=["#47485f","#be3441","#f0bc67","#5a89c5","#e28d64","#d6c5d1"],rnb=["#fd3741","#fe4f11","#ff6800","#ffa61a","#ffc219","#ffd114","#fcd82e","#f4d730","#ced562","#8ac38f","#79b7a0","#72b5b1","#5b9bae","#6ba1b7","#49619d","#604791","#721e7f","#9b2b77","#ab2562","#ca2847"],shim=["#f0f0c0","#f0d8c0","#d8d8c0","#d8c090","#d8c0a8","#f0d8a8","#fff0c0","#f0f0d8","#fff0d8","#d8c078","#f0d878","#c0a878","#f0d890","#ffffd8","#c0c0a8","#c0c090","#fff0a8","#f0f0a8","#d8d8a8","#f0c090","#c09090","#786048","#c0a890","#606060","#909090","#904830","#d8d890","#f0d8d8","#787878","#fff0f0","#a87860","#c0a8a8","#c09078","#fff090","#a8a8a8","#d8a848","#f0f090","#f0c048","#d8a878","#f0c060","#ffd8c0","#f0c078","#c0a860","#907860","#a8a890","#d8a860","#907890","#a8a878","#a87800","#f0d848"],riso=["#000","#914e72","#0078bf","#00a95c","#3255a4","#f15060","#3d5588","#765ba7","#00838a","#bb8b41","#407060","#ff665e","#925f52","#ffe800","#d2515e","#ff6c2f","#ff48b0","#88898a","#ac936e","#e45d50","#ff7477","#62a8e5","#4982cf","#0074a2","#235ba8","#484d7a","#435060","#d5e4c0","#a5aaa8","#70747c","#5f8289","#375e77","#5e695e","#00aa93","#19975d","#397e58","#516e5a","#4a635d","#68724d","#62c2b1","#67b346","#009da5","#169b62","#237e74","#2f6165","#9d7ad2","#aa60bf","#845991","#775d7a","#6c5d80","#f65058","#d2515e","#d1517a","#9e4c6e","#d1517a","#a75154","#e3ed55","#ffb511","#ffae3b","#f6a04d","#ee7f4b","#ff6f4c","#b49f29","#ba8032","#bd6439","#8e595a","#f2cdcf","#f984ca","#e6b5c9","#bd8ca6","#914e72","#928d88","#ffffff","#5ec8e5","#82d8d5","#ffe900","#ff4c65","#44d62c"],flo=["#f96","#cf0","#f93","#f0c","#ee34d3","#4fb4e5","#abf1cf","#ff6037","#ff355e","#6f6","#fc3","#ff6eff","#ff6","#fd5b78"],gld=["#E59B12"],fp="#fc8eac",flm=[fp,fp,fp,fp,"gray","#000","#ff6"],rP=spr(tokenData),seed=gS(tokenData),rings=Math.floor(mP(rP[1],5,12))-1,sRings=rings<=5,p={background:pk(rP[0],bgCols),zm:rP[10]>=32?1:.66,rings:rings,position:pk(rP[2],[[1,1],[1,0],[1,-1],[0,1],[0,-1],[-1,1],[-1,0],[-1,-1]]),speed:pk(rP[4],[.5,1,1,1,.25,1,1,1.5,3]),filler:sRings&&rP[5]<127?.84:.95,offset:rP[6]>=64,palette:pk(rP[7],[shim,riso,chill,flm,gld,flo,rnb]),sizer:pk(rP[8],sRings?[.1,.15,.2]:[.1,.11,.12]),cS:rP[9]<20?3:50},getDim=()=>Math.min(window.innerWidth,window.innerHeight),szs={w:getDim(),h:getDim()},genCan=()=>{let e=document.createElement("canvas");return e.height=szs.h,e.width=szs.w,document.body.appendChild(e),e},confCam=e=>{e.position.set(.20422396235810633*p.position[0],-.2889694322482629*p.position[1],-.9353016841772848),e.lookAt(0,0,0)},canvas=genCan(),sc=new THREE.Scene,oms=[],mshs=[],cM=()=>{let e=pick(p.palette);return new THREE.ShaderMaterial({side:THREE.DoubleSide,opacity:1,transparent:!0,uniforms:{power:{value:rng(1,1.2)},color:{value:new THREE.Color("#fff")},background:{value:new THREE.Color(e)}},vertexShader:"varying vec2 vUv;void main () {vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xyz, 1.0);}",fragmentShader:"varying vec2 vUv;uniform vec3 color;uniform vec3 background;uniform float power;\n// Description : Array and textureless GLSL 3D simplex noise functions.\n// Author : Ian McEwan, Ashima Arts.\n// License : Copyright (C) 2011 Ashima Arts. All rights reserved. Distributed under the MIT License. https://github.com/ashima/webgl-noise\nvec3 mod289(vec3 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}\nvec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}\nvec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}\nvec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}\nfloat snoise(vec3 v) {const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);vec3 i  = floor(v + dot(v, C.yyy));vec3 x0 = v - i + dot(i, C.xxx);\nvec3 g = step(x0.yzx, x0.xyz);vec3 l = 1.0 - g;vec3 i1 = min( g.xyz, l.zxy );vec3 i2 = max( g.xyz, l.zxy );vec3 x1 = x0 - i1 + C.xxx;vec3 x2 = x0 - i2 + C.yyy;vec3 x3 = x0 - D.yyy;i = mod289(i);\nvec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0 ))+ i.y + vec4(0.0, i1.y, i2.y, 1.0 ))+ i.x + vec4(0.0, i1.x, i2.x, 1.0 ));float n_ = 0.142857142857;vec3  ns = n_ * D.wyz - D.xzx;vec4 j = p - 49.0 * floor(p * ns.z * ns.z); vec4 x_ = floor(j * ns.z);vec4 y_ = floor(j - 7.0 * x_);vec4 x = x_ *ns.x + ns.yyyy;vec4 y = y_ *ns.x + ns.yyyy;vec4 h = 1.0 - abs(x) - abs(y);\nvec4 b0 = vec4(x.xy, y.xy);vec4 b1 = vec4(x.zw, y.zw);vec4 s0 = floor(b0)*2.0 + 1.0;vec4 s1 = floor(b1)*2.0 + 1.0;vec4 sh = -step(h, vec4(0.0));\nvec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;vec3 p0 = vec3(a0.xy,h.x);vec3 p1 = vec3(a0.zw,h.y);vec3 p2 = vec3(a1.xy,h.z);vec3 p3 = vec3(a1.zw,h.w);\nvec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));p0 *= norm.x;p1 *= norm.y;p2 *= norm.z;p3 *= norm.w;vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);m = m * m;return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),dot(p2,x2), dot(p3,x3)));}\nvoid main () {float d = pow(abs(vUv.y), power);gl_FragColor = vec4(mix(background, color, d-(snoise(gl_FragCoord.xyz/(d*d)) * d/1.5)), 0.4275);}"})};const T=2*Math.PI;let ors=new THREE.Shape;ors.moveTo(0,0),ors.absarc(0,0,1,0,T);let irs=new THREE.Path;irs.moveTo(0,0),irs.absarc(0,0,p.filler,0,T),ors.holes.push(irs);let rGeo=new THREE.ExtrudeBufferGeometry(ors,{curveSegments:p.cS,depth:6,bevelEnabled:0});for(let e=1;e<p.rings+1;e++){let c=new THREE.Mesh(rGeo,cM()),a=1-e/p.rings;c.scale.x*=a,c.scale.y*=a,c.position.z=pick([1,-1])*rng(.1,5.1)/100,oms.push(1-e/p.rings),mshs.push(c),sc.add(c)}let zm=p.zm;window.addEventListener("resize",e=>{szs.w=getDim(),szs.h=getDim();const c=szs.w/szs.h;cam.left=-zm*c,cam.right=zm*c,cam.top=zm,cam.bottom=-zm,cam.near=-1,cam.far=20,confCam(cam),cam.updateProjectionMatrix(),rndr.setSize(szs.w,szs.h),rndr.setPixelRatio(Math.min(window.devicePixelRatio,2))});const asp=szs.w/szs.h,cam=new THREE.OrthographicCamera(-zm*asp,zm*asp,zm,-zm,-1,20);confCam(cam),sc.add(cam);let rndr=new THREE.WebGLRenderer({canvas:canvas,antialias:!0});rndr.setPixelRatio(Math.min(window.devicePixelRatio,2)),rndr.setSize(szs.w,szs.h),rndr.setClearColor(p.background);const cl=new THREE.Clock,tk=()=>{let e=cl.getElapsedTime();mshs.forEach((c,a)=>{let r=(p.sizer*Math.sin(p.speed*e+(p.offset?a/2:a/6))+1)*oms[a];c.scale.x=r,c.scale.y=r,c.rotation.z+=.001}),rndr.render(sc,cam),window.requestAnimationFrame(tk)};function spr(e){let c=[];for(let a=0;a<32;a++)c.push(e.hash.slice(2+2*a,4+2*a));return c.map(e=>parseInt(e,16))}function gS(e){return parseInt(e.hash.slice(0,16),16)}function rnd(){return seed^=seed<<13,seed^=seed>>17,((seed^=seed<<5)<0?1+~seed:seed)%1e3/1e3}function pk(e,c){return c[Math.max(0,Math.floor(e/255*c.length-1e-6))]}function rng(e,c){return rnd()*(c-e)+e}function rngFlr(e,c){return Math.floor(rng(e,c))}function pick(e){return e[rngFlr(0,e.length)]}function map(e,c,a,r,n){return(e-c)/(a-c)*(n-r)+r}function mP(e,c,a){return map(e,0,255,c,a)}tk();