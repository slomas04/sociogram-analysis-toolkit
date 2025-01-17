import './bootstrap';

import "https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js";
import "https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js";
import Graph from "graphology";
import Sigma from "sigma";

import { generateGraph } from "./graphGeneration.js";


document.addEventListener('livewire:init', () => {
    Livewire.on('showDataset', (event) => {
        let filePath = event.path;

    });
});

const graph = generateGraph("/datasets/kovdb.json");
const sigmaInstance = new Sigma(graph, document.getElementById("container"));
sigmaInstance.getCamera().setState({
    angle: 0.2,
  });






