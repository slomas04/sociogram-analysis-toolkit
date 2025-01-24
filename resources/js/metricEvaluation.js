import betweennessCentrality from 'graphology-metrics/centrality/betweenness';
import closenessCentrality from 'graphology-metrics/centrality/closeness';
import { degreeCentrality } from 'graphology-metrics/centrality/degree';
import eigenvectorCentrality from 'graphology-metrics/centrality/eigenvector';
import pagerank from 'graphology-metrics/centrality/pagerank';



const MIN_SIZE = 4;
const MAX_SIZE = 30;
const MINMAX_RANGE = MAX_SIZE - MIN_SIZE;

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

export function sortInDegree(graph){
    graph.forEachNode(node => {
        graph.mergeNodeAttributes(node, {
            size: graph.inDegree(node) * 2,
          });
    });
}

export function sortOutDegree(graph){
    graph.forEachNode(node => {
        var deg = graph.outDegree(node)
        graph.mergeNodeAttributes(node, {
            size: (deg < 8) ? deg : deg / 8,
          });
    });
}

export function sortBetween(graph){
    const centralities = Object.values(betweennessCentrality(graph));
    normalizeAndSet(centralities, graph);
}

export function sortClose(graph){
    const closenesses = Object.values(closenessCentrality(graph));
    normalizeAndSet(closenesses,graph);
}

export function sortDegree(graph){
    const degreeCentralities = Object.values(degreeCentrality(graph));
    normalizeAndSet(degreeCentralities, graph);
}

export function sortEigen(graph){
    const eigens = Object.values(eigenvectorCentrality(graph));
    normalizeAndSet(eigens, graph);
}

export function sortPagerank(graph){
    const pageRanking = Object.values(pagerank(graph));
    normalizeAndSet(pageRanking, graph);
}