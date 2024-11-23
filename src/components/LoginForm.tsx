// src/components/LoginForm.tsx
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Paper, Box, Typography } from '@mui/material';
import { login, logout } from '../store/authSlice';
import { users } from '../data/mockData';

interface LoginFormInputs {
  username: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const onSubmit = (data: LoginFormInputs) => {
    const user = users.find(
      u => u.username === data.username && u.password === data.password
    );

    if (user) {
      if (user.status === 'INACTIVE') {
        alert('Your account is disabled. Contact admin');
        dispatch(logout());
        navigate('/');
        return;
      }
      dispatch(login(user));

      navigate('/dashboard');
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Paper elevation={3} className="p-8 max-w-md w-full">
        <Typography variant="h5" className="mb-4 text-center">
          RBAC: EMS Login
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            {...register('username', { required: 'Username is required' })}
            label="Username"
            variant="outlined"
            fullWidth
            margin="normal"
            error={!!errors.username}
            helperText={errors.username?.message}
          />
          <TextField
            {...register('password', { required: 'Password is required' })}
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            className="mt-4"
          >
            Login
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default LoginForm;