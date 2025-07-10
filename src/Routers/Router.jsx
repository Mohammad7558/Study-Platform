import { createBrowserRouter } from "react-router";
import RootLayout from "../Layouts/RootLayout";
import Home from "../Pages/Home/Home";
import Register from "../Pages/Register/Register";
import Error from "../Pages/Error/Error";
import Login from "../Pages/Login/Login";
import DashboardLayout from "../Layouts/DashboardLayout";
import PrivateRouters from "./PrivateRouters";
import Dashboard from "../Pages/Dashboard/Dashboard";
import Forbidden from "../Pages/Error/Forbidden";
import TutorRoutes from "./TutorRoutes";
import CreateSession from "../Pages/TutorPages/CreateSession";
import StudentRoutes from "./StudentRoutes";
import BookedSession from "../Pages/StudentPages/BookedSession";
import AdminRoutes from "./AdminRoutes";
import AllUsers from "../Pages/AdminPages/AllUsers";

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
            },
            {
                path: '/forbidden',
                element: <Forbidden/>
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
            },
            //---------- tutor Protected Routes------------//
            {
                path: '/dashboard/create-session',
                element: <TutorRoutes><CreateSession/></TutorRoutes>
            },
            //---------- student Protected Routes------------//
            {
                path: '/dashboard/booked-sessions',
                element: <StudentRoutes><BookedSession/></StudentRoutes>
            },
            //---------- admin Protected Routes------------//
            {
                path: '/dashboard/all-users',
                element: <AdminRoutes><AllUsers/></AdminRoutes>
            }
        ]
    }
])