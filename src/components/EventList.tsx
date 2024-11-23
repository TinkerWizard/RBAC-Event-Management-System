import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Chip,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { check } from '../utils/rbac-rules';
import { events } from '../data/mockData';
import { RootState } from '../store/store';
import { Event, EventStatus } from '../types';
import { useState } from 'react';

const EventList: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const [registeredEvents, setRegisteredEvents] = useState<Set<string>>(new Set());
  const [locationFilter, setLocationFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<EventStatus | ''>('');
  const [sortBy, setSortBy] = useState<'title' | 'date' | ''>('');

  const { data: eventData } = useQuery({
    queryKey: ['events'],
    queryFn: () => {
      if (user?.role === 'ORGANIZER') {
        return events.filter(event => event.organizerId === user.id);
      }
      return events;
    }
  });

  const canRegister = (event: Event) =>
    user ? check(user.role, 'read', 'events', user.id, event) : false;

  const handleRegisterToggle = (eventId: string) => {
    setRegisteredEvents(prev => {
      const newRegisteredEvents = new Set(prev);
      if (newRegisteredEvents.has(eventId)) {
        newRegisteredEvents.delete(eventId);
      } else {
        newRegisteredEvents.add(eventId);
      }
      return newRegisteredEvents;
    });
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

  // Apply filtering
  const filteredEvents = eventData
    ?.filter(event =>
      (locationFilter ? event.location.toLowerCase().includes(locationFilter.toLowerCase()) : true) &&
      (statusFilter ? event.status === statusFilter : true)
    )
    .sort((a, b) => {
      if (!sortBy) return 0;
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'date') return new Date(a.date).getTime() - new Date(b.date).getTime();
      return 0;
    });

  return (
    <div className="p-6">
      {/* Filters and Sorting */}
      <div className="filters mb-4">
        <FormControl className="mr-4" size="medium">
          <TextField
            label="Filter by Location"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          />
        </FormControl>
        <FormControl className="mr-4" size="medium">
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as EventStatus | '')}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="UPCOMING">Upcoming</MenuItem>
            <MenuItem value="ONGOING">Ongoing</MenuItem>
            <MenuItem value="COMPLETED">Completed</MenuItem>
            <MenuItem value="CANCELLED">Cancelled</MenuItem>
          </Select>
        </FormControl>
        <FormControl className="mr-4" size="small">
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'title' | 'date' | '')}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="title">Title</MenuItem>
            <MenuItem value="date">Date</MenuItem>
          </Select>
        </FormControl>
      </div>

      {/* Event Table */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Seats Available</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredEvents?.map((event) => (
            <TableRow key={event.id}>
              <TableCell>{event.title}</TableCell>
              <TableCell>{event.date}</TableCell>
              <TableCell>{event.location}</TableCell>
              <TableCell>{event.registrations}/{event.capacity}</TableCell>
              <TableCell><Chip
                label={event.status}
                color={getStatusColor(event.status)}
                size="small"
              /></TableCell>
              <TableCell>
                {canRegister(event) && (
                  <Button
                    variant="contained"
                    color={registeredEvents.has(String(event.id)) ? "warning" : "primary"}
                    size="small"
                    onClick={() => handleRegisterToggle(String(event.id))}
                  >
                    {registeredEvents.has(String(event.id)) ? "Unregister" : "Register"}
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default EventList;
