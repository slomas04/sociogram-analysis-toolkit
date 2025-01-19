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

// Listen for Livewire init event
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
                // Ensure Sigma graph is correctly set and refreshed
                sigmaInstance.setGraph(returnGraph);
                sigmaInstance.refresh();

                // Reinitialize graph after Livewire updates to make sure the graph renders
                setTimeout(() => {
                    console.log("Re-rendering Sigma graph...");
                    sigmaInstance.refresh();
                }, 100); // Adding a small delay to allow for Livewire DOM updates
            },
            (returnError) => {
                console.log(returnError);
            }
        );
    });
});

// Livewire event to handle when Livewire updates the DOM
document.addEventListener('livewire:update', () => {
    console.log("Livewire update detected. Re-rendering Sigma graph...");
    // Re-render the graph when Livewire updates the component
    sigmaInstance.refresh();
});
