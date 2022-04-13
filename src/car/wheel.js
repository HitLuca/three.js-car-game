import * as THREE from "three";

export function Wheel() {
    const wheel = new THREE.Mesh(
        new THREE.BoxBufferGeometry(12, 33, 12),
        new THREE.MeshLambertMaterial({ color: 0x333333 })
    );
    wheel.position.z = 6;
    return wheel;
}
