// ─── Constants ────────────────────────────────────────────────────────────────
export const INDIAN_STATES = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Andaman & Nicobar Islands','Chandigarh','Dadra & Nagar Haveli','Daman & Diu','Delhi','Jammu & Kashmir','Ladakh','Lakshadweep','Puducherry'];
export const QUALIFICATIONS = ['ITI','Diploma','B.Tech','M.Tech','B.Sc','B.Com','MBA','Other'];
export const SECTORS = ['FMCG','Food Processing','Manufacturing','IT','Automotive','Pharma','Textiles','Construction','Chemical','Energy'];
export const INSTITUTION_TYPES = ['ITI','Polytechnic','Engineering College','Degree College','University','Other'];
export const EXPERIENCE_LEVELS = ['Fresher','0-2 years','2-5 years'];

// ─── Medak District map locations ─────────────────────────────────────────────
export const MEDAK_LOCATIONS = [
  { id:'loc1', type:'college', name:'Govt. ITI Medak', lat:18.0490, lng:78.2601, students:120, district:'Medak', qualification:'ITI' },
  { id:'loc2', type:'college', name:'Govt. ITI Sangareddy', lat:17.6241, lng:78.0876, students:95, district:'Sangareddy', qualification:'ITI' },
  { id:'loc3', type:'college', name:'Govt. Degree College Medak', lat:18.0530, lng:78.2650, students:210, district:'Medak', qualification:'B.Sc' },
  { id:'loc4', type:'college', name:'Govt. ITI Narsapur', lat:17.7200, lng:78.2800, students:80, district:'Medak', qualification:'ITI' },
  { id:'loc5', type:'college', name:'Govt. Polytechnic Zaheerabad', lat:17.6800, lng:77.6100, students:140, district:'Sangareddy', qualification:'Diploma' },
  { id:'loc6', type:'factory', name:'ITC Limited – Medak Plant', lat:18.0600, lng:78.2700, vacancies:45, sector:'FMCG', companyId:'comp1' },
  { id:'loc7', type:'factory', name:'Nestlé India – Zaheerabad', lat:17.6850, lng:77.6200, vacancies:28, sector:'Food Processing', companyId:'comp2' },
  { id:'loc8', type:'factory', name:'Britannia – Medak Unit', lat:18.0400, lng:78.2500, vacancies:18, sector:'Food Processing', companyId:'comp3' },
  { id:'loc9', type:'factory', name:'PepsiCo – Sangareddy', lat:17.6300, lng:78.0900, vacancies:12, sector:'FMCG', companyId:'comp4' },
  { id:'loc10', type:'factory', name:'Agro Tech Foods – Medak', lat:18.0700, lng:78.2800, vacancies:8, sector:'Food Processing', companyId:'comp5' },
];

// ─── Users ────────────────────────────────────────────────────────────────────
export const MOCK_USERS = [
  { _id:'u1', name:'District Collector, Medak', email:'collector.medak@telangana.gov.in', role:'super_admin', approvalStatus:'approved', profileImage:'https://api.dicebear.com/7.x/initials/svg?seed=DC&backgroundColor=1e3a5f&fontColor=fff' },
  { _id:'u2', name:'K. Venkatesh Reddy', email:'venkatesh@iti-medak.gov.in', role:'coordinator', approvalStatus:'approved', state:'Telangana', designation:'Principal & Placement Officer', institutionId:'inst1', profileImage:'https://api.dicebear.com/7.x/initials/svg?seed=KV&backgroundColor=16a34a&fontColor=fff' },
  { _id:'u3', name:'S. Padmavathi', email:'padmavathi@iti-sangareddy.gov.in', role:'coordinator', approvalStatus:'approved', state:'Telangana', designation:'Training & Placement Coordinator', institutionId:'inst2', profileImage:'https://api.dicebear.com/7.x/initials/svg?seed=SP&backgroundColor=16a34a&fontColor=fff' },
  { _id:'u4', name:'Rajesh Nair', email:'rajesh.nair@itcltd.com', role:'recruiter', approvalStatus:'approved', designation:'HR Manager – Medak Plant', companyId:'comp1', profileImage:'https://api.dicebear.com/7.x/initials/svg?seed=RN&backgroundColor=2563eb&fontColor=fff' },
  { _id:'u5', name:'Anitha Rao', email:'anitha.rao@nestle.com', role:'recruiter', approvalStatus:'approved', designation:'Talent Acquisition Lead', companyId:'comp2', profileImage:'https://api.dicebear.com/7.x/initials/svg?seed=AR&backgroundColor=2563eb&fontColor=fff' },
  { _id:'u6', name:'B. Srinivas', email:'srinivas@iti-narsapur.gov.in', role:'coordinator', approvalStatus:'pending', state:'Telangana', designation:'HOD – Electrical', institutionId:null, profileImage:'https://api.dicebear.com/7.x/initials/svg?seed=BS&backgroundColor=ea580c&fontColor=fff' },
  { _id:'u7', name:'Pradeep Kumar', email:'pradeep@britannia.co.in', role:'recruiter', approvalStatus:'pending', designation:'HR Executive', companyId:null, profileImage:'https://api.dicebear.com/7.x/initials/svg?seed=PK&backgroundColor=ea580c&fontColor=fff' },
  { _id:'u8', name:'M. Laxmi', email:'laxmi@iti-zaheerabad.gov.in', role:'coordinator', approvalStatus:'rejected', state:'Telangana', designation:'Coordinator', institutionId:null, profileImage:'https://api.dicebear.com/7.x/initials/svg?seed=ML&backgroundColor=dc2626&fontColor=fff', rejectionReason:'AICTE code does not match institution records.' },
  { _id:'st1', name:'Ravi Kumar', email:'ravi.kumar@student.in', role:'student', approvalStatus:'approved', batchId:'batch1', institutionId:'inst1', profileImage:'https://api.dicebear.com/7.x/initials/svg?seed=RK2&backgroundColor=7c3aed&fontColor=fff' },
  { _id:'st2', name:'Lakshmi Devi', email:'lakshmi@student.in', role:'student', approvalStatus:'approved', batchId:'batch1', institutionId:'inst1', profileImage:'https://api.dicebear.com/7.x/initials/svg?seed=LD&backgroundColor=db2777&fontColor=fff' },
  { _id:'st4', name:'Suresh Babu', email:'suresh.babu@student.in', role:'student', approvalStatus:'approved', batchId:'batch2', institutionId:'inst1', profileImage:'https://api.dicebear.com/7.x/initials/svg?seed=SB2&backgroundColor=0891b2&fontColor=fff' },
  { _id:'st5', name:'Kavitha Reddy', email:'kavitha.reddy@student.in', role:'student', approvalStatus:'approved', batchId:'batch2', institutionId:'inst1', profileImage:'https://api.dicebear.com/7.x/initials/svg?seed=KR2&backgroundColor=059669&fontColor=fff' },
];

// ─── Institutions ─────────────────────────────────────────────────────────────
export const MOCK_INSTITUTIONS = [
  { _id:'inst1', name:'Government ITI Medak', type:'ITI', aicteCode:'NCVT-TG-MDK-001', state:'Telangana', district:'Medak', address:'Near Bus Stand, Medak - 502110', website:'https://iti-medak.gov.in', coordinatorId:'u2', lat:18.0490, lng:78.2601 },
  { _id:'inst2', name:'Government ITI Sangareddy', type:'ITI', aicteCode:'NCVT-TG-SGR-002', state:'Telangana', district:'Sangareddy', address:'Sangareddy - 502001', website:'https://iti-sangareddy.gov.in', coordinatorId:'u3', lat:17.6241, lng:78.0876 },
];

// ─── Companies ────────────────────────────────────────────────────────────────
export const MOCK_COMPANIES = [
  { _id:'comp1', name:'ITC Limited', emailDomain:'itcltd.com', website:'https://www.itcltd.com', sector:'FMCG', address:'ITC Agri Business, Medak District, Telangana', verifiedAt:'2024-01-10', lat:18.0600, lng:78.2700 },
  { _id:'comp2', name:'Nestlé India Ltd.', emailDomain:'nestle.com', website:'https://www.nestle.in', sector:'Food Processing', address:'Zaheerabad, Sangareddy District, Telangana', verifiedAt:'2024-01-15', lat:17.6850, lng:77.6200 },
  { _id:'comp3', name:'Britannia Industries', emailDomain:'britannia.co.in', website:'https://www.britannia.co.in', sector:'Food Processing', address:'Medak Industrial Area, Telangana', verifiedAt:'2024-02-01', lat:18.0400, lng:78.2500 },
  { _id:'comp4', name:'PepsiCo India', emailDomain:'pepsico.com', website:'https://www.pepsicoindia.co.in', sector:'FMCG', address:'Sangareddy, Telangana', verifiedAt:'2024-02-10', lat:17.6300, lng:78.0900 },
  { _id:'comp5', name:'Agro Tech Foods', emailDomain:'agrotechfoods.com', website:'https://www.agrotechfoods.com', sector:'Food Processing', address:'Medak, Telangana', verifiedAt:'2024-02-15', lat:18.0700, lng:78.2800 },
];

// ─── Job Requirements ─────────────────────────────────────────────────────────
export const MOCK_JOBS = [
  { _id:'job1', companyId:'comp1', postedBy:'u4', title:'Plant Operator Trainee', description:'ITC Medak is hiring Plant Operator Trainees for its agri-processing unit.\n\nResponsibilities:\n- Operate and monitor production machinery\n- Ensure quality checks at each production stage\n- Maintain safety and hygiene standards\n\nPerks:\n- Structured career path to Senior Operator within 3 years\n- Free accommodation and meals\n- Provident Fund & ESIC', location:'Medak', state:'Telangana', geographyScope:'state', slots:[{ qualification:'ITI', branch:'Fitter', seats:30, filledSeats:8 },{ qualification:'ITI', branch:'Electrician', seats:20, filledSeats:5 }], salaryMin:12000, salaryMax:18000, applicationDeadline:'2024-03-31', status:'open', sector:'FMCG', skills:['Machine Operation','Quality Control','Safety Protocols'], experienceLevel:'Fresher', createdAt:'2024-01-20' },
  { _id:'job2', companyId:'comp2', postedBy:'u5', title:'Food Processing Technician', description:'Nestlé Zaheerabad is looking for Food Processing Technicians.\n\nKey Requirements:\n- ITI / Diploma in Food Technology or related trade\n- Knowledge of FSSAI standards\n- Willingness to work in rotational shifts', location:'Zaheerabad', state:'Telangana', geographyScope:'state', slots:[{ qualification:'ITI', branch:'Food Production', seats:15, filledSeats:3 },{ qualification:'Diploma', branch:'Food Technology', seats:5, filledSeats:1 }], salaryMin:14000, salaryMax:20000, applicationDeadline:'2024-04-15', status:'open', sector:'Food Processing', skills:['FSSAI Standards','Food Safety','Quality Control'], experienceLevel:'Fresher', createdAt:'2024-01-28' },
  { _id:'job3', companyId:'comp3', postedBy:'u4', title:'Quality Control Inspector', description:'Britannia Medak is hiring QC Inspectors for its biscuit manufacturing unit.', location:'Medak', state:'Telangana', geographyScope:'state', slots:[{ qualification:'B.Sc', branch:'Chemistry / Food Technology', seats:8, filledSeats:8 }], salaryMin:16000, salaryMax:22000, applicationDeadline:'2024-02-28', status:'filled', sector:'Food Processing', skills:['FSSAI Standards','Lab Testing','MS Excel','HACCP'], experienceLevel:'Fresher', createdAt:'2024-01-05' },
  { _id:'job4', companyId:'comp1', postedBy:'u4', title:'Packaging Line Operator', description:'ITC Medak requires Packaging Line Operators for its expanded production facility.', location:'Medak', state:'Telangana', geographyScope:'state', slots:[{ qualification:'ITI', branch:'Mechanic', seats:25, filledSeats:0 }], salaryMin:11000, salaryMax:15000, applicationDeadline:'2024-05-01', status:'open', sector:'FMCG', skills:['Machine Operation','Packaging','Safety'], experienceLevel:'Fresher', createdAt:'2024-02-10' },
  { _id:'job5', companyId:'comp4', postedBy:'u4', title:'Lab Analyst – B.Sc Chemistry', description:'PepsiCo Sangareddy requires Lab Analysts for quality testing.', location:'Sangareddy', state:'Telangana', geographyScope:'state', slots:[{ qualification:'B.Sc', branch:'Chemistry', seats:6, filledSeats:2 }], salaryMin:18000, salaryMax:25000, applicationDeadline:'2024-04-30', status:'open', sector:'FMCG', skills:['Lab Testing','Chemical Analysis','MS Excel'], experienceLevel:'Fresher', createdAt:'2024-02-15' },
];

// ─── Talent Pool Batches ───────────────────────────────────────────────────────
export const MOCK_BATCHES = [
  { _id:'batch1', institutionId:'inst1', coordinatorId:'u2', name:'Electrician Trade – 2024 Passout', qualification:'ITI', branch:'Electrician', passingYear:2024, totalStudents:3, status:'active', students:[
    { _id:'st1', name:'Ravi Kumar', rollNumber:'ITI/ELE/2024/001', dob:'2002-05-15', gender:'Male', cgpa:8.4, skills:['Wiring','PLC Basics'], resumeUrl:'#', phone:'9876543210', email:'ravi.kumar@student.in', address:'Medak, Telangana', languagesKnown:['Telugu','Hindi'], certifications:['NCVT Electrician'] },
    { _id:'st2', name:'Lakshmi Devi', rollNumber:'ITI/ELE/2024/002', dob:'2003-02-20', gender:'Female', cgpa:9.1, skills:['Circuit Boards','Safety'], resumeUrl:'#', phone:'9876543211', email:'lakshmi@student.in', address:'Medak, Telangana', languagesKnown:['Telugu'], certifications:[] },
    { _id:'st3', name:'Ramesh Goud', rollNumber:'ITI/ELE/2024/003', dob:'2002-11-08', gender:'Male', cgpa:7.8, skills:['Wiring','Motors'], resumeUrl:'#', phone:'9876543212', email:'ramesh@student.in', address:'Narsapur, Telangana', languagesKnown:['Telugu','English'], certifications:['First Aid'] },
  ]},
  { _id:'batch2', institutionId:'inst1', coordinatorId:'u2', name:'Fitter Trade – 2023 Passout', qualification:'ITI', branch:'Fitter', passingYear:2023, totalStudents:2, status:'active', students:[
    { _id:'st4', name:'Suresh Babu', rollNumber:'ITI/FIT/2023/001', dob:'2001-07-22', gender:'Male', cgpa:8.0, skills:['Lathe','Drilling'], resumeUrl:'#', phone:'9876543213', email:'suresh.babu@student.in', address:'Medak, Telangana', languagesKnown:['Telugu'], certifications:[] },
    { _id:'st5', name:'Kavitha Reddy', rollNumber:'ITI/FIT/2023/002', dob:'2002-03-14', gender:'Female', cgpa:8.7, skills:['Welding','Fitting'], resumeUrl:'#', phone:'9876543214', email:'kavitha.reddy@student.in', address:'Sangareddy, Telangana', languagesKnown:['Telugu','English'], certifications:['NCVT Welder'] },
  ]},
  { _id:'batch3', institutionId:'inst1', coordinatorId:'u2', name:'COPA Trade – 2024 Passout', qualification:'ITI', branch:'COPA', passingYear:2024, totalStudents:0, status:'draft', students:[] },
];

// ─── Applications ─────────────────────────────────────────────────────────────
export const MOCK_APPLICATIONS = [
  { _id:'app1', jobRequirementId:'job1', talentPoolBatchId:'batch2', coordinatorId:'u2', companyId:'comp1', status:'shortlisting', coverNote:'Our fitter batch has strong hands-on skills from NCVT-certified training.', submittedAt:'2024-01-25', studentStatuses:[
    { studentId:'st4', status:'shortlisted', recruiterNote:'Strong lathe skills', updatedAt:'2024-01-28' },
    { studentId:'st5', status:'selected', recruiterNote:'Excellent welding cert', updatedAt:'2024-01-29' },
  ]},
  { _id:'app2', jobRequirementId:'job2', talentPoolBatchId:'batch1', coordinatorId:'u2', companyId:'comp2', status:'submitted', coverNote:'Electrician ITI batch with 3 strong candidates from Medak.', submittedAt:'2024-02-01', studentStatuses:[
    { studentId:'st1', status:'applied', recruiterNote:'', updatedAt:'2024-02-01' },
    { studentId:'st2', status:'applied', recruiterNote:'', updatedAt:'2024-02-01' },
    { studentId:'st3', status:'applied', recruiterNote:'', updatedAt:'2024-02-01' },
  ]},
];

// ─── Placed Students (Audit Trail) ────────────────────────────────────────────
export const MOCK_PLACED_STUDENTS = [
  { _id:'ps1', name:'Kavitha Reddy', phone:'9876543214', email:'kavitha.reddy@student.in', college:'Govt. ITI Medak', qualification:'ITI', branch:'Fitter', company:'ITC Limited', role:'Plant Operator Trainee', salary:15000, placedOn:'2024-01-29', district:'Medak' },
  { _id:'ps2', name:'Arun Naik', phone:'9876543220', email:'arun@student.in', college:'Govt. ITI Sangareddy', qualification:'ITI', branch:'Electrician', company:'Nestlé India', role:'Food Processing Technician', salary:16000, placedOn:'2024-01-15', district:'Sangareddy' },
  { _id:'ps3', name:'Priya Yadav', phone:'9876543221', email:'priya@student.in', college:'Govt. Degree College Medak', qualification:'B.Sc', branch:'Chemistry', company:'Britannia Industries', role:'Quality Control Inspector', salary:20000, placedOn:'2024-01-20', district:'Medak' },
  { _id:'ps4', name:'Mahesh Kumar', phone:'9876543222', email:'mahesh@student.in', college:'Govt. ITI Medak', qualification:'ITI', branch:'Fitter', company:'ITC Limited', role:'Plant Operator Trainee', salary:14000, placedOn:'2024-02-05', district:'Medak' },
  { _id:'ps5', name:'Sunita Bai', phone:'9876543223', email:'sunita@student.in', college:'Govt. Polytechnic Zaheerabad', qualification:'Diploma', branch:'Mechanical', company:'PepsiCo India', role:'Lab Analyst', salary:19000, placedOn:'2024-02-10', district:'Sangareddy' },
  { _id:'ps6', name:'Raju Goud', phone:'9876543224', email:'raju@student.in', college:'Govt. ITI Narsapur', qualification:'ITI', branch:'Electrician', company:'Agro Tech Foods', role:'Packaging Line Operator', salary:12000, placedOn:'2024-02-12', district:'Medak' },
];

// ─── Notifications ─────────────────────────────────────────────────────────────
export const MOCK_NOTIFICATIONS = {
  u1:[
    { _id:'n1', type:'new_registration', message:'B. Srinivas has submitted a coordinator registration request.', link:'/admin/approvals', read:false, createdAt:'2024-02-03T08:30:00Z' },
    { _id:'n2', type:'new_registration', message:'Pradeep Kumar (Britannia) submitted a recruiter registration.', link:'/admin/approvals', read:false, createdAt:'2024-02-02T14:15:00Z' },
    { _id:'n3', type:'new_registration', message:'M. Laxmi registration was rejected.', link:'/admin/approvals', read:true, createdAt:'2024-01-30T10:00:00Z' },
  ],
  u2:[
    { _id:'n4', type:'student_status_updated', message:'ITC Limited shortlisted Suresh Babu from your Fitter Batch.', link:'/coordinator/applications', read:false, createdAt:'2024-01-28T11:00:00Z' },
    { _id:'n5', type:'student_status_updated', message:'ITC Limited selected Kavitha Reddy from your Fitter Batch!', link:'/coordinator/applications', read:false, createdAt:'2024-01-29T09:30:00Z' },
    { _id:'n6', type:'new_job_posted', message:'New job posted by Nestlé India matching Telangana.', link:'/coordinator/jobs', read:true, createdAt:'2024-01-28T08:00:00Z' },
  ],
  u4:[
    { _id:'n7', type:'new_application', message:'New application received from Govt. ITI Medak for Plant Operator Trainee.', link:'/recruiter/jobs/job1/applications', read:false, createdAt:'2024-01-25T14:00:00Z' },
    { _id:'n8', type:'deadline_approaching', message:'Application deadline for Plant Operator Trainee is in 3 days.', link:'/recruiter/jobs', read:false, createdAt:'2024-03-28T08:00:00Z' },
  ],
  st1:[{ _id:'sn1', type:'status_update', message:'You have been shortlisted by Nestlé India for Food Processing Technician!', link:'/student/applications', read:false, createdAt:'2024-02-01T10:00:00Z' },{ _id:'sn2', type:'new_opportunity', message:'New job: Plant Operator Trainee at ITC Medak matches your profile.', link:'/student/jobs', read:false, createdAt:'2024-01-21T08:00:00Z' }],
  st2:[{ _id:'sn3', type:'status_update', message:'Your application to Nestlé India is under review.', link:'/student/applications', read:false, createdAt:'2024-02-02T09:00:00Z' }],
  st4:[{ _id:'sn4', type:'status_update', message:'ITC Limited has shortlisted you for Plant Operator Trainee!', link:'/student/applications', read:false, createdAt:'2024-01-28T11:00:00Z' },{ _id:'sn5', type:'new_opportunity', message:'New job: Plant Operator Trainee at ITC Medak — deadline in 5 days.', link:'/student/jobs', read:true, createdAt:'2024-01-20T08:00:00Z' }],
  st5:[{ _id:'sn6', type:'status_update', message:'🎉 Congratulations! You have been selected by ITC Limited.', link:'/student/applications', read:false, createdAt:'2024-01-29T09:30:00Z' },{ _id:'sn7', type:'new_opportunity', message:'New job: Plant Operator Trainee at ITC Medak matches your batch.', link:'/student/jobs', read:true, createdAt:'2024-01-20T08:00:00Z' }],
};

// ─── Analytics ─────────────────────────────────────────────────────────────────
export const MOCK_ANALYTICS = {
  summary:{ totalInstitutions:12, totalCompanies:8, totalPlacements:186, totalApplications:342, pendingApprovals:2, totalCoordinators:12, totalRecruiters:8, totalJobPostings:24 },
  placementRatio:{ applicants:342, hired:186, ratio:54.4 },
  jobsByDistrict:[{ district:'Medak', count:14 },{ district:'Sangareddy', count:8 },{ district:'Siddipet', count:2 }],
  jobsBySector:[{ sector:'FMCG', count:10 },{ sector:'Food Processing', count:8 },{ sector:'Manufacturing', count:4 },{ sector:'Chemical', count:2 }],
  byQualification:[{ qualification:'ITI', applicants:210, hired:118 },{ qualification:'Diploma', applicants:68, hired:38 },{ qualification:'B.Sc', applicants:42, hired:22 },{ qualification:'B.Com', applicants:22, hired:8 }],
  funnelData:[{ stage:'Applications Submitted', value:342 },{ stage:'Under Review', value:280 },{ stage:'Shortlisted', value:210 },{ stage:'Interview Scheduled', value:142 },{ stage:'Hired', value:186 }],
  sectorHeatmap:[{ sector:'Processing', intensity:85 },{ sector:'Packaging', intensity:72 },{ sector:'Quality Control', intensity:58 },{ sector:'Maintenance', intensity:44 },{ sector:'Lab / R&D', intensity:30 }],
  topCompanies:[{ name:'ITC Limited', jobs:8, hired:72 },{ name:'Nestlé India', jobs:5, hired:48 },{ name:'Britannia', jobs:4, hired:32 },{ name:'PepsiCo India', jobs:4, hired:22 },{ name:'Agro Tech Foods', jobs:3, hired:12 }],
  topInstitutions:[{ name:'Govt. ITI Medak', applications:142, placed:78 },{ name:'Govt. ITI Sangareddy', applications:98, placed:54 },{ name:'Govt. Polytechnic Zaheerabad', applications:62, placed:32 },{ name:'Govt. Degree College Medak', applications:40, placed:22 }],
};
