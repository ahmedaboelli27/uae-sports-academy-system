import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..', 'src', 'features');

const pages = [
  // public
  ['public', 'HomePage', 'Home', 'Welcome to UAE Sports Academy public website.'],
  ['public', 'AboutPage', 'About', 'Learn about our academy mission and values.'],
  ['public', 'ProgramsPage', 'Programs', 'Browse sports programs offered by the academy.'],
  ['public', 'ProgramDetailsPage', 'Program Details', 'View details for a specific program.'],
  ['public', 'CoachesPage', 'Coaches', 'Meet our certified coaching team.'],
  ['public', 'CoachProfilePage', 'Coach Profile', 'View coach biography and credentials.'],
  ['public', 'LocationsPage', 'Locations', 'Find academy branches across the UAE.'],
  ['public', 'PricingPage', 'Pricing', 'Explore program pricing and packages.'],
  ['public', 'OffersPage', 'Offers', 'Current promotions and seasonal offers.'],
  ['public', 'GalleryPage', 'Gallery', 'Photos and media from academy activities.'],
  ['public', 'EventsPage', 'Events & Camps', 'Upcoming events, camps, and clinics.'],
  ['public', 'EventDetailsPage', 'Event Details', 'Details for a specific event or camp.'],
  ['public', 'BlogPage', 'Blog', 'News, tips, and academy updates.'],
  ['public', 'BlogPostPage', 'Blog Post', 'Read a blog article.'],
  ['public', 'ContactPage', 'Contact', 'Get in touch with our team.'],
  ['public', 'RegisterChildPage', 'Register Child', 'Register your child for academy programs.'],
  ['public', 'BookTrialPage', 'Book Trial', 'Book a trial session for your child.'],
  ['public', 'TermsPage', 'Terms & Conditions', 'Terms of service for academy programs.'],
  ['public', 'PrivacyPage', 'Privacy Policy', 'How we handle your personal data.'],
  // auth
  ['auth', 'LoginPage', 'Login', 'Sign in to access your portal.'],
  ['auth', 'RegisterPage', 'Register', 'Create a new parent account.'],
  ['auth', 'ForgotPasswordPage', 'Forgot Password', 'Reset your account password.'],
  // parent
  ['parent', 'ParentDashboardPage', 'Parent Dashboard', 'Overview of your family account.'],
  ['parent', 'MyChildrenPage', 'My Children', 'Manage enrolled children.'],
  ['parent', 'ChildProfilePage', 'Child Profile', 'View child details and enrollment.'],
  ['parent', 'AttendanceReportPage', 'Attendance Report', 'Track session attendance history.'],
  ['parent', 'ProgressReportPage', 'Progress Report', 'View skill development progress.'],
  ['parent', 'SubscriptionsPage', 'Subscriptions', 'Manage active program subscriptions.'],
  ['parent', 'PaymentsPage', 'Payments', 'View payment history and methods.'],
  ['parent', 'InvoicesPage', 'Invoices', 'Download and review invoices.'],
  ['parent', 'MakeUpRequestPage', 'Make-up Session Request', 'Request a make-up training session.'],
  ['parent', 'MessagesPage', 'Messages', 'Communicate with coaches and staff.'],
  ['parent', 'DocumentsPage', 'Documents & Consent', 'Upload and sign required documents.'],
  ['parent', 'ProfileSettingsPage', 'Profile Settings', 'Update your account preferences.'],
  // coach
  ['coach', 'CoachDashboardPage', 'Coach Dashboard', 'Your daily coaching overview.'],
  ['coach', 'TodaySessionsPage', 'Today Sessions', 'Sessions scheduled for today.'],
  ['coach', 'AssignedStudentsPage', 'Assigned Students', 'Students assigned to your groups.'],
  ['coach', 'AttendancePage', 'Attendance', 'Mark and review session attendance.'],
  ['coach', 'SkillAssessmentsPage', 'Skill Assessments', 'Record student skill assessments.'],
  ['coach', 'ProgressNotesPage', 'Progress Notes', 'Add notes on student development.'],
  ['coach', 'IncidentReportPage', 'Incident Report', 'Report incidents and safety concerns.'],
  ['coach', 'CoachSchedulePage', 'Coach Schedule', 'View your weekly schedule.'],
  ['coach', 'CoachSettingsPage', 'Settings', 'Update coach profile and preferences.'],
  // admin
  ['admin', 'AdminDashboardPage', 'Admin Dashboard', 'Academy operations overview and KPIs.'],
  ['admin', 'StudentsManagementPage', 'Students Management', 'Manage enrolled students.'],
  ['admin', 'StudentNewPage', 'Add Student', 'Register a new student.'],
  ['admin', 'StudentDetailPage', 'Student Details', 'View student profile and enrollment.'],
  ['admin', 'StudentEditPage', 'Edit Student', 'Update student information.'],
  ['admin', 'ParentsManagementPage', 'Parents Management', 'Manage parent accounts.'],
  ['admin', 'CoachesManagementPage', 'Coaches Management', 'Manage coaching staff.'],
  ['admin', 'CoachNewPage', 'Add Coach', 'Onboard a new coach.'],
  ['admin', 'CoachDetailPage', 'Coach Details', 'View coach profile.'],
  ['admin', 'CoachEditPage', 'Edit Coach', 'Update coach information.'],
  ['admin', 'ProgramsManagementPage', 'Programs Management', 'Manage training programs.'],
  ['admin', 'ProgramNewPage', 'Add Program', 'Create a new program.'],
  ['admin', 'ProgramDetailPage', 'Program Details', 'View program configuration.'],
  ['admin', 'ProgramEditPage', 'Edit Program', 'Update program settings.'],
  ['admin', 'SportsManagementPage', 'Sports Management', 'Manage sports categories.'],
  ['admin', 'BranchesManagementPage', 'Branches Management', 'Manage academy branches.'],
  ['admin', 'BranchNewPage', 'Add Branch', 'Register a new branch location.'],
  ['admin', 'BranchDetailPage', 'Branch Details', 'View branch information.'],
  ['admin', 'BranchEditPage', 'Edit Branch', 'Update branch settings.'],
  ['admin', 'ScheduleManagementPage', 'Schedule Management', 'Manage class schedules.'],
  ['admin', 'AttendanceManagementPage', 'Attendance Management', 'Review academy-wide attendance.'],
  ['admin', 'FinanceDashboardPage', 'Finance Dashboard', 'Financial overview and metrics.'],
  ['admin', 'FinanceSubscriptionsPage', 'Subscriptions', 'Manage all subscriptions.'],
  ['admin', 'FinancePaymentsPage', 'Payments', 'Track incoming payments.'],
  ['admin', 'FinanceInvoicesPage', 'Invoices', 'Manage billing invoices.'],
  ['admin', 'OffersManagementPage', 'Offers & Coupons', 'Manage promotional offers.'],
  ['admin', 'CouponsManagementPage', 'Coupons', 'Manage discount coupons.'],
  ['admin', 'EventsManagementPage', 'Events', 'Manage academy events.'],
  ['admin', 'CampsManagementPage', 'Camps', 'Manage sports camps.'],
  ['admin', 'LeadsPage', 'Leads', 'Track marketing and enrollment leads.'],
  ['admin', 'TrialRequestsPage', 'Trial Requests', 'Review trial session requests.'],
  ['admin', 'ReportsPage', 'Reports & KPIs', 'Analytics and performance reports.'],
  ['admin', 'NotificationsPage', 'Notifications', 'System and user notifications.'],
  ['admin', 'CmsPage', 'Website CMS', 'Manage public website content.'],
  ['admin', 'CmsHomePage', 'CMS — Home', 'Edit homepage content blocks.'],
  ['admin', 'CmsGalleryPage', 'CMS — Gallery', 'Manage gallery media.'],
  ['admin', 'UsersPage', 'Users & Roles', 'Manage system users.'],
  ['admin', 'RolesPermissionsPage', 'Roles & Permissions', 'Configure role-based access.'],
  ['admin', 'SystemSettingsPage', 'System Settings', 'Academy system configuration.'],
  ['admin', 'AuditLogsPage', 'Audit Logs', 'Review system audit trail.'],
];

const template = (name, title, description) => `import PlaceholderPage from '@/components/shared/placeholder-page';

export default function ${name}() {
  return (
    <PlaceholderPage
      title="${title.replace(/"/g, '\\"')}"
      description="${description.replace(/"/g, '\\"')}"
    />
  );
}
`;

for (const [feature, name, title, description] of pages) {
  const dir = path.join(root, feature, 'pages');
  fs.mkdirSync(dir, { recursive: true });
  const filePath = path.join(dir, `${name}.tsx`);
  fs.writeFileSync(filePath, template(name, title, description), 'utf8');
}

console.log(`Generated ${pages.length} page files.`);
