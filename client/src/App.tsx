import { useQuery } from "react-query";
import AppRoutes from "./Routes";
import NavBar from "./components/navbar/NavBar";
import { AxiosResponse } from "axios";
import { BackendError } from "./types";
import { GetProfile } from "./services/UserServices";
import { IUser } from "./types/user.types";
import { useContext, useEffect } from "react";
import { UserContext } from "./contexts/UserContext";

export default function App() {
  const { data } = useQuery<AxiosResponse<IUser>, BackendError>("profile", GetProfile)
  const { user, setUser } = useContext(UserContext)

  useEffect(() => {
    if (data) {
      setUser(data.data)
    }
  }, [data, setUser])
  return (
    <>
      {user ? <NavBar /> : null}
      <AppRoutes />
    </>
  );
}
