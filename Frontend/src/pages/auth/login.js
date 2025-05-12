import { useState } from 'react';
import { authAPI } from '../../api/auth';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';

export default function Login() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await authAPI.login(credentials);
      login(response.data.token, response.data.user);
      toast.success('Logged in successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Your login form JSX
  );
}