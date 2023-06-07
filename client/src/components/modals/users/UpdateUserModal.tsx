import { useContext } from 'react'
import { AppChoiceActions, ChoiceContext } from '../../../contexts/DialogContext'
import { Modal } from 'react-bootstrap'
import UpdateUserForm from '../../forms/users/UpdateUserForm'
import { IUser } from '../../../types/user.types'

function UpdateUserModel({ user }: { user: IUser }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    return (
        <Modal
            show={choice === AppChoiceActions.update_user ? true : false}
            onHide={() => setChoice({ type: AppChoiceActions.close_app })}
            centered
        >
            <UpdateUserForm user={user} />
        </Modal>
    )
}

export default UpdateUserModel