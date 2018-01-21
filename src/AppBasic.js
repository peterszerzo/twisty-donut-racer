import React from "react"
import { Game, Moebius, Car, Obstacle } from "./Engine"
import { Logo, Banner } from "./Components"

export default class App extends React.Component {
  render() {
    return (
      <div style={{ width: "100vw", height: "100vh", backgroundColor: "#000" }}>
        <Game size={600} lat={30} lng={50}>
          <Moebius />
          <Car x={0.3} y={0} z={1} />
          <Obstacle x={0} y={0} z={1} />
          <Obstacle x={0} y={0} z={1} />
        </Game>
      </div>
    )
  }
}
