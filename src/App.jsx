import { RouterProvider, createBrowserRouter } from "react-router-dom";
import RootLayout from "./pages/Root";
import Home from "./pages/Home/Home";
import Detail from "./pages/Detail/Detail";
import { loader as futsalLoader } from "./pages/Home/Home";
import { loader as detailLoader } from "./pages/Detail/Detail";
import { loader as tipLoader } from "./pages/Tip/Tip";
import Tip from "./pages/Tip/Tip";
import Pick from "./pages/Pick/Pick";

const router = createBrowserRouter([
  { path: "/", element: <Pick /> },
  {
    path: "/home",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home />, loader: futsalLoader },
      { path: "detail/:id", element: <Detail />, loader: detailLoader },
      { path: "tip", element: <Tip />, loader: tipLoader },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
