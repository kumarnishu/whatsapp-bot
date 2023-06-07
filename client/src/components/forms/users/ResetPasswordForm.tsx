import { AxiosResponse } from 'axios'
import {  useEffect } from 'react'
import { useMutation } from 'react-query'
import { useFormik } from 'formik'
import * as Yup from "yup"
import { Container, Form } from 'react-bootstrap'
import Button from "react-bootstrap/Button"
import Alert from 'react-bootstrap/Alert';
import { useNavigate } from 'react-router-dom'
import { BackendError } from '../../../types'
import { paths } from '../../../Routes'
import { ResetPassword } from '../../../services/UserServices'


function ResetPasswordForm({ token }: { token: string }) {
    const goto = useNavigate()
    const { mutate, isLoading, isSuccess, isError, error } = useMutation
        <AxiosResponse<string>,
            BackendError,
            { token: string, body: { newPassword: string, confirmPassword: string } }
        >
        (ResetPassword)

    const formik = useFormik({
        initialValues: {
            newPassword: "",
            confirmPassword: ""
        },
        validationSchema: Yup.object({
            newPassword: Yup.string()
                .min(6, 'Must be 6 characters or more')
                .max(30, 'Must be 30 characters or less')
                .required('Required field'),
            confirmPassword: Yup.string()
                .min(6, 'Must be 6 characters or more')
                .max(30, 'Must be 30 characters or less')
                .required('Required field')
        }),
        onSubmit: (values: {
            newPassword: string,
            confirmPassword: string
        }) => {
            let body = values
            mutate({ token, body })
        },
    });


    useEffect(() => {
        if (isSuccess) {
            setTimeout(() => {
                goto(paths.login)
            }, 1000)
        }
    }, [goto, isSuccess])

    return (
        <Container className='d-flex  fluid justify-content-center h-100 min-vw-100'>
            <Form onSubmit={formik.handleSubmit} className='shadow mt-5  p-3 bg-body-tertiary border border-1 rounded bg-light align-self-center'>
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
                            Successful
                        </Alert>
                    ) : null
                }
                <Form.Group className="mb-3" >
                    <Form.Control className="border border-primary" type="password" placeholder="new password"
                        {...formik.getFieldProps('newPassword')}
                    />
                    <Form.Text className='pl-2 text-muted'>{formik.touched.newPassword && formik.errors.newPassword ? formik.errors.newPassword : ""}</Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" >
                    <Form.Control className="border border-primary" type="password" placeholder="confirm password"
                        {...formik.getFieldProps('confirmPassword')}
                    />
                    <Form.Text className='pl-2 text-muted'>{formik.touched.confirmPassword && formik.errors.confirmPassword ? formik.errors.confirmPassword : ""}</Form.Text>
                </Form.Group>
                <Button variant="primary" className='w-100' type="submit"
                    disabled={isLoading}
                >{isLoading ? "Working on it..." : "Reset Password"}</Button>
            </Form>
        </Container>
    )
}

export default ResetPasswordForm