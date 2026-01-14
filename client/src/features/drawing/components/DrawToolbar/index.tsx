import { useDrawSettingsStore } from "../../../../store/useDrawSettingsStore";

export function DrawToolbar() {
  const { color, strokeWidth, isEraser, setColor, setStrokeWidth, setIsEraser, triggerClearCanvas } = useDrawSettingsStore();

  const colors = [
    { value: '#000000', name: 'Noir' },
    { value: '#ff0000', name: 'Rouge' },
    { value: '#00ff00', name: 'Vert' },
    { value: '#0000ff', name: 'Bleu' },
    { value: '#ffaa00', name: 'Orange' },
    { value: '#ff00ff', name: 'Magenta' },
    { value: '#00ffff', name: 'Cyan' },
    { value: '#ffffff', name: 'Blanc' },
  ];

  return (
    <div className="flex flex-wrap gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-300 items-center shadow-sm mb-8">

      {/* sélection des couleurs */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-gray-700">Couleur:</span>
        <div className="flex gap-2">
          {colors.map((c) => (
            <button
              key={c.value}
              onClick={() => {
                setColor(c.value);
                setIsEraser(false);
              }}
              title={c.name}
              className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-full"
              style={{ 
                backgroundColor: c.value, 
                width: '32px', 
                height: '32px', 
                border: color === c.value && !isEraser ? '3px solid #3b82f6' : '2px solid #d1d5db',
                borderRadius: '50%',
                boxShadow: color === c.value && !isEraser ? '0 0 0 2px rgba(59, 130, 246, 0.3)' : 'none',
                outline: c.value === '#ffffff' ? '1px solid #e5e7eb' : 'none'
              }}
            />
          ))}
        </div>
      </div>

      <div className="h-8 w-px bg-gray-300"></div>

      {/* bouton gomme */}
      <button 
        onClick={() => setIsEraser(true)}
        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
          isEraser 
            ? 'bg-purple-500 text-white shadow-md hover:bg-purple-600' 
            : 'bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50'
        }`}
      >
        <span>🧽</span>
        <span>Gomme</span>
      </button>

      <div className="h-8 w-px bg-gray-300"></div>

      {/* sélection de la taille */}
      <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg border border-gray-300">
        <label className="text-sm font-semibold text-gray-700">Épaisseur:</label>
        <input 
          type="range" 
          min="1" 
          max="20" 
          value={strokeWidth} 
          onChange={(e) => setStrokeWidth(Number(e.target.value))} 
          className="w-24 accent-blue-500"
        />
        <span className="text-sm font-bold text-gray-700 w-6 text-center">{strokeWidth}</span>
        <div 
          className="rounded-full bg-gray-700"
          style={{ 
            width: `${Math.max(strokeWidth, 4)}px`, 
            height: `${Math.max(strokeWidth, 4)}px` 
          }}
        ></div>
      </div>

      {/* bouton Tout effacer */}
      <button 
        onClick={triggerClearCanvas}
        className="ml-auto px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
      >
        <span>🗑️</span>
        <span>Tout effacer</span>
      </button>
    </div>
  );
}