// Service for Staff Users, Roles, and Permissions

export const INITIAL_STAFF_USERS = [
  {
    id: 'user-01',
    name: 'Sanjay Kulkarni',
    email: 'sanjay.kulkarni@cbsgfinancial.in',
    role: 'Sub-admin',
    status: 'Active',
    pageAccess: '16 Read · 14 Write',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    modules: ['Dashboard', 'Customers', 'Savings', 'Collections', 'Team & Incentives', 'Reports', 'Administration'],
  },
  {
    id: 'user-02',
    name: 'Anil Mehta',
    email: 'anil.mehta@cbsgfinancial.in',
    role: 'Branch Manager',
    status: 'Active',
    pageAccess: '11 Read · 10 Write',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    modules: ['Dashboard', 'Customers', 'Savings', 'Collections', 'Team'],
  },
  {
    id: 'user-03',
    name: 'Pallavi Rao',
    email: 'pallavi.rao@cbsgfinancial.in',
    role: 'Verifier',
    status: 'Active',
    pageAccess: '4 Read · 3 Write',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80',
    modules: ['KYC Queue', 'Customer Records'],
  },
  {
    id: 'user-04',
    name: 'Harish Kale',
    email: 'harish.kale@cbsgfinancial.in',
    role: 'Approver',
    status: 'Active',
    pageAccess: '4 Read · 2 Write',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
    modules: ['Payout Management', 'KYC Queue'],
  },
  {
    id: 'user-05',
    name: 'Nisha Agarwal',
    email: 'nisha.agarwal@cbsgfinancial.in',
    role: 'Finance',
    status: 'Active',
    pageAccess: '9 Read · 7 Write',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80',
    modules: ['Incentive Ledger', 'Payouts', 'Reports', 'Daybook'],
  },
];

export const usersService = {
  getUsers: () => JSON.parse(JSON.stringify(INITIAL_STAFF_USERS)),
  addUser: (users, newUser) => [...users, newUser],
  updateUser: (users, id, updates) =>
    users.map((u) => (u.id === id ? { ...u, ...updates } : u)),
  toggleStatus: (users, id) =>
    users.map((u) =>
      u.id === id ? { ...u, status: u.status === 'Active' ? 'Disabled' : 'Active' } : u
    ),
};

