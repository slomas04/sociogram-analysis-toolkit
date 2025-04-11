import louvain from "graphology-communities-louvain";
import iwanthue from "iwanthue";
import { sigmaInstance } from "./instanceManager";

var shadedColors = [];

// From user Pablo at https://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
function shadeColor(color) {
  shadedColors.forEach(function(item, index){
    if(item[0] == color){
      return item[1];
    }
  });

  var percent = 60

  var R = parseInt(color.substring(1,3),16);
  var G = parseInt(color.substring(3,5),16);
  var B = parseInt(color.substring(5,7),16);

  R = parseInt(R * (100 + percent) / 100);
  G = parseInt(G * (100 + percent) / 100);
  B = parseInt(B * (100 + percent) / 100);

  R = (R<255)?R:255;  
  G = (G<255)?G:255;  
  B = (B<255)?B:255;  

  R = Math.round(R)
  G = Math.round(G)
  B = Math.round(B)

  var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
  var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
  var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

  var returnVal = "#"+RR+GG+BB;
  shadedColors.push([color, returnVal]);
  return returnVal;
}

export function establishCommunities(graph){

    // Compute louvain communities for each node and assign as attribute
    louvain.assign(graph, { nodeCommunityAttribute: "community" });

    // Create set of every community
    const communities = new Set();
    graph.forEachNode((_, attrs) => communities.add(attrs.community));
    const communitiesArray = Array.from(communities);

    // Assign a colour to each community
    const palette = iwanthue(communities.size).reduce(
        (iter, color, i) => ({
          ...iter,
          [communitiesArray[i]]: color,
        }),
        {},
      );

    // Assign node and edge colour
    graph.forEachNode((node, attr) => graph.setNodeAttribute(node, "color", palette[attr.community]));
    graph.forEachEdge((edge, _, src) => {
        graph.setEdgeAttribute(edge, "color", shadeColor(graph.getNodeAttribute(src, "color")));
    });

    return graph;
}