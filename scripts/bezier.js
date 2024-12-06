import * as CGUtils from './cg_utils.js';

// Draw a point on the canvas
const drawPoint = function(p, ctx, radius = 10, fill = 'black') {
	ctx.beginPath();
	ctx.arc(p.x, p.y, radius, 0, 2 * Math.PI);
	ctx.fillStyle = fill;
	ctx.fill();
}

const pointToLocal = (point, localRect) => {
	return new CGUtils.Point(point.x - localRect.left, point.y - localRect.top);
}

const canvas = $('#draw-canvas').get(0);
let canvasGlobalRect = canvas.getBoundingClientRect();
const canvasLocalRect = new DOMRect(0, 0, canvasGlobalRect.width, canvasGlobalRect.height);
const ctx = canvas.getContext('2d');

const mouse = new CGUtils.Mouse();

export const quadTree = new CGUtils.QuadTree(canvasLocalRect, canvasGlobalRect, 4);

// Update canvasGlobalRec every resize
window.addEventListener('resize', (_e) => {
	const newGlobalRect = canvas.getBoundingClientRect();
	
	canvasGlobalRect.x = newGlobalRect.x;
	canvasGlobalRect.y = newGlobalRect.y;
	canvasGlobalRect.width = newGlobalRect.width;
	canvasGlobalRect.height = newGlobalRect.height;

	quadTree.updateAllDivs();
});

// Handle user clicks
canvas.addEventListener('click', (_e) => {
	let point = pointToLocal(mouse.coords, canvasGlobalRect);
	
	drawPoint(point, ctx);

	if (quadTree.addPoint(point)) {
		console.log("Point successfully added to quadTree.");
	} else {
		console.log("Point not added!");
	}
});

$('body').on("keydown", (e) => {
	if (!e.originalEvent.repeat && e.originalEvent.key == 'q') {
		console.log(quadTree);
	}
});