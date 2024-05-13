import React, { useEffect, useState } from 'react';
import './users.scss'; // Importer le fichier SCSS pour styliser le tableau

const Train = () => {
  const [trains, setTrain] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedTrain, setEditedTrain] = useState({
    nom:'',
    nbVoiture: '',
    nbPlaceTotal: '',
    nbPlaceVide: ''
  });
  const [showAddPopup, setShowAddPopup] = useState(false);

  useEffect(() => {
    const fetchTrains = async () => {
      try {
        const response = await fetch('http://localhost:8080/trains');
        if (!response.ok) {
          throw new Error('Failed to fetch trains');
        }
        const data = await response.json();
        setTrain(data);
      } catch (error) {
        console.error('Error fetching trains:', error);
      }
    };

    fetchTrains();
  }, []);

  const handleEdit = (id) => {
    setEditingId(id);
    const trainToEdit = trains.find(trains => trains.id === id);
    setEditedTrain(trainToEdit);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditedTrain({
      nom:'',
        nbVoiture: '',
        nbPlaceTotal: '',
        nbPlaceVide: ''
    });
  };

  const handleSaveEdit = async () => {
    try {
      const response = await fetch(`http://localhost:8080/trains/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editedTrain)
      });
      if (!response.ok) {
        throw new Error('Failed to update train');
      }
      const updatedTrain = await response.json();
      const updatedTrains = trains.map(Train=> Train.id === editingId ? updatedTrain : Train);
      setTrain(updatedTrains);
      setEditingId(null);
      setEditedTrain({
        nom:'',
        nbVoiture: '',
    nbPlaceTotal: '',
    nbPlaceVide: ''
      });
    } catch (error) {
      console.error('Error updating train:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/trains/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Failed to delete train');
      }
      const updatedTrains = trains.filter(train => train.id !== id);
      setTrain(updatedTrains);
    } catch (error) {
      console.error('Error deleting train:', error);
    }
  };

  const handleAddTrain = () => {
    setShowAddPopup(true);
  };

  const closeAddPopup = () => {
    setShowAddPopup(false);
  };

  const handleSubmitAddTrain = async () => {
    try {
      const response = await fetch(`http://localhost:8080/trains`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editedTrain)
      });
      if (!response.ok) {
        throw new Error('Failed to add train');
      }
      const newTrain= await response.json();
      setTrain([...trains, newTrain]);
      setShowAddPopup(false);
    } catch (error) {
      console.error('Error adding train:', error);
    }
  };

  return (
    <>
      <h1>Train Information</h1>
      {showAddPopup && (
        <div className="popup">
          <div className="popup-inner">
            <h2>Add Train</h2>
            <input
              type="nombre"
              placeholder="Nom de voiture "
              value={editedTrain.nom}
              onChange={e => setEditedTrain({...editedTrain, nom: e.target.value})}
            />
            <input
              type="nombre"
              placeholder="Nombre de voiture "
              value={editedTrain.nbVoiture}
              onChange={e => setEditedTrain({...editedTrain, nbVoiture: e.target.value})}
            />
             <input
              type="nombre"
              placeholder="Nombre de Places vides "
              value={editedTrain.nbPlaceVide}
              onChange={e => setEditedTrain({...editedTrain, nbPlaceVide: e.target.value})}
            />
             <input
              type="nombre"
              placeholder="Nombre de place total"
              value={editedTrain.nbPlaceTotal}
              onChange={e => setEditedTrain({...editedTrain, nbPlaceTotal: e.target.value})}
            />
           
            <button onClick={handleSubmitAddTrain}>Add</button>
            <button onClick={closeAddPopup}>Cancel</button>
          </div>
        </div>
      )}
      <button onClick={handleAddTrain}>Add Train</button>
      <table className="user-table">
        <thead>
          <tr>
          <th>Nom de Train </th>
          <th>Nombre de voiture </th>
            <th>Nombre de Place vide</th>
            <th>Nombre de place total </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {trains.map(trains => (
            <tr key={trains.id}>
              <td>{editingId === trains.id ? <input value={editedTrain.nom} onChange={e => setEditedTrain({...editedTrain, nom: e.target.value})} /> : trains.nom}</td>
              <td>{editingId === trains.id ? <input value={editedTrain.nbVoiture} onChange={e => setEditedTrain({...editedTrain, nbVoiture: e.target.value})} /> : trains.nbVoiture}</td>
              <td>{editingId === trains.id ? <input value={editedTrain.nbPlaceVide} onChange={e => setEditedTrain({...editedTrain, nbPlaceVide: e.target.value})} /> : trains.nbPlaceVide}</td>
              <td>{editingId === trains.id ? <input value={editedTrain.nbPlaceTotal} onChange={e => setEditedTrain({...editedTrain, nbPlaceTotal: e.target.value})} /> : trains.nbPlaceTotal}</td>
              <td>
                {editingId === trains.id ? (
                  <>
                    <button onClick={handleSaveEdit}>Save</button>
                    <button onClick={handleCancelEdit}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(trains.id)}>Edit</button>
                    <button onClick={() => handleDelete(trains.id)}>Delete</button>
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

export default Train;
