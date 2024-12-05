
export class Mouse {
	#mouseCoords = {x: 0, y: 0};
	
	constructor() {
		// Monitor mouse movement
		document.addEventListener('mousemove', (e) => {
			this.#mouseCoords = {x: e.clientX, y: e.clientY};
		});
	}
	
	get coords() {
		return this.#mouseCoords;
	}
}

export class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	mult(factor) {
		return new Point(this.x * factor, this.y * factor);
	}

	add(point) {
		return new Point(this.x + point.x, this.y + point.y);
	}

	isInsideRectangle(rect) {
		return this.x >= rect.left && this.x <= rect.right && this.y >= rect.top && this.y <= rect.bottom;
	}
}

export class QuadTree {
	constructor(rect, capacity) {
		this.rect = rect; // The rectangle that represents the bounds of the current node
		this.nodeCapacity = capacity; // Max of points per node
		this.points = []; // The points inside the node
		this.childs = []; // Childs of this node (subdivisions)
	}

	#haveChilds() {
		return this.childs.length > 0;
	}

	// Insert a point into the quadtree
	addPoint(point) {
		// First, we need to check if this node have childs (subdivisions)
		if (this.#haveChilds()) {
			// If yes, then we will add this point in the correct subdivision
			for (const c of this.childs) {
				if (point.isInsideRectangle(c.rect)) {
					return c.addPoint(point);
				}
			}
		// If this node doesn't have a subdivision we will add the point here, if it's inside the bounds
		} else if (point.isInsideRectangle(this.rect)) {
			// Check node capacity
			if (this.points.length < this.nodeCapacity) {
				this.points.push(point);
				return true;
			} else {
				// Subdivide if needed
				console.log("Subdivided");
				return this.#subdivide();
			}
		// If the process failed, the point is probably out of bounds
		} else {
			return false;
		}
	}

	#subdivide() {
		// const halfWidth = this.rect.
	}
}


export function lerp(from, to, amount) {
	return from.mult(1 - amount).add(to.mult(amount));
}

// Check if a point is inside a rectangle
export function isPointInsideRectangle(point, rect) {
	return point.x >= rect.left && point.x <= rect.right && point.y >= rect.top && point.y <= rect.bottom;
}