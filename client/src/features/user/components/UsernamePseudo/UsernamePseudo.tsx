import { useState } from 'react';

type UsernamePseudoProps = {
  onConfirm: (username: string) => void;
  isOpen: boolean;
};

export function UsernamePseudo({ onConfirm, isOpen }: UsernamePseudoProps) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    const trimmedUsername = username.trim();
    
    if (!trimmedUsername) {
      setError('Veuillez entrer un pseudo');
      return;
    }
    
    if (trimmedUsername.length < 2) {
      setError('Le pseudo doit contenir au moins 2 caractères');
      return;
    }

    if (trimmedUsername.length > 20) {
      setError('Le pseudo ne peut pas dépasser 20 caractères');
      return;
    }

    onConfirm(trimmedUsername);
    setUsername('');
    setError('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleConfirm();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-96 max-w-full mx-4">
        <h2 className="text-2xl font-bold mb-4">Choisir votre pseudo</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2 text-gray-700">Pseudo:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder="Entrez votre pseudo..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
}