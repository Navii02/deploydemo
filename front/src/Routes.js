import { Route, Routes } from 'react-router-dom';

import HomePage from './components/home';
import Login from './components/student/studentlogin';
import Signup from './components/student/studentsignup';
import UserHome from './components/student/UserHome';
import Dashboard from './components/student/Dashboard';
import AboutUs from './components/student/AboutUs';
import ContactUs from './components/student/ContactUs';
import Certificates from './components/student/CertificateRequest';
import FeeDetails from './components/student/FeeDetails';
import ScholarshipDetails from './components/student/ScholarshipDetails';
import Reminders from './components/student/reminders';
import CertificateRecieve from './components/student/CertificateRecieve';
import SForgotPassword from './components/student/StudentForgot';
import Admission from './components/officer/AdmissionPage';

import OfficerSignup from './components/officer/OfficerSignup';
import Officerlogin from './components/officer/Officerlogin';
import DataEntryForm from './components/officer/DataEditing';
import DataViewEdit from './components/officer/DataTable';
import FeeReminders from './components/officer/FeeReminders';
import NoticeUpdates from './components/officer/NoticeUpdates';
import OfficeHome from './components/officer/OfficeHome';
import PaymentAndReminders from './components/officer/PaymentAndReminders';
import OForgotPassword from './components/officer/OfficerForgot';
import CertificateDistribution from './components/officer/CertificateDistribution';
import ApprovedAndRemoved from './components/officer/ApprovedAndRemoved';
import FeePayment from './components/officer/FeePayment';
import StudentListPage from './components/officer/StudentList';
import AdmissionFeeDetails  from './components/officer/FeeDetails';

import AdminDashboard from './components/admin/AdminDashboard';
import AForgotPassword from './components/admin/AdminForgot';
import AdminSignup from './components/admin/AdminSignup';
import AdminLogin from './components/admin/AdminLogin';
import AdminOfficersPage from './components/admin/AdminOfficersPage';
import AdminTeachersPage from './components/hod/AdminTeachersPage';
import AssignTutor from './components/hod/Assigntutor';

import FacultyHome from './components/faculty/FacultyHome';
import FaculitySignup from './components/faculty/faculitysignup';
import FaculityLogin from './components/faculty/faculitylogin';
import InternalMarksForm from './components/faculty/InternalMarksForm';
import AttendanceForm from './components/faculty/AttendanceForm';
import AssignmentForm from './components/faculty/AssignmentForm';
import FForgotPassword from './components/faculty/FacultyForgot';
import AttendanceTable from './components/faculty/AttendanceTable';

import TutorHome from './components/tutor/TutorHome';
import ClasstutorSignup from './components/tutor/classtututorsignup';
import ClasstutorLogin from './components/tutor/classtutorlogin';
import TForgotPassword from './components/tutor/TutorForgot';
import Tutorstudentlist from './components/tutor/tutorstudentlist';
import StudentPerformancePage from './components/tutor/Performance';
import TutorUpdates from './components/tutor/Updates';

import HodHome from './components/hod/HodHome';
import HodSignup from './components/hod/hodsignup';
import HodLogin from './components/hod/hodlogin';
import HForgotPassword from './components/hod/hodForgot';
import CertificateApproval from './components/hod/CertificateApproval';
import HodStudenlist from './components/hod/HstudentsDetails';
import SubjectAdd from './components/hod/SubjectAddition';
import HodPerformancePage from './components/hod/HodPerformance';

import PrinciHome from './components/principal/PrinciHome';
import PrincipalSignup from './components/principal/principalsignup';
import PrincipalLogin from './components/principal/principallogin';
import PForgotPassword from './components/principal/PrinciForgot';
import Pstudents from './components/principal/StudentsList';
import Pteachers from './components/principal/TeachersList';
import Pofficers from './components/principal/OfficersList';
import Hodassign from './components/principal/hodassign';
import SRequests from './components/principal/StudentRequest';

import PrivateRoute from './ProtectedRoutes'; // Import the PrivateRoute component

function RoutesComp() {
  return (
    <>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/studentlogin' element={<Login />} />
        <Route path='/studentsignup' element={<Signup />} />
        <Route
          path='/user'
          element={
            <PrivateRoute>
              <UserHome />
            </PrivateRoute>
          }
        />
        <Route
          path='/dashboard'
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path='/about-us'
          element={
            <PrivateRoute>
              <AboutUs />
            </PrivateRoute>
          }
        />
        <Route
          path='/contact'
          element={
            <PrivateRoute>
              <ContactUs />
            </PrivateRoute>
          }
        />
        <Route
          path='/certificates-user'
          element={
            <PrivateRoute>
              <Certificates />
            </PrivateRoute>
          }
        />
        <Route
          path='/certificate-distribution'
          element={
            <PrivateRoute>
              <CertificateDistribution />
            </PrivateRoute>
          }
        />
        <Route
          path='/fee-details'
          element={
            <PrivateRoute>
              <FeeDetails />
            </PrivateRoute>
          }
        />
        <Route
          path='/scholarships'
          element={
            <PrivateRoute>
              <ScholarshipDetails />
            </PrivateRoute>
          }
        />
        <Route
          path='/rem'
          element={
            <PrivateRoute>
              <Reminders />
            </PrivateRoute>
          }
        />
        <Route
          path='/cert'
          element={
            <PrivateRoute>
              <CertificateRecieve />
            </PrivateRoute>
          }
        />
        <Route path='/sforgot' element={<SForgotPassword />} />

        {/* Officer Routes */}
        <Route path='/officersignup' element={<OfficerSignup />} />
        <Route path='/officerlogin' element={<Officerlogin />} />
        <Route
          path='/office'
          element={
            <PrivateRoute>
              <OfficeHome />
            </PrivateRoute>
          }
        />
        <Route
          path='/data-editing'
          element={
            <PrivateRoute>
              <DataEntryForm />
            </PrivateRoute>
          }
        />
        <Route
          path='/data-table'
          element={
            <PrivateRoute>
              <DataViewEdit />
            </PrivateRoute>
          }
        />
        <Route
          path='/fee-reminders'
          element={
            <PrivateRoute>
              <FeeReminders />
            </PrivateRoute>
          }
        />
        <Route
          path='/notice-updates'
          element={
            <PrivateRoute>
              <NoticeUpdates />
            </PrivateRoute>
          }
        />
        <Route path='/oforgot' element={<OForgotPassword />} />
        <Route
          path='/payment'
          element={
            <PrivateRoute>
              <PaymentAndReminders />
            </PrivateRoute>
          }
        />
        <Route
          path='/certificate-distribution'
          element={
            <PrivateRoute>
              <CertificateDistribution />
            </PrivateRoute>
          }
        />
        <Route
          path='/ar'
          element={
            <PrivateRoute>
              <ApprovedAndRemoved />
            </PrivateRoute>
          }
        />
        <Route
          path='/feepayment'
          element={
            <PrivateRoute>
              <FeePayment />
            </PrivateRoute>
          }
        />
         <Route
          path='/feeDetails'
          element={
            <PrivateRoute>
              <AdmissionFeeDetails/>
            </PrivateRoute>
          }
        />
        <Route
          path='/sdata'
          element={
            <PrivateRoute>
              <StudentListPage />
            </PrivateRoute>
          }
        />

        {/* Admin Routes */}
      <Route path='/admission'element={<Admission />}/>
        <Route path='/adminlogin' element={<AdminLogin />} />
        <Route path='/adminsignup' element={<AdminSignup />} />
        <Route
          path='/dash'
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path='/officer-details'
          element={
            <PrivateRoute>
              <AdminOfficersPage />
            </PrivateRoute>
          }
        />
        <Route path='/aforgot' element={<AForgotPassword />} />

        {/* Faculty Routes */}
        <Route path='/faculitysignup' element={<FaculitySignup />} />
        <Route path='/facultylogin' element={<FaculityLogin />} />
        <Route
          path='/fchome'
          element={
            <PrivateRoute>
              <FacultyHome />
            </PrivateRoute>
          }
        />
        <Route
          path='/int'
          element={
            <PrivateRoute>
              <InternalMarksForm />
            </PrivateRoute>
          }
        />
        <Route
          path='/att'
          element={
            <PrivateRoute>
              <AttendanceForm />
            </PrivateRoute>
          }
        />
        <Route
          path='/ast'
          element={
            <PrivateRoute>
              <AssignmentForm />
            </PrivateRoute>
          }
        />
        <Route path='/fforgot' element={<FForgotPassword />} />
        <Route
          path='/att-table'
          element={
            <PrivateRoute>
              <AttendanceTable />
            </PrivateRoute>
          }
        />

        {/* Tutor Routes */}
        <Route path='/classtutorlogin' element={<ClasstutorLogin />} />
        <Route path='/classtutorsignup' element={<ClasstutorSignup />} />
        <Route
          path='/thome'
          element={
            <PrivateRoute>
              <TutorHome />
            </PrivateRoute>
          }
        />
        <Route
          path='/tstudents'
          element={
            <PrivateRoute>
              <Tutorstudentlist />
            </PrivateRoute>
          }
        />
        <Route
          path='/perf'
          element={
            <PrivateRoute>
              <StudentPerformancePage />
            </PrivateRoute>
          }
        />
        <Route
          path='/upd'
          element={
            <PrivateRoute>
              <TutorUpdates />
            </PrivateRoute>
          }
        />
        <Route path='/tforgot' element={<TForgotPassword />} />

        {/* HOD Routes */}
        <Route path='/hodlogin' element={<HodLogin />} />
        <Route path='/hodsignup' element={<HodSignup />} />
        <Route
          path='/hodhome'
          element={
            <PrivateRoute>
              <HodHome />
            </PrivateRoute>
          }
        />
        <Route
          path='/certificate-approval'
          element={
            <PrivateRoute>
              <CertificateApproval />
            </PrivateRoute>
          }
        />
        <Route
          path='/hstudents'
          element={
            <PrivateRoute>
              <HodStudenlist />
            </PrivateRoute>
          }
        />
        <Route
          path='/subject'
          element={
            <PrivateRoute>
              <SubjectAdd />
            </PrivateRoute>
          }
        />
        <Route
          path='/hperf'
          element={
            <PrivateRoute>
              <HodPerformancePage />
            </PrivateRoute>
          }
        />
           <Route
          path='/teacher-details'
          element={
            <PrivateRoute>
              <AdminTeachersPage/>
            </PrivateRoute>
          }
        />
           <Route
          path='/asigntutor'
          element={
            <PrivateRoute>
              <AssignTutor/>
            </PrivateRoute>
          }
        />
        <Route path='/hforgot' element={<HForgotPassword />} />

        {/* Principal Routes */}
        <Route path='/principallogin' element={<PrincipalLogin />} />
        <Route path='/principalsignup' element={<PrincipalSignup />} />
        <Route
          path='/phome'
          element={
            <PrivateRoute>
              <PrinciHome />
            </PrivateRoute>
          }
        />
        <Route
          path='/pstudents'
          element={
            <PrivateRoute>
              <Pstudents />
            </PrivateRoute>
          }
        />
        <Route
          path='/pteachers'
          element={
            <PrivateRoute>
              <Pteachers />
            </PrivateRoute>
          }
        />
        <Route
          path='/pOffice'
          element={
            <PrivateRoute>
              <Pofficers />
            </PrivateRoute>
          }
        />
        <Route
          path='/hodassign'
          element={
            <PrivateRoute>
              <Hodassign />
            </PrivateRoute>
          }
        />
        <Route
          path='/srequests'
          element={
            <PrivateRoute>
              <SRequests />
            </PrivateRoute>
          }
        />
        <Route path='/pforgot' element={<PForgotPassword />} />
      </Routes>
    </>
  );
}

export default RoutesComp;
