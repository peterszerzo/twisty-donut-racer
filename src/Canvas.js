import React, { Component } from "react"
import * as webgl from "./webgl"
import Moebius from "./Moebius"
import Car from "./Car"

export default class Canvas extends Component {
  state = {
    ticks: 0,
    acceptKeys: true,
    window: {
      width: 300,
      height: 300
    },
    lateralPosition: {
      current: 0,
      target: 0
    },
    verticalPosition: {
      current: 1,
      target: 1
    }
  }

  render() {
    return (
      <canvas
        width={this.state.window.width}
        height={this.state.window.height}
        ref={node => {
          this.containerNode = node
        }}
      >
        <Car />
        <Moebius />
      </canvas>
    )
  }

  componentDidMount() {
    this.gl = webgl.create(this.containerNode)
    this.resize()
    window.addEventListener('resize', this.resize.bind(this))
    document.addEventListener('keydown', this.handleKeyDown.bind(this))
    const tick = () => {
      window.requestAnimationFrame(() => {
        this.setState(p => ({
          ticks: p.ticks + 1,
          ...this.animatePositions()
        }), () => {
          tick()
        })
      })
    }
    tick()
  }

  animatePositions() {
    const stateChanges = {
      lateralPosition: {...this.state.lateralPosition},
      verticalPosition: {...this.state.verticalPosition}
    }
    if (this.state.lateralPosition.current < this.state.lateralPosition.target - 0.001) {
      stateChanges.lateralPosition.current += 0.025
    } else if (this.state.lateralPosition.current > this.state.lateralPosition.target + 0.001) {
      stateChanges.lateralPosition.current -= 0.025
    }
    if (this.state.verticalPosition.current < this.state.verticalPosition.target - 0.001) {
      stateChanges.verticalPosition.current += 0.05
    } else if (this.state.verticalPosition.current > this.state.verticalPosition.target + 0.001) {
      stateChanges.verticalPosition.current -= 0.05
    }
    return stateChanges
  }

  resize() {
    const w = Math.min(document.body.clientWidth, document.body.clientHeight)
    this.setState(p => ({
      window: {
        width: w,
        height: w
      }
    }))
    this.gl && this.gl.viewport(0, 0, w, w)
  }

  handleKeyDown(e) {
    if (!this.state.acceptKeys) {
      return
    }
    const stateChanges = {
      lateralPosition: {...this.state.lateralPosition},
      verticalPosition: {...this.state.verticalPosition}
    }
    stateChanges.acceptKeys = false
    setTimeout(() => {
      this.setState(p => ({
        acceptKeys: true
      }))
    }, 100)
    const keyCode = e.keyCode
    if (keyCode === 39) {
      stateChanges.lateralPosition.target = Math.max(
        this.state.lateralPosition.target - 0.5,
        -1
      )
    } else if (keyCode === 37) {
      stateChanges.lateralPosition.target = Math.min(
        this.state.lateralPosition.target + 0.5,
        1
      )
    } else if (keyCode === 40) {
      stateChanges.verticalPosition.target = -this.state.verticalPosition.target
    }
    this.setState(p => stateChanges)
  }

  componentDidUpdate() {
    webgl.update(this.state.ticks)
  }
}
