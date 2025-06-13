import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  Box,
  Container,
  TextField,
  List,
  ListItem,
  ListItemText,
  Typography,
  Paper,
  CircularProgress,
  Avatar,
  ListItemAvatar,
  Divider,
  Chip,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openNotFoundDialog, setOpenNotFoundDialog] = useState(false);
  const [notFoundTimeout, setNotFoundTimeout] = useState(null);
  const dropdownRef = useRef(null);

  const debounce = (func, delay) => {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => func.apply(this, args), delay);
    };
  };

  const searchStudents = async (query) => {
    if (query.length < 3) {
      setSearchResults([]);
      setIsDropdownOpen(false);
      setSelectedStudent(null);
      clearTimeout(notFoundTimeout);
      return;
    }

    setLoading(true);
    clearTimeout(notFoundTimeout);

    try {
      const response = await axios.get(`http://localhost:student-search-app-fbue.vercel.app
/api/students/search`, {
        params: { query }
      });

      setSearchResults(response.data);
      setIsDropdownOpen(response.data.length > 0);

      if (response.data.length === 0) {
        const timeout = setTimeout(() => {
          setOpenNotFoundDialog(true);
        }, 1200);
        setNotFoundTimeout(timeout);
      }
    } catch (error) {
      console.error('Error searching students:', error);
      setSearchResults([]);
      setIsDropdownOpen(false);
      setOpenNotFoundDialog(true);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = debounce(searchStudents, 300);

  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    setSearchQuery(student.name);
    setIsDropdownOpen(false);
  };

  const handleClearSearch = () => {
    clearTimeout(notFoundTimeout);
    setSearchQuery('');
    setSearchResults([]);
    setIsDropdownOpen(false);
    setSelectedStudent(null);
    setOpenNotFoundDialog(false);
  };

  const handleCloseNotFoundDialog = () => {
    clearTimeout(notFoundTimeout);
    setOpenNotFoundDialog(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const stringToColor = (string) => {
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold' }}>
          Student Search
        </Typography>

        <Box sx={{ position: 'relative' }} ref={dropdownRef}>
          <TextField
            fullWidth
            variant="outlined"
            value={searchQuery}
            onChange={handleInputChange}
            placeholder="Search for students (min 3 characters)..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  {searchQuery && (
                    <IconButton onClick={handleClearSearch} size="small">
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  )}
                  {loading && <CircularProgress size={24} sx={{ ml: 1 }} />}
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: '#f5f5f5',
              },
            }}
          />

          {isDropdownOpen && (
            <Paper
              elevation={4}
              sx={{
                position: 'absolute',
                width: '100%',
                maxHeight: 300,
                overflow: 'auto',
                mt: 1,
                zIndex: 1,
                borderRadius: 2,
              }}
            >
              <List>
                {searchResults.map((student) => (
                  <React.Fragment key={student.rollNumber}>
                    <ListItem
                      button
                      onClick={() => handleStudentSelect(student)}
                      sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: stringToColor(student.name) }}>
                          {student.name.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={student.name}
                        secondary={`Class ${student.class} | Roll No: ${student.rollNumber}`}
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          )}
        </Box>

        {selectedStudent && (
          <Paper elevation={2} sx={{ p: 3, mt: 4, borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'medium' }}>
              Student Details
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: stringToColor(selectedStudent.name),
                  fontSize: '2rem',
                  mr: 3,
                }}
              >
                {selectedStudent.name.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {selectedStudent.name}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  <Chip
                    label={`Class: ${selectedStudent.class}`}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                  <Chip
                    label={`Roll No: ${selectedStudent.rollNumber}`}
                    color="secondary"
                    variant="outlined"
                    size="small"
                  />
                </Box>
              </Box>
            </Box>
          </Paper>
        )}
      </Paper>

      <Dialog
        open={openNotFoundDialog}
        onClose={handleCloseNotFoundDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" sx={{ textAlign: 'center' }}>
          <SentimentDissatisfiedIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h6">Student Not Found</Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" sx={{ textAlign: 'center' }}>
            No students found matching "{searchQuery}".<br />Please try a different search term.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button onClick={handleCloseNotFoundDialog} variant="contained" color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default App;
