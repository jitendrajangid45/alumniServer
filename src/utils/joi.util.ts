import Joi from 'joi';

// Define a schema for LoginForm object
export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'any.required': 'Email is required',
    'string.email': 'Invalid Email',
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required',
  }),
  portalType: Joi.string().valid('alumni', 'shop').required(),
});

//post Job and Internship Schema for validating the fields
export const postJobSchema = Joi.object({
  jobTitle: Joi.string().required().messages({
    'any.required': 'Job Title is required',
  }),
  companyName: Joi.string().required().messages({
    'any.required': 'Company Name is required',
  }),
  companyWebsite: Joi.string().required().messages({
    'any.required': 'Company Website is required',
  }),
  experienceFrom: Joi.number().required().messages({
    'any.required': 'Experience Level From is required',
  }),
  experienceTo: Joi.number().required().messages({
    'any.required': 'Experience Level To is required',
  }),
  jobLocation: Joi.string().required().messages({
    'any.required': 'Location is required',
  }),
  contactEmail: Joi.string().required().email().messages({
    'any.required': 'Email is required',
    'string.email': 'Invalid Email',
  }),
  skills: Joi.array().required().messages({
    'any.required': 'Skills are required',
  }),
  salaryPackage: Joi.allow(null).messages({
    'any.required': 'Salary Package is required',
  }),
  salaryStipend: Joi.allow(null).messages({
    'any.required': 'Salary Stipend is required',
  }),
  applicationDeadline: Joi.date().required().messages({
    'any.required': 'Application Deadline is required',
  }),
  jobsDescription: Joi.string().required().messages({
    'any.required': 'Job Description is required',
  }),
  filePath: Joi.allow(null).messages({
    'any.required': 'File Path is required',
  }),
  user: Joi.string().required().messages({
    'number.required': 'User ID is required',
  }),
  jobType: Joi.string().required().messages({
    'any.required': 'Job Type is required',
  }),
  education: Joi.string().required().messages({
    'any.required': 'Education is required',
  }),
  department: Joi.string().required().messages({
    'any.required': 'Department is required',
  }),
  industryType: Joi.string().required().messages({
    'any.required': 'Industry Type is required',
  }),
  role: Joi.string().required().messages({
    'any.required': 'Role is required',
  }),
  employmentType: Joi.string().required().messages({
    'any.required': 'Employment Type is required',
  }),
  isVerified:Joi.number().required().messages({
    'any.required': 'isVerified is required',
  }),
  visibleTo: Joi.string().required().messages({
    'any.required': 'isVisible is required',
  })
});


//post Resume of user and friends Schema for validating the fields
export const postResumeSchema = Joi.object({
  applicantFullName: Joi.string().required().messages({
    'any.required': 'Applicant Name is required',
  }),
  applicantEmail: Joi.string().required().email().messages({
    'any.required': 'Email is required',
    'string.email': 'Invalid Email',
  }),
  mobileNumber: Joi.number().required().messages({
    'any.required': 'Mobile Number is required',
  }),
  applicantRelevantSkills: Joi.string().required().messages({
    'any.required': 'Skills is required',
  }),
  noteForRecruiter: Joi.string().required().messages({
    'any.required': 'Note For Recruiter is required',
  }),
  reference: Joi.string().required().messages({
    'any.required': 'Reference is required',
  }),
  applicantResumePath: Joi.string().required().messages({
    'any.required': 'Resume Path is required',
  }),
  user: Joi.number().required().messages({
    'any.required': 'userId are required',
  }),
});


// Define a schema for registerForm object
export const registerFormSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  loginType: Joi.string().required(),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
  gender: Joi.string().valid('male', 'female', 'other').required(),
  dateOfBirth: Joi.date().iso().required(),
  role: Joi.string().valid('alumni', 'faculty_alumni', 'shop').required(),
});


// Define a schema for alumniOrFacultyInfo object
const alumniOrFacultyInfoSchema = Joi.object({
  collageName: Joi.string().required(),
  programDegree: Joi.string().required(),
  stream: Joi.string().required(),
  endYear: Joi.string().required(),
});

// Define a schema for alumniWorkDetails object
const alumniWorkDetailsSchema = Joi.object({
  companyName: Joi.string().allow(''),
  position: Joi.string().allow(''),
  joiningDate: Joi.string().allow(''),
  leavingDate: Joi.string().allow(''),
  overallWorkExperience: Joi.number().integer().allow(null),
  isWorking: Joi.boolean(),
  professionalSkills: Joi.string().allow(''),
  industriesWorkIn: Joi.string().allow(''),
  roles: Joi.string().allow(''),
});

// Define a schema for the main object
export const mainSchema = Joi.object({
  registerForm: registerFormSchema.required(),
  alumniOrFacultyInfo: alumniOrFacultyInfoSchema.required(),
  alumniWorkDetails: alumniWorkDetailsSchema.required(),
});

// Define a schema for add Alumni
export const addAlumniSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  gender: Joi.string().valid('male', 'female', 'other').required(),
  dateOfBirth: Joi.date().iso().required(),
  role: Joi.string().valid('alumni', 'faculty_alumni').required(),
});

// Define a schema for additional requirements (collage and batch)
export const collageAndBatchSchema = Joi.object({
  collage: Joi.number().required(),
  batch: Joi.number().required(),
});

// Combine the two schemas
export const alumniSchema = addAlumniSchema.concat(collageAndBatchSchema);

export const userDetailsScheme = Joi.object({
  detailsId:Joi.number().allow(null),
  homeTown:Joi.string().allow(null),
  bloodGroup:Joi.string().allow(null),
  address:Joi.string().allow(null),
  location:Joi.string().allow(null),
  postalCode:Joi.number().allow(null),
  mobileNo:Joi.number().required(),
  countryCode:Joi.number().allow(null),
  currentCity:Joi.string().allow(null),
  homePhone:Joi.number().allow(null),
  workPhone:Joi.number().allow(null),
  alternateEmail:Joi.any().allow(null),
  websitePortfolioBlog:Joi.any().allow(null),
  facebookProfile:Joi.any().allow(null),
  linkedinProfile:Joi.any().allow(null),
  youtubeChannel:Joi.any().allow(null),
  instagramProfile:Joi.any().allow(null),
  twitterProfile:Joi.any().allow(null),
  relationshipStatus:Joi.any().allow(null),
  aboutMe:Joi.any().allow(null),
  user: Joi.number().required().messages({
    'any.required': 'userId are required',
  }),
});

// Define a schema for College object
export const addCollegeSchema = Joi.object({

  collegeId:Joi.any().allow(null),
  collegeName:Joi.string().required().messages({
    'any.required':'College Name required'
  }),
  collegeCode:Joi.string().required().messages({
    'any.required':'College Code required'
  }),
  collegeLogoPath:Joi.string().required().messages({
    'any.collegeLogoPath':'College Logo required'
  })

});

export const addCourseScheme = Joi.object({
  collegeCode:Joi.number().required().messages({
    'any.required':'College Code is required'
  }),
  courseName:Joi.string().required().messages({
    'any.required':'College Name is required'
  })
});

// Validate array of addAlumniSchema
export const arrayAlumniSchema = Joi.array().items(addAlumniSchema).unique((a, b) => a.email === b.email);



export const postEventData = Joi.object({
  eventTitle: Joi.string().required().messages({
    'any.required': 'Event Title is required',
  }),
  eventType: Joi.string().required().messages({
    'any.required': 'Event Type is required',
  }),
  startDate: Joi.date().required().messages({
    'any.required': 'Event Start Date is required',
  }),
  startTime: Joi.string().required().messages({
    'any.required': 'Event Start Time is required',
  }),
  endDate: Joi.when('eventType', {
    is: 'Webinar',
    then: Joi.allow(null),
    otherwise: Joi.date().required().messages({
      'any.required': 'Event End Date is required',
    }),
  }),
  endTime: Joi.string().required().messages({
    'any.required': 'Event End Time is required',
  }),
  eventVenue: Joi.when('eventType', {
    is: 'Webinar',
    then: Joi.allow(null),
    otherwise: Joi.string().required().messages({
      'any.required': 'Event Venue is required',
    }),
  }),
  eventAddress: Joi.when('eventType', {
    is: 'Webinar',
    then: Joi.allow(null),
    otherwise: Joi.string().required().messages({
      'any.required': 'Event Address is required',
    }),
  }),
  webinarLink: Joi.when('eventType', {
    is: 'Webinar',
    then: Joi.string().required().messages({
      'any.required': 'Webinar Link is required',
    }),
    otherwise: Joi.allow(null),
  }),
  isRegistration: Joi.string().required().messages({
    'any.required': 'isRegistration is required',
  }),
  eventRegistrationFee: Joi.when('isRegistration', {
    is: 'Yes',
    then: Joi.number().required().messages({
      'any.required': 'eventRegistrationFee is required',
    }),
    otherwise: Joi.allow(null),
  }),
  eventRegistrationCloseDate: Joi.when('isRegistration', {
    is: 'Yes',
    then: Joi.date().required().messages({
      'any.required': 'eventRegistrationCloseDate is required',
    }),
    otherwise: Joi.allow(null),
  }),
  eventDescription: Joi.string().required().messages({
    'any.required': 'Event Description is required',
  }),
  eventFilePath: Joi.string().required().messages({
    'any.required': 'Event File Path  is required',
  }),
  user: Joi.number().required().messages({
    'any.required': 'userId is required',
  }),
  collegeOrUniversity: Joi.string().required().messages({
    'any.required': 'isRegistration is required',
  }),
  isVerified: Joi.number().required().messages({
    'any.required': 'isVerified is required',
  }),
  visibleTo: Joi.string().required().messages({
    'any.required': 'isVerified is required',
  }),
});