// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const ListRooms = () => {
//   const [rooms, setRooms] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [editingRoom, setEditingRoom] = useState(null);
//   const [editForm, setEditForm] = useState({});

//   useEffect(() => {
//     fetchRooms();
//   }, []);

//   const fetchRooms = async () => {
//     try {
//       const res = await axios.get("http://localhost:3000/rooms");
//       setRooms(res.data);
//     } catch (err) {
//       console.error("❌ Failed to fetch rooms:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (roomId) => {
//     if (!window.confirm("Are you sure you want to delete this room?")) return;

//     try {
//       await axios.delete(`http://localhost:3000/rooms/${roomId}`);
//       alert("✅ Room deleted!");
//       fetchRooms();
//     } catch (err) {
//       console.error("❌ Delete error:", err);
//       alert("Failed to delete room");
//     }
//   };

//   const handleEditClick = (room) => {
//     setEditingRoom(room._id);
//     setEditForm({
//       name: room.name,
//       price: room.price,
//       city: room.city,
//       roomType: room.roomType,
//     });
//   };

//   const handleEditChange = (e) => {
//     const { name, value } = e.target;
//     setEditForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleUpdate = async (roomId) => {
//     try {
//       await axios.put(`http://localhost:3000/rooms/${roomId}`, {
//         ...editForm,
//         price: Number(editForm.price),
//       });
//       alert("✅ Room updated!");
//       setEditingRoom(null);
//       fetchRooms();
//     } catch (err) {
//       console.error("❌ Update failed:", err);
//       alert("Failed to update room");
//     }
//   };

//   return (
//     <div className="p-6">
//       <h2 className="text-xl font-semibold mb-4">All Hotel Rooms</h2>

//       {loading ? (
//         <p>Loading rooms...</p>
//       ) : rooms.length === 0 ? (
//         <p className="text-gray-500">No rooms found.</p>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="min-w-full bg-white border rounded shadow">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="py-2 px-4 text-left">Name</th>
//                 <th className="py-2 px-4 text-left">City</th>
//                 <th className="py-2 px-4 text-left">Price</th>
//                 <th className="py-2 px-4 text-left">Room Type</th>
//                 <th className="py-2 px-4 text-left">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {rooms.map((room) => (
//                 <tr key={room._id} className="border-t hover:bg-gray-50">
//                   {editingRoom === room._id ? (
//                     <>
//                       <td className="py-2 px-4">
//                         <input
//                           type="text"
//                           name="name"
//                           value={editForm.name}
//                           onChange={handleEditChange}
//                           className="border px-2 py-1 w-full"
//                         />
//                       </td>
//                       <td className="py-2 px-4">
//                         <input
//                           type="text"
//                           name="city"
//                           value={editForm.city}
//                           onChange={handleEditChange}
//                           className="border px-2 py-1 w-full"
//                         />
//                       </td>
//                       <td className="py-2 px-4">
//                         <input
//                           type="number"
//                           name="price"
//                           value={editForm.price}
//                           onChange={handleEditChange}
//                           className="border px-2 py-1 w-full"
//                         />
//                       </td>
//                       <td className="py-2 px-4">
//                         <select
//                           name="roomType"
//                           value={editForm.roomType}
//                           onChange={handleEditChange}
//                           className="border px-2 py-1 w-full"
//                         >
//                           <option value="">Select</option>
//                           <option value="Single Bed">Single Bed</option>
//                           <option value="Double Bed">Double Bed</option>
//                           <option value="Luxury Room">Luxury Room</option>
//                           <option value="Family Suite">Family Suite</option>
//                         </select>
//                       </td>
//                       <td className="py-2 px-4 space-x-2">
//                         <button
//                           onClick={() => handleUpdate(room._id)}
//                           className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 text-xs rounded"
//                         >
//                           Save
//                         </button>
//                         <button
//                           onClick={() => setEditingRoom(null)}
//                           className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 text-xs rounded"
//                         >
//                           Cancel
//                         </button>
//                       </td>
//                     </>
//                   ) : (
//                     <>
//                       <td className="py-2 px-4">{room.name}</td>
//                       <td className="py-2 px-4">{room.city}</td>
//                       <td className="py-2 px-4">₹{room.price}</td>
//                       <td className="py-2 px-4">{room.roomType}</td>
//                       <td className="py-2 px-4 space-x-2">
//                         <button
//                           onClick={() => handleEditClick(room)}
//                           className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 text-xs rounded"
//                         >
//                           Edit
//                         </button>
//                         <button
//                           onClick={() => handleDelete(room._id)}
//                           className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-xs rounded"
//                         >
//                           Delete
//                         </button>
//                       </td>
//                     </>
//                   )}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ListRooms;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ListRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await axios.get("http://localhost:3000/rooms");
      setRooms(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch rooms:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (roomId) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;

    try {
      await axios.delete(`http://localhost:3000/rooms/${roomId}`);
      alert("✅ Room deleted!");
      fetchRooms();
    } catch (err) {
      console.error("❌ Delete error:", err);
      alert("Failed to delete room");
    }
  };

  const handleEditClick = (roomId) => {
    // Navigate to EditRoom page with roomId param
    navigate(`/admin/edit-room/${roomId}`);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">All Hotel Rooms</h2>

      {loading ? (
        <p>Loading rooms...</p>
      ) : rooms.length === 0 ? (
        <p className="text-gray-500">No rooms found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-left">Name</th>
                <th className="py-2 px-4 text-left">City</th>
                <th className="py-2 px-4 text-left">Price</th>
                <th className="py-2 px-4 text-left">Room Type</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room._id} className="border-t hover:bg-gray-50">
                  <td className="py-2 px-4">{room.name}</td>
                  <td className="py-2 px-4">{room.city}</td>
                  <td className="py-2 px-4">₹{room.price}</td>
                  <td className="py-2 px-4">{room.roomType}</td>
                  <td className="py-2 px-4 space-x-2">
                    <button
                      onClick={() => handleEditClick(room._id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 text-xs rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(room._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-xs rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ListRooms;
