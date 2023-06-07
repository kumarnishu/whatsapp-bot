import ResetPasswordForm from '../../components/forms/users/ResetPasswordForm'
import ResetPasswordSendMailForm from '../../components/forms/users/ResetPasswordSendMailForm'
import { useParams } from 'react-router-dom'

function ResetPasswordPage() {
    const { token } = useParams()
    return (
        <>
            {(token && token !== ":token")
                ?
                <ResetPasswordForm token={token} />
                :
                <ResetPasswordSendMailForm />
            }
            <p className="text-capitalize position-absolute w-100 bottom-0 m-0 p-1 bg-primary text-light text-center">Copyright @ Agarson shoes pvt. ltd.</p>
        </>
    )
}

export default ResetPasswordPage
