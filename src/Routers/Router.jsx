import { createBrowserRouter } from "react-router";
import RootLayout from "../Layouts/RootLayout";
import Home from "../Pages/Home/Home";
import Register from "../Pages/Register/Register";
import Error from "../Pages/Error/Error";
import Login from "../Pages/Login/Login";
import DashboardLayout from "../Layouts/DashboardLayout";
import PrivateRouters from "./PrivateRouters";
import Dashboard from "../Pages/Dashboard/Dashboard";

export const router = createBrowserRouter([
    {
        path: '/',
        Component: RootLayout,
        errorElement: <Error/>,
        children: [
            {
               path: '/',
               element: <Home/>
            },
            {
                path: '/register',
                element: <Register/>
            },
            {
                path: '/login',
                element: <Login/>
            }
        ]
    },
    {
        path: '/dashboard',
        element: <PrivateRouters><DashboardLayout/></PrivateRouters>,
        children: [
            {
                path: '',
                element: <Dashboard/> 
            }
        ]
    }
])