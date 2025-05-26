import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Lock } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const LoginForm: React.FC = () => {
  const { login } = useApp();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    // Simulate a small delay to show loading state
    setTimeout(() => {
      const success = login(password);
      
      if (!success) {
        setError('Incorrect password. Please try again.');
      }
      
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white flex flex-col items-center justify-center p-4">
      <Link to="/" className="mb-8 text-rose-500 hover:text-rose-600 transition-colors">
        ← Back to Registry
      </Link>
      
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-center mb-6">
          <div className="bg-rose-100 p-3 rounded-full">
            <Lock className="h-8 w-8 text-rose-500" />
          </div>
        </div>
        
        <h2 className="text-2xl font-serif text-center text-gray-800 mb-6">
          Admin Access
        </h2>
        
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-300 focus:border-rose-500 outline-none transition"
              placeholder="Enter admin password"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-rose-500 hover:bg-rose-600 text-white font-medium text-center rounded-md transition-colors duration-300 disabled:bg-rose-300"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </div>
            ) : (
              'Login'
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>This area is restricted to wedding registry administrators.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;