import React, { Component } from "react"
import { drawShape } from "./webgl"

const { Matrix4 } = global

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
 * Generate car shape.
 * @returns {Object} shape - Shape coordinates.
 */
export function car () {
  const triangles = [{
    normal: [0.0, 0.0, 1.0],
    coordinates: [
      [-0.11705460018119969, 0.0012516894548989877, 0.0],
      [-0.079654010181487933, 0.0012516894548989877, 0.0],
      [-0.079654010181487933, 0.038652279454610743, 0.0]
    ]
  }, {
    normal: [0.0, 0.0, 1.0],
    coordinates: [
      [-0.086133382962100699, -0.0085091607436833284, 0.0],
      [-0.11325880186348414, -0.0085091607436833284, 0.0],
      [-0.086133382962100699, -0.035634579645066763, 0.0]
    ]
  }, {
    normal: [0.0, 0.0, 1.0],
    coordinates: [
      [-0.12077234892450511, -0.017377899162263791, 0.0],
      [-0.1407723489245051, -0.017377899162263791, 0.0],
      [-0.12077234892450511, -0.037377899162263785, 0.0]
    ]
  }, {
    normal: [0.24253562503633297, 0.0, 0.97014250014533188],
    coordinates: [
      [0.03, -0.05, 0.01],
      [0.07, -0.05, 0.0],
      [0.07, 0.05, 0.0]
    ]
  }, {
    normal: [0.0, 0.099503719020998915, 0.99503719020998915],
    coordinates: [
      [0.07, 0.05, 0.0],
      [0.03, 0.05, 0.0],
      [0.03, -0.05, 0.01]
    ]
  }, {
    normal: [-0.097590007294853315, 0.19518001458970663, 0.97590007294853309],
    coordinates: [
      [-0.07, -0.05, 0.0],
      [0.03, -0.05, 0.01],
      [-0.02, 0.0, -0.005]
    ]
  }, {
    normal: [0.099503719020998915, 0.0, 0.99503719020998915],
    coordinates: [
      [-0.07, 0.05, 0.0],
      [-0.07, -0.05, 0.0],
      [-0.02, 0.0, -0.005]
    ]
  }, {
    normal: [0.0, -0.099503719020998915, 0.99503719020998915],
    coordinates: [
      [-0.07, 0.05, 0.0],
      [-0.02, 0.0, -0.005],
      [0.03, 0.05, 0.0]
    ]
  }, {
    normal: [-0.19518001458970663, 0.097590007294853315, 0.97590007294853309],
    coordinates: [
      [-0.02, 0.0, -0.005],
      [0.03, -0.05, 0.01],
      [0.03, 0.05, 0.0]
    ]
  }]
  let vertices = []
  for (let triangle of triangles) {
    for (let pt of triangle.coordinates) {
      let triangleVertices = []
      triangleVertices = triangleVertices.concat(pt)
      triangleVertices = triangleVertices.concat(triangle.normal)
      triangleVertices = triangleVertices.concat([0.05, 0.05, 0.9, 1.0])
      vertices = vertices.concat(triangleVertices)
    }
  }
  return {
    vertices: new Float32Array(vertices)
  }
}

export default class Car extends Component {
  render() {
    return null
  }

  componentDidMount() {
    console.log("rendering car")
    console.log(this.props)
  }

  componentDidUpdate() {
    drawShape(this.props.gl, car, transformCar(this.props.x, this.props.y, this.props.z))
  }
}
