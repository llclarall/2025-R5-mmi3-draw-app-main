import { useDrawSettingsStore } from "../../../../store/useDrawSettingsStore";

export function DrawToolbar() {
  const { color, strokeWidth, /* isEraser, */ setColor, setStrokeWidth, /* setIsEraser, */ triggerClearCanvas } = useDrawSettingsStore();

  const colors = ['#000000', '#ff0000', '#00ff00', '#0000ff', '#ffaa00'];

  return (
    <div className="flex gap-4 p-4 bg-white border-b items-center">

      {/* sélection des couleurs */}
      <div className="flex gap-2">
        {colors.map((c) => (
          <button
            key={c}
            onClick={() => setColor(c)}
            style={{ 
              backgroundColor: c, 
              width: '24px', 
              height: '24px', 
              border: color === c ? '2px solid gray' : '1px solid #ccc',
              borderRadius: '50%' 
            }}
          />
        ))}
      </div>

      {/* bouton gomme */}
      {/* <button 
        onClick={() => setIsEraser(!isEraser)}
        className={`p-2 rounded border ${isEraser ? 'bg-blue-100 border-blue-500' : 'bg-gray-50'}`}
      >
        {isEraser ? '🧽 Gomme Active' : '✏️ Pinceau'}
      </button> */}

      {/* sélection de la taille */}
      <div className="flex items-center gap-2">
        <label className="text-sm">Taille:</label>
        <input 
          type="range" min="1" max="20" 
          value={strokeWidth} 
          onChange={(e) => setStrokeWidth(Number(e.target.value))} 
        />
        <span className="text-sm w-4">{strokeWidth}</span>
      </div>

      {/* btn tt effacer */}
      {/* <button 
        onClick={triggerClearCanvas}
        className="ml-auto p-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
      >
        🗑️ Tout effacer
      </button> */}
    </div>
  );
}