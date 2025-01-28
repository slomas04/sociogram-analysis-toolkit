import louvain from "graphology-communities-louvain";
import iwanthue from "iwanthue";
import { sigmaInstance } from "./instanceManager";

export function establishCommunities(graph){

    louvain.assign(graph, { nodeCommunityAttribute: "community" });
    const communities = new Set();
    graph.forEachNode((_, attrs) => communities.add(attrs.community));
    const communitiesArray = Array.from(communities);

    const palette = iwanthue(communities.size).reduce(
        (iter, color, i) => ({
          ...iter,
          [communitiesArray[i]]: color,
        }),
        {},
      );
    graph.forEachNode((node, attr) => graph.setNodeAttribute(node, "color", palette[attr.community]));
    graph.forEachEdge((edge, _, src) => {
        graph.setEdgeAttribute(edge, "color", graph.getNodeAttribute(src, "color"));
    });

    return graph;
}