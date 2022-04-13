import * as THREE from "three";
import { trackRadius, arcCenterX } from "./map/track";
import { scene, createScene, addVeichle } from "./scene";
import { Car } from "./veichles/car";

let ready;
let score;
let playerAngleMoved;

const playerAngleInitial = Math.PI;
const speed = 0.0017;
const playerCar = Car();

const scoreElement = document.getElementById("score");

let otherVeichles = [];
let lastTimestamp;

let accelerate = false;
let decelerate = false;

const aspectRatio = window.innerWidth / window.innerHeight;
const cameraWidth = 960;
const cameraHeight = cameraWidth / aspectRatio;

const camera = createScene(playerCar, cameraWidth, cameraHeight);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);

document.body.appendChild(renderer.domElement);

function reset() {
    playerAngleMoved = 0;
    movePlayerCar(0);
    score = 0;
    scoreElement.innerText = score;
    lastTimestamp = undefined;

    otherVeichles.forEach((veichle) => {
        scene.remove(veichle.mesh);
    });
    otherVeichles = [];

    renderer.render(scene, camera);
    ready = true;
}
function startGame(renderer, animation) {
    if (ready) {
        ready = false;
        renderer.setAnimationLoop(animation);
    }
}

reset();

window.addEventListener("keydown", function (event) {
    if (event.key == "ArrowUp" || event.key == "w" || event.key == "W") {
        startGame(renderer, animation);
        accelerate = true;
        return;
    }
    if (event.key == "ArrowDown" || event.key == "s" || event.key == "S") {
        decelerate = true;
        return;
    }
    if (event.key == "R" || event.key == "r") {
        reset();
        return;
    }
});

window.addEventListener("keyup", function (event) {
    if (event.key == "ArrowUp" || event.key == "w" || event.key == "W") {
        accelerate = false;
        return;
    }
    if (event.key == "ArrowDown" || event.key == "s" || event.key == "S") {
        decelerate = false;
        return;
    }
});

function animation(timestamp) {
    if (!lastTimestamp) {
        lastTimestamp = timestamp;
        return;
    }

    const timeDelta = timestamp - lastTimestamp;

    movePlayerCar(timeDelta);

    const laps = Math.floor(Math.abs(playerAngleMoved) / (Math.PI * 2));

    if (laps != score) {
        score = laps;
        scoreElement.innerText = score;
    }

    if (otherVeichles.length < (laps + 1) / 5) addVeichle(otherVeichles);

    moveOtherVeichles(timeDelta);

    renderer.render(scene, camera);
    lastTimestamp = timestamp;
}

function moveOtherVeichles(timeDelta) {
    otherVeichles.forEach((veichle) => {
        if (veichle.clockwise) {
            veichle.angle -= speed * timeDelta * veichle.speed;
        } else {
            veichle.angle += speed * timeDelta * veichle.speed;
        }

        const veichleX = Math.cos(veichle.angle) * trackRadius + arcCenterX;
        const veichleY = Math.sin(veichle.angle) * trackRadius;
        const rotation = veichle.angle + (veichle.clockwise ? -Math.PI / 2 : Math.PI / 2);

        veichle.mesh.position.x = veichleX;
        veichle.mesh.position.y = veichleY;
        veichle.mesh.rotation.z = rotation;
    });
}



function movePlayerCar(timeDelta) {
    const playerSpeed = getPlayerSpeed();
    playerAngleMoved -= playerSpeed * timeDelta;

    const totalPlayerAngle = playerAngleInitial + playerAngleMoved;

    const playerX = Math.cos(totalPlayerAngle) * trackRadius - arcCenterX;
    const playerY = Math.sin(totalPlayerAngle) * trackRadius;

    playerCar.position.x = playerX;
    playerCar.position.y = playerY;

    playerCar.rotation.z = totalPlayerAngle - Math.PI / 2;
}

function getPlayerSpeed() {
    if (accelerate) return speed * 2;
    if (decelerate) return speed * 0.5;
    return speed;
}

