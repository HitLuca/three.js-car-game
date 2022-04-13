import { arcCenterX, trackRadius } from "./map/track";
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
