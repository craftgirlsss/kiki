// import * as THREE from 'three';
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/Addons.js';
// import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js';

// let scene, camera, renderer, labelRenderer;
// let tree; // Pohon utama tempat fotosintesis terjadi
// let sunLight;
// let sunMesh;
// let energyParticles = [];
// let waterParticles = [];
// let co2Particles = [];
// let oxygenParticles = [];
// let carbohydrateEffect;
// let controls;
// let forestTrees = []; // Array untuk menyimpan pohon-pohon tambahan

// // --- Penambahan untuk teks penjelasan ---
// let descriptionDiv;
// let descriptionLabel;
// // --- Akhir Penambahan ---

// const animationState = {
//     step: 0,
//     timer: 0,
//     duration: 3
// };

// init();
// animate();

// function init() {
//     // Scene
//     scene = new THREE.Scene();
//     scene.background = new THREE.Color(0x87CEEB);

//     // Camera
//     camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//     camera.position.set(0, 5, 15);
//     camera.lookAt(0, 2, 0);

//     // Renderer (WebGL)
//     renderer = new THREE.WebGLRenderer({ antialias: true });
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     document.body.appendChild(renderer.domElement);

//     // Label Renderer (CSS2D)
//     labelRenderer = new CSS2DRenderer();
//     labelRenderer.setSize(window.innerWidth, window.innerHeight);
//     labelRenderer.domElement.style.position = 'absolute';
//     labelRenderer.domElement.style.top = '0px';
//     labelRenderer.domElement.style.pointerEvents = 'none'; // Penting agar interaksi mouse tetap pada kanvas Three.js
//     document.body.appendChild(labelRenderer.domElement);

//     // OrbitControls
//     controls = new OrbitControls(camera, renderer.domElement);
//     controls.enableDamping = true;
//     controls.dampingFactor = 0.25;

//     // Cahaya Ambient
//     const ambientLight = new THREE.AmbientLight(0x404040, 2);
//     scene.add(ambientLight);

//     // Matahari (Directional Light)
//     sunLight = new THREE.DirectionalLight(0xFFFF00, 5);
//     sunLight.position.set(10, 20, 10);
//     sunLight.castShadow = true;
//     scene.add(sunLight);

//     // Objek Matahari (Mesh)
//     const sunGeometry = new THREE.SphereGeometry(1.5, 32, 32);
//     const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xFFD700 });
//     sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
//     sunMesh.position.copy(sunLight.position);
//     scene.add(sunMesh);

//     // --- Objek 3D Dasar ---

//     // Tanah
//     const groundGeometry = new THREE.PlaneGeometry(50, 50);
//     const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
//     const ground = new THREE.Mesh(groundGeometry, groundMaterial);
//     ground.rotation.x = -Math.PI / 2;
//     ground.receiveShadow = true;
//     scene.add(ground);

//     // Pohon Utama (tempat fotosintesis terjadi)
//     tree = createSimpleTree(); // Menggunakan fungsi baru
//     tree.position.set(0, 0, 0); // Posisikan pohon utama di tengah
//     scene.add(tree);

//     // Menambahkan Pohon-pohon Tambahan
//     addForestTrees(20); // Tambahkan 15 pohon lain

//     // --- Penambahan untuk teks penjelasan ---
//     descriptionDiv = document.createElement('div');
//     descriptionDiv.style.position = 'absolute';
//     descriptionDiv.style.top = '10px';
//     descriptionDiv.style.right = '10px';
//     descriptionDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
//     descriptionDiv.style.color = 'white';
//     descriptionDiv.style.padding = '10px';
//     descriptionDiv.style.borderRadius = '5px';
//     descriptionDiv.style.fontFamily = 'Arial, sans-serif';
//     descriptionDiv.style.fontSize = '1em';
//     descriptionDiv.style.maxWidth = '300px';
//     descriptionDiv.style.textAlign = 'right'; // Teks rata kanan
//     descriptionDiv.style.zIndex = '100'; // Pastikan di atas elemen lain
//     document.body.appendChild(descriptionDiv);

//     // Kita tidak perlu CSS2DObject untuk teks penjelasan yang posisinya fixed di layar
//     // Karena labelRenderer sudah diatur pointerEvents = 'none', kita bisa langsung append ke body.
//     // Namun, jika ingin konsisten menggunakan CSS2DObject (misalnya untuk skalabilitas ke posisi 3D di masa depan),
//     // kita bisa membuat dummy object di scene dan menempelkan label ini ke dummy object tersebut.
//     // Untuk tujuan ini, menambahkan langsung ke body adalah yang paling sederhana dan efektif.

//     updateDescriptionText("Memulai simulasi fotosintesis..."); // Teks awal
//     // --- Akhir Penambahan ---

//     // Event Listener untuk resize window
//     window.addEventListener('resize', onWindowResize);

//     // Mulai animasi fotosintesis setelah beberapa detik
//     setTimeout(() => {
//         animationState.step = 1;
//     }, 2000);
// }

// // Fungsi yang sekarang mengembalikan group pohon
// function createSimpleTree() {
//     const treeGroup = new THREE.Group();

//     // Batang pohon
//     const trunkHeight = 3 + Math.random() * 3; // Tinggi batang bervariasi
//     const trunkRadiusBottom = 0.5 + Math.random() * 0.2;
//     const trunkRadiusTop = trunkRadiusBottom * (0.5 + Math.random() * 0.3);

//     const trunkGeometry = new THREE.CylinderGeometry(trunkRadiusTop, trunkRadiusBottom, trunkHeight, 8);
//     const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x654321 });
//     const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
//     trunk.position.y = trunkHeight / 2;
//     trunk.castShadow = true;
//     treeGroup.add(trunk);

//     // Daun pohon (sederhana, bola)
//     const leavesRadius = 1.5 + Math.random() * 1.5; // Ukuran daun bervariasi
//     const leavesGeometry = new THREE.SphereGeometry(leavesRadius, 16, 16);
//     const leavesMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 });
//     const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
//     leaves.position.y = trunkHeight + (leavesRadius * 0.5); // Posisikan daun di atas batang
//     leaves.castShadow = true;
//     treeGroup.add(leaves);

//     return treeGroup; // Mengembalikan grup pohon
// }

// function addForestTrees(count) {
//     for (let i = 0; i < count; i++) {
//         const forestTree = createSimpleTree();

//         // Posisikan pohon secara acak, hindari area tengah pohon utama
//         const x = (Math.random() - 0.5) * 40; // Rentang -20 hingga 20
//         const z = (Math.random() - 0.5) * 40; // Rentang -20 hingga 20

//         // Pastikan pohon tidak terlalu dekat dengan pohon utama
//         if (Math.abs(x) < 5 && Math.abs(z) < 5) {
//             i--; // Ulangi iterasi ini jika terlalu dekat
//             continue;
//         }

//         forestTree.position.set(x, 0, z); // Y = 0 karena pohon sudah memiliki posisi y batang
//         scene.add(forestTree);
//         forestTrees.push(forestTree); // Simpan referensi jika perlu di masa depan
//     }
// }


// function onWindowResize() {
//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectionMatrix();
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     labelRenderer.setSize(window.innerWidth, window.innerHeight);
//     // Tidak perlu update posisi descriptionDiv karena sudah absolute dan pakai top/right
// }

// function animate() {
//     requestAnimationFrame(animate);

//     const delta = 1 / 60;

//     // Update animasi berdasarkan langkah fotosintesis
//     updateFotosintesisAnimation(delta);

//     controls.update();
//     renderer.render(scene, camera);
//     labelRenderer.render(scene, camera);
// }

// // --- Fungsi Penambahan untuk update teks penjelasan ---
// function updateDescriptionText(text) {
//     if (descriptionDiv) {
//         descriptionDiv.innerHTML = `<h3>Proses Fotosintesis</h3><p>${text}</p>`;
//     }
// }
// // --- Akhir Fungsi Penambahan ---

// function updateFotosintesisAnimation(delta) {
//     animationState.timer += delta;

//     switch (animationState.step) {
//         case 1: // Tumbuhan terkena sinar matahari
//             if (animationState.timer < animationState.duration) {
//                 // Perubahan warna daun hanya pada pohon utama
//                 if (tree && tree.children[1]) {
//                     const initialColor = new THREE.Color(0x228B22);
//                     const brightColor = new THREE.Color(0x90EE90);
//                     tree.children[1].material.color.lerpColors(initialColor, brightColor, animationState.timer / animationState.duration);
//                 }
//                 updateDescriptionText("Langkah 1: Tumbuhan terkena sinar matahari. Daun mulai menyerap energi cahaya.");
//             } else {
//                 animationState.step = 2;
//                 animationState.timer = 0;
//                 console.log("Langkah 1: Tumbuhan terkena sinar matahari");
//             }
//             break;

//         case 2: // Klorofil pada daun menyerap energi dari sinar matahari
//             if (animationState.timer < animationState.duration) {
//                 if (Math.random() < 0.1) {
//                     createEnergyParticle();
//                 }
//                 updateParticles(energyParticles, 'energy');
//                 updateDescriptionText("Langkah 2: Klorofil di daun menyerap energi cahaya dari matahari.");
//             } else {
//                 energyParticles.forEach(p => scene.remove(p));
//                 energyParticles = [];
//                 animationState.step = 3;
//                 animationState.timer = 0;
//                 console.log("Langkah 2: Klorofil menyerap energi");
//             }
//             break;

//         case 3: // Akar menyerap air dalam tanah
//             if (animationState.timer < animationState.duration) {
//                 if (Math.random() < 0.05) {
//                     createWaterParticle();
//                 }
//                 updateParticles(waterParticles, 'water');
//                 updateDescriptionText("Langkah 3: Akar pohon menyerap air (H2O) dari dalam tanah.");
//             } else {
//                 waterParticles.forEach(p => {
//                     scene.remove(p);
//                     if (p.userData.label) {
//                         p.userData.label.element.remove();
//                         p.userData.label = null;
//                     }
//                 });
//                 waterParticles = [];
//                 animationState.step = 4;
//                 animationState.timer = 0;
//                 console.log("Langkah 3: Akar menyerap air");
//             }
//             break;

//         case 4: // Daun menyerap karbondioksida pada udara
//             if (animationState.timer < animationState.duration) {
//                 if (Math.random() < 0.08) {
//                     createCO2Particle();
//                 }
//                 updateParticles(co2Particles, 'co2');
//                 updateDescriptionText("Langkah 4: Daun menyerap karbondioksida (CO2) dari udara.");
//             } else {
//                 co2Particles.forEach(p => {
//                     scene.remove(p);
//                     if (p.userData.label) {
//                         p.userData.label.element.remove();
//                         p.userData.label = null;
//                     }
//                 });
//                 co2Particles = [];
//                 animationState.step = 5;
//                 animationState.timer = 0;
//                 console.log("Langkah 4: Daun menyerap CO2");
//             }
//             break;

//         case 5: // Oksigen dilepaskan ke udara dan karbohidrat diserap oleh tumbuhan
//             if (animationState.timer < animationState.duration) {
//                 if (Math.random() < 0.1) {
//                     createOxygenParticle();
//                 }
//                 updateParticles(oxygenParticles, 'oxygen');

//                 if (!carbohydrateEffect) {
//                     carbohydrateEffect = new THREE.Mesh(
//                         new THREE.SphereGeometry(0.3, 8, 8),
//                         new THREE.MeshBasicMaterial({ color: 0xFFD700, transparent: true, opacity: 0.5 })
//                     );
//                     carbohydrateEffect.position.copy(tree.position);
//                     scene.add(carbohydrateEffect);
//                 }
//                 carbohydrateEffect.material.opacity = Math.sin(animationState.timer * Math.PI / animationState.duration) * 0.5 + 0.2;
//                 carbohydrateEffect.scale.setScalar(1 + Math.sin(animationState.timer * Math.PI / animationState.duration) * 0.5);
//                 updateDescriptionText("Langkah 5: Oksigen (O2) dilepaskan ke udara, dan karbohidrat (gula) diserap oleh tumbuhan sebagai energi.");

//             } else {
//                 oxygenParticles.forEach(p => {
//                     scene.remove(p);
//                     if (p.userData.label) {
//                         p.userData.label.element.remove();
//                         p.userData.label = null;
//                     }
//                 });
//                 oxygenParticles = [];
//                 if (carbohydrateEffect) {
//                     scene.remove(carbohydrateEffect);
//                     carbohydrateEffect = null;
//                 }
//                 animationState.step = 0;
//                 animationState.timer = 0;
//                 console.log("Langkah 5: Oksigen dilepaskan & Karbohidrat diserap");
//                 updateDescriptionText("Proses fotosintesis selesai. Akan mengulang kembali dalam 3 detik.");

//                 setTimeout(() => {
//                     animationState.step = 1;
//                 }, 3000);
//             }
//             break;

//         case 0:
//             // updateDescriptionText("Simulasi Fotosintesis: Menunggu untuk memulai...");
//             break;
//     }
// }

// // --- Fungsi untuk membuat dan mengupdate partikel (tidak ada perubahan signifikan di sini) ---

// function createEnergyParticle() {
//     const geometry = new THREE.SphereGeometry(0.08, 8, 8);
//     const material = new THREE.MeshBasicMaterial({ color: 0xFFD700 });
//     const particle = new THREE.Mesh(geometry, material);

//     particle.position.set(
//         sunLight.position.x + (Math.random() - 0.5) * 2,
//         sunLight.position.y + (Math.random() - 0.5) * 2,
//         sunLight.position.z + (Math.random() - 0.5) * 2
//     );

//     particle.userData.target = new THREE.Vector3(
//         tree.position.x + (Math.random() - 0.5) * 1.5,
//         tree.position.y + 5.5 + (Math.random() - 0.5) * 1.5,
//         tree.position.z + (Math.random() - 0.5) * 1.5
//     );
//     particle.userData.speed = 0.05 + Math.random() * 0.05;
//     energyParticles.push(particle);
//     scene.add(particle);
// }

// function createWaterParticle() {
//     const geometry = new THREE.SphereGeometry(0.15, 8, 8);
//     const material = new THREE.MeshBasicMaterial({ color: 0x00BFFF });
//     const particle = new THREE.Mesh(geometry, material);

//     particle.position.set(
//         tree.position.x + (Math.random() - 0.5) * 2,
//         0.1,
//         tree.position.z + (Math.random() - 0.5) * 2
//     );

//     particle.userData.target = new THREE.Vector3(
//         tree.position.x + (Math.random() - 0.5) * 0.5,
//         tree.position.y + (Math.random() * 2),
//         tree.position.z + (Math.random() - 0.5) * 0.5
//     );
//     particle.userData.speed = 0.03 + Math.random() * 0.03;

//     const waterDiv = document.createElement('div');
//     waterDiv.className = 'label';
//     waterDiv.textContent = 'Air';
//     waterDiv.style.color = '#FFFFFF';
//     waterDiv.style.backgroundColor = '#00BFFF';
//     waterDiv.style.padding = '2px 5px';
//     waterDiv.style.borderRadius = '3px';
//     waterDiv.style.fontSize = '0.8em';
//     waterDiv.style.opacity = '0.8';

//     const waterLabel = new CSS2DObject(waterDiv);
//     particle.add(waterLabel);
//     particle.userData.label = waterLabel;

//     waterParticles.push(particle);
//     scene.add(particle);
// }

// function createCO2Particle() {
//     const geometry = new THREE.SphereGeometry(0.18, 8, 8);
//     const material = new THREE.MeshBasicMaterial({ color: 0x4F4F4F });
//     const particle = new THREE.Mesh(geometry, material);

//     particle.position.set(
//         (Math.random() - 0.5) * 10,
//         tree.position.y + 5 + (Math.random() - 0.5) * 5,
//         (Math.random() - 0.5) * 10
//     );

//     particle.userData.target = new THREE.Vector3(
//         tree.position.x + (Math.random() - 0.5) * 1.5,
//         tree.position.y + 5.5 + (Math.random() - 0.5) * 1.5,
//         tree.position.z + (Math.random() - 0.5) * 1.5
//     );
//     particle.userData.speed = 0.04 + Math.random() * 0.04;

//     const co2Div = document.createElement('div');
//     co2Div.className = 'label';
//     co2Div.textContent = 'CO2';
//     co2Div.style.color = '#FFFFFF';
//     co2Div.style.backgroundColor = '#4F4F4F';
//     co2Div.style.padding = '2px 5px';
//     co2Div.style.borderRadius = '3px';
//     co2Div.style.fontSize = '0.8em';
//     co2Div.style.opacity = '0.8';

//     const co2Label = new CSS2DObject(co2Div);
//     particle.add(co2Label);
//     particle.userData.label = co2Label;

//     co2Particles.push(particle);
//     scene.add(particle);
// }

// function createOxygenParticle() {
//     const geometry = new THREE.SphereGeometry(0.12, 8, 8);
//     const material = new THREE.MeshBasicMaterial({ color: 0x32CD32 });
//     const particle = new THREE.Mesh(geometry, material);

//     particle.position.set(
//         tree.position.x + (Math.random() - 0.5) * 1,
//         tree.position.y + 5.5 + (Math.random() - 0.5) * 1,
//         tree.position.z + (Math.random() - 0.5) * 1
//     );

//     particle.userData.target = new THREE.Vector3(
//         particle.position.x + (Math.random() - 0.5) * 5,
//         particle.position.y + 5 + Math.random() * 5,
//         particle.position.z + (Math.random() - 0.5) * 5
//     );
//     particle.userData.speed = 0.06 + Math.random() * 0.06;
//     particle.userData.maxDistance = 10;

//     const oxygenDiv = document.createElement('div');
//     oxygenDiv.className = 'label';
//     oxygenDiv.textContent = 'Oksigen';
//     oxygenDiv.style.color = '#FFFFFF';
//     oxygenDiv.style.backgroundColor = '#32CD32';
//     oxygenDiv.style.padding = '2px 5px';
//     oxygenDiv.style.borderRadius = '3px';
//     oxygenDiv.style.fontSize = '0.8em';
//     oxygenDiv.style.opacity = '0.8';

//     const oxygenLabel = new CSS2DObject(oxygenDiv);
//     particle.add(oxygenLabel);
//     particle.userData.label = oxygenLabel;

//     oxygenParticles.push(particle);
//     scene.add(particle);
// }


// function updateParticles(particlesArray, type) {
//     for (let i = particlesArray.length - 1; i >= 0; i--) {
//         const p = particlesArray[i];

//         if (p.userData.target) {
//             const direction = p.userData.target.clone().sub(p.position).normalize();
//             p.position.add(direction.multiplyScalar(p.userData.speed));

//             // Hapus partikel jika sudah dekat target atau terlalu jauh
//             if (p.position.distanceTo(p.userData.target) < 0.1 || (type === 'oxygen' && p.position.distanceTo(tree.position) > p.userData.maxDistance)) {
//                 scene.remove(p);
//                 // Hapus juga labelnya dari DOM
//                 if (p.userData.label) {
//                     p.userData.label.element.remove();
//                     p.userData.label = null;
//                 }
//                 particlesArray.splice(i, 1);
//             }
//         }
//     }
// }




import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/Addons.js';
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js';

let scene, camera, renderer, labelRenderer;
let tree; // Pohon utama tempat fotosintesis terjadi
let sunLight;
let sunMesh;
let energyParticles = [];
let waterParticles = [];
let co2Particles = [];
let oxygenParticles = [];
let carbohydrateEffect;
let controls;
let forestTrees = []; // Array untuk menyimpan pohon-pohon tambahan

// --- Penambahan untuk Kontrol GUI ---
let gui;
const params = {
    jumlahPohon: 20, // Nilai awal
    lanjutkanAnimasi: () => advanceAnimationStep() // Fungsi yang akan dipanggil tombol
};
// --- Akhir Penambahan ---

// --- Penambahan untuk teks penjelasan ---
let descriptionDiv;
// --- Akhir Penambahan ---

const animationState = {
    step: 0,
    timer: 0,
    duration: 5 // Durasi diperpanjang sedikit agar lebih mudah dilihat
};

init();
animate();

function init() {
    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB);

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 15);
    camera.lookAt(0, 2, 0);

    // Renderer (WebGL)
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Label Renderer (CSS2D)
    labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0px';
    labelRenderer.domElement.style.pointerEvents = 'none';
    document.body.appendChild(labelRenderer.domElement);
    
    // --- Penambahan untuk Judul H1 ---
    const titleDiv = document.createElement('div');
    titleDiv.textContent = 'Proses Fotosintesis';
    titleDiv.style.position = 'absolute';
    titleDiv.style.top = '40px'; // Posisi dari atas
    titleDiv.style.left = '0';
    titleDiv.style.right = '0';
    titleDiv.style.textAlign = 'center';
    titleDiv.style.color = 'white';
    titleDiv.style.fontSize = '5.5em'; // Ukuran font besar
    titleDiv.style.fontWeight = 'bold';
    titleDiv.style.fontFamily = `'Arial Black', Gadget, sans-serif`;
    titleDiv.style.textShadow = '4px 4px 8px rgba(0, 0, 0, 0.6)'; // Bayangan teks untuk keterbacaan
    titleDiv.style.zIndex = '-1'; // Di belakang UI tapi di depan kanvas
    titleDiv.style.pointerEvents = 'none'; // Agar tidak menghalangi interaksi mouse
    document.body.appendChild(titleDiv);
    // --- Akhir Penambahan ---

    // OrbitControls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;

    // Cahaya Ambient
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);

    // Matahari (Directional Light)
    sunLight = new THREE.DirectionalLight(0xFFFF00, 5);
    sunLight.position.set(10, 20, 10);
    sunLight.castShadow = true;
    scene.add(sunLight);

    // Objek Matahari (Mesh)
    const sunGeometry = new THREE.SphereGeometry(1.5, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xFFD700 });
    sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
    sunMesh.position.copy(sunLight.position);
    scene.add(sunMesh);

    // Tanah
    const groundGeometry = new THREE.PlaneGeometry(50, 50);
    const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Pohon Utama
    tree = createSimpleTree();
    tree.position.set(0, 0, 0);
    scene.add(tree);

    // Menambahkan Pohon-pohon Tambahan berdasarkan parameter
    addForestTrees(params.jumlahPohon);

    // Teks Penjelasan
    descriptionDiv = document.createElement('div');
    descriptionDiv.style.position = 'absolute';
    descriptionDiv.style.bottom = '10px';
    descriptionDiv.style.left = '10px';
    descriptionDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    descriptionDiv.style.color = 'white';
    descriptionDiv.style.padding = '10px';
    descriptionDiv.style.borderRadius = '5px';
    descriptionDiv.style.fontFamily = 'Arial, sans-serif';
    descriptionDiv.style.fontSize = '1em';
    descriptionDiv.style.maxWidth = '300px';
    descriptionDiv.style.zIndex = '100';
    document.body.appendChild(descriptionDiv);
    updateDescriptionText("Memulai simulasi fotosintesis...");

    // --- Inisialisasi GUI ---
    gui = new GUI();
    gui.title("Panel Kontrol");

    gui.add(params, 'jumlahPohon', 0, 100, 1)
       .name('Jumlah Pohon')
       .onChange((value) => {
           updateForest(value);
       });

    gui.add(params, 'lanjutkanAnimasi').name('Langkah Berikutnya >>');
    // --- Akhir Inisialisasi GUI ---

    window.addEventListener('resize', onWindowResize);

    setTimeout(() => {
        animationState.step = 1;
    }, 2000);
}

function createSimpleTree() {
    const treeGroup = new THREE.Group();
    const trunkHeight = 3 + Math.random() * 3;
    const trunkRadiusBottom = 0.5 + Math.random() * 0.2;
    const trunkRadiusTop = trunkRadiusBottom * (0.5 + Math.random() * 0.3);
    const trunkGeometry = new THREE.CylinderGeometry(trunkRadiusTop, trunkRadiusBottom, trunkHeight, 8);
    const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x654321 });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = trunkHeight / 2;
    trunk.castShadow = true;
    treeGroup.add(trunk);

    const leavesRadius = 1.5 + Math.random() * 1.5;
    const leavesGeometry = new THREE.SphereGeometry(leavesRadius, 16, 16);
    const leavesMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 });
    const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
    leaves.position.y = trunkHeight + (leavesRadius * 0.5);
    leaves.castShadow = true;
    treeGroup.add(leaves);
    return treeGroup;
}

// --- Fungsi Baru untuk Mengelola Hutan ---
function clearForest() {
    forestTrees.forEach(tree => {
        scene.remove(tree);
    });
    forestTrees = [];
}

function addForestTrees(count) {
    for (let i = 0; i < count; i++) {
        const forestTree = createSimpleTree();
        const x = (Math.random() - 0.5) * 40;
        const z = (Math.random() - 0.5) * 40;
        if (Math.abs(x) < 5 && Math.abs(z) < 5) {
            i--;
            continue;
        }
        forestTree.position.set(x, 0, z);
        scene.add(forestTree);
        forestTrees.push(forestTree);
    }
}

function updateForest(count) {
    clearForest();
    addForestTrees(count);
}
// --- Akhir Fungsi Pengelola Hutan ---


// --- Fungsi Baru untuk Kontrol Animasi Manual ---
function advanceAnimationStep() {
    // Membersihkan partikel dari step sebelumnya
    [energyParticles, waterParticles, co2Particles, oxygenParticles].forEach(arr => {
        arr.forEach(p => {
             scene.remove(p);
             if (p.userData.label) p.userData.label.element.remove();
        });
        arr.length = 0;
    });
    if (carbohydrateEffect) {
        scene.remove(carbohydrateEffect);
        carbohydrateEffect = null;
    }

    // Lanjut ke step berikutnya
    animationState.step++;
    if (animationState.step > 5) {
        animationState.step = 1; // Kembali ke langkah 1
    }
    animationState.timer = 0; // Reset timer
    console.log("Animasi dilanjutkan ke langkah:", animationState.step);
}
// --- Akhir Fungsi Kontrol Animasi ---

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    const delta = 1 / 60;
    updateFotosintesisAnimation(delta);
    controls.update();
    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
}

function updateDescriptionText(text) {
    if (descriptionDiv) {
        descriptionDiv.innerHTML = `<h3>Proses Fotosintesis</h3><p>${text}</p>`;
    }
}

function updateFotosintesisAnimation(delta) {
    animationState.timer += delta;

    switch (animationState.step) {
        case 1:
            if (animationState.timer < animationState.duration) {
                if (tree && tree.children[1]) {
                    const initialColor = new THREE.Color(0x228B22);
                    const brightColor = new THREE.Color(0x90EE90);
                    tree.children[1].material.color.lerpColors(initialColor, brightColor, animationState.timer / animationState.duration);
                }
                updateDescriptionText("Langkah 1: Tumbuhan terkena sinar matahari. Daun mulai menyerap energi cahaya.");
            } else {
                animationState.step = 2;
                animationState.timer = 0;
            }
            break;

        case 2:
            if (animationState.timer < animationState.duration) {
                if (Math.random() < 0.1) createEnergyParticle();
                updateParticles(energyParticles, 'energy');
                updateDescriptionText("Langkah 2: Klorofil di daun menyerap energi cahaya dari matahari.");
            } else {
                energyParticles.forEach(p => scene.remove(p));
                energyParticles.length = 0;
                animationState.step = 3;
                animationState.timer = 0;
            }
            break;

        case 3:
            if (animationState.timer < animationState.duration) {
                if (Math.random() < 0.05) createWaterParticle();
                updateParticles(waterParticles, 'water');
                updateDescriptionText("Langkah 3: Akar pohon menyerap air (H2O) dari dalam tanah.");
            } else {
                waterParticles.forEach(p => { scene.remove(p); if (p.userData.label) p.userData.label.element.remove(); });
                waterParticles.length = 0;
                animationState.step = 4;
                animationState.timer = 0;
            }
            break;

        case 4:
            if (animationState.timer < animationState.duration) {
                if (Math.random() < 0.08) createCO2Particle();
                updateParticles(co2Particles, 'co2');
                updateDescriptionText("Langkah 4: Daun menyerap karbondioksida (CO2) dari udara.");
            } else {
                co2Particles.forEach(p => { scene.remove(p); if (p.userData.label) p.userData.label.element.remove(); });
                co2Particles.length = 0;
                animationState.step = 5;
                animationState.timer = 0;
            }
            break;

        case 5:
            if (animationState.timer < animationState.duration) {
                if (Math.random() < 0.1) createOxygenParticle();
                updateParticles(oxygenParticles, 'oxygen');
                if (!carbohydrateEffect) {
                    carbohydrateEffect = new THREE.Mesh( new THREE.SphereGeometry(0.3, 8, 8), new THREE.MeshBasicMaterial({ color: 0xFFD700, transparent: true, opacity: 0.5 }) );
                    carbohydrateEffect.position.copy(tree.position);
                    scene.add(carbohydrateEffect);
                }
                carbohydrateEffect.material.opacity = Math.sin(animationState.timer * Math.PI / animationState.duration) * 0.5 + 0.2;
                carbohydrateEffect.scale.setScalar(1 + Math.sin(animationState.timer * Math.PI / animationState.duration) * 0.5);
                updateDescriptionText("Langkah 5: Oksigen (O2) dilepaskan ke udara, dan karbohidrat (gula) diserap oleh tumbuhan sebagai energi.");
            } else {
                oxygenParticles.forEach(p => { scene.remove(p); if (p.userData.label) p.userData.label.element.remove(); });
                oxygenParticles.length = 0;
                if (carbohydrateEffect) {
                    scene.remove(carbohydrateEffect);
                    carbohydrateEffect = null;
                }
                animationState.step = 0;
                animationState.timer = 0;
                updateDescriptionText("Proses fotosintesis selesai. Akan mengulang kembali...");
                setTimeout(() => { animationState.step = 1; }, 3000);
            }
            break;

        case 0:
            // Idle state
            break;
    }
}

function createEnergyParticle() {
    const particle = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), new THREE.MeshBasicMaterial({ color: 0xFFD700 }));
    particle.position.set(sunLight.position.x + (Math.random() - 0.5) * 2, sunLight.position.y + (Math.random() - 0.5) * 2, sunLight.position.z + (Math.random() - 0.5) * 2);
    particle.userData.target = new THREE.Vector3(tree.position.x + (Math.random() - 0.5) * 1.5, tree.position.y + 5.5 + (Math.random() - 0.5) * 1.5, tree.position.z + (Math.random() - 0.5) * 1.5);
    particle.userData.speed = 0.05 + Math.random() * 0.05;
    energyParticles.push(particle);
    scene.add(particle);
}

function createWaterParticle() {
    const particle = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 8), new THREE.MeshBasicMaterial({ color: 0x00BFFF }));
    particle.position.set(tree.position.x + (Math.random() - 0.5) * 2, 0.1, tree.position.z + (Math.random() - 0.5) * 2);
    particle.userData.target = new THREE.Vector3(tree.position.x + (Math.random() - 0.5) * 0.5, tree.position.y + (Math.random() * 2), tree.position.z + (Math.random() - 0.5) * 0.5);
    particle.userData.speed = 0.03 + Math.random() * 0.03;
    const div = document.createElement('div');
    div.textContent = 'H₂O';
    div.style.cssText = 'color: #FFFFFF; background-color: #00BFFF; padding: 2px 5px; border-radius: 3px; font-size: 0.8em; opacity: 0.8;';
    const label = new CSS2DObject(div);
    particle.add(label);
    particle.userData.label = label;
    waterParticles.push(particle);
    scene.add(particle);
}

function createCO2Particle() {
    const particle = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), new THREE.MeshBasicMaterial({ color: 0x4F4F4F }));
    particle.position.set((Math.random() - 0.5) * 10, tree.position.y + 5 + (Math.random() - 0.5) * 5, (Math.random() - 0.5) * 10);
    particle.userData.target = new THREE.Vector3(tree.position.x + (Math.random() - 0.5) * 1.5, tree.position.y + 5.5 + (Math.random() - 0.5) * 1.5, tree.position.z + (Math.random() - 0.5) * 1.5);
    particle.userData.speed = 0.04 + Math.random() * 0.04;
    const div = document.createElement('div');
    div.textContent = 'CO₂';
    div.style.cssText = 'color: #FFFFFF; background-color: #4F4F4F; padding: 2px 5px; border-radius: 3px; font-size: 0.8em; opacity: 0.8;';
    const label = new CSS2DObject(div);
    particle.add(label);
    particle.userData.label = label;
    co2Particles.push(particle);
    scene.add(particle);
}

function createOxygenParticle() {
    const particle = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), new THREE.MeshBasicMaterial({ color: 0x32CD32 }));
    particle.position.set(tree.position.x + (Math.random() - 0.5) * 1, tree.position.y + 5.5 + (Math.random() - 0.5) * 1, tree.position.z + (Math.random() - 0.5) * 1);
    particle.userData.target = new THREE.Vector3(particle.position.x + (Math.random() - 0.5) * 5, particle.position.y + 5 + Math.random() * 5, particle.position.z + (Math.random() - 0.5) * 5);
    particle.userData.speed = 0.06 + Math.random() * 0.06;
    particle.userData.maxDistance = 10;
    const div = document.createElement('div');
    div.textContent = 'O₂';
    div.style.cssText = 'color: #FFFFFF; background-color: #32CD32; padding: 2px 5px; border-radius: 3px; font-size: 0.8em; opacity: 0.8;';
    const label = new CSS2DObject(div);
    particle.add(label);
    particle.userData.label = label;
    oxygenParticles.push(particle);
    scene.add(particle);
}

function updateParticles(particlesArray, type) {
    for (let i = particlesArray.length - 1; i >= 0; i--) {
        const p = particlesArray[i];
        if (p.userData.target) {
            const direction = p.userData.target.clone().sub(p.position).normalize();
            p.position.add(direction.multiplyScalar(p.userData.speed));
            if (p.position.distanceTo(p.userData.target) < 0.2 || (type === 'oxygen' && p.position.distanceTo(tree.position) > p.userData.maxDistance)) {
                scene.remove(p);
                if (p.userData.label) p.userData.label.element.remove();
                particlesArray.splice(i, 1);
            }
        }
    }
}