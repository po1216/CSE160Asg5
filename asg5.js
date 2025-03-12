import * as THREE from 'three';
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
// Simple soccer football by Smirnoff Alexander [CC-BY] via Poly Pizza
// Wooden Wall by Quaternius
// Oriental rug by jeremy [CC-BY] via Poly Pizza
// Chick by Poly by Google [CC-BY] via Poly Pizza
// Toy train by Jair Trejo [CC-BY] via Poly Pizza
// Tennis Ball by Zer0_Time [CC-BY] via Poly Pizza
// Wall Art 02 by Jarlan Perez [CC-BY] via Poly Pizza


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
    renderer.shadowMap.enabled = true;

    let camera;
    makeCamera();

    const scene = new THREE.Scene();
    const fogOn = {
        bool: false,
    }
    let fogNear = 0.1;
    let fogFar = 0;
    let fogColor = 'lightblue';
    scene.fog = new THREE.Fog(fogColor, fogNear, fogFar);
    scene.background = new THREE.Color(fogColor);

    const planeGeometry = new THREE.PlaneGeometry(100, 20);
    const planeMaterial = new THREE.ShadowMaterial();
    planeMaterial.opacity = 0.5;
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotateX(-Math.PI/2);
    plane.position.y = 0.03;
    plane.receiveShadow = true;
    scene.add(plane);

    function makeCamera() {
        const fov = 75;
        const aspect = window.innerWidth / window.innerHeight
        const near = 0.1;
        const far = 1000;
        camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        camera.position.set(0.3, 1.3, 4.5);

        const controls = new OrbitControls(camera, canvas);
        controls.target.set(0, 0, 0);
        controls.update();
    }

    
    let color = 0xf3e8a0;
    let intensity = 3;
    const dirLight = new THREE.DirectionalLight(color, intensity);
    dirLight.castShadow = true;
    dirLight.position.set(1, 2, 3);
    scene.add(dirLight);

    color = 0xbf9888;
    intensity = 1;
    const ambLight = new THREE.AmbientLight(color, intensity);
    scene.add(ambLight)

    const skyColor = 0xb1e1ff;
    const groundColor = 0xb97a20;
    const hemisphereLight = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    scene.add(hemisphereLight);

    // lamp light
    const pointLight = new THREE.PointLight(0xfff5b8, 2);
    pointLight.position.set(0.5, 1.55, 0.0);
    scene.add(pointLight);

    const gui = new GUI();
    const lightColor = gui.addFolder('Light Color');
    lightColor.addColor(new ColorGUIHelper(dirLight, 'color'), 'value').name('Directional Light Color');
    lightColor.add(dirLight, 'intensity', 0, 5, 0.01).name('Directional Light Intensity');
    lightColor.addColor(new ColorGUIHelper(ambLight, 'color'), 'value').name('Ambient Light Color');
    lightColor.add(ambLight, 'intensity', 0, 5, 0.01).name('Ambient Light Intensity');
    lightColor.addColor(new ColorGUIHelper(hemisphereLight, 'color'), 'value').name('Hemisphere Light Color(sky)');
    lightColor.addColor(new ColorGUIHelper(hemisphereLight, 'groundColor'), 'value').name('Hemisphere Light Color(ground)');
    
    const checkBox = gui.add(fogOn, 'bool').name('Fog');
    checkBox.onChange((value) => {
        if(value) {
            scene.fog.far = 8;
        } else {
            scene.fog.far = 0;
        }
    })

    // Rubik's cube
    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    const loader = new THREE.TextureLoader();
    const texture = loader.load('textures/rbx.png');
    texture.colorSpace = THREE.SRGBColorSpace;
    const boxMaterial = new THREE.MeshPhongMaterial({
        wireframe: false,
        map: texture
    });
    const cube = new THREE.Mesh(boxGeometry, boxMaterial);
    cube.castShadow = true;
    cube.receiveShadow = true;
    cube.scale.set(0.2, 0.2, 0.2);
    cube.position.set(1, 0.13, 1);
    scene.add(cube);

    let sofaW = 10, sofaH = 1, sofaD = 5;
    const sofaGeometry = new THREE.BoxGeometry(sofaW, sofaH, sofaD);
    const sofaBaseMaterial = new THREE.MeshPhongMaterial({
        wireframe: false,
        color: 0x604d3d
    })
    const sofaMaterial = new THREE.MeshPhongMaterial({
        wireframe: false,
        color: 0x4a663f
    });
    let sofaBase = new THREE.Mesh(sofaGeometry, sofaBaseMaterial);
    sofaBase.scale.set(0.15, 0.10, 0.15);
    sofaBase.rotation.y = Math.PI/2;
    sofaBase.position.set(-1, 0.2, 0.65);
    scene.add(sofaBase);
    let sofa = new THREE.Mesh(sofaGeometry, sofaMaterial);
    sofa.castShadow = true;
    sofa.receiveShadow = true;
    sofa.scale.set(0.15, 0.10, 0.15);
    sofa.rotation.y = Math.PI/2;
    sofa.position.set(-1, 0.3, 0.65);
    scene.add(sofa);
    let sofaBack = sofa.clone();
    sofaBack.scale.set(0.15, 0.3, 0.03);
    sofaBack.position.set(-1.27, 0.57, 0.65);
    scene.add(sofaBack);
    let armRest1 = sofa.clone();
    armRest1.scale.set(0.02, 0.22, 0.15);
    armRest1.position.set(-1, 0.45, 1.3);
    scene.add(armRest1);
    let armRest2 = armRest1.clone();
    armRest2.position.set(-1, 0.45, 0);
    scene.add(armRest2);
    let sofa1 = sofa.clone();
    sofa1.scale.set(0.07, 0.08, 0.15);
    sofa1.position.set(-1, 0.38, 1);
    scene.add(sofa1);
    let sofa2 = sofa1.clone();
    sofa2.position.set(-1, 0.38, 0.35);
    scene.add(sofa2);


    const cylinderGeometry = new THREE.CylinderGeometry(1.0, 1.0, 8, 10);
    let cylinderMaterial = new THREE.MeshPhongMaterial( {
        wireframe: false,
        color: 0x473b29
    });
    const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    cylinder.castShadow = true;
    cylinder.receiveShadow = true;
    cylinder.scale.set(0.02, 0.02, 0.02);
    cylinder.position.set(0.5, 2.15, 0.0);
    scene.add(cylinder);
    cylinderMaterial.color.setHex(0x604d3d);
    let sofaLeg = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    sofaLeg.castShadow = true;
    sofaLeg.receiveShadow = true;
    sofaLeg.scale.set(0.03, 0.03, 0.03);
    sofaLeg.position.set(-1.22, 0.1, 1.35);
    scene.add(sofaLeg);
    let sofaLeg1 = sofaLeg.clone();
    sofaLeg1.position.set(-0.68, 0.1, 1.35);
    scene.add(sofaLeg1);
    let sofaLeg2 = sofaLeg.clone();
    sofaLeg2.position.set(-1.22, 0.1, 0);
    scene.add(sofaLeg2);
    let sofaLeg3 = sofaLeg.clone();
    sofaLeg3.position.set(-0.68, 0.1, 0);
    scene.add(sofaLeg3);

    const coneGeometry = new THREE.ConeGeometry(6, 7, 16);
    const coneMaterial = new THREE.MeshPhongMaterial( {
        wireframe: false,
        color: 0x473b29
    });
    const cone = new THREE.Mesh(coneGeometry, coneMaterial);
    cone.castShadow = true;
    cone.receiveShadow = true;
    cone.scale.set(0.04, 0.04, 0.04);
    cone.position.set(0.5, 2.0, 0.0);
    scene.add(cone);
    const toyGeometry = new THREE.DodecahedronGeometry(2.5);
    const toy = new THREE.Mesh(toyGeometry, coneMaterial);
    toy.castShadow = true;
    toy.receiveShadow = true;
    toy.scale.set(0.05, 0.05, 0.05);
    toy.position.set(2.6, 0.15, 1.15);
    scene.add(toy);
    let cone1 = cone.clone();
    cone1.material.color.setHex(0xe7e7e7);
    cone1.scale.set(0.015, 0.035, 0.015);
    cone1.position.set(2.8, 0.15, 1.18);
    scene.add(cone1);

    const sphereGeometry = new THREE.SphereGeometry(1.1, 15, 15);
    const sphereMaterial = new THREE.MeshPhongMaterial( {
        wireframe: false,
        color: 0xf3e8a0
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.scale.set(0.1, 0.1, 0.1);
    sphere.position.set(0.5, 1.87, 0.0);
    scene.add(sphere);

    const diamondGeometry = new THREE.OctahedronGeometry();
    const diamondMaterial = new THREE.MeshPhongMaterial( {
        color: 0x0cd52d,
        transparent: true,
        opacity: 0.8,
        specular: 0xffffff,
        wireframe: false,
    });
    const diamond = new THREE.Mesh(diamondGeometry, diamondMaterial);
    diamond.scale.set(0.1, 0.2, 0.1);
    diamond.position.set(0.1, 0.9, 0.05);
    scene.add(diamond);

    const rtWidth = 512;
    const rtHeight = 512;
    const renderTarget = new THREE.WebGLRenderTarget(rtWidth, rtHeight);

    const rtFov = 55;
    const rtAspect = rtWidth / rtHeight;
    const rtNear = 0.1;
    const rtFar = 5;
    const rtCamera = new THREE.PerspectiveCamera(rtFov, rtAspect, rtNear, rtFar);
    rtCamera.position.set(0.15, 0.5, 2);

    const rtScene = new THREE.Scene();
    rtScene.background = new THREE.Color('white');
    let diamond1 = diamond.clone();
    diamond1.scale.set(0.1, 0.35, 0.1);
    diamond1.position.set(0.2, 0.5, 1.0);
    rtScene.add(diamond1);

    {
        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        rtScene.add(light);
      }

    const planeGeometry1 = new THREE.PlaneGeometry(5, 5);
    const planeMaterial1 = new THREE.MeshPhongMaterial( {
        map: renderTarget.texture,
        // color: 0xffffff
    });
    const plane1 = new THREE.Mesh(planeGeometry1, planeMaterial1);
    plane1.castShadow = true;
    plane1.receiveShadow = true;
    plane1.scale.set(0.25, 0.17, 0.17)
    plane1.position.set(2.5, 1.1, -1.23);
    scene.add(plane1);

    const option = {
        wireframe: false
    }
    const checkBox1 = gui.add(option, 'wireframe').name('Wireframe');
    checkBox1.onChange(() => {
        boxMaterial.wireframe = option.wireframe;
        diamondMaterial.wireframe = option.wireframe;
        sphereMaterial.wireframe = option.wireframe;
        cylinderMaterial.wireframe = option.wireframe;
        coneMaterial.wireframe = option.wireframe;
        sofaMaterial.wireframe = option.wireframe;
        sofaBaseMaterial.wireframe = option.wireframe;
    });

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
            gltfLoader.load('objects/woodFloor.glb', function(gltf) {
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
                wall.traverse(function(obj) {
                    if(obj.isMesh) {
                        obj.castShadow = true;
                        obj.receiveShadow = true;
                    }
                });
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

        { // wall art
            let wallArt;
            gltfLoader.load('objects/wallArt.glb', function(gltf) {
                wallArt = gltf.scene;
                wallArt.traverse(function(obj) {
                    if(obj.isMesh) {
                        obj.castShadow = true;
                        obj.receiveShadow = true;
                    }
                });
                wallArt.scale.set(1.0, 0.7, 1.0);
                wallArt.rotation.y = -Math.PI/2;
                wallArt.position.set(-1.35, 1.1, 0.7);
                scene.add(wallArt);
            });

        }

        {   // table
            let desk;
            gltfLoader.load('objects/desk.glb', function(gltf) {
                desk = gltf.scene;
                desk.traverse(function(obj) {
                    if(obj.isMesh) {
                        obj.castShadow = true;
                        obj.receiveShadow = true;
                    }
                });
                desk.scale.set(0.8, 0.8, 0.8);
                desk.position.set(5, 0, -1.5);
                desk.rotation.y = Math.PI/2;
                scene.add(desk);
            });
        }

        { // dog
            let dog;
            gltfLoader.load('objects/pug.glb', function(gltf) {
                dog = gltf.scene;
                dog.traverse(function(obj) {
                    if(obj.isMesh) {
                        obj.castShadow = true;
                        obj.receiveShadow = true;
                    }
                });
                dog.scale.set(0.08, 0.08, 0.08);
                dog.rotation.y = 180;
                scene.add(dog);

            });
        }

        { // plant
            let plant;
            gltfLoader.load('objects/pottedPlant.glb', function(gltf) {
                gltf.scene.traverse(function(obj) {
                    if(obj.isMesh) {
                        obj.castShadow = true;
                        obj.receiveShadow = true;
                    }
                });
                plant = gltf.scene;
                plant.scale.set(0.13, 0.13, 0.13);
                plant.position.set(-1.0, 0, -0.7);
                scene.add(plant);
            });
        }

        { // plant Shelf
            let plantShelf;
            gltfLoader.load('objects/plantShelf.glb', function(gltf) {
                plantShelf = gltf.scene;
                plantShelf.traverse(function(obj) {
                    if(obj.isMesh) {
                        obj.castShadow = true;
                        obj.receiveShadow = true;
                    }
                });
                plantShelf.scale.set(0.9, 0.9, 0.9);
                plantShelf.position.set(-0.6, 0.9, -1.1);
                scene.add(plantShelf);
            });
        }
        
        { // toy train
            let toyTrain;
            gltfLoader.load('objects/toyTrain.glb', function(gltf) {
                toyTrain = gltf.scene;
                toyTrain.traverse(function(obj) {
                    if(obj.isMesh) {
                        obj.castShadow = true;
                        obj.receiveShadow = true;
                    }
                });
                toyTrain.position.set(2.5, 0.07, 1.0);
                scene.add(toyTrain);
            });
        }

        { // soccer ball
            let soccerBall;
            gltfLoader.load('objects/soccerBall.glb', function(gltf) {
                soccerBall = gltf.scene;
                soccerBall.traverse(function(obj) {
                    if(obj.isMesh) {
                        obj.castShadow = true;
                        obj.receiveShadow = true;
                    }
                });
                soccerBall.scale.set(0.2, 0.2, 0.2);
                soccerBall.position.set(2.7, 0.15, -1.0);
                scene.add(soccerBall);
            });
        }

        { // tennis ball
            let tennisBall;
            gltfLoader.load('objects/tennisBall.glb', function(gltf) {
                tennisBall = gltf.scene;
                tennisBall.traverse(function(obj) {
                    if(obj.isMesh) {
                        obj.castShadow = true;
                        obj.receiveShadow = true;
                    }
                });
                tennisBall.scale.set(0.08, 0.08, 0.08);
                tennisBall.position.set(2.9, 0.0, -0.7);
                scene.add(tennisBall);
            });

        }

        { // wooden Wall
            let woodWall;
            gltfLoader.load('objects/woodenWall.glb', function(gltf) {
                woodWall = gltf.scene;
                woodWall.traverse(function(obj) {
                    if(obj.isMesh) {
                        obj.castShadow = true;
                        obj.receiveShadow = true;
                    }
                });
                woodWall.position.set(-0.7, 0.0, 1.5);
                scene.add(woodWall);
                let woodWall1 = woodWall.clone();
                woodWall1.position.set(0.0, 0.0, 1.5);
                scene.add(woodWall1);
            });
        }

        { // oriental rug
            let oriRug;
            gltfLoader.load('objects/orientalRug.glb', function(gltf) {
                oriRug = gltf.scene;
                oriRug.traverse(function(obj) {
                    if(obj.isMesh) {
                        obj.castShadow = true;
                        obj.receiveShadow = true;
                    }
                });
                oriRug.scale.set(0.2, 0.2, 0.3);
                oriRug.position.set(-0.5, 0.04, 0.0);
                scene.add(oriRug);
            });
        }

        { // rounded rug
            let rug;
            gltfLoader.load('objects/roundedRug.glb', function(gltf) {
                rug = gltf.scene;
                rug.traverse(function(obj) {
                    if(obj.isMesh) {
                        obj.castShadow = true;
                        obj.receiveShadow = true;
                    }
                });
                //rug.scale.set(0.8, 0.8, 0.8);
                rug.position.set(1.9, 0.04, -0.8);
                scene.add(rug);
            });
        }

        { // chick
            let chick;
            gltfLoader.load('objects/chick.glb', function(gltf) {
                chick = gltf.scene;
                chick.traverse(function(obj) {
                    if(obj.isMesh) {
                        obj.castShadow = true;
                        obj.receiveShadow = true;
                    }
                });
                chick.scale.set(0.003, 0.003, 0.003);
                chick.rotation.y = Math.PI/2;
                chick.position.set(-0.8, 0.55, 1.0);
                scene.add(chick);
            });
        }
    }

    loadCustomObjects();

    function render(time) {
        diamond.rotation.y = time / 900;
        diamond1.rotation.y = time / 900;
        time *= 0.001; // conver time to seconds

        //  // rotate all the cubes in the render target scene
        // rtCubes.forEach((cube, ndx) => {
        //     const speed = 1 + ndx * .1;
        //     const rot = time * speed;
        //     cube.rotation.x = rot;
        //     cube.rotation.y = rot;
        // });

        renderer.setRenderTarget(renderTarget);
        renderer.render(rtScene, rtCamera);
        renderer.setRenderTarget(null);

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