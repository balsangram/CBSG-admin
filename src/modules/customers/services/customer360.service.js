/**
 * Customer 360 Profile Service & Dataset
 * Matches official CBSG Finance Limited Customer 360 Console
 */

export const customer360Profiles = {
  'CBSGPRIY15': {
    id: 'cust-priya',
    name: 'Priya Verma',
    code: 'CBSGPRIY15',
    mobile: '+91 98765 43210',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80',
    kycStatus: 'KYC pending',
    stage: 'active',
    savingsBalance: '₹1,11,200',
    activePlansCount: 2,

    branch: 'Pune - FC Road',
    address: 'B-402, Rohan Heights, FC Road, Pune 411004',
    addressShort: 'fkdfjfjgfnf',
    relationshipExecutive: 'Rahul Verma',
    pan: 'ABCDE1234E',
    joined: '7 Jun 2026',
    bankAccount: 'HDFC Bank ·· 2002 · HDFC2292992',
    nominee: 'Rohit Sharma (Spouse)',

    savingsPlans: [
      {
        id: 'plan-1',
        name: 'Monthly Income Plan',
        code: 'A1001',
        startDate: '11 Jun 2026',
        status: 'Active',
        savings: '₹11,200',
        goal: '₹5,00,000',
        progress: 2.2,
      },
      {
        id: 'plan-2',
        name: 'Monthly Income Plan',
        code: 'A1002',
        startDate: '10 Sept 2026',
        status: 'Active',
        savings: '₹1,00,000',
        goal: '₹5,00,000',
        progress: 20.0,
      },
    ],

    transactions: [
      {
        id: 'tx-101',
        time: '19 Nov 05:58 pm',
        type: 'Deposit',
        by: 'App',
        amount: '₹100',
        ref: 'TXN-90214',
        status: 'Success',
      },
      {
        id: 'tx-102',
        time: '19 Nov 05:01 pm',
        type: 'Deposit',
        by: 'App',
        amount: '₹100',
        ref: 'TXN-90188',
        status: 'Success',
      },
      {
        id: 'tx-103',
        time: '10 Sep 02:30 pm',
        type: 'Deposit',
        by: 'IMPS',
        amount: '₹1,00,000',
        ref: 'TXN-74120',
        status: 'Success',
      },
      {
        id: 'tx-104',
        time: '11 Jun 11:15 am',
        type: 'Plan Opening',
        by: 'Branch Cheque',
        amount: '₹11,000',
        ref: 'TXN-55201',
        status: 'Success',
      },
    ],

    documents: [
      {
        id: 'doc-1',
        type: 'Aadhaar Card',
        number: 'XXXX-XXXX-4892',
        status: 'Verified',
        date: '08 Jun 2026',
      },
      {
        id: 'doc-2',
        type: 'PAN Card',
        number: 'ABCDE1234E',
        status: 'Verified',
        date: '08 Jun 2026',
      },
      {
        id: 'doc-3',
        type: 'Bank Passbook / Cancelled Cheque',
        number: 'HDFC Bank Acct #2002',
        status: 'Pending Verification',
        date: '19 Nov 2026',
      },
    ],
  },

  'CBSGAMI121': {
    id: 'cust-amit',
    name: 'Amit Patel',
    code: 'CBSGAMI121',
    mobile: '+91 90135 80237',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=256&q=80',
    kycStatus: 'KYC verified',
    stage: 'active',
    savingsBalance: '₹38,000',
    activePlansCount: 1,

    branch: 'Pune - Camp Hub',
    address: 'Flat 12, Sunrise Residency, Camp, Pune',
    addressShort: 'MG Road, Pune',
    relationshipExecutive: 'Rahul Verma',
    pan: 'BRRPA8921K',
    joined: '18 Aug 2026',
    bankAccount: 'ICICI Bank ·· 4819 · ICIC000182',
    nominee: 'Kavita Patel (Spouse)',

    savingsPlans: [
      {
        id: 'plan-3',
        name: 'CBSG Growth Fixed Deposit',
        code: 'FD402',
        startDate: '18 Aug 2026',
        status: 'Active',
        savings: '₹38,000',
        goal: '₹1,00,000',
        progress: 38.0,
      },
    ],

    transactions: [
      {
        id: 'tx-201',
        time: '18 Aug 10:15 am',
        type: 'Deposit',
        by: 'NetBanking',
        amount: '₹38,000',
        ref: 'TXN-88129',
        status: 'Success',
      },
    ],

    documents: [
      {
        id: 'doc-4',
        type: 'Aadhaar Card',
        number: 'XXXX-XXXX-9912',
        status: 'Verified',
        date: '18 Aug 2026',
      },
      {
        id: 'doc-5',
        type: 'PAN Card',
        number: 'BRRPA8921K',
        status: 'Verified',
        date: '18 Aug 2026',
      },
    ],
  },
};

export const customerListSummary = [
  { id: 'CBSGPRIY15', name: 'Priya Verma' },
  { id: 'CBSGAMI121', name: 'Amit Patel' },
  { id: 'CBSGSUN109', name: 'Sunita Deshmukh' },
  { id: 'CBSGROH425', name: 'Rohan Kulkarni' },
  { id: 'CBSGNEH442', name: 'Neha Gupta' },
  { id: 'CBSGLAK536', name: 'Lakshmi Reddy' },
];

export const customer360Service = {
  getCustomer(code = 'CBSGPRIY15') {
    return customer360Profiles[code] || customer360Profiles['CBSGPRIY15'];
  },

  getAllCustomers() {
    return customerListSummary;
  },
};

export default customer360Service;

