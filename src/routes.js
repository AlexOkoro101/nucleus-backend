/*!

=========================================================
* Paper Dashboard React - v1.3.0
=========================================================

* Product Page: https://www.creative-tim.com/product/paper-dashboard-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)

* Licensed under MIT (https://github.com/creativetimofficial/paper-dashboard-react/blob/main/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Dashboard from "views/Dashboard.js";
import Notifications from "views/Notifications.js";
import Icons from "views/Icons.js";
import Typography from "views/Typography.js";
import TableList from "views/Tables.js";
import Maps from "views/Map.js";
import UserPage from "views/User.js";
import UpgradeToPro from "views/Upgrade.js";

// auth
import Signin from "views/auths/Signin";

// admins
import Admins from "views/admins/Admins";
import AdminsCreateAdmin from "views/admins/CreateAdmin";

// plans
import Plans from "views/plans/Plans";

var routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "nc-icon nc-bank",
    component: Dashboard,
    layout: "/admin",
  },
  {
    path: "/icons",
    name: "Icons",
    icon: "nc-icon nc-diamond",
    component: Icons,
    layout: "/admin",
  },
  {
    path: "/maps",
    name: "Maps",
    icon: "nc-icon nc-pin-3",
    component: Maps,
    layout: "/admin",
  },
  {
    path: "/notifications",
    name: "Notifications",
    icon: "nc-icon nc-bell-55",
    component: Notifications,
    layout: "/admin",
  },
  {
    path: "/user-page",
    name: "User Profile",
    icon: "nc-icon nc-single-02",
    component: UserPage,
    layout: "/admin",
  },
  {
    path: "/tables",
    name: "Table List",
    icon: "nc-icon nc-tile-56",
    component: TableList,
    layout: "/admin",
  },
  {
    path: "/admins",
    name: "Admin Management",
    icon: "nc-icon nc-circle-10",
    component: Admins,
    layout: "/admin",
  },
  {
    path: "/admins-create",
    name: "Create New Admin",
    icon: "nc-icon nc-circle-10",
    component: AdminsCreateAdmin,
    layout: "/admin",
    display: true,
  },

  // plans
  {
    path: "/plans",
    name: "All Plans",
    icon: "nc-icon nc-tile-56",
    component: Plans,
    layout: "/admin",
  },

  // auth 
  {
    path: "/signin",
    name: "Admin Signin",
    icon: "nc-icon nc-circle-10",
    component: Signin,
    layout: "/auth",
    display: true,
  },
];
export default routes;
