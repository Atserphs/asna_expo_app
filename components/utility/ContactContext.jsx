import { createContext, useContext, useState } from 'react';

const ContactContext = createContext();

export const ContactProvider = ({ children }) => {
  const [selectedContact, setSelectedContact] = useState([]);
  const [contactSelectedFlag, setContactSelectedFlag] = useState(false); // ✅ New flag

  return (
    <ContactContext.Provider value={{
      selectedContact,
      setSelectedContact,
      contactSelectedFlag,
      setContactSelectedFlag, // ✅ expose the setter
    }}>
      {children}
    </ContactContext.Provider>
  );
};

export const useContact = () => useContext(ContactContext);
