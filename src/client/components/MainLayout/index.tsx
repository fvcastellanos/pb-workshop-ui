'use client'

import { useAuthContext } from '../AuthProvider';
import Login from '../Login';
import MainMenu from '../MainMenu';

const MainLayout = ({children}) => {

    const { userModel } = useAuthContext();

    if (!userModel.isAuthenticated) {

        return (
            <Login />
        );
    }

    return (
        <>
        <MainMenu />
        <main>{children}</main>
        </>
    )
}

export default MainLayout;
