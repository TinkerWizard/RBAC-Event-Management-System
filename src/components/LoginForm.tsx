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
  Alert
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
        bgcolor: 'background.default'
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 400,
          mx: 2
        }}
      >
        <Typography 
          variant="h4" 
          component="h1" 
          align="center" 
          gutterBottom
          color="primary"
        >
          RBAC: EMS Login
        </Typography>
        
        <Typography 
          variant="h6" 
          component="h2" 
          align="center" 
          gutterBottom
          color="text.secondary"
        >
          Login
        </Typography>

        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 2 }}
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
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            sx={{ mt: 2 }}
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