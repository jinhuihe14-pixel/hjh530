import { navNodes, getNodeById } from '@/data/navigation';
import type { NavNode, NavRoute } from '@/types';

interface AStarNode {
  node: NavNode;
  g: number;
  h: number;
  f: number;
  parent: AStarNode | null;
}

function heuristic(a: NavNode, b: NavNode): number {
  const dx = a.position.x - b.position.x;
  const dy = a.position.y - b.position.y;
  const dz = a.position.z - b.position.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

function getDistance(a: NavNode, b: NavNode): number {
  const dx = a.position.x - b.position.x;
  const dy = a.position.y - b.position.y;
  const dz = a.position.z - b.position.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

function getTransitionCost(node: NavNode): number {
  if (node.type === 'elevator') return 30;
  if (node.type === 'escalator') return 15;
  return 0;
}

export function findPath(startId: string, endId: string): NavRoute | null {
  const startNode = getNodeById(startId);
  const endNode = getNodeById(endId);

  if (!startNode || !endNode) return null;

  const openSet: AStarNode[] = [];
  const closedSet: Set<string> = new Set();

  const startAStar: AStarNode = {
    node: startNode,
    g: 0,
    h: heuristic(startNode, endNode),
    f: heuristic(startNode, endNode),
    parent: null,
  };

  openSet.push(startAStar);

  while (openSet.length > 0) {
    openSet.sort((a, b) => a.f - b.f);
    const current = openSet.shift()!;

    if (current.node.id === endId) {
      const nodes: NavNode[] = [];
      let c: AStarNode | null = current;
      while (c) {
        nodes.unshift(c.node);
        c = c.parent;
      }

      const floorTransitions: { from: string; to: string; type: string }[] = [];
      let totalDistance = 0;

      for (let i = 0; i < nodes.length - 1; i++) {
        totalDistance += getDistance(nodes[i], nodes[i + 1]);
        if (nodes[i].floorId !== nodes[i + 1].floorId) {
          floorTransitions.push({
            from: nodes[i].floorId,
            to: nodes[i + 1].floorId,
            type: nodes[i + 1].type,
          });
        }
      }

      return {
        nodes,
        totalDistance: Math.round(totalDistance),
        estimatedTime: Math.ceil(totalDistance / 80),
        floorTransitions,
      };
    }

    closedSet.add(current.node.id);

    for (const neighborId of current.node.neighbors) {
      if (closedSet.has(neighborId)) continue;

      const neighbor = getNodeById(neighborId);
      if (!neighbor) continue;

      const transitionCost = getTransitionCost(neighbor);
      const g = current.g + getDistance(current.node, neighbor) + transitionCost;
      const h = heuristic(neighbor, endNode);
      const f = g + h;

      const existing = openSet.find((n) => n.node.id === neighborId);
      if (existing) {
        if (g < existing.g) {
          existing.g = g;
          existing.f = f;
          existing.parent = current;
        }
      } else {
        openSet.push({
          node: neighbor,
          g,
          h,
          f,
          parent: current,
        });
      }
    }
  }

  return null;
}

export function findNearestNode(
  x: number,
  y: number,
  z: number,
  floorId?: string
): NavNode | null {
  let nearest: NavNode | null = null;
  let minDist = Infinity;

  const candidates = floorId
    ? navNodes.filter((n) => n.floorId === floorId)
    : navNodes;

  for (const node of candidates) {
    const dx = node.position.x - x;
    const dy = node.position.y - y;
    const dz = node.position.z - z;
    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

    if (dist < minDist) {
      minDist = dist;
      nearest = node;
    }
  }

  return nearest;
}
