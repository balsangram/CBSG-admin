// Service for Payout Management data and Maker-Checker approvals

export const INITIAL_PAYOUTS = [
  {
    id: 'pay-01',
    beneficiary: 'Sneha Iyer',
    type: 'TL',
    category: 'Team Leads',
    requested: '18 Nov',
    amount: '₹4,250',
    rawAmount: 4250,
    tds: '₹43',
    rawTds: 43,
    net: '₹4,208',
    rawNet: 4208,
    status: 'Requested',
    comments: '—',
    bankAccount: 'HDFC Bank •• 4092',
    ifsc: 'HDFC0000240',
    branch: 'Pune - FC Road',
    pan: 'ABCDE1234F',
    role: 'Team Lead · EM - 1077',
    reason: 'Monthly incentive commission payout request',
  },
  {
    id: 'pay-02',
    beneficiary: 'Rahul Verma',
    type: 'EM',
    category: 'EM',
    requested: '1 Nov',
    amount: '₹6,800',
    rawAmount: 6800,
    tds: '₹68',
    rawTds: 68,
    net: '₹6,732',
    rawNet: 6732,
    status: 'Settled',
    comments: '—',
    bankAccount: 'ICICI Bank •• 8821',
    ifsc: 'ICIC0001042',
    branch: 'Pune - FC Road',
    pan: 'KLMNO9012P',
    role: 'Executive Manager · EM - 1042',
    reason: 'October month-end incentive disbursement',
  },
  {
    id: 'pay-03',
    beneficiary: 'Anjali Menon',
    type: 'Customer',
    category: 'Customers',
    requested: '17 Nov',
    amount: '₹12,500',
    rawAmount: 12500,
    tds: '₹125',
    rawTds: 125,
    net: '₹12,375',
    rawNet: 12375,
    status: 'Settled',
    comments: 'MIP Monthly Interest Payout',
    bankAccount: 'State Bank of India •• 7712',
    ifsc: 'SBIN0000300',
    branch: 'Mumbai - Fort',
    pan: 'PQRST3456K',
    role: 'Customer · CBSGANJ1451',
    reason: 'Monthly Income Plan interest disbursement',
  },
  {
    id: 'pay-04',
    beneficiary: 'Amit Patel',
    type: 'Customer',
    category: 'Customers',
    requested: '10 Nov',
    amount: '₹3,800',
    rawAmount: 3800,
    tds: '₹38',
    rawTds: 38,
    net: '₹3,762',
    rawNet: 3762,
    status: 'Settled',
    comments: 'MIP Monthly Interest Payout',
    bankAccount: 'Axis Bank •• 3341',
    ifsc: 'UTIB0000120',
    branch: 'Pune - FC Road',
    pan: 'UVWXY7890M',
    role: 'Customer · CBSGAMI121',
    reason: 'Monthly Income Plan interest disbursement',
  },
];

export const payoutsService = {
  getPayouts: () => JSON.parse(JSON.stringify(INITIAL_PAYOUTS)),
  approvePayout: (payouts, id) => {
    return payouts.map((p) => {
      if (p.id === id) {
        return {
          ...p,
          status: 'Settled',
          comments: 'Approved by Sanjay Kulkarni (Super Admin)',
        };
      }
      return p;
    });
  },
  rejectPayout: (payouts, id, reason = 'Maker verification query') => {
    return payouts.map((p) => {
      if (p.id === id) {
        return {
          ...p,
          status: 'Rejected',
          comments: reason,
        };
      }
      return p;
    });
  },
};

