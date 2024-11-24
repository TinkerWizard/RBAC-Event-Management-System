import { Button, Stack, Typography, useTheme, useMediaQuery } from "@mui/material";
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { useNavigate } from "react-router-dom";

const TopBar: React.FC<{ heading: string }> = ({ heading }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    return (
        <Stack 
            direction="row" 
            sx={{
                width: '100%',
                mb: { xs: 2, sm: 3, md: 4 },
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: { xs: 1, sm: 2 }
            }}
        >
            {/* Responsive Typography */}
            <Typography 
                variant={isMobile ? "h5" : "h4"} 
                sx={{
                    color: 'black',
                    fontSize: {
                        xs: '1.5rem',
                        sm: '2rem',
                        md: '2.25rem'
                    },
                    mb: { xs: 1, sm: 0 }
                }}
            >
                {heading}
            </Typography>
            
            {/* Responsive MUI Button */}
            <Button
                color="error"
                variant="outlined"
                onClick={handleLogout}
                sx={{
                    minWidth: { xs: '80px', sm: '100px' },
                    height: { xs: '36px', sm: '40px' },
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    px: { xs: 2, sm: 3 }
                }}
            >
                Logout
            </Button>
        </Stack>
    );
}

export default TopBar;
