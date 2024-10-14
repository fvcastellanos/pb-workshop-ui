import { AuthModel } from 'pocketbase';
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({children}) {

    const model = {
        isAuthenticated: false,
        authModel: null
    };

    const [userModel, setUserModel] = useState(model);
    
    return (
        <AuthContext.Provider value={{
            userModel,
            setUserModel
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuthContext() {
    return useContext(AuthContext);
}
