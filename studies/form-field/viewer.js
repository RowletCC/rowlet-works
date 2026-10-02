import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
const $=id=>document.getElementById(id), stage=$('stage');
let renderer, mixer, model, motion, time=0, playing=false, frameTime=0, wire=false, dirty=true;
const phaseButtons=[...document.querySelectorAll('[data-time]')];
const phases=[{title:'The field',text:'A circular arrangement. Each object keeps its place in the sequence.'},{title:'A common measure',text:'Three rows give the same objects a shared baseline. Differences become easier to read.'},{title:'A different rhythm',text:'The sequence winds into a rising spiral, then returns to its starting formation.'}];
function display(){
  const phase=time<3.15?0:time<7.25?1:2;
  $('current').textContent=time.toFixed(2).padStart(5,'0');$('scrub').value=Math.round(time*100);$('scrub').setAttribute('aria-valuetext',`${time.toFixed(2)} seconds`);
  $('phaseLabel').textContent=`Formation / ${time.toFixed(2).padStart(5,'0')} s`;
  $('phaseTitle').textContent=phases[phase].title;$('phaseText').textContent=phases[phase].text;
  phaseButtons.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===phase)));
}
function setPlaying(value){playing=value;frameTime=0;$('play').textContent=playing?'Ⅱ Pause':'▶ Play';$('play').setAttribute('aria-label',playing?'Pause animation':'Play animation')}
function seek(value){time=Math.max(0,Math.min(12,value));motion.paused=false;motion.enabled=true;mixer.setTime(time);display();dirty=true}
try{
  renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.setClearColor('#e1eaee');renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.22;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  stage.append(renderer.domElement);renderer.domElement.tabIndex=0;renderer.domElement.setAttribute('aria-label','3D motion preview. Use arrow keys to rotate the camera.');
  const scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(32,1,.1,70);camera.position.set(8,7.3,10);
  const controls=new OrbitControls(camera,renderer.domElement);controls.target.set(0,.8,0);controls.enablePan=false;controls.enableDamping=true;controls.dampingFactor=.08;controls.minDistance=8;controls.maxDistance=22;controls.minPolarAngle=.22;controls.maxPolarAngle=Math.PI*.48;controls.update();
  controls.addEventListener('change',()=>{dirty=true});
  renderer.domElement.addEventListener('keydown',e=>{
    if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home'].includes(e.key))return;e.preventDefault();
    const offset=camera.position.clone().sub(controls.target);const s=new THREE.Spherical().setFromVector3(offset);
    if(e.key==='Home'){camera.position.set(8,7.3,10)}else{if(e.key==='ArrowLeft')s.theta-=.13;if(e.key==='ArrowRight')s.theta+=.13;if(e.key==='ArrowUp')s.phi=Math.max(.22,s.phi-.10);if(e.key==='ArrowDown')s.phi=Math.min(Math.PI*.48,s.phi+.10);camera.position.copy(controls.target).add(new THREE.Vector3().setFromSpherical(s))}controls.update();
  });
  scene.add(new THREE.HemisphereLight('#f5f7ff','#748791',2.4));
  const key=new THREE.DirectionalLight('#fff6ea',3.2);key.position.set(-3,8,5);key.castShadow=true;key.shadow.mapSize.set(1024,1024);Object.assign(key.shadow.camera,{left:-5,right:5,top:5,bottom:-5,near:.5,far:22});key.shadow.bias=-.0003;key.shadow.normalBias=.035;scene.add(key);
  const fill=new THREE.DirectionalLight('#bddeff',1.2);fill.position.set(4,4,-5);scene.add(fill);
  const floor=new THREE.Mesh(new THREE.PlaneGeometry(80,80),new THREE.MeshStandardMaterial({color:'#e1eaee',roughness:.95}));floor.rotation.x=-Math.PI/2;floor.position.y=-.05;floor.receiveShadow=true;scene.add(floor);
  const grid=new THREE.GridHelper(11,22,'#b7c8d2','#cbd8df');grid.position.y=-.04;grid.material.transparent=true;grid.material.opacity=.32;scene.add(grid);
  const gltf=await new GLTFLoader().loadAsync('./form-field.glb');model=gltf.scene;model.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true}});scene.add(model);
  mixer=new THREE.AnimationMixer(model);motion=mixer.clipAction(gltf.animations[0]);motion.setLoop(THREE.LoopOnce,1);motion.clampWhenFinished=true;motion.play();seek(0);
  $('error').hidden=true;$('status').textContent='GLB loaded · ready';document.querySelectorAll('button,input').forEach(b=>b.disabled=false);
  $('play').addEventListener('click',()=>{if(!playing&&time>=12)seek(0);setPlaying(!playing)});
  $('scrub').addEventListener('input',e=>{setPlaying(false);seek(Number(e.target.value)/100)});
  phaseButtons.forEach(b=>b.addEventListener('click',()=>{setPlaying(false);seek(Number(b.dataset.time))}));
  $('wire').addEventListener('click',()=>{wire=!wire;model.traverse(o=>{if(o.isMesh)o.material.wireframe=wire});$('wire').setAttribute('aria-pressed',String(wire));$('wire').textContent=`Wireframe: ${wire?'on':'off'}`;dirty=true});
  const resize=()=>{const w=stage.clientWidth,h=stage.clientHeight;camera.aspect=w/h;camera.fov=w<500?44:32;camera.updateProjectionMatrix();renderer.setSize(w,h,false);dirty=true};new ResizeObserver(resize).observe(stage);resize();
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');reduced.addEventListener('change',e=>{if(e.matches)setPlaying(false)});
  document.addEventListener('visibilitychange',()=>{frameTime=0;if(document.hidden)setPlaying(false)});
  renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();setPlaying(false);$('error').hidden=false;$('loadText').textContent='The 3D view was interrupted. Reload to restore it, or download the asset below.'});
  renderer.setAnimationLoop(now=>{if(document.hidden)return;const delta=frameTime?Math.min((now-frameTime)/1000,.08):0;frameTime=now;if(playing)seek((time+delta)%12);controls.update();if(dirty){renderer.render(scene,camera);dirty=false}});
  window.addEventListener('pagehide',()=>{renderer.setAnimationLoop(null);controls.dispose();scene.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material){const ms=Array.isArray(o.material)?o.material:[o.material];ms.forEach(m=>m.dispose())}});renderer.dispose()},{once:true});
}catch(error){$('error').hidden=false;$('loadText').textContent='This browser could not load the 3D view. The animated GLB is available below.';$('status').textContent='Preview unavailable';console.error('Form / Field preview:',error)}
