import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Paper,
  Box,
  Typography,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { login, logout } from '../store/authSlice';
import { RootState } from '../store/store';

interface LoginFormInputs {
  username: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const users = useSelector((state: RootState) => state.users.users);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormInputs>();
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data: LoginFormInputs) => {
    setIsLoading(true);
    setError('');
    
    try {
      const user = users.find(
        u => u.username === data.username && u.password === data.password
      );
      
      if (user) {
        if (user.status === 'INACTIVE') {
          setError('Your account is disabled. Please contact admin.');
          dispatch(logout());
          return;
        }
        
        dispatch(login(user));
        navigate('/dashboard');
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('An error occurred during login');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default',
        padding: theme.spacing(2)
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, sm: 3, md: 4 }, // Responsive padding
          width: '100%',
          maxWidth: { xs: '100%', sm: '400px' }, // Full width on mobile, max-width on larger screens
          mx: 'auto'
        }}
      >
        <Typography
          variant={isMobile ? "h5" : "h4"}
          component="h1"
          align="center"
          gutterBottom
          color="primary"
          sx={{
            fontSize: { xs: '1.5rem', sm: '2rem' }, // Responsive font size
            mb: { xs: 1, sm: 2 } // Responsive margin
          }}
        >
          RBAC: EMS Login
        </Typography>
        
        <Typography
          variant={isMobile ? "subtitle1" : "h6"}
          component="h2"
          align="center"
          gutterBottom
          color="text.secondary"
          sx={{
            mb: { xs: 2, sm: 3 } // Responsive margin
          }}
        >
          Login
        </Typography>

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 2,
              fontSize: { xs: '0.875rem', sm: '1rem' } // Responsive font size
            }}
            onClose={() => setError('')}
          >
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            {...register('username', {
              required: 'Username is required'
            })}
            label="Username"
            variant="outlined"
            fullWidth
            margin="normal"
            error={!!errors.username}
            helperText={errors.username?.message}
            disabled={isLoading}
            sx={{
              mb: { xs: 1.5, sm: 2 }, // Responsive margin
              '& .MuiInputLabel-root': {
                fontSize: { xs: '0.875rem', sm: '1rem' } // Responsive label
              },
              '& .MuiInputBase-input': {
                fontSize: { xs: '0.875rem', sm: '1rem' }, // Responsive input
                padding: { xs: '12px', sm: '14px' } // Responsive padding
              }
            }}
          />

          <TextField
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 4,
                message: 'Password must be at least 4 characters'
              }
            })}
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            error={!!errors.password}
            helperText={errors.password?.message}
            disabled={isLoading}
            sx={{
              mb: { xs: 2, sm: 3 }, // Responsive margin
              '& .MuiInputLabel-root': {
                fontSize: { xs: '0.875rem', sm: '1rem' } // Responsive label
              },
              '& .MuiInputBase-input': {
                fontSize: { xs: '0.875rem', sm: '1rem' }, // Responsive input
                padding: { xs: '12px', sm: '14px' } // Responsive padding
              }
            }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size={isMobile ? "medium" : "large"}
            sx={{
              mt: { xs: 1, sm: 2 }, // Responsive margin
              py: { xs: 1.5, sm: 2 }, // Responsive padding
              fontSize: { xs: '0.875rem', sm: '1rem' } // Responsive font size
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Login'
            )}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default LoginForm;