import { AxiosResponse } from 'axios'
import { useEffect } from 'react'
import { useMutation } from 'react-query'
import { useFormik } from 'formik'
import * as Yup from "yup"
import { Form } from 'react-bootstrap'
import Button from "react-bootstrap/Button"
import Alert from 'react-bootstrap/Alert';
import { useNavigate } from 'react-router-dom'
import { BackendError } from '../../../types'
import { paths } from '../../../Routes'
import { UpdatePassword } from '../../../services/UserServices'


function UpdatePasswordForm() {
    const goto = useNavigate()
    const { mutate, isLoading, isSuccess, isError, error } = useMutation
        <AxiosResponse<string>,
            BackendError,
            { oldPassword: string, newPassword: string, confirmPassword: string }
        >
        (UpdatePassword)

    const formik = useFormik({
        initialValues: {
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
        validationSchema: Yup.object({
            oldPassword: Yup.string()
                .min(6, 'Must be 6 characters or more')
                .max(30, 'Must be 30 characters or less')
                .required('Required field'),
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
            oldPassword: string,
            newPassword: string,
            confirmPassword: string
        }) => {
            let body = values
            mutate(body)
        },
    });


    useEffect(() => {
        if (isSuccess) {
            setTimeout(() => {
                goto(paths.flows)
            }, 1000)
        }
    }, [goto, isSuccess])

    return (
        <Form onSubmit={formik.handleSubmit} className='shadow w-100 p-3 bg-body-tertiary border border-2 rounded bg-light align-self-center'>
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
                <Form.Control className="border border-primary"  placeholder="old password"
                    {...formik.getFieldProps('oldPassword')}
                />
                <Form.Text className='pl-2 text-muted'>{formik.touched.oldPassword && formik.errors.oldPassword ? formik.errors.oldPassword : ""}</Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" >
                <Form.Control className="border border-primary"  placeholder="new password"
                    {...formik.getFieldProps('newPassword')}
                />
                <Form.Text className='pl-2 text-muted'>{formik.touched.newPassword && formik.errors.newPassword ? formik.errors.newPassword : ""}</Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" >
                <Form.Control className="border border-primary"  placeholder="confirm password"
                    {...formik.getFieldProps('confirmPassword')}
                />
                <Form.Text className='pl-2 text-muted'>{formik.touched.confirmPassword && formik.errors.confirmPassword ? formik.errors.confirmPassword : ""}</Form.Text>
            </Form.Group>
            <Button variant="primary" className='w-100' type="submit"
                disabled={isLoading}
            >{isLoading ? "Working on it..." : "Update Password"}</Button>
        </Form>
    )
}

export default UpdatePasswordForm