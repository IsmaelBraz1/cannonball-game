import * as THREE from 'three';
import * as CANNON from 'cannon-es';

let objectsCena = [];
let objectsFisic = [];

let objDinaMesh = [];
let objDinaBodies = [];

export function createStructure1(scene, world) {
    const cubeSize = 1;
    const spacing = 0.1;
    const cubes = [];
    const cubeBodies = [];
    const rows = 5;
    const columns = 10;

    // Carregar a textura do alvo
    const textureLoader = new THREE.TextureLoader();
    const targetTexture = textureLoader.load('../textura/alvo.jpg'); // Certifique-se de que o arquivo está na pasta correta
    targetTexture.wrapS = THREE.RepeatWrapping;
    targetTexture.wrapT = THREE.RepeatWrapping;

    // Criar um material com a textura
    const cubeMaterial = new THREE.MeshBasicMaterial({ map: targetTexture });

    // Criar um material físico padrão
    const defaultMaterial = new CANNON.Material("defaultMaterial");
    const contactMaterial = new CANNON.ContactMaterial(defaultMaterial, defaultMaterial, {
        friction: 1,
        restitution: 0.01
    });
    world.addContactMaterial(contactMaterial);

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
            const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
            cubeMesh.position.set(j * (cubeSize + spacing) - 4, i * (cubeSize + spacing), 0);
            scene.add(cubeMesh);
            cubes.push(cubeMesh);

            const cubeShape = new CANNON.Box(new CANNON.Vec3(cubeSize / 2, cubeSize / 2, cubeSize / 2));
            const cubeBody = new CANNON.Body({
                mass: 0.8,
                position: new CANNON.Vec3(j * (cubeSize + spacing) - 4, i * (cubeSize + spacing), 0),
                shape: cubeShape,
                material: defaultMaterial
            });
            cubeBody.linearDamping = 0;
            world.addBody(cubeBody);
            cubeBodies.push(cubeBody);

            objectsCena.push(cubeMesh);
            objectsFisic.push(cubeBody);
        }
    }

    return { cubes, cubeBodies, objDinaMesh, objDinaBodies };
}

export function remove1(scene, world) {
    for (var i = 0; i < objectsCena.length; i++) {
        scene.remove(objectsCena[i]);
    }
    for (var i = 0; i < objectsFisic.length; i++) {
        world.removeBody(objectsFisic[i]);
    }
    objectsCena = [];
    objectsFisic = [];
}
