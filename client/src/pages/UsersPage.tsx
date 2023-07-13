import { useQuery } from "react-query"
import { AxiosResponse } from "axios"
import { BackendError } from "../types"
import { Container } from "react-bootstrap"
import { useEffect, useState } from "react"
import { IUser } from "../types/user.types"
import { GetUsers } from "../services/UserServices"

export default function UsersPage() {
    const [users, setUsers] = useState<IUser[]>()
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
                >
                    <img width="30" height="30" src="https://img.icons8.com/stickers/100/group-foreground-selected.png" alt="undo" />
                    <span >Users</span>
                </div>
            </div>
            <table className="table">
                <thead>
                    <tr>
                        <th style={{ minWidth: '120px' }} scope="col">Index</th>
                        <th style={{ minWidth: '120px' }} scope="col">Status</th>
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
                                            <td>{index + 1}</td>
                                            <td>{user.connected_number ? "active" : "inactive"}</td>
                                            <td>{user.username}</td>
                                            <td>{user.email}</td>
                                            <td>{String(user.connected_number).replace("@c.us", "").replace("91", "")}</td>
                                            <td>{new Date(user.last_login).toLocaleString()}</td>
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
