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
    console.log("✅ Rooms fetched:", res.data);

    if (!Array.isArray(res.data)) {
      alert("Rooms response is not an array");
    } else if (res.data.length === 0) {
      alert("⚠️ No rooms found from API");
    }

    setRooms(res.data);
  } catch (err) {
    console.error("❌ Error fetching rooms:", err);
    alert("Error fetching rooms");
  } finally {
    setLoading(false);
  }
};

  // const fetchRooms = async () => {
  //   try {
  //     const res = await axios.get('http://localhost:3000/rooms');
  //     console.log("✅ Rooms fetched:", res.data);
  //     setRooms(res.data);
  //   } catch (err) {
  //     console.error("❌ Error fetching rooms:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this room?");
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:3000/rooms/${id}`);
      setRooms((prev) => prev.filter((room) => room._id !== id));
    } catch (err) {
      console.error("❌ Error deleting room:", err);
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
      <Typography variant="h4" gutterBottom>
        All Hotel Rooms
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      ) : rooms.length === 0 ? (
        <Box mt={5} textAlign="center">
          <Typography variant="h6" color="textSecondary">
            ⚠️ No rooms found in the system.
          </Typography>
        </Box>
      ) : (
        <Box overflow="auto" mt={2}>
          <Paper elevation={3}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Room Name</strong></TableCell>
                  <TableCell><strong>Room Type</strong></TableCell>
                  <TableCell><strong>City</strong></TableCell>
                  <TableCell><strong>Price (₹)</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rooms.map((room) => (
                  <TableRow key={room._id}>
                    <TableCell>{room.name || 'N/A'}</TableCell>
                    <TableCell>{room.roomType || 'N/A'}</TableCell>
                    <TableCell>{room.city || 'N/A'}</TableCell>
                    <TableCell>{room.price ? `₹${room.price}` : 'N/A'}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEdit(room._id)} color="primary">
                        <EditIcon sx={{ width: 24, height: 24 }} />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(room._id)} color="error">
                        <DeleteIcon sx={{ width: 24, height: 24 }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default ListRooms;
