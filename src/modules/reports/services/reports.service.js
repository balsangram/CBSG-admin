// Service for Reports & Analytics definitions, charts, and preview datasets

export const REPORTS_DATA = [
  {
    id: 'investment-efficiency',
    title: 'Investment efficiency',
    subtitle: 'Daily/weekly by branch & executive',
    yAxis: ['60000', '45000', '30000', '15000', '0'],
    chartType: 'bars',
    bars: [
      { label: 'Pune', value: 14200, heightPct: 24, widthPct: 35 },
      { label: 'Mumbai', value: 51800, heightPct: 86, widthPct: 35 },
    ],
    tableData: [
      { branch: 'Pune - FC Road', target: '₹1,50,000', achieved: '₹1,91,600', efficiency: '127.7%', topExec: 'Rahul Verma', status: 'Exceeded' },
      { branch: 'Mumbai - Fort', target: '₹5,00,000', achieved: '₹5,69,800', efficiency: '113.9%', topExec: 'Kavya Nair', status: 'Exceeded' },
      { branch: 'Nagpur - Sitabuldi', target: '₹50,000', achieved: '₹53,800', efficiency: '107.6%', topExec: 'Vikram Singh', status: 'Exceeded' },
    ],
  },
  {
    id: 'deposit-book-alm',
    title: 'Deposit book (ALM)',
    subtitle: 'Maturity ladder & liquidity',
    yAxis: ['600000', '450000', '300000', '150000', '0'],
    chartType: 'bars',
    bars: [
      { label: '1-14d', value: 10000, heightPct: 4, widthPct: 8 },
      { label: '15-30d', value: 95000, heightPct: 16, widthPct: 8 },
      { label: '1-3m', value: 35000, heightPct: 6, widthPct: 8 },
      { label: '3-6m', value: 15000, heightPct: 3, widthPct: 8 },
      { label: '6-12m', value: 5000, heightPct: 2, widthPct: 8 },
      { label: '1-3y', value: 500000, heightPct: 83, widthPct: 8 },
      { label: '3-5y', value: 12000, heightPct: 3, widthPct: 8 },
      { label: '>5y', value: 5000, heightPct: 2, widthPct: 8 },
    ],
    tableData: [
      { bucket: '1 to 14 Days', outflow: '₹10,000', inflow: '₹45,000', netMismatch: '+₹35,000', ratio: '450%' },
      { bucket: '15 to 30 Days', outflow: '₹95,000', inflow: '₹1,20,000', netMismatch: '+₹25,000', ratio: '126%' },
      { bucket: '1 to 3 Months', outflow: '₹35,000', inflow: '₹60,000', netMismatch: '+₹25,000', ratio: '171%' },
      { bucket: '3 to 6 Months', outflow: '₹15,000', inflow: '₹40,000', netMismatch: '+₹25,000', ratio: '266%' },
      { bucket: '1 to 3 Years', outflow: '₹5,00,000', inflow: '₹5,80,000', netMismatch: '+₹80,000', ratio: '116%' },
    ],
  },
  {
    id: 'incentive-statement',
    title: 'Incentive statement',
    subtitle: 'Per executive & team leader',
    yAxis: ['6000', '4500', '3000', '1500', '0'],
    chartType: 'bars',
    bars: [
      { label: 'Vikram', value: 5120, heightPct: 85, widthPct: 3 },
      { label: 'Anil', value: 4685, heightPct: 78, widthPct: 3 },
      { label: 'Rahul', value: 1050, heightPct: 18, widthPct: 3 },
      { label: 'Sneha', value: 500, heightPct: 8, widthPct: 3 },
      { label: 'Kavya', value: 400, heightPct: 7, widthPct: 3 },
      { label: 'Meera', value: 200, heightPct: 4, widthPct: 3 },
    ],
    tableData: [
      { beneficiary: 'Vikram Singh', role: 'Executive Manager', branch: 'Nagpur', gross: '₹5,120.00', tds: '₹512.00', netPayout: '₹4,608.00' },
      { beneficiary: 'Anil Mehta', role: 'Team Lead', branch: 'Pune', gross: '₹4,685.00', tds: '₹468.50', netPayout: '₹4,216.50' },
      { beneficiary: 'Rahul Verma', role: 'Executive Manager', branch: 'Pune', gross: '₹1,050.00', tds: '₹105.00', netPayout: '₹945.00' },
      { beneficiary: 'Sneha Iyer', role: 'Team Lead', branch: 'Pune', gross: '₹500.00', tds: '₹50.00', netPayout: '₹450.00' },
      { beneficiary: 'Kavya Nair', role: 'Team Lead', branch: 'Mumbai', gross: '₹400.00', tds: '₹40.00', netPayout: '₹360.00' },
      { beneficiary: 'Meera Joshi', role: 'Team Lead', branch: 'Mumbai', gross: '₹200.00', tds: '₹20.00', netPayout: '₹180.00' },
    ],
  },
  {
    id: 'rbi-nbs-7-return',
    title: 'RBI NBS-7 return',
    subtitle: 'Regulatory statutory format',
    yAxis: ['600000', '400000', '200000', '0'],
    chartType: 'bars',
    bars: [
      { label: 'Tier I Capital', value: 580000, heightPct: 88, widthPct: 22 },
      { label: 'SLR Liquid Assets', value: 65000, heightPct: 11, widthPct: 22 },
      { label: 'Net Owned Funds', value: 20000, heightPct: 3, widthPct: 22 },
    ],
    tableData: [
      { parameter: 'Public Deposits Outstanding', mandate: 'Cap: 1.5x NOF', actual: '₹7,72,000', status: 'Compliant' },
      { parameter: 'Minimum SLR Assets in Govt Securities', mandate: 'Min: 15% of Deposits', actual: '18.4% (₹1,42,000)', status: 'Compliant' },
      { parameter: 'Capital Adequacy Ratio (CRAR)', mandate: 'Min: 15.0%', actual: '26.8%', status: 'Well Capitalized' },
      { parameter: 'Gross Non-Performing Assets (GNPA)', mandate: 'Max: 4.0%', actual: '0.00%', status: 'Zero NPA' },
    ],
  },
  {
    id: 'kyc-compliance',
    title: 'KYC compliance',
    subtitle: 'Pending, expired, re-KYC due',
    yAxis: ['12', '9', '6', '3', '0'],
    chartType: 'bars',
    bars: [
      { label: 'Pending', value: 2, heightPct: 16, widthPct: 28 },
      { label: 'Approved', value: 12, heightPct: 100, widthPct: 28 },
      { label: 'Rejected', value: 1, heightPct: 9, widthPct: 28 },
    ],
    tableData: [
      { category: 'Approved Verified KYC', count: 12, percentage: '80.0%', sla: '100% within 2 hrs' },
      { category: 'Pending Verification', count: 2, percentage: '13.3%', sla: 'Under Admin review' },
      { category: 'Rejected / Re-upload Required', count: 1, percentage: '6.7%', sla: 'Customer notified via SMS' },
    ],
  },
  {
    id: 'tds-on-incentives',
    title: 'TDS on incentives',
    subtitle: 'Form 16A ready',
    yAxis: ['6000', '4500', '3000', '1500', '0'],
    chartType: 'bars',
    bars: [
      { label: 'Vikram', value: 4700, heightPct: 78, widthPct: 14 },
      { label: 'Rahul', value: 1050, heightPct: 18, widthPct: 14 },
      { label: 'Anil', value: 5050, heightPct: 84, widthPct: 14 },
      { label: 'Sneha', value: 500, heightPct: 8, widthPct: 14 },
      { label: 'Kavya', value: 400, heightPct: 7, widthPct: 14 },
      { label: 'Meera', value: 200, heightPct: 4, widthPct: 14 },
    ],
    tableData: [
      { pan: 'ABCDE1234F', deductor: 'CBSG Finance Limited', section: '194H', grossPaid: '₹11,955.00', tdsDeducted: '₹1,195.50', challanNo: 'CH-2026-11-901' },
      { pan: 'FGHIJ5678K', deductor: 'CBSG Finance Limited', section: '194H', grossPaid: '₹5,120.00', tdsDeducted: '₹512.00', challanNo: 'CH-2026-11-902' },
      { pan: 'KLMNO9012P', deductor: 'CBSG Finance Limited', section: '194H', grossPaid: '₹4,685.00', tdsDeducted: '₹468.50', challanNo: 'CH-2026-11-903' },
    ],
  },
];

export const reportsService = {
  getReports: () => [...REPORTS_DATA],
  getReportById: (id) => REPORTS_DATA.find((r) => r.id === id),
};

