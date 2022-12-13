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
        path: "/teacher/1/formations",
        element: <TeacherFormations />,
      },

      {
        path: "/teacher/1/formations/add",
        element: <FormationForm />,
      },
      {
        path: "/announces",
        element: <Announces />,
      },
      {
        path: "/recruiter/1/announces",
        element: <RecruiterAnnounces />,
      },
      {
        path: "/recruiter/1/announces/add",
        element: <AnnounceForm />,
      },
      {
        path: "/staking",
        element: <Staking />,
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
