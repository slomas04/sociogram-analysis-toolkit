// Handles generation of graphs given a path
import "https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js";
import Graph from "graphology";
import forceAtlas2 from "graphology-layout-forceatlas2";
import { circular } from "graphology-layout";
import FA2Layout from "graphology-layout-forceatlas2/worker"
import NoverlapLayout from 'graphology-layout-noverlap/worker';
import { animateNodes } from "sigma/utils";
import { sortInDegree, sortOutDegree, sortBetween, sortClose, sortDegree, sortEigen, sortPagerank } from "./metricEvaluation.js";
import { sigmaInstance } from "./instanceManager.js";
import { establishCommunities } from "./communityAssignment.js";

// Global variables for state management
let cancelCurrentAnimation = null;
let fa2Layout = null;
let noverlapLayout = null;
let fa2Worker = null;
let noverlapWorker = null;
export let suggestions = null;
let graph = null;
export let selectedNode = null;
export let hoveredNode = null;
export let hoveredNeighbors = null;

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

export function setHoveredNode(val){
    if (val == null){
        hoveredNode = null;
        hoveredNeighbors = null;
    } else {
        hoveredNode = val;
        hoveredNeighbors = new Set(graph.neighbors(val)); 
    }
    sigmaInstance.refresh({
        skipIndexation: true,
      });
}

// Hashes a string into a valid colour
// function taken directly from https://stackoverflow.com/questions/3426404/create-a-hexadecimal-colour-based-on-a-string-with-javascript
export function stringToColour(str){
    let hash = 0;
    str.split('').forEach(char => {
      hash = char.charCodeAt(0) + ((hash << 5) - hash)
    })
    let colour = '#'
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff
      colour += value.toString(16).padStart(2, '0')
    }
    return colour
  }

function randomCoord() {
    return (Math.random() * 1000) - 500;
}

export async function generateGraph(path, onlyScanned, minIn, minOut) {

    graph = new Graph({  });
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
        var userColour = stringToColour(user['id']);
        if (!currentUsers.includes(user['id'])) {
            var nodeLabel = anon ? user['id'] : user['username'];
            graph.addNode(user['id'], { label: nodeLabel, x: randomCoord(), y: randomCoord(), size: 2 });
            currentUsers.push(user['id']);
        }

        if (user.hasOwnProperty('following')) {
            user['following'].forEach(function (fUser) {
                if (!currentUsers.includes(fUser[0]) && !onlyScanned) {
                    var followNodeLabel = anon ? fUser[0] : fUser[1];
                    graph.addNode(fUser[0], { label: followNodeLabel, x: randomCoord(), y: randomCoord(), size: 2 });
                    currentUsers.push(fUser[0]);
                }
                if (!graph.hasEdge(user['id'], fUser[0]) && currentUsers.includes(fUser[0])) {
                    graph.addEdge(user['id'], fUser[0], { type: "arrow"});
                }
            });
        }
    });

    minIn = Number(minIn);
    minOut = Number(minOut);

    graph.forEachNode( node => {
        if (graph.inDegree(node) < minIn && graph.outDegree(node) < minOut) {
            graph.dropNode(node);
        }
    });

    // Connect proper attributes to each node (this is very slow)
    graph.forEachNode( node => {
        const attributes = jsonData['users'].find(user => {
            return user.id == node;
        })
        if (attributes != null){
            if (attributes.hasOwnProperty("following")){
                delete attributes.following;
            }
            graph.mergeNodeAttributes(node, attributes);
        }
    });

    sortInDegree(graph);

    graph = establishCommunities(graph);

    const searchBox = document.getElementById("searchbox");

    searchBox.addEventListener("input", () => {
        setSearchQuery(searchBox.value || "");
    });

    searchBox.addEventListener("blur", () => {
        setSearchQuery("");
    });

    return layoutManagement(graph);
}

// Separate function for the management of layouts
// Much of this is based on sigma.js's 'layouts example' storybook
export function layoutManagement(graph){
    const sensibleSettings = forceAtlas2.inferSettings(graph);
    fa2Layout = new FA2Layout(graph, {
        settings: sensibleSettings,
    });

    fa2Worker = new fa2LayoutWorker();
    noverlapLayout = new NoverlapLayout(graph, {maxIterations: 50, settings: {
        speed: 50, 
        expansion: 1.1,
        margin: 5,
        ration: 2.0,
    }});
    noverlapWorker = new NoverlapWorker();
    

    function randomiseLayout(){
        if (fa2Layout.isRunning()) fa2Worker.stopFA2();
        if (noverlapLayout.isRunning()) noverlapWorker.stopNoverlap();
        cancelCurrentAnimation = null;

        const randomPositions = {}
        graph.forEachNode(node => {
            randomPositions[node] = { x: randomCoord(), y: randomCoord() }
        });
        cancelCurrentAnimation = animateNodes(graph, randomPositions, { duration: 2000 });
    }

    function circularLayout(){
        if (fa2Layout.isRunning()) fa2Worker.stopFA2();
        if (noverlapLayout.isRunning()) noverlapWorker.stopNoverlap();
        cancelCurrentAnimation = null;

        const circularPositions = circular(graph, { scale: 100 });
        cancelCurrentAnimation = animateNodes(graph, circularPositions, { duration: 2000, easing: "linear" });
    }

    
    const randomButton = document.getElementById("layout_random");
    randomButton.addEventListener("click", randomiseLayout);
    const circleButton = document.getElementById("layout_circular");
    circleButton.addEventListener("click", circularLayout);

    const inDegreeButton = document.getElementById("metric_indegree");
    const outDegreeButton = document.getElementById("metric_outdegree");
    const betweenButton = document.getElementById("metric_between");
    const closeMetricButton = document.getElementById("metric_close");
    const degreeButton = document.getElementById("metric_degree");
    const eigenButton = document.getElementById("metric_eigen");
    const pagerankButton = document.getElementById("metric_pagerank");

    inDegreeButton.addEventListener("click", () => {sortInDegree(graph);});
    outDegreeButton.addEventListener("click", () => {sortOutDegree(graph);});
    betweenButton.addEventListener("click", () => {sortBetween(graph);});
    closeMetricButton.addEventListener("click", () => {sortClose(graph);});
    degreeButton.addEventListener("click", () => { sortDegree(graph); });
    eigenButton.addEventListener("click", () => { sortEigen(graph); });
    pagerankButton.addEventListener("click", () => {sortPagerank(graph);});

    fa2Worker.startFA2();

    return graph;
}

class fa2LayoutWorker {
    stopFA2() {
        fa2Layout.stop();
        this.FA2StartLabel.style.display = "flex";
        this.FA2StopLabel.style.display = "none";
    }

    startFA2() {
        noverlapWorker.stopNoverlap();
        if (cancelCurrentAnimation) cancelCurrentAnimation();
        fa2Layout.start();
        this.FA2StartLabel.style.display = "none";
        this.FA2StopLabel.style.display = "flex";
    }

    toggleFA2Layout = () => {
        if (fa2Layout.isRunning()) {
            this.stopFA2();
        } else {
            this.startFA2();
        }
    }

    constructor() {
        this.FA2StartLabel = document.getElementById("fa2_start");
        this.FA2StopLabel = document.getElementById("fa2_stop");
        this.fa2button = document.getElementById("layout_fa2");
        this.fa2button.addEventListener("click", this.toggleFA2Layout); 
    }
}

class NoverlapWorker {
    stopNoverlap() {
        noverlapLayout.stop();
        this.NoverlapStartLabel.style.display = "flex";
        this.NoverlapStopLabel.style.display = "none";
    }

    startNoverlap() {
        fa2Worker.stopFA2();
        if (cancelCurrentAnimation) cancelCurrentAnimation();
        noverlapLayout.start();
        this.NoverlapStartLabel.style.display = "none";
        this.NoverlapStopLabel.style.display = "flex";
    }

    toggleNoverlapLayout = () => {
        if (noverlapLayout.isRunning()) {
            this.stopNoverlap();
        } else {
            this.startNoverlap();
        }
    }

    constructor() {
        this.NoverlapStartLabel = document.getElementById("noverlap_start");
        this.NoverlapStopLabel = document.getElementById("noverlap_stop");
        this.noverlapbutton = document.getElementById("layout_noverlap");
        this.noverlapbutton.addEventListener("click", this.toggleNoverlapLayout); 
    }
}

function setSearchQuery(query){
    if(query){
        query = query.toLowerCase();
        selectedNode = null;

        // Taken from https://www.sigmajs.org/storybook/?path=/story/use-reducers--story
        var ts = graph.nodes()
        .map((n) => ({ id: n, label: graph.getNodeAttribute(n, "label")}))
        .filter(({ label }) => label.toLowerCase().includes(query));

        // ditto
        if (ts.length === 1 && ts[0].label === query) {
            selectedNode = ts[0].id;
            suggestions = null;

            const nodePosition = sigmaInstance.getNodeDisplayData(selectedNode);
            sigmaInstance.getCamera().animate(nodePosition, {
            duration: 500,
            });
        } else {
            selectedNode = undefined;
            suggestions = new Set(ts.map(({ id }) => id));
        }
    } else {
        selectedNode = null;
        suggestions = null;
    }
    sigmaInstance.refresh({
        skipIndexation: true,
      });
}
