const loadFile = (fileURL) => {
    return fetch(fileURL)
        .then(response => response.text());
};

let gl, timeUniformLocation, mouseUniformLocation, resolutionUniformLocation, mousePos = {
    x: 0, y: 0
};

window.onload = async () => {
    const canvas = document.getElementById("canvas");
    gl = canvas.getContext("webgl");

    const vertexShaderSource = await loadFile("./vertexShader.glsl");
    const fragmentShaderSource = await loadFile("./fragmentShader.glsl");


    var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    var program = createProgram(gl, vertexShader, fragmentShader);

    var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    timeUniformLocation = gl.getUniformLocation(program, "u_time");
    mouseUniformLocation = gl.getUniformLocation(program, "u_mouse");
    resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");

    var positionBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // three 2d points
    var positions = [
        -1,-1,
        -1,1,
        1,1,

        -1,-1,
        1,-1,
        1,1
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    // Clear the canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);

    gl.enableVertexAttribArray(positionAttributeLocation);

    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

// Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = true; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
        positionAttributeLocation, size, type, normalize, stride, offset)

    window.onmousemove = (e) => {
        mousePos = {
            x: e.clientX,
            y: e.clientY
        }
    }

    gl.uniform2f(resolutionUniformLocation, canvas.clientWidth, canvas.clientHeight);

    requestAnimationFrame(anim)
};

const anim = (dt) => {
    const t = dt/1000;
    gl.uniform2f(mouseUniformLocation, mousePos.x, mousePos.y);
    gl.uniform1f(timeUniformLocation, t);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    requestAnimationFrame(anim);
}


function createShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }

    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }

    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}
