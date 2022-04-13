import {
    Scene,
    AmbientLight,
    DirectionalLight,
    OrthographicCamera,
    WebGLRenderer
} from "three";
import { Car } from "./car/car";

function main() {
    const scene = new Scene();

    const playerCar = Car();
    playerCar.position.set(0, 0, 0);
    scene.add(playerCar);

    const ambientLight = new AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new DirectionalLight(0xffffff, 0.6);
    dirLight.position.set(100, -300, 400);
    scene.add(dirLight);

    const aspectRatio = window.innerWidth / window.innerHeight;
    const cameraWidth = 150;
    const cameraHeight = cameraWidth / aspectRatio;

    const camera = new OrthographicCamera(
        cameraWidth / -2,
        cameraWidth / 2,
        cameraHeight / 2,
        cameraHeight / -2,
        0,
        1000
    );
    camera.position.set(200, -200, 300);
    camera.up.set(0, 0, 1);
    camera.lookAt(0, 0, 0);

    const renderer = new WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);

    document.body.appendChild(renderer.domElement);
}

main();