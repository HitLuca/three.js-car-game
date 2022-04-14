import * as CAR from "./veichles/car";
import * as TRUCK from "./veichles/truck";

export function pickRandom(array) {
    return array[Math.floor(Math.random() * array.length)];
}

export function getVeichleSpeed(type) {
    if (type == "car") {
        return CAR.minimumSpeed + Math.random() * (CAR.maximumSpeed - CAR.minimumSpeed);
    }
    if (type == "truck") {
        return TRUCK.minimumSpeed + Math.random() * (TRUCK.maximumSpeed - TRUCK.minimumSpeed);
    }
}

export function getDistance(p1, p2) {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}