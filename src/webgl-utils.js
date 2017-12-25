/**
 * Load a single shader.
 * @param {Object} gl - WebGL rendering context.
 * @param {number} type - Shader type, as a constate parameter gl.VERTEX_SHADER or gl.FRAGMENT_SHADER.
 * @param {String} source - Shader source code.
 * @returns {Object} shader - Shader.
 */
export function loadShader (gl, type, source) {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
  if (!compiled) {
    let error = gl.getShaderInfoLog(shader)
    console.log('Failed to compile shader: ' + error)
    gl.deleteShader(shader)
    return null
  }
  return shader
}

/**
 * Initialize shaders
 * @param {Object} gl - WebGL rendering context.
 * @param {String} vShader - Vertex shader source code.
 * @param {String} fShader - Fragment shader source code.
 * @returns {Bool} success - Returns whether the initialization was successful.
 */
export function createProgram (gl, vShader, fFhader) {
  // Create shader object
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vShader)
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fFhader)
  if (!vertexShader || !fragmentShader) {
    return null
  }

  // Create a program object
  const program = gl.createProgram()
  if (!program) {
    return null
  }

  // Attach the shader objects
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)

  // Link the program object
  gl.linkProgram(program)

  gl.enable(gl.DEPTH_TEST)

  // Check the result of linking
  const linked = gl.getProgramParameter(program, gl.LINK_STATUS)
  if (!linked) {
    let error = gl.getProgramInfoLog(program)
    console.log('Failed to link program: ' + error)
    gl.deleteProgram(program)
    gl.deleteShader(fragmentShader)
    gl.deleteShader(vertexShader)
    return null
  }
 
  if (!program) {
    console.log('Failed to create program')
    return false
  }
  gl.useProgram(program)
  gl.program = program
  return program
}

