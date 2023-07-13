import React, { useContext, useEffect } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { IFlow } from '../../../types/flow.types'
import { useFormik } from 'formik'
import * as Yup from "yup"
import { Form } from 'react-bootstrap'
import Alert from 'react-bootstrap/Alert';
import { AxiosResponse } from 'axios'
import { useMutation } from 'react-query'
import { BackendError } from '../../../types'
import { UpdateFlow } from '../../../services/BotServices'
import { queryClient } from '../../..'
import { AppChoiceActions, ChoiceContext } from '../../../contexts/DialogContext'

type Props = {
    setDisplayUpdateModal: React.Dispatch<React.SetStateAction<boolean>>,
    displayUpdateModal: boolean,
    flow: IFlow
}
function SaveUpdateFlow({ flow, setDisplayUpdateModal, displayUpdateModal }: Props) {
    const { setChoice } = useContext(ChoiceContext)
    const { mutate, isSuccess, isLoading, isError, error } = useMutation
        <AxiosResponse<IFlow>,
            BackendError,
            { id: string, body: IFlow }
        >(UpdateFlow, {
            onSuccess: () => queryClient.invalidateQueries("flows")
        })

    const formik = useFormik<IFlow>({
        initialValues: {
            flow_name: flow.flow_name,
            trigger_keywords: flow.trigger_keywords,
            nodes: flow.nodes,
            edges: flow.edges
        },
        validationSchema: Yup.object({
            flow_name: Yup.string()
                .min(4, 'Must be 4 characters or more')
                .required("name is required")

        }),
        onSubmit: (values: IFlow) => {
            if (flow && flow._id)
                mutate({
                    id: flow._id,
                    body: {
                        ...values,
                        flow_name: values.flow_name,
                        trigger_keywords: values.trigger_keywords,
                        nodes: values.nodes,
                        edges: values.edges
                    }
                })
        },
    });

    useEffect(() => {
        if (isSuccess) {
            setTimeout(() => {
                setDisplayUpdateModal(false)
                setChoice({ type: AppChoiceActions.close_app })
            }, 400)
        }
    }, [isSuccess, setChoice, setDisplayUpdateModal])
    console.log(flow)
    return (
        <Modal
            show={displayUpdateModal ? true : false}
            onHide={() => setDisplayUpdateModal(false)}
            centered
        >
            <Form onSubmit={formik.handleSubmit} className='shadow w-100  p-3 bg-body-tertiary border border-1 rounded bg-light align-self-center'>
                <h1 className="d-block fs-4 text-center">Save Flow</h1>
                {
                    isError ? (
                        <Alert variant="danger">
                            {error?.response.data.message}
                        </Alert>


                    ) : null
                }
                {
                    isSuccess ? (
                        <Alert color="success">
                            Flow saved in the store
                        </Alert>
                    ) : null
                }
                <Form.Group className="pt-3 mb-3" >
                    <Form.Control className="border border-primary" placeholder="Flow name"
                        {...formik.getFieldProps('flow_name')}
                    />
                    <Form.Text className='pl-2 text-muted '>{formik.touched.flow_name && formik.errors.flow_name ? formik.errors.flow_name : "this is permanent, can not be changed later"}</Form.Text>
                </Form.Group>

                <Button variant="primary" className='w-100' type="submit"
                    disabled={isLoading}
                >{isLoading ? "saving..." : "Update"}</Button>
            </Form>
        </Modal>
    )
}

export default SaveUpdateFlow