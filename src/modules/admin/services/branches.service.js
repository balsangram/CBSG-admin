// Service for Branches management

export const INITIAL_BRANCHES = [
  {
    id: 'br-pune',
    name: 'Pune - FC Road',
    code: 'PUN-01',
    manager: 'Anil Mehta',
    customers: 10,
    staff: 3,
    book: '₹2.02 L',
    rawBook: 202000,
    address: 'FC Road, Shivajinagar, Pune, Maharashtra 411005',
    phone: '+91 20 2553 4410',
    email: 'pune.fcroad@cbsg.online',
    staffList: [
      { name: 'Anil Mehta', role: 'Team Lead · Branch Manager' },
      { name: 'Rahul Verma', role: 'Executive Manager' },
      { name: 'Sneha Iyer', role: 'Team Lead' },
    ],
  },
  {
    id: 'br-mumbai',
    name: 'Mumbai - Andheri East',
    code: 'MUM-02',
    manager: 'Meera Joshi',
    customers: 3,
    staff: 2,
    book: '₹5.16 L',
    rawBook: 516000,
    address: 'Andheri Kurla Road, Andheri East, Mumbai, Maharashtra 400069',
    phone: '+91 22 6124 9900',
    email: 'mumbai.andheri@cbsg.online',
    staffList: [
      { name: 'Meera Joshi', role: 'Team Lead · Branch Manager' },
      { name: 'Kavya Nair', role: 'Team Lead' },
    ],
  },
  {
    id: 'br-nagpur',
    name: 'Nagpur - Sitabuldi',
    code: 'NAG-03',
    manager: 'Manish Kadu',
    customers: 2,
    staff: 1,
    book: '₹53,800',
    rawBook: 53800,
    address: 'Variety Square, Sitabuldi, Nagpur, Maharashtra 440012',
    phone: '+91 712 2541 330',
    email: 'nagpur.sitabuldi@cbsg.online',
    staffList: [
      { name: 'Manish Kadu', role: 'Branch Manager' },
      { name: 'Vikram Singh', role: 'Executive Manager' },
    ],
  },
];

export const branchesService = {
  getBranches: () => JSON.parse(JSON.stringify(INITIAL_BRANCHES)),
  addBranch: (branches, newBranch) => {
    return [...branches, newBranch];
  },
};

