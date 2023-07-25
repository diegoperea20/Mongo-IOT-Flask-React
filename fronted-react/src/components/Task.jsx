import React, { useEffect, useState } from 'react';
import "../task.css";
// Conection to backend flask
const API_URL = import.meta.env.VITE_REACT_APP_API;

function Task() {
    const [user, setUser] = useState('');
    const [id, setId] = useState('');
    const [token, setToken] = useState('');



    useEffect(() => {
      const storedUser = localStorage.getItem('user');
      const storedId = localStorage.getItem('id');
      const storedToken = localStorage.getItem('token');
  
      if (!storedUser && !storedId) {
        // Si no se encuentra el nombre de usuario en el almacenamiento local, redirigir al inicio de sesión
        window.location.replace('/');
      } else {
        // Si se encuentra el nombre de usuario, establecer el estado del usuario
        setUser(storedUser);
        setId(storedId);
        setToken(storedToken);
      }
  
    }, []);

    
      const home=() => {
        window.location.href = '/home';
      } 

      //tasks
  const [name, setName] = useState("");
  const [code, setCode] = useState("");


  const[editing , setEditing] = useState(false);
  const[id_node , setId_node] = useState('');

  const [allnodes, setAllnodes] = useState([]);
 

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (!editing){
      const response = await fetch(`${API_URL}/allnode`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user,
          code,
          name,
        }),
      })
      const data = await response.json();
      console.log(data);
      setName('');
      setCode('');
      if (response.status === 409) {
        window.alert('code already exists');
      }
      const response_table = await fetch(`${API_URL}/tablecode`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
         
         code
          
        }),
      })

      const data_table = await response_table.json();
      console.log(data_table);
      if (response_table.status !== 200){ 
        window.alert('code already exists');
      }


    } else {
      const response = await fetch(`${API_URL}/allnode/${id_node}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name
        }),
      })
      const data = await response.json();
      console.log(data);
      setEditing(false);
      setId_node('');
      setName('');
      setCode('');
    }

    await getNodes();
    
  };

  const getNodes = async (user) => {
    const response = await fetch(`${API_URL}/allnode/${user}`);
    const data = await response.json();
    setAllnodes(data);
  };

  useEffect(() => {
    getNodes(user);
  },  );


  const deleteNode = async (id_node,code) => {
    const response = await fetch(`${API_URL}/allnode/${id_node}`, {
      method: "DELETE",
    });
    const data = await response.json();
    console.log(data);
    
    const response_delete = await fetch(`${API_URL}/tablecode/${code}`, {
      method: "DELETE",
    });

    const data_table_delete = await response_delete.json();
    console.log(data_table_delete);
    await getNodes(user);



  };

  const editTask = async (id_node, user) => {
    const response = await fetch(`${API_URL}/allnode/${id_node}/${user}`);
    const data = await response.json();
    console.log(data);
    
    // Verifica que la respuesta contenga al menos un objeto
    if (data.length > 0) {
      const task = data[0];

      // Captura el id y title desde el objeto task
       const name = task.name || '';
      const code = task.code || '';

      setEditing(true);
      setId_node(id_node);
      setName(name);
      setCode(code || ''); // Asegurar que el valor esté definido
    }
  };
   
  
   const canceledit=() => {
        setEditing(false);
         setName('');
      setCode('');
      }


    const show = async (code) => {
     console.log(code);
     localStorage.setItem('code', code);
     window.location.href = '/home/task/show';
    };      

  return (
    <div className="darkTheme">
    <h1>Nodes</h1>
    
    <button onClick={home}>Home</button>
    <br/>
    <br/>
    <div >
      <form onSubmit={handleSubmit}>
        <h3>Name node</h3>
              <input
          
          type="text"
          onChange={(e) => setName(e.target.value)}
          value={name } // Agrega el operador ?? para proporcionar un valor predeterminado
          placeholder="Add a name"
          autoFocus
        />

        <br/>
        <h3>Code</h3>
        <input
          
          type="text"
          onChange={e => setCode(e.target.value)}
          value={code}
          placeholder="Add a code"
          disabled={editing} // Agrega el atributo disabled
        />
        <br/>
        <br/>
        <button className={editing ? "update" : ""}>
          {editing ?"Update" : "Create"}
        </button>
      </form>
      <br/>
      {editing && (
        <button  className="canceledit" onClick={canceledit}>
          Cancel Edit
        </button>
      )}
    </div>
    <br/>
    <br/>

    <div>
      <div className='table-container'>
      <table >
        <thead>
          <tr>
            <th>Name</th>
            <th>Code</th>
            <th>Operations</th>
          </tr>
        </thead>
        <tbody>
          {allnodes.map(parameter => (
            <tr key={parameter.id}>
              <td className="justified">{parameter.name}</td>
              <td className="justified">{parameter.code}</td>
              <td>
              <button className="update" onClick={(e) => editTask(parameter.id, parameter.user) }>Edit</button>

              <button className="delete" onClick={(e) => deleteNode(parameter.id, parameter.code)}>Delete</button>

              <button  onClick={(e) => show(parameter.code)}>Show</button>

              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
    </div>
  )
}

export default Task