import { AxiosResponse } from 'axios'
import { useContext, useEffect } from 'react'
import { IUser } from '../../../types/user.types'
import { BackendError } from '../../../types'
import { Login } from '../../../services/UserServices'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from 'react-query'
import { UserContext } from '../../../contexts/UserContext'
import { useFormik } from 'formik'
import * as Yup from "yup"
import { Container, Form } from 'react-bootstrap'
import Button from "react-bootstrap/Button"
import { paths } from '../../../Routes'
import Alert from 'react-bootstrap/Alert';

function LoginForm() {
    const goto = useNavigate()
    const { mutate, data, isSuccess, isLoading, isError, error } = useMutation
        <AxiosResponse<IUser>,
            BackendError,
            { username: string, password: string }
        >(Login)

    const { setUser } = useContext(UserContext)

    const formik = useFormik({
        initialValues: {
            username: '',
            password: ''
        },
        validationSchema: Yup.object({
            username: Yup.string()
                .min(4, 'Must be 4 characters or more')
                .max(30, 'Must be 30 characters or less')
                .required(),
            password: Yup.string()
                .min(6, 'Must be 6 characters or more')
                .max(30, 'Must be 30 characters or less')
                .required()
        }),
        onSubmit: (values: {
            username: string,
            password: string
        }) => {
            mutate(values)
        },
    });

    useEffect(() => {
        if (isSuccess) {
            setUser(data.data)
            goto(paths.home)
        }
    }, [setUser, goto, isSuccess, data])

    return (
        <>
            <Container className='d-flex  fluid justify-content-center h-100 min-vw-100'>
                <Form onSubmit={formik.handleSubmit} className='shadow mt-5  p-3 bg-body-tertiary border border-1 rounded bg-light align-self-center'>
                    <h1 className="d-block fs-4 text-center">Login Form</h1>
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
                                logged in
                            </Alert>
                        ) : null
                    }
                    <Form.Group className="pt-3 mb-3" >
                        <Form.Control className="border border-primary" type="username" placeholder="Username or Email"
                            {...formik.getFieldProps('username')}
                        />
                        <Form.Text className='pl-2 text-muted '>{formik.touched.username && formik.errors.username ? formik.errors.username : ""}</Form.Text>
                    </Form.Group>
                    <Form.Group className="mb-3" >
                        <Form.Control className="border border-primary" type="password" placeholder="Password"
                            {...formik.getFieldProps('password')}
                        />
                        <Form.Text className='pl-2 text-muted'>{formik.touched.password && formik.errors.password ? formik.errors.password : ""}</Form.Text>
                    </Form.Group>
                    <Button variant="primary" className='w-100' type="submit"
                        disabled={isLoading}
                    >{isLoading ? "Logging in..." : "Login"}</Button>


                    <p className='text-dark text-center d-block p-2 fw-light text-muted '>Not have an account
                        <Link className="text-decoration-none p-1" to={paths.signup} ><b>Register</b></Link></p>
                    <Link className="d-block text-decoration-none text-center" to={paths.reset_password} >forgot password ?</Link>
                </Form>
            </Container>
          
        </>
    )
}

export default LoginForm
