prevX = 0;
prevY = 0;
mouseDown = false;

function expected_hidden(matrix, vector, bias) {
    if (matrix.length !== vector.length) {
        throw new Error("行列の行数とベクトルの次元が一致しません");
    }

    let result = Array(matrix[0].length).fill(0);
    for (let j = 0; j < matrix[0].length; j++) {
        for (let i = 0; i < matrix.length; i++) {
            result[j] += matrix[i][j] * vector[i];
        }
    }
    for (let i = 0; i < result.length; i++) {
        result[i] += bias[i];
    }
    result = result.map(x => 1.0 / (1.0 + Math.exp(-x)));
    return result;
}

function expected_visible(matrix, vector, bias) {

    let result = Array(matrix.length).fill(0);
    for (let j = 0; j < matrix[0].length; j++) {
        for (let i = 0; i < matrix.length; i++) {
            result[i] += matrix[i][j] * vector[j];
        }
    }
    for (let i = 0; i < result.length; i++) {
        result[i] += bias[i];
    }
    result = result.map(x => 1.0 / (1.0 + Math.exp(-x)));
    return result;
}

function reconstruct(canvas, canvas_input, canvas_output) {
    if (!ready) {
        return;
    }
    visible = makedata(canvas, 28);
    data2canvas(visible, 28, canvas_input);
    e_hidden = expected_hidden(weight, visible, hidden_bias);
    e_visible = expected_visible(weight, e_hidden, visible_bias);
    data2canvas(e_hidden, 8, canvas_hidden);
    data2canvas(e_visible, 28, canvas_output);
}

function drawSetup(canvas_draw, canvas_input, canvas_output, canvas_hidden) {
    e_hidden = new Float32Array(8 * 8);
    canvas_draw.getContext('2d', { willReadFrequently: true });
    canvas_input.getContext('2d', { willReadFrequently: true });
    canvas_output.getContext('2d', { willReadFrequently: true });
    canvas_hidden.getContext('2d', { willReadFrequently: true });
    canvas_draw.onmousedown = function (e) {
        var r = canvas_draw.getBoundingClientRect();
        prevX = e.clientX - r.left;
        prevY = e.clientY - r.top;
        mouseDown = true;
    }
    canvas_draw.onmousemove = function (e) {
        if (mouseDown) {
            var r = canvas_draw.getBoundingClientRect();
            var x = e.clientX - r.left;
            var y = e.clientY - r.top;
            draw(x, y, canvas_draw);
            reconstruct(canvas_draw, canvas_input, canvas_output);
        }
    }
    canvas_draw.onmouseup = function (e) {
        mouseDown = false;
        reconstruct(canvas_draw, canvas_input, canvas_output);
    }

    canvas_hidden.onclick = function (e) {
        var r = canvas_hidden.getBoundingClientRect();
        var x = e.clientX - r.left;
        var y = e.clientY - r.top;
        var h = canvas_hidden.height;
        var m = h / 8;
        x = Math.floor(x / m);
        y = Math.floor(y / m);
        var index = x + y * 8;
        var v = e_hidden[index];
        if (v > 0.5) {
            e_hidden[index] = 0.0;
        } else {
            e_hidden[index] = 1.0;
        }
        e_visible = expected_visible(weight, e_hidden, visible_bias);
        data2canvas(e_hidden, 8, canvas_hidden);
        data2canvas(e_visible, 28, canvas_output);
    }

}

function draw(x, y, canvas) {
    var context = canvas.getContext('2d');
    context.strokeStyle = "white";
    var w = 15;
    context.lineWidth = w;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.beginPath();
    context.moveTo(prevX, prevY);
    context.lineTo(x, y);
    context.closePath();
    context.stroke();
    prevX = x;
    prevY = y;
}

function makedata(canvas, size) {
    var h = canvas.height;
    var w = canvas.width;
    img = canvas.getContext('2d').getImageData(0, 0, h, w);
    var data = new Float32Array(size * size);
    data.fill(0.0);
    var m = h / size;
    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            var sum = 0;
            for (var k = 0; k < m; k++) {
                for (var l = 0; l < m; l++) {
                    x = i * m + k;
                    y = j * m + l;
                    var s = x + y * m * size;
                    if (img.data[s * 4] > 128) {
                        sum++;
                    }
                }
            }
            data[i + size * j] = 1.0 * sum / m / m;
        }
    }
    return data;
}

function data2canvas(data, size, canvas) {
    var h = canvas.height;
    var w = canvas.width;
    var m = h / size;
    img = canvas.getContext('2d').getImageData(0, 0, h, w);
    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            var sum = data[i + size * j] * 256;
            for (var k = 0; k < m; k++) {
                for (var l = 0; l < m; l++) {
                    x = i * m + k;
                    y = j * m + l;
                    var s = x + y * m * size;
                    img.data[s * 4] = sum;
                    img.data[s * 4 + 1] = sum;
                    img.data[s * 4 + 2] = sum;
                    img.data[s * 4 + 3] = 255;
                }
            }
        }
    }
    canvas.getContext('2d').putImageData(img, 0, 0);
}

function canvasClear(canvas) {
    e_visible.fill(0);
    e_hidden.fill(0);
    var context = canvas.getContext('2d');
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);
}

