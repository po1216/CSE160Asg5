import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'; 
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

// Custom 3D object sources:
// Fiddle-leaf Plant by Poly by Google [CC-BY] via Poly Pizza
// Low Poly Pug Standing by Jordan Diamante (djiordhan) [CC-BY] via Poly Pizza
// Plants - Assorted shelf plants by Jakers_H [CC-BY] via Poly Pizza
// Wood Floor by Quaternius via Poly Pizza
// Normal Wall by Quaternius via Poly Pizza
// Desk by dook [CC-BY] via Poly Pizza

class ColorGUIHelper {
    constructor(object, prop) {
        this.object = object;
        this.prop = prop;
    }
    get value() {
        return `#${this.object[this.prop].getHexString()}`;
    }
    set value(hexString) {
        this.object[this.prop].set(hexString);
    }
}

function main() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({antialias: true, canvas});
    renderer.setSize(window.innerWidth, window.innerHeight);

    let camera;
    makeCamera();

    const scene = new THREE.Scene();

    makeLight();

    function makeCamera() {
        const fov = 75;
        const aspect = window.innerWidth / window.innerHeight
        const near = 0.1;
        const far = 1000;
        camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        camera.position.set(0, 1.3, 3);

        const controls = new OrbitControls(camera, canvas);
        controls.target.set(0, 0, 0);
        controls.update();
    }

    function makeLight() {
        let color = 0xf3e8a0;
        let intensity = 3;
        const dirLight = new THREE.DirectionalLight(color, intensity);
        dirLight.position.set(1, 2, 4);
        scene.add(dirLight);

        color = 0xbf9888;
        intensity = 1;
        const ambLight = new THREE.AmbientLight(color, intensity);
        scene.add(ambLight)

        const skyColor = 0xb1e1ff;
        const groundColor = 0xb97a20;
        const hemisphereLight = new THREE.HemisphereLight(skyColor, groundColor, intensity);
        scene.add(hemisphereLight);

        const gui = new GUI();
        gui.addColor(new ColorGUIHelper(dirLight, 'color'), 'value').name('Directional Light Color');
        gui.add(dirLight, 'intensity', 0, 5, 0.01).name('Directional Light Intensity');
        gui.addColor(new ColorGUIHelper(ambLight, 'color'), 'value').name('Ambient Light Color');
        gui.add(ambLight, 'intensity', 0, 5, 0.01).name('Ambient Light Intensity');
    }

    
    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    const loader = new THREE.TextureLoader();
    const texture = loader.load('textures/rbx.png');
    texture.colorSpace = THREE.SRGBColorSpace;

    const diamondGeometry = new THREE.OctahedronGeometry();
    const diamondMaterial = new THREE.MeshPhongMaterial( {
        color: 0x0cd52d,
        transparent: true,
        opacity: 0.8,
        specular: 0xffffff
    });
    const diamond = new THREE.Mesh(diamondGeometry, diamondMaterial);
    diamond.scale.set(0.1, 0.2, 0.1);
    diamond.position.set(0.1, 0.9, 0.05);
    scene.add(diamond);

    function makeInstance(geometry, color, x) {
        const material = new THREE.MeshPhongMaterial({color});
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        cube.position.x = x;
        
        return cube;
    }

    function makeRubics(geometry, texture) {
        const material = new THREE.MeshPhongMaterial({
            map: texture
        });
        const cube = new THREE.Mesh(geometry, material);
        cube.scale.set(0.2, 0.2, 0.2);
        cube.position.set(1, 0.2, 1);
        scene.add(cube);

        return cube;
    }

    // const cubes = [
    //     //makeRubics(boxGeometry, texture, 0),
    //     //makeInstance(boxGeometry, 0x8844aa, -2),
    //     //makeInstance(boxGeometry, 0xaa8844, 2)
    // ];

    makeRubics(boxGeometry, texture);

    {
        const loader = new THREE.TextureLoader();
        const texture = loader.load('textures/autumn_field_2k.jpg', () => {
            texture.mapping = THREE.EquirectangularReflectionMapping;
            texture.colorSpace = THREE.SRGBColorSpace;
            scene.background = texture;
        });
    }

    function loadCustomObjects() {
        const gltfLoader = new GLTFLoader();
        { // wood floor
            let floor;
            gltfLoader.load('objects/WoodFloor.glb', function(gltf) {
                floor = gltf.scene;
                floor.scale.set(0.4, 0.4, 0.4);
                floor.position.set(1, -0.02, -0.5);
                scene.add(floor);
                let floor1 = floor.clone();
                floor1.position.set(-0.6, -0.02, -0.5);
                scene.add(floor1);
                let floor2 = floor.clone();
                floor2.position.set(1, -0.02, 0.7);
                scene.add(floor2);
                let floor3 = floor.clone();
                floor3.position.set(-0.6, -0.02, 0.7);
                scene.add(floor3);
                let floor4 = floor.clone();
                floor4.position.set(2.4, -0.02, -0.5);
                scene.add(floor4);
                let floor5 = floor.clone();
                floor5.position.set(2.4, -0.02, 0.7);
                scene.add(floor5);
            });
        }

        {   // wall
            let wall;
            gltfLoader.load('objects/wall.glb', function(gltf) {
                wall = gltf.scene;
                wall.scale.set(0.4, 0.4, 0.4);
                wall.position.set(1, -0.02, -0.5);
                scene.add(wall);
                let wall1 = wall.clone();
                wall1.position.set(-0.6, -0.02, -0.5);
                scene.add(wall1);
                let wall2 = wall.clone();
                wall2.rotation.y = Math.PI/2;
                wall2.position.set(-0.62, -0.02, -0.5);
                scene.add(wall2);
                let wall3 = wall2.clone();
                wall3.position.set(-0.62, -0.02, 0.7);
                scene.add(wall3);
                let wall4 = wall.clone();
                wall4.position.set(2.4, -0.02, -0.5);
                scene.add(wall4);
            });
        }

        {   // table
            let desk;
            gltfLoader.load('objects/Desk.glb', function(gltf) {
                desk = gltf.scene;
                desk.scale.set(0.8, 0.8, 0.8);
                desk.position.set(5, 0, -1.5);
                desk.rotation.y = Math.PI/2;
                scene.add(desk);
            });

        }

        { // dog
            const dogMTL = new MTLLoader();
            dogMTL.load('objects/pug.mtl', (mtl) => {
                mtl.preload();
                const dog = new OBJLoader();
                dog.setMaterials(mtl);
                dog.load('objects/pug.obj', (root) => {
                    root.scale.set(0.08, 0.08, 0.08);
                    root.rotation.y = 180;
                    root.position.x = 0;
                    scene.add(root);
                });
            });
        }
        { // plant
            let plant;
            gltfLoader.load('objects/Fiddle-leaf Plant.glb', function(gltf) {
                plant = gltf.scene;
                plant.scale.set(0.13, 0.13, 0.13);
                plant.position.set(-1.0, 0, -0.7);
                scene.add(plant);
            });
        }
        { // plant Shelf
            const plantShelfMTL = new MTLLoader();
            plantShelfMTL.load('objects/plantShelf.mtl', (mtl) => {
                mtl.preload();
                const plantShelf = new OBJLoader();
                plantShelf.setMaterials(mtl);
                plantShelf.load('objects/plantShelf.obj', (root) => {
                    root.scale.set(0.9, 0.9, 0.9);
                    root.position.set(-0.6, 0.9, -1.1);
                    scene.add(root);
                });
            });
        }
    }

    loadCustomObjects();

    function render(time) {
        diamond.rotation.y = time / 900;
        time *= 0.001; // conver time to seconds


        // cubes.forEach( ( cube, ndx ) => {
        //     const speed = 1 + ndx * 0.1;
        //     const rot = time * speed;
        //     cube.rotation.x = rot;
        //     cube.rotation.y = rot;
        // } );
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);

    window.addEventListener('resize', function() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }); 
}

main();