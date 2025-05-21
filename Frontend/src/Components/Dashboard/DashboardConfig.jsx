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
  BanknoteArrowDown,
  FileText, 
  ClipboardList, 
  CalendarCheck2, 
  BadgeCheck ,
  ReceiptPoundSterling,
  ListChecks,
  Dock
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
//import AssignGuidePage from '../../Pages/Operation/AssignGuide';
//import UpdateProgressPage from '../../Pages/Operation/UpdateProgress';

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
      icon: BarChart3 // You can choose another icon if preferred
    },

  BookingStatusViewer: {
      title: 'Booking Status',
      component: BookingStatusViewer, // ✅ corrected reference
      icon: ListChecks, // ✅ valid Lucide icon
    },

    DocumentViewer:{
      title: 'Documents',
      component: DocumentViewer,
      icon: Dock,
    },

     TripSchedule:{
      title: 'TripSchedule',
      component: TripSchedule,
      icon:Bus,
     }
  }
  
};


export const adminDashboardConfig = {
  basePath: '/admindashboard',
  defaultTab: 'reports',
  tabs: {
    reports: { title: 'Reports', component: AdminReports, icon: BarChart3 },        // bar chart icon
    booking: { title: 'Booking', component: AdminBooking, icon: CalendarCheck2 },   // calendar icon
    lead: { title: 'Leads', component: AdminLead, icon: Users },                   // users icon
    packages: { title: 'Packages', component: AdminPackages, icon: FileText },      // file text icon
    payment: { title: 'Payments', component: AdminPayment, icon: Banknote },        // banknote icon
    staffmanagement: { title: 'Staff Management', component: AdminStaffManagement, icon: Users }, // users icon
  },
};



export const operationDashboardConfig = {
  basePath: '/ops',
  defaultTab: 'assign', // updated to existing tab
  tabs: {
    // overview: { title: 'Overview', component: OperationOverview, icon: BarChart3 }, // REMOVE
    //assign: { title: 'Assign Guide/Transport', component: AssignGuidePage, icon: Truck },
    //progress: { title: 'Progress Updates', component: UpdateProgressPage, icon: Map }
  }
};

export const accountDashboardConfig = {
  basePath: '/account',
  defaultTab: 'AccountOverview', // updated to existing tab
  tabs: {
    AccountOverview : {title:'Overview', component:AccountOverview,icon:BarChart3},
    invoices: { title: 'Invoices', component: InvoicesPage, icon: FileText },
    ManagePayments: { title: 'Payments', component:ManagePayments , icon:Banknote },
    ProcessRefunds : { title : 'Refunds', component: ProcessRefunds, icon:BanknoteArrowDown},
    FinancialReports: {title:'FinancialReports' , component:FinancialReports, icon:ReceiptPoundSterling},
    BookingStats: {title:'BookingStatus', component:BookingStats,icon:FileText},
    DocumentView :{title:'DocumentViewer', component:DocumentView, icon:File},
    Trip :{title:'TripSchedule', component:TripSchedule, icon:PlaneTakeoff},
  }
};