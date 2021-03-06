import React, { Component } from "react"
import { drawShape } from "./utils/webgl"
import { transformOntoMoebius, trianglesToWebglObject } from "./utils/geometry"

const { Matrix4 } = global

const triangles = [
  {
    normal: [0.0, 0.0, 1.0],
    coordinates: [
      [-0.11705460018119969, 0.0012516894548989877, 0.0],
      [-0.079654010181487933, 0.0012516894548989877, 0.0],
      [-0.079654010181487933, 0.038652279454610743, 0.0]
    ]
  },
  {
    normal: [0.0, 0.0, 1.0],
    coordinates: [
      [-0.086133382962100699, -0.0085091607436833284, 0.0],
      [-0.11325880186348414, -0.0085091607436833284, 0.0],
      [-0.086133382962100699, -0.035634579645066763, 0.0]
    ]
  },
  {
    normal: [0.0, 0.0, 1.0],
    coordinates: [
      [-0.12077234892450511, -0.017377899162263791, 0.0],
      [-0.1407723489245051, -0.017377899162263791, 0.0],
      [-0.12077234892450511, -0.037377899162263785, 0.0]
    ]
  },
  {
    normal: [0.24253562503633297, 0.0, 0.97014250014533188],
    coordinates: [[0.03, -0.05, 0.01], [0.07, -0.05, 0.0], [0.07, 0.05, 0.0]]
  },
  {
    normal: [0.0, 0.099503719020998915, 0.99503719020998915],
    coordinates: [[0.07, 0.05, 0.0], [0.03, 0.05, 0.0], [0.03, -0.05, 0.01]]
  },
  {
    normal: [-0.097590007294853315, 0.19518001458970663, 0.97590007294853309],
    coordinates: [
      [-0.07, -0.05, 0.0],
      [0.03, -0.05, 0.01],
      [-0.02, 0.0, -0.005]
    ]
  },
  {
    normal: [0.099503719020998915, 0.0, 0.99503719020998915],
    coordinates: [[-0.07, 0.05, 0.0], [-0.07, -0.05, 0.0], [-0.02, 0.0, -0.005]]
  },
  {
    normal: [0.0, -0.099503719020998915, 0.99503719020998915],
    coordinates: [[-0.07, 0.05, 0.0], [-0.02, 0.0, -0.005], [0.03, 0.05, 0.0]]
  },
  {
    normal: [-0.19518001458970663, 0.097590007294853315, 0.97590007294853309],
    coordinates: [[-0.02, 0.0, -0.005], [0.03, -0.05, 0.01], [0.03, 0.05, 0.0]]
  }
]

const carShape = trianglesToWebglObject(triangles, [0.05, 0.05, 0.9, 1.0])

export default class Car extends Component {
  render() {
    return null
  }

  update() {
    this.props.gl && drawShape(
      this.props.gl,
      carShape,
      transformOntoMoebius(this.props.x, this.props.y, this.props.z)
    )
  }

  componentDidMount() {
    this.update()
  }

  componentDidUpdate() {
    this.update()
  }
}
