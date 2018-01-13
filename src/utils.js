const { Matrix4 } = global

export const trianglesToWebglObject = (triangles, color) => {
  let vertices = []
  for (let triangle of triangles) {
    for (let pt of triangle.coordinates) {
      let triangleVertices = []
      triangleVertices = triangleVertices.concat(pt)
      triangleVertices = triangleVertices.concat(triangle.normal)
      triangleVertices = triangleVertices.concat(color)
      vertices = vertices.concat(triangleVertices)
    }
  }
  return {
    vertices: new Float32Array(vertices)
  }
}

/**
 * Transform onto Moebius strip.
 * @param {float} x - Angle around the Moebius strip, in Radians.
 * @param {y} - Normalized position along the width of the strip. Varies between +1 and -1.
 * @param {z} - Normalized vertical position, varying between -1 and +1. These two values correspond to the two sides of the strip as the vehicle ascends.
 * @returns {Matrix4} transform - Transformation matrix.
 */
export const transformOntoMoebius = (x, y, z) => {
  const rotZ = new Matrix4().setRotate(
    (x + Math.PI / 2) * 180 / Math.PI,
    0,
    0,
    1
  )
  const rotX = new Matrix4().setRotate(
    (-x + Math.PI / 2) * 180 / Math.PI,
    Math.cos(x + Math.PI / 2),
    Math.sin(x + Math.PI / 2),
    0
  )
  const translateXY = new Matrix4().setTranslate(
    0.5 * Math.cos(x),
    0.5 * Math.sin(x),
    0
  )
  const translateZ = new Matrix4().setTranslate(0, 0, z * 0.04)
  const translateY = new Matrix4().setTranslate(
    -y * 0.10 * Math.sin(x + Math.PI / 2),
    y * 0.10 * Math.cos(x + Math.PI / 2),
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
