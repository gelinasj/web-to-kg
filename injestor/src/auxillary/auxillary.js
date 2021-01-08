import Translate from "../drag-actions/Translate.js";
import Resize from "../drag-actions/Resize.js";

function createLine(x1, y1, x2, y2) {
    const m = (y2 - y1)/(x2 - x1);
    if (Math.abs(m) === Infinity) {
        return undefined;
    }
    return function(x) {
        return m * (x - x1) + y1
    };
}

function lteq(line, x, y) {
    return y <= line(x)
}

function gteq(line, x, y) {
    return y >= line(x)
}

function lineContainsPoint(line, refX, refY, lineX, pX, pY) {
    if(line === undefined) {
        return refX >= lineX ? pX >= lineX : pX <= lineX;
    } else {
        return (gteq(line, refX, refY) ? gteq : lteq)(line, pX, pY);
    }
}

function getPosnWithBounds(p, min=-Infinity, max=Infinity) {
    let out = p > min ? p : min;
    return out < max ? out : max;
}

function sortGraph(graph, leastToGreatest=true) {
    let graphPairs = Object.entries(graph);
    graphPairs.sort(([itemId1, graphItem1], [itemId2, graphItem2]) => {
        return (leastToGreatest ? 1 : -1) * (graphItem1.lastUpdated - graphItem2.lastUpdated);
    });
    return graphPairs;
}

function addToSubgraph(subgraph, graphItem) {
    const subgraphKeys = Object.keys(subgraph);
    const itemId = subgraphKeys.length && (Math.max(...subgraphKeys) + 1);
    subgraph[itemId] = graphItem;
    return itemId;
}

function generateAction(menuItems, subgraph, mouseX, mouseY) {
    const clickedMenuItem = menuItems.find(
        (menuItem) => menuItem.shape.containsPoint(mouseX, mouseY));
    if(clickedMenuItem !== undefined) {
        const graphItem = clickedMenuItem.createGraphItem();
        const itemId =  addToSubgraph(subgraph, graphItem);
        return new Translate(itemId, graphItem, true, mouseX, mouseY)
    } else {
        const sortedGraph = sortGraph(subgraph, false);
        const clickedResizerItem = sortedGraph.find(([itemId, graphItem]) => {
            if(graphItem.isResizable()) {
                return graphItem.getClickedResizer(mouseX, mouseY) !== undefined;
            }
            return false;
        });
        if(clickedResizerItem !== undefined) {
            const [itemId, graphItem] = clickedResizerItem;
            const [resizerId] = graphItem.getClickedResizer(mouseX, mouseY);
            return new Resize(itemId, graphItem, resizerId, mouseX, mouseY);
        } else {
            const clickedGraphItem = sortedGraph.find(([itemId, graphItem]) => {
                return graphItem.containsPoint(mouseX, mouseY);
            });
            if(clickedGraphItem !== undefined) {
                const [itemId, graphItem] = clickedGraphItem;
                return new Translate(itemId, graphItem, false, mouseX, mouseY);
            }
        }
    }
    return null;
}

function setIntersection(set1, set2) {
    return set1.filter((item) => set2.includes(item));
}

function cloneSubgraph(graph) {
  let alreadyCloned = [];
  let clonedGraph = {};
  Object.entries(graph).forEach(([key, graphItem]) => {
    const clonedGraphItem = graphItem.clone(alreadyCloned);
    clonedGraph[key] = clonedGraphItem;
  });
  return clonedGraph;
}

function getClone(item, alreadyCloned) {
  const foundPair = alreadyCloned.find(([foundItem, clone]) => item === foundItem);
  if(foundPair === undefined) {
    return undefined;
  } else {
    return foundPair[1];
  }
}

function getOrCreate(map, key, valIfEmpty) {
  let val = map[key];
  if(val === undefined) {
    map[key] = valIfEmpty;
    return valIfEmpty;
  } else {
    return val;
  }
}

function max(arr, comparator) {
  if(arr.length === 0) {
    return undefined;
  }
  let max = arr[0];
  arr.slice(0).forEach((item) => {
    max = comparator(item, max) > 0 ? item : max;
  });
  return max;
}

export {
  getClone, createLine, lteq, gteq, cloneSubgraph,
  lineContainsPoint, getPosnWithBounds, getOrCreate,
  sortGraph, generateAction, setIntersection, max
};
