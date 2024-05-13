import React, { useEffect, useState } from 'react';
import './users.scss'; // Importer le fichier SCSS pour styliser le tableau

const Carte = () => {
  const [cartes, setCartes] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedCarte, setEditedCarte] = useState({
    dateCreation:'',
    dateFin:'',
    tauxReduction:'',
    type: ''
  });
  const [showAddPopup, setShowAddPopup] = useState(false);

  useEffect(() => {
    const fetchCartes = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/cartereductions');
        if (!response.ok) {
          throw new Error('Failed to fetch carte');
        }
        const data = await response.json();
        setCartes(data);
      } catch (error) {
        console.error('Error fetching carte:', error);
      }
    };

    fetchCartes();
  }, []);

  const handleEdit = (id) => {
    setEditingId(id);
    const carteToEdit = cartes.find(carte => carte.id === id);
    setEditedCarte(carteToEdit);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditedCarte({
        dateCreation:'',
        dateFin:'',
        tauxReduction:'',
        type: ''
    });
  };

  const handleSaveEdit = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/cartereductions/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editedCarte)
      });
      if (!response.ok) {
        throw new Error('Failed to update user');
      }
      const updatedCarte = await response.json();
      const updatedCartes = cartes.map(carte => carte.id === editingId ? updatedCarte : carte);
      setCartes(updatedCartes);
      setEditingId(null);
      setEditedCarte({
        dateCreation:'',
        dateFin:'',
        tauxReduction:'',
        type: ''
      });
    } catch (error) {
      console.error('Error updating carte:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/cartereductions/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Failed to carte carte');
      }
      const updatedCartes = cartes.filter(carte => carte.id !== id);
      setCartes(updatedCartes);
    } catch (error) {
      console.error('Error deleting carte:', error);
    }
  };

  const handleAddCartes = () => {
    setShowAddPopup(true);
  };

  const closeAddPopup = () => {
    setShowAddPopup(false);
  };

  const handleSubmitAddCarte = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/cartereductions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editedCarte)
      });
      if (!response.ok) {
        throw new Error('Failed to add user');
      }
      const newCarte = await response.json();
      setCartes([...cartes, newCarte]);
      setShowAddPopup(false);
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  return (
    <>
      <h1>Carte Information</h1>
      {showAddPopup && (
        <div className="popup">
          <div className="popup-inner">
            <h2>Add Carte</h2>
            <input
              type="text"
              placeholder="type"
              value={editedCarte.type}
              onChange={e => setEditedCarte({...editedCarte, type: e.target.value})}
            />
            <input
              type="Date"
              placeholder="dateCreation"
              value={editedCarte.dateCreation}
              onChange={e => setEditedCarte({...editedCarte, dateCreation: e.target.value})}
            />
            <input
              type="Date"
              placeholder="dateFin"
              value={editedCarte.dateFin}
              onChange={e => setEditedCarte({...editedCarte, dateFin: e.target.value})}
            />
            <input
              type="Nombre"
              placeholder="taux de reduction "
              value={editedCarte.tauxReduction}
              onChange={e => setEditedCarte({...editedCarte, tauxReduction: e.target.value})}
            />
            
            <button onClick={handleSubmitAddCarte}>Add</button>
            <button onClick={closeAddPopup}>Cancel</button>
          </div>
        </div>
      )}
      <button onClick={handleAddCartes}>Add User</button>
      <table className="user-table">
        <thead>
          <tr>
            <th>Type</th>
            <th>date de creation</th>
            <th>date Fin </th>
            <th>Taux de reduction</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cartes.map(Carte => (
            <tr key={Carte.id}>
              <td>{editingId === Carte.id ? <input value={editedCarte.type} onChange={e => setEditedCarte({...editedCarte, type: e.target.value})} /> : Carte.type}</td>
              <td>{editingId === Carte.id ? <input value={editedCarte.dateCreation} onChange={e => setEditedCarte({...editedCarte, dateCreation: e.target.value})} /> : Carte.dateCreation}</td>
              <td>{editingId === Carte.id ? <input value={editedCarte.dateFin} onChange={e => setEditedCarte({...editedCarte, dateFin: e.target.value})} /> : Carte.dateFin}</td>
              <td>{editingId === Carte.id ? <input value={editedCarte.tauxReduction} onChange={e => setEditedCarte({...editedCarte, tauxReduction: e.target.value})} /> : Carte.tauxReduction}</td>
              <td>
                {editingId === Carte.id ? (
                  <>
                    <button onClick={handleSaveEdit}>Save</button>
                    <button onClick={handleCancelEdit}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(Carte.id)}>Edit</button>
                    <button onClick={() => handleDelete(Carte.id)}>Delete</button>
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

export default Carte;
