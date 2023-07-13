import React, { useContext, useEffect, useState } from 'react'
import { AxiosResponse } from 'axios'
import { useQuery } from 'react-query'
import { BackendError } from '../types'
import { GetTrackers } from '../services/BotServices'
import { ChoiceContext } from '../contexts/DialogContext'
import { Button, Container } from 'react-bootstrap'
import { ITracker } from '../types/flow.types'

function TrackersPage() {
    const [trackers, setTrackers] = useState<ITracker[]>()
    const [tracker, setTracker] = useState<ITracker>()
    const { choice, setChoice } = useContext(ChoiceContext)
    const { data } = useQuery<AxiosResponse<ITracker[]>, BackendError>("trackers", GetTrackers)

    useEffect(() => {
        if (data)
            setTrackers(data.data)
    }, [data])
    console.log(trackers)
    return (
        <>

            <Container className="d-flex-column gap-2 p-2 overtracker-auto">
                <div style={{ cursor: "pointer" }} className="react-tracker__node-default border-danger btn m-2 rounded  fs-6 mt-1"
                >
                    <div className="d-flex gap-1 align-items-center justify-content-center"

                    >
                        <img width="30" height="30" src="https://img.icons8.com/color/48/apple-phone.png" alt="undo" />
                        <span >Trackers</span>
                    </div>
                </div>
                <table className="table">
                    <thead >
                        <tr>
                            <th style={{ minWidth: '120px' }} scope="col">Index</th>
                            <th style={{ minWidth: '120px' }} scope="col">Customer Name</th>
                            <th style={{ minWidth: '120px' }} scope="col">Customer Phone</th>
                            <th style={{ minWidth: '120px' }} scope="col">Flow Name</th>
                            <th style={{ minWidth: '120px' }} scope="col">Last Active</th>
                            <th style={{ minWidth: '120px' }} scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            trackers && trackers.length > 0 ?
                                <>
                                    {trackers.map((tracker, index) => {
                                        return (
                                            <tr key={index}>
                                                <th scope="row">{index + 1}</th>
                                                <td>{tracker.customer_name ? tracker.customer_name : "unknown"}</td>
                                                <td>{String(tracker.phone_number).replace("@c.us", "")}</td>
                                                <td>{tracker.flow.flow_name}</td>
                                                <td>{tracker.updated_at && new Date(tracker.updated_at).toLocaleString()}</td>
                                                <td className="d-flex gap-1">
                                                    <Button size="sm" variant="primary">Edit</Button>
                                                    {tracker.is_active ?
                                                        < Button size="sm" variant="outline-danger">Stop</Button> :
                                                        <Button size="sm" variant="outline-danger">Start</Button>
                                                    }
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </>
                                : null
                        }
                    </tbody>
                </table>

            </Container >
        </>
    )
}

export default TrackersPage