// src/components/events/EventManagement.tsx
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip,
  IconButton,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  Calendar,
  Download,
  Edit,
  FileDown,
  MapPin,
  Trash2,
  Users,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { events } from '../../data/mockData';
import { Event, EventStatus } from '../../types';
import { RootState } from '../../store/store';
import * as XLSX from 'xlsx';

interface EventFormData {
  id: number;
  title: string;
  date: string;
  location: string;
  description: string;
  organizerId: number;
  status: EventStatus;
  capacity?: number;
  registrations?: number;
  createdAt: string;
  updatedAt: string;
}

const EventManagement: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [open, setOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState<EventFormData>({
    id: events.length > 0 ? events[events.length - 1].id + 1 : 1,
    title: '',
    date: '',
    location: '',
    description: '',
    organizerId: user?.id ?? 0,//organizer is the logged in user. and only organizer can create and edit events
    status: 'UPCOMING',
    capacity: 0,
    registrations: 0,
    createdAt: '',
    updatedAt: ''

  });

  const { data: eventList, isLoading, error } = useQuery({
    queryKey: ['events', user?.id],
    queryFn: () => {
      if (user?.role === 'ORGANIZER') {
        return events.filter((event) => event.organizerId === user.id);
      }
      return events;
    },
  });

  const handleOpen = (event?: Event) => {
    if (event) {
      setEditingEvent(event);
      setFormData({
        id: event.id,
        title: event.title,
        // Convert the string date to a Date object
        date: new Date(event.date).toISOString(),
        location: event.location,
        description: event.description,
        organizerId: event.organizerId,
        status: event.status,
        capacity: event.capacity ?? 0,
        registrations: event.registrations ?? 0,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt,
      });
    } else {
      setEditingEvent(null);
      setFormData({
        id: events.length > 0 ? events[events.length - 1].id + 1 : 1,
        title: '',
        // Set current date as default for new events
        date: new Date().toISOString(),
        location: '',
        description: '',
        organizerId: user?.id ?? 0,
        status: 'UPCOMING',
        capacity: 0,
        registrations: 0,
        createdAt: new Date().toISOString(),
        updatedAt: ''
      });
    }
    setOpen(true);
    // alert(open);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingEvent(null);
  };

  const handleSubmit = () => {
    // In a real app, this would be an API call
    console.log('Save event:', formData);
    handleClose();
  };

  const handleDelete = (eventId: number) => {
    // In a real app, this would be an API call
    console.log('Delete event:', eventId);
  };

  const handleExport = (event?: Event) => {
    const dataToExport = event ? [event] : eventList;

    const ws = XLSX.utils.json_to_sheet(
      dataToExport!.map((e) => ({
        Title: e.title,
        Date: e.date,
        Location: e.location,
        Status: e.status,
        Capacity: e.capacity,
        Registrations: e.registrations,
        'Registration Rate': `${((e.registrations ?? 0) / (e.capacity ?? 1) * 100).toFixed(1)}%`,
      }))
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Events');

    XLSX.writeFile(wb, `events_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const getStatusColor = (status: EventStatus) => {
    switch (status) {
      case 'UPCOMING':
        return 'primary';
      case 'ONGOING':
        return 'success';
      case 'COMPLETED':
        return 'default';
      case 'CANCELLED':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className="p-6 flex flex-col">
        <div className="flex justify-between mb-6">
          <div className="space-x-2">
            <Button
              variant="outlined"
              startIcon={<FileDown />}
              onClick={() => handleExport()}
            >
              Export All
            </Button>
            <Button
              variant="contained"
              startIcon={<Calendar />}
              onClick={() => handleOpen()}
            >
              Create Event
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center">
            <CircularProgress />
          </div>
        ) : error ? (
          <Alert severity="error">Failed to load events. Please try again.</Alert>
        ) : eventList && eventList.length > 0 ? (
          <Grid container spacing={3}>
            {eventList.map((event) => (
              <Grid item xs={12} md={6} lg={4} key={event.id}>
                <Card>
                  <CardContent>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <Typography variant="h6">{event.title}</Typography>
                        <div className="flex items-center text-gray-600 mt-1">
                          <Calendar className="w-4 h-4 mr-1" />
                          {event.date}
                        </div>
                        <div className="flex items-center text-gray-600 mt-1">
                          <MapPin className="w-4 h-4 mr-1" />
                          {event.location}
                        </div>
                        <div className="flex items-center text-gray-600 mt-1">
                          <Users className="w-4 h-4 mr-1" />
                          {event.registrations} / {event.capacity}
                        </div>
                      </div>
                      <Chip
                        label={event.status}
                        color={getStatusColor(event.status)}
                        size="small"
                      />
                    </div>
                    <Typography className="mb-4" variant="body2">
                      {event.description}
                    </Typography>
                    <div className="flex justify-end space-x-2">
                      <IconButton onClick={() => handleExport(event)} size="small">
                        <Download className="w-4 h-4" />
                      </IconButton>
                      <IconButton onClick={() => handleOpen(event)} size="small">
                        <Edit className="w-4 h-4" />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(event.id)}
                        size="small"
                        color="error"
                      >
                        <Trash2 className="w-4 h-4" />
                      </IconButton>
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="h6" align="center">
            No events available.
          </Typography>
        )}

        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle>{editingEvent ? 'Edit Event' : 'Create New Event'}</DialogTitle>
          <DialogContent>
            <TextField
              label="Event Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              fullWidth
              margin="normal"
            />
            <DatePicker
              label="Event Date"
              value={formData.date ? new Date(formData.date) : null}
              onChange={(newValue) =>
                setFormData({
                  ...formData,
                  date: newValue ? newValue.toISOString() : '',
                })
              }
              className="w-full mt-4"
            />

            <TextField
              label="Location"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              fullWidth
              margin="normal"
            />
            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              fullWidth
              margin="normal"
              multiline
              rows={3}
            />
                        <TextField
              label="Status"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value as EventStatus })
              }
              select
              fullWidth
              margin="normal"
            >
              {['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED'].map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Capacity"
              type="number"
              value={formData.capacity}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  capacity: Math.max(0, Number(e.target.value)),
                })
              }
              fullWidth
              margin="normal"
            />
            <TextField
              label="Registrations"
              type="number"
              value={formData.registrations}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  registrations: Math.max(0, Number(e.target.value)),
                })
              }
              fullWidth
              margin="normal"
            />

          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained">
              {editingEvent ? 'Save Changes' : 'Create Event'}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </LocalizationProvider>
  );
};

export default EventManagement;