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
const canvasGlobalRect = canvas.getBoundingClientRect();
const canvasLocalRect = new DOMRect(0, 0, canvasGlobalRect.width, canvasGlobalRect.height);
const ctx = canvas.getContext('2d');

const mouse = new CGUtils.Mouse();

const quadTree = new CGUtils.QuadTree(canvasLocalRect, 4);

// Handle user clicks
canvas.addEventListener('click', (_e) => {
	let point = pointToLocal(mouse.coords, canvasGlobalRect);
	drawPoint(point, ctx);

	console.log(point);
	
	if (quadTree.addPoint(point)) {
		console.log("point added to quadTree");
	} else {
		console.log("point not added!");
	}
});

$('body').on("keydown", (e) => {
	if (!e.originalEvent.repeat && e.originalEvent.key == 'p') {
		console.log(quadTree);
	}
});