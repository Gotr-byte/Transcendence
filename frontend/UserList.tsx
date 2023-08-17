import React, { useEffect, useState } from "react"

const UserList = () => {
  const [users, setUsers] = useState([])

  const fetchUserData = () => {
    fetch("http://localhost:4000/users")
      .then(response => {
        return response.json()
      })
      .then(data => {
        setUsers(data)
      })
  }

  useEffect(() => {
    fetchUserData()
  }, [])

  return (
    <div>
      {users.length > 0 && (
        <ul>
          {users.map(user => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UserList;

// import React, { useEffect, useState } from "react";
// import axios from 'axios';

// const App = () => {
//   const [users, setUsers] = useState([]);
//   const [name, setName] = useState('');

//   const fetchUserData = () => {
//     fetch("http://localhost:4000/users")
//       .then(response => response.json())
//       .then(data => {
//         setUsers(data)
//       })
//   }

//   const addUser = () => {
//     axios.post('http://localhost:4000/users', {
//       name,
//     }).then(response => {
//       // Add the new user to the local state.
//       setUsers(prevUsers => [...prevUsers, response.data])
//       setName('') // Reset the form
//     }).catch(err => {
//       console.error(err)
//     });
//   }

//   const handleNameChange = (event) => {
//     setName(event.target.value)
//   }

//   const handleFormSubmit = (event) => {
//     event.preventDefault();
//     addUser();
//   }

//   useEffect(() => {
//     fetchUserData();
//   }, [])

//   return (
//     <div>
//       <form onSubmit={handleFormSubmit}>
//         <input type="text" value={name} onChange={handleNameChange} />
//         <button type="submit">Add User</button>
//       </form>
      
//       {users.length > 0 && (
//         <ul>
//           {users.map(user => (
//             <li key={user.id}>{user.name}</li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

// export default App;
