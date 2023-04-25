function assert(val, msg) {
    if (!val) {
        throw new Error(`Assertion failed${msg ? `: ${msg}`: '' }`);
    }
}

function mouseEvent(type, x, y, isPressed) {
    return new MouseEvent(type, {
        clientX: x,
        clientY: y,
        buttons: isPressed ? 1 : 0,
    });
}
function startTests () {
    const createRectangle = [
        mouseEvent('mousedown', 10, 10, true),
        mouseEvent('mousemove', 50, 20, true),
        mouseEvent('mouseup', 100, 100, false),
    ]
    const container = document.body.firstElementChild;
    createRectangle.forEach(ev => container.dispatchEvent(ev));
}

window.addEventListener('load', startTests);
