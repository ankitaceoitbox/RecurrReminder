import './App.css';
import ContactPage from './smart_components/Contact';
import { ToastContainer } from 'react-toastify';
import { Routes, Route, Navigate } from 'react-router-dom';
import AllFormDataSmart from './smart_components/AllFormData';
import LoginForm from './components/login';
import RegistrationForm from './components/registration';
import Protected from './components/privateroute';
import AuthenticateProtected from './components/authenticateprotected';
import SideNavBar from './components/sidenavbar';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for styling
import { Grid } from '@mui/material';
import ForgetPassword from './components/forgetpassword';
import AdminProtected from './components/adminprotectedroute';
import AdminUsersData from './components/admin.userdata';

function App() {
  return (
    <>
      <Grid container>
        <Grid item sm={0.3}>
          <SideNavBar />
        </Grid>
        <Grid item sm={11.7} xs={11}>
          <Routes>
            <Route
              path="/allforms"
              element={
                <Protected>
                  <AllFormDataSmart />
                </Protected>
              }
            />
            <Route
              path="/"
              element={
                <Protected>
                  <ContactPage />
                </Protected>
              }
            />
            <Route
              path="/login"
              element={<AuthenticateProtected>
                <LoginForm />
              </AuthenticateProtected>}
            />
            <Route
              path="/register"
              element={<AuthenticateProtected>
                <RegistrationForm />
              </AuthenticateProtected>}
            />
            <Route
              path="/reset-password/:token?"
              element={<AuthenticateProtected>
                <ForgetPassword />
              </AuthenticateProtected>}
            />
            <Route
              path="/admin/userdata"
              element={<Protected admin={true}>
                <AdminUsersData />
              </Protected>}
            />
          </Routes>
        </Grid>
        <ToastContainer />
      </Grid>
    </>
  );
}

export default App;
