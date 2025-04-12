// Handles generation of graphs given a path
import "https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js";
import Graph from "graphology";
import forceAtlas2 from "graphology-layout-forceatlas2";
import FA2Layout from "graphology-layout-forceatlas2/worker"
import NoverlapLayout from 'graphology-layout-noverlap/worker';

import { sortInDegree, sortOutDegree, sortBetween, sortClose, sortDegree, sortEigen, sortPagerank } from "./metricEvaluation.js";
import { sigmaInstance } from "./instanceManager.js";
import { establishCommunities } from "./communityAssignment.js";
import {LayoutWorker, randomiseLayout, circularLayout, circlePack} from "./layoutWorker.js";

// Global variables for state management
let fa2Worker = null;
let noverlapWorker = null;
export let suggestions = null;
let graph = null;
export let selectedNode = null;
export let hoveredNode = null;
export let clickedNeighbors = null;

async function getJsonData(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("Failed to fetch data: " + response.statusText);
    }
    return await response.json();
}

export function setHoveredNode(val){
    if (val == null){
        hoveredNode = null;
        clickedNeighbors = null;
    } else {
        hoveredNode = val;
        clickedNeighbors = new Set(graph.neighbors(val)); 
    }
    sigmaInstance.refresh({
        skipIndexation: true,
      });
}

export function randomCoord() {
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

    // First parse for adding Nodes
    jsonData['users'].forEach(function (user) {
        if (!currentUsers.includes(user['id'])) {
            var nodeLabel = anon ? user['id'] : user['username'];
            graph.addNode(user['id'], { label: nodeLabel, x: randomCoord(), y: randomCoord(), size: 2 });
            currentUsers.push(user['id']);
        }

        // Add nodes for following of each node if onlyScanned is false
        if (user.hasOwnProperty('following') && !onlyScanned) {
            user['following'].forEach(function (fUser) {
                if (!currentUsers.includes(fUser[0])) {
                    var followNodeLabel = anon ? fUser[0] : fUser[1];
                    graph.addNode(fUser[0], { label: followNodeLabel, x: randomCoord(), y: randomCoord(), size: 2 });
                    currentUsers.push(fUser[0]);
                }
            });
        }
    });

    // Second go-over for edges
    jsonData['users'].forEach(function (user) {
        if(user.hasOwnProperty('following')){
            user['following'].forEach(function (target) {

                // if onlyScanned is set, target node must already be in graph
                if (currentUsers.includes(target[0]) || !onlyScanned){
                    graph.mergeEdge(user['id'], target[0], {type: "arrow"});
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
    console.log(sensibleSettings);
    var fa2Layout = new FA2Layout(graph, {
        settings: sensibleSettings,
    });

    var noverlapLayout = new NoverlapLayout(graph, {maxIterations: 50, settings: {
        speed: 50, 
        expansion: 1.1,
        margin: 5,
        ration: 2.0,
    }});

    // Create layoutworker instances for each worker layout
    fa2Worker = new LayoutWorker({
        layoutInstance: fa2Layout,
        startLabelId: "fa2_start",
        stopLabelId: "fa2_stop",
        buttonId: "layout_fa2"
    });
    
    noverlapWorker = new LayoutWorker({
        layoutInstance: noverlapLayout,
        startLabelId: "noverlap_start",
        stopLabelId: "noverlap_stop",
        buttonId: "layout_noverlap"
    });

    
    const randomButton = document.getElementById("layout_random");
    const circleButton = document.getElementById("layout_circular");
    const packButton = document.getElementById("layout_pack");
    randomButton.addEventListener("click", () => randomiseLayout(graph));
    circleButton.addEventListener("click", () => circularLayout(graph));
    packButton.addEventListener("click", () => circlePack(graph));

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

    fa2Worker.start();

    return graph;
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

