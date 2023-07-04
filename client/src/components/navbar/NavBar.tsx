import LogoutButton from '../buttons/LogoutButton';
import { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { Link, useNavigate } from 'react-router-dom';
import { paths } from '../../Routes';
import { Dropdown } from 'react-bootstrap';
import { AppChoiceActions, ChoiceContext } from '../../contexts/DialogContext';
import UpdatePasswordModal from '../modals/users/UpdatePasswordModal';
import RefreshWhatsappButton from '../buttons/RefreshWhatsappButton';

function NavBar() {
    const { user } = useContext(UserContext)
    const { setChoice } = useContext(ChoiceContext)
    const goto = useNavigate()
    return (
        <>
            <UpdatePasswordModal />
            <div className="bg-dark justify-content-between align-items-between d-flex gap-1">
                <div>
                    <Link to={paths.flows}>
                        <img
                            className="m-2 d-inline-block rounded-circle"
                            alt="icon"
                            src="https://fplogoimages.withfloats.com/tile/605af6c3f7fc820001c55b20.jpg"
                            width="40"
                            height="40"
                        />
                    </Link>
                    {user ? <RefreshWhatsappButton /> : null}
                </div>
                {
                    user ?
                        <>
                            {/* navbar */}
                            <div className="d-none d-md-flex  gap-1 justify-content-center align-items-center ">
                                <div className="d-flex align-items-center">
                                    {user ? <>
                                        <img width="24" alt="icons" height="24" src="https://img.icons8.com/color/48/serial-tasks.png" />
                                        <Link className="text-white text-decoration-none rounded shadow p-2 text-uppercase fw-bold fs-6" to={paths.flows}>Flows</Link>
                                        <Dropdown>
                                            <Dropdown.Toggle variant="dark" id="dropdown-basic">
                                                {user.username.toUpperCase()}
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu >
                                                <Dropdown.Item className="border-bottom-1" onClick={() => setChoice({ type: AppChoiceActions.update_password })}><img height="30" width="30" src="https://img.icons8.com/color/48/keys-holder.png" alt="icons" />Update Password</Dropdown.Item>
                                                <Dropdown.Item >
                                                    <LogoutButton />
                                                </Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </> : null}
                                </div>
                            </div>
                            {/* navbar menu */}
                            <Dropdown className="d-sm-block d-md-none">
                                <Dropdown.Toggle variant="dark" id="dropdown-basic">
                                    {user.username.toUpperCase()}
                                </Dropdown.Toggle>
                                <Dropdown.Menu >
                                    <Dropdown.Item className="p-2 m-0">
                                        <img width="24" height="24" src="https://img.icons8.com/color/48/serial-tasks.png" alt="serial-tasks--v1" />
                                        <span onClick={() => goto(paths.flows)}>  Bot Flows</span>
                                    </Dropdown.Item>
                                    <Dropdown.Item className="p-0 m-0"
                                        onClick={() => setChoice({ type: AppChoiceActions.update_password })}
                                    >
                                        <img height="30" width="30" src="https://img.icons8.com/color/48/keys-holder.png" alt="icons" />
                                        Update Password
                                    </Dropdown.Item>
                                    <LogoutButton />
                                </Dropdown.Menu>
                            </Dropdown>
                        </>
                        : null
                }
            </div >
        </>
    );
}

export default NavBar;