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
import Sessions from "../Pages/StudySessions/Sessions";
import AllTutors from "../Pages/AllTutors/AllTutors";
import About from "../Pages/About/About";
import DetailedSessionPage from "../Components/HomePageComponents/DetailedSessionPage";
import MySessions from "../Pages/TutorPages/MySessions";
import UploadMaterial from "../Pages/TutorPages/UploadMaterial";
import ViewMaterials from "../Pages/TutorPages/ViewMaterials";
import CreateNotes from "../Pages/StudentPages/CreateNotes";
import ManagePersonalNotes from "../Pages/StudentPages/ManagePersonalNotes";
import ViewAllStudyMet from "../Pages/StudentPages/ViewAllStudyMet";
import DetailedBookedCard from "../Pages/StudentPages/DetailedBookedCard";
import AllSessions from "../Pages/AdminPages/AllSessions";
import ViewAllMaterials from "../Pages/AdminPages/ViewAllMaterials";
import ViewRejectedFeedBacks from "../Pages/TutorPages/ViewRejectedFeedBacks";
import PaymentSuccess from "../Components/PaymentSuccess";
import TutorProfile from "../Pages/AllTutors/TutorProfile";

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
                path: '/about',
                element: <About/>
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
            },
            {
                path: '/all-session',
                element: <Sessions/>
            },
            {
                path: '/all-tutors',
                element: <AllTutors/>
            },
            {
                path: '/session/:id',
                element: <PrivateRouters><DetailedSessionPage/></PrivateRouters>
            },
            {
                path: '/payment-success',
                element: <PrivateRouters><PaymentSuccess/></PrivateRouters>
            },
            {
                path: '/tutor-profile/:id',
                element: <PrivateRouters><TutorProfile/></PrivateRouters>
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
            {
                path: '/dashboard/my-session',
                element: <TutorRoutes><MySessions/></TutorRoutes>
            },
            {
                path: '/dashboard/upload-materials',
                element: <TutorRoutes><UploadMaterial/></TutorRoutes>
            },
            {
                path: '/dashboard/rejected-feedback',
                element: <TutorRoutes><ViewRejectedFeedBacks/></TutorRoutes>
            },
            {
                path: '/dashboard/view-materials',
                element: <TutorRoutes><ViewMaterials/></TutorRoutes>
            },
            //---------- student Protected Routes------------//
            {
                path: '/dashboard/booked-sessions',
                element: <StudentRoutes><BookedSession/></StudentRoutes>
            },
            {
                path: '/dashboard/create-note',
                element: <StudentRoutes><CreateNotes/></StudentRoutes>
            },
            {
                path: '/dashboard/manage-notes',
                element: <StudentRoutes><ManagePersonalNotes/></StudentRoutes>
            },
            {
                path: '/dashboard/all-study-met',
                element: <StudentRoutes><ViewAllStudyMet/></StudentRoutes>
            },
            {
                path: '/dashboard/booked-sessions/:id',
                element: <StudentRoutes><DetailedBookedCard/></StudentRoutes>
            },
            //---------- admin Protected Routes------------//
            {
                path: '/dashboard/all-users',
                element: <AdminRoutes><AllUsers/></AdminRoutes>
            },
            {
                path: '/dashboard/all-sessions',
                element: <AdminRoutes><AllSessions/></AdminRoutes>
            },
            {
                path: '/dashboard/all-materials',
                element: <AdminRoutes><ViewAllMaterials/></AdminRoutes>
            },
        ]
    }
])