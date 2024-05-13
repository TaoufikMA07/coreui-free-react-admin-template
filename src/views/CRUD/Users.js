import React, { useEffect, useState } from 'react';
import './users.scss'; // Importer le fichier SCSS pour styliser le tableau
import routes from '../../routes'

const Users = () => {
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedUser, setEditedUser] = useState({
    nom: '',
    prenom: '',
    age: '',
    email: '',
    password: ''
  });
  const [showAddPopup, setShowAddPopup] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:8080/users');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsers(data);
       
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleEdit = (id) => {
    setEditingId(id);
    const userToEdit = users.find(user => user.id === id);
    setEditedUser(userToEdit);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditedUser({
      nom: '',
      prenom: '',
      age: '',
      email: '',
      password: ''
    });
  };

  const handleSaveEdit = async () => {
    try {
      const response = await fetch(`http://localhost:8080/users/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editedUser)
      });
      if (!response.ok) {
        throw new Error('Failed to update user');
      }
      const updatedUser = await response.json();
      const updatedUsers = users.map(user => user.id === editingId ? updatedUser : user);
      setUsers(updatedUsers);
      setEditingId(null);
      setEditedUser({
        nom: '',
        prenom: '',
        age: '',
        email: '',
        password: ''
      });
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/users/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
      const updatedUsers = users.filter(user => user.id !== id);
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleAddUser = () => {
    setShowAddPopup(true);
  };

  const closeAddPopup = () => {
    setShowAddPopup(false);
  };

  const handleSubmitAddUser = async () => {
    try {
      const response = await fetch(`http://localhost:8080/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editedUser)
      });
      if (!response.ok) {
        throw new Error('Failed to add user');
      }
      const newUser = await response.json();
      setUsers([...users, newUser]);
      setShowAddPopup(false);
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  return (
    <>
      <h1>User Information</h1>
      {showAddPopup && (
        <div className="popup">
          <div className="popup-inner">
            <h2>Add User</h2>
            <input
              type="text"
              placeholder="Nom"
              value={editedUser.nom}
              onChange={e => setEditedUser({...editedUser, nom: e.target.value})}
            />
            <input
              type="text"
              placeholder="Prénom"
              value={editedUser.prenom}
              onChange={e => setEditedUser({...editedUser, prenom: e.target.value})}
            />
            <input
              type="text"
              placeholder="Âge"
              value={editedUser.age}
              onChange={e => setEditedUser({...editedUser, age: e.target.value})}
            />
            <input
              type="email"
              placeholder="Email"
              value={editedUser.email}
              onChange={e => setEditedUser({...editedUser, email: e.target.value})}
            />
            <input
              type="password"
              placeholder="Mot de passe"
              value={editedUser.password}
              onChange={e => setEditedUser({...editedUser, password: e.target.value})}
            />
            <button onClick={handleSubmitAddUser}>Add</button>
            <button onClick={closeAddPopup}>Cancel</button>
          </div>
        </div>
      )}
      <button onClick={handleAddUser}>Add User</button>
      <table className="user-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Âge</th>
            <th>Email</th>
            <th>Mot de passe</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{editingId === user.id ? <input value={editedUser.nom} onChange={e => setEditedUser({...editedUser, nom: e.target.value})} /> : user.nom}</td>
              <td>{editingId === user.id ? <input value={editedUser.prenom} onChange={e => setEditedUser({...editedUser, prenom: e.target.value})} /> : user.prenom}</td>
              <td>{editingId === user.id ? <input value={editedUser.age} onChange={e => setEditedUser({...editedUser, age: e.target.value})} /> : user.age}</td>
              <td>{editingId === user.id ? <input value={editedUser.email} onChange={e => setEditedUser({...editedUser, email: e.target.value})} /> : user.email}</td>
              <td>{editingId === user.id ? <input value={editedUser.password} onChange={e => setEditedUser({...editedUser, password: e.target.value})} /> : user.password}</td>
              <td>
                {editingId === user.id ? (
                  <>
                    <button onClick={handleSaveEdit}>Save</button>
                    <button onClick={handleCancelEdit}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(user.id)}>Edit</button>
                    <button onClick={() => handleDelete(user.id)}>Delete</button>
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

export default Users;
