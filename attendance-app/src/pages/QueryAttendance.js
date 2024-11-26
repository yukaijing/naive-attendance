// src/pages/QueryAttendance.js
import React, { useState } from 'react';
import {
  TextField,
  Button,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import axios from 'axios';

function QueryAttendance() {
  const [studentID, setStudentID] = useState('');
  const [eventID, setEventID] = useState('');
  const [attendanceRecords, setAttendanceRecords] = useState([]);

  const handleQuery = async () => {
    try {
      const response = await axios.get('/api/query-attendance', {
        params: {
          studentID: studentID || undefined,
          eventID: eventID || undefined,
        },
      });
      setAttendanceRecords(response.data);
    } catch (error) {
      console.error('Error fetching attendance records:', error);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Query Attendance Records
      </Typography>
      <TextField
        label="Student ID"
        value={studentID}
        onChange={(e) => setStudentID(e.target.value)}
        variant="outlined"
        fullWidth
        margin="normal"
      />
      <TextField
        label="Event ID"
        value={eventID}
        onChange={(e) => setEventID(e.target.value)}
        variant="outlined"
        fullWidth
        margin="normal"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleQuery}
        fullWidth
        style={{ marginTop: '16px' }}
      >
        Search
      </Button>

      {attendanceRecords.length > 0 && (
  <TableContainer component={Paper} style={{ marginTop: '32px' }}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Student ID</TableCell>
          <TableCell>Event ID</TableCell>
          <TableCell>Timestamp</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {attendanceRecords.map((record, index) => (
          <TableRow key={index}>
            <TableCell>{record.studentID}</TableCell>
            <TableCell>{record.eventID}</TableCell>
            <TableCell>{new Date(record.timestamp).toLocaleString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
)}
    </Container>
  );
}

export default QueryAttendance;
