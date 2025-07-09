import React from 'react';
import Header from '../Components/Header/Header';
import { Outlet } from 'react-router';
import Footer from '../Components/Footer/Footer';

const RootLayout = () => {
    return (
        <div>
            <Header/>
            <div className='lg:min-h-[90vh]'>
                <Outlet/>
            </div>
            <Footer/>
        </div>
    );
};

export default RootLayout;