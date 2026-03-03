"use strict";

let gl;

function degToRad(deg) {
  return (deg * Math.PI) / 180;
}

function multiply(a, b) {
  const out = new Float32Array(16);
  for (let col = 0; col < 4; col += 1) {
    for (let row = 0; row < 4; row += 1) {
      out[col * 4 + row] =
        a[0 * 4 + row] * b[col * 4 + 0] +
        a[1 * 4 + row] * b[col * 4 + 1] +
        a[2 * 4 + row] * b[col * 4 + 2] +
        a[3 * 4 + row] * b[col * 4 + 3];
    }
  }
  return out;
}

function translation(tx, ty, tz) {
  return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, tx, ty, tz, 1]);
}

function scaling(sx, sy, sz) {
  return new Float32Array([sx, 0, 0, 0, 0, sy, 0, 0, 0, 0, sz, 0, 0, 0, 0, 1]);
}

function rotationX(rad) {
  const c = Math.cos(rad);
  const s = Math.sin(rad);
  return new Float32Array([1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1]);
}

function rotationY(rad) {
  const c = Math.cos(rad);
  const s = Math.sin(rad);
  return new Float32Array([c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1]);
}

function rotationZ(rad) {
  const c = Math.cos(rad);
  const s = Math.sin(rad);
  return new Float32Array([c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
}

function perspective(fovyRad, aspect, near, far) {
  const f = 1 / Math.tan(fovyRad / 2);
  const nf = 1 / (near - far);
  return new Float32Array([
    f / aspect,
    0,
    0,
    0,
    0,
    f,
    0,
    0,
    0,
    0,
    (far + near) * nf,
    -1,
    0,
    0,
    2 * far * near * nf,
    0,
  ]);
}

function orthographic(left, right, bottom, top, near, far) {
  const lr = 1 / (left - right);
  const bt = 1 / (bottom - top);
  const nf = 1 / (near - far);
  return new Float32Array([
    -2 * lr,
    0,
    0,
    0,
    0,
    -2 * bt,
    0,
    0,
    0,
    0,
    2 * nf,
    0,
    (left + right) * lr,
    (top + bottom) * bt,
    (far + near) * nf,
    1,
  ]);
}

function createCube() {
  const vertices = [
    -0.55, -0.55, 0.55, 1, 0, 0, 0.55, -0.55, 0.55, 1, 0, 0, 0.55, 0.55, 0.55,
    1, 0, 0, -0.55, 0.55, 0.55, 1, 0, 0,

    -0.55, -0.55, -0.55, 0, 1, 0, -0.55, 0.55, -0.55, 0, 1, 0, 0.55, 0.55,
    -0.55, 0, 1, 0, 0.55, -0.55, -0.55, 0, 1, 0,

    -0.55, 0.55, -0.55, 0, 0, 1, -0.55, 0.55, 0.55, 0, 0, 1, 0.55, 0.55, 0.55,
    0, 0, 1, 0.55, 0.55, -0.55, 0, 0, 1,

    -0.55, -0.55, -0.55, 1, 1, 0, 0.55, -0.55, -0.55, 1, 1, 0, 0.55, -0.55,
    0.55, 1, 1, 0, -0.55, -0.55, 0.55, 1, 1, 0,

    0.55, -0.55, -0.55, 1, 0, 1, 0.55, 0.55, -0.55, 1, 0, 1, 0.55, 0.55, 0.55,
    1, 0, 1, 0.55, -0.55, 0.55, 1, 0, 1,

    -0.55, -0.55, -0.55, 0, 1, 1, -0.55, -0.55, 0.55, 0, 1, 1, -0.55, 0.55,
    0.55, 0, 1, 1, -0.55, 0.55, -0.55, 0, 1, 1,
  ];

  const indices = [
    0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14,
    15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23,
  ];

  return { vertices, indices };
}

function createOctahedron() {
  const p0 = [0, 0.9, 0];
  const p1 = [0.9, 0, 0];
  const p2 = [0, 0, 0.9];
  const p3 = [-0.9, 0, 0];
  const p4 = [0, 0, -0.9];
  const p5 = [0, -0.9, 0];

  const faceDefs = [
    [p0, p1, p2, [0.75, 0.05, 0.05]],
    [p0, p2, p3, [0.05, 0.6, 0.05]],
    [p0, p3, p4, [0.1, 0.35, 0.9]],
    [p0, p4, p1, [0.1, 0.8, 0.8]],
    [p5, p2, p1, [0.95, 0.95, 0.05]],
    [p5, p3, p2, [0.95, 0.1, 0.95]],
    [p5, p4, p3, [0.9, 0.45, 0.1]],
    [p5, p1, p4, [0.45, 0.2, 0.95]],
  ];

  const vertices = [];
  const indices = [];

  for (let i = 0; i < faceDefs.length; i += 1) {
    const [a, b, c, color] = faceDefs[i];
    const base = i * 3;

    vertices.push(
      a[0],
      a[1],
      a[2],
      color[0],
      color[1],
      color[2],
      b[0],
      b[1],
      b[2],
      color[0],
      color[1],
      color[2],
      c[0],
      c[1],
      c[2],
      color[0],
      color[1],
      color[2],
    );

    indices.push(base, base + 1, base + 2);
  }

  return { vertices, indices };
}

function createMesh(webglHelper, meshData) {
  const vao = setVAO();

  const vertexBuffer = SetBuffer(meshData.vertices);
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  SetAttribute(webglHelper, "aPosition", 3, 6, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  SetAttribute(webglHelper, "aColor", 3, 6, 3);

  SetIndexBuffer(meshData.indices);

  unbindVAO();

  return {
    vao,
    indexCount: meshData.indices.length,
  };
}

function drawMesh(webglHelper, mesh, modelMatrix) {
  setUniformMatrix4fv(webglHelper, "uModel", modelMatrix);
  bindVAO(mesh.vao);
  gl.drawElements(gl.TRIANGLES, mesh.indexCount, gl.UNSIGNED_SHORT, 0);
  unbindVAO();
}

function main() {
  const canvas = document.getElementById("glCanvas");
  gl = canvas.getContext("webgl2");

  if (!gl) {
    console.error("WebGL2 is not available in this browser.");
    return;
  }

  const webglHelper = new WebGL();

  const cubeMesh = createMesh(webglHelper, createCube());
  const octMesh = createMesh(webglHelper, createOctahedron());

  const aspect = canvas.width / canvas.height;
  const orthoHalfHeight = 4.0;
  const orthoHalfWidth = orthoHalfHeight * aspect;
  const projection = orthographic(
    -orthoHalfWidth,
    orthoHalfWidth,
    -orthoHalfHeight,
    orthoHalfHeight,
    0.1,
    100,
  );
  const view = translation(0, 0, -10);

  setUniformMatrix4fv(webglHelper, "uProjection", projection);
  setUniformMatrix4fv(webglHelper, "uView", view);

  let animateOctahedrons = false;
  let animateCube = false;

  canvas.addEventListener("contextmenu", (event) => {
    event.preventDefault();
  });

  canvas.addEventListener("mousedown", (event) => {
    if (event.button === 0) {
      animateCube = !animateCube;
    } else if (event.button === 2) {
      animateOctahedrons = !animateOctahedrons;
    }
  });

  const state = {
    tlY: 0,
    blX: 0,
    trZ: 0,
    brA: 0,
    cubeY: 0,
    cubeX: 0,
    cubeDir: 1,
    brScale: 1,
    brScaleDir: 1,
    brReachedMax: false,
  };

  const cornerX = 4.2;
  const cornerY = 2.8;

  let prevTime = 0;

  function frame(nowMs) {
    const now = nowMs * 0.001;
    if (prevTime === 0) {
      prevTime = now;
    }
    const dt = Math.min(now - prevTime, 0.05);
    prevTime = now;

    if (animateOctahedrons) {
      state.tlY += dt * 1.2;
      state.blX += dt * 1.2;
      state.trZ += dt * 1.2;
      state.brA += dt * 1.0;

      if (!state.brReachedMax) {
        state.brScale += dt * 0.45;
        if (state.brScale >= 1.5) {
          state.brScale = 1.5;
          state.brScaleDir = -1;
          state.brReachedMax = true;
        }
      } else {
        state.brScale += dt * 0.45 * state.brScaleDir;
        if (state.brScale <= 0.5) {
          state.brScale = 0.5;
          state.brScaleDir = 1;
        } else if (state.brScale >= 1.5) {
          state.brScale = 1.5;
          state.brScaleDir = -1;
        }
      }
    }

    if (animateCube) {
      state.cubeY += dt * 1.4;
      state.cubeX += dt * 0.9 * state.cubeDir;
      if (state.cubeX >= 1) {
        state.cubeX = 1;
        state.cubeDir = -1;
      } else if (state.cubeX <= -1) {
        state.cubeX = -1;
        state.cubeDir = 1;
      }
    }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.87, 0.87, 0.87, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const tl = multiply(
      translation(-cornerX, cornerY, 0),
      rotationY(state.tlY),
    );
    const bl = multiply(
      translation(-cornerX, -cornerY, 0),
      rotationX(state.blX),
    );
    const tr = multiply(translation(cornerX, cornerY, 0), rotationZ(state.trZ));
    const br = multiply(
      translation(cornerX, -cornerY, 0),
      multiply(
        rotationX(state.brA),
        multiply(
          rotationY(state.brA * 0.8),
          scaling(state.brScale, state.brScale, state.brScale),
        ),
      ),
    );

    const cubeModel = multiply(
      translation(state.cubeX, 0, 0),
      rotationY(state.cubeY),
    );

    drawMesh(webglHelper, octMesh, tl);
    drawMesh(webglHelper, octMesh, bl);
    drawMesh(webglHelper, octMesh, tr);
    drawMesh(webglHelper, octMesh, br);
    drawMesh(webglHelper, cubeMesh, cubeModel);

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

main();
