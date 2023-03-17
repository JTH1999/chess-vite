import React, { createContext, useState } from "react";

export const UserContext = createContext([{}, () => {}]);

let initialState = {};

export const UserProvider = (props) => {
    const [state, setState] = useState(initialState);

    return (
        <UserContext.Provider value={[state, setState]}>
            {props.children}
        </UserContext.Provider>
    );
};
