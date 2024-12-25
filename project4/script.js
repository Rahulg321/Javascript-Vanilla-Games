let rect1 = {
  x: 5,
  y: 5,
  width: 50,
  height: 50,
};

let rect2 = {
  x: 20,
  y: 30,
  width: 200,
  height: 120,
};

function doRectanglesCollide(rect1, rect2) {
  // Check for x-axis overlap
  const xOverlap =
    rect1.x + rect1.width > rect2.x && rect1.x < rect2.x + rect2.width;

  // Check for y-axis overlap
  const yOverlap =
    rect1.y + rect1.height > rect2.y && rect1.y < rect2.y + rect2.height;

  // Return true if there is overlap on both axes, false otherwise
  return xOverlap && yOverlap;
}
