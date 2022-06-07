import { useContext } from 'react';
import { AppContext } from '../contexts/AppProvider';

export default function useAppContext() {
  return useContext(AppContext);
}