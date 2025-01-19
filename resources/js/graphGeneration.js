// Handles generation of graphs given a path
import Graph from "graphology";
import Sigma from "sigma";
import ForceSupervisor from "graphology-layout-force/worker";
import forceAtlas2 from "graphology-layout-forceatlas2";
import FA2Layout from "graphology-layout-forceatlas2/worker";
import "https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js";
import { EdgeLineProgram, EdgeRectangleProgram } from "sigma/rendering";

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
            size: (graph.inDegree(node) + 1) * 2,
          });
    });

    graph.forEachNode( node => {
        if (graph.inDegree(node) == 1 && graph.outDegree(node) == 0) {
            graph.dropNode(node);

        }
    });

    const sensibleSettings = forceAtlas2.inferSettings(graph);
    const fa2Layout = new FA2Layout(graph, {
        settings: sensibleSettings,
    });

    fa2Layout.start();
    setInterval(function () {
        fa2Layout.stop();
    }, 30000);

    return graph;
}
