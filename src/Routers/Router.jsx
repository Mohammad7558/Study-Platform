import { createBrowserRouter } from "react-router";
import DetailedSessionPage from "../Components/HomePageComponents/DetailedSessionPage";
import PaymentSuccess from "../Components/PaymentSuccess";
import DashboardLayout from "../Layouts/DashboardLayout";
import RootLayout from "../Layouts/RootLayout";
import About from "../Pages/About/About";
import AllSessions from "../Pages/AdminPages/AllSessions";
import AllUsers from "../Pages/AdminPages/AllUsers";
import ViewAllMaterials from "../Pages/AdminPages/ViewAllMaterials";
import AllTutors from "../Pages/AllTutors/AllTutors";
import TutorProfile from "../Pages/AllTutors/TutorProfile";
import Dashboard from "../Pages/Dashboard/Dashboard";
import Error from "../Pages/Error/Error";
import Forbidden from "../Pages/Error/Forbidden";
import Home from "../Pages/Home/Home";
import Login from "../Pages/Login/Login";
import Register from "../Pages/Register/Register";
import BookedSession from "../Pages/StudentPages/BookedSession";
import CreateNotes from "../Pages/StudentPages/CreateNotes";
import DetailedBookedCard from "../Pages/StudentPages/DetailedBookedCard";
import ManagePersonalNotes from "../Pages/StudentPages/ManagePersonalNotes";
import ViewAllStudyMet from "../Pages/StudentPages/ViewAllStudyMet";
import Sessions from "../Pages/StudySessions/Sessions";
import CreateSession from "../Pages/TutorPages/CreateSession";
import MySessions from "../Pages/TutorPages/MySessions";
import UploadMaterial from "../Pages/TutorPages/UploadMaterial";
import ViewMaterials from "../Pages/TutorPages/ViewMaterials";
import ViewRejectedFeedBacks from "../Pages/TutorPages/ViewRejectedFeedBacks";
import AdminRoutes from "./AdminRoutes";
import PrivateRouters from "./PrivateRouters";
import StudentRoutes from "./StudentRoutes";
import TutorRoutes from "./TutorRoutes";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/forbidden",
        element: <Forbidden />,
      },
      {
        path: "/all-sessions",
        element: <Sessions />,
      },
      {
        path: "/all-tutors",
        element: <AllTutors />,
      },
      {
        path: "/session/:id",
        element: (
          <PrivateRouters>
            <DetailedSessionPage />
          </PrivateRouters>
        ),
      },
      {
        path: "/payment-success",
        element: (
          <PrivateRouters>
            <PaymentSuccess />
          </PrivateRouters>
        ),
      },
      {
        path: "/tutor-profile/:id",
        element: (
          <PrivateRouters>
            <TutorProfile />
          </PrivateRouters>
        ),
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRouters>
        <DashboardLayout />
      </PrivateRouters>
    ),
    children: [
      {
        path: "",
        element: <Dashboard />,
      },
      //---------- tutor Protected Routes------------//
      {
        path: "/dashboard/create-session",
        element: (
          <TutorRoutes>
            <CreateSession />
          </TutorRoutes>
        ),
      },
      {
        path: "/dashboard/my-session",
        element: (
          <TutorRoutes>
            <MySessions />
          </TutorRoutes>
        ),
      },
      {
        path: "/dashboard/upload-materials",
        element: (
          <TutorRoutes>
            <UploadMaterial />
          </TutorRoutes>
        ),
      },
      {
        path: "/dashboard/rejected-feedback",
        element: (
          <TutorRoutes>
            <ViewRejectedFeedBacks />
          </TutorRoutes>
        ),
      },
      {
        path: "/dashboard/view-materials",
        element: (
          <TutorRoutes>
            <ViewMaterials />
          </TutorRoutes>
        ),
      },
      //---------- student Protected Routes------------//
      {
        path: "/dashboard/booked-sessions",
        element: (
          <StudentRoutes>
            <BookedSession />
          </StudentRoutes>
        ),
      },
      {
        path: "/dashboard/create-note",
        element: (
          <StudentRoutes>
            <CreateNotes />
          </StudentRoutes>
        ),
      },
      {
        path: "/dashboard/manage-notes",
        element: (
          <StudentRoutes>
            <ManagePersonalNotes />
          </StudentRoutes>
        ),
      },
      {
        path: "/dashboard/all-study-met",
        element: (
          <StudentRoutes>
            <ViewAllStudyMet />
          </StudentRoutes>
        ),
      },
      {
        path: "/dashboard/booked-sessions/:id",
        element: (
          <StudentRoutes>
            <DetailedBookedCard />
          </StudentRoutes>
        ),
      },
      //---------- admin Protected Routes------------//
      {
        path: "/dashboard/all-users",
        element: (
          <AdminRoutes>
            <AllUsers />
          </AdminRoutes>
        ),
      },
      {
        path: "/dashboard/all-sessions",
        element: (
          <AdminRoutes>
            <AllSessions />
          </AdminRoutes>
        ),
      },
      {
        path: "/dashboard/all-materials",
        element: (
          <AdminRoutes>
            <ViewAllMaterials />
          </AdminRoutes>
        ),
      },
    ],
  },
]);
