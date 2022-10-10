const bfs = (start, end) => {
  let queue = [];
  let explored = new Set();
  let visited = [];
  queue.push(start);
  explored.add(start);

  while (queue.length > 0) {
    // get the first element from queue
    let currentNode = queue.shift();

    if (currentNode.isWall) {
      continue;
    }
    visited.push(currentNode);
    explored.add(currentNode);

    if (currentNode === end) {
      let pathNodes = [];

      let cur = currentNode;
      while (cur.parent) {
        pathNodes.push(cur.parent);
        cur = cur.parent;
      }
      console.log('path is found!');
      console.log(pathNodes);
      console.log(visited);
      return { pathNodes, visited };
    }

    let neighbours = currentNode.neighbours;

    for (let i = 0; i < neighbours.length; i++) {
      let neighbour = neighbours[i];

      // skip the neighbour if it has been explored or it is wall
      if (explored.has(neighbour) || neighbour.isWall) {
        continue;
      }
      explored.add(neighbour);
      neighbour.parent = currentNode;
      queue.push(neighbour);
    }
  }

  // return empty list if no path
  let pathNodes = [];
  return { pathNodes, visited };
};

export default bfs;
