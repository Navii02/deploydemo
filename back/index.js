const express =require('express');
const session = require('express-session')
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
require('dotenv').config()
const mongoose = require('mongoose')
const MongoDBStore = require('connect-mongodb-session')(session) 






const StudentData = require('./api/student/studentData')
const CertificateUser=require('./api/student/usercertificaterequest')
const loginRouter = require('./api/student/studentRoutes')
const Dashboard=require('./api/student/studentdashboard')
const studentForget=require('./api/student/studentForgot')


const Notice = require('./api/officer/Notice')
const OfficerRoutes = require('./api/officer/OfficerRoutes')
const certificate = require('./api/officer/certificate')
const StudentAdmission =require('./api/officer/StudentAdmission');
const officerForget=require('./api/officer/officerForgot')
const aprrovedLists = require('./api/officer/approvedandremovedlist')


const FaculityRoutes = require('./api/faculity/faculityRoutes')
const FacultyProfile=require('./api/faculity/faculityhome')
const FaculityForget=require('./api/faculity/FaculityForgot')
const AssigmentNotification =require('./api/faculity/Assignmentnotification');


const HodRoutes = require('./api/hod/HodRoutes')
const hodForget=require('./api/hod/hodForgot')
const hodcertificaterequest=require('./api/hod/Hodcertificaterequest');


const tutorForget=require('./api/tutor/tutorForgot')
const classtutorRoutes = require('./api/tutor/classtutorroutes')


const PrincipalRoutes = require('./api/principal/PrincipalRoutes')
const principalForget=require('./api/principal/principalForgot')
const pstudents=require('./api/principal/StudentList')
const pTeachers=require('./api/principal/TeacherList')
const pofficers=require('./api/principal/OfficerList')

const adminRouter = require('./api/Admin/AdminRoutes')
const TeachersDetail=require('./api/hod/TeachersDetails')
const OfficerDetail=require('./api/Admin/OfficerDetails')
const AdminForget=require('./api/Admin/AdminForgot')


const Feereminder = require('./api/feereminder')


const app = express();
const MAX_AGE = 1000 * 60 * 60 * 3 //3hrs
const corsOptions = {
  origin: 'http://localhost:3000',
  optionSuccessStatus:200,
}
mongoose.Promise = global.Promise
mongoose.connect(process.env.DATABASE_CONNECTION_STRING, {
  useNewUrlParser: true,

});



// setting up connect-mongodb-session store
const mongoDBstore = new MongoDBStore({
    uri: process.env.DATABASE_CONNECTION_STRING,
    
    
    
  })
  console.log("mongo is connected");
  app.use(
    session({
      secret: 'a1s2d3f4g5h6',
      name: 'session-id', // cookies name to be put in "key" field in postman
      store: mongoDBstore,
      cookie: {
        maxAge: MAX_AGE, // this is when our cookies will expired and the session will not be valid anymore (user will be log out)
        sameSite: false,
        secure: false, // to turn on just in production
      },
      resave: true,
      saveUninitialized: false,
    })
  )
  


app.use(bodyParser.json())
app.use(cors(corsOptions))



app.use('/api',loginRouter)
app.use('/api',adminRouter)
app.use('/api',OfficerRoutes)
app.use('/api',HodRoutes)
app.use('/api',PrincipalRoutes)
app.use('/api',FaculityRoutes)
app.use('/api',classtutorRoutes)

app.use('/api',StudentData)
app.use('/api',Notice)
app.use('/api',CertificateUser)
app.use('/api',Feereminder)
app.use('/api',Dashboard)

app.use('/api',certificate)
app.use('/api',TeachersDetail)
app.use('/api',OfficerDetail)
app.use('/api',FacultyProfile)
app.use('/api',AdminForget)
app.use('/api',FaculityForget)
app.use('/api',hodForget)
app.use('/api',officerForget)
app.use('/api',principalForget)
app.use('/api',studentForget)
app.use('/api',tutorForget)
app.use('/api',hodcertificaterequest)
app.use('/api',AssigmentNotification)
app.use('/api',StudentAdmission)
app.use('/api',pstudents)
app.use('/api',pTeachers)
app.use('/api',pofficers)
app.use('/api',aprrovedLists)

app.use('/uploads', express.static('uploads'));
app.use('/certificate', express.static('certificate'));
app.use('/studentsphoto', express.static('StudentsPhoto'));

// Serve the images
app.use('/images', express.static(path.join(__dirname, 'uploads'), {
  fallthrough: false,
  setHeaders: (res, filePath) => {
    if (!filePath.includes('.jpg') && !filePath.includes('.jpeg') && !filePath.includes('.png') && !filePath.includes('.gif')) {
      res.setHeader('Content-Type', 'application/json');
      res.status(404).json({ error: 'Image not found' });
    }
  },
}));


app.use('/api', express.static('certificate'));

app.listen(5000, function() {
  console.log("connected to server")
});
module.exports =app
