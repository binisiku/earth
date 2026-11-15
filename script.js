// 1. SCENE, CAMERA & RENDERER SETUP
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

renderer.domElement.style.position = 'fixed';
renderer.domElement.style.top = '0';
renderer.domElement.style.left = '0';
renderer.domElement.style.zIndex = '0';
document.body.appendChild(renderer.domElement);

// 2. MOUSE ORBIT CONTROLS
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 6;
controls.maxDistance = 25;

// 3. REAL NASA SATELLITE EARTH TEXTURES
const textureLoader = new THREE.TextureLoader();
textureLoader.setCrossOrigin('anonymous');

const earthMap = textureLoader.load('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg');
const earthBump = textureLoader.load('https://unpkg.com/three-globe/example/img/earth-topology.png');
const cloudMap = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/r128/examples/textures/planets/earth_clouds_1024.png');

const earthGeometry = new THREE.SphereGeometry(4, 64, 64);
const earthMaterial = new THREE.MeshPhongMaterial({
    map: earthMap,
    bumpMap: earthBump,
    bumpScale: 0.08,
    shininess: 15
});
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

// 4. REAL CLOUD LAYER
const cloudGeometry = new THREE.SphereGeometry(4.05, 64, 64);
const cloudMaterial = new THREE.MeshPhongMaterial({
    map: cloudMap,
    transparent: true,
    opacity: 0.4,
    depthWrite: false
});
const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
scene.add(clouds);

// 5. ATMOSPHERIC GLOW
const atmosphereGeometry = new THREE.SphereGeometry(4.18, 64, 64);
const atmosphereMaterial = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.12,
    side: THREE.BackSide
});
const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
scene.add(atmosphere);

// 6. STARRY GALAXY BACKGROUND
const starGeometry = new THREE.BufferGeometry();
const starCount = 4000;
const starPositions = new Float32Array(starCount * 3);
for (let i = 0; i < starCount * 3; i++) {
    starPositions[i] = (Math.random() - 0.5) * 2000;
}
starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 1.5, opacity: 0.8, transparent: true });
const starField = new THREE.Points(starGeometry, starMaterial);
scene.add(starField);

// 7. LIGHTING
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(0xffffff, 1.8);
sunLight.position.set(15, 10, 15);
scene.add(sunLight);

camera.position.z = 13;

// 8. POPULATE WORLDWIDE EVENTS FEED
const worldFeed = document.getElementById('world-feed');
if (worldFeed) {
    const mockEvents = [
        "🌍 Tokyo: Cherry Blossom Festival preparations underway.",
        "🌋 Iceland: Seismic activity stable near Reykjanes peninsula.",
        "🏔️ Kathmandu: Mountaineering expedition season opening.",
        "🏛️ Paris: Spring cultural heritage week announced.",
        "🌊 Sydney: Coastal tidal monitoring telemetry nominal."
    ];

    mockEvents.forEach(event => {
        const div = document.createElement('div');
        div.className = 'feed-item';
        div.textContent = event;
        worldFeed.appendChild(div);
    });
}

// 9. DYNAMIC SEARCH LOGIC
const searchInput = document.getElementById('country-search');
const locationName = document.getElementById('location-name');
const eventDescription = document.getElementById('event-description');
const happeningNow = document.getElementById('happening-now');

if (searchInput) {
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query) {
                const formattedQuery = query.charAt(0).toUpperCase() + query.slice(1);
                if (locationName) locationName.textContent = formattedQuery;
                if (eventDescription) eventDescription.textContent = `Live intelligence feed locked onto ${formattedQuery}. Tracking local weather streams, regional safety indices, and upcoming cultural events.`;
                if (happeningNow) happeningNow.innerHTML = `<div style="font-size: 0.85rem; color: #38bdf8; font-weight: 600;">⚡ Status: Active telemetry streaming for ${formattedQuery}.</div>`;
            }
        }
    });
}

// 10. ANIMATION LOOP
function animate() {
    requestAnimationFrame(animate);

    earth.rotation.y += 0.001;
    clouds.rotation.y += 0.0012;
    starField.rotation.y += 0.0001;

    controls.update();
    renderer.render(scene, camera);
}

animate();

// 11. RESIZE HANDLER
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
