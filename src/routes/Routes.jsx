import { createHashRouter } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import Home from "../pages/Home/Home";
import Prediction from "../pages/Prediction/Prediction";
import Historic from "../pages/Historic/Historic.jsx";
import Stadistics from "../pages/Stadistics/Stadistics.jsx";
import About from "../pages/About/About";
import { RoutesValues } from "../models/RoutesValues.js";

export const router = createHashRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: RoutesValues.prediction,
        element: <Prediction />,
      },
      { path: RoutesValues.historic, element: <Historic /> },
      { path: RoutesValues.stadistics, element: <Stadistics /> },
      {
        path: RoutesValues.about,
        element: <About />,
      },
      {},
    ],
  },
]);
