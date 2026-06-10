// Mock data for the HRMS app
export const currentUser = {
  id: 'MM-003',
  name: 'Venil Mottana',
  firstName: 'Venil',
  lastName: 'Mottana',
  initials: 'VM',
  email: 'venil.mottana@metromindz.com',
  phone: '+91 98765 43210',
  designation: 'Senior Software Engineer',
  department: 'Development',
  company: 'MetroMindz',
  joinDate: '01 September 2021',
  employeeId: 'MM-003',
  reportingManager: 'Rahul Sharma',
  location: 'Mumbai, India',
  avatar: null,
  leaveBalance: {
    annual: 12,
    sick: 6,
    casual: 5,
    remaining: { annual: 8, sick: 4, casual: 3 },
  },
};

export const mockAttendance = [
  { date: '2025-06-04', checkIn: '09:18 AM', checkOut: 'Pending', hours: '00:52', status: 'active', location: 'Office' },
  { date: '2025-06-03', checkIn: '09:05 AM', checkOut: '06:12 PM', hours: '09:07', status: 'present', location: 'Office' },
  { date: '2025-06-02', checkIn: '09:45 AM', checkOut: '06:30 PM', hours: '08:45', status: 'late', location: 'Remote' },
  { date: '2025-06-01', checkIn: '--', checkOut: '--', hours: '--', status: 'weekend', location: '--' },
  { date: '2025-05-31', checkIn: '--', checkOut: '--', hours: '--', status: 'weekend', location: '--' },
  { date: '2025-05-30', checkIn: '08:55 AM', checkOut: '06:00 PM', hours: '09:05', status: 'present', location: 'Office' },
  { date: '2025-05-29', checkIn: '09:30 AM', checkOut: '05:45 PM', hours: '08:15', status: 'present', location: 'Remote' },
  { date: '2025-05-28', checkIn: '--', checkOut: '--', hours: '--', status: 'absent', location: '--' },
];

export const mockLeaves = [
  { id: 'L001', type: 'Annual Leave', from: '2025-06-10', to: '2025-06-12', days: 3, reason: 'Family vacation', status: 'pending', appliedOn: '2025-06-01' },
  { id: 'L002', type: 'Sick Leave', from: '2025-05-20', to: '2025-05-21', days: 2, reason: 'Medical appointment', status: 'approved', appliedOn: '2025-05-19' },
  { id: 'L003', type: 'Casual Leave', from: '2025-04-15', to: '2025-04-15', days: 1, reason: 'Personal work', status: 'approved', appliedOn: '2025-04-14' },
  { id: 'L004', type: 'Annual Leave', from: '2025-03-05', to: '2025-03-07', days: 3, reason: 'Travel', status: 'rejected', appliedOn: '2025-03-01' },
];

export const mockAnnouncements = [
  {
    id: 'A001',
    title: 'Q2 Company Town Hall – June 15th',
    content: 'We are excited to invite all employees to our Q2 Town Hall meeting. This session will cover company performance, upcoming product launches, and team recognitions. Please mark your calendars and join us virtually or at the Mumbai office.',
    category: 'Company',
    priority: 'high',
    author: 'HR Team',
    date: '2025-06-03',
    pinned: true,
    readBy: 45,
    totalEmployees: 68,
  },
  {
    id: 'A002',
    title: 'New Leave Policy Effective July 1st',
    content: 'Starting July 1st, 2025, the company will implement a revised leave policy. Key changes include flexible work-from-home days, additional casual leave, and streamlined approval workflows.',
    category: 'Policy',
    priority: 'high',
    author: 'HR Department',
    date: '2025-06-01',
    pinned: true,
    readBy: 62,
    totalEmployees: 68,
  },
  {
    id: 'A003',
    title: 'Team Outing – June 21st',
    content: 'The Development team outing is scheduled for June 21st. Venue and activity details will be shared by team leads. Please confirm your attendance by June 10th.',
    category: 'Event',
    priority: 'medium',
    author: 'Development Team',
    date: '2025-05-30',
    pinned: false,
    readBy: 28,
    totalEmployees: 32,
  },
  {
    id: 'A004',
    title: 'Office Closed – June 7th (Saturday)',
    content: 'Please note that the office will be closed on June 7th on account of a public holiday. Employees working remotely on critical projects should coordinate with their managers.',
    category: 'Holiday',
    priority: 'medium',
    author: 'Admin Team',
    date: '2025-05-28',
    pinned: false,
    readBy: 68,
    totalEmployees: 68,
  },
];

export const mockProjects = [
  {
    id: 'P001',
    name: 'MMNext Platform',
    description: 'Next-generation employee management platform with advanced analytics and AI features.',
    status: 'active',
    progress: 68,
    startDate: '2025-01-15',
    endDate: '2025-08-30',
    team: ['VM', 'RS', 'AM', 'PK'],
    tasksTotal: 48,
    tasksCompleted: 32,
    priority: 'high',
    client: 'Internal',
  },
  {
    id: 'P002',
    name: 'HRMS Mobile App',
    description: 'Mobile application for employee self-service and HR management on iOS & Android.',
    status: 'active',
    progress: 25,
    startDate: '2025-05-01',
    endDate: '2025-09-30',
    team: ['VM', 'SK', 'NP'],
    tasksTotal: 85,
    tasksCompleted: 21,
    priority: 'high',
    client: 'Internal',
  },
  {
    id: 'P003',
    name: 'Client Analytics Dashboard',
    description: 'Custom analytics and reporting dashboard for enterprise clients.',
    status: 'on-hold',
    progress: 42,
    startDate: '2025-03-01',
    endDate: '2025-07-15',
    team: ['RS', 'AM'],
    tasksTotal: 30,
    tasksCompleted: 13,
    priority: 'medium',
    client: 'TechCorp Ltd.',
  },
];

export const mockTasks = [
  { id: 'T001', title: 'Design Authentication Screens', project: 'HRMS Mobile App', status: 'completed', priority: 'high', dueDate: '2025-06-05', assignee: 'VM', progress: 100 },
  { id: 'T002', title: 'Build Dashboard Components', project: 'HRMS Mobile App', status: 'in-progress', priority: 'high', dueDate: '2025-06-10', assignee: 'VM', progress: 65 },
  { id: 'T003', title: 'Implement Attendance Module', project: 'HRMS Mobile App', status: 'in-progress', priority: 'high', dueDate: '2025-06-15', assignee: 'VM', progress: 30 },
  { id: 'T004', title: 'Integrate Leave Management API', project: 'MMNext Platform', status: 'todo', priority: 'medium', dueDate: '2025-06-20', assignee: 'VM', progress: 0 },
  { id: 'T005', title: 'Fix Payroll Calculation Bug', project: 'MMNext Platform', status: 'todo', priority: 'high', dueDate: '2025-06-08', assignee: 'VM', progress: 0 },
  { id: 'T006', title: 'Write Unit Tests for Auth Module', project: 'MMNext Platform', status: 'todo', priority: 'low', dueDate: '2025-06-25', assignee: 'VM', progress: 0 },
];

export const mockExpenses = [
  { id: 'E001', title: 'Client Meeting Lunch', category: 'Meals', amount: 1850, date: '2025-06-02', status: 'pending', receipt: true, description: 'Lunch with TechCorp client team' },
  { id: 'E002', title: 'Travel - Mumbai to Pune', category: 'Travel', amount: 3200, date: '2025-05-28', status: 'approved', receipt: true, description: 'Train tickets for client site visit' },
  { id: 'E003', title: 'Software License', category: 'Software', amount: 5000, date: '2025-05-20', status: 'approved', receipt: false, description: 'Annual subscription renewal' },
  { id: 'E004', title: 'Office Supplies', category: 'Office', amount: 750, date: '2025-05-15', status: 'rejected', receipt: true, description: 'Stationery and peripherals' },
];

export const mockNotifications = [
  { id: 'N001', title: 'Profile Updated', message: 'Your profile details have been successfully updated.', time: '2 min ago', type: 'info', read: false },
  { id: 'N002', title: 'Leave Approved', message: 'Your sick leave request for May 20-21 has been approved by Rahul Sharma.', time: '1 hour ago', type: 'success', read: false },
  { id: 'N003', title: 'New Task Assigned', message: 'You have been assigned "Implement Attendance Module" in HRMS Mobile App project.', time: '3 hours ago', type: 'info', read: false },
  { id: 'N004', title: 'Expense Rejected', message: 'Your expense claim for Office Supplies (₹750) has been rejected. Reason: Insufficient documentation.', time: 'Yesterday', type: 'danger', read: true },
  { id: 'N005', title: 'Announcement: Town Hall', message: 'Q2 Company Town Hall is scheduled for June 15th. Please RSVP by June 10th.', time: 'Jun 3', type: 'info', read: true },
  { id: 'N006', title: 'Attendance Reminder', message: 'You have not checked in today. Please mark your attendance.', time: 'Jun 2', type: 'warning', read: true },
];

export const mockChats = [
  { id: 'C001', name: 'Rahul Sharma', role: 'Engineering Manager', initials: 'RS', lastMessage: 'Please review the PR when you get a chance', time: '10:32 AM', unread: 2, online: true },
  { id: 'C002', name: 'Development Team', isGroup: true, members: 12, lastMessage: 'Meeting rescheduled to 3 PM', time: '09:15 AM', unread: 5, online: false },
  { id: 'C003', name: 'Anita Mehta', role: 'HR Manager', initials: 'AM', lastMessage: 'Your leave has been approved ✓', time: 'Yesterday', unread: 0, online: true },
  { id: 'C004', name: 'Priya Kapoor', role: 'UI/UX Designer', initials: 'PK', lastMessage: 'Sent the design files', time: 'Yesterday', unread: 0, online: false },
  { id: 'C005', name: 'HRMS Project', isGroup: true, members: 5, lastMessage: 'Sprint review at 4 PM', time: 'Jun 3', unread: 0, online: false },
];

export const mockEmployees = [
  { id: 'MM-001', name: 'Rahul Sharma', designation: 'Engineering Manager', department: 'Development', initials: 'RS', email: 'rahul@metromindz.com', phone: '+91 98000 11111', status: 'active' },
  { id: 'MM-002', name: 'Anita Mehta', designation: 'HR Manager', department: 'Human Resources', initials: 'AM', email: 'anita@metromindz.com', phone: '+91 98000 22222', status: 'active' },
  { id: 'MM-003', name: 'Venil Mottana', designation: 'Senior Software Engineer', department: 'Development', initials: 'VM', email: 'venil@metromindz.com', phone: '+91 98765 43210', status: 'active' },
  { id: 'MM-004', name: 'Priya Kapoor', designation: 'UI/UX Designer', department: 'Design', initials: 'PK', email: 'priya@metromindz.com', phone: '+91 98000 44444', status: 'active' },
  { id: 'MM-005', name: 'Suresh Kumar', designation: 'Backend Developer', department: 'Development', initials: 'SK', email: 'suresh@metromindz.com', phone: '+91 98000 55555', status: 'active' },
  { id: 'MM-006', name: 'Nisha Patel', designation: 'QA Engineer', department: 'Quality Assurance', initials: 'NP', email: 'nisha@metromindz.com', phone: '+91 98000 66666', status: 'active' },
];

export const mockPayslips = [
  { id: 'PAY-2025-05', month: 'May 2025', grossSalary: 125000, netSalary: 98450, deductions: 26550, status: 'paid', paidOn: '2025-05-31' },
  { id: 'PAY-2025-04', month: 'April 2025', grossSalary: 125000, netSalary: 98450, deductions: 26550, status: 'paid', paidOn: '2025-04-30' },
  { id: 'PAY-2025-03', month: 'March 2025', grossSalary: 125000, netSalary: 98450, deductions: 26550, status: 'paid', paidOn: '2025-03-31' },
  { id: 'PAY-2025-02', month: 'February 2025', grossSalary: 125000, netSalary: 97200, deductions: 27800, status: 'paid', paidOn: '2025-02-28' },
  { id: 'PAY-2025-01', month: 'January 2025', grossSalary: 125000, netSalary: 98450, deductions: 26550, status: 'paid', paidOn: '2025-01-31' },
];

export const mockLeads = [
  { id: 'LD001', title: 'TechCorp Enterprise Deal', company: 'TechCorp Ltd.', value: '₹12,00,000', status: 'negotiation', assignee: 'VM', lastActivity: '2 hours ago', probability: 75 },
  { id: 'LD002', title: 'StartupXYZ HRMS Package', company: 'StartupXYZ', value: '₹3,50,000', status: 'proposal', assignee: 'RS', lastActivity: 'Yesterday', probability: 45 },
  { id: 'LD003', title: 'GlobalMart Analytics', company: 'GlobalMart Inc.', value: '₹8,00,000', status: 'qualified', assignee: 'VM', lastActivity: '3 days ago', probability: 60 },
  { id: 'LD004', title: 'NewClient Onboarding', company: 'Fresh Ventures', value: '₹1,80,000', status: 'new', assignee: 'AM', lastActivity: 'Jun 1', probability: 20 },
];

export const mockAssets = [
  { id: 'DA001', name: 'Company Logo Pack', type: 'image', size: '4.2 MB', format: 'ZIP', category: 'Brand', updatedAt: '2025-05-20' },
  { id: 'DA002', name: 'Brand Guidelines 2025', type: 'document', size: '8.5 MB', format: 'PDF', category: 'Brand', updatedAt: '2025-04-15' },
  { id: 'DA003', name: 'Employee Handbook', type: 'document', size: '2.1 MB', format: 'PDF', category: 'HR', updatedAt: '2025-03-01' },
  { id: 'DA004', name: 'Product Demo Video', type: 'video', size: '125 MB', format: 'MP4', category: 'Marketing', updatedAt: '2025-05-28' },
  { id: 'DA005', name: 'Presentation Template', type: 'document', size: '3.8 MB', format: 'PPTX', category: 'Templates', updatedAt: '2025-05-10' },
];
