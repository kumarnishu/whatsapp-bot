import { useContext } from 'react'
import { AppChoiceActions, ChoiceContext } from '../../../contexts/DialogContext'

import { Node } from "reactflow"
import { Modal, Button } from 'react-bootstrap'
import UpdateNodeForm from '../../forms/nodes/UpdateNodeForm'

function UpdateNodeModal({ updateNode, selectedNode }: { updateNode: (media_value: string, media_type?: string) => void, selectedNode: Node }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    return (
        <Modal
            show={choice === AppChoiceActions.update_node ? true : false}
            onHide={() => setChoice({ type: AppChoiceActions.close_app })}
            centered
        >
            {selectedNode ?
                <UpdateNodeForm node={selectedNode} updateNode={updateNode} /> : null}

            <Button variant="outline-danger" onClick={() => setChoice({ type: AppChoiceActions.close_app })}>Close</Button>
        </Modal>
    )
}

export default UpdateNodeModal