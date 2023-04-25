/** Given an integer, return a CSS-compatible pixel value. */
function intToPixels (pixelVal) {
    return `${pixelVal}px`;
}

/** Return a random CSS-formatted color */
function randomColor () {
    const rand = Math.floor(Math.random() * 0xffffff).toString(16);
    return `#${rand}`; 
}

/** An immutable 2D point. */
class Point {
    #x;
    #y;

    constructor(x, y) {
        this.#x = x;
        this.#y = y;
    }

    get x() {
        return this.#x;
    }

    get y() {
        return this.#y;
    }
}


/** An updatable rectangle with an anchored corner. */
class Rectangle {
    #anchor;
    #otherCorner;
    #element;

    constructor (x, y) {
        this.#anchor = new Point(x, y);
        this.#otherCorner = this.#anchor; // Points are immutable, no problem here
        this.#element = Rectangle.#createElement();
    }

    get element() {
        return this.#element;
    }

    /** given a new corner position, update this Rectangle's size and position */
    updatePosition (cornerX, cornerY) {
        this.#otherCorner = new Point(cornerX, cornerY);
        
        this.#updateElementStyle();
    }

    /** Updates this Rectangle's corresponding element's style to match the Rectangle's attributes */
    #updateElementStyle () {
        const elem = this.#element;

        const left = Math.min(this.#anchor.x, this.#otherCorner.x);
        const top = Math.min(this.#anchor.y, this.#otherCorner.y);

        const width = Math.abs(this.#otherCorner.x - this.#anchor.x);
        const height = Math.abs(this.#otherCorner.y - this.#anchor.y);

        elem.style.left = intToPixels(left);
        elem.style.top = intToPixels(top);
        elem.style.width = intToPixels(width);
        elem.style.height = intToPixels(height);
    }

    /** Create and return a DOM element to represent a Rectangle */
    static #createElement () {
        const elem = document.createElement('div');
        elem.classList.add('rectangle');
        elem.style.backgroundColor = randomColor();

        return elem;
    }
}
