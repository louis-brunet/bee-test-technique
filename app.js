const SPIN_DURATION_MS = 1500;
let spinningRectangleCount = 0;

let currentRectangle = null;
let appContainer = null; // wait for page load to set this value

/** helper - returns mouse (x, y) viewport coordinates from a MouseEvent. */
function getPointerPosition (event) {
    return {
        x: event.clientX, 
        y: event.clientY,
    };
}

/** 
 * helper - returns true if the primary mouse button (left) was pressed
 * during the given MouseEvent 
 */
function isPrimaryButtonPressed (event) {
    return event.buttons & 1 === 1;
}

/** Event handler - start drawing a rectangle (mousedown) */
function startRectangle (event) {
    if (!isPrimaryButtonPressed(event) || currentRectangle) {
        return;
    }

    const { x, y } = getPointerPosition(event);
    currentRectangle = new Rectangle(x, y);
}

/** Event handler - update the rectangle being drawn (mousemove) */
function updateRectangle (event) {
    if (!currentRectangle) {
        return;
    }
    if (!isPrimaryButtonPressed(event)) {
        // mouseup was not captured
        endRectangle(event);
        return;
    }
    const { x, y } = getPointerPosition(event);

    // Update the element's position.
    currentRectangle.updatePosition(x, y);

    // If the element was not already added to the DOM, add it.
    // Used to prevent single clicks from generating a new element. 
    if (!currentRectangle.element.parentElement) {
        // appContainer is not null here. It was fetched after document was loaded
        appContainer.appendChild(currentRectangle.element);
    }
}

/** Event handler - finish creating the current rectangle (mouseup) */
function endRectangle (event) {
    if (!currentRectangle || isPrimaryButtonPressed(event)) {
        // no error, could have mousedown outside then mouseup inside 
        return;
    }

    currentRectangle.element.addEventListener('dblclick', startRotation);

    // reset current rectangle to null - we're done drawing for now
    currentRectangle = null; 
}

/** 
 * Event handler (mouseenter) - if the mouse button is not down, 
 * finish drawing current rectangle 
 */
function checkMouseButtonDown (event) {
    if (!currentRectangle) {
        return;
    }
    if (!isPrimaryButtonPressed(event)) {
        // Force drawing end. User has stopped dragging outside of page.
        endRectangle(event);
    }
}

/** 
 * Called when a rectangle stops spinning. Removes from the DOM the other 
 * rectangles who spun if it was the last one. 
 */
function stopRotation() {
    spinningRectangleCount--;
    if (spinningRectangleCount === 0) {
        const spinners = document.getElementsByClassName('rectangle spin');

        while (spinners.length && spinners[0]) {
            spinners[0].remove();
        }
    }
}

/** Event handler - start a rectangle's 360° rotation (dblclick) */
function startRotation (event) {
    // `this` is the element to which this event handler is bound - the rectangle div.
    this.classList.add('spin');
    this.style.animationDuration = `${SPIN_DURATION_MS}ms`;
    spinningRectangleCount++;

    setTimeout(stopRotation, SPIN_DURATION_MS);
}

/** Initial setup for when page is loaded */
function setup () {
    // get reference to container div.content
    appContainer = document.body.firstElementChild;

    // add event listeners for creating new rectangles
    appContainer.addEventListener('mousedown', startRectangle);
    appContainer.addEventListener('mousemove', updateRectangle);
    appContainer.addEventListener('mouseup', endRectangle);
    appContainer.addEventListener('mouseenter', checkMouseButtonDown);
}

// wait for DOM load
window.addEventListener('load', setup);
