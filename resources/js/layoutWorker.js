import { circular } from "graphology-layout";
import {circlepack} from 'graphology-layout';
import { animateNodes } from "sigma/utils";
import { randomCoord } from "./graphGeneration";
import { currentAtt } from "./metricEvaluation";

let cancelCurrentAnimation = null;

// Store all current workers here
const layoutWorkers = [];

// Utility to stop all workers if necessary
function stopLayouts() {
    layoutWorkers.forEach(worker => worker.stop());
    if (cancelCurrentAnimation) {
        cancelCurrentAnimation();
        cancelCurrentAnimation = null;
    }
}

// Layout worker class, acts as a wrapper for workers
export class LayoutWorker {
    constructor({ layoutInstance, startLabelId, stopLabelId, buttonId }) {
        this.layout = layoutInstance;
        this.startLabel = document.getElementById(startLabelId);
        this.stopLabel = document.getElementById(stopLabelId);
        this.button = document.getElementById(buttonId);

        this.button.addEventListener("click", () => this.toggle());

        layoutWorkers.push(this);
    }

    stop() {
        this.layout.stop();
        this.startLabel.style.display = "flex";
        this.stopLabel.style.display = "none";
    }

    start() {
        stopLayouts();
        this.layout.start();
        this.startLabel.style.display = "none";
        this.stopLabel.style.display = "flex";
    }

    toggle() {
        if (this.layout.isRunning()) {
            this.stop();
        } else {
            this.start();
        }
    }
};

// Make the layout completely random
export function randomiseLayout(graph){
    stopLayouts();

    const randomPositions = {}
    graph.forEachNode(node => {
        randomPositions[node] = { x: randomCoord(), y: randomCoord() }
    });
    cancelCurrentAnimation = animateNodes(graph, randomPositions, { duration: 1000 });
}

// Assign a circular layout to the graph
export function circularLayout(graph){
    stopLayouts();

    const circularPositions = circular(graph, { scale: 100 });
    cancelCurrentAnimation = animateNodes(graph, circularPositions, { duration: 1000, easing: "linear" });
}

export function circlePack(graph){
    stopLayouts();

    const packPositions = circlepack(graph, {hierarchyAttributes: ['community', currentAtt]});
    cancelCurrentAnimation = animateNodes(graph, packPositions, { duration: 1000, easing: "linear" });
}