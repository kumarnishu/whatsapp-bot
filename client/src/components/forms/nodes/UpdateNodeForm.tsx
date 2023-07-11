import { Button, Form } from 'react-bootstrap'
import { useFormik } from 'formik';
import * as Yup from "yup"
import { Node } from 'reactflow';

type Props = {
    selectedNode: Node,
    updateNode: (index:number,media_value: string, media_type?: string) => void,
    setDisplayUpdateModal: React.Dispatch<React.SetStateAction<boolean>>
}

function UpdateNodeForm({ updateNode, selectedNode, setDisplayUpdateModal }: Props) {
    const formik = useFormik({
        initialValues: {
            index: selectedNode.data.index,
            media_type: selectedNode.data.media_type,
            media_value: selectedNode.data.media_value || "message"
        },
        validationSchema: Yup.object({
            index: Yup.number().required("this is required"),
            media_value: Yup.string()
                .required("this is required"),
            media_type: Yup.string()
                .required("this is required")
        }),
        onSubmit: (values: {
            index:number,
            media_type: string,
            media_value: string
        }) => {
            updateNode(values.index,values.media_value, values.media_type)
            setDisplayUpdateModal(false)
        },
    });
    return (
        <Form onSubmit={formik.handleSubmit} className='shadow w-100 p-3 bg-body-tertiary border border-1 rounded bg-light align-self-center'>
            <h1 className="d-block fs-4 text-center">Update Node</h1>
            <Form.Group className="pt-3" >
                <Form.Control type="number" className="border border-primary" placeholder="Index"
                    {...formik.getFieldProps('index')}
                />
                <Form.Text className='pl-2 text-muted '>{formik.touched.index && formik.errors.index ? formik.errors.index : ""}</Form.Text>
            </Form.Group>
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
    )
}

export default UpdateNodeForm