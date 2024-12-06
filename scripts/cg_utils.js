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
	constructor(rect, globalRec, capacity, level = 0) {
		this.rect = rect; // The local rectangle that represents the bounds of the current node
		this.nodeCapacity = capacity; // Max of points per node
		this.points = []; // The points inside the node
		this.childs = []; // Childs of this node (subdivisions)
		
		this.globalRec = globalRec; // The global rectangle of the canvas
		this.level = level; // The level of this node in the tree
		this.outlineDiv = this.#createOutlineDiv(); // The div that contains the outline of the node bounds

		this.#updateDiv();
	}

	// Colors for the divs per level
	#divColors = ['red', 'green', 'blue', 'yellow', 'purple', 'orange', 'pink', 'brown', 'gray', 'cyan'];

	#haveChilds() {
		return this.childs.length > 0;
	}

	#addPointToChilds(point) {
		for (const c of this.childs) {
			if (point.isInsideRectangle(c.rect)) {
				return c.addPoint(point);
			}
		}
	}

	// Insert a point into the quadtree
	addPoint(point) {
		// First, we need to check if this node have childs (subdivisions)
		if (this.#haveChilds()) {
			// If yes, then we will add this point in the correct subdivision
			return this.#addPointToChilds(point);
		// If this node doesn't have a subdivision we will add the point here, if it's inside the bounds
		} else if (point.isInsideRectangle(this.rect)) {
			if (this.points.length < this.nodeCapacity) {
				this.points.push(point);
				return true;
			} else {
				this.#subdivide();
				console.log("QuadTree subdivided.");
				return this.#addPointToChilds(point);
			}
		// If the process failed, the point is probably out of bounds
		} else {
			return false;
		}
	}

	#subdivide() {
		const x = this.rect.x;
		const y = this.rect.y;
		const w = this.rect.width;
		const h = this.rect.height;
		const hw = this.rect.width / 2.0;
		const hh = this.rect.height / 2.0;

		// Print these values
		console.log(`x: ${x}, y: ${y}, w: ${w}, h: ${h}, hw: ${hw}, hh: ${hh}`);
		
		// Create new divisions
		const TL = new QuadTree(new DOMRect(x, y, hw, hh), this.globalRec, this.nodeCapacity, this.level + 1); // Top-Left
		const TR = new QuadTree(new DOMRect(x + hw, y, hw, hh), this.globalRec, this.nodeCapacity, this.level + 1); // Top-Right
		const BL = new QuadTree(new DOMRect(x, y + hh, hw, hh), this.globalRec, this.nodeCapacity, this.level + 1); // Bottom-Left
		const BR = new QuadTree(new DOMRect(x + hw, y + hh, hw, hh), this.globalRec, this.nodeCapacity, this.level + 1); // Bottom-Right

		// Add to childs array
		this.childs.push(TL, TR, BL, BR);

		// Move the points to the correct subdivisions
		while (this.points.length > 0) {
			let p = this.points.shift();
			this.#addPointToChilds(p);
		}
	}

	// Debug function to print the tree
	print() {
		console.log(this);
		for (const c of this.childs) {
			c.print();
		}
	}

	// Debug function to create the outline div
	#createOutlineDiv() {
		const div = $(document.createElement('div'));

		div.attr('class', 'quadtree-outline');
		div.css('border-color', this.#divColors[this.level % this.#divColors.length]);
		$('#quadtree-outline-container').append(div);

		return div;
	}

	// Updates the outline div of the node to match the current position
	#updateDiv() {
		$(this.outlineDiv).css(
			{
				left: this.rect.x + this.globalRec.x,
				top: this.rect.y + this.globalRec.y,
				width: this.rect.width,
				height: this.rect.height,
			}
		);
	}

	updateAllDivs() {
		this.#updateDiv();
		for (const c of this.childs) {
			c.updateAllDivs();
		}
	}
}

export function lerp(from, to, amount) {
	return from.mult(1 - amount).add(to.mult(amount));
}

// Check if a point is inside a rectangle
export function isPointInsideRectangle(point, rect) {
	return point.x >= rect.left && point.x <= rect.right && point.y >= rect.top && point.y <= rect.bottom;
}