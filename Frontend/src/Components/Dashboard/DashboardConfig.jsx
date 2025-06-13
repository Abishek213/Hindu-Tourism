import {
  BarChart3,
  Users,
  Truck,
  Banknote,
  BanknoteIcon,
  FileText,
  ClipboardList,
  CalendarCheck2,
  Package,
  PlusIcon,
  LucideCompass,
  GroupIcon,
  Luggage

} from 'lucide-react';

// Admin Dashboard Components
import AdminOverview from '../../Pages/Admin/AdminOverview';
import AdminBooking from '../../Pages/Admin/AdminBooking';
import AdminLead from '../../Pages/Admin/AdminLead';
import AdminPackages from '../../Pages/Admin/AdminPackages';
import AdminPayment from '../../Pages/Admin/AdminPayment';
import AdminReports from '../../Pages/Admin/AdminReports';
import AdminStaffManagement from '../../Pages/Admin/AdminStaffManagement';
import AdminGuideAndTransportManagement from '../../Pages/Admin/AdminGuideAndTransportManagement';

// Sales Dashboard Components
import SalesOverview from '../../Pages/Sales/OverView';
import LeadsPage from '../../Pages/Sales/Leads';
import Bookings from '../../Pages/Sales/Booking';
import GenerateReport from '../../Pages/Sales/GenerateReports';

// Operation Dashboard Components
import AssignTeamForm from '../../Pages/Operation/AssignTeam';
import ManageTeamForm from '../../Pages/Operation/ManageTeams';
import PackageForm from '../../Pages/Operation/PackageForm';
import TravelProgressUpdater from '../../Pages/Operation/TravelProgressUpdater';
import OperationDashboardOverview from '../../Pages/Operation/OperationOverview';
import OptionalServicesDashboard from '../../Pages/Operation/OptionalServices';

//Accounts Dashboard components
import InvoicesPage from "../../Pages/Account/Invoices";
import ManagePayments from '../../Pages/Account/ManagePayments';
import ProcessRefunds from  '../../Pages/Account/ProcessRefunds';
import AccountOverview from '../../Pages/Account/AccountOverview';

export const salesDashboardConfig = {
  basePath: '/salesdashboard',
  defaultTab: 'overview',
  tabs: {overview: { title: 'Overview', component:SalesOverview,icon: BarChart3},
  leads:{title:'Leads', component:LeadsPage, icon:Users},
  booking:{title:'Booking', component:Bookings, icon:PlusIcon},
  GenerateReports: { title:'Report', component: GenerateReport, icon: BarChart3}
  }
};

export const adminDashboardConfig = {
  basePath: '/admindashboard',
  defaultTab: 'overview',
  tabs: {
    overview:{title:'Overview', component:AdminOverview, icon:BarChart3},
    lead: { title: 'Leads', component: AdminLead, icon: Users },
    booking: { title: 'Booking', component: AdminBooking, icon: CalendarCheck2 },
    guideandtransportmanagement: { title: 'Guide/Transport Management', component: AdminGuideAndTransportManagement, icon: Users },
    packages: { title: 'Packages', component: AdminPackages, icon: FileText },
    payment: { title: 'Payments', component: AdminPayment, icon: Banknote },
    reports: { title: 'Reports', component: AdminReports, icon: ClipboardList },
    staffmanagement: { title: 'Staff Management', component: AdminStaffManagement, icon: Users }
  },
};

export const operationDashboardConfig = {
  basePath: '/ops',
  defaultTab: 'overview',
  tabs: {
    overview:{title:'Overview', component:OperationDashboardOverview, icon:BarChart3},
    manage:{title:'ManageTeam',component:ManageTeamForm, icon:GroupIcon},
    assign: { title: 'AssignTeam', component: AssignTeamForm, icon: Truck },
    travelprogress :{title:'TravelProgress',component:TravelProgressUpdater,icon:LucideCompass},
    package: {title:'Packages', component:PackageForm, icon:Package},
    services:{title:'Optional Services',component:OptionalServicesDashboard, icon:Luggage}
  }
};

export const accountDashboardConfig = {
  basePath: '/account',
  defaultTab: 'Overview',
  tabs: {
    Overview: { title: 'Overview', component: AccountOverview, icon: BarChart3 },
    invoices: { title: 'Invoices', component: InvoicesPage, icon: FileText },
    managePayments: { title: 'Payments', component: ManagePayments, icon: Banknote },
    processRefunds: { title: 'Refunds', component: ProcessRefunds, icon: BanknoteIcon }
  }
};