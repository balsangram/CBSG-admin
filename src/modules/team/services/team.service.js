// Service for Team & Incentives structure and hierarchy
export const INITIAL_TEAM_METRICS = {
  teamLeaders: 4,
  executives: 2,
  networkVolume: '₹7,71,900',
  rawNetworkVolume: 771900,
  incentivesEarned: '₹11,955',
  rawIncentivesEarned: 11955,
};

export const INITIAL_ORG_DATA = {
  admin: {
    id: 'admin-cbsg',
    title: 'CBSG Finance Limited · Admin',
    subtitle: '15 customers · 3 branches',
  },
  leftColumn: [
    {
      id: 'lead-anil',
      name: 'Anil Mehta',
      role: 'Team Lead',
      code: 'TL - PUN - 01',
      branch: 'Pune',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
      customers: 7,
      volume: '₹1,91,600',
      rawVolume: 191600,
      incentives: '₹4,685',
      rawIncentives: 4685,
      subordinates: [
        {
          id: 'exec-rahul',
          name: 'Rahul Verma',
          role: 'Executive Manager',
          code: 'EM - 1042',
          branch: 'Pune',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
          customers: 4,
          volume: '₹1,78,100',
          rawVolume: 178100,
          incentives: '₹1,050',
          rawIncentives: 1050,
          reportsTo: 'Anil Mehta',
        },
      ],
    },
    {
      id: 'lead-sneha',
      name: 'Sneha Iyer',
      role: 'Team Lead',
      code: 'EM - 1077',
      branch: 'Pune',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80',
      customers: 3,
      volume: '₹10,500',
      rawVolume: 10500,
      incentives: '₹500',
      rawIncentives: 500,
      subordinates: [],
    },
  ],
  rightColumn: [
    {
      id: 'lead-meera',
      name: 'Meera Joshi',
      role: 'Team Lead',
      code: 'TL - MUM - 02',
      branch: 'Mumbai',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80',
      customers: 0,
      volume: '₹0',
      rawVolume: 0,
      incentives: '₹200',
      rawIncentives: 200,
      subordinates: [],
    },
    {
      id: 'lead-kavya',
      name: 'Kavya Nair',
      role: 'Team Lead',
      code: 'EM - 1093',
      branch: 'Mumbai',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      customers: 5,
      volume: '₹5,69,800',
      rawVolume: 569800,
      incentives: '₹400',
      rawIncentives: 400,
      subordinates: [
        {
          id: 'exec-vikram',
          name: 'Vikram Singh',
          role: 'Executive Manager',
          code: 'EM - 1081',
          branch: 'Nagpur',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80',
          customers: 2,
          volume: '₹53,800',
          rawVolume: 53800,
          incentives: '₹5,120',
          rawIncentives: 5120,
          reportsTo: 'Kavya Nair',
        },
      ],
    },
  ],
};

export const teamService = {
  getOrgData: () => INITIAL_ORG_DATA,
  getMetrics: () => INITIAL_TEAM_METRICS,
  getAllMembersFlat: () => {
    const list = [];
    const traverse = (col) => {
      col.forEach((lead) => {
        list.push({
          id: lead.id,
          name: lead.name,
          role: lead.role,
          code: lead.code,
          branch: lead.branch,
          avatar: lead.avatar,
          customers: lead.customers,
          volume: lead.volume,
          rawVolume: lead.rawVolume,
          incentives: lead.incentives,
          rawIncentives: lead.rawIncentives,
          reportsTo: 'CBSG Admin',
          status: 'Active',
        });
        if (lead.subordinates && lead.subordinates.length > 0) {
          lead.subordinates.forEach((sub) => {
            list.push({
              id: sub.id,
              name: sub.name,
              role: sub.role,
              code: sub.code,
              branch: sub.branch,
              avatar: sub.avatar,
              customers: sub.customers,
              volume: sub.volume,
              rawVolume: sub.rawVolume,
              incentives: sub.incentives,
              rawIncentives: sub.rawIncentives,
              reportsTo: lead.name,
              status: 'Active',
            });
          });
        }
      });
    };
    traverse(INITIAL_ORG_DATA.leftColumn);
    traverse(INITIAL_ORG_DATA.rightColumn);
    return list;
  },
};
