import { useContext } from 'react'
import { AppChoiceActions, ChoiceContext } from '../../../contexts/DialogContext'
import { Modal, Button, Container, Form } from 'react-bootstrap'
import { useFormik } from 'formik';
import * as Yup from "yup"

function UpdateNodeModal({ updateNode }: { updateNode: (media_value: string, media_type?: string) => void }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    const formik = useFormik({
        initialValues: {
            media_type: "",
            media_value: ""
        },
        validationSchema: Yup.object({
            media_value: Yup.string()
                .required()
        }),
        onSubmit: (values: {
            media_type: string,
            media_value: string
        }) => {
            updateNode(values.media_value, values.media_type)
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
                    <Form.Control className="border border-primary" type="select" placeholder="Select Media Type"
                        {...formik.getFieldProps('media_type')}
                    />
                    <Form.Text className='pl-2 text-muted'>{formik.touched.media_type && formik.errors.media_type ? formik.errors.media_type : ""}</Form.Text>
                </Form.Group>
                <Button variant="primary" className='w-100' type="submit"
                >Update</Button>
            </Form>

            <Button variant="outline-danger" onClick={() => setChoice({ type: AppChoiceActions.close_app })}>Close</Button>
        </Modal>
    )
}

export default UpdateNodeModal