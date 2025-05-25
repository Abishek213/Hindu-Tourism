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
  LucideCompass
} from 'lucide-react';

// Admin Dashboard Components
import AdminBooking from '../../Pages/Admin/AdminBooking';
import AdminLead from '../../Pages/Admin/AdminLead';
import AdminPackages from '../../Pages/Admin/AdminPackages';
import AdminPayment from '../../Pages/Admin/AdminPayment';
import AdminReports from '../../Pages/Admin/AdminReports';
import AdminStaffManagement from '../../Pages/Admin/AdminStaffManagement';

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
    overview: { 
      title: 'Overview',    
      component: SalesOverview, 
      icon: BarChart3 // FIXED: Added missing icon
    },
    leads: { 
      title: 'Leads', 
      icon: Users,
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
      icon: BadgeCheck,
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
    GenerateReports: { 
      title: 'Report', 
      component: GenerateReport, 
      icon: BarChart3
    },
    BookingStatusViewer: {
      title: 'Booking Status',
      component: BookingStatusViewer,
      icon: ListChecks,
    },
    DocumentViewer: {
      title: 'Documents',
      component: DocumentViewer,
      icon: Dock,
    },
    TripSchedule: {
      title: 'TripSchedule',
      component: TripSchedule,
      icon: Bus,
    }
  }
};

export const adminDashboardConfig = {
  basePath: '/admindashboard',
  defaultTab: 'reports',
  tabs: {
    reports: { title: 'Reports', component: AdminReports, icon: BarChart3 },
    booking: { title: 'Booking', component: AdminBooking, icon: CalendarCheck2 },
    lead: { title: 'Leads', component: AdminLead, icon: Users },
    packages: { title: 'Packages', component: AdminPackages, icon: FileText },
    payment: { title: 'Payments', component: AdminPayment, icon: Banknote },
    staffmanagement: { title: 'Staff Management', component: AdminStaffManagement, icon: Users },
  },
};

export const operationDashboardConfig = {
  basePath: '/ops',
  defaultTab: 'overview',
  tabs: {
     overview:{title:'Overview', component:OperationDashboardOverview, icon:BarChart3},
     assign: { title: 'Assign Guide/Transport', component: AssignGuidePage, icon: Truck },
     package: {title:'Packages', component:PackageForm, icon:Package},
     travelprogress :{title:'TravelProgress',component:TravelProgressUpdater,icon:LucideCompass},
     bookingstatus:{title:'BokingStatus',component:ViewBookingStatus,icon:BarChart3},
     
    
  }
};

export const accountDashboardConfig = {
  basePath: '/account',
  defaultTab: 'AccountOverview',
  tabs: {
    AccountOverview: { title: 'Overview', component: AccountOverview, icon: BarChart3 },
    invoices: { title: 'Invoices', component: InvoicesPage, icon: FileText },
    ManagePayments: { title: 'Payments', component: ManagePayments, icon: Banknote },
    ProcessRefunds: { title: 'Refunds', component: ProcessRefunds, icon: BanknoteIcon }, // FIXED: changed from BanknoteArrowDown to BanknoteIcon
    FinancialReports: { title: 'FinancialReports', component: FinancialReports, icon: ReceiptPoundSterling },
    BookingStats: { title: 'BookingStatus', component: BookingStats, icon: FileText },
    DocumentView: { title: 'DocumentViewer', component: DocumentView, icon: FileText }, // FIXED: changed from File to FileText
    Trip: { title: 'TripSchedule', component: TripScheduleViewer, icon: PlaneTakeoff }, // FIXED: changed component from TripSchedule to TripScheduleViewer
  }
};