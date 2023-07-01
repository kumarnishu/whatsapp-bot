import { useContext } from 'react'
import { AppChoiceActions, ChoiceContext } from '../../../contexts/DialogContext'
import { Modal, Button, Form } from 'react-bootstrap'
import { useFormik } from 'formik';
import * as Yup from "yup"
import { Node } from "reactflow"

function UpdateNodeModal({ updateNode, selectedNode }: { updateNode: (media_value: string, media_type?: string) => void, selectedNode: Node }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    const formik = useFormik({
        initialValues: {
            media_type: selectedNode.data.media_type || "message",
            media_value: selectedNode.data.media_value || ""
        },
        validationSchema: Yup.object({
            media_value: Yup.string()
                .required("this is required")
        }),
        onSubmit: (values: {
            media_type: string,
            media_value: string
        }) => {
            console.log(values)
            updateNode(values.media_value, values.media_type)
            setChoice({ type: AppChoiceActions.close_app })
        },
    });
    return (
        <Modal
            show={choice === AppChoiceActions.update_node ? true : false}
            onHide={() => setChoice({ type: AppChoiceActions.close_app })}
            centered
        >
            <Form onSubmit={formik.handleSubmit} className='shadow w-100 p-3 bg-body-tertiary border border-1 rounded bg-light align-self-center'>
                <h1 className="d-block fs-4 text-center">Update Node</h1>
                <Form.Group className="pt-3 mb-3" >
                    <Form.Control className="border border-primary" placeholder="Message"
                        {...formik.getFieldProps('media_value')}
                    />
                    <Form.Text className='pl-2 text-muted '>{formik.touched.media_value && formik.errors.media_value ? formik.errors.media_value : ""}</Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" >
                    <Form.Select className="border border-primary"
                        {...formik.getFieldProps('media_type')}
                    >
                        <option value="message">Message</option>
                        <option value="media">Media</option>
                    </Form.Select>
                    <Form.Text className='pl-2 text-muted'>{formik.touched.media_type && formik.errors.media_type ? formik.errors.media_type : "videos,gifts and stickers not supported"}</Form.Text>
                </Form.Group>
                <Button variant="primary" className='w-100' type="submit"
                >Update</Button>
            </Form>

            <Button variant="outline-danger" onClick={() => setChoice({ type: AppChoiceActions.close_app })}>Close</Button>
        </Modal>
    )
}

export default UpdateNodeModal