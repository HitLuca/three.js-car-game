import * as THREE from "three";

export function Tree() {
    const tree = new THREE.Group();

    const trunk = new THREE.Mesh(
        new THREE.BoxBufferGeometry(15, 15, 50),
        new THREE.MeshLambertMaterial({ color: "#953E11" })
    );
    trunk.position.z = 25;
    trunk.rotation.z = Math.PI / 4;
    tree.add(trunk);

    const foliageSize = 50;
    const foliage = new THREE.Mesh(
        new THREE.SphereBufferGeometry(foliageSize),
        new THREE.MeshLambertMaterial({ color: "#4B8E16" })
    );

    foliage.position.z = 50 + foliageSize;
    tree.add(foliage);

    return tree;
}

export function getCabinFrontTexture(cabinY, cabinZ, cabinColor) {
    const canvas = document.createElement("canvas");
    canvas.width = cabinY;
    canvas.height = cabinZ;
    const context = canvas.getContext("2d");

    context.fillStyle = cabinColor;
    context.fillRect(0, 0, cabinY, cabinZ);

    context.fillStyle = "#666666";
    context.fillRect(0, 8, cabinY, 8);

    return new THREE.CanvasTexture(canvas);
}