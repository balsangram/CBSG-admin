export const APP_CONFIG = {
  APP_NAME: 'CBSG Finance Limited',
  APP_SUBTITLE: 'ADMIN CONSOLE',
  LAUNCHER_URL: 'https://www.cbsg.online/',
  DEMO_EMAIL: 'sanjay.k@cbsgfinancial.in',
  DEMO_PASSWORD: 'Password@123',
  DEMO_OTP: '123456',
  DEMO_STAFF_NAME: 'Sanjay Kumar',
  DEMO_STAFF_ROLE: 'Senior Operations Officer',
  DEMO_STAFF_BRANCH: 'Mumbai Central Operations Desk',
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'cbsg_auth_token',
  AUTH_USER: 'cbsg_auth_user',
  AUTH_STEP: 'cbsg_auth_step',
  AUTH_IS_AUTHENTICATED: 'cbsg_auth_is_authenticated',
};

export const ROUTES = {
  LOGIN: '/login',
  TWO_FACTOR: '/two-factor',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SETTINGS: '/settings',
};

export const STATS_DATA = [
  {
    id: 'total-users',
    title: 'Total Users',
    count: 18420,
    change: '+12.5%',
    isPositive: true,
    trend: 'up',
    description: 'vs. last month',
    badgeColor: 'blue',
  },
  {
    id: 'active-users',
    title: 'Active Users',
    count: 14290,
    change: '+8.2%',
    isPositive: true,
    trend: 'up',
    description: 'vs. last week',
    badgeColor: 'emerald',
  },
  {
    id: 'pending-tasks',
    title: 'Pending Tasks',
    count: 38,
    change: '-4.3%',
    isPositive: true,
    trend: 'down',
    description: 'vs. yesterday',
    badgeColor: 'amber',
  },
  {
    id: 'completed-tasks',
    title: 'Completed Tasks',
    count: 1429,
    change: '+18.7%',
    isPositive: true,
    trend: 'up',
    description: 'this week',
    badgeColor: 'indigo',
  },
];
