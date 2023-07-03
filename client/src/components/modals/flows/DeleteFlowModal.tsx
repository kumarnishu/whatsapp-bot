import { useContext } from 'react'
import { AppChoiceActions, ChoiceContext } from '../../../contexts/DialogContext'
import { Modal, Button } from 'react-bootstrap'
import { IFlow } from '../../../types/flow.types'

function DeleteFlowModal({flow }: { flow:IFlow}) {
    const { choice, setChoice } = useContext(ChoiceContext)
    return (
        <Modal
            show={choice === AppChoiceActions.update_node ? true : false}
            onHide={() => setChoice({ type: AppChoiceActions.close_app })}
            centered
        >
           

            <Button variant="outline-danger" onClick={() => setChoice({ type: AppChoiceActions.close_app })}>Close</Button>
        </Modal>
    )
}

export default DeleteFlowModal