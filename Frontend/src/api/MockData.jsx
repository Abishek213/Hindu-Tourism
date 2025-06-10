// This file contains mock data for the sales dashboard

export const mockLeadStats = {
  total: 158,
  newToday: 12,
  conversion: 32,
  changePercentage: 18,
};

export const mockRevenueStats = {
  totalRevenue: "₹12,85,500",
  currentMonth: "₹3,25,000",
  changePercentage: 12,
};

export const mockLeadSource = [
  { name: "Website", value: 45, percentage: "40%" },
  { name: "WhatsApp", value: 30, percentage: "25%" },
  { name: "Phone Calls", value: 15, percentage: "15%" },
  { name: "Email", value: 10, percentage: "10%" },
  { name: "Social Media", value: 20, percentage: "20%" },
];

export const mockPackagePopularity = [
  { name: "Pashupatinath", value: 40, percentage: "40%" },
  { name: "Muktinath", value: 35, percentage: "35%" },
  { name: "Pashupatinath and Muktinath", value: 25, percentage: "25%" },
];

export const mockLeadStatusData = [
  { name: "New", value: 35 },
  { name: "Contacted", value: 45 },
  { name: "Converted", value: 30 },
  { name: "Lost", value: 12 },
];

export const mockMonthlyBookings = [
  { name: "Jan", value: 12 },
  { name: "Feb", value: 19 },
  { name: "Mar", value: 25 },
  { name: "Apr", value: 32 },
  { name: "May", value: 28 },
  { name: "Jun", value: 35 },
  { name: "Jul", value: 45 },
  { name: "Aug", value: 52 },
  { name: "Sep", value: 48 },
  { name: "Oct", value: 55 },
  { name: "Nov", value: 60 },
  { name: "Dec", value: 40 },
];

export const mockMonthlySales = [
  { 
    name: "Jan", 
    revenue: 125000, 
    bookings: 12
  },
  { 
    name: "Feb", 
    revenue: 190000, 
    bookings: 19 
  },
  { 
    name: "Mar", 
    revenue: 250000, 
    bookings: 25 
  },
  { 
    name: "Apr", 
    revenue: 320000, 
    bookings: 32 
  },
  { 
    name: "May", 
    revenue: 280000, 
    bookings: 28 
  },
  { 
    name: "Jun", 
    revenue: 350000, 
    bookings: 35 
  },
];

export const mockRecentLeads = [
  {
    id: 1,
    name: "Rajesh Sharma",
    email: "rajesh.sharma@gmail.com",
    phone: "+91 9876543210",
    source: "Website",
    status: "New",
    date: "2025-05-12",
    assignedTo: "Amit Kumar"
  },
  {
    id: 2,
    name: "Priya Patel",
    email: "priya.patel@outlook.com",
    phone: "+91 8765432109",
    source: "WhatsApp",
    status: "Contacted",
    date: "2025-05-11",
    assignedTo: "Neha Singh"
  },
  {
    id: 3,
    name: "Vikram Malhotra",
    email: "vikram.m@yahoo.com",
    phone: "+91 7654321098",
    source: "Phone Call",
    status: "Interested",
    date: "2025-05-10",
    assignedTo: "Amit Kumar"
  },
  {
    id: 4,
    name: "Kavita Desai",
    email: "kavita.d@gmail.com",
    phone: "+91 6543210987",
    source: "Email",
    status: "Booked",
    date: "2025-05-09",
    assignedTo: "Neha Singh"
  },
  {
    id: 5,
    name: "Anand Gupta",
    email: "anand.g@hotmail.com",
    phone: "+91 5432109876",
    source: "Website",
    status: "Not Interested",
    date: "2025-05-08",
    assignedTo: "Amit Kumar"
  }
];

export const mockUpcomingFollowUps = [
  {
    id: 1,
    name: "Rajesh Sharma",
    date: "Today, 2:30 PM",
    phone: "+91 9876543210",
    priority: "High",
    assignedTo: "You",
    notes: "Interested in Pashupatinath package for family of 4."
  },
  {
    id: 2,
    name: "Priya Patel",
    date: "Today, 4:00 PM",
    phone: "+91 8765432109",
    priority: "Medium",
    assignedTo: "You",
    notes: "Asked for discount on Muktinath helicopter option."
  },
  {
    id: 3,
    name: "Vikram Malhotra",
    date: "Tomorrow, 11:00 AM",
    phone: "+91 7654321098",
    priority: "Low",
    assignedTo: "You",
    notes: "Requested brochure for combined package."
  }
];

export const mockTeamPerformance = [
  {
    name: "Amit Kumar",
    leadsAssigned: 45,
    conversions: 18,
    conversionRate: "40%"
  },
  {
    name: "Neha Singh",
    leadsAssigned: 38,
    conversions: 12,
    conversionRate: "32%"
  },
  {
    name: "Rahul Verma",
    leadsAssigned: 42,
    conversions: 22,
    conversionRate: "52%"
  },
  {
    name: "Pooja Sharma",
    leadsAssigned: 33,
    conversions: 15,
    conversionRate: "45%"
  }
];