import React, { Component } from "react"
import { drawShape } from "./webgl"
import { transformOntoMoebius, trianglesToWebglObject } from "./utils"

const { Matrix4 } = global

const s = 0.06

const triangles = [
  {
    normal: [ 0, 0, 1],
    coordinates: [
      [ s, s, s],
      [ s, 0, s],
      [ 0, 0, s]
    ]
  }
]

const shape = trianglesToWebglObject(triangles, [0.03, 0.03, 0.03, 1.0])

export default class Obstacle extends Component {
  render() {
    return null
  }

  componentDidUpdate() {
    drawShape(
      this.props.gl,
      shape,
      transformOntoMoebius(this.props.x, this.props.y, this.props.z)
    )
  }
}

