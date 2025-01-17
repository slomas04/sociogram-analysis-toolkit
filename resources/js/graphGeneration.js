// Handles generation of graphs given a path
import Graph from "graphology";
import Sigma from "sigma";
import ForceSupervisor from "graphology-layout-force/worker";
import forceAtlas2 from "graphology-layout-forceatlas2";
import FA2Layout from "graphology-layout-forceatlas2/worker";
import "https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js";
import { EdgeLineProgram, EdgeRectangleProgram } from "sigma/rendering";

function getJsonData(path) {
    $.ajaxSetup({
        async: false
    });

    var jsonObj;
    $.getJSON(path, function(json){
        jsonObj = json;
    });

    $.ajaxSetup({
        async: true
    });

    return jsonObj;
  }

function randomColour(){
    return "#" + Math.floor(Math.random()*16777215).toString(16);
}

function randomCoord(){
    return (Math.random() * 10) - 5;
}


export function generateGraph(path){
    const graph = new Graph();
    var url = document.getElementsByName('base_url')[0].getAttribute('content')
    const jsonData = getJsonData(url + "/storage" + path);
    const anon = jsonData['anonymous'];
    var currentUsers = [];
    
    jsonData['users'].forEach(function(user){
        if(!currentUsers.includes(user['id'])){
            var nodeLabel = anon ? user['id'] : user['username'];
            graph.addNode(user['id'], { label: nodeLabel, x: randomCoord(), y: randomCoord(), size: 2, color: randomColour() });
            currentUsers.push(user['id']);
        }

        if(user.hasOwnProperty('following')){
            user['following'].forEach(function(fUser){
                if(!currentUsers.includes(fUser[0])){
                    var followNodeLabel = anon ? fUser[0] : fUser[1];
                    graph.addNode(fUser[0], { label: followNodeLabel, x: randomCoord(), y: randomCoord(), size: 2, color: randomColour() });
                    currentUsers.push(fUser[0]);
                }
            graph.addEdge(user['id'], fUser[0], {type: "arrow"})
            });
        }
    });

    graph.forEachNode( node => {
        var degree = graph.degree(node);
        graph.mergeNodeAttributes(node, {
          size: (degree < 5) ? 3 : degree / 15,
        });
    });

    const sensibleSettings = forceAtlas2.inferSettings(graph);
    const fa2Layout = new FA2Layout(graph, {
        settings: sensibleSettings,
      });

    fa2Layout.start();
    setInterval(function(){
        fa2Layout.stop();
    },5000);

    return graph;
}