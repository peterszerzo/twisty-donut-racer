import { car } from "./Car"
import { moebius } from "./Moebius"
import { createProgram } from "./webgl-utils"

/**
 * Game state object. Mutated by keyboard interactions.
 */
const gameState = {
  acceptKeys: true,
  lateralPosition: {
    current: 0,
    target: 0
  },
  verticalPosition: {
    current: 1,
    target: 1
  }
}

const { Matrix4 } = global

/**
 * Vertex shader source.
 */
const vertexShaderSource = `
uniform mat4 u_Perspective;
uniform mat4 u_Transform;
uniform vec3 u_LightDirection;
attribute vec4 a_Position;
attribute vec4 a_Normal;
attribute vec4 a_Color;
varying vec4 v_Color;
void main() {
  vec4 lightDirection = normalize(vec4(u_LightDirection, 0.0));
  gl_Position = u_Perspective * (u_Transform * a_Position);
  float brightness = 0.55 - dot(lightDirection, normalize(a_Normal)) * 0.45;
  v_Color = a_Color * brightness;
}
`

/**
 * Fragment shader source.
 */
const fragmentShaderSource = `
precision mediump float;
varying vec4 v_Color;
void main() {
  gl_FragColor = v_Color;
}
`

let gl

// Entry point
export function create (canvas) {
  gl = canvas.getContext('webgl')
  createProgram(gl, vertexShaderSource, fragmentShaderSource)
  setLight(gl)
  setTransform(gl)
  document.addEventListener('keydown', handleKeyDown)
  return gl
}

export function update (ticks) {
  setPerspective(gl, ticks)
  gl.clearColor(0, 0, 0, 0)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  animateLateralPosition()
  drawShape(gl, moebius)
  drawShape(gl, car, transformCar(
    ticks / 50,
    gameState.lateralPosition.current,
    gameState.verticalPosition.current
  ))
}

/**
 * Compute car transform matrix.
 * @param {float} angle - Angle around the Moebius strip, in Radians.
 * @param {lateralPosition} - Normalized position along the width of the strip. Varies between +1 and -1.
 * @param {verticalPosition} - Normalized vertical position, varying between -1 and +1. These two values correspond to the two sides of the strip as the vehicle ascends.
 * @returns {Matrix4} transform - Transformation matrix.
 */
function transformCar (angle, lateralPosition, verticalPosition) {
  const rotZ = new Matrix4().setRotate(
    (angle + Math.PI / 2) * 180 / Math.PI,
    0,
    0,
    1
  )
  const rotX = new Matrix4().setRotate(
    (-angle + Math.PI / 2) * 180 / Math.PI,
    Math.cos(angle + Math.PI / 2),
    Math.sin(angle + Math.PI / 2),
    0
  )
  const translateXY = new Matrix4().setTranslate(
    0.5 * Math.cos(angle),
    0.5 * Math.sin(angle),
    0
  )
  const translateZ = new Matrix4().setTranslate(0, 0, verticalPosition * 0.04)
  const translateY = new Matrix4().setTranslate(
    -lateralPosition * 0.10 * Math.sin(angle + Math.PI / 2),
    lateralPosition * 0.10 * Math.cos(angle + Math.PI / 2),
    0
  )
  const scale = new Matrix4().setScale(0.6, 0.6, 0.6)
  return translateXY
    .multiply(rotX)
    .multiply(translateY)
    .multiply(translateZ)
    .multiply(rotZ)
    .multiply(scale)
}

/**
 * Animate current position values toward the target ones.
 */
function animateLateralPosition () {
  if (gameState.lateralPosition.current < gameState.lateralPosition.target - 0.001) {
    gameState.lateralPosition.current += 0.025
  } else if (gameState.lateralPosition.current > gameState.lateralPosition.target + 0.001) {
    gameState.lateralPosition.current -= 0.025
  }
  if (gameState.verticalPosition.current < gameState.verticalPosition.target - 0.001) {
    gameState.verticalPosition.current += 0.05
  } else if (gameState.verticalPosition.current > gameState.verticalPosition.target + 0.001) {
    gameState.verticalPosition.current -= 0.05
  }
}

/**
 * Handle key down event.
 * @param {Object} e - Event object.
 */
function handleKeyDown (e) {
  if (!gameState.acceptKeys) {
    return
  }
  gameState.acceptKeys = false
  setTimeout(function () {
    gameState.acceptKeys = true
  }, 100)
  const keyCode = e.keyCode
  if (keyCode === 39) {
    gameState.lateralPosition.target = Math.max(
      gameState.lateralPosition.target - 0.5,
      -1
    )
  } else if (keyCode === 37) {
    gameState.lateralPosition.target = Math.min(
      gameState.lateralPosition.target + 0.5,
      1
    )
  } else if (keyCode === 40) {
    gameState.verticalPosition.target = -gameState.verticalPosition.target
  }
}


function setPerspective (gl, ticks) {
  const perspectiveMatrix = new Matrix4()
  perspectiveMatrix.setPerspective(24, 1, 1, 100)
  perspectiveMatrix.lookAt(
    3 * Math.sin(ticks / 300),
    3 * Math.cos(ticks / 300),
    1,
    0, 0, 0, 0, 0, 1
  )
  const uPerspective = gl.getUniformLocation(gl.program, 'u_Perspective')
  gl.uniformMatrix4fv(
    uPerspective,
    false,
    perspectiveMatrix.elements
  )
}

function setTransform (gl, matrix) {
  const uTransform = gl.getUniformLocation(gl.program, 'u_Transform')
  gl.uniformMatrix4fv(
    uTransform,
    false,
    (matrix && matrix.elements) || new Matrix4().elements
  )
}

function setLight (gl) {
  const uLightDirection = gl.getUniformLocation(gl.program, 'u_LightDirection')
  gl.uniform3fv(uLightDirection, new Float32Array([0.2, 0.2, 1]))
}

/**
 * Draw a shape
 * @param {Object} gl - WebGL rendering context.
 * @param {Function} shapeConstructor - A function returning a shape object.
 * @param {Matrix4} transform - Base transform for the shape. Replaces current transform uniform value in the vertex shader.
 */
function drawShape (gl, shapeConstructor, transform) {
  setTransform(gl, transform)
  const shape = shapeConstructor()
  const vertexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, shape.vertices, gl.STATIC_DRAW)

  const FSIZE = shape.vertices.BYTES_PER_ELEMENT

  const aPosition = gl.getAttribLocation(gl.program, 'a_Position')
  if (aPosition < 0) {
    console.log('Failed to get storage location for a_Position.')
  }
  gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, FSIZE * 10, 0)
  gl.enableVertexAttribArray(aPosition)

  const aNormal = gl.getAttribLocation(gl.program, 'a_Normal')
  if (aNormal < 0) {
    console.log('Failed to get storage location for a_Normal.')
  }
  gl.vertexAttribPointer(aNormal, 3, gl.FLOAT, false, FSIZE * 10, FSIZE * 3)
  gl.enableVertexAttribArray(aNormal)

  const aColor = gl.getAttribLocation(gl.program, 'a_Color')
  if (aColor < 0) {
    console.log('Failed to get storage location for a_Color.')
  }
  gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, FSIZE * 10, FSIZE * 7)
  gl.enableVertexAttribArray(aColor)

  gl.bindBuffer(gl.ARRAY_BUFFER, null)

  if (shape.connectivity) {
    const indexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, shape.connectivity, gl.STATIC_DRAW)
    gl.drawElements(gl.TRIANGLES, shape.connectivity.length, gl.UNSIGNED_BYTE, 0)
  } else {
    gl.drawArrays(gl.TRIANGLES, 0, shape.vertices.length / 10)
  }
}
