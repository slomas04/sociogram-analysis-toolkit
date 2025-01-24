import './bootstrap';
import "https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js";
import "https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js";
import Graph from "graphology";
import Sigma from "sigma";
import { generateGraph, setHoveredNode, hoveredNeighbors, hoveredNode, selectedNode, suggestions } from "./graphGeneration.js";

export const sigmaInstance = new Sigma(new Graph({ multi: false }), document.getElementById("container"), {
    renderLabels: false,
});

sigmaInstance.getCamera().setState({
    angle: 0.2,
});

document.addEventListener('livewire:init', () => {
    Livewire.on('showDataset', (event) => {
        console.log("showDataset event fired with path:", event.path);

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

                const dispBox = document.getElementById("userDispbox")

                sigmaInstance.on("enterNode", ({ node }) => {
                    console.log(returnGraph.getNodeAttributes(node));
                    Livewire.dispatch('update-userbox', returnGraph.getNodeAttributes(node));
                    dispBox.style.display = "absolute";
                    setHoveredNode(node);
                });

                sigmaInstance.on("leaveNode", () => {
                    dispBox.style.display = "none";
                    setHoveredNode(null);
                });

                sigmaInstance.setSetting("nodeReducer", (node, data) => {
                    const res = { ...data };
                
                    if (hoveredNeighbors && !hoveredNeighbors.has(node) && hoveredNode !== node) {
                      res.label = "";
                      res.hidden=true;
                    }
                
                    if (selectedNode === node) {
                      res.highlighted = true;
                    } else if (suggestions) {
                      if (suggestions.has(node)) {
                        res.forceLabel = true;
                      } else {
                        res.label = "";
                        res.hidden=true;
                      }
                    }
                
                    return res;
                  });

                sigmaInstance.setSetting("edgeReducer", (edge, data) => {
                    const res = { ...data };
                
                    if (
                      hoveredNode &&
                      !returnGraph.extremities(edge).every((n) => n === hoveredNode || returnGraph.areNeighbors(n, hoveredNode))
                    ) {
                      res.hidden = true;
                    }
                
                    if (
                      suggestions &&
                      (!suggestions.has(returnGraph.source(edge)) || !suggestions.has(returnGraph.target(edge)))
                    ) {
                      res.hidden = true;
                    }
                
                    return res;
                  });
                
                
            },
            (returnError) => {
                console.log(returnError);
            }
        );
    });
});

