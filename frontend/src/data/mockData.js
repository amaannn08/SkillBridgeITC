// ─── Constants ────────────────────────────────────────────────────────────────
export const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh',
  'Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka',
  'Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram',
  'Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana',
  'Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
  'Andaman & Nicobar Islands','Chandigarh','Dadra & Nagar Haveli','Daman & Diu',
  'Delhi','Jammu & Kashmir','Ladakh','Lakshadweep','Puducherry',
];

export const QUALIFICATIONS = ['ITI','Diploma','B.Tech','M.Tech','B.Sc','MBA','Other'];
export const SECTORS = ['FMCG','Manufacturing','IT','Automotive','Pharma','Textiles','Construction','Food Processing','Chemical','Energy'];
export const INSTITUTION_TYPES = ['ITI','Polytechnic','Engineering College','University','Other'];
export const EXPERIENCE_LEVELS = ['Fresher','0-2 years','2-5 years'];

// ─── Users ────────────────────────────────────────────────────────────────────
export const MOCK_USERS = [
  { _id:'u1', name:'Platform Administrator', email:'admin@skillbridge.gov.in', role:'super_admin', approvalStatus:'approved', profileImage:'https://api.dicebear.com/7.x/initials/svg?seed=PA&backgroundColor=1e3a5f&fontColor=fff' },
  { _id:'u2', name:'Dr. Ramesh Kumar', email:'ramesh.kumar@gitiitk.ac.in', role:'coordinator', approvalStatus:'approved', state:'Uttar Pradesh', designation:'Placement Officer', institutionId:'inst1', profileImage:'https://api.dicebear.com/7.x/initials/svg?seed=RK&backgroundColor=16a34a&fontColor=fff' },
  { _id:'u3', name:'Priya Sharma', email:'priya.sharma@bcitdelhi.gov.in', role:'coordinator', approvalStatus:'approved', state:'Delhi', designation:'Training & Placement Coordinator', institutionId:'inst2', profileImage:'https://api.dicebear.com/7.x/initials/svg?seed=PS&backgroundColor=16a34a&fontColor=fff' },
  { _id:'u4', name:'Anil Mehta', email:'anil.mehta@itcltd.com', role:'recruiter', approvalStatus:'approved', designation:'Senior HR Manager', companyId:'comp1', profileImage:'https://api.dicebear.com/7.x/initials/svg?seed=AM&backgroundColor=2563eb&fontColor=fff' },
  { _id:'u5', name:'Sneha Verma', email:'sneha.verma@nestle.com', role:'recruiter', approvalStatus:'approved', designation:'Talent Acquisition Lead', companyId:'comp2', profileImage:'https://api.dicebear.com/7.x/initials/svg?seed=SV&backgroundColor=2563eb&fontColor=fff' },
  { _id:'u6', name:'Mohd. Irfan', email:'irfan@giti-kanpur.gov.in', role:'coordinator', approvalStatus:'pending', state:'Uttar Pradesh', designation:'HOD - Electrical', institutionId:null, profileImage:'https://api.dicebear.com/7.x/initials/svg?seed=MI&backgroundColor=ea580c&fontColor=fff' },
  { _id:'u7', name:'Kavitha Rajan', email:'kavitha.r@tata.com', role:'recruiter', approvalStatus:'pending', designation:'HR Executive', companyId:null, profileImage:'https://api.dicebear.com/7.x/initials/svg?seed=KR&backgroundColor=ea580c&fontColor=fff' },
  { _id:'u8', name:'Suresh Yadav', email:'suresh@iti-patna.gov.in', role:'coordinator', approvalStatus:'rejected', state:'Bihar', designation:'Coordinator', institutionId:null, profileImage:'https://api.dicebear.com/7.x/initials/svg?seed=SY&backgroundColor=dc2626&fontColor=fff', rejectionReason:'Provided AICTE code does not match institution records.' },
  // ── Student accounts (linked to batch students) ──
  { _id:'st1', name:'Arjun Singh', email:'arjun@gmail.com', role:'student', approvalStatus:'approved', batchId:'batch1', institutionId:'inst1', profileImage:'https://api.dicebear.com/7.x/initials/svg?seed=AS&backgroundColor=7c3aed&fontColor=fff' },
  { _id:'st2', name:'Pooja Patel', email:'pooja@gmail.com', role:'student', approvalStatus:'approved', batchId:'batch1', institutionId:'inst1', profileImage:'https://api.dicebear.com/7.x/initials/svg?seed=PP&backgroundColor=db2777&fontColor=fff' },
  { _id:'st4', name:'Vikram Tiwari', email:'vikram@gmail.com', role:'student', approvalStatus:'approved', batchId:'batch2', institutionId:'inst1', profileImage:'https://api.dicebear.com/7.x/initials/svg?seed=VT&backgroundColor=0891b2&fontColor=fff' },
  { _id:'st5', name:'Anjali Verma', email:'anjali@gmail.com', role:'student', approvalStatus:'approved', batchId:'batch2', institutionId:'inst1', profileImage:'https://api.dicebear.com/7.x/initials/svg?seed=AV&backgroundColor=059669&fontColor=fff' },
];

// ─── Institutions ─────────────────────────────────────────────────────────────
export const MOCK_INSTITUTIONS = [
  { _id:'inst1', name:'Government ITI Kanpur', type:'ITI', aicteCode:'AICTE-UP-2341', state:'Uttar Pradesh', district:'Kanpur', address:'Civil Lines, Kanpur - 208001', website:'https://gitiikanpur.gov.in', coordinatorId:'u2' },
  { _id:'inst2', name:'Bharati Chandra Institute of Technology, Delhi', type:'Polytechnic', aicteCode:'DTE-DL-0892', state:'Delhi', district:'West Delhi', address:'Najafgarh Road, New Delhi - 110059', website:'https://bcitdelhi.gov.in', coordinatorId:'u3' },
];

// ─── Companies ────────────────────────────────────────────────────────────────
export const MOCK_COMPANIES = [
  { _id:'comp1', name:'ITC Limited', emailDomain:'itcltd.com', website:'https://www.itcltd.com', sector:'FMCG', address:'Virginia House, 37 J.L. Nehru Road, Kolkata - 700071', verifiedAt:'2024-01-10' },
  { _id:'comp2', name:'Nestlé India Ltd.', emailDomain:'nestle.com', website:'https://www.nestle.in', sector:'FMCG', address:'Nestlé House, Jacaranda Marg, DLF City, Gurugram - 122002', verifiedAt:'2024-01-15' },
  { _id:'comp3', name:'Britannia Industries', emailDomain:'britannia.co.in', website:'https://www.britannia.co.in', sector:'Food Processing', address:'5/1A, Hungerford Street, Kolkata - 700017', verifiedAt:'2024-02-01' },
];

// ─── Job Requirements ─────────────────────────────────────────────────────────
export const MOCK_JOBS = [
  {
    _id:'job1', companyId:'comp1', postedBy:'u4',
    title:'Plant Operator Trainee', description:'## Role Overview\nWe are hiring Plant Operator Trainees for our Munger tobacco plant. Selected candidates will undergo 6 months of structured training under senior engineers.\n\n## Responsibilities\n- Operate and monitor production machinery\n- Ensure quality checks at each production stage\n- Maintain safety and hygiene standards\n- Report daily production metrics\n\n## Perks\n- Structured career path to Senior Operator within 3 years\n- Free accommodation and meals\n- Provident Fund & ESIC',
    location:'Munger', state:'Bihar', geographyScope:'state',
    slots:[{ qualification:'ITI', branch:'Fitter', seats:80, filledSeats:12 },{ qualification:'ITI', branch:'Electrician', seats:40, filledSeats:8 }],
    salaryMin:12000, salaryMax:18000, applicationDeadline:'2024-03-31',
    status:'open', sector:'FMCG', skills:['Machine Operation','Quality Control','Safety Protocols'],
    experienceLevel:'Fresher', createdAt:'2024-01-20',
  },
  {
    _id:'job2', companyId:'comp2', postedBy:'u5',
    title:'Junior Maintenance Engineer', description:'## About the Role\nNestlé India is looking for Junior Maintenance Engineers for its Moga (Punjab) and Pantnagar (Uttarakhand) factories.\n\n## Key Requirements\n- B.Tech / Diploma in Mechanical or Electrical Engineering\n- Strong understanding of preventive maintenance concepts\n- Willingness to work in rotational shifts',
    location:'Moga / Pantnagar', state:'Punjab', geographyScope:'pan_india',
    slots:[{ qualification:'Diploma', branch:'Mechanical', seats:15, filledSeats:3 },{ qualification:'B.Tech', branch:'Electrical', seats:5, filledSeats:1 }],
    salaryMin:22000, salaryMax:32000, applicationDeadline:'2024-04-15',
    status:'open', sector:'FMCG', skills:['Preventive Maintenance','AutoCAD','PLC Basics','Root Cause Analysis'],
    experienceLevel:'Fresher', createdAt:'2024-01-28',
  },
  {
    _id:'job3', companyId:'comp3', postedBy:'u4',
    title:'Quality Control Analyst', description:'## Position Summary\nBritannia is hiring QC Analysts for its biscuit manufacturing unit in Kolkata.',
    location:'Kolkata', state:'West Bengal', geographyScope:'state',
    slots:[{ qualification:'B.Sc', branch:'Chemistry / Food Technology', seats:10, filledSeats:10 }],
    salaryMin:20000, salaryMax:28000, applicationDeadline:'2024-02-28',
    status:'filled', sector:'Food Processing', skills:['FSSAI Standards','Lab Testing','MS Excel','HACCP'],
    experienceLevel:'Fresher', createdAt:'2024-01-05',
  },
  {
    _id:'job4', companyId:'comp1', postedBy:'u4',
    title:'Logistics Coordinator', description:'Draft posting for logistics expansion.',
    location:'Kolkata', state:'West Bengal', geographyScope:'pan_india',
    slots:[{ qualification:'MBA', branch:'Supply Chain / Logistics', seats:8, filledSeats:0 }],
    salaryMin:30000, salaryMax:45000, applicationDeadline:'2024-05-01',
    status:'draft', sector:'FMCG', skills:['SAP','Logistics','Inventory Management'],
    experienceLevel:'0-2 years', createdAt:'2024-02-10',
  },
];

// ─── Talent Pool Batches ───────────────────────────────────────────────────────
export const MOCK_BATCHES = [
  {
    _id:'batch1', institutionId:'inst1', coordinatorId:'u2',
    name:'Electrical ITI Passout 2024', qualification:'ITI', branch:'Electrician',
    passingYear:2024, totalStudents:3, status:'active',
    students:[
      { _id:'st1', name:'Arjun Singh', rollNumber:'ITI/ELE/2024/001', dob:'2002-05-15', gender:'Male', cgpa:8.4, skills:['Wiring','PLC Basics'], resumeUrl:'#', phone:'9876543210', email:'arjun@gmail.com', address:'Kanpur, UP', languagesKnown:['Hindi','English'], certifications:['NSDC Electrician L3'] },
      { _id:'st2', name:'Pooja Patel', rollNumber:'ITI/ELE/2024/002', dob:'2003-02-20', gender:'Female', cgpa:9.1, skills:['Circuit Boards','Safety'], resumeUrl:'#', phone:'9876543211', email:'pooja@gmail.com', address:'Lucknow, UP', languagesKnown:['Hindi'], certifications:[] },
      { _id:'st3', name:'Rahul Yadav', rollNumber:'ITI/ELE/2024/003', dob:'2002-11-08', gender:'Male', cgpa:7.8, skills:['Wiring','Motors'], resumeUrl:'#', phone:'9876543212', email:'rahul@gmail.com', address:'Agra, UP', languagesKnown:['Hindi','English'], certifications:['First Aid'] },
    ],
  },
  {
    _id:'batch2', institutionId:'inst1', coordinatorId:'u2',
    name:'Fitter Trade Batch 2023', qualification:'ITI', branch:'Fitter',
    passingYear:2023, totalStudents:2, status:'active',
    students:[
      { _id:'st4', name:'Vikram Tiwari', rollNumber:'ITI/FIT/2023/001', dob:'2001-07-22', gender:'Male', cgpa:8.0, skills:['Lathe','Drilling'], resumeUrl:'#', phone:'9876543213', email:'vikram@gmail.com', address:'Kanpur, UP', languagesKnown:['Hindi'], certifications:[] },
      { _id:'st5', name:'Anjali Verma', rollNumber:'ITI/FIT/2023/002', dob:'2002-03-14', gender:'Female', cgpa:8.7, skills:['Welding','Fitting'], resumeUrl:'#', phone:'9876543214', email:'anjali@gmail.com', address:'Varanasi, UP', languagesKnown:['Hindi','English'], certifications:['NSDC Welder L2'] },
    ],
  },
  {
    _id:'batch3', institutionId:'inst1', coordinatorId:'u2',
    name:'Computer Operator Batch 2024', qualification:'ITI', branch:'COPA',
    passingYear:2024, totalStudents:0, status:'draft',
    students:[],
  },
];

// ─── Applications ─────────────────────────────────────────────────────────────
export const MOCK_APPLICATIONS = [
  {
    _id:'app1', jobRequirementId:'job1', talentPoolBatchId:'batch2',
    coordinatorId:'u2', companyId:'comp1',
    status:'shortlisting', coverNote:'Our fitter batch has strong hands-on skills from NSDC-certified training.',
    submittedAt:'2024-01-25',
    studentStatuses:[
      { studentId:'st4', status:'shortlisted', recruiterNote:'Strong lathe skills', updatedAt:'2024-01-28' },
      { studentId:'st5', status:'selected', recruiterNote:'Excellent welding cert', updatedAt:'2024-01-29' },
    ],
  },
  {
    _id:'app2', jobRequirementId:'job2', talentPoolBatchId:'batch1',
    coordinatorId:'u2', companyId:'comp2',
    status:'submitted', coverNote:'Electrical ITI batch with 3 strong candidates.',
    submittedAt:'2024-02-01',
    studentStatuses:[
      { studentId:'st1', status:'applied', recruiterNote:'', updatedAt:'2024-02-01' },
      { studentId:'st2', status:'applied', recruiterNote:'', updatedAt:'2024-02-01' },
      { studentId:'st3', status:'applied', recruiterNote:'', updatedAt:'2024-02-01' },
    ],
  },
];

// ─── Notifications ─────────────────────────────────────────────────────────────
export const MOCK_NOTIFICATIONS = {
  u1:[
    { _id:'n1', type:'new_registration', message:'Mohd. Irfan has submitted a coordinator registration request.', link:'/admin/approvals', read:false, createdAt:'2024-02-03T08:30:00Z' },
    { _id:'n2', type:'new_registration', message:'Kavitha Rajan has submitted a recruiter registration request.', link:'/admin/approvals', read:false, createdAt:'2024-02-02T14:15:00Z' },
    { _id:'n3', type:'new_registration', message:'Suresh Yadav registration was rejected.', link:'/admin/approvals', read:true, createdAt:'2024-01-30T10:00:00Z' },
  ],
  u2:[
    { _id:'n4', type:'student_status_updated', message:'ITC Limited shortlisted Vikram Tiwari from your Fitter Batch.', link:'/coordinator/applications', read:false, createdAt:'2024-01-28T11:00:00Z' },
    { _id:'n5', type:'student_status_updated', message:'ITC Limited selected Anjali Verma from your Fitter Batch!', link:'/coordinator/applications', read:false, createdAt:'2024-01-29T09:30:00Z' },
    { _id:'n6', type:'new_job_posted', message:'New job posted by Nestlé India matching your state.', link:'/coordinator/jobs', read:true, createdAt:'2024-01-28T08:00:00Z' },
  ],
  u4:[
    { _id:'n7', type:'new_application', message:'New application received from Govt. ITI Kanpur for Plant Operator Trainee.', link:'/recruiter/jobs/job1/applications', read:false, createdAt:'2024-01-25T14:00:00Z' },
    { _id:'n8', type:'deadline_approaching', message:'Application deadline for Plant Operator Trainee is in 3 days.', link:'/recruiter/jobs', read:false, createdAt:'2024-03-28T08:00:00Z' },
  ],
  st1:[
    { _id:'sn1', type:'status_update', message:'You have been shortlisted by Nestlé India for Junior Maintenance Engineer!', link:'/student/applications', read:false, createdAt:'2024-02-01T10:00:00Z' },
    { _id:'sn2', type:'new_opportunity', message:'New job opening: Plant Operator Trainee at ITC Limited matches your profile.', link:'/student/jobs', read:false, createdAt:'2024-01-21T08:00:00Z' },
  ],
  st2:[
    { _id:'sn3', type:'status_update', message:'Your application to Nestlé India is under review.', link:'/student/applications', read:false, createdAt:'2024-02-02T09:00:00Z' },
  ],
  st4:[
    { _id:'sn4', type:'status_update', message:'ITC Limited has shortlisted you for Plant Operator Trainee!', link:'/student/applications', read:false, createdAt:'2024-01-28T11:00:00Z' },
    { _id:'sn5', type:'new_opportunity', message:'New job: Plant Operator Trainee at ITC Limited — deadline in 5 days.', link:'/student/jobs', read:true, createdAt:'2024-01-20T08:00:00Z' },
  ],
  st5:[
    { _id:'sn6', type:'status_update', message:'🎉 Congratulations! You have been selected by ITC Limited for Plant Operator Trainee.', link:'/student/applications', read:false, createdAt:'2024-01-29T09:30:00Z' },
    { _id:'sn7', type:'new_opportunity', message:'New job: Plant Operator Trainee at ITC Limited matches your batch.', link:'/student/jobs', read:true, createdAt:'2024-01-20T08:00:00Z' },
  ],
};

// ─── Analytics (for admin) ─────────────────────────────────────────────────────
export const MOCK_ANALYTICS = {
  summary:{ totalInstitutions:847, totalCompanies:312, totalPlacements:4218, totalApplications:1563, pendingApprovals:2, totalCoordinators:782, totalRecruiters:294, totalJobPostings:438 },
  jobsByState:[
    { state:'Maharashtra', count:89 },{ state:'Tamil Nadu', count:72 },{ state:'Gujarat', count:65 },
    { state:'Karnataka', count:58 },{ state:'Uttar Pradesh', count:54 },{ state:'West Bengal', count:43 },
    { state:'Rajasthan', count:38 },{ state:'Telangana', count:35 },
  ],
  jobsBySector:[
    { sector:'FMCG', count:124 },{ sector:'Manufacturing', count:98 },{ sector:'IT', count:67 },
    { sector:'Automotive', count:54 },{ sector:'Pharma', count:43 },{ sector:'Food Processing', count:38 },
  ],
  funnelData:[
    { stage:'Applications Submitted', value:1563 },{ stage:'Under Review', value:1201 },
    { stage:'Shortlisting', value:856 },{ stage:'Students Shortlisted', value:4217 },
    { stage:'Students Selected', value:2108 },
  ],
  registrationsPerMonth:[
    { month:'Aug', coordinators:42, recruiters:18 },{ month:'Sep', coordinators:68, recruiters:29 },
    { month:'Oct', coordinators:55, recruiters:22 },{ month:'Nov', coordinators:81, recruiters:35 },
    { month:'Dec', coordinators:49, recruiters:19 },{ month:'Jan', coordinators:93, recruiters:44 },
    { month:'Feb', coordinators:77, recruiters:38 },
  ],
  topCompanies:[
    { name:'ITC Limited', jobs:24 },{ name:'Nestlé India', jobs:18 },{ name:'Britannia', jobs:15 },
    { name:'Godrej Consumer', jobs:12 },{ name:'Hindustan Unilever', jobs:11 },
  ],
  topInstitutions:[
    { name:'Govt. ITI Kanpur', applications:34 },{ name:'BCIT Delhi', applications:28 },
    { name:'Govt. Polytechnic Pune', applications:25 },{ name:'ITI Bhopal', applications:22 },
  ],
};
