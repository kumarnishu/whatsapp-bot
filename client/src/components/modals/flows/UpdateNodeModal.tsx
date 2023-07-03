import { Node } from "reactflow"
import { Modal, Button } from 'react-bootstrap'
import UpdateNodeForm from '../../forms/nodes/UpdateNodeForm'

function UpdateNodeModal({ updateNode, selectedNode, setSelectedNode }: { updateNode: (media_value: string, media_type?: string) => void, selectedNode: Node, setSelectedNode: React.Dispatch<React.SetStateAction<Node | undefined>> }) {
    return (
        <Modal
            show={selectedNode ? true : false}
            onHide={() => setSelectedNode(undefined)}
            centered
        >
            {selectedNode ?
                <UpdateNodeForm node={selectedNode} setSelectedNode={setSelectedNode} updateNode={updateNode} /> : null}

            <Button variant="outline-danger" onClick={() =>
                setSelectedNode(undefined)
            }>Close</Button>
        </Modal>
    )
}

export default UpdateNodeModal