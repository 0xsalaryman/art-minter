var hash=tokenData.hash,DEFAULT_SIZE=1e3,DIM=Math.min(window.innerWidth,window.innerHeight),M=DIM/DEFAULT_SIZE;function getMedian(e){const o=[...e].sort((e,o)=>e-o),n=Math.floor(o.length/2);return o.length%2!=0?o[n]:(o[n-1]+o[n])/2}function sizeOfPoints(e){let o=e.map(e=>e.x),n=e.map(e=>e.y);return{w:Math.max(...o)-Math.min(...o),h:Math.max(...n)-Math.min(...n)}}Number.prototype.map=function(e,o,n,t){return(this-e)*(t-n)/(o-e)+n};const colors={pastel:["#AC95C6","#FFE399","#F7FFF8","#FFA6C1","#95E6DD"],treasureHunt:["#2AA27C","#006158","#1A332F","#FFDB4D","#FFFAE6"],vice:["#FEC872","#2071C3","#EF799B","#112461","#FCF9E6"],candy:["#EB2FB2","#FFD0CC","#FF8CB6","#992385","#571773"],neon:["#A6FFE6","#5D1BC2","#2C0D40","#BB33FF"],monochrome:["#666666","#CCCCCC","#323232","#FFFFFF"],myst:["#3A364D","#337B80","#F2D8CE","#FF8066"],lush:["#AFFF40","#4AB340","#10E68C","#004D37"],alchemy:["#FFFD61","#FB2B62","#742D8C","#30EFF2"],ocean:["#3794E3","#0B19CD","#2F6DDB","#80C7FF"],plains:["#E6DAAC","#BFAA91","#A67B6C","#735651"],dusk:["#FF9C0D","#444164","#202450","#F64D44","#AC4055"]};let factor=2.8,step=.0014,amount=0;var foregroundColor,backgroundColor,triangleColor,numberOfTies,colorScheme,hashPartOne,hashPartTwo,hashPartThree,hashPartFour,hashPartFive,convexHullPoints=[],convexHullPointsInitial=[],convexHullPointsOffsets=[],convexHullDistanceTolerance=95,anchorPoints=[];function pointsOrientation(e,o,n){let t=(o.y-e.y)*(n.x-o.x)-(o.x-e.x)*(n.y-o.y);return 0==t?0:t>0?1:2}function purgeConvexHull(e){for(i=0;i<e.length;i++){var o=0;i+1<e.length&&(o=i+1),dist(e[i].x,e[i].y,e[o].x,e[o].y)<convexHullDistanceTolerance*M&&e.splice(i,1)}}function convexHull(){var e=[],o=0;for(i=1;i<anchorPoints.length;i++)anchorPoints[i].x<anchorPoints[o].x&&(o=i);var n,t=o;do{for(e.push(anchorPoints[t]),n=(t+1)%anchorPoints.length,i=0;i<anchorPoints.length;i++)2==pointsOrientation(anchorPoints[t],anchorPoints[i],anchorPoints[n])&&(n=i);t=n}while(t!=o);var r=0;do{r++,purgeConvexHull(e)}while(r<10);return e}function getCentroid(e){var o={x:0,y:0};for(i=0;i<e.length;i++)o.x+=e[i].x,o.y+=e[i].y;return o.x/=e.length,o.y/=e.length,o}function getTangent(e,o,n){var t=createVector(o.y-e.y,e.x-o.x);return t.normalize(),t.mult(n),t}function findPointOnLineWith(e,o,n){let t=createVector(o.x-e.x,o.y-e.y).normalize();return{x:o.x+n*M*t.x,y:o.y+n*M*t.y}}function drawHashBezier(e,o=!0){let n=parseInt(e[0],16).map(0,255,0,DIM/factor),t=parseInt(e[1],16).map(0,255,0,DIM/factor),r=parseInt(e[2],16).map(0,255,0,DIM/factor),a=parseInt(e[3],16).map(0,255,0,DIM/factor),i=lerp(parseInt(e[4],16).map(0,255,0,DIM/factor),r,amount/1.5),l=parseInt(e[5],16).map(0,255,0,DIM/factor),s=parseInt(e[6],16).map(0,255,0,DIM/factor),c=parseInt(e[7],16).map(0,255,0,DIM/factor),h=2*s-i,u=2*c-l,x=lerp(parseInt(e[8],16).map(0,255,0,DIM/factor),h,amount/1.5),m=parseInt(e[9],16).map(0,255,0,DIM/factor),P=parseInt(e[10],16).map(0,255,0,DIM/factor),p=parseInt(e[11],16).map(0,255,0,DIM/factor),f=2*P-x,v=2*p-m,F=2*n-r,H=2*t-a,y=[n,s,P],C=[t,c,p],g=Math.max(...y),D=Math.min(...y),d=Math.max(...C),I=Math.min(...C),M=(DIM-(g-D))/2-D,B=(DIM-(d-I))/2-I;anchorPoints.push({x:n,y:t}),anchorPoints.push({x:s,y:c}),anchorPoints.push({x:P,y:p}),push(),translate(M,B),o&&(bezier(n,t,r,a,i,l,s,c),bezier(s,c,h,u,x,m,P,p),bezier(P,p,f,v,F,H,n,t)),pop()}function setup(){createCanvas(DIM,DIM);let e=hash.match(/.{1,2}/g).slice(1),o=e.map(e=>parseInt(e,16)%100);o[2]<60?numberOfTies=3:o[2]>=60&&o[2]<80?numberOfTies=2:o[2]>=80&&o[2]<93?numberOfTies=4:o[2]>=93&&(numberOfTies=5),o[1]<12?colorScheme=colors.pastel:o[1]>=12&&o[1]<24?colorScheme=colors.treasureHunt:o[1]>=24&&o[1]<36?colorScheme=colors.vice:o[1]>=36&&o[1]<48?colorScheme=colors.candy:o[1]>=48&&o[1]<60?colorScheme=colors.dusk:o[1]>=60&&o[1]<68?colorScheme=colors.ocean:o[1]>=68&&o[1]<76?colorScheme=colors.myst:o[1]>=76&&o[1]<84?colorScheme=colors.plains:o[1]>=84&&o[1]<89?colorScheme=colors.neon:o[1]>=89&&o[1]<94?colorScheme=colors.alchemy:o[1]>=94&&o[1]<99?colorScheme=colors.lush:o[1]>=99&&(colorScheme=colors.monochrome);let n=e.map(e=>parseInt(e,16)%colorScheme.length),t=n[0];var r=0;for(let e of n)if(e!=t){r=e;break}var a=0;for(let e of n)if(e!=t&&e!=r){a=e;break}foregroundColor=colorScheme[r],backgroundColor=colorScheme[t],triangleColor=colorScheme[a],hashPartOne=e.slice(0,16),hashPartTwo=e.slice(16),hashPartThree=e.slice(8,24),hashPartFour=e.slice(4,20),hashPartFive=e.slice(12,28),background(backgroundColor),stroke(foregroundColor),strokeWeight(11*M),drawCurves(!1);let i=getCentroid(convexHullPoints=convexHull());for(let e=0;e<convexHullPoints.length;e++){if(convexHullPointsInitial.push({x:convexHullPoints[e].x,y:convexHullPoints[e].y}),convexHullPoints.length>o.length)return;let n=o[e]>40?1:-1,t=findPointOnLineWith(createVector(i.x,i.y),createVector(convexHullPoints[e].x,convexHullPoints[e].y),o[e]*n);convexHullPointsOffsets.push({x:t.x,y:t.y})}}function drawCurves(e=!0){noFill(),drawHashBezier(hashPartOne,1),drawHashBezier(hashPartTwo,2),3==numberOfTies&&drawHashBezier(hashPartThree),4==numberOfTies&&(drawHashBezier(hashPartThree),drawHashBezier(hashPartFour)),5==numberOfTies&&(drawHashBezier(hashPartThree),drawHashBezier(hashPartFour),drawHashBezier(hashPartFive))}function drawBlob(){push();let e=anchorPoints.map(e=>e.x),o=anchorPoints.map(e=>e.y),n=Math.max(...e),t=Math.min(...e),r=Math.max(...o),a=Math.min(...o);for(translate((DIM-(n-t))/2-t,(DIM-(r-a))/2-a),fill(triangleColor),noStroke(),beginShape(),i=0;i<convexHullPoints.length;i++)convexHullPoints[i].x=lerp(convexHullPointsInitial[i].x,convexHullPointsOffsets[i].x,amount/1.75),convexHullPoints[i].y=lerp(convexHullPointsInitial[i].y,convexHullPointsOffsets[i].y,amount/1.75);let l=getCentroid(convexHullPoints);for(vertex(convexHullPoints[0].x,convexHullPoints[0].y),i=0;i<convexHullPoints.length;i++){var s=0;i+1<convexHullPoints.length&&(s=i+1);let e=dist(convexHullPoints[i].x,convexHullPoints[i].y,convexHullPoints[s].x,convexHullPoints[s].y),o=getTangent(l,convexHullPoints[i],e/2),n=getTangent(l,convexHullPoints[s],e/2),t=createVector(convexHullPoints[i].x-o.x,convexHullPoints[i].y-o.y),r=createVector(convexHullPoints[s].x+n.x,convexHullPoints[s].y+n.y);bezierVertex(t.x,t.y,r.x,r.y,convexHullPoints[s].x,convexHullPoints[s].y)}endShape(CLOSE),pop()}function draw(){background(backgroundColor),(amount>1||amount<0)&&(step*=-1),amount+=step,drawBlob(),anchorPoints=[],drawCurves()}