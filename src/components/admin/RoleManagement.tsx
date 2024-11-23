// src/components/admin/RoleManagement.tsx
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { Edit, Trash2, Shield } from 'lucide-react';
import { Role, UserRole } from '../../types';
import { addRole, deleteRole, updateRole } from '../../store/roleSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';


const availablePermissions = [
  { key: 'manage_users', label: 'Manage Users' },
  { key: 'manage_roles', label: 'Manage Roles' },
  { key: 'manage_events', label: 'Manage Events' },
  { key: 'export_events', label: 'Export Events' },
  { key: 'register_events', label: 'Register Events' },
  { key: 'unregister_events', label: 'Unregister Events' },

];

interface RoleFormData {
  id: number;
  name: string;
  permissions: string[];
  createdAt: string;
}

const RoleManagement: React.FC = () => {

  const roles = useSelector((state: RootState) => state.roles.roles);


  const [open, setOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState<RoleFormData>({
    id: 0,
    name: '',
    permissions: [],
    createdAt: ''
  });


  const handleOpen = (role?: Role) => {
    if (role) {
      setEditingRole(role);
      setFormData({
        id: role.id,
        name: role.name,
        permissions: role.permissions,
        createdAt: new Date().toISOString(),
      });
    } else {
      setEditingRole(null);
      setFormData({
        id: 0,
        name: '',
        permissions: [],
        createdAt: ''
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingRole(null);
  };

  const handlePermissionChange = (permission: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission],
    }));
  };

  const dispatch = useDispatch();
  const handleSubmit = () => {
    if (!formData.name.trim()) {
      alert("Role name cannot be empty.");
      return;
    }
    const newRole: Role = {
      id: editingRole ? editingRole.id : Date.now(), // Generate a unique ID for new roles
      name: formData.name as UserRole, // Ensure type alignment
      permissions: formData.permissions,
      createdAt: new Date().toISOString(),
    };

    if (editingRole) {
      dispatch(updateRole(newRole)); // Update role
    } else {
      dispatch(addRole(newRole)); // Add new role
    }
    console.log('Saved role:', newRole); // For debugging
    handleClose();
  };

  const handleDelete = (roleId: number) => {
    // In a real app, this would be an API call
    dispatch(deleteRole(roleId));
    alert("Role Deleted");
    console.log('Delete role:', roleId);
  };

  return (
    <div className="p-6 bg-white">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-950">Role Management</h2>
        <Button
          variant="contained"
          startIcon={<Shield />}
          onClick={() => handleOpen()}
        >
          Add Role
        </Button>
      </div>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Permissions</TableCell>
            <TableCell>Created At</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {roles?.map((role) => (
            <TableRow key={role.id}>
              <TableCell>{role.name}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {role.permissions.map((permission) => (
                    <Chip
                      key={permission}
                      label={permission}
                      size="small"
                      className="mr-1 mb-1"
                    />
                  ))}
                </div>
              </TableCell>
              <TableCell>{role.createdAt}</TableCell>
              <TableCell>
                <IconButton
                  onClick={() => handleOpen(role)}
                  size="small"
                  disabled={['ADMIN', 'ORGANIZER', 'VIEWER'].includes(role.name)}

                >
                  <Edit className="w-4 h-4" />
                </IconButton>
                <IconButton
                  onClick={() => handleDelete(role.id)}
                  size="small"
                  color="error"
                  disabled={['ADMIN', 'ORGANIZER', 'VIEWER'].includes(role.name)}

                >
                  <Trash2 className="w-4 h-4" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingRole ? 'Edit Role' : 'Add New Role'}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            fullWidth
            margin="normal"
            required
          />
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Permissions</h3>
            <FormGroup>
              {availablePermissions.map((permission) => (
                <FormControlLabel
                  key={permission.key}
                  control={
                    <Checkbox
                      checked={formData.permissions.includes(permission.key)}
                      onChange={() => handlePermissionChange(permission.key)}
                    />
                  }
                  label={permission.label}
                />
              ))}
            </FormGroup>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingRole ? 'Save' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RoleManagement;