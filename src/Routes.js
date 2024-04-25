

import { Route,Routes } from 'react-router-dom'

import HomePage from './components/home'

import Login from './components/student/studentlogin'
import Signup from './components/student/studentsignup'
import UserHome from './components/student/UserHome'
import Dashboard from './components/student/Dashboard'
import AboutUs from './components/student/AboutUs'
import ContactUs from './components/student/ContactUs'
import Certificates from './components/student/CertificateRequest'
import FeeDetails from './components/student/FeeDetails'
import ScholarshipDetails from './components/student/ScholarshipDetails'
import Reminders from './components/student/reminders'
import CertificateRecieve from './components/student/CertificateRecieve'
import SForgotPassword from './components/student/StudentForgot'


import OfficerSignup from './components/officer/OfficerSignup'
import Officerlogin from './components/officer/Officerlogin'
import DataEntryForm from './components/officer/DataEditing'
import DataViewEdit from './components/officer/DataTable'
import FeeReminders from './components/officer/FeeReminders'
import NoticeUpdates from './components/officer/NoticeUpdates'
import OfficeHome from './components/officer/OfficeHome'
import PaymentAndReminders from './components/officer/PaymentAndReminders'
import OForgotPassword from './components/officer/OfficerForgot'
import CertificateDistribution from './components/officer/CertificateDistribution'
import ApprovedAndRemoved from './components/officer/ApprovedAndRemoved'
import FeePayment from './components/officer/FeePayment'
import StudentListPage from './components/officer/StudentList'

import AdminDashboard from './components/admin/AdminDashboard'
import AForgotPassword from './components/admin/AdminForgot'
import AdminSignup from './components/admin/AdminSignup'
import AdminLogin from './components/admin/AdminLogin'
import AdminOfficersPage from './components/admin/AdminOfficersPage'
import AdminTeachersPage from './components/hod/AdminTeachersPage'
import AssignTutor from './components/hod/Assigntutor'


import FacultyHome from './components/faculty/FacultyHome'
import FaculitySignup from './components/faculty/faculitysignup'
import FaculityLogin from './components/faculty/faculitylogin'
import InternalMarksForm from './components/faculty/InternalMarksForm'
import AttendanceForm from './components/faculty/AttendanceForm'
import AssignmentForm from './components/faculty/AssignmentForm'
import FForgotPassword from './components/faculty/FacultyForgot'


import TutorHome from './components/tutor/TutorHome'
import ClasstutorSignup from './components/tutor/classtututorsignup'
import ClasstutorLogin from './components/tutor/classtutorlogin'
import TForgotPassword from './components/tutor/TutorForgot'
import Tutorstudentlist from './components/tutor/tutorstudentlist'
import StudentPerformancePage from './components/tutor/Performance'
import TutorUpdates from './components/tutor/Updates'

import HodHome from './components/hod/HodHome'
import HodSignup from './components/hod/hodsignup'
import HodLogin from './components/hod/hodlogin'
import HForgotPassword from './components/hod/hodForgot'
import CertificateApproval from './components/hod/CertificateApproval'
import HStudenlist from './components/hod/studenlisthod'
import HodStudenlist from './components/hod/HstudentsDetails'
import SubjectAdd from './components/hod/SubjectAddition'

import PrinciHome from './components/principal/PrinciHome'
import PrincipalSignup from './components/principal/principalsignup'
import PrincipalLogin from './components/principal/principallogin'
import PForgotPassword from './components/principal/PrinciForgot'
import Pstudents from './components/principal/StudentsList'
import Pteachers from './components/principal/TeachersList'
import Pofficers from './components/principal/OfficersList'
import Hodassign from './components/principal/hodassign'







function RoutesComp() {

  return (
    <>
      <Routes>
       
            <Route path='/' element={<HomePage />} />  
            <Route path='/studentlogin' element={<Login />} />
            <Route path='/studentsignup' element={<Signup />} />
            <Route path='/officersignup' element={<OfficerSignup />} />
            <Route path='/officerlogin' element={<Officerlogin />} />
            <Route path='/facultylogin' element={<FaculityLogin />} />
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
            <Route path="/data-editing" element={<DataEntryForm />} />
            <Route path="/data-table" element={<DataViewEdit/>} />
            <Route path="/fee-reminders" element={<FeeReminders />} />
            <Route path="/notice-updates" element={<NoticeUpdates />} />
            <Route path="/user" element={<UserHome />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/certificates-user" element={<Certificates />} />
            <Route path='/certificate-distribution' element={<CertificateDistribution/>}/>
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
            <Route path='/aforgot' element={<AForgotPassword/>}/>
            <Route path='/fforgot' element={<FForgotPassword/>}/>
            <Route path='/hforgot' element={<HForgotPassword/>}/>
            <Route path='/oforgot' element={<OForgotPassword/>}/>
            <Route path='/pforgot' element={<PForgotPassword/>}/>
            <Route path='/sforgot' element={<SForgotPassword/>}/>
            <Route path='/tforgot' element={<TForgotPassword/>}/>
            <Route path='/certificate-approval' element={<CertificateApproval/>}/>
            <Route path='/ar' element={<ApprovedAndRemoved/>}/>
            <Route path='/pstudents' element={<Pstudents/>}/>
            <Route path='/pteachers' element={<Pteachers/>}/>
            <Route path='/pOffice' element={<Pofficers/>}/>
            <Route path='/hodstudents' element={<HStudenlist/>}/>
            <Route path='/hodassign' element={<Hodassign/>}/>
            <Route path='/hstudents' element={<HodStudenlist/>}/>
            <Route path='/feepayment' element={<FeePayment/>}/>
            <Route path='/subject' element={<SubjectAdd/>}/>
            <Route path='/asigntutor' element={<AssignTutor/>}/>
            <Route path='/tstudents' element={<Tutorstudentlist/>}/>
            <Route path='/sdata' element={<StudentListPage/>}/>
            <Route path='/perf' element={<StudentPerformancePage/>}/>  
            <Route path='/upd' element={<TutorUpdates/>}/>      
      </Routes>
    </>
  )
}

export default RoutesComp