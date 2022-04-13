import * as THREE from "three";
import { Wheel } from "./wheel";

export function Car() {
    const car = new THREE.Group();

    const backWheel = Wheel();
    backWheel.position.x = -18;
    car.add(backWheel);

    const frontWheel = Wheel();
    frontWheel.position.x = 18;
    car.add(frontWheel);

    const main = new THREE.Mesh(
        new THREE.BoxBufferGeometry(60, 30, 15),
        new THREE.MeshLambertMaterial({ color: randomColor() })
    );
    main.position.z = 12;
    car.add(main);

    const cabinFrontTexture = getCabinFrontTexture();
    cabinFrontTexture.center = new THREE.Vector2(0.5, 0.5); //putting the center in the actual texture center
    cabinFrontTexture.rotation = Math.PI / 2; //rotating by 90 degrees

    const cabinBackTexture = getCabinFrontTexture();
    cabinBackTexture.center = new THREE.Vector2(0.5, 0.5); //putting the center in the actual texture center
    cabinBackTexture.rotation = -Math.PI / 2; //rotating by 90 degrees

    const cabinRightTexture = getCabinSideTexture();

    const cabinLeftTexture = getCabinSideTexture();
    cabinLeftTexture.flipY = false; //don't flip texture

    const cabin = new THREE.Mesh(
        new THREE.BoxBufferGeometry(33, 24, 12),
        [
            new THREE.MeshLambertMaterial({ map: cabinFrontTexture }),
            new THREE.MeshLambertMaterial({ map: cabinBackTexture }),
            new THREE.MeshLambertMaterial({ map: cabinLeftTexture }),
            new THREE.MeshLambertMaterial({ map: cabinRightTexture }),
            new THREE.MeshLambertMaterial({ color: 0xffffff }), //top
            new THREE.MeshLambertMaterial({ color: 0xffffff }), //bottom
        ]
    );
    cabin.position.x = -6;
    cabin.position.z = 25.5;
    car.add(cabin);

    return car;
}

export function getCabinFrontTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 32;
    const context = canvas.getContext("2d");

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, 64, 32);

    context.fillStyle = "#666666";
    context.fillRect(8, 8, 48, 24);

    return new THREE.CanvasTexture(canvas);
}

export function getCabinSideTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 32;
    const context = canvas.getContext("2d");

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, 128, 32);

    context.fillStyle = "#666666";
    context.fillRect(10, 8, 38, 24);
    context.fillRect(58, 8, 60, 24);

    return new THREE.CanvasTexture(canvas);
}

const randomColor = () => {
    let color = "#";
    for (let i = 0; i < 6; i++) {
        const random = Math.random();
        const bit = (random * 16) | 0;
        color += (bit).toString(16);
    }
    return color;
};