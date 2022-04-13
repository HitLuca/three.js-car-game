import * as THREE from "three";
import { Wheel } from "./wheel";

export const minimumSpeed = 0.6;
export const maximumSpeed = 1.5;

export function Truck() {
    const truck = new THREE.Group();

    const trailerBackWheel = Wheel();
    truck.add(trailerBackWheel);

    const trailerFrontWheel = Wheel();
    trailerFrontWheel.position.x = -50;
    truck.add(trailerFrontWheel);

    const frontWheel = Wheel();
    frontWheel.position.x = 30;
    truck.add(frontWheel);

    const trailer = new THREE.Mesh(
        new THREE.BoxBufferGeometry(80, 35, 35),
        new THREE.MeshLambertMaterial({ color: "#d0e8e1" })
    );
    trailer.position.z = 25;
    trailer.position.x = -30;
    truck.add(trailer);

    const connector = new THREE.Mesh(
        new THREE.BoxBufferGeometry(30, 20, 10),
        new THREE.MeshLambertMaterial({ color: "#d0e8e1" })
    );
    connector.position.z = 10;
    connector.position.x = 20;
    truck.add(connector);

    const randomCabinColor = randomColor();
    const cabinX = 25;
    const cabinY = 30;
    const cabinZ = 30;

    const cabinFrontTexture = getCabinFrontTexture(cabinY, cabinZ, randomCabinColor);
    cabinFrontTexture.center = new THREE.Vector2(0.5, 0.5); //putting the center in the actual texture center
    cabinFrontTexture.rotation = Math.PI / 2; //rotating by 90 degrees

    const cabinBackTexture = getCabinFrontTexture(cabinY, cabinZ, randomCabinColor);
    cabinBackTexture.center = new THREE.Vector2(0.5, 0.5); //putting the center in the actual texture center
    cabinBackTexture.rotation = -Math.PI / 2; //rotating by 90 degrees

    const cabinRightTexture = getCabinSideTexture(cabinX, cabinZ, randomCabinColor);

    const cabinLeftTexture = getCabinSideTexture(cabinX, cabinZ, randomCabinColor);
    cabinLeftTexture.flipY = false; //don't flip texture

    const cabin = new THREE.Mesh(
        new THREE.BoxBufferGeometry(cabinX, cabinY, cabinZ),
        [
            new THREE.MeshLambertMaterial({ map: cabinFrontTexture }),
            new THREE.MeshLambertMaterial({ map: cabinBackTexture }),
            new THREE.MeshLambertMaterial({ map: cabinLeftTexture }),
            new THREE.MeshLambertMaterial({ map: cabinRightTexture }),
            new THREE.MeshLambertMaterial({ color: randomCabinColor }),
            new THREE.MeshLambertMaterial({ color: randomCabinColor }),
        ]
    );
    cabin.position.z = 20;
    cabin.position.x = 30;
    truck.add(cabin);

    return truck;
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

export function getCabinSideTexture(cabinX, cabinZ, cabinColor) {
    const canvas = document.createElement("canvas");
    canvas.width = cabinX;
    canvas.height = cabinZ;
    const context = canvas.getContext("2d");

    context.fillStyle = cabinColor;
    context.fillRect(0, 0, cabinX, cabinZ);

    context.fillStyle = "#666666";
    context.fillRect(14, 8, cabinX, 8);

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