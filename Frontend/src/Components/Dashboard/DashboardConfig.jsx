import {
  BarChart3,
  Users,
  Bus,
  Plus,
  List,
  Truck,
  Map,
  PlaneTakeoff,
  Banknote,
  BanknoteIcon,
  FileText,
  ClipboardList,
  CalendarCheck2,
  BadgeCheck,
  ReceiptPoundSterling,
  ListChecks,
  Dock,
  Package,
  Compass,
  LucideCompass,
  BusIcon,
  BusFrontIcon
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
import BookingsPage from '../../Pages/Sales/Booking';
import GenerateReport from '../../Pages/Sales/GenerateReports';
import BookingStatusViewer from '../../Pages/Sales/BookingStatusViewer';
import DocumentViewer from '../../Pages/Sales/DocumentViewer';
import TripSchedule from '../../Pages/Sales/TripSchedule';


// Operation Dashboard Components
import AssignGuidePage from '../../Pages/Operation/AssignTeam';
import PackageForm from '../../Pages/Operation/PackageForm';
import TravelProgressUpdater from '../../Pages/Operation/TravelProgressUpdater';
import OperationDashboardOverview from '../../Pages/Operation/OperationOverview';
import ViewBookingStatus from '../../Pages/Operation/ViewBookingStatus';




//Accounts Dashboard components
import InvoicesPage from "../../Pages/Account/Invoices";
import ManagePayments from '../../Pages/Account/ManagePayments';
import ProcessRefunds from  '../../Pages/Account/ProcessRefunds';
import FinancialReports from '../../Pages/Account/FinancialReports';
import AccountOverview from '../../Pages/Account/AccountOverview';
import BookingStats from '../../Pages/Account/BookingStats';
import DocumentView from '../../Pages/Account/DocumentsView';
import TripScheduleViewer from '../../Pages/Account/Trip';


// Define wrapped components for the different tabs:
const AddBooking = () => <BookingsPage defaultTab="add" />;
const AllBooking = () => <BookingsPage defaultTab="all" />;


// Define wrapped components for Leads
const AddLead = () => <LeadsPage defaultTab="add" />;
const AllLeads = () => <LeadsPage defaultTab="all" />;


export const salesDashboardConfig = {
  basePath: '/salesdashboard',
  defaultTab: 'overview',
  tabs: {

    overview:{title:'Overview', component:SalesOverview, icon:BarChart3},
     leads: {title: 'Leads',icon: Users,
        children: {
          add: {
            title: 'Add Lead',
            path: 'add',
            component: AddLead,
          },
          all: {
            title: 'All Leads',
            path: 'all',
            component: AllLeads,
          }
        }
      },  
     bookings: {
      title: 'Bookings',
      icon: CalendarCheck2,
      children: {
        add: {
          title: 'Add Booking',
          path: 'add',
          component: AddBooking,
        },
        all: {
          title: 'All Bookings',
          path: 'all',
          component: AllBooking,
        }
      }
    },
    bookingStats: { title: 'Boking Status', component: BookingStats, icon: ClipboardList },
    document:{title : 'Document', component: DocumentViewer, icon :FileText},  
    reports: { title: 'Reports', component: AdminReports, icon: ClipboardList },
    travelschedule: { title: 'Travel Schedule', component: TripSchedule, icon: Truck },
  }
};


export const adminDashboardConfig = {
  basePath: '/admindashboard',
  defaultTab: 'reports',
  tabs: {
    overview:{title:'Overview', component:AdminOverview, icon:BarChart3},
    lead: { title: 'Leads', component: AdminLead, icon: Users },
    booking: { title: 'Booking', component: AdminBooking, icon: CalendarCheck2 },
    guideandtransportmanagement: { title: 'Guide/Transport Management', component: AdminGuideAndTransportManagement, icon: Users },
    packages: { title: 'Packages', component: AdminPackages, icon: FileText },
    payment: { title: 'Payments', component: AdminPayment, icon: Banknote },
    reports: { title: 'Reports', component: AdminReports, icon: ClipboardList },
    staffmanagement: { title: 'Staff Management', component: AdminStaffManagement, icon: Users },
  },
};


export const operationDashboardConfig = {
  basePath: '/ops',
  defaultTab: 'assign',
  tabs: {
    overview:{title:'Overview', component:OperationDashboardOverview, icon:BarChart3},
    bookingstatus:{title:'BokingStatus', component: ViewBookingStatus, icon:ClipboardList},
    guideandtransportmanagement: { title: 'Guide/Transport Management', component: AssignGuidePage, icon: Users },
    packages: { title: 'Packages', component: PackageForm, icon: FileText }, 
    travelprogress: { title: 'Travel Progress', component: TravelProgressUpdater, icon: BusFrontIcon },

  }
};


export const accountDashboardConfig = {
  basePath: '/account',
  defaultTab: 'AccountOverview',
  tabs: {
    Overview: { title: 'Overview', component: AccountOverview, icon: BarChart3 },
    bookingStats: { title: 'BokingStatus', component: BookingStats, icon: ClipboardList },
    documentView: { title: 'Document', component: DocumentView, icon: FileText }, // FIXED: changed from File to FileText
    financialReports: { title: 'Financial Reports', component: FinancialReports, icon: ReceiptPoundSterling },
    invoices: { title: 'Invoices', component: InvoicesPage, icon: FileText },
    managePayments: { title: 'Payments', component: ManagePayments, icon: Banknote },
    processRefunds: { title: 'Refunds', component: ProcessRefunds, icon: BanknoteIcon }, // FIXED: changed from BanknoteArrowDown to BanknoteIcon
    trip: { title: 'TripSchedule', component: TripScheduleViewer, icon: PlaneTakeoff }, // FIXED: changed component from TripSchedule to TripScheduleViewer
  }
};
