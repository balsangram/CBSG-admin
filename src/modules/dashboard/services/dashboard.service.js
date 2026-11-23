/**
 * CBSG Admin Console Dashboard Data & Service
 * Matches the official CBSG Finance Limited Performance Overview Console
 */

export const performanceOverviewData = {
  hero: {
    title: 'Explore your',
    titleEmphasis: 'performance',
    tag: 'Analytics · Portfolio overview',
    organization: 'CBSG Finance Limited',
    depositBookLabel: 'Deposit book',
    depositBookValue: '₹7.72 L',
  },

  portfolioPerformance: [
    {
      id: 'active-customers',
      indicator: 'Active customers',
      value: '13',
      status: 'Active',
      statusVariant: 'success',
    },
    {
      id: 'savings-plans',
      indicator: 'Savings plans',
      value: '14',
      status: 'Active',
      statusVariant: 'success',
    },
    {
      id: 'incentives-payable',
      indicator: 'Incentives payable',
      value: '₹10,605',
      status: 'Payable',
      statusVariant: 'warning',
    },
    {
      id: 'pending-kyc',
      indicator: 'Pending KYC',
      value: '2',
      status: 'Pending',
      statusVariant: 'warning',
    },
  ],

  goalProgress: {
    percentage: 96.9,
    label: 'collection efficiency',
    missedWeeks: 8,
    scheduledInstalments: 259,
  },

  operationsOverview: {
    pendingKyc: 2,
    approvals: 1,
  },

  collectionTrends: {
    todayAmount: '₹0',
    todayLabel: 'Daily deposit collections',
    isTodayActive: true,
    yAxis: ['₹80k', '₹60k', '₹40k', '₹20k', '₹0k'],
    dates: [
      { date: '7 Nov', value: 24 },
      { date: '8 Nov', value: 29 },
      { date: '9 Nov', value: 31 },
      { date: '10 Nov', value: 28 },
      { date: '11 Nov', value: 30 },
      { date: '12 Nov', value: 29 },
      { date: '13 Nov', value: 28 },
      { date: '14 Nov', value: 27 },
      { date: '15 Nov', value: 28 },
      { date: '16 Nov', value: 36 },
      { date: '17 Nov', value: 76 }, // Major Peak on 17 Nov
      { date: '18 Nov', value: 28 },
      { date: '19 Nov', value: 24 },
      { date: '20 Nov', value: 20 },
    ],
  },

  liveTransactions: [
    {
      id: 'tx-1',
      time: '19 Nov 05:58 pm',
      customer: 'dodmdd',
      type: 'Deposit',
      by: 'App',
      amount: '₹100',
      status: 'Success',
    },
    {
      id: 'tx-2',
      time: '19 Nov 05:01 pm',
      customer: 'dodmdd',
      type: 'Deposit',
      by: 'App',
      amount: '₹100',
      status: 'Success',
    },
    {
      id: 'tx-3',
      time: '19 Nov 12:45 pm',
      customer: 'Lakshmi Reddy',
      type: 'Deposit',
      by: 'Vikram Singh',
      amount: '₹200',
      status: 'Success',
    },
    {
      id: 'tx-4',
      time: '19 Nov 11:30 am',
      customer: 'Neha Gupta',
      type: 'Deposit',
      by: 'Sneha Iyer',
      amount: '₹500',
      status: 'Success',
    },
  ],

  topExecutives: [
    {
      id: 'exec-1',
      name: 'Anil Mehta',
      role: 'Team leader · Pune',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
      customers: 10,
      collectedToday: '₹0',
      trend: 'up',
    },
  ],

  // Also include the 4 statistics cards for complete coverage
  stats: [
    {
      id: 'total-users',
      title: 'Total Users',
      count: 18420,
      change: '+12.5%',
      isPositive: true,
      trend: 'up',
      subtitle: 'vs last month',
      color: 'blue',
      iconName: 'Users',
    },
    {
      id: 'active-users',
      title: 'Active Users',
      count: 14290,
      change: '+8.2%',
      isPositive: true,
      trend: 'up',
      subtitle: 'vs last week',
      color: 'emerald',
      iconName: 'UserCheck',
    },
    {
      id: 'pending-tasks',
      title: 'Pending Tasks',
      count: 38,
      change: '-4.3%',
      isPositive: true,
      trend: 'down',
      subtitle: 'clearing faster',
      color: 'amber',
      iconName: 'Clock',
    },
    {
      id: 'completed-tasks',
      title: 'Completed Tasks',
      count: 1429,
      change: '+18.7%',
      isPositive: true,
      trend: 'up',
      subtitle: 'this billing cycle',
      color: 'indigo',
      iconName: 'CheckCircle',
    },
  ],
};

export const dashboardService = {
  async getDashboardSummary() {
    return performanceOverviewData;
  },
};

export default dashboardService;
