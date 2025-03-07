import betweennessCentrality from 'graphology-metrics/centrality/betweenness';
import closenessCentrality from 'graphology-metrics/centrality/closeness';
import { degreeCentrality } from 'graphology-metrics/centrality/degree';
import eigenvectorCentrality from 'graphology-metrics/centrality/eigenvector';
import pagerank from 'graphology-metrics/centrality/pagerank';



const MIN_SIZE = 4;
const MAX_SIZE = 30;
const MINMAX_RANGE = MAX_SIZE - MIN_SIZE;
const MAX_VALUES = 20;

//Get max and min for any array
Array.prototype.max = function() {
    return Math.max.apply(null, this);
  };
  
Array.prototype.min = function() {
    return Math.min.apply(null, this);
  };

function normalizeAndSet(vals, graph){
    const vMax = vals.max();
    const vMin = vals.min();
    const vRange = vMax - vMin;

    const vNorm = vals.map(function(val) {
        return MIN_SIZE + (((val - vMin)*MINMAX_RANGE) / vRange);
    });

    let iter = 0;
    graph.forEachNode(node => {
        graph.setNodeAttribute(node, 'size', vNorm[iter]);
        iter++;
    });
}

function printSizes(graph){
    graph.forEachNode(node => {
        console.log(graph.getNodeAttribute(node, 'size'));
    });
}

function getMinMaxAttribute(graph, attribute){
    var min = Number.MAX_SAFE_INTEGER;
    var max = 0;

    graph.forEachNode(node => {
        var att = graph.getNodeAttribute(node, attribute);
        if (att > max){
            max = att;
        }
        if (att < min){
            min = att;
        }
    });

    return [min, max];
}

function normalizeSize(graph, vals, attribute){
    const vMax = vals[1];
    const vMin = vals[0];
    const vRange = vMax - vMin;

    graph.forEachNode(node => {
        graph.mergeNodeAttributes(node, {
            size: MIN_SIZE + (((graph.getNodeAttribute(node, attribute) - vMin)*MINMAX_RANGE) / vRange),
          });
    });

    //printSizes(graph);
}

export function sortInDegree(graph){
    graph.forEachNode(node => {
        graph.mergeNodeAttributes(node, {
            size: graph.inDegree(node) * 2,
          });
    });
    setDisplayBox(graph, "in-degree", "in");
}

export function sortOutDegree(graph){
    graph.forEachNode(node => {
        var deg = graph.outDegree(node)
        graph.mergeNodeAttributes(node, {
            size: (deg < 8) ? deg : deg / 8,
          });
    });
    setDisplayBox(graph, "out-degree", "out");
}

export function sortBetween(graph){
    var att = "betweennessCentrality";
    betweennessCentrality.assign(graph);
    normalizeSize(graph, getMinMaxAttribute(graph, att), att);
    setDisplayBox(graph, "betweenness centrality", att);
}

export function sortClose(graph){
    var att = "closenessCentrality";
    closenessCentrality.assign(graph);
    normalizeSize(graph, getMinMaxAttribute(graph, att), att);
    setDisplayBox(graph, "closeness centrality", att);
}

export function sortDegree(graph){
    var att = "degreeCentrality";
    degreeCentrality.assign(graph);
    normalizeSize(graph, getMinMaxAttribute(graph, att), att);
    setDisplayBox(graph, "degree centrality", att);
}

export function sortEigen(graph){
    var att = "eigenvectorCentrality";
    eigenvectorCentrality.assign(graph);
    normalizeSize(graph, getMinMaxAttribute(graph, att), att);
    setDisplayBox(graph, "eigenvector centrality", att);
}

export function sortPagerank(graph){
    var att = "pagerank";
    pagerank.assign(graph);
    normalizeSize(graph, getMinMaxAttribute(graph, att), att);
    setDisplayBox(graph, "pagerank", att);
}

function setDisplayBox(graph, method, attribute){
    var objectArray = [];

    if(attribute == "in"){
        graph.forEachNode(node => {
            var atts = graph.getNodeAttributes(node);
            objectArray.push([atts['label'], graph.inDegree(node)]);
        });
    } else if(attribute == "out"){
        graph.forEachNode(node => {
            var atts = graph.getNodeAttributes(node);
            objectArray.push([atts['label'], graph.outDegree(node)]);
        });
    } else {
        graph.forEachNode(node => {
            var atts = graph.getNodeAttributes(node);
            objectArray.push([atts['label'], Number(atts[attribute].toPrecision(3))]);
        });
    }
    
    objectArray.sort((a, b) =>  a[1] - b[1] || a[0] - b[0]).reverse();
    if(objectArray.length > MAX_VALUES){
        objectArray = objectArray.slice(0,MAX_VALUES);
    }
    Livewire.dispatch('update-toptable', {sortString: method, currentArray: objectArray});

}