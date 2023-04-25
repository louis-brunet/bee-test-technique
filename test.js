/** Throw an error if `val` is falsy. */
function assert (val, msg) {
    if (!val) {
        const extraMsg = msg ? `: ${msg}`: '';
        alert(`Test failed (stack trace in console)${extraMsg}`);
        throw new Error(`Assertion failed${extraMsg}`);
    }
}

/** Create a MouseEvent of the desired type. */
function mouseEvent (type, x, y, isPressed) {
    return new MouseEvent(type, {
        clientX: x,
        clientY: y,
        buttons: isPressed ? 1 : 0,
    });
}

/** Dispatch events to fully draw a rectangle (mousedown, mousemove, mouseup) */
function createRectangle (x1, y1, x2, y2) {
    const events = [
        mouseEvent('mousedown', x1, y1, true),
        mouseEvent('mousemove', x2, y2, true),
        mouseEvent('mouseup', x2, y2, false),
    ];
    const container = document.body.firstElementChild;
    events.forEach(ev => container.dispatchEvent(ev));
}

/** Return a random int between 0-500 */
function randCoord () {
    return Math.floor(Math.random() * 500);
}

/** Launch all tests sequentially  */
async function startTests () {
    const testsDiv = document.getElementsByClassName('tests')[0];
    for (const test of tests) {
        const btn = document.createElement('button');
        btn.textContent = test.name;
        btn.addEventListener('click', test.test);

        testsDiv.appendChild(btn);
    }

    if (!confirm('Lancer les tests ?')) {
        return;
    } 

    for (const test of tests) {
        // run tests synchronously so they don't interfere with each other
        await test.test();        
        console.log('Test PASSED: '+test.name);
    }
    

    console.log(`${tests.length} tests passed !`);
}

/** Define tests */
const tests = [
    { 
        name: 'Création de rectangles',
        test() {
            const container = document.body.firstElementChild;
            assert(container.childElementCount === 0);
            createRectangle(10, 10, 100, 70);
            assert(container.childElementCount === 1);
            
            const rect = container.firstElementChild;
            assert(rect.style.left === '10px');
            assert(rect.style.top === '10px');
            assert(rect.style.width === '90px');
            assert(rect.style.height === '60px');

            createRectangle(60, 100, 30, 40);
            assert(container.childElementCount === 2);
            const otherRect = rect.nextElementSibling;
            assert(otherRect.style.left === '30px');
            assert(otherRect.style.top === '40px');
            assert(otherRect.style.width === '30px');
            assert(otherRect.style.height === '60px');

            container.innerHTML = ''; // remove added rectangles;
            return true;
        },
    },
    
    { 
        name: 'Rotation et suppression',
        test() {
            const container = document.body.firstElementChild;

            assert(container.childElementCount === 0);
            createRectangle(250, 200, 100, 70);
            assert(container.childElementCount === 1);

            const rect = container.firstElementChild;
            assert(!rect.classList.contains('spin'));

            rect.dispatchEvent(new MouseEvent('dblclick'));

            assert(container.childElementCount === 1);
            assert(rect.classList.contains('spin'));

            return new Promise((resolve) => {
                setTimeout(() => {
                    assert(rect.parentElement === null);
                    resolve();
                }, 1501);
            });
        },
    },
    
    { 
        name: 'Rotation multiple',
        async test() {
            const container = document.body.firstElementChild;
            const nbRectangles = 10;
            let rect = null;

            assert(container.childElementCount === 0);
            for (let i = 0; i < nbRectangles; i++) {
                createRectangle(randCoord(), randCoord(), randCoord(), randCoord());
                
                rect = container.children[i];
                
                assert(container.childElementCount === i+1);
                
                if (i < nbRectangles / 2) {
                    rect.dispatchEvent(new MouseEvent('dblclick'));
                    assert(rect.classList.contains('spin'));
                } else {
                    assert(!rect.classList.contains('spin'));
                }
            }

            assert(container.childElementCount === nbRectangles);

            await new Promise((resolve) => {
                setTimeout(() => {
                    for (let i_1 = Math.ceil(nbRectangles / 2); i_1 < nbRectangles; i_1++) {
                        const rect_1 = container.children[i_1];
                        assert(!rect_1.classList.contains('spin'), `child ${i_1}`);
                        rect_1.dispatchEvent(new MouseEvent('dblclick'));
                        assert(rect_1.classList.contains('spin'));
                    }

                    assert(container.childElementCount === nbRectangles);
                    resolve();
                }, 800);
            });
            return await new Promise(r => {
                setTimeout(() => {
                    assert(container.childElementCount === 0);
                    r();
                }, 1501);
            });
        },
    },
];


/** Wait for DOM load to add event listeners */
if (window) {
    window.addEventListener('load', startTests);
}

