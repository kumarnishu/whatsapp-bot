import React, { createContext, useState } from "react";
import { IUser } from "../types/user.types";


// usercontext
type Context = {
    user: IUser | undefined;
    setUser: React.Dispatch<React.SetStateAction<IUser | undefined>>;
};
export const UserContext = createContext<Context>({
    user: undefined,
    setUser: () => null,
});


// user provider
export function UserProvider(props: { children: JSX.Element }) {
    const [user, setUser] = useState<IUser>();
    return (
        <UserContext.Provider value={{ user, setUser }}>
            {props.children}
        </UserContext.Provider>
    );
}


