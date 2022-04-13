import * as THREE from "three";
import { renderMap } from "./map/track";
import { getVeichleSpeed, pickRandom } from "./utils";
import { Car } from "./veichles/car";
import { Truck } from "./veichles/truck";

export const scene = new THREE.Scene();

export function createScene(playerCar, cameraWidth, cameraHeight) {
    scene.add(playerCar);
    const map = renderMap(cameraWidth, cameraHeight + 2);
    scene.add(map);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
    dirLight.position.set(100, -300, 200);
    scene.add(dirLight);

    const camera = new THREE.OrthographicCamera(
        cameraWidth / -2,
        cameraWidth / 2,
        cameraHeight / 2,
        cameraHeight / -2,
        0,
        1000
    );
    camera.position.set(0, -420, 400);
    // camera.up.set(0, 0, 1);
    camera.lookAt(0, 0, 0);

    return camera;
}

export function addVeichle(otherVeichles) {
    const veichleTypes = ["car", "truck"];

    const type = pickRandom(veichleTypes);
    const mesh = type == "car" ? Car() : Truck();
    scene.add(mesh);

    const clockwise = Math.random() >= 0.5;
    const angle = clockwise ? Math.PI / 2 : -Math.PI / 2;

    const speed = getVeichleSpeed(type);

    otherVeichles.push({ mesh, type, clockwise, angle, speed });
}