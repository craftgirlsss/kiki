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

const animationState = {
    step: 0,
    timer: 0,
    duration: 3
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

    // --- Objek 3D Dasar ---

    // Tanah
    const groundGeometry = new THREE.PlaneGeometry(50, 50);
    const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Pohon Utama (tempat fotosintesis terjadi)
    tree = createSimpleTree(); // Menggunakan fungsi baru
    tree.position.set(0, 0, 0); // Posisikan pohon utama di tengah
    scene.add(tree);

    // Menambahkan Pohon-pohon Tambahan
    addForestTrees(20); // Tambahkan 15 pohon lain

    // Event Listener untuk resize window
    window.addEventListener('resize', onWindowResize);

    // Mulai animasi fotosintesis setelah beberapa detik
    setTimeout(() => {
        animationState.step = 1;
    }, 2000);
}

// Fungsi yang sekarang mengembalikan group pohon
function createSimpleTree() {
    const treeGroup = new THREE.Group();

    // Batang pohon
    const trunkHeight = 3 + Math.random() * 3; // Tinggi batang bervariasi
    const trunkRadiusBottom = 0.5 + Math.random() * 0.2;
    const trunkRadiusTop = trunkRadiusBottom * (0.5 + Math.random() * 0.3);

    const trunkGeometry = new THREE.CylinderGeometry(trunkRadiusTop, trunkRadiusBottom, trunkHeight, 8);
    const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x654321 });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = trunkHeight / 2;
    trunk.castShadow = true;
    treeGroup.add(trunk);

    // Daun pohon (sederhana, bola)
    const leavesRadius = 1.5 + Math.random() * 1.5; // Ukuran daun bervariasi
    const leavesGeometry = new THREE.SphereGeometry(leavesRadius, 16, 16);
    const leavesMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 });
    const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
    leaves.position.y = trunkHeight + (leavesRadius * 0.5); // Posisikan daun di atas batang
    leaves.castShadow = true;
    treeGroup.add(leaves);

    return treeGroup; // Mengembalikan grup pohon
}

function addForestTrees(count) {
    for (let i = 0; i < count; i++) {
        const forestTree = createSimpleTree();

        // Posisikan pohon secara acak, hindari area tengah pohon utama
        const x = (Math.random() - 0.5) * 40; // Rentang -20 hingga 20
        const z = (Math.random() - 0.5) * 40; // Rentang -20 hingga 20

        // Pastikan pohon tidak terlalu dekat dengan pohon utama
        if (Math.abs(x) < 5 && Math.abs(z) < 5) {
            i--; // Ulangi iterasi ini jika terlalu dekat
            continue;
        }

        forestTree.position.set(x, 0, z); // Y = 0 karena pohon sudah memiliki posisi y batang
        scene.add(forestTree);
        forestTrees.push(forestTree); // Simpan referensi jika perlu di masa depan
    }
}


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    const delta = 1 / 60;

    // Update animasi berdasarkan langkah fotosintesis
    updateFotosintesisAnimation(delta);

    controls.update();
    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
}

function updateFotosintesisAnimation(delta) {
    animationState.timer += delta;

    switch (animationState.step) {
        case 1: // Tumbuhan terkena sinar matahari
            if (animationState.timer < animationState.duration) {
                // Perubahan warna daun hanya pada pohon utama
                if (tree && tree.children[1]) {
                    const initialColor = new THREE.Color(0x228B22);
                    const brightColor = new THREE.Color(0x90EE90);
                    tree.children[1].material.color.lerpColors(initialColor, brightColor, animationState.timer / animationState.duration);
                }
            } else {
                animationState.step = 2;
                animationState.timer = 0;
                console.log("Langkah 1: Tumbuhan terkena sinar matahari");
            }
            break;

        case 2: // Klorofil pada daun menyerap energi dari sinar matahari
            if (animationState.timer < animationState.duration) {
                if (Math.random() < 0.1) {
                    createEnergyParticle();
                }
                updateParticles(energyParticles, 'energy');
            } else {
                energyParticles.forEach(p => scene.remove(p));
                energyParticles = [];
                animationState.step = 3;
                animationState.timer = 0;
                console.log("Langkah 2: Klorofil menyerap energi");
            }
            break;

        case 3: // Akar menyerap air dalam tanah
            if (animationState.timer < animationState.duration) {
                if (Math.random() < 0.05) {
                    createWaterParticle();
                }
                updateParticles(waterParticles, 'water');
            } else {
                waterParticles.forEach(p => {
                    scene.remove(p);
                    if (p.userData.label) {
                        p.userData.label.element.remove();
                        p.userData.label = null;
                    }
                });
                waterParticles = [];
                animationState.step = 4;
                animationState.timer = 0;
                console.log("Langkah 3: Akar menyerap air");
            }
            break;

        case 4: // Daun menyerap karbondioksida pada udara
            if (animationState.timer < animationState.duration) {
                if (Math.random() < 0.08) {
                    createCO2Particle();
                }
                updateParticles(co2Particles, 'co2');
            } else {
                co2Particles.forEach(p => {
                    scene.remove(p);
                    if (p.userData.label) {
                        p.userData.label.element.remove();
                        p.userData.label = null;
                    }
                });
                co2Particles = [];
                animationState.step = 5;
                animationState.timer = 0;
                console.log("Langkah 4: Daun menyerap CO2");
            }
            break;

        case 5: // Oksigen dilepaskan ke udara dan karbohidrat diserap oleh tumbuhan
            if (animationState.timer < animationState.duration) {
                if (Math.random() < 0.1) {
                    createOxygenParticle();
                }
                updateParticles(oxygenParticles, 'oxygen');

                if (!carbohydrateEffect) {
                    carbohydrateEffect = new THREE.Mesh(
                        new THREE.SphereGeometry(0.3, 8, 8),
                        new THREE.MeshBasicMaterial({ color: 0xFFD700, transparent: true, opacity: 0.5 })
                    );
                    carbohydrateEffect.position.copy(tree.position);
                    scene.add(carbohydrateEffect);
                }
                carbohydrateEffect.material.opacity = Math.sin(animationState.timer * Math.PI / animationState.duration) * 0.5 + 0.2;
                carbohydrateEffect.scale.setScalar(1 + Math.sin(animationState.timer * Math.PI / animationState.duration) * 0.5);

            } else {
                oxygenParticles.forEach(p => {
                    scene.remove(p);
                    if (p.userData.label) {
                        p.userData.label.element.remove();
                        p.userData.label = null;
                    }
                });
                oxygenParticles = [];
                if (carbohydrateEffect) {
                    scene.remove(carbohydrateEffect);
                    carbohydrateEffect = null;
                }
                animationState.step = 0;
                animationState.timer = 0;
                console.log("Langkah 5: Oksigen dilepaskan & Karbohidrat diserap");

                setTimeout(() => {
                    animationState.step = 1;
                }, 3000);
            }
            break;

        case 0:
            break;
    }
}

// --- Fungsi untuk membuat dan mengupdate partikel ---

function createEnergyParticle() {
    const geometry = new THREE.SphereGeometry(0.08, 8, 8);
    const material = new THREE.MeshBasicMaterial({ color: 0xFFD700 });
    const particle = new THREE.Mesh(geometry, material);

    particle.position.set(
        sunLight.position.x + (Math.random() - 0.5) * 2,
        sunLight.position.y + (Math.random() - 0.5) * 2,
        sunLight.position.z + (Math.random() - 0.5) * 2
    );

    particle.userData.target = new THREE.Vector3(
        tree.position.x + (Math.random() - 0.5) * 1.5,
        tree.position.y + 5.5 + (Math.random() - 0.5) * 1.5,
        tree.position.z + (Math.random() - 0.5) * 1.5
    );
    particle.userData.speed = 0.05 + Math.random() * 0.05;
    energyParticles.push(particle);
    scene.add(particle);
}

function createWaterParticle() {
    const geometry = new THREE.SphereGeometry(0.15, 8, 8);
    const material = new THREE.MeshBasicMaterial({ color: 0x00BFFF });
    const particle = new THREE.Mesh(geometry, material);

    particle.position.set(
        tree.position.x + (Math.random() - 0.5) * 2,
        0.1,
        tree.position.z + (Math.random() - 0.5) * 2
    );

    particle.userData.target = new THREE.Vector3(
        tree.position.x + (Math.random() - 0.5) * 0.5,
        tree.position.y + (Math.random() * 2),
        tree.position.z + (Math.random() - 0.5) * 0.5
    );
    particle.userData.speed = 0.03 + Math.random() * 0.03;

    const waterDiv = document.createElement('div');
    waterDiv.className = 'label';
    waterDiv.textContent = 'Air';
    waterDiv.style.color = '#FFFFFF';
    waterDiv.style.backgroundColor = '#00BFFF';
    waterDiv.style.padding = '2px 5px';
    waterDiv.style.borderRadius = '3px';
    waterDiv.style.fontSize = '0.8em';
    waterDiv.style.opacity = '0.8';

    const waterLabel = new CSS2DObject(waterDiv);
    particle.add(waterLabel);
    particle.userData.label = waterLabel;

    waterParticles.push(particle);
    scene.add(particle);
}

function createCO2Particle() {
    const geometry = new THREE.SphereGeometry(0.18, 8, 8);
    const material = new THREE.MeshBasicMaterial({ color: 0x4F4F4F });
    const particle = new THREE.Mesh(geometry, material);

    particle.position.set(
        (Math.random() - 0.5) * 10,
        tree.position.y + 5 + (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 10
    );

    particle.userData.target = new THREE.Vector3(
        tree.position.x + (Math.random() - 0.5) * 1.5,
        tree.position.y + 5.5 + (Math.random() - 0.5) * 1.5,
        tree.position.z + (Math.random() - 0.5) * 1.5
    );
    particle.userData.speed = 0.04 + Math.random() * 0.04;

    const co2Div = document.createElement('div');
    co2Div.className = 'label';
    co2Div.textContent = 'CO2';
    co2Div.style.color = '#FFFFFF';
    co2Div.style.backgroundColor = '#4F4F4F';
    co2Div.style.padding = '2px 5px';
    co2Div.style.borderRadius = '3px';
    co2Div.style.fontSize = '0.8em';
    co2Div.style.opacity = '0.8';

    const co2Label = new CSS2DObject(co2Div);
    particle.add(co2Label);
    particle.userData.label = co2Label;

    co2Particles.push(particle);
    scene.add(particle);
}

function createOxygenParticle() {
    const geometry = new THREE.SphereGeometry(0.12, 8, 8);
    const material = new THREE.MeshBasicMaterial({ color: 0x32CD32 });
    const particle = new THREE.Mesh(geometry, material);

    particle.position.set(
        tree.position.x + (Math.random() - 0.5) * 1,
        tree.position.y + 5.5 + (Math.random() - 0.5) * 1,
        tree.position.z + (Math.random() - 0.5) * 1
    );

    particle.userData.target = new THREE.Vector3(
        particle.position.x + (Math.random() - 0.5) * 5,
        particle.position.y + 5 + Math.random() * 5,
        particle.position.z + (Math.random() - 0.5) * 5
    );
    particle.userData.speed = 0.06 + Math.random() * 0.06;
    particle.userData.maxDistance = 10;

    const oxygenDiv = document.createElement('div');
    oxygenDiv.className = 'label';
    oxygenDiv.textContent = 'Oksigen';
    oxygenDiv.style.color = '#FFFFFF';
    oxygenDiv.style.backgroundColor = '#32CD32';
    oxygenDiv.style.padding = '2px 5px';
    oxygenDiv.style.borderRadius = '3px';
    oxygenDiv.style.fontSize = '0.8em';
    oxygenDiv.style.opacity = '0.8';

    const oxygenLabel = new CSS2DObject(oxygenDiv);
    particle.add(oxygenLabel);
    particle.userData.label = oxygenLabel;

    oxygenParticles.push(particle);
    scene.add(particle);
}


function updateParticles(particlesArray, type) {
    for (let i = particlesArray.length - 1; i >= 0; i--) {
        const p = particlesArray[i];

        if (p.userData.target) {
            const direction = p.userData.target.clone().sub(p.position).normalize();
            p.position.add(direction.multiplyScalar(p.userData.speed));

            // Hapus partikel jika sudah dekat target atau terlalu jauh
            if (p.position.distanceTo(p.userData.target) < 0.1 || (type === 'oxygen' && p.position.distanceTo(tree.position) > p.userData.maxDistance)) {
                scene.remove(p);
                // Hapus juga labelnya dari DOM
                if (p.userData.label) {
                    p.userData.label.element.remove();
                    p.userData.label = null;
                }
                particlesArray.splice(i, 1);
            }
        }
    }
}