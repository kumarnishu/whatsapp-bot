import React, { useContext, useEffect } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { ITracker } from '../../../types/flow.types'
import { useFormik } from 'formik'
import * as Yup from "yup"
import { Form } from 'react-bootstrap'
import Alert from 'react-bootstrap/Alert';
import { AxiosResponse } from 'axios'
import { useMutation } from 'react-query'
import { BackendError } from '../../../types'
import { UpdateCustomerName } from '../../../services/BotServices'
import { queryClient } from '../../..'
import { AppChoiceActions, ChoiceContext } from '../../../contexts/DialogContext'

type Props = {
    tracker: ITracker
}
function UpdateTrackerModal({ tracker }: Props) {
    const { choice, setChoice } = useContext(ChoiceContext)
    const { mutate, isSuccess, isLoading, isError, error } = useMutation
        <AxiosResponse<ITracker>,
            BackendError,
            { id: string, body: { customer_name: string } }
        >(UpdateCustomerName, {
            onSuccess: () => queryClient.invalidateQueries("trackers")
        })

    const formik = useFormik({
        initialValues: {
            customer_name: tracker.customer_name,
        },
        validationSchema: Yup.object({
            customer_name: Yup.string()
                .min(4, 'Must be 4 characters or more')
                .required("name is required")

        }),
        onSubmit: (values) => {
            if (tracker && tracker._id)
                mutate({
                    id: tracker._id,
                    body: { customer_name: values.customer_name }
                })
        },
    });

    useEffect(() => {
        if (isSuccess) {
            setTimeout(() => {
                setChoice({ type: AppChoiceActions.close_app })
            }, 400)
        }
    }, [isSuccess, setChoice])
    return (
        <Modal
            show={choice === AppChoiceActions.update_tracker ? true : false}
            onHide={() => setChoice({ type: AppChoiceActions.close_app })}
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
                            name saved in the store
                        </Alert>
                    ) : null
                }
                <Form.Group className="pt-3 mb-3" >
                    <Form.Control className="border border-primary" placeholder="Customer Name"
                        {...formik.getFieldProps('customer_name')}
                    />
                    <Form.Text className='pl-2 text-muted '>{formik.touched.customer_name && formik.errors.customer_name ? formik.errors.customer_name : "this will be sent on whatsapp in greeting"}</Form.Text>
                </Form.Group>

                <Button variant="primary" className='w-100' type="submit"
                    disabled={isLoading}
                >{isLoading ? "saving..." : "Update"}</Button>
            </Form>
        </Modal>
    )
}

export default UpdateTrackerModal