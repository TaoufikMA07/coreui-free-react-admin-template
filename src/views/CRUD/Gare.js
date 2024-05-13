import React, { useEffect, useState } from 'react';
import './users.scss'; // Importer le fichier SCSS pour styliser le tableau

const Gare = () => {
  const [gares, setgares] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedGare, setEditedGare] = useState({
   
    nom: '',
    ville: ''
  });
  const [showAddPopup, setShowAddPopup] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/gares');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setgares(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);


 //recuperer la gare apartire de id
  const handleEdit = (id) => {
    setEditingId(id);
    const gareToEdit = gares.find(gare => gare.id === id);
    setEditedGare(gareToEdit);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditedGare({
        nom: '',
        ville: ''
    });
  };

  const handleSaveEdit = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/gares/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editedGare)
      });
      if (!response.ok) {
        throw new Error('Failed to update gare');
      }
      const updatedgare = await response.json();
      const updatedGares = gares.map(gare => gare.id === editingId ? updatedgare : gare);
      setgares(updatedGares);
      setEditingId(null);
      setEditedGare({
        nom: '',
        ville: ''
      });
    } catch (error) {
      console.error('Error updating gare:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/gares/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
      const updatedGares = gares.filter(gare => gare.id !== id);
      setgares(updatedGares);
    } catch (error) {
      console.error('Error deleting gare:', error);
    }
  };

  const handleAddGare = () => {
    setShowAddPopup(true);
  };

  const closeAddPopup = () => {
    setShowAddPopup(false);
  };

  const handleSubmitAddGare = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/gares`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editedGare)
      });
      if (!response.ok) {
        throw new Error('Failed to add user');
      }
      const newGares = await response.json();
      setgares([...gares, newGares]);
      setShowAddPopup(false);
    } catch (error) {
      console.error('Error adding gare:', error);
    }
  };

  return (
    <>
      <h1>Gare Information</h1>
      {showAddPopup && (
        <div className="popup">
          <div className="popup-inner">
            <h2>Add gare</h2>
            <input
              type="text"
              placeholder="Nom"
              value={editedGare.nom}
              onChange={e => setEditedGare({...editedGare, nom: e.target.value})}
            />
            <input
              type="text"
              placeholder="ville"
              value={editedGare.ville}
              onChange={e => setEditedGare({...editedGare, ville: e.target.value})}
            />
           
            <button onClick={handleSubmitAddGare}>Add</button>
            <button onClick={closeAddPopup}>Cancel</button>
          </div>
        </div>
      )}
      <button onClick={handleAddGare}>Add Gare</button>
      <table className="user-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>ville</th>
            <th>Actions</th>

          </tr>
        </thead>
        <tbody>
          {gares.map(gare => (
            <tr key={gare.id}>
              <td>{editingId === gare.id ? <input value={editedGare.nom} onChange={e => setEditedGare({...editedGare, nom: e.target.value})} /> : gare.nom}</td>
              <td>{editingId === gare.id ? <input value={editedGare.ville} onChange={e => setEditedGare({...editedGare, ville: e.target.value})} /> : gare.ville}</td>
              <td>
                {editingId === gare.id ? (
                  <>
                    <button onClick={handleSaveEdit}>Save</button>
                    <button onClick={handleCancelEdit}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(gare.id)}>Edit</button>
                    <button onClick={() => handleDelete(gare.id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Gare;
