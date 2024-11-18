let weight, visible_bias, hidden_bias;
let ready = false;
function loadJSON(fileName) {
    return fetch(fileName)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load ${fileName}`);
            }
            return response.json();
        })
        .catch(error => {
            console.error(`Error loading ${fileName}:`, error);
            throw error;
        });
}

function initialize() {
    drawSetup($('canvas_draw'), $('canvas_input'), $('canvas_output'), $('canvas_hidden'));
    Promise.all([
        loadJSON('w.json'), // w.jsonを読み込む
        loadJSON('b.json'), // b.jsonを読み込む
        loadJSON('c.json')  // c.jsonを読み込む
    ])
        .then(([w, b, c]) => {
            weight = w;
            visible_bias = b;
            hidden_bias = c;
            console.log(hidden_bias);
            ready = true;
        })
        .catch(error => {
            console.error("Failed to load one or more JSON files:", error);
        });
}
function allClear() {
    canvasClear($('canvas_draw'));
    canvasClear($('canvas_input'));
    canvasClear($('canvas_output'));
    canvasClear($('canvas_hidden'));
}

function $(id) {
    return document.getElementById(id);
}