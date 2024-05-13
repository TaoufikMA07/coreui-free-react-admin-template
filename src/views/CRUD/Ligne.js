import React, { useEffect, useState } from 'react';
import './users.scss'; // Importer le fichier SCSS pour styliser le tableau

const Ligne = () => {
  const [Lignes, setLignes] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedLigne, seteditedLigne] = useState({
    gareDepart: '',
    gareArrive: '',
    date_depart: '',
    date_arrivee:'',
    train: { id: '' }

  });
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [trains, setTrains] = useState([]);
  const [gares, setGares] = useState([]);


  useEffect(() => {
    const fetchLignes = async () => {
      try {
        const response = await fetch('http://localhost:8080/lignes');
        if (!response.ok) {
          throw new Error('Failed to fetch Lignes');
        }
        const data = await response.json();
        setLignes(data);
      } catch (error) {
        console.error('Error fetching Lignes:', error);
      }
    };

    fetchLignes();
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

  useEffect(() => {
    const fetchTrains = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/gares');
        if (!response.ok) {
          throw new Error('Failed to fetch trains');
        }  
        const data = await response.json();
        setGares(data);
      } catch (error) {
        console.error('Error fetching trains:', error);
      }
    };

    fetchTrains();
  }, []);

  const handleEdit = (id) => {
    setEditingId(id);
    const ligneToEdit = Lignes.find(ligne => ligne.id === id);
    seteditedLigne(ligneToEdit);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    seteditedLigne({
        gareDepart: '',
        gareArrive: '',
        date_depart: '',
        date_arrivee:'',
        train: { id: '' }
    });
  };

  const handleSaveEdit = async () => {
    try {
      const response = await fetch(`http://localhost:8080/lignes/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editedLigne)
      });
      if (!response.ok) {
        throw new Error('Failed to update ligne');
      }
      const updatedligne = await response.json();
      const updatedLignes = Lignes.map(ligne => ligne.id === editingId ? updatedligne : ligne);
      setLignes(updatedLignes);
      setEditingId(null);
      seteditedLigne({
        gareDepart: '',
        gareArrive: '',
        date_depart: '',
        date_arrivee:'',
        train: { id: '' }
      });
    } catch (error) {
      console.error('Error updating ligne:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/lignes/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Failed to delete ligne');
      }
      const updatedLignes = Lignes.filter(ligne => ligne.id !== id);
      setLignes(updatedLignes);
    } catch (error) {
      console.error('Error deleting ligne:', error);
    }
  };

  const handleAddligne = () => {
    setShowAddPopup(true);
  };

  const closeAddPopup = () => {
    setShowAddPopup(false);
  };

  const handleSubmitAddligne = async () => {
    try {
      const response = await fetch(`http://localhost:8080/lignes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editedLigne)
      });
      if (!response.ok) {
        throw new Error('Failed to add ligne');
      }
      const newligne = await response.json();
      setLignes([...Lignes, newligne]);
      setShowAddPopup(false);
    } catch (error) {
      console.error('Error adding ligne:', error);
    }
  };

  return (
    <>
      <h1>ligne Information</h1>
      {showAddPopup && (
        <div className="popup">
          <div className="popup-inner">
            <h2>Add ligne</h2>
          
          
            <select
              value={editedLigne.gareDepart}
              onChange={e => seteditedLigne({...editedLigne, gareDepart: e.target.value})}
            >
            <option value="">Select Gare de Depart</option>
            {gares.map(gare => (
              <option key={gare.id} value={gare.nom}>{gare.nom}</option>
            ))}
          </select>

          <select
             value={editedLigne.gareArrive}
             onChange={e => seteditedLigne({...editedLigne,gareArrive: e.target.value})}
            >
            <option value="">Select Gare d'arrivee</option>
            {gares.map(gare => (
              <option key={gare.id} value={gare.nom}>{gare.nom}</option>
            ))}
          </select>


            

            <input
              type="Date"
              placeholder="Date de départ"
              value={editedLigne.date_depart}
              onChange={e => seteditedLigne({...editedLigne, date_depart: e.target.value})}
            />
            <input
              type="Date"
              placeholder="Date d'arrivee"
              value={editedLigne.date_arrivee}
              onChange={e => seteditedLigne({...editedLigne, date_arrivee: e.target.value})}
            />
            <select
            value={editedLigne.train.id}
            onChange={e => seteditedLigne({...editedLigne, train:{ id:e.target.value}})}
          >
            <option value="">Select Train</option>
            {trains.map(train => (
              <option key={train.id} value={train.id}>{train.nom}</option>
            ))}
          </select>
          
            <button onClick={handleSubmitAddligne}>Add</button>
            <button onClick={closeAddPopup}>Cancel</button>
          </div>
        </div>
      )}
      <button onClick={handleAddligne}>Add ligne</button>
      <table className="user-table">
        <thead>
          <tr>
            <th>Gare de depart </th>
            <th>Gare d'arrivee</th>
            <th>Date de depart</th>
            <th>Date d'arrivee</th>
            <th>Train</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Lignes.map(ligne => (
            <tr key={ligne.id}>
              <td>{editingId === ligne.id ? <input value={editedLigne.nom} onChange={e => seteditedLigne({...editedLigne, gareDepart: e.target.value})} /> : ligne.gareDepart}</td>
              <td>{editingId === ligne.id ? <input value={editedLigne.prenom} onChange={e => seteditedLigne({...editedLigne, gareArrive: e.target.value})} /> : ligne.gareArrive}</td>
              <td>{editingId === ligne.id ? <input value={editedLigne.age} onChange={e => seteditedLigne({...editedLigne, date_depart: e.target.value})} /> : ligne.date_depart}</td>
              <td>{editingId === ligne.id ? <input value={editedLigne.email} onChange={e => seteditedLigne({...editedLigne, date_arrivee: e.target.value})} /> : ligne.date_arrivee}</td>
              <td>{editingId === ligne.id ? <input value={editedLigne.train.id} onChange={e => seteditedLigne({...editedLigne, train:{ id:e.target.value}})} /> : ligne.train.nom}</td>

              <td>
                {editingId === ligne.id ? (
                  <>
                    <button onClick={handleSaveEdit}>Save</button>
                    <button onClick={handleCancelEdit}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(ligne.id)}>Edit</button>
                    <button onClick={() => handleDelete(ligne.id)}>Delete</button>
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

export default Ligne;
