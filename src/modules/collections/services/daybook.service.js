/**
 * Day Book & Customer Savings Passbook Service
 * Matches CBSG Finance Limited Collections Daybook
 */

export const daybookSummary = {
  date: '23 Nov 2026',
  todaySavings: '₹0',
  bank: '₹0',
  upi: '₹0',
  entries: 0,
};

export const todayDaybookEntries = []; // Empty state for today matching screenshot

export const customerSavingsPassbook = [
  {
    id: 'pb-1',
    date: '19 Nov',
    receipt: 'CBSG91023',
    customer: 'wdkjtfnj',
    account: 'A1001',
    mode: 'UPI',
    savings: '₹100',
    status: 'Success',
  },
  {
    id: 'pb-2',
    date: '19 Nov',
    receipt: 'CBSG91002',
    customer: 'wdkjtfnj',
    account: 'A1001',
    mode: 'UPI',
    savings: '₹100',
    status: 'Success',
  },
  {
    id: 'pb-3',
    date: '19 Nov',
    receipt: 'CBSG88248',
    customer: 'Lakshmi Reddy',
    account: 'A1007',
    mode: 'UPI',
    savings: '₹200',
    status: 'Success',
  },
  {
    id: 'pb-4',
    date: '19 Nov',
    receipt: 'CBSG88247',
    customer: 'Neha Gupta',
    account: 'A1006',
    mode: 'UPI',
    savings: '₹500',
    status: 'Success',
  },
  {
    id: 'pb-5',
    date: '19 Nov',
    receipt: 'CBSG88246',
    customer: 'Sunita Deshmukh',
    account: 'A1004',
    mode: 'UPI',
    savings: '₹500',
    status: 'Success',
  },
  {
    id: 'pb-6',
    date: '19 Nov',
    receipt: 'CBSG88245',
    customer: 'Amit Patel',
    account: 'A1003',
    mode: 'UPI',
    savings: '₹1,000',
    status: 'Success',
  },
  {
    id: 'pb-7',
    date: '18 Nov',
    receipt: 'CBSG88213',
    customer: 'wdkjtfnj',
    account: 'A1001',
    mode: 'UPI',
    savings: '₹500',
    status: 'Success',
  },
  {
    id: 'pb-8',
    date: '18 Nov',
    receipt: 'CBSG88237',
    customer: 'Suresh Pillai',
    account: 'A1010',
    mode: 'UPI',
    savings: '₹1,000',
    status: 'Success',
  },
  {
    id: 'pb-9',
    date: '18 Nov',
    receipt: 'CBSGTLD-c13-0',
    customer: 'Ramesh Gowda',
    account: 'A2013',
    mode: 'UPI',
    savings: '₹2,000',
    status: 'Success',
  },
  {
    id: 'pb-10',
    date: '17 Nov',
    receipt: 'CBSG88217',
    customer: 'Amit Patel',
    account: 'A1003',
    mode: 'UPI',
    savings: '₹1,000',
    status: 'Success',
  },
  {
    id: 'pb-11',
    date: '17 Nov',
    receipt: 'CBSG88241',
    customer: 'Manoj Tiwari',
    account: 'A1011',
    mode: 'UPI',
    savings: '₹500',
    status: 'Success',
  },
  {
    id: 'pb-12',
    date: '17 Nov',
    receipt: 'CBSG88190',
    customer: 'Deepak Yadav',
    account: 'A1008',
    mode: 'UPI',
    savings: '₹5,000',
    status: 'Success',
  },
  {
    id: 'pb-13',
    date: '16 Nov',
    receipt: 'CBSG88102',
    customer: 'Anjali Menon',
    account: 'A1009',
    mode: 'UPI',
    savings: '₹10,000',
    status: 'Success',
  },
  {
    id: 'pb-14',
    date: '16 Nov',
    receipt: 'CBSG88094',
    customer: 'Vikram Joshi',
    account: 'A1005',
    mode: 'UPI',
    savings: '₹2,500',
    status: 'Success',
  },
];

export const daybookService = {
  getSummary() {
    return daybookSummary;
  },

  getTodayEntries() {
    return todayDaybookEntries;
  },

  getPassbook() {
    return customerSavingsPassbook;
  },
};

export default daybookService;

