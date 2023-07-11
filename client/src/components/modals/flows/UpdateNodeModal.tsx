import { Node } from "reactflow"
import { Modal, Button } from 'react-bootstrap'
import UpdateNodeForm from '../../forms/nodes/UpdateNodeForm'

type Props = {
    selectedNode: Node,
    displayUpdateModal: boolean,
    updateNode: (index:number,media_value: string, media_type?: string) => void,
    setDisplayUpdateModal: React.Dispatch<React.SetStateAction<boolean>>
}
function UpdateNodeModal({ updateNode, selectedNode, setDisplayUpdateModal, displayUpdateModal }: Props) {
    return (
        <Modal
            show={displayUpdateModal ? true : false}
            onHide={() => setDisplayUpdateModal(false)}
            centered
        >
            {selectedNode ?
                <UpdateNodeForm selectedNode={selectedNode} updateNode={updateNode} setDisplayUpdateModal={setDisplayUpdateModal} /> : null}

            <Button variant="outline-danger" onClick={() => {
                setDisplayUpdateModal(false)
            }
            }>Close</Button>
        </Modal>
    )
}

export default UpdateNodeModal