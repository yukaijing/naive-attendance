// src/pages/Register.js
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

function Register() {
  const [studentID, setStudentID] = useState('');

  const handleRegister = () => {
    // Implement registration logic here
    console.log('Registering student with ID:', studentID);
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Student Registration
      </Typography>
      <TextField
        label="Student ID"
        value={studentID}
        onChange={(e) => setStudentID(e.target.value)}
        variant="outlined"
        fullWidth
        margin="normal"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleRegister}
        fullWidth
      >
        Register
      </Button>
    </Container>
  );
}

export default Register;
