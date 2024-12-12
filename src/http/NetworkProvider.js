import React, {useState, useEffect} from 'react';
import NetInfo from '@react-native-community/netinfo';

export const NetworkContext = React.createContext({isConnected: true});

export const NetworkProvider = props => {
  const [isConnected, setConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(handleConnectivityChange);
    return () => {
      unsubscribe();
    };
  });

  const handleConnectivityChange = connected => setConnected(connected);

  return (
    <NetworkContext.Provider value={isConnected}>
      {props.children}
    </NetworkContext.Provider>
  );
};
