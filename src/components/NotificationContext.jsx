import React, { createContext, useContext, useReducer } from 'react';

const SET_NOTIFICATION = 'SET_NOTIFICATION';
const CLEAR_NOTIFICATION = 'CLEAR_NOTIFICATION';

const initialState = {
  message: null,
  type: null,
};

const notificationReducer = (state, action) => {
  switch (action.type) {
    case SET_NOTIFICATION:
      return { message: action.payload.message, type: action.payload.type };
    case CLEAR_NOTIFICATION:
      return { ...state, message: null, type: null };
    default:
      return state;
  }
};

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  const setNotification = (message, type, timeout = 5000) => {
    dispatch({ type: SET_NOTIFICATION, payload: { message, type } });
    setTimeout(() => {
      dispatch({ type: CLEAR_NOTIFICATION });
    }, timeout);
  };

  return (
    <NotificationContext.Provider value={{ notification: state, setNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  return useContext(NotificationContext);
};