const dfs = (start, end) => {
  let stack = [];
  let explored = new Set();
  let visited = [];
  stack.push(start);
  explored.add(start);

  while (stack.length > 0) {
    // pop the element from stack
    let currentNode = stack.pop();

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
      stack.push(neighbour);
    }
  }

  // return empty list if no path
  let pathNodes = [];
  return { pathNodes, visited };
};

export default dfs;
