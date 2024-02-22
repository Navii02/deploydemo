
import { useContext } from 'react'
import { Route,Routes } from 'react-router-dom'
import Login from './components/student/studentlogin'
import Signup from './components/student/studentsignup'
import OfficerSignup from './components/officer/OfficerSignup'
import Officerlogin from './components/officer/Officerlogin'
import HomePage from './components/home'
import DataEditing from './components/officer/DataEditing'
import FeeReminders from './components/officer/FeeReminders'
import NoticeUpdates from './components/officer/NoticeUpdates'
import OfficeHome from './components/officer/OfficeHome'
import UserHome from './components/student/UserHome'
import Dashboard from './components/student/Dashboard'
import AboutUs from './components/student/AboutUs'
import ContactUs from './components/student/ContactUs'
import Certificates from './components/student/CertificateRequest'
import AdminPage from './components/officer/CertificateDistribution'
import FeeDetails from './components/student/FeeDetails'
import ScholarshipDetails from './components/student/ScholarshipDetails'
import AdminDashboard from './components/admin/AdminDashboard'
import FacultyHome from './components/faculty/FacultyHome'
import FaculitySignup from './components/faculty/faculitysignup'
import FaculityLogin from './components/faculty/faculitylogin'
import TutorHome from './components/tutor/TutorHome'
import HodHome from './components/hod/HodHome'
import PrinciHome from './components/principal/PrinciHome'
import { UserContext } from './App'
import PrincipalSignup from './components/principal/principalsignup'
import ClasstutorSignup from './components/tutor/classtututorsignup'
import ClasstutorLogin from './components/tutor/classtutorlogin'
import HodSignup from './components/hod/hodsignup'
import PrincipalLogin from './components/principal/principallogin'
import HodLogin from './components/hod/hodlogin'
import AdminSignup from './components/admin/AdminSignup'
import AdminLogin from './components/admin/AdminLogin'
import Reminders from './components/student/reminders'
import InternalMarksForm from './components/faculty/InternalMarksForm'
import AttendanceForm from './components/faculty/AttendanceForm'
import AssignmentForm from './components/faculty/AssignmentForm'
import CertificateRecieve from './components/student/CertificateRecieve'
import AdminOfficersPage from './components/admin/AdminOfficersPage'
import AdminTeachersPage from './components/admin/AdminTeachersPage'
import PaymentAndReminders from './components/officer/PaymentAndReminders'




function RoutesComp() {
  const userContext = useContext(UserContext)
  return (
    <>
      <Routes>
        {userContext.email && (
          <Route path='/' element={<>Welcome {userContext.email}</>} />
        )}
        {!userContext.email && (
          <>
            <Route path='/' element={<HomePage />} />  
            <Route path='/studentlogin' element={<Login />} />
            <Route path='/studentsignup' element={<Signup />} />
            <Route path='/officersignup' element={<OfficerSignup />} />
            <Route path='/officerlogin' element={<Officerlogin />} />
            <Route path='/faculitylogin' element={<FaculityLogin />} />
            <Route path='/faculitysignup' element={<FaculitySignup />} />
            <Route path='/classtutorlogin' element={<ClasstutorLogin />} />
            <Route path='/classtutorsignup' element={<ClasstutorSignup />} />
            <Route path='/adminlogin' element={<AdminLogin />} />
            <Route path='/adminsignup' element={<AdminSignup />} />
            <Route path='/hodlogin' element={<HodLogin />} />
            <Route path='/hodsignup' element={<HodSignup />} />
            <Route path="/office" element= {<OfficeHome/>}/>
            <Route path='/principallogin' element={<PrincipalLogin />} />
            <Route path='/principalsignup' element={<PrincipalSignup />} />
            <Route path="/data-editing" element={<DataEditing />} />
            <Route path="/fee-reminders" element={<FeeReminders />} />
            <Route path="/notice-updates" element={<NoticeUpdates />} />
            <Route path="/user" element={<UserHome />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/certificates-user" element={<Certificates />} />
            <Route path='/certificate-distribution' element={<AdminPage/>}/>
            <Route path='/fee-details' element ={<FeeDetails/>}/>
            <Route path='/scholarships' element ={<ScholarshipDetails/>}/>
            <Route path='/dash' element ={<AdminDashboard/>}/>
            <Route path='/fchome' element ={<FacultyHome/>}/>
            <Route path='/thome' element={<TutorHome/>}/>
            <Route path='/hodhome' element={<HodHome/>}/>
            <Route path='/phome' element={<PrinciHome/>}/>
            <Route path='/rem' element={<Reminders/>}/>
            <Route path='/int' element={<InternalMarksForm/>}/>
            <Route path='/att' element={<AttendanceForm/>}/>
            <Route path='/ast' element={<AssignmentForm/>}/>
            <Route path='/cert' element={<CertificateRecieve/>}/>
            <Route path='/officer-details' element={<AdminOfficersPage/>}/> 
            <Route path='/teacher-details' element={<AdminTeachersPage/>}/> 
            <Route path='/payment' element={<PaymentAndReminders/>}/> 
          </>
        )}
      </Routes>
    </>
  )
}

export default RoutesComp