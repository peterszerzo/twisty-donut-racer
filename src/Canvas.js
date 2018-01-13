import React, { Component } from "react"
import * as webgl from "./webgl"
import Moebius from "./Moebius"
import Car from "./Car"
import Logo from "./Logo"
import Obstacle from "./Obstacle"

export default class Canvas extends Component {
  state = {
    startTime: new Date().getTime(),
    currentTime: new Date().getTime(),
    acceptKeys: true,
    window: {
      width: 300,
      height: 300
    },
    car: {
      y: 0,
      yTarget: 0,
      z: 1,
      zTarget: 1
    }
  }

  render() {
    const minWH = Math.min(this.state.window.width, this.state.window.height)
    const ticks = (this.state.currentTime - this.state.startTime) / 16
    const xCar = ticks / 50
    return (
      <div
        style={{
          width: this.state.window.width,
          height: this.state.window.height,
          backgroundColor: "#000013",
          color: "#FFF",
          position: "relative"
        }}
      >
        <div
          style={{
            position: "absolute",
            opacity: 0.5,
            top: 20,
            left: 20,
            width: 60,
            height: 60
          }}
        >
          <Logo/>
        </div>
        <div
          style={{
            color: "#FFF",
            opacity: 1,
            fontSize: 16,
            position: "absolute",
            lineHeight: 1.4,
            top: 28,
            left: 90
          }}
        >
          <strong>Twisty Donut Racer</strong>
          <br/>
          <span style={{opacity: 0.7}}>Use arrow keys to steer and descend.</span>
        </div>
        <canvas
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate3d(-50%, -50%, 0)"
          }}
          width={minWH}
          height={minWH}
          ref={node => {
            this.containerNode = node
          }}
        >
          <Car gl={this.gl} x={xCar} y={this.state.car.y} z={this.state.car.z} />
          <Moebius gl={this.gl} />
          <Obstacle gl={this.gl} x={0} y={0} z={1} />
        </canvas>
      </div>
    )
  }

  componentDidMount() {
    this.gl = webgl.create(this.containerNode)
    this.resize()
    window.addEventListener("resize", this.resize.bind(this))
    document.addEventListener("keydown", this.handleKeyDown.bind(this))
    const tick = () => {
      window.requestAnimationFrame(() => {
        this.setState(
          p => ({
            currentTime: new Date().getTime(),
            ...this.animatePositions()
          }),
          () => {
            tick()
          }
        )
      })
    }
    tick()
  }

  animatePositions() {
    const newCar = {...this.state.car}
    if (newCar.y < newCar.yTarget - 0.001) {
      newCar.y += 0.025
    } else if ( newCar.y > newCar.yTarget + 0.001) {
      newCar.y -= 0.025
    }
    if (newCar.z < newCar.zTarget - 0.001) {
      newCar.z += 0.05
    } else if ( newCar.z > newCar.zTarget + 0.001) {
      newCar.z -= 0.05
    }
    return {car: newCar}
  }

  resize() {
    const width = document.body.clientWidth
    const height = document.body.clientHeight
    const minWH = Math.min(width, height)
    this.setState(p => ({ window: { width, height } }))
    this.gl && this.gl.viewport(0, 0, minWH, minWH)
  }

  handleKeyDown(e) {
    if (!this.state.acceptKeys) {
      return
    }
    const newCar = {...this.state.car}
    const stateChanges = {}
    stateChanges.acceptKeys = false
    setTimeout(() => {
      this.setState(p => ({
        acceptKeys: true
      }))
    }, 100)
    const keyCode = e.keyCode
    if (keyCode === 39) {
      newCar.yTarget = Math.max(newCar.yTarget - 0.5, -1)
    } else if (keyCode === 37) {
      newCar.yTarget = Math.min(newCar.yTarget + 0.5, 1)
    } else if (keyCode === 40) {
      newCar.zTarget = -newCar.zTarget
    }
    stateChanges.car = newCar
    this.setState(p => stateChanges)
  }

  componentWillUpdate() {
    webgl.update(this.gl, this.state)
  }
}
