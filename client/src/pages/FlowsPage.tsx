import { useQuery } from "react-query"
import { GetFlows } from "../services/BotServices"
import { AxiosResponse } from "axios"
import { IFlow } from "../types/flow.types"
import { BackendError } from "../types"
import { Button, Container } from "react-bootstrap"
import { useEffect, useContext, useState } from "react"
import { AppChoiceActions, ChoiceContext } from "../contexts/DialogContext"
import UpdateFlowModel from "../components/modals/flows/UpdateFlowModel"

export default function FlowsPage() {
  const [flows, setFlows] = useState<IFlow[]>()
  const [flow, setFlow] = useState<IFlow>()
  const { setChoice } = useContext(ChoiceContext)
  const { data } = useQuery<AxiosResponse<IFlow[]>, BackendError>("flows", GetFlows)
  useEffect(() => {
    if (data)
      setFlows(data.data)
  }, [data])
console.log(flow)
  return (
    <Container className="p-2">
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Index</th>
            <th scope="col">Flow Name</th>
            <th scope="col">Triggers</th>
            <th scope="col">Last Updated</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {
            flows && flows.length > 0 ?
              <>
                {flows.map((flow, index) => {
                  return (
                    <tr key={index}>
                      <th scope="row">{index + 1}</th>
                      <td>{flow.flow_name}</td>
                      <td>{flow.trigger_keywords}</td>
                      <td>{flow.updated_at && new Date(flow.updated_at).toLocaleString()}</td>
                      <td className="d-flex gap-1">
                        <Button variant="primary" onClick={() => {
                          setFlow(flow)
                          setChoice({ type: AppChoiceActions.update_flow })
                        }}>Edit</Button>
                        <Button variant="outline-danger">Delete</Button>
                      </td>
                    </tr>
                  )
                })}
              </>
              : null
          }
        </tbody>
      </table>
      {flow ? <UpdateFlowModel selectedFlow={flow} /> : null}
    </Container>
  )
}
