/** REST API route map — Express backend at `server/` (base `/api`) */

const API = '/api';

export const ENDPOINTS = {
  health: `${API}/health`,
  public: {
    academySummary: `${API}/public/academy-summary`,
    home: `${API}/public/home`,
    loginShowcase: `${API}/public/login-showcase`,
  },
  auth: {
    login: `${API}/auth/login`,
    register: `${API}/auth/register`,
    registerParent: `${API}/auth/register/parent`,
    registerCoachRequest: `${API}/auth/register/coach-request`,
    me: `${API}/auth/me`,
  },
  admin: {
    dashboard: `${API}/admin/dashboard`,
    users: {
      list: `${API}/admin/users`,
      detail: (id: string) => `${API}/admin/users/${id}`,
    },
    students: {
      list: `${API}/admin/students`,
      detail: (id: string) => `${API}/admin/students/${id}`,
    },
    parents: {
      list: `${API}/admin/parents`,
      detail: (id: string) => `${API}/admin/parents/${id}`,
    },
    coaches: {
      list: `${API}/admin/coaches`,
      detail: (id: string) => `${API}/admin/coaches/${id}`,
    },
    branches: {
      list: `${API}/admin/branches`,
      detail: (id: string) => `${API}/admin/branches/${id}`,
    },
    programs: {
      list: `${API}/admin/programs`,
      detail: (id: string) => `${API}/admin/programs/${id}`,
    },
    schedule: {
      list: `${API}/admin/schedule`,
      detail: (id: string) => `${API}/admin/schedule/${id}`,
    },
    attendance: {
      list: `${API}/admin/attendance`,
      detail: (id: string) => `${API}/admin/attendance/${id}`,
    },
    finance: {
      dashboard: `${API}/admin/finance/dashboard`,
      subscriptions: {
        list: `${API}/admin/finance/subscriptions`,
        detail: (id: string) => `${API}/admin/finance/subscriptions/${id}`,
      },
      invoices: {
        list: `${API}/admin/finance/invoices`,
        detail: (id: string) => `${API}/admin/finance/invoices/${id}`,
      },
      payments: {
        list: `${API}/admin/finance/payments`,
        detail: (id: string) => `${API}/admin/finance/payments/${id}`,
      },
    },
    reports: {
      summary: `${API}/admin/reports/summary`,
    },
  },
  /** @deprecated Use ENDPOINTS.admin — kept for gradual migration */
  students: {
    list: `${API}/admin/students`,
    detail: (id: string) => `${API}/admin/students/${id}`,
    create: `${API}/admin/students`,
    update: (id: string) => `${API}/admin/students/${id}`,
    delete: (id: string) => `${API}/admin/students/${id}`,
  },
} as const;
