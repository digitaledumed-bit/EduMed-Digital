import React from 'react';
import { BetowaPortalHome } from '../public/BetowaPortalHome';

interface LoginScreenProps {
  onReplaySplash?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onReplaySplash }) => {
  return <BetowaPortalHome onReplaySplash={onReplaySplash} />;
};

export default LoginScreen;
