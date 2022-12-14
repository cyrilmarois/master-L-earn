import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Formations from "./components/Pages/Formations/Formations";
import App from "./App";
import Staking from "./components/Pages/Staking/Staking";
import Home from "./components/Pages/Home/Home";
import TeacherFormations from "./components/Pages/Teacher/Formations/Formations";
import FormationForm from "./components/Pages/Teacher/Formations/FormationForm/FormationForm";
import Error404 from "./components/Pages/Error/404/Error404";
import Announces from "./components/Pages/Announces/Announces";
import RecruiterAnnounces from "./components/Pages/Recruiter/Announces/Announces";
import AnnounceForm from "./components/Pages/Recruiter/Announces/AnnounceForm/AnnounceForm";
import Student from "./components/Pages/Student/Student";
import Register from "./components/Pages/Register/Register";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error404 />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/formations",
        element: <Formations />,
      },
      {
        path: "/teacher",
        element: <TeacherFormations />,
      },
      {
        path: "/teacher/formation/add",
        element: <FormationForm />,
      },
      {
        path: "/announces",
        element: <Announces />,
      },
      {
        path: "/recruiter",
        element: <RecruiterAnnounces />,
      },
      {
        path: "/recruiter/announce/add",
        element: <AnnounceForm />,
      },
      {
        path: "/student",
        element: <Student />,
      },
      {
        path: "/staking",
        element: <Staking />,
      },
      {
        path: "/register",
        element: <Register />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
