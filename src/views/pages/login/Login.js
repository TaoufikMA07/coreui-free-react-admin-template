import React, { useEffect, useState } from 'react'; // Add these imports
import { Link } from 'react-router-dom'; // Add Redirect import
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilUser } from '@coreui/icons';

const Login = () => {
  const [login, setEditedlogin] = useState(
    {
    email: '',
    password: ''
  }
);

  const Verify = async () => {
    try {
      const response = await fetch(`http://localhost:8080/users/login_admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(login)
      });
      if (response.ok) {
        const data = await response.text();
        if (data=='sucess'){
          console.log('sussess');
          window.location.replace('http://localhost:3000/#/dashboard');

        }
      } else {
        console.log('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding train:', error);
    }
  };
  

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <h1>Login</h1>
                    <p className="text-body-secondary">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput placeholder="Username" autoComplete="username" onChange={e => setEditedlogin({...login, email: e.target.value})} />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        onChange={e => setEditedlogin({...login, password: e.target.value})}
                      />
                    </CInputGroup>
                    <CRow>
                        <CButton color="primary" className="px-4" onClick={Verify}> {/* Call Verify function on button click */}
                          Login
                        </CButton>
                    
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login;
