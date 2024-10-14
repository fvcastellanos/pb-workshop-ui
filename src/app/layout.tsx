'use client'

import { ReactNode } from 'react';
import MainLayout from '../client/components/MainLayout';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/main.css';
import { AuthProvider } from '../client/components/AuthProvider';

const RootLayout = ({children} : {children: ReactNode }) => {

    return (
        <html lang='en'>
            <body>
                <AuthProvider>
                    <MainLayout>
                        {children}
                    </MainLayout>
                </AuthProvider>
            </body>
        </html>
    )
}

export default RootLayout;
