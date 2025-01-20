import './bootstrap';
import "https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js";
import "https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js";
import Graph from "graphology";
import Sigma from "sigma";
import { generateGraph } from "./graphGeneration.js";

const sigmaInstance = new Sigma(new Graph({ multi: true }), document.getElementById("container"));

sigmaInstance.getCamera().setState({
    angle: 0.2,
});

document.addEventListener('livewire:init', () => {
    Livewire.on('showDataset', (event) => {
        let filePath = event.path;

        let graphPromise = new Promise((resolve, reject) => {
            generateGraph(filePath)
                .then(resolve)
                .catch(reject);
        });

        graphPromise.then(
            (returnGraph) => {
                sigmaInstance.setGraph(returnGraph);
                sigmaInstance.refresh();

                setTimeout(() => {
                    console.log("Re-rendering Sigma graph...");
                    sigmaInstance.refresh();
                }, 100);
            },
            (returnError) => {
                console.log(returnError);
            }
        );
    });
});

document.addEventListener('livewire:update', () => {
    console.log("Livewire update detected. Re-rendering Sigma graph...");
    sigmaInstance.refresh();
});
