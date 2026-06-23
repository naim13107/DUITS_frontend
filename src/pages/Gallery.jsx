// src/pages/Gallery.jsx - Light Futuristic Design
import { useState, useEffect } from 'react';
import { galleryAPI } from '../api/gallery';
import { toast } from 'react-hot-toast';
import { X, Sparkles, ZoomIn, Image as ImageIcon } from 'lucide-react';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await galleryAPI.getGallery();
        setImages(res.data.results || res.data);
      } catch (err) {
        toast.error("Failed to load visual records.");
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  return (
    <div className="relative max-w-7xl mx-auto px-4 py-20 min-h-screen bg-slate-50">
      {/* Subtle Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(to right, #0f172a 1px, transparent 1px), linear-gradient(to bottom, #0f172a 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <div className="relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm mb-6">
            <ImageIcon className="w-4 h-4 text-cyan-500" />
            <span className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-widest">Visual_Records</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-slate-900 via-slate-700 to-slate-800 bg-clip-text text-transparent tracking-tight">
            Data <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500">Archives</span>
          </h1>
          <p className="text-lg text-slate-500 mt-4 font-medium max-w-xl mx-auto">Recorded visual moments from past operations and events.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-16 h-16 rounded-full border-4 border-slate-200 border-t-cyan-500 animate-spin"></div>
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-24 bg-white/80 backdrop-blur-md border border-slate-200 rounded-3xl shadow-sm">
            <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
              <ImageIcon className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-2xl font-black text-slate-800">Archive Empty</h3>
            <p className="text-slate-500 mt-2 font-medium">No visual records found in database.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map((img, index) => (
              <div 
                key={img.id} 
                className="group relative cursor-pointer overflow-hidden rounded-3xl bg-slate-100 aspect-square shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-200 hover:border-cyan-300"
                onClick={() => setSelectedImage(img)}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <img 
                  src={img.image_url || img.image} 
                  alt={img.caption || 'Archive Image'} 
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                />
                
                {/* Overlay details */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <div className="font-mono text-[9px] uppercase tracking-widest text-cyan-400 mb-1 font-bold">Encrypted_Log</div>
                  <p className="text-white font-bold text-sm line-clamp-2 w-full tracking-wide">
                    {img.caption || 'View Record'}
                  </p>
                </div>
                
                {/* Hover icon */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg">
                    <ZoomIn className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Cinematic Tech Modal */}
        {selectedImage && (
          <div 
            className="fixed inset-0 z-50 bg-slate-900/95 flex items-center justify-center p-4 backdrop-blur-xl transition-all duration-300"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-6 right-6 btn btn-circle btn-ghost text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-300 hover:rotate-90 border border-slate-700"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-6 h-6" />
            </button>
            <div 
              className="max-w-5xl w-full flex flex-col items-center animate-zoom-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full p-2 bg-white/5 border border-white/10 rounded-3xl shadow-2xl">
                <img 
                  src={selectedImage.image_url || selectedImage.image} 
                  alt={selectedImage.caption} 
                  className="max-h-[75vh] w-full object-contain rounded-2xl"
                />
              </div>
              <div className="mt-8 text-center flex flex-col items-center">
                {selectedImage.caption && (
                  <p className="text-white text-xl font-bold max-w-3xl tracking-wide mb-4">
                    {selectedImage.caption}
                  </p>
                )}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 border border-white/20">
                  <CalendarIcon className="w-4 h-4 text-cyan-400" />
                  <span className="font-mono text-xs text-slate-300 uppercase tracking-widest font-bold">
                    {new Date(selectedImage.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;