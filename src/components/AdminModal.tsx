import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Lock,
  Plus,
  Trash2,
  X,
  PlusCircle,
  MinusCircle,
  PackageCheck,
  RotateCcw,
  Image as ImageIcon,
  Check,
  AlertCircle,
  LogOut,
} from 'lucide-react';
import { Dessert } from '../types';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  desserts: Dessert[];
  onUpdateDesserts: (desserts: Dessert[]) => void;
  onResetDefaults: () => void;
}

const PRESET_PHOTOS = [
  { label: 'Logo Frada', url: '/assets/aistudio/IMG_2254_9e1ac89f.JPG' },
  { label: 'Menú Frada 3D', url: '/assets/aistudio/be4b200f-fedb-4a63-9a60-189315f86ab5_e3b6c00f.jpg' },
  { label: 'Mosaico Frutos', url: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80' },
  { label: 'Cítricos & Vainilla', url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80' },
  { label: 'Mousse Frutos Rojos', url: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=600&q=80' },
  { label: 'Café & Cacao', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80' },
];

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  desserts,
  onUpdateDesserts,
  onResetDefaults,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [activeTab, setActiveTab] = useState<'inventory' | 'add'>('inventory');

  // Form state for adding new dessert
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState<number | ''>(9500);
  const [newStock, setNewStock] = useState<number | ''>(10);
  const [newImageUrl, setNewImageUrl] = useState(PRESET_PHOTOS[0].url);
  const [newDescription, setNewDescription] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePinInput = (num: string) => {
    if (pin.length < 4) {
      const nextPin = pin + num;
      setPin(nextPin);
      setPinError(false);

      if (nextPin.length === 4) {
        if (nextPin === '1534') {
          setIsAuthenticated(true);
          setPin('');
        } else {
          setPinError(true);
          setTimeout(() => {
            setPin('');
            setPinError(false);
          }, 800);
        }
      }
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  const handleClearPin = () => {
    setPin('');
    setPinError(false);
  };

  const handleClose = () => {
    setIsAuthenticated(false);
    setPin('');
    setPinError(false);
    onClose();
  };

  // Stock operations
  const handleStockChange = (dessertId: string, delta: number) => {
    const updated = desserts.map((d) => {
      if (d.id === dessertId) {
        const nextStock = Math.max(0, d.stock + delta);
        return { ...d, stock: nextStock };
      }
      return d;
    });
    onUpdateDesserts(updated);
  };

  const handleDeleteDessert = (dessertId: string) => {
    if (desserts.length <= 1) {
      alert('Debe quedar al menos 1 postre en el menú.');
      return;
    }
    const updated = desserts.filter((d) => d.id !== dessertId);
    onUpdateDesserts(updated);
  };

  const handleRestockAll = () => {
    const updated = desserts.map((d) => ({
      ...d,
      stock: d.stock + 5,
    }));
    onUpdateDesserts(updated);
  };

  const handleAddNewDessert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || newPrice === '' || newStock === '') return;

    const newDessert: Dessert = {
      id: `frada-custom-${Date.now()}`,
      name: newName.trim(),
      price: Number(newPrice),
      stock: Number(newStock),
      imageUrl: newImageUrl.trim() || PRESET_PHOTOS[0].url,
      description: newDescription.trim() || 'Exquisita creación artesanal de Frada hecha con amor.',
      category: 'Especial Artesanal',
    };

    onUpdateDesserts([newDessert, ...desserts]);
    setFormSuccess(true);

    // Reset form
    setNewName('');
    setNewPrice(9500);
    setNewStock(10);
    setNewDescription('');

    setTimeout(() => {
      setFormSuccess(false);
      setActiveTab('inventory');
    }, 1000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setNewImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        className="glass-94 relative w-full max-w-2xl rounded-[67px] p-7 sm:p-9 text-[#4A2E18] my-8"
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/80 border border-[#FBE0E7] flex items-center justify-center text-[#78543B] hover:bg-rose-50 hover:text-rose-600 transition active:scale-95 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* PIN Authentication Screen */}
        {!isAuthenticated ? (
          <div className="flex flex-col items-center py-6 text-center">
            <div className="w-16 h-16 rounded-full bg-[#FFF3BF] border-2 border-[#FDE68A] flex items-center justify-center text-[#7A4B29] mb-4 shadow-sm">
              <Lock className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-extrabold text-[#4A2E18] font-serif-title">
              Panel Administrativo
            </h3>
            <p className="mt-1 text-xs text-[#8C644B]">
              Ingresa el PIN de seguridad (PIN: <strong>1534</strong>)
            </p>

            {/* PIN Dots (fully rounded circles) */}
            <div className="flex gap-4 my-6">
              {[0, 1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className={`w-4 h-4 rounded-full transition-all duration-200 ${
                    pinError
                      ? 'bg-rose-500 scale-125 animate-bounce'
                      : idx < pin.length
                      ? 'bg-[#52301A] scale-110 shadow-sm'
                      : 'bg-[#E5D7CD]'
                  }`}
                />
              ))}
            </div>

            {pinError && (
              <p className="text-xs font-bold text-rose-600 mb-4 animate-shake">
                PIN incorrecto. Ingresa 1534.
              </p>
            )}

            {/* Rounded Numeric Keypad */}
            <div className="grid grid-cols-3 gap-3 w-64 max-w-xs">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  onClick={() => handlePinInput(digit)}
                  className="w-16 h-16 mx-auto rounded-full bg-white border border-[#E9D9CF] text-xl font-bold text-[#4A2E18] hover:bg-[#FFF3BF] active:scale-90 transition-all shadow-sm flex items-center justify-center cursor-pointer"
                >
                  {digit}
                </button>
              ))}
              <button
                onClick={handleClearPin}
                className="w-16 h-16 mx-auto rounded-full bg-stone-100 text-xs font-bold text-[#78543B] hover:bg-stone-200 active:scale-90 transition-all flex items-center justify-center cursor-pointer"
              >
                Borrar
              </button>
              <button
                onClick={() => handlePinInput('0')}
                className="w-16 h-16 mx-auto rounded-full bg-white border border-[#E9D9CF] text-xl font-bold text-[#4A2E18] hover:bg-[#FFF3BF] active:scale-90 transition-all shadow-sm flex items-center justify-center cursor-pointer"
              >
                0
              </button>
              <button
                onClick={handleBackspace}
                className="w-16 h-16 mx-auto rounded-full bg-stone-100 text-xs font-bold text-[#78543B] hover:bg-stone-200 active:scale-90 transition-all flex items-center justify-center cursor-pointer"
              >
                ⌫
              </button>
            </div>
          </div>
        ) : (
          /* Authenticated Admin Dashboard */
          <div>
            <div className="flex items-center justify-between border-b border-[#F0E0D6] pb-4 mb-6">
              <div>
                <h3 className="text-2xl font-extrabold text-[#4A2E18] font-serif-title flex items-center gap-2">
                  <PackageCheck className="w-6 h-6 text-[#C86A82]" />
                  Gestión de Postres & Stock
                </h3>
                <p className="text-xs text-[#8C644B]">
                  Configura precios en COP, fotos y controla las unidades disponibles.
                </p>
              </div>

              <button
                onClick={() => setIsAuthenticated(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-xs font-medium text-[#78543B] transition"
                title="Cerrar sesión"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Salir</span>
              </button>
            </div>

            {/* Pill Navigation Tabs */}
            <div className="glass-pill-94 flex items-center gap-2 p-1.5 rounded-full mb-6 max-w-md mx-auto">
              <button
                onClick={() => setActiveTab('inventory')}
                className={`flex-1 py-2 px-4 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'inventory'
                    ? 'bg-[#52301A] text-white shadow-sm'
                    : 'text-[#78543B] hover:text-[#4A2E18]'
                }`}
              >
                Inventario ({desserts.length})
              </button>
              <button
                onClick={() => setActiveTab('add')}
                className={`flex-1 py-2 px-4 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'add'
                    ? 'bg-[#52301A] text-white shadow-sm'
                    : 'text-[#78543B] hover:text-[#4A2E18]'
                }`}
              >
                + Agregar Postre
              </button>
            </div>

            {/* TAB 1: INVENTORY LIST */}
            {activeTab === 'inventory' && (
              <div>
                {/* Quick batch actions */}
                <div className="flex items-center justify-between gap-2 mb-4 px-1">
                  <span className="text-xs font-semibold text-[#8C644B]">
                    Postres registrados y stock activo:
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleRestockAll}
                      className="px-3.5 py-1.5 rounded-full bg-[#E8F5E9] border border-[#C8E6C9] text-xs font-bold text-emerald-800 hover:bg-[#C8E6C9] transition active:scale-95"
                    >
                      +5 a todos
                    </button>
                    <button
                      onClick={onResetDefaults}
                      className="px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-xs font-medium text-amber-800 hover:bg-amber-100 transition flex items-center gap-1 active:scale-95"
                      title="Restaurar catálogo inicial"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Restablecer</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                  {desserts.map((dessert) => {
                    const isOutOfStock = dessert.stock <= 0;
                    const isLowStock = dessert.stock > 0 && dessert.stock <= 3;

                    return (
                      <div
                        key={dessert.id}
                        className={`glass-pill-94 flex items-center justify-between p-3.5 rounded-[44px] transition-all ${
                          isOutOfStock
                            ? 'bg-rose-100/50 border-rose-200/80'
                            : 'hover:bg-white/60'
                        }`}
                      >
                        {/* Photo & Info */}
                        <div className="flex items-center gap-3">
                          <img
                            src={dessert.imageUrl}
                            alt={dessert.name}
                            className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/assets/aistudio/IMG_2254_9e1ac89f.JPG';
                            }}
                          />
                          <div>
                            <h4 className="text-sm font-bold text-[#4A2E18]">
                              {dessert.name}
                            </h4>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs font-extrabold text-[#78543B]">
                                ${dessert.price.toLocaleString('es-CO')} COP
                              </span>
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                  isOutOfStock
                                    ? 'bg-rose-100 text-rose-700'
                                    : isLowStock
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-emerald-100 text-emerald-800'
                                }`}
                              >
                                {isOutOfStock
                                  ? 'Agotado (0)'
                                  : isLowStock
                                  ? `Últimas ${dessert.stock} unid.`
                                  : `${dessert.stock} disponibles`}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Stock Controls (+ / -) & Delete */}
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 bg-[#F9F4F0] p-1 rounded-full border border-[#E8DAD1]">
                            <button
                              onClick={() => handleStockChange(dessert.id, -1)}
                              disabled={dessert.stock <= 0}
                              className="w-8 h-8 rounded-full bg-white hover:bg-rose-50 text-[#6B4226] hover:text-rose-600 disabled:opacity-30 disabled:hover:bg-white flex items-center justify-center transition active:scale-90"
                              title="Restar 1 unidad"
                            >
                              -
                            </button>
                            <span className="w-8 text-center text-xs font-extrabold text-[#4A2E18]">
                              {dessert.stock}
                            </span>
                            <button
                              onClick={() => handleStockChange(dessert.id, 1)}
                              className="w-8 h-8 rounded-full bg-white hover:bg-emerald-50 text-[#6B4226] hover:text-emerald-700 flex items-center justify-center transition active:scale-90"
                              title="Sumar 1 unidad"
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => handleDeleteDessert(dessert.id)}
                            className="w-8 h-8 rounded-full hover:bg-rose-50 text-stone-400 hover:text-rose-600 flex items-center justify-center transition"
                            title="Eliminar postre"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: ADD NEW DESSERT */}
            {activeTab === 'add' && (
              <form onSubmit={handleAddNewDessert} className="space-y-4 max-h-[55vh] overflow-y-auto px-1">
                {formSuccess && (
                  <div className="p-3 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold text-center flex items-center justify-center gap-2">
                    <Check className="w-4 h-4" />
                    ¡Postre agregado exitosamente con stock disponible!
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-[#6B4226] mb-1.5">
                    Nombre del Postre / Gelatina *
                  </label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Ej. Delicia de Tres Leches y Frambuesa"
                    className="w-full px-5 py-3 rounded-full border-2 border-[#E9D9CF] focus:border-[#C86A82] bg-white text-sm outline-none transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#6B4226] mb-1.5">
                      Precio ($ COP) *
                    </label>
                    <input
                      type="number"
                      required
                      min="1000"
                      step="500"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="9500"
                      className="w-full px-5 py-3 rounded-full border-2 border-[#E9D9CF] focus:border-[#C86A82] bg-white text-sm outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#6B4226] mb-1.5">
                      Stock Inicial (Unidades) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={newStock}
                      onChange={(e) => setNewStock(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="10"
                      className="w-full px-5 py-3 rounded-full border-2 border-[#E9D9CF] focus:border-[#C86A82] bg-white text-sm outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#6B4226] mb-1.5">
                    Foto del Postre
                  </label>
                  {/* Preset photo thumbnails */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-2">
                    {PRESET_PHOTOS.map((p, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setNewImageUrl(p.url)}
                        className={`flex-shrink-0 w-12 h-12 rounded-full overflow-hidden border-2 transition ${
                          newImageUrl === p.url
                            ? 'border-[#C86A82] scale-105 ring-2 ring-[#C86A82]/30'
                            : 'border-stone-200 opacity-60 hover:opacity-100'
                        }`}
                        title={p.label}
                      >
                        <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="Pega la URL de una foto o sube un archivo"
                      className="flex-1 px-5 py-2.5 rounded-full border-2 border-[#E9D9CF] focus:border-[#C86A82] bg-white text-xs outline-none transition"
                    />
                    <label className="px-4 py-2.5 rounded-full bg-stone-100 hover:bg-stone-200 text-xs font-bold text-[#6B4226] cursor-pointer flex items-center gap-1.5 transition">
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Subir</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#6B4226] mb-1.5">
                    Descripción / Perfil de Sabor (Opcional)
                  </label>
                  <input
                    type="text"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Ej. Capas frescas de guanábana con arándanos silvestres"
                    className="w-full px-5 py-3 rounded-full border-2 border-[#E9D9CF] focus:border-[#C86A82] bg-white text-sm outline-none transition"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-full bg-[#52301A] hover:bg-[#3D2211] text-white text-sm font-bold shadow-lg transition active:scale-95 cursor-pointer mt-2"
                >
                  Guardar Postre en Catálogo
                </button>
              </form>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};
