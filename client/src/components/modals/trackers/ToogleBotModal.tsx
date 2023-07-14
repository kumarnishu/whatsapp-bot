import { useContext } from 'react'
import { AppChoiceActions, ChoiceContext } from '../../../contexts/DialogContext'
import { Modal, Button, Alert } from 'react-bootstrap'
import { ToogleBotStatus } from '../../../services/BotServices'
import { AxiosResponse } from 'axios'
import { BackendError } from '../../../types'
import { useMutation } from 'react-query'
import { queryClient } from '../../..'
import AlertBar from '../../alert/AlertBar'
import { ITracker } from '../../../types/flow.types'

function ToogleBotModal({ tracker }: { tracker: ITracker }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    const { mutate, isSuccess, isLoading, isError, error } = useMutation
        <AxiosResponse<ITracker>,
            BackendError,
            string
        >(ToogleBotStatus, {
            onSuccess: () => queryClient.invalidateQueries("trackers")
        })

    return (
        <Modal
            className='p-2 rounded-circle'
            show={choice === AppChoiceActions.toogle_bot_status ? true : false}
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
                    <AlertBar variant="success" message='bot status changed for this number' />
                ) : null
            }
            <div className="modal-header">
                <h5 className='modal-title'>
                    {`This will change bot status for this ${tracker.phone_number}`}
                </h5>
            </div>
            <div className='p-2 d-flex justify-content-end gap-2'>
                <Button onClick={() => setChoice({ type: AppChoiceActions.close_app })}>Cancel</Button>
                <Button variant="outline-danger" onClick={() => {
                    if (tracker && tracker._id) mutate(tracker._id)
                    setChoice({ type: AppChoiceActions.close_app })
                }
                }
                    disabled={isLoading}>{tracker.is_active ? "stop" : "start"}</Button>
            </div>
        </Modal>
    )
}

export default ToogleBotModal