import { HOME_ROUTE, LOGIN_ROUTE, REGISTRATION_ROUTE,PROFILE_ROUTE, ADMIN_ROUTE, FORMVIOLATION_ROUTE} from "./utils/consts";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import ViolationReport from "./pages/FormViolation";

export const authRoutes = [

]

export const publicRoutes = [

    {
        path: HOME_ROUTE,
        Component: Home
    },
    {
        path: LOGIN_ROUTE,
        Component: Auth
    },
    {
        path: REGISTRATION_ROUTE,
        Component: Auth
    },
    {
        path: PROFILE_ROUTE,
        Component: Profile
    },
    {
        path: ADMIN_ROUTE,
        Component: Admin
    },
    {
        path: FORMVIOLATION_ROUTE,
        Component: ViolationReport
    },

]