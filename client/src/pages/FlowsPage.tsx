import { useEffect, useState } from "react"
import { socket } from "../socket"

export default function FlowsPage() {
  const [data, setData] = useState()
  useEffect(() => {
    if (socket) {
      socket.on("data", (data) => setData(data))
    }
  }, [])
  console.log(data)
  return (
    <div>FlowsPage</div>
  )
}
