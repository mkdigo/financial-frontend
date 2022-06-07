import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthProvider';

export default function useAuthContext () {
  return useContext(AuthContext);
}