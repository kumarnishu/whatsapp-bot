import LogoutButton from '../buttons/LogoutButton';
import { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { Link } from 'react-router-dom';
import { paths } from '../../Routes';
import { Dropdown } from 'react-bootstrap';
import { AppChoiceActions, ChoiceContext } from '../../contexts/DialogContext';
import UpdatePasswordModal from '../modals/users/UpdatePasswordModal';
import RefreshWhatsappButton from '../buttons/RefreshWhatsappButton';

function NavBar() {
    const { user } = useContext(UserContext)
    const { setChoice } = useContext(ChoiceContext)
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

                                    <div className='d-flex gap-2'>
                                        <Link className="text-white text-decoration-none rounded   text-uppercase fw-bold " to={paths.flows}>Flows</Link>
                                        <Link className="text-white text-decoration-none rounded   text-uppercase fw-bold " to={paths.trackers}>Trackers</Link>
                                        <Link className="text-white text-decoration-none rounded   text-uppercase fw-bold " to={paths.users}>Users</Link>
                                    </div>

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

                                </div>
                            </div>
                            {/* navbar menu */}
                            <Dropdown className="d-sm-block d-md-none">
                                <Dropdown.Toggle variant="dark" id="dropdown-basic">
                                    {user.username.toUpperCase()}
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="">
                                    <Dropdown.Item className="p-2 m-0"  >
                                        <Link className="text-dark text-decoration-none rounded   text-uppercase fw-bold " to={paths.flows}>Flows</Link>
                                    </Dropdown.Item>
                                    <Dropdown.Item className="p-2 m-0"  >
                                        <Link className="text-dark text-decoration-none rounded   text-uppercase fw-bold " to={paths.trackers}>Trackers</Link>
                                    </Dropdown.Item>
                                    <Dropdown.Item className="p-2 m-0"  >
                                        <Link className="text-dark text-decoration-none rounded   text-uppercase fw-bold " to={paths.users}>Users</Link>
                                    </Dropdown.Item>
                                    <Dropdown.Item className="p-2 m-0"
                                        onClick={() => setChoice({ type: AppChoiceActions.update_password })}
                                    >
                                        <p className="text-dark text-decoration-none rounded   text-uppercase fw-bold ">
                                            Update Password
                                        </p>
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