import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { validateBytes } from 'gltf-validator';
import { writeFile, copyFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';

// Exporter uses FileReader for binary blobs. This only adapts a local Node Blob.
globalThis.FileReader = class {
  readAsArrayBuffer(blob) { blob.arrayBuffer().then(r => { this.result=r; this.onloadend?.(); }); }
};
await mkdir('validation',{recursive:true});
const scene = new THREE.Scene();
const root = new THREE.Group(); root.name='Form_Field'; scene.add(root);
const geo = new RoundedBoxGeometry(1,1,1,1,0.08); geo.translate(0,.5,0);
geo.deleteAttribute('uv'); geo.clearGroups();
const colors=['#bbd0d9','#7f9ead','#dd5c40'];
const mats=colors.map((c,i)=>new THREE.MeshStandardMaterial({name:['Porcelain','Slate','Signal'][i],color:c,roughness:.36,metalness:.12}));
const tracks=[]; const times=Array.from({length:241},(_,i)=>i/20);
const ease=x=>{const t=Math.max(0,Math.min(1,x));return t*t*t*(t*(t*6-15)+10)};
const lerp=(a,b,t)=>a+(b-a)*t;
function pose(i,t){
  const a=i/24*Math.PI*2;
  const h=.85+1.7*(.5+.5*Math.sin(a*2+.35));
  const circle=[Math.sin(a)*2.5,0,Math.cos(a)*2.5,.35,h,.42,-a];
  const row=i%8, group=Math.floor(i/8);
  const grid=[(row-3.5)*.64,0,(group-1)*1.38,.37,.62+row*.26,.46,0];
  const sp=a*1.52;
  const radius=.9+i*.072;
  const spiral=[Math.sin(sp)*radius,.05+i*.025,Math.cos(sp)*radius,.29,.7+1.15*(.5+.5*Math.cos(a)),.38,-sp];
  let from=circle,to=circle,m=0;
  if(t>=1.5&&t<4.2){from=circle;to=grid;m=ease((t-1.5)/2.7)}
  else if(t>=4.2&&t<5.9){from=grid;to=grid}
  else if(t>=5.9&&t<8.5){from=grid;to=spiral;m=ease((t-5.9)/2.6)}
  else if(t>=8.5&&t<9.4){from=spiral;to=spiral}
  else if(t>=9.4){from=spiral;to=circle;m=ease((t-9.4)/2.6)}
  return from.map((v,j)=>lerp(v,to[j],m));
}
for(let i=0;i<24;i++){
  const mesh=new THREE.Mesh(geo,mats[i%8>=6?2:(Math.floor(i/8)%2)]); mesh.name=`Prism_${String(i+1).padStart(2,'0')}`;
  const p=pose(i,0);mesh.position.set(...p.slice(0,3));mesh.scale.set(...p.slice(3,6));mesh.rotation.y=p[6];root.add(mesh);
  const positions=[],scales=[],quats=[];
  for(const t of times){const v=pose(i,t); positions.push(...v.slice(0,3));scales.push(...v.slice(3,6));quats.push(0,Math.sin(v[6]/2),0,Math.cos(v[6]/2));}
  tracks.push(new THREE.VectorKeyframeTrack(`${mesh.name}.position`,times,positions),new THREE.VectorKeyframeTrack(`${mesh.name}.scale`,times,scales),new THREE.QuaternionKeyframeTrack(`${mesh.name}.quaternion`,times,quats));
}
const clip=new THREE.AnimationClip('Field_Compare_Spiral',12,tracks);
const glb=await new GLTFExporter().parseAsync(scene,{binary:true,animations:[clip],trs:true});
await writeFile('form-field.glb',Buffer.from(glb));
const report=await validateBytes(new Uint8Array(glb),{uri:'form-field.glb',maxIssues:100});
assert.equal(report.issues.numErrors,0,JSON.stringify(report.issues));
assert.equal(report.issues.numWarnings,0,JSON.stringify(report.issues));
const parsed=await new GLTFLoader().parseAsync(glb,'');
assert.equal(parsed.animations.length,1);assert.equal(parsed.animations[0].duration,12);
const mix=new THREE.AnimationMixer(parsed.scene);const action=mix.clipAction(parsed.animations[0]);action.setLoop(THREE.LoopOnce,1);action.clampWhenFinished=true;action.play();
const objects=[];parsed.scene.traverse(o=>{if(o.isMesh)objects.push(o)});assert.equal(objects.length,24);
let last=[];let first=[];const samples=[];
for(let k=0;k<=240;k++){
  mix.setTime(k/20);parsed.scene.updateMatrixWorld(true);
  const row=objects.map(o=>[...o.position.toArray(),...o.scale.toArray(),...o.quaternion.toArray()]);
  assert(row.flat().every(Number.isFinite));assert(objects.every(o=>Math.min(...o.scale.toArray())>0));
  if(k===0)first=row;if(k===240)last=row;
  if([0,84,174,240].includes(k))samples.push({seconds:k/20,first_prism:row[0]});
}
const loopError=Math.max(...first.flat().map((v,i)=>Math.abs(v-last.flat()[i])));assert(loopError<1e-5);
const stats={artifact:'form-field.glb',bytes:glb.byteLength,sha256:createHash('sha256').update(Buffer.from(glb)).digest('hex'),durationSeconds:12,animatedObjects:24,animationTracks:tracks.length,keyframesPerTrack:241,geometryTrianglesPerPrism:geo.attributes.position.count/3,totalInstancedTriangles:24*geo.attributes.position.count/3,materials:3,textures:0,loopMaxComponentDifference:loopError,khronosErrors:report.issues.numErrors,khronosWarnings:report.issues.numWarnings,verified:['Khronos glTF Validator','Three.js GLTFLoader re-import','241 animation samples: finite transforms and positive scales','start/end transform agreement'],notVerified:['Unity import/playback','FBX export','game-specific GPU budget'],samples};
await writeFile('asset-report.json',JSON.stringify(stats,null,2)+'\n');
await writeFile('validation/gltf-validator.json',JSON.stringify(report,null,2)+'\n');
await mkdir('vendor/utils',{recursive:true});await mkdir('vendor/loaders',{recursive:true});await mkdir('vendor/controls',{recursive:true});
for(const [source,dest] of [['build/three.module.js','three.module.js'],['build/three.core.js','three.core.js'],['examples/jsm/loaders/GLTFLoader.js','loaders/GLTFLoader.js'],['examples/jsm/controls/OrbitControls.js','controls/OrbitControls.js'],['examples/jsm/utils/BufferGeometryUtils.js','utils/BufferGeometryUtils.js'],['LICENSE','LICENSE-three.txt']])await copyFile(`node_modules/three/${source}`,`vendor/${dest}`);
console.log(JSON.stringify(stats,null,2));
