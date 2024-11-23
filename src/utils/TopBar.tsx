import { Button, Stack, Typography } from "@mui/material";
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { useNavigate } from "react-router-dom";


const TopBar: React.FC<{ heading: string }> = ({heading}) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    return (
        <Stack spacing={2} direction='row' sx={{ width: '100%', mb: '5' }} className="flex flex-row justify-between">
            <Typography variant="h4" sx={{ color: 'black', mb: 2 }}>
                {heading}
            </Typography>
            <Button 
                color="error"
                variant="outlined"
                onClick={handleLogout}
            >
                Logout
            </Button>
        </Stack>
    );
}

export default TopBar;