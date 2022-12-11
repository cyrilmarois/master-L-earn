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
      // {
      //   path: "/teacher/1/formations/1",
      //   element: <TeacherFormation />,
      // },
      {
        path: "/teacher/1/formations/add",
        element: <FormationForm />,
      },
      // {
      //   path: "/student/1/formations",
      //   element: <TeacherFormations />,
      // },
      // {
      //   path: "/student/1/formations/1",
      //   element: <FormationForm />,
      // },
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
