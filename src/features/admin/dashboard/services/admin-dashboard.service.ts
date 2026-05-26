import type { AdminDashboardDto } from "../types/admin-dashboard.dto";

function mockDelay(ms = 350) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export async function getAdminDashboardData(): Promise<AdminDashboardDto> {
  await mockDelay();

  return {
    kpis: [
      {
        id: "total-students",
        titleKey: "adminDashboard.kpis.totalStudents",
        value: "1,248",
        change: "+12.5%",
        trend: "up",
        descriptionKey: "adminDashboard.kpis.totalStudentsDesc",
      },
      {
        id: "active-students",
        titleKey: "adminDashboard.kpis.activeStudents",
        value: "1,104",
        change: "+8.2%",
        trend: "up",
        descriptionKey: "adminDashboard.kpis.activeStudentsDesc",
      },
      {
        id: "monthly-revenue",
        titleKey: "adminDashboard.kpis.monthlyRevenue",
        value: "AED 284K",
        change: "+18.4%",
        trend: "up",
        descriptionKey: "adminDashboard.kpis.monthlyRevenueDesc",
      },
      {
        id: "pending-payments",
        titleKey: "adminDashboard.kpis.pendingPayments",
        value: "43",
        change: "-6.1%",
        trend: "down",
        descriptionKey: "adminDashboard.kpis.pendingPaymentsDesc",
      },
      {
        id: "attendance-rate",
        titleKey: "adminDashboard.kpis.attendanceRate",
        value: "91%",
        change: "+3.4%",
        trend: "up",
        descriptionKey: "adminDashboard.kpis.attendanceRateDesc",
      },
      {
        id: "trial-conversion",
        titleKey: "adminDashboard.kpis.trialConversion",
        value: "62%",
        change: "+9.8%",
        trend: "up",
        descriptionKey: "adminDashboard.kpis.trialConversionDesc",
      },
    ],

    revenueByMonth: [
      { month: "Jan", revenue: 165000, subscriptions: 410 },
      { month: "Feb", revenue: 178000, subscriptions: 438 },
      { month: "Mar", revenue: 192000, subscriptions: 462 },
      { month: "Apr", revenue: 214000, subscriptions: 498 },
      { month: "May", revenue: 238000, subscriptions: 535 },
      { month: "Jun", revenue: 284000, subscriptions: 592 },
    ],

    attendanceTrend: [
      { day: "Sun", attendanceRate: 88, absences: 22 },
      { day: "Mon", attendanceRate: 91, absences: 18 },
      { day: "Tue", attendanceRate: 89, absences: 20 },
      { day: "Wed", attendanceRate: 94, absences: 12 },
      { day: "Thu", attendanceRate: 92, absences: 15 },
      { day: "Fri", attendanceRate: 86, absences: 28 },
      { day: "Sat", attendanceRate: 90, absences: 21 },
    ],

    programDistribution: [
      { name: "Football", students: 520 },
      { name: "Swimming", students: 310 },
      { name: "Basketball", students: 245 },
      { name: "Multi-Sport", students: 173 },
    ],

    branchPerformance: [
      {
        branch: "Dubai",
        students: 560,
        revenue: 132000,
        attendanceRate: 93,
      },
      {
        branch: "Abu Dhabi",
        students: 420,
        revenue: 98000,
        attendanceRate: 90,
      },
      {
        branch: "Sharjah",
        students: 268,
        revenue: 54000,
        attendanceRate: 87,
      },
    ],

    recentActivities: [
      {
        id: "act-1",
        type: "registration",
        title: "New student registration",
        description: "Omar Khaled joined Football Academy - Dubai Branch.",
        time: "10 min ago",
      },
      {
        id: "act-2",
        type: "payment",
        title: "Payment received",
        description: "AED 1,250 received for Swimming Program subscription.",
        time: "25 min ago",
      },
      {
        id: "act-3",
        type: "trial",
        title: "Trial request submitted",
        description: "New free trial request for Basketball - Abu Dhabi.",
        time: "42 min ago",
      },
      {
        id: "act-4",
        type: "attendance",
        title: "Attendance updated",
        description: "Coach Ahmed marked attendance for Football U12 session.",
        time: "1 hour ago",
      },
    ],

    alerts: [
      {
        id: "alert-1",
        severity: "warning",
        title: "43 pending payments",
        description: "Some subscriptions require payment follow-up this week.",
      },
      {
        id: "alert-2",
        severity: "danger",
        title: "18 expired subscriptions",
        description: "Students with expired plans need renewal confirmation.",
      },
      {
        id: "alert-3",
        severity: "info",
        title: "12 trial requests",
        description: "New trial requests are waiting for admin review.",
      },
    ],
  };
}