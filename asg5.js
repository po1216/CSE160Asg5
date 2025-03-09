import * as THREE from 'three';


function main() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({antialias: true, canvas});

    let camera;
    makeCamera();

    const scene = new THREE.Scene();

    makeLight();

    function makeCamera() {
        const fov = 75;
        const aspect = 2; // the canvas default
        const near = 0.1;
        const far = 5;
        camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        camera.position.z = 2;
    }

    function makeLight() {
        const color = 0xFFFFFF;
        const intensity = 3;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        scene.add(light);
    }

    
    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    function makeInstance(geometry, color, x) {
        const material = new THREE.MeshPhongMaterial({color});
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        cube.position.x = x;
        
        return cube;
    }

    const cubes = [
        makeInstance(boxGeometry, 0x44aa88, 0),
        makeInstance(boxGeometry, 0x8844aa, -2),
        makeInstance(boxGeometry, 0xaa8844, 2)
    ];

    function render(time) {
        time *= 0.001; // conver time to seconds

        cubes.forEach( ( cube, ndx ) => {
            const speed = 1 + ndx * 0.1;
            const rot = time * speed;
            cube.rotation.x = rot;
            cube.rotation.y = rot;
        } );
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);

}


main();