import React, { useState, useMemo, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormGroup,
  Checkbox,
  Select,
  FormControl,
  InputLabel,
  Card,
  CardContent,
} from '@mui/material';
import { Edit, Trash2, UserPlus, ArrowUp, ArrowDown, Filter } from 'lucide-react';
import { User, UserRole, UserStatus } from '../../types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { addUser, deleteUser, updateUser } from '../../store/userSlice';

interface UserFormData {
  username: string;
  email: string;
  role: UserRole;
  password: string;
  status: string;
  otherPermissions?: string[];
}

interface SortConfig {
  key: 'username' | 'email' | null;
  direction: 'asc' | 'desc';
}

interface RemainingPermisions {
  key: string;
  label: string;
}

const UserManagement: React.FC = () => {

  // const users;
  const { roles } = useSelector((state: RootState) => state.roles);
  const users = useSelector((state: RootState) => state.users.users);

  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  // const [status, setStatus] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: 'asc'
  });
  const [showFilters, setShowFilters] = useState(true);

  const [formData, setFormData] = useState<UserFormData>({
    username: '',
    email: '',
    password: '',
    role: 'VIEWER',
    status: '',
    otherPermissions: []
  });



  const allPermissions = [
    { key: 'manage_users', label: 'Manage Users' },
    { key: 'manage_roles', label: 'Manage Roles' },
    { key: 'manage_events', label: 'Manage Events' },
    { key: 'export_events', label: 'Export Events' },
    { key: 'register_events', label: 'Register Events' },
  ];


  const [remainingPermissions, setRemainingPermissions] = useState<RemainingPermisions[]>([]);


  const filteredAndSortedUsers = useMemo(() => {
    if (!users) return [];

    const filtered = users.filter(user => {
      const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'ALL' || user.status === statusFilter;
      return matchesRole && matchesStatus;
    });

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key!].toLowerCase();
        const bValue = b[sortConfig.key!].toLowerCase();

        if (sortConfig.direction === 'asc') {
          return aValue.localeCompare(bValue);
        }
        return bValue.localeCompare(aValue);
      });
    }

    return filtered;
  }, [users, roleFilter, statusFilter, sortConfig]);

  const handleSort = (key: 'username' | 'email') => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const SortIcon = ({ column }: { column: 'username' | 'email' }) => {
    if (sortConfig.key !== column) return null;
    return sortConfig.direction === 'asc' ?
      <ArrowUp className="w-4 h-4 inline-block ml-1" aria-label="sorted ascending" /> :
      <ArrowDown className="w-4 h-4 inline-block ml-1" aria-label="sorted descending" />;
  };

  const handleOpen = (user?: User) => {
    if (user) {
      console.log('Editing user:', user);
      setEditingUser(user);
      setFormData({
        username: user.username,
        email: user.email,
        password: user.password,
        role: user.role,
        status: user.status,
        otherPermissions: user.otherPermissions ?? [],
      });
      // setStatus(user.status);
    } else {
      setEditingUser(null);
      setFormData({
        username: '',
        email: '',
        password: '',
        role: 'VIEWER',
        status: 'ACTIVE',
        otherPermissions: [],
      });
      // setStatus('ACTIVE');``
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingUser(null);
  };

  const handleSubmit = () => {
    try {
      if (!formData.username.trim()) {
        alert("Username cannot be empty.");
        return;
      }
      if (!formData.email.trim()) {
        alert("Email cannot be empty.");
        return;
      }
      if (!formData.password.trim()) {
        alert("Password cannot be empty.");
        return;
      }
      if (!formData.role) {
        alert("Select a Role to proceed.");
        return;
      }
      if (!formData.status) {
        alert("Select a status to proceed.");
        return;
      }

      const newUser: User = {
        ...(editingUser || {}), // Preserve existing user data
        id: editingUser ? editingUser.id : Date.now(),
        username: formData.username,
        password: editingUser ? editingUser.password : formData.password, // Preserve existing password when editing
        email: formData.email,
        role: formData.role,
        status: formData.status as UserStatus,
        createdAt: editingUser ? editingUser.createdAt : new Date().toISOString(),
        otherPermissions: formData.otherPermissions
      };

      console.log('About to dispatch user update:', newUser);
      if (editingUser) {
        dispatch(updateUser(newUser));
      }
      else {
        dispatch(addUser(newUser));
      }
      console.log('Save user:', formData);
      handleClose();

    } catch (error) {
      console.error('Error updating user:', error);
      alert('There was an error updating the user. Please try again.');
    }

  };

  const handleToggleStatus = (userId: number) => {
    console.log('Toggle status for user:', userId);
  };

  const handleDelete = (user: User) => {
    dispatch(deleteUser(user));
    console.log('Delete user:', user);
  };

  const handleFilterChange = (type: string, value: string) => {
    if (type === 'role') {
      setRoleFilter(value);
    } else if (type === 'status') {
      setStatusFilter(value);
    }
  };

  const generateRemainingPermissions = (user: User) => {
    // Step 1: Fetch the user's role
    const roleOfUser = user.role;

    // Step 2: Find the role object for the user's role
    const role = roles.find(r => r.name === roleOfUser);

    // Step 3: Combine the role's permissions and user's otherPermissions
    const assignedPermissions = [
      ...(role?.permissions || []), // Role permissions
      ...(user.otherPermissions || []) // Other individual permissions
    ];

    // Step 4: Calculate remaining permissions by filtering out assigned ones
    const remainingPermissions = allPermissions.filter(
      permission => !assignedPermissions.includes(permission.key)
    );

    // Step 5: Handle the user and return the remaining permissions
    handleOpen(user);
    setRemainingPermissions(remainingPermissions);
    return remainingPermissions;
  };

  const FilterSection = () => (
    <Card className="mb-6" variant="outlined">
      <CardContent>
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className='w-[100%] flex gap-5'>
            <FormControl className="min-w-[200px]">
              <InputLabel id="role-filter-label">Filter by Role</InputLabel>
              <Select
                labelId="role-filter-label"
                id="role-filter"
                value={roleFilter}
                label="Filter by Role"
                onChange={(e) => handleFilterChange('role', e.target.value)}
              >
                <MenuItem value="ALL">All Roles</MenuItem>
                {roles.map(role => (
                  <MenuItem key={role.id} value={role.name}>
                    {role.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl className="min-w-[200px]">
              <InputLabel id="status-filter-label">Filter by Status</InputLabel>
              <Select
                labelId="status-filter-label"
                id="status-filter"
                value={statusFilter}
                label="Filter by Status"
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <MenuItem value="ALL">All Status</MenuItem>
                <MenuItem value="ACTIVE">Active</MenuItem>
                <MenuItem value="INACTIVE">Inactive</MenuItem>
              </Select>
            </FormControl>
          </div>

          <div className="flex items-end">
            <Button
              variant="outlined"
              onClick={() => {
                setRoleFilter('ALL');
                setStatusFilter('ALL');
              }}
              aria-label="Clear all filters"
            >
              Clear Filters
            </Button>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredAndSortedUsers.length} of {users?.length} users
        </div>
      </CardContent>
    </Card>
  );

  useEffect(() => {
    console.log('Users state updated:', users);
  }, [users]);

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-950">User Management</h2>
        <div className="flex gap-2">
          <Button
            variant="outlined"
            startIcon={<Filter />}
            onClick={() => setShowFilters(!showFilters)}
            aria-expanded={showFilters}
            aria-controls="filter-section"
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
          <Button
            variant="contained"
            startIcon={<UserPlus />}
            onClick={() => handleOpen()}
          >
            Add User
          </Button>
        </div>
      </div>

      <section id="filter-section" aria-labelledby="filter-section-label">
        <h2 id="filter-section-label" className="sr-only">Filter controls</h2>
        {showFilters && <FilterSection />}
      </section>

      <div className="overflow-x-auto">
        <Table aria-label="User management table">
          <TableHead>
            <TableRow>
              <TableCell>
                <Button
                  onClick={() => handleSort('username')}
                  endIcon={<SortIcon column="username" />}
                  aria-label={
                    sortConfig.key === 'username'
                      ? `Sort by username (${sortConfig.direction})`
                      : 'Sort by username'
                  }
                >

                  Username
                </Button>
              </TableCell>
              <TableCell>
                <Button
                  onClick={() => handleSort('email')}
                  endIcon={<SortIcon column="email" />}
                  aria-label={
                    sortConfig.key === 'email'
                      ? `Sort by email (${sortConfig.direction})`
                      : 'Sort by email'
                  }
                >
                  Email
                </Button>
              </TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              {/* <TableCell>Addtional Permissions</TableCell> */}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAndSortedUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Switch
                    checked={user.status === 'ACTIVE'}
                    onChange={() => handleToggleStatus(user.id)}
                    disabled
                    aria-label={`User status ${user.status}`}
                  />
                </TableCell>

                {/* <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {generateRemainingPermissions(user)?.map((permission) => (
                      <Chip
                        key={permission.key} // Use a unique key if permission is an object
                        label={permission.label} // Adjust label based on data structure
                        size="small"
                        className="mr-1 mb-1"
                      />
                    ))}
                  </div>
                </TableCell> */}
                <TableCell>
                  <IconButton
                    onClick={() => generateRemainingPermissions(user)}
                    size="small"
                    aria-label={`Edit ${user.username}`}
                    disabled={['sadha', 'sarves', 'sanjay'].includes(user.username)}
                  >
                    <Edit className="w-4 h-4" />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(user)}
                    size="small"
                    color="error"
                    aria-label={`Delete ${user.username}`}
                    disabled={['sadha', 'sarves', 'sanjay'].includes(user.username)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="user-dialog-title"
      >
        <DialogTitle id="user-dialog-title">
          {editingUser ? 'Edit User' : 'Add New User'}
        </DialogTitle>
        <DialogContent>
          {/* FOR SAFETY MEASURES AND SIMPLE USAGE, USERNAME CANNOT BE EDITED */}
          {!editingUser &&
            <TextField
              label="Username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              fullWidth
              margin="normal"
              required
            />
          }
          <TextField
            label="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            fullWidth
            margin="normal"
            required
          />
          {/* FOR SAFETY MEASURES AND SIMPLE USAGE, PASSWORD CANNOT BE EDITED */}
          {!editingUser && (
            <TextField
              label="Password"
              type="password"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              fullWidth
              margin="normal"
              required
            />
          )}
          <TextField
            select
            label="Role"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
            fullWidth
            margin="normal"
            required
          >
            {roles.map((role) => (
              <MenuItem key={role.id} value={role.name}>
                {role.name}
              </MenuItem>
            ))}
          </TextField>
          <RadioGroup
            row
            value={formData.status}
            onChange={(e) => {
              // setStatus(e.target.value);
              setFormData({ ...formData, status: e.target.value });
            }}
            name="status-radio-group"
            aria-label="user status"
          >
            <FormControlLabel
              value="ACTIVE"
              control={<Radio />}
              label="Active"
            />
            <FormControlLabel
              value="INACTIVE"
              control={<Radio />}
              label="Inactive"
            />
          </RadioGroup>
          {editingUser
            &&
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">Additional Permissions</h3>
              <FormGroup>
                {remainingPermissions.map((permission) => (
                  <FormControlLabel
                    key={permission.key}
                    control={
                      <Checkbox
                        checked={formData?.otherPermissions?.includes(permission.key) || false}
                        onChange={(e) => {
                          const newPermissions = e.target.checked
                            ? [...(formData?.otherPermissions || []), permission.key]
                            : (formData?.otherPermissions || []).filter(p => p !== permission.key);
                          setFormData({ ...formData, otherPermissions: newPermissions });
                        }}
                      />

                    }
                    label={permission.label}
                  />
                ))}
              </FormGroup>
            </div>
          }
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingUser ? 'Save' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserManagement;