import React, { useEffect, useState } from 'react';
import './users.scss'; // Importer le fichier SCSS pour styliser le tableau

const Voiture = () => {
  const [voitures, setVoitures] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [trains, setTrains] = useState([]);
  const [editedVoiture, setEditedVoiture] = useState({
    numVoiture:'',
    nbPlaceTotal:'',
    nbPlaceVide:'',
    classe:'',
    train: { id: '' }
 

  });
  const [showAddPopup, setShowAddPopup] = useState(false);

  useEffect(() => {
    const fetchVoitures = async () => {
      try {
        const response = await fetch('http://localhost:8080/voitures');
        if (!response.ok) {
          throw new Error('Failed to fetch voitures');
        }  
        const data = await response.json();
        setVoitures(data);
        
      } catch (error) {
        console.error('Error fetching voitures:', error);
      }
    };

    fetchVoitures();
  }, []);

  useEffect(() => {
    const fetchTrains = async () => {
      try {
        const response = await fetch('http://localhost:8080/trains');
        if (!response.ok) {
          throw new Error('Failed to fetch trains');
        }  
        const data = await response.json();
        setTrains(data);
      } catch (error) {
        console.error('Error fetching trains:', error);
      }
    };

    fetchTrains();
  }, []);

  const handleEdit = (id) => {
    setEditingId(id);
    const voitureToEdit = voitures.find(voitures => voitures.id === id);
    setEditedVoiture(voitureToEdit);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditedVoiture({
        numVoiture:'',
        nbPlaceTotal:'',
        nbPlaceVide:'',
        classe:'',
        train: { id: '' }
    });
  };

  const handleSaveEdit = async () => {
    try {
      const response = await fetch(`http://localhost:8080/voitures/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editedVoiture)
      });
      if (!response.ok) {
        throw new Error('Failed to update voitures');
      }
      const updatedVoiture = await response.json();
      const updatedVoitures = voitures.map(Voiture => Voiture.id === editingId ? updatedVoiture : Voiture);
      setVoitures(updatedVoitures);
      setEditingId(null);
      setEditedVoiture({
        numVoiture:'',
        nbPlaceTotal:'',
        nbPlaceVide:'',
        classe:'',
        train: { id: '' }
      });
    } catch (error) {
      console.error('Error updating voitures:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/voitures/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Failed to delete voiture');
      }
      const updatedVoitures = voitures.filter(Voiture => Voiture.id !== id);
      setVoitures(updatedVoitures);
    } catch (error) {
      console.error('Error deleting voiture:', error);
    }
  };

  const handleAddVoiture = () => {
    setShowAddPopup(true);
  };

  const closeAddPopup = () => {
    setShowAddPopup(false);
  };

  const handleSubmitAddVoiture = async () => {
    try {
      const response = await fetch(`http://localhost:8080/voitures`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editedVoiture)
      });
      if (!response.ok) {
        throw new Error('Failed to add voiture');
      }
      const newVoiture = await response.json();
      setVoitures([...voitures, newVoiture]);
      setShowAddPopup(false);
    } catch (error) {
      console.error('Error adding voiture:', error);
    }
  };

  return (
    <>
      <h1>Wagon Information</h1>
      {showAddPopup && (
        <div className="popup">
          <div className="popup-inner">
            <h2>Add Wagon</h2>
           
            <input
              type="nombre"
              placeholder="Numero de Wagon"
              value={editedVoiture.numVoiture}
              onChange={e => setEditedVoiture({...editedVoiture, numVoiture: e.target.value})}
            />
            <input
              type="Nombre"
              placeholder="Nombre Total de place"
              value={editedVoiture.nbPlaceTotal}
              onChange={e => setEditedVoiture({...editedVoiture, nbPlaceTotal: e.target.value})}
            />
             <input
              type="Nombre"
              placeholder="Nombre de places vides"
              value={editedVoiture.nbPlaceVide}
              onChange={e => setEditedVoiture({...editedVoiture, nbPlaceVide: e.target.value})}
            />
             <input
              type="Nombre"
              placeholder="Numero de classe"
              value={editedVoiture.classe}
              onChange={e => setEditedVoiture({...editedVoiture, classe: e.target.value})}
            />
             <select
            value={editedVoiture.train.id}
            onChange={e => setEditedVoiture({...editedVoiture, train:{ id:e.target.value}})}
          >
            <option value="">Select Train</option>
            {trains.map(train => (
              <option key={train.id} value={train.id}>{train.nom}</option>
            ))}
          </select>


           
            <button onClick={handleSubmitAddVoiture}>Add</button>
            <button onClick={closeAddPopup}>Cancel</button>
          </div>
        </div>
      )}
      <button onClick={handleAddVoiture}>Add Wagon</button>
      <table className="user-table">
        <thead>
          <tr>
            <th>Numero de Wagon</th>
            <th>Nombre total de place</th>
            <th>Nombre de places vides</th>
            <th>Numero de classe</th>
            <th>Train</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {voitures.map(voitures => (
            <tr key={voitures.id}>

              <td>{editingId === voitures.id ? <input value={editedVoiture.numVoiture} onChange={e => setEditedVoiture({...editedVoiture, numVoiture: e.target.value})} /> : voitures.numVoiture}</td>
              <td>{editingId === voitures.id ? <input value={editedVoiture.nbPlaceTotal} onChange={e => setEditedVoiture({...editedVoiture, nbPlaceTotal: e.target.value})} /> : voitures.nbPlaceTotal}</td>
              <td>{editingId === voitures.id ? <input value={editedVoiture.nbPlaceVide} onChange={e => setEditedVoiture({...editedVoiture, nbPlaceVide: e.target.value})} /> : voitures.nbPlaceVide}</td>
              <td>{editingId === voitures.id ? <input value={editedVoiture.classe} onChange={e => setEditedVoiture({...editedVoiture, classe: e.target.value})} /> : voitures.classe}</td>
              <td>{editingId === voitures.id ? <input value={editedVoiture.train.id} onChange={e => setEditedVoiture({...editedVoiture, train:{ id:e.target.value}})} /> : voitures.train.nom}</td>

              <td>
                {editingId === voitures.id ? (
                  <>
                    <button onClick={handleSaveEdit}>Save</button>
                    <button onClick={handleCancelEdit}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(voitures.id)}>Edit</button>
                    <button onClick={() => handleDelete(voitures.id)}>Delete</button>
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

export default Voiture;
