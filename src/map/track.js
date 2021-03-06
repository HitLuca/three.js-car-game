import * as THREE from "three";
import { getDistance } from "../utils";
import { Tree } from "./tree";

export const trackRadius = 225;
const trackWidth = 45;
const innerTrackRadius = trackRadius - trackWidth;
const outerTrackRadius = trackRadius + trackWidth;

const arcAngle1 = (1 / 3) * Math.PI;

const deltaY = Math.sin(arcAngle1) * innerTrackRadius;
const arcAngle2 = Math.asin(deltaY / outerTrackRadius);

export const arcCenterX = (
    Math.cos(arcAngle1) * innerTrackRadius + Math.cos(arcAngle2) * outerTrackRadius
) / 2;

const arcAngle3 = Math.acos(arcCenterX / innerTrackRadius);
const arcAngle4 = Math.acos(arcCenterX / outerTrackRadius);

export function renderMap(mapWidth, mapHeight) {
    const map = new THREE.Group();

    const lineMarkingsTexture = getLineMarkings(mapWidth, mapHeight);
    const planeGeometry = new THREE.PlaneBufferGeometry(mapWidth, mapHeight);
    const planeMaterial = new THREE.MeshLambertMaterial({ map: lineMarkingsTexture });

    const plane = new THREE.Mesh(planeGeometry, planeMaterial);

    map.add(plane);

    const leftIsland = getLeftIsland();
    const rightIsland = getRightIsland();
    const middleIsland = getMiddleIsland();
    const outerField = getOuterField(mapWidth, mapHeight);

    const fieldGeometry = new THREE.ExtrudeBufferGeometry(
        [leftIsland, rightIsland, middleIsland, outerField],
        { depth: 6, bevelEnabled: false }
    );

    const fieldMesh = new THREE.Mesh(fieldGeometry, [
        new THREE.MeshLambertMaterial({ color: 0x67c240 }),
        new THREE.MeshLambertMaterial({ color: 0x23311c }),
    ]);

    map.add(fieldMesh);

    let trees = [];

    for (let i = 0; i < 20; i++) {
        let tree = Tree();

        let goodPos = false;
        const trackRadiusDistance = 20;
        const treeDistance = 100;
        do {
            const treeX = Math.floor(Math.random() * mapWidth) - mapWidth / 2;
            const treeY = Math.floor(Math.random() * mapHeight) - mapHeight / 2;
            const treeCoords = { x: treeX, y: treeY };
            const leftCenterCoords = { x: -arcCenterX, y: 0 };
            const rightCenterCoords = { x: arcCenterX, y: 0 };

            if (
                (
                    (getDistance(treeCoords, leftCenterCoords) > outerTrackRadius + trackRadiusDistance)
                    &&
                    (getDistance(treeCoords, rightCenterCoords) > outerTrackRadius + trackRadiusDistance)
                ) ||
                (
                    (getDistance(treeCoords, leftCenterCoords) < innerTrackRadius - trackRadiusDistance)
                    &&
                    (getDistance(treeCoords, rightCenterCoords) > outerTrackRadius + trackRadiusDistance)
                ) ||
                (
                    (getDistance(treeCoords, rightCenterCoords) < innerTrackRadius - trackRadiusDistance)
                    &&
                    (getDistance(treeCoords, leftCenterCoords) > outerTrackRadius + trackRadiusDistance)
                )
            ) {
                let goodSeparation = true;
                for (let j = 0; j < trees.length; j++) {
                    if (getDistance(treeCoords, { x: trees[j].position.x, y: trees[j].position.y }) < treeDistance) {
                        goodSeparation = false;
                    }
                }

                if (goodSeparation) {
                    tree.position.x = treeX;
                    tree.position.y = treeY;
                    trees.push(tree);
                    goodPos = true;
                }
            }
        } while (!goodPos);
    }

    for (let i = 0; i < trees.length; i++) {
        map.add(trees[i]);
    }
    return map;
}

function getLineMarkings(mapWidth, mapHeight) {
    const canvas = document.createElement("canvas");
    canvas.width = mapWidth;
    canvas.height = mapHeight;
    const context = canvas.getContext("2d");

    context.fillStyle = "#546e90";
    context.fillRect(0, 0, mapWidth, mapHeight);

    context.lineWidth = 2;
    context.strokeStyle = "#e0ffff";
    context.setLineDash([10, 14]);

    // left markings
    context.beginPath();
    context.arc(
        mapWidth / 2 - arcCenterX,
        mapHeight / 2,
        trackRadius,
        0,
        Math.PI * 2);
    context.stroke();

    // right markings
    context.beginPath();
    context.arc(
        mapWidth / 2 + arcCenterX,
        mapHeight / 2,
        trackRadius,
        0,
        Math.PI * 2);
    context.stroke();

    return new THREE.CanvasTexture(canvas);
}

function getLeftIsland() {
    const leftIsland = new THREE.Shape();

    leftIsland.absarc(
        -arcCenterX,
        0,
        innerTrackRadius,
        arcAngle1,
        -arcAngle1,
        false
    );

    leftIsland.absarc(
        arcCenterX,
        0,
        outerTrackRadius,
        Math.PI + arcAngle2,
        Math.PI + -arcAngle2,
        true,
    );
    return leftIsland;
}

function getRightIsland() {
    const rightIsland = new THREE.Shape();

    rightIsland.absarc(
        arcCenterX,
        0,
        innerTrackRadius,
        Math.PI - arcAngle1,
        Math.PI + arcAngle1,
        true
    );

    rightIsland.absarc(
        - arcCenterX,
        0,
        outerTrackRadius,
        -arcAngle2,
        arcAngle2,
        false,
    );
    return rightIsland;
}

function getMiddleIsland() {
    const middleIsland = new THREE.Shape();

    middleIsland.absarc(
        -arcCenterX,
        0,
        innerTrackRadius,
        arcAngle3,
        - arcAngle3,
        true
    );

    middleIsland.absarc(
        arcCenterX,
        0,
        innerTrackRadius,
        Math.PI + arcAngle3,
        Math.PI - arcAngle3,
        true,
    );
    return middleIsland;
}

function getOuterField(mapWidth, mapHeight) {
    const outerField = new THREE.Shape();

    outerField.moveTo(-mapWidth / 2, -mapHeight / 2);
    outerField.lineTo(0, -mapHeight / 2);

    outerField.absarc(-arcCenterX,
        0,
        outerTrackRadius,
        -arcAngle4,
        arcAngle4,
        true
    );

    outerField.absarc(
        arcCenterX,
        0,
        outerTrackRadius,
        Math.PI - arcAngle4,
        Math.PI + arcAngle4,
        true
    );

    outerField.lineTo(0, -mapHeight / 2);
    outerField.lineTo(mapWidth / 2, -mapHeight / 2);
    outerField.lineTo(mapWidth / 2, mapHeight / 2);
    outerField.lineTo(-mapWidth / 2, mapHeight / 2);

    return outerField;
}