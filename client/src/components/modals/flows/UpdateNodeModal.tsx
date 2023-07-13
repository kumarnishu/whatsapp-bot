import { Node } from "reactflow"
import { Modal, Button } from 'react-bootstrap'
import UpdateNodeForm from '../../forms/nodes/UpdateNodeForm'

type Props = {
    selectedNode: Node,
    displayNodeUpdateModal: boolean,
    updateNode: (index:number,media_value: string, media_type?: string) => void,
    setDisplayNodeUpdateModal: React.Dispatch<React.SetStateAction<boolean>>
}
function UpdateNodeModal({ updateNode, selectedNode, setDisplayNodeUpdateModal, displayNodeUpdateModal }: Props) {
    return (
        <Modal
            show={displayNodeUpdateModal ? true : false}
            onHide={() => setDisplayNodeUpdateModal(false)}
            centered
        >
            {selectedNode ?
                <UpdateNodeForm selectedNode={selectedNode} updateNode={updateNode} setDisplayNodeUpdateModal={setDisplayNodeUpdateModal} /> : null}

            <Button variant="outline-danger" onClick={() => {
                setDisplayNodeUpdateModal(false)
            }
            }>Close</Button>
        </Modal>
    )
}

export default UpdateNodeModal