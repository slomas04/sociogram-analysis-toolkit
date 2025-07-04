import { generateGraph, setHoveredNode, clickedNeighbors, hoveredNode, selectedNode, suggestions, layoutManagement } from "./graphGeneration.js";
import Graph from "graphology";
import Sigma from "sigma";

export var sigmaInstance;

var clickedNode = null;
var draggedNode = null;

const container  = document.getElementById("container");
const sigmaContents = container.innerHTML;



export function setupInstance(path, onlyScanned, minIn, minOut){
    if (minIn == null) minIn = 2;
    if (minOut == null) minOut = 1;
    console.log('setting up new instance for ${path} with onlyScanned = ' + onlyScanned + ', minIn = ' + minIn + ' minOut=' + minOut);

    if (sigmaInstance != null) {
        sigmaInstance.kill();
        container.innerHTML = sigmaContents;
    }
    sigmaInstance = new Sigma(new Graph({ multi: false }), container, {
        renderLabels: false,
    });
    sigmaInstance.getCamera().setState({
        angle: 0.2,
    });

    setFilterListeners(path);    

    let graphPromise = new Promise((resolve, reject) => {
        generateGraph(path, onlyScanned, minIn, minOut)
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

            sigmaInstance.on("clickNode", ({node}) => {
                console.log(returnGraph.getNodeAttributes(node));
                clickedNode = (clickedNode == node) ? null : node; 
                setHoveredNode(node);
            });

            sigmaInstance.on("enterNode", ({ node }) => {
                Livewire.dispatch('update-userbox', returnGraph.getNodeAttributes(node));
                dispBox.style.display = "absolute";
            });

            sigmaInstance.on("leaveNode", () => {
                if (clickedNode == null){
                    dispBox.style.display = "none";
                    setHoveredNode(null);
                }
            });
            setReducers(returnGraph);
            
        },
        (returnError) => {
            console.log(returnError);
        }
    );
    sigmaInstance.refresh();
}

function setReducers(returnGraph){
    sigmaInstance.setSetting("nodeReducer", (node, data) => {
        const res = { ...data };

        // Hide if node clicked but this isn't a neighbour
        if (clickedNeighbors && !clickedNeighbors.has(node) && hoveredNode !== node) {
          res.label = "";
          res.hidden=true;
        }
        
        // Highlight if selected
        if (selectedNode === node) {
          res.highlighted = true;

        // Hide if not in search query
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
        // Get source and target nodes for edge
        var source = returnGraph.source(edge)
        var target = returnGraph.target(edge)

        // Hide if either are hidden
        if(source.hidden || target.hidden){
          res.hidden = true
        }
        return res;
      });
}

function setFilterListeners(path){
    var reloadButton = document.getElementById("reloadWithFilter");
    var showOnlyScraped = document.getElementById("scrapedOnly");
    var minInBox = document.getElementById("minIn");
    var minOutBox = document.getElementById("minOut");

    reloadButton.addEventListener("click", () => {
        setupInstance(path, showOnlyScraped.checked, minInBox.value, minOutBox.value);
    });
}