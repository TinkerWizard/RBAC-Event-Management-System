import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
} from '@mui/material';
import {
  Users,
  UserCheck,
  Calendar,
  CalendarCheck,
  UserX,
  Shield
} from 'lucide-react';
import { dashboardStats } from '../../data/mockData';
import { DashboardStats } from '../../types';
import RoleManagement from './RoleManagement';
import UserManagement from './UserManagement';
import TopBar from '../../utils/TopBar';
import EventManagement from '../events/EventManagement';
import EventList from '../EventList';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

const StatCard: React.FC<{
  title: string;
  value: number;
  Icon: React.FC<{ className?: string }>;
}> = ({ title, value, Icon }) => (
  <Card className="h-full">
    <CardContent>
      <Box className="flex items-center justify-between">
        <div>
          <Typography color="textSecondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4">
            {value.toLocaleString()}
          </Typography>
        </div>
        <Icon className="w-8 h-8 text-blue-500" />
      </Box>
    </CardContent>
  </Card>
);

const Dashboard: React.FC = () => {
  
  const { user } = useSelector((state: RootState) => state.auth);
  const { roles } = useSelector((state: RootState) => state.roles);
  const { users } = useSelector((state: RootState) => state.users);
  // console.log(user);
  console.log("Users: ",users);
  console.log("Roles: ",roles);
  const roleCounts = users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1; // Increment count for the role
    return acc;
  }, {} as Record<string, number>);
  const totalUsers = users.length; // Total users count
  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ['dashboardStats'],
    queryFn: () => dashboardStats
  });
  if (!stats) return null;


  return (
    <div className="p-6 flex flex-col justify-center gap-5" style={{ width: '90vw' }}>
      <TopBar heading='Admin Dashboard' />
      {(user?.otherPermissions?.some(permission =>
        ["manage_users", "manage_roles"].includes(permission)
      ) || user?.role === 'ADMIN')
        &&
        <div className='flex gap-10'>
          <Grid container spacing={3} className="mb-6">
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Users"
                value={users.length}
                Icon={Users}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Active Users"
                value={users.filter((user) => {
                  return user.status === 'ACTIVE';
                }).length}
                Icon={UserCheck}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Inactive Users"
                value={users.filter((user) => {
                  return user.status === 'INACTIVE';
                }).length}
                Icon={UserX}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Roles"
                value={roles.length}
                Icon={Shield}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" className="mb-4">
                    Users by Role
                  </Typography>
                  {Object.entries(roleCounts).map(([role, count]) => (
                    <Box key={role} className="mb-2">
                      <Box className="flex justify-between mb-1">
                        <Typography>{role}</Typography>
                        <Typography>{count}</Typography>
                      </Box>
                      <div className="w-full bg-gray-200 rounded">
                        <div
                          className="bg-blue-500 h-2 rounded"
                          style={{
                            width: `${(count / totalUsers) * 100}%` // Percentage based width
                          }}
                        />
                      </div>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </div>
      }
      {(user?.otherPermissions?.some(permission =>
        ["manage_events", "export_events", "view_events"].includes(permission)
      ) || user?.role === 'ORGANIZER')
        &&
        <div className='flex gap-10'>
          <Grid container spacing={3} className="mb-6">
            <Grid item xs={12} sm={6} md={6}>
              <StatCard
                title="Total Events"
                value={stats.totalEvents}
                Icon={Calendar}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <StatCard
                title="Upcoming Events"
                value={stats.upcomingEvents}
                Icon={CalendarCheck}
              />
            </Grid>
          </Grid>
        </div>
      }
      {/* Separate permission checks for each management component */}

      {(user?.otherPermissions?.includes('manage_roles') || user?.role === 'ADMIN') && <RoleManagement />}

      {(user?.otherPermissions?.includes('manage_users') || user?.role === 'ADMIN') && <UserManagement />}

      {(user?.otherPermissions?.some(permission =>
        ["manage_events", "export_events", "view_events"].includes(permission)
      ) || user?.role === 'ORGANIZER') && (
          <EventManagement />
        )}

        {
          (user?.otherPermissions?.includes('register_events') || user?.otherPermissions?.includes('unregister_events') || user?.role === 'VIEWER') &&
          <EventList />
        }
    </div>
  );
};

export default Dashboard;