let weight, visible_bias, hidden_bias;
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
    drawSetup($('canvas'), $('canvas2'), $('canvas3'));
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
            $('hoge').innerHTML = "Ready";
        })
        .catch(error => {
            console.error("Failed to load one or more JSON files:", error);
        });
}
function allClear() {
    canvasClear($('canvas'));
    canvasClear($('canvas2'));
    canvasClear($('canvas3'));
}

function $(id) {
    return document.getElementById(id);
}