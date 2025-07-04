import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  IconButton,
  CircularProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ListRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchRooms = async () => {
    try {
      const res = await axios.get('http://localhost:3000/rooms');
      setRooms(res.data);
    } catch (err) {
      console.error('Error fetching rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this room?");
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:3000/rooms/${id}`);
      setRooms((prev) => prev.filter((room) => room._id !== id));
    } catch (err) {
      console.error("Error deleting room:", err);
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/edit-room/${id}`);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>All Rooms</Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper elevation={3}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Room Type</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>City</TableCell>
                <TableCell>Hotel Name</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rooms.map((room) => (
                <TableRow key={room._id}>
                  <TableCell>{room.roomType}</TableCell>
                  <TableCell>₹{room.price}</TableCell>
                  <TableCell>{room.city}</TableCell>
                  <TableCell>{room.name}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(room._id)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(room._id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {rooms.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">No rooms available.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  );
};

export default ListRooms;
