import { useEffect, lazy, Suspense } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import NeedAuth from "./components/auth/NeedAuth";
import MainLayout from "./components/dashboard/MainLayout";
import User from "./pages/user/UserDashboard";
import { theme } from "./theme";
import CategoryDashboard from "./pages/category/CategoryDashboard";
import { login } from "./store/reducer/authSlice";
import Role from "./pages/role/RoleManagementPage";
import Menu from "./pages/menu/MenuManagementPage";
import SessionListPage from "./pages/session/SessionListPage";
import CourseListPage from "./pages/course/CourseListPage";
import CourseAddPage from "./pages/course/CourseAddPage";
import CourseEditPage from "./pages/course/CourseEditPage";
import CourseDetailPage from "./pages/course/CourseDetailPage";
import CourseInstanceAddPage from "./pages/courseInstance/CourseInstanceAddPage";
import CourseInstanceEditPage from "./pages/courseInstance/CourseInstanceEditPage";
import CourseOfferingDashboard from "./pages/courseLaunch/CourseOfferingDashboard";
import CourseNotificationDashboard from "./pages/courseLaunch/CourseNotificationDashboard";
import LoadingScreen from "./components/shared/LoadingScreen";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const Login = lazy(() => delay(500).then(() => import("./pages/auth/login")));
const Register = lazy(() =>
  delay(500).then(() => import("./pages/auth/register"))
);
const RegisterSuccess = lazy(() =>
  delay(500).then(() => import("./pages/auth/registerSuccess"))
);

const Dashboard = lazy(() =>
  delay(500).then(() => import("./pages/dashboard/DashboardPage"))
);

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const loginInfo = localStorage.getItem("loginInfo");
    if (loginInfo) {
      dispatch(login({ user: JSON.parse(loginInfo) }));
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Toaster />

      <Routes>
        <Route
          path="/login"
          element={
            <Suspense fallback={<LoadingScreen />}>
              <Login />
            </Suspense>
          }
        />
        <Route
          path="/register"
          element={
            <Suspense fallback={<LoadingScreen />}>
              <Register />
            </Suspense>
          }
        />
        <Route
          path="/registerSuccess"
          element={
            <Suspense fallback={<LoadingScreen />}>
              <RegisterSuccess />
            </Suspense>
          }
        />
        <Route
          path="/"
          element={
            // <NeedAuth>
            <MainLayout />
            // </NeedAuth>
          }
        >
          <Route
            index
            element={
              <Suspense fallback={<LoadingScreen />}>
                <Dashboard />
              </Suspense>
            }
          />
          <Route
            path="/user"
            element={
              // <NeedAuth>
              <User />
              // </NeedAuth>
            }
          />
          <Route
            path="/role"
            element={
              // <NeedAuth>
              <Role />
              // </NeedAuth>
            }
          />
          <Route
            path="/menu"
            element={
              // <NeedAuth>
              <Menu />
              // </NeedAuth>
            }
          />
          <Route
            path="/category"
            element={
              // <NeedAuth>
              <CategoryDashboard />
              // </NeedAuth>
            }
          />
          {/* <Route
            path="/course/:id/instance/:instanceId/sessionList"
            element={<SessionListPage />}
          /> */}
          <Route path="/course/:id/instance/:instanceId/sessionList" element={<SessionListPage />}>
            <Route path="session/:sessionId" element={null} />
          </Route>

          <Route path="/course" element={<CourseListPage />} />
          <Route path="/course/add" element={<CourseAddPage />} />
          <Route path="/course/:id/edit" element={<CourseEditPage />} />
          <Route path="/course/:id/instance" element={<CourseDetailPage />} />
          <Route
            path="/course/:id/instance/add"
            element={<CourseInstanceAddPage />}
          />
          <Route
            path="/course/:id/instance/:instanceId/edit"
            element={<CourseInstanceEditPage />}
          />
          <Route path="/offering" element={<CourseOfferingDashboard />} />
          <Route
            path="/notification"
            element={<CourseNotificationDashboard />}
          />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
