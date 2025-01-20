// Handles generation of graphs given a path
import Graph from "graphology";
import forceAtlas2 from "graphology-layout-forceatlas2";
import { circular } from "graphology-layout";
import FA2Layout from "graphology-layout-forceatlas2/worker";
import "https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js";
import { animateNodes } from "sigma/utils";
import noverlap from "graphology-layout-noverlap";

async function getJsonData(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("Failed to fetch data: " + response.statusText);
    }
    return await response.json();
}

function randomColour() {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

function randomCoord() {
    return (Math.random() * 1000) - 500;
}

export async function generateGraph(path) {
    const graph = new Graph({  });
    const url = document.getElementsByName('base_url')[0].getAttribute('content') + "/storage/" + path;
    
    let jsonData;
    try {
        jsonData = await getJsonData(url);
    } catch (error) {
        console.error("Error fetching JSON data:", error);
        return new Graph(); 
    }

    const anon = jsonData['anonymous'];
    var currentUsers = [];

    jsonData['users'].forEach(function (user) {
        if (!currentUsers.includes(user['id'])) {
            var nodeLabel = anon ? user['id'] : user['username'];
            graph.addNode(user['id'], { label: nodeLabel, x: randomCoord(), y: randomCoord(), size: 2, color: randomColour() });
            currentUsers.push(user['id']);
        }

        if (user.hasOwnProperty('following')) {
            user['following'].forEach(function (fUser) {
                if (!currentUsers.includes(fUser[0])) {
                    var followNodeLabel = anon ? fUser[0] : fUser[1];
                    graph.addNode(fUser[0], { label: followNodeLabel, x: randomCoord(), y: randomCoord(), size: 2, color: randomColour() });
                    currentUsers.push(fUser[0]);
                }
                if (!graph.hasEdge(user['id'], fUser[0])) {
                    graph.addEdge(user['id'], fUser[0], { type: "arrow" });
                }
            });
        }
    });

    graph.forEachNode(node => {
        graph.mergeNodeAttributes(node, {
            size: graph.inDegree(node) * 2,
          });
    });

    graph.forEachNode( node => {
        if (graph.inDegree(node) == 1 && graph.outDegree(node) == 0) {
            graph.dropNode(node);
        }
    });

    return layoutManagement(graph);
}

// Separate function for the management of layouts
// Much of this is based on sigma.js's 'layouts example' storybook
function layoutManagement(graph){
    let cancelCurrentAnimation = null;

    const sensibleSettings = forceAtlas2.inferSettings(graph);
    const fa2Layout = new FA2Layout(graph, {
        settings: sensibleSettings,
    });

    const FA2StartLabel = document.getElementById("fa2_start");
    const FA2StopLabel = document.getElementById("fa2_stop");
    function stopFA2() {
        fa2Layout.stop();
        FA2StartLabel.style.display = "flex";
        FA2StopLabel.style.display = "none";
    }
    function startFA2() {
        if (cancelCurrentAnimation) cancelCurrentAnimation();
        fa2Layout.start();
        FA2StartLabel.style.display = "none";
        FA2StopLabel.style.display = "flex";
    }
    
    function toggleFA2Layout() {
        if (fa2Layout.isRunning()) {
          stopFA2();
        } else {
          startFA2();
        }
    }

    function randomiseLayout(){
        if (fa2Layout.isRunning()) stopFA2();
        cancelCurrentAnimation = null;

        const randomPositions = {}
        graph.forEachNode(node => {
            randomPositions[node] = { x: randomCoord(), y: randomCoord() }
        });
        cancelCurrentAnimation = animateNodes(graph, randomPositions, { duration: 2000 });
    }

    function circularLayout(){
        if (fa2Layout.isRunning()) stopFA2();
        cancelCurrentAnimation = null;

        const circularPositions = circular(graph, { scale: 100 });
        cancelCurrentAnimation = animateNodes(graph, circularPositions, { duration: 2000, easing: "linear" });
    }

    function runNoverlap(){
        if (fa2Layout.isRunning()) stopFA2();
        cancelCurrentAnimation = null;

        const positions = noverlap(graph, {maxIterations: 50});
        cancelCurrentAnimation = animateNodes(graph, positions, { duration: 2000, easing: "linear" });
    }
    
    const randomButton = document.getElementById("layout_random");
    randomButton.addEventListener("click", randomiseLayout);
    const circleButton = document.getElementById("layout_circular");
    circleButton.addEventListener("click", circularLayout);
    const fa2button = document.getElementById("layout_fa2");
    fa2button.addEventListener("click", toggleFA2Layout);
    const noverlapButton = document.getElementById("layout_noverlap");
    noverlapButton.addEventListener("click", runNoverlap)

    return graph;
}
