import { useContext } from 'react'
import { AppChoiceActions, ChoiceContext } from '../../../contexts/DialogContext'
import { Modal, Button, Alert } from 'react-bootstrap'
import { IFlow } from '../../../types/flow.types'
import { DestroyFlow } from '../../../services/BotServices'
import { AxiosResponse } from 'axios'
import { BackendError } from '../../../types'
import { useMutation } from 'react-query'
import { queryClient } from '../../..'
import AlertBar from '../../alert/AlertBar'

function DeleteFlowModal({ flow }: { flow: IFlow }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    const { mutate, isSuccess, isLoading, isError, error } = useMutation
        <AxiosResponse<IFlow>,
            BackendError,
            string
        >(DestroyFlow, {
            onSuccess: () => queryClient.invalidateQueries("flows")
        })

    return (
        <Modal
        className='p-2 rounded-circle'
            show={choice === AppChoiceActions.delete_flow ? true : false}
            onHide={() => setChoice({ type: AppChoiceActions.close_app })}
            centered
        >
            {
                isError ? (
                    <Alert variant="danger">
                        {error?.response.data.message}
                    </Alert>


                ) : null
            }
            {
                isSuccess ? (
                    <AlertBar variant="success" message='Flow deleted from the store'/>
                ) : null
            }
            <p className='p-2 bg-info fs-4'>
                {`you are deleteing the ${flow.flow_name}`}
            </p>
           <div className='p-2 d-flex gap-2'>
                <Button onClick={() => setChoice({ type: AppChoiceActions.close_app })}>Cancel</Button>
                <Button variant="outline-danger" onClick={() => {
                    if (flow && flow._id) mutate(flow._id)
                    setChoice({ type: AppChoiceActions.close_app })
                }
                }
                    disabled={isLoading}>Delete</Button>
           </div>
        </Modal>
    )
}

export default DeleteFlowModal