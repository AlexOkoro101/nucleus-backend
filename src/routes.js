import Dashboard from "views/Dashboard.js";
import Channels from "views/Channels.js";

import Orders from "views/Orders.js";
import Plans from "views/Plans.js";
import Insurers from "views/Insurers.js";

// auth
import Signin from "views/auths/Signin";

// admins
import Admins from "views/admins/Admins";
import AdminsCreateAdmin from "views/admins/CreateAdmin";
import PlanDetails from "views/sections/plans/planDetails";
import CreatePlan from "views/sections/plans/createPlan";
import insurerDetails from "views/sections/insurers/insurerDetails";
import OrderDetails from "views/sections/orders/orderDetails";
import CreateAdmin from "views/admins/CreateAdmin";
import USSDLogs from "views/USSDLogs";
import EntityLogs from "views/EntityLogs";
import Transactions from "views/Transactions";

// plans
// import Plans from "views/plans/Plans";

var routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "nc-icon nc-bank",
    component: Dashboard,
    layout: "/admin",
  },
  // {
  //   path: "/hospitals",
  //   name: "Hospitals",
  //   icon: "nc-icon nc-shop",
  //   component: Hospitals,
  //   layout: "/admin",
  // },
  {
    path: "/plans",
    name: "Plans",
    icon: "nc-icon nc-paper",
    component: Plans,
    layout: "/admin",
  },
  {
    path: "/channels",
    name: "Channels",
    icon: "nc-icon nc-sound-wave",
    component: Channels,
    layout: "/admin",
  },
  {
    path: "/insurers",
    name: "Insurers",
    icon: "nc-icon nc-tag-content",
    component: Insurers,
    layout: "/admin",
  },
  {
    path: "/orders",
    name: "Orders",
    icon: "nc-icon nc-tile-56",
    component: Orders,
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
    path: "/create-admin",
    name: "Create Admin",
    icon: "nc-icon nc-circle-10",
    component: CreateAdmin,
    layout: "/admin",
    display: true
  },
  {
    path: "/ussd-logs",
    name: "USSD Logs",
    icon: "nc-icon nc-single-copy-04",
    component: USSDLogs,
    layout: "/admin",
  },
  {
    path: "/entities",
    name: "Entities",
    icon: "nc-icon nc-palette",
    component: EntityLogs,
    layout: "/admin",
  },
  {
    path: "/transactions",
    name: "Transactions",
    icon: "nc-icon nc-single-copy-04",
    component: Transactions,
    layout: "/admin",
  },
  {
    path: "/logout",
    name: "Logout",
    icon: "nc-icon nc-settings-gear-65",
    component: AdminsCreateAdmin,
    layout: "/admin",
  },
  {
    path: "/plans/:id",
    name: "Plan Details",
    icon: "nc-icon nc-pallete",
    component: PlanDetails,
    layout: "/admin",
    display: true,
  },
  {
    path: "/create-plan",
    name: "Create Plan",
    icon: "nc-icon nc-pallete",
    component: CreatePlan,
    layout: "/admin",
    display: true,
  },
  {
    path: "/insurers/:id",
    name: "Insurer Details",
    icon: "nc-icon nc-pallete",
    component: insurerDetails,
    layout: "/admin",
    display: true,
  },
  {
    path: "/orders/:id",
    name: "Order Details",
    icon: "nc-icon nc-pallete",
    component: OrderDetails,
    layout: "/admin",
    display: true,
  },

  // plans
  // {
  //   path: "/plans",
  //   name: "All Plans",
  //   icon: "nc-icon nc-tile-56",
  //   component: Plans,
  //   layout: "/admin",
  // },

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
