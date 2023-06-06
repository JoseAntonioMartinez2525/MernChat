import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
const [username, setUsername] = useState(null);
  const [id, setId] = useState(null);
  useEffect(() => {
    
    axios.get('/profile').then(response => {
    setId(response.data.userId);     
    setUsername(response.data.username);

    });
  }, []);
  return (
    <UserContext.Provider value={{ username, setUsername, id, setId }}>
      {children}
    </UserContext.Provider>
  );
}

// Agrega la validación de tipos de props
UserContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
