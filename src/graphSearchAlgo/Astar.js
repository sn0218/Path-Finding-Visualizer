/* Implementation of A* search algorithm referenced from 
https://briangrinstead.com/blog/astar-search-algorithm-in-javascript/ 
https://en.wikipedia.org/wiki/A*_search_algorithm

*/

const Astar = (start, end) => {
  // keep the node remained to be explored
  let openList = [];

  // keep the explored nodes
  let closedList = [];

  let visited = [];

  openList.push(start);

  // search for lowest f(x)
  while (openList.length > 0) {
    let lowIndex = 0;
    for (let i = 0; i < openList.length; i++) {
      if (openList[i].f < openList[lowIndex].f) {
        lowIndex = i;
      }
    }
    let currentNode = openList[lowIndex];

    // add the currentNode to visited nodes
    visited.push(currentNode);

    // return the path when it has been found
    if (currentNode === end) {
      let cur = currentNode;

      let pathNodes = [];

      while (cur.parent) {
        pathNodes.push(cur);
        cur = cur.parent;
      }
      pathNodes.reverse();
      console.log('The path is found!');
      console.log(pathNodes);

      return { pathNodes, visited };
    }

    // remove current node from openList and push currentNode to closeList
    openList = openList.filter((el) => el !== currentNode);
    closedList.push(currentNode);

    // get currentNode neighbours
    let neighbours = currentNode.neighbours;

    for (let i = 0; i < neighbours.length; i++) {
      let neighbour = neighbours[i];

      // check if valid node to proccess
      if (closedList.includes(neighbour) || neighbour.isWall) {
        // skip to the next neighbour if it is in closedList
        continue;
      }
      // update the gScore if arriving the neighbour of currentNode is the shortest one
      let temp_gScore = currentNode.g + 1;
      let gScoreIsBest = false;

      // check neighbour is not in openList that the node is first arrived
      if (!openList.includes(neighbour)) {
        // find the current best gScore
        gScoreIsBest = true;
        // save the hScore of this neighbour
        neighbour.h = heuristic(neighbour, end);
        openList.push(neighbour);
      }

      // neighbour in openlist has explored to check if it has a better gScore
      else if (temp_gScore < neighbour.g) {
        gScoreIsBest = true;
      }

      // currently find an optimal path for this node
      if (gScoreIsBest) {
        neighbour.parent = currentNode;
        neighbour.g = temp_gScore;
        neighbour.f = neighbour.g + neighbour.h;
      }
    }
  }
  // no path return empty array
  let pathNodes = [];
  return { pathNodes, visited };
};

const heuristic = (p1, p2) => {
  // evaluate the Manhattan distance
  let d1 = Math.abs(p1.x - p2.x);
  let d2 = Math.abs(p1.y - p2.y);
  return d1 + d2;
};

export default Astar;
