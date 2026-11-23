// Immutable System Audit Logs Service

export const INITIAL_AUDIT_LOGS = [
  {
    id: 'audit-001',
    timestamp: '23 Nov 2026 02:35 pm',
    user: 'Super Admin',
    action: 'Reassigned executive',
    entity: 'Rahul Verma',
    before: 'reports to: Anil Mehta',
    after: 'reports to: Sneha Iyer',
  },
  {
    id: 'audit-002',
    timestamp: '23 Nov 2026 02:10 pm',
    user: 'Customer',
    action: 'KYC resubmitted',
    entity: 'wdkjfnj',
    before:
      '{"id":"c1","name":"dodmdd","photo":"/assets/reviewed-portrait-1-uvxmWF0.jpg","phone":"9876543210","branchId":"b1","execId":"e1","stage":"active","kyc":"pending","nominee":"Rohit Sharma","nomineeRel":"Spouse","referralCode":"CBSGPRIY15","address":"fkdfjjgfht","pan":"ABCDE1234F","bank":"HDFC Bank ** 2002 · HDFC0202902","joined":"2026-06-07T04:30:00.000Z","city":"Pune","kycSections":{"photo":{"status":"pending"},"aadhaar":{"status":"pending"},"pan":{"status":"pending"},"bank":{"status":"pending"},"address":{"status":"pending"},"nominee":{"status":"pending"},"identity":{"status":"pending"}},"fathername":"defksdt","dob":"2025-11-06","pincode":"400000","aadhar":"xxxx xxxx 0000","kycDocuments":["PAN_ABCPG1005K.jpg","Aadhaar_front.jpg"],"selfieMethod":"upload","bankName":"HDFC Bank","bankAccountNumber":"2002","ifsc":"HDFC0202902"}',
    after:
      '{"id":"c1","name":"wdkjfnj","photo":"/assets/reviewed-portrait-1-uvxmWF0.jpg","phone":"9876543210","branchId":"b1","execId":"e1","stage":"active","kyc":"pending","nominee":"Rohit Sharma","nomineeRel":"Spouse","referralCode":"CBSGPRIY15","address":"dyfdmrdsc","pan":"ABCDE1234F","bank":"HDFC Bank ** 2002 · HDFC0202902","joined":"2026-06-07T04:30:00.000Z","city":"Pune","kycSections":{"photo":{"status":"pending"},"aadhaar":{"status":"pending"},"pan":{"status":"pending"},"bank":{"status":"pending"},"address":{"status":"pending"},"nominee":{"status":"pending"},"identity":{"status":"pending"}},"fathername":"defksdt","dob":"2025-11-12","pincode":"400000","aadhar":"xxxx xxxx 0000","kycDocuments":["PAN_ABCPG1005K.jpg","Aadhaar_front.jpg"],"selfieMethod":"upload","bankName":"HDFC Bank","bankAccountNumber":"A221","ifsc":"HDFC0001533"}',
  },
  {
    id: 'audit-003',
    timestamp: '20 Nov 2026 05:08 pm',
    user: 'Customer',
    action: 'KYC resubmitted',
    entity: 'dodmdd',
    before:
      '{"id":"c1","name":"Priya Sharma","photo":"/assets/reviewed-portrait-1-cq1nzmmp.jpg","phone":"9876543210","branchId":"b1","execId":"e1","stage":"active","kyc":"verified","nominee":"Rohit Sharma","nomineeRel":"Spouse","referralCode":"CBSGPRIY15","address":"14, Shivaji Nagar, Pune 411005","pan":"ABCPG1005K","bank":"HDFC Bank ** 4035","joined":"2025-06-07T04:30:00.000Z","kycSections":{"photo":{"status":"approved"},"aadhaar":{"status":"approved"},"pan":{"status":"approved"},"bank":{"status":"approved"},"address":{"status":"approved"},"nominee":{"status":"approved"},"identity":{"status":"approved"}}}',
    after:
      '{"id":"c1","name":"dodmdd","photo":"/assets/reviewed-portrait-1-cq1nzmmp.jpg","phone":"9876543210","branchId":"b1","execId":"e1","stage":"active","kyc":"pending","nominee":"Rohit Sharma","nomineeRel":"Spouse","referralCode":"CBSGPRIY15","address":"fkdfjjgfht","pan":"ABCDE1234F","bank":"HDFC Bank ** 2002 · HDFC0202902","joined":"2026-06-07T04:30:00.000Z","city":"Pune","kycSections":{"photo":{"status":"pending"},"aadhaar":{"status":"pending"},"pan":{"status":"pending"},"bank":{"status":"pending"},"address":{"status":"pending"},"nominee":{"status":"pending"},"identity":{"status":"pending"}},"fathername":"defksdt","dob":"2025-11-06","pincode":"400000","aadhar":"xxxx xxxx 0000","kycDocuments":["PAN_ABCPG1005K.jpg","Aadhaar_front.jpg"],"selfieMethod":"upload","bankName":"HDFC Bank","bankAccountNumber":"2002","ifsc":"HDFC0202902"}',
  },
  {
    id: 'audit-004',
    timestamp: '19 Nov 2026 06:58 pm',
    user: 'self',
    action: 'UPI deposit recorded',
    entity: 'A1001',
    before: 'balance: 11100',
    after: 'balance: 11200',
  },
  {
    id: 'audit-005',
    timestamp: '19 Nov 2026 05:30 pm',
    user: 'Super Admin',
    action: 'Reassigned executive',
    entity: 'Vikram Singh',
    before: 'reports to: Anil Mehta',
    after: 'reports to: Kavya Nair',
  },
  {
    id: 'audit-006',
    timestamp: '19 Nov 2026 05:30 pm',
    user: 'Super Admin',
    action: 'Edited team member',
    entity: 'Kavya Nair',
    before: 'active: true',
    after: 'active: true',
  },
  {
    id: 'audit-007',
    timestamp: '19 Nov 2026 05:30 pm',
    user: 'Super Admin',
    action: 'Edited team member',
    entity: 'Meera Joshi',
    before: 'active: true',
    after: 'active: true',
  },
];

export const auditService = {
  getLogs: () => [...INITIAL_AUDIT_LOGS],
};

