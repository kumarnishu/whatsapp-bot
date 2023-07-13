import { useQuery } from "react-query"
import { AxiosResponse } from "axios"
import { BackendError } from "../types"
import {Container } from "react-bootstrap"
import { useEffect, useContext, useState } from "react"
import { AppChoiceActions, ChoiceContext } from "../contexts/DialogContext"
import { IUser } from "../types/user.types"
import { GetUsers } from "../services/UserServices"

export default function UsersPage() {
    const [users, setUsers] = useState<IUser[]>()
    const [user, setUser] = useState<IUser>()
    const { setChoice } = useContext(ChoiceContext)
    const { data } = useQuery<AxiosResponse<IUser[]>, BackendError>("users", GetUsers)

    useEffect(() => {
        if (data)
            setUsers(data.data)
    }, [data])


    return (
        <Container className="d-flex-column gap-2 p-2 overflow-auto">
            <div style={{ cursor: "pointer" }} className="react-flow__node-default border-danger btn m-2 rounded  fs-6 mt-1"
            >
                <div className="d-flex gap-1 align-items-center justify-content-center"
                    onClick={() => setChoice({ type: AppChoiceActions.create_flow })}
                >
                    <img width="30" height="30" src="https://img.icons8.com/plasticine/100/serial-tasks.png" alt="undo" />
                    <span >New Flow</span>
                </div>
            </div>
            <table className="table">
                <thead>
                    <tr>
                        <th style={{ minWidth: '120px' }} scope="col">Index</th>
                        {/* <th style={{ minWidth: '120px' }} scope="col">Status</th> */}
                        <th style={{ minWidth: '120px' }} scope="col">Username</th>
                        <th style={{ minWidth: '120px' }} scope="col">Email</th>
                        <th style={{ minWidth: '120px' }} scope="col">Connected Number</th>
                        <th style={{ minWidth: '120px' }} scope="col">Last Login</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        users && users.length > 0 ?
                            <>
                                {users.map((user, index) => {
                                    return (
                                        <tr key={index}>
                                            <td scope="row">{index + 1}</td>
                                            <td scope="row">{user.username}</td>
                                            <td scope="row">{user.email}</td>
                                            <td scope="row">{String(user.connected_number).replace("@c.us", "").replace("91", "")}</td>
                                            <td scope="row">{new Date(user.last_login).toLocaleString()}</td>
                                        </tr>
                                    )
                                })}
                            </>
                            : null
                    }
                </tbody>
            </table>

        </Container>
    )
}
