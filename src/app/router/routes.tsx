import AdminLayout from '@/app/layouts/AdminLayout';
import AuthLayout from '@/app/layouts/AuthLayout';
import CoachLayout from '@/app/layouts/CoachLayout';
import ParentLayout from '@/app/layouts/ParentLayout';
import PublicLayout from '@/app/layouts/PublicLayout';
import ProtectedRoute from '@/app/router/ProtectedRoute';
import { RoleBasedRedirect } from '@/app/router/RoleBasedRedirect';
import { ROUTE_PATHS } from '@/app/router/route-paths';

import AdminDashboardPage from '@/features/admin/pages/AdminDashboardPage';
import AttendanceDetailsPage from '@/features/admin/pages/AttendanceDetailsPage';
import AttendanceManagementPage from '@/features/admin/pages/AttendanceManagementPage';
import AuditLogsPage from '@/features/admin/pages/AuditLogsPage';
import BranchDetailsPage from '@/features/admin/pages/BranchDetailPage';
import BranchEditPage from '@/features/admin/pages/BranchEditPage';
import BranchNewPage from '@/features/admin/pages/BranchNewPage';
import BranchesManagementPage from '@/features/admin/pages/BranchesManagementPage';
import CampsManagementPage from '@/features/admin/pages/CampsManagementPage';
import CmsGalleryPage from '@/features/admin/pages/CmsGalleryPage';
import CmsHomePage from '@/features/admin/pages/CmsHomePage';
import CmsPage from '@/features/admin/pages/CmsPage';
import CoachDetailPage from '@/features/admin/pages/CoachDetailPage';
import CoachEditPage from '@/features/admin/pages/CoachEditPage';
import CoachNewPage from '@/features/admin/pages/CoachNewPage';
import CoachesManagementPage from '@/features/admin/pages/CoachesManagementPage';
import CouponsManagementPage from '@/features/admin/pages/CouponsManagementPage';
import EventsManagementPage from '@/features/admin/pages/EventsManagementPage';
import FinanceDashboardPage from '@/features/admin/pages/FinanceDashboardPage';
import FinanceInvoiceDetailsPage from '@/features/admin/pages/FinanceInvoiceDetailsPage';
import FinanceInvoiceEditPage from '@/features/admin/pages/FinanceInvoiceEditPage';
import FinanceInvoiceNewPage from '@/features/admin/pages/FinanceInvoiceNewPage';
import FinanceInvoicesPage from '@/features/admin/pages/FinanceInvoicesPage';
import FinancePaymentDetailsPage from '@/features/admin/pages/FinancePaymentDetailsPage';
import FinancePaymentEditPage from '@/features/admin/pages/FinancePaymentEditPage';
import FinancePaymentNewPage from '@/features/admin/pages/FinancePaymentNewPage';
import FinancePaymentsPage from '@/features/admin/pages/FinancePaymentsPage';
import FinanceSubscriptionDetailsPage from '@/features/admin/pages/FinanceSubscriptionDetailsPage';
import FinanceSubscriptionEditPage from '@/features/admin/pages/FinanceSubscriptionEditPage';
import FinanceSubscriptionNewPage from '@/features/admin/pages/FinanceSubscriptionNewPage';
import FinanceSubscriptionsPage from '@/features/admin/pages/FinanceSubscriptionsPage';
import LeadsPage from '@/features/admin/pages/LeadsPage';
import MarkAttendancePage from '@/features/admin/pages/MarkAttendancePage';
import NotificationsPage from '@/features/admin/pages/NotificationsPage';
import OffersManagementPage from '@/features/admin/pages/OffersManagementPage';
import ParentDetailsPage from '@/features/admin/pages/ParentsDetailsPage';
import ParentEditPage from '@/features/admin/pages/ParentsEditPage';
import ParentsPage from '@/features/admin/pages/ParentsManagementPage';
import ParentNewPage from '@/features/admin/pages/ParentsNewPage';
import ProgramDetailPage from '@/features/admin/pages/ProgramDetailPage';
import ProgramEditPage from '@/features/admin/pages/ProgramEditPage';
import ProgramNewPage from '@/features/admin/pages/ProgramNewPage';
import ProgramsManagementPage from '@/features/admin/pages/ProgramsManagementPage';
import ReportsPage from '@/features/admin/pages/ReportsPage';
import RolesPermissionsPage from '@/features/admin/pages/RolesPermissionsPage';
import ScheduleDetailsPage from '@/features/admin/pages/ScheduleDetailsPage';
import ScheduleEditPage from '@/features/admin/pages/ScheduleEditPage';
import ScheduleManagementPage from '@/features/admin/pages/ScheduleManagementPage';
import ScheduleNewPage from '@/features/admin/pages/ScheduleNewPage';
import SportsManagementPage from '@/features/admin/pages/SportsManagementPage';
import StudentDetailsPage from '@/features/admin/pages/StudentDetailPage';
import StudentEditPage from '@/features/admin/pages/StudentEditPage';
import StudentNewPage from '@/features/admin/pages/StudentNewPage';
import StudentsPage from '@/features/admin/pages/StudentsManagementPage';
import SystemSettingsPage from '@/features/admin/pages/SystemSettingsPage';
import TrialRequestsPage from '@/features/admin/pages/TrialRequestsPage';
import UsersPage from '@/features/admin/pages/UsersPage';

import ForgotPasswordPage from '@/features/auth/pages/ForgotPasswordPage';
import LoginPage from '@/features/auth/pages/LoginPage';
import RegisterPage from '@/features/auth/pages/RegisterPage';

import AssignedStudentsPage from '@/features/coach/pages/AssignedStudentsPage';
import AttendancePage from '@/features/coach/pages/AttendancePage';
import CoachDashboardPage from '@/features/coach/pages/CoachDashboardPage';
import CoachMessagesPage from '@/features/coach/pages/CoachMessagesPage';
import CoachSchedulePage from '@/features/coach/pages/CoachSchedulePage';
import CoachSettingsPage from '@/features/coach/pages/CoachSettingsPage';
import IncidentReportPage from '@/features/coach/pages/IncidentReportPage';
import PlayerProfilePage from '@/features/coach/pages/PlayerProfilePage';
import ProgressNotesPage from '@/features/coach/pages/ProgressNotesPage';
import SessionDetailsPage from '@/features/coach/pages/SessionDetailsPage';
import SkillAssessmentsPage from '@/features/coach/pages/SkillAssessmentsPage';
import TodaySessionsPage from '@/features/coach/pages/TodaySessionsPage';

import AttendanceReportPage from '@/features/parent/pages/AttendanceReportPage';
import ChildProfilePage from '@/features/parent/pages/ChildProfilePage';
import DocumentsPage from '@/features/parent/pages/DocumentsPage';
import InvoicesPage from '@/features/parent/pages/InvoicesPage';
import MakeUpRequestPage from '@/features/parent/pages/MakeUpRequestPage';
import MessagesPage from '@/features/parent/pages/MessagesPage';
import MyChildrenPage from '@/features/parent/pages/MyChildrenPage';
import ParentDashboardPage from '@/features/parent/pages/ParentDashboardPage';
import PaymentsPage from '@/features/parent/pages/PaymentsPage';
import ProfileSettingsPage from '@/features/parent/pages/ProfileSettingsPage';
import ProgressReportPage from '@/features/parent/pages/ProgressReportPage';
import SubscriptionsPage from '@/features/parent/pages/SubscriptionsPage';

import AboutPage from '@/features/public/pages/AboutPage';
import BlogPage from '@/features/public/pages/BlogPage';
import BlogPostPage from '@/features/public/pages/BlogPostPage';
import BookTrialPage from '@/features/public/pages/BookTrialPage';
import CoachProfilePage from '@/features/public/pages/CoachProfilePage';
import CoachesPage from '@/features/public/pages/CoachesPage';
import ContactPage from '@/features/public/pages/ContactPage';
import EventDetailsPage from '@/features/public/pages/EventDetailsPage';
import EventsPage from '@/features/public/pages/EventsPage';
import GalleryPage from '@/features/public/pages/GalleryPage';
import HomePage from '@/features/public/pages/HomePage';
import LocationsPage from '@/features/public/pages/LocationsPage';
import OffersPage from '@/features/public/pages/OffersPage';
import PricingPage from '@/features/public/pages/PricingPage';
import PrivacyPage from '@/features/public/pages/PrivacyPage';
import ProgramDetailsPage from '@/features/public/pages/ProgramDetailsPage';
import ProgramsPage from '@/features/public/pages/ProgramsPage';
import RegisterChildPage from '@/features/public/pages/RegisterChildPage';
import TermsPage from '@/features/public/pages/TermsPage';

import { createBrowserRouter, Navigate } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: ROUTE_PATHS.public.home, element: <HomePage /> },
      { path: ROUTE_PATHS.public.about, element: <AboutPage /> },
      { path: ROUTE_PATHS.public.programs, element: <ProgramsPage /> },
      { path: '/programs/:programId', element: <ProgramDetailsPage /> },
      { path: ROUTE_PATHS.public.coaches, element: <CoachesPage /> },
      { path: '/coaches/:coachId', element: <CoachProfilePage /> },
      { path: ROUTE_PATHS.public.locations, element: <LocationsPage /> },
      { path: ROUTE_PATHS.public.pricing, element: <PricingPage /> },
      { path: ROUTE_PATHS.public.offers, element: <OffersPage /> },
      { path: ROUTE_PATHS.public.gallery, element: <GalleryPage /> },
      { path: ROUTE_PATHS.public.events, element: <EventsPage /> },
      { path: '/events/:eventId', element: <EventDetailsPage /> },
      { path: ROUTE_PATHS.public.blog, element: <BlogPage /> },
      { path: '/blog/:postId', element: <BlogPostPage /> },
      { path: ROUTE_PATHS.public.contact, element: <ContactPage /> },
      { path: ROUTE_PATHS.public.registerChild, element: <RegisterChildPage /> },
      { path: ROUTE_PATHS.public.bookTrial, element: <BookTrialPage /> },
      { path: ROUTE_PATHS.public.terms, element: <TermsPage /> },
      { path: ROUTE_PATHS.public.privacy, element: <PrivacyPage /> },
    ],
  },

  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
    ],
  },

  { path: '/portal', element: <RoleBasedRedirect /> },

  {
    element: <ProtectedRoute allowedRoles={['parent']} />,
    children: [
      {
        element: <ParentLayout />,
        children: [
          { path: ROUTE_PATHS.parent.dashboard, element: <ParentDashboardPage /> },
          { path: ROUTE_PATHS.parent.children, element: <MyChildrenPage /> },
          { path: '/parent/children/:childId', element: <ChildProfilePage /> },
          {
            path: '/parent/children/:childId/attendance',
            element: <AttendanceReportPage />,
          },
          {
            path: '/parent/children/:childId/progress',
            element: <ProgressReportPage />,
          },
          { path: ROUTE_PATHS.parent.subscriptions, element: <SubscriptionsPage /> },
          { path: ROUTE_PATHS.parent.payments, element: <PaymentsPage /> },
          { path: ROUTE_PATHS.parent.invoices, element: <InvoicesPage /> },
          { path: ROUTE_PATHS.parent.makeUpRequest, element: <MakeUpRequestPage /> },
          { path: ROUTE_PATHS.parent.messages, element: <MessagesPage /> },
          { path: ROUTE_PATHS.parent.documents, element: <DocumentsPage /> },

          /*
           * Parent profile routes.
           * /parent/profile is used by the Topbar profile icon for parent users.
           * ROUTE_PATHS.parent.settings is kept for compatibility with existing links.
           */
          { path: '/parent/profile', element: <ProfileSettingsPage /> },
          { path: ROUTE_PATHS.parent.settings, element: <ProfileSettingsPage /> },
        ],
      },
    ],
  },

  {
    element: <ProtectedRoute allowedRoles={['coach']} />,
    children: [
      {
        element: <CoachLayout />,
        children: [
          { path: ROUTE_PATHS.coach.dashboard, element: <CoachDashboardPage /> },

          /*
           * Coach sessions.
           */
          { path: ROUTE_PATHS.coach.todaySessions, element: <TodaySessionsPage /> },
          { path: ROUTE_PATHS.coach.sessions, element: <TodaySessionsPage /> },
          {
            path: ROUTE_PATHS.coach.sessionDetails(),
            element: <SessionDetailsPage />,
          },

          /*
           * Coach assigned students / players.
           */
          { path: ROUTE_PATHS.coach.students, element: <AssignedStudentsPage /> },
          { path: ROUTE_PATHS.coach.players, element: <AssignedStudentsPage /> },
          {
            path: ROUTE_PATHS.coach.playerProfile(),
            element: <PlayerProfilePage />,
          },

          { path: ROUTE_PATHS.coach.attendance, element: <AttendancePage /> },

          /*
           * Keep both routes:
           * /coach/assessments for old links
           * /coach/skill-assessments for new coach UI links
           */
          { path: ROUTE_PATHS.coach.assessments, element: <SkillAssessmentsPage /> },
          {
            path: ROUTE_PATHS.coach.skillAssessments,
            element: <SkillAssessmentsPage />,
          },

          { path: ROUTE_PATHS.coach.progressNotes, element: <ProgressNotesPage /> },

          /*
           * Keep both routes:
           * /coach/incident-report for old links
           * /coach/incidents for new coach UI links
           */
          { path: ROUTE_PATHS.coach.incidentReport, element: <IncidentReportPage /> },
          { path: ROUTE_PATHS.coach.incidents, element: <IncidentReportPage /> },

          { path: ROUTE_PATHS.coach.schedule, element: <CoachSchedulePage /> },
          { path: ROUTE_PATHS.coach.messages, element: <CoachMessagesPage /> },
          { path: ROUTE_PATHS.coach.settings, element: <CoachSettingsPage /> },
          { path: ROUTE_PATHS.coach.profile, element: <CoachSettingsPage /> },
        ],
      },
    ],
  },

  {
    element: <ProtectedRoute allowedRoles={['accountant', 'admin']} />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: ROUTE_PATHS.admin.dashboard, element: <AdminDashboardPage /> },

          /*
           * Admin/accountant profile route.
           * Use this route from the Topbar while inside AdminLayout.
           */
          { path: '/admin/profile', element: <ProfileSettingsPage /> },

          { path: ROUTE_PATHS.admin.students, element: <StudentsPage /> },
          { path: ROUTE_PATHS.admin.studentNew, element: <StudentNewPage /> },
          { path: '/admin/students/new', element: <StudentNewPage /> },
          { path: '/admin/students/:studentId/edit', element: <StudentEditPage /> },
          { path: '/admin/students/:studentId', element: <StudentDetailsPage /> },

          { path: ROUTE_PATHS.admin.parents, element: <ParentsPage /> },
          { path: '/admin/parents/new', element: <ParentNewPage /> },
          { path: '/admin/parents/:parentId/edit', element: <ParentEditPage /> },
          { path: '/admin/parents/:parentId', element: <ParentDetailsPage /> },

          { path: ROUTE_PATHS.admin.coaches, element: <CoachesManagementPage /> },
          { path: ROUTE_PATHS.admin.coachNew, element: <CoachNewPage /> },
          { path: '/admin/coaches/new', element: <CoachNewPage /> },
          { path: '/admin/coaches/:coachId/edit', element: <CoachEditPage /> },
          { path: '/admin/coaches/:coachId', element: <CoachDetailPage /> },

          { path: ROUTE_PATHS.admin.programs, element: <ProgramsManagementPage /> },
          { path: ROUTE_PATHS.admin.programNew, element: <ProgramNewPage /> },
          { path: '/admin/programs/new', element: <ProgramNewPage /> },
          { path: '/admin/programs/:programId/edit', element: <ProgramEditPage /> },
          { path: '/admin/programs/:programId', element: <ProgramDetailPage /> },

          { path: ROUTE_PATHS.admin.sports, element: <SportsManagementPage /> },

          { path: ROUTE_PATHS.admin.branches, element: <BranchesManagementPage /> },
          { path: ROUTE_PATHS.admin.branchNew, element: <BranchNewPage /> },
          { path: '/admin/branches/new', element: <BranchNewPage /> },
          { path: '/admin/branches/:branchId/edit', element: <BranchEditPage /> },
          { path: '/admin/branches/:branchId', element: <BranchDetailsPage /> },

          { path: ROUTE_PATHS.admin.schedule, element: <ScheduleManagementPage /> },
          { path: '/admin/schedule/new', element: <ScheduleNewPage /> },
          { path: '/admin/schedule/:sessionId/edit', element: <ScheduleEditPage /> },
          { path: '/admin/schedule/:sessionId', element: <ScheduleDetailsPage /> },

          { path: ROUTE_PATHS.admin.attendance, element: <AttendanceManagementPage /> },
          { path: ROUTE_PATHS.admin.attendanceMark, element: <MarkAttendancePage /> },
          {
            path: '/admin/attendance/:attendanceId/mark',
            element: <MarkAttendancePage />,
          },
          {
            path: '/admin/attendance/:attendanceId',
            element: <AttendanceDetailsPage />,
          },

          { path: ROUTE_PATHS.admin.finance, element: <FinanceDashboardPage /> },
          {
            path: ROUTE_PATHS.admin.financeSubscriptions,
            element: <FinanceSubscriptionsPage />,
          },
          {
            path: '/admin/finance/subscriptions/new',
            element: <FinanceSubscriptionNewPage />,
          },
          {
            path: '/admin/finance/subscriptions/:subscriptionId',
            element: <FinanceSubscriptionDetailsPage />,
          },
          {
            path: '/admin/finance/subscriptions/:subscriptionId/edit',
            element: <FinanceSubscriptionEditPage />,
          },
          {
            path: ROUTE_PATHS.admin.financeInvoices,
            element: <FinanceInvoicesPage />,
          },
          {
            path: '/admin/finance/invoices/new',
            element: <FinanceInvoiceNewPage />,
          },
          {
            path: '/admin/finance/invoices/:invoiceId',
            element: <FinanceInvoiceDetailsPage />,
          },
          {
            path: '/admin/finance/invoices/:invoiceId/edit',
            element: <FinanceInvoiceEditPage />,
          },
          {
            path: ROUTE_PATHS.admin.financePayments,
            element: <FinancePaymentsPage />,
          },
          {
            path: '/admin/finance/payments/new',
            element: <FinancePaymentNewPage />,
          },
          {
            path: '/admin/finance/payments/:paymentId',
            element: <FinancePaymentDetailsPage />,
          },
          {
            path: '/admin/finance/payments/:paymentId/edit',
            element: <FinancePaymentEditPage />,
          },

          { path: ROUTE_PATHS.admin.offers, element: <OffersManagementPage /> },
          { path: ROUTE_PATHS.admin.coupons, element: <CouponsManagementPage /> },
          { path: ROUTE_PATHS.admin.events, element: <EventsManagementPage /> },
          { path: ROUTE_PATHS.admin.camps, element: <CampsManagementPage /> },
          { path: ROUTE_PATHS.admin.leads, element: <LeadsPage /> },
          { path: ROUTE_PATHS.admin.trialRequests, element: <TrialRequestsPage /> },
          { path: ROUTE_PATHS.admin.reports, element: <ReportsPage /> },
          { path: ROUTE_PATHS.admin.notifications, element: <NotificationsPage /> },

          { path: ROUTE_PATHS.admin.cms, element: <CmsPage /> },
          { path: ROUTE_PATHS.admin.cmsHome, element: <CmsHomePage /> },
          { path: ROUTE_PATHS.admin.cmsGallery, element: <CmsGalleryPage /> },

          { path: ROUTE_PATHS.admin.users, element: <UsersPage /> },
          {
            path: ROUTE_PATHS.admin.rolesPermissions,
            element: <RolesPermissionsPage />,
          },
          { path: ROUTE_PATHS.admin.settings, element: <SystemSettingsPage /> },
          { path: ROUTE_PATHS.admin.auditLogs, element: <AuditLogsPage /> },
        ],
      },
    ],
  },

  { path: '*', element: <Navigate to={ROUTE_PATHS.public.home} replace /> },
]);