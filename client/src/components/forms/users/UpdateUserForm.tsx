import { AxiosResponse } from 'axios'
import { useContext, useEffect, useState } from 'react'
import { useMutation } from 'react-query'
import { useFormik } from 'formik'
import * as Yup from "yup"
import { Form } from 'react-bootstrap'
import Button from "react-bootstrap/Button"
import Alert from 'react-bootstrap/Alert';
import { useNavigate } from 'react-router-dom'
import { BackendError } from '../../../types'
import { paths } from '../../../Routes'
import { IUser } from '../../../types/user.types'
import { UpdateUser } from '../../../services/UserServices'
import { queryClient } from '../../..'
import { UserContext } from '../../../contexts/UserContext'


function UpdateUserForm({ user }: { user: IUser }) {
    const goto = useNavigate()
    const { mutate, data, isSuccess, isLoading, isError, error } = useMutation
        <AxiosResponse<IUser>,
            BackendError,
            { id: string, body: { username: string, mobile: number, email: string } }
        >(UpdateUser, {
            onSuccess: () => {
                queryClient.invalidateQueries('users')

            }
        })
    const [display, setDisplay] = useState<string | undefined>()
    const { setUser } = useContext(UserContext)

    const formik = useFormik({
        initialValues: {
            username: user.username,
            email: user.email,
            mobile: Number(user.mobile)
        },
        validationSchema: Yup.object({
            username: Yup.string()
                .min(4, 'Must be 4 characters or more')
                .max(30, 'Must be 30 characters or less')
                .required(),
            email: Yup.string()
                .email()
                .required(),
            mobile: Yup.string()
                .min(10, 'Must be 10 digits')
                .max(10, 'Must be 10 digits')
                .required()
        }),
        onSubmit: (values: {
            username: string,
            mobile: number,
            email: string
        }) => {
            mutate({ id: user._id, body: values })
        }
    });

    useEffect(() => {
        if (isSuccess) {
            setTimeout(() => {
                setUser(data.data)
                goto(paths.flows)
            }, 2000)
        }
    }, [setUser, goto, isSuccess, data])

    return (
        <Form onSubmit={formik.handleSubmit} className='shadow w-100 p-3 bg-body-tertiary border border-2 rounded bg-light align-self-center'>
            <h1 className="d-block fs-4 text-center">Update User Form</h1>

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
                        Successfull
                    </Alert>
                ) : null
            }
            {display ? <Alert color="success">
                {display}
            </Alert> : null}
            <Form.Group className="pt-3 mb-3" >
                <Form.Control className="border border-primary" type="username" placeholder="Username or Email"
                    {...formik.getFieldProps('username')}
                />
                <Form.Text className='text-muted'>{formik.touched.username && formik.errors.username ? formik.errors.username : ""}</Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Control className="border border-primary" type="email" placeholder="Email"
                    {...formik.getFieldProps('email')}
                    onClick={() => setDisplay("Provide corrcet email address otherwise not able to reset password in future if forgot ?")}
                />
                <Form.Text className='text-muted'>{formik.touched.email && formik.errors.email ? formik.errors.email : ""}</Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Control className="border border-primary" type="number" placeholder="Mobile "
                    {...formik.getFieldProps('mobile')}
                />
                <Form.Text className='text-muted'>{formik.touched.mobile && formik.errors.mobile ? formik.errors.mobile : ""}</Form.Text>
            </Form.Group>

            <Button variant="primary" className='w-100' type="submit"
                disabled={isLoading}
            >{isLoading ? "Working on it..." : "Update"}</Button>
        </Form>
    )
}

export default UpdateUserForm