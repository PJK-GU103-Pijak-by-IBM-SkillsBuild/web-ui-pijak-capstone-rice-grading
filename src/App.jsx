import { useState } from 'react';

function App() {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };

  const handlePredict = async () => {
    if (!image) return;

    setIsLoading(true);
    setError(null);
    setResult(null);
    setProgress(0);

    // Simulasi progress berjalan naik acak hingga mentok di 90% selama menunggu
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return 90;
        return prev + Math.floor(Math.random() * 10) + 5; // Naik acak sekitar 5-15%
      });
    }, 300);

    const formData = new FormData();
    formData.append('image', image);

    try {
      // Menggunakan endpoint dari spesifikasi openapi.yaml
      const response = await fetch('https://pijak.arykurnia.my.id/api/v1/predict', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      // Bersihkan interval dan set progress mentok ke 100% karena respons sudah diterima
      clearInterval(progressInterval);
      setProgress(100);

      // Beri sedikit jeda 500ms agar user bisa melihat bar mencapai 100% sebelum hasil muncul
      setTimeout(() => {
        if (response.ok && data.success) {
          const label = data.data.label;

          let result;
          switch (data.data.label) {
            case 'Ipsala':
              result = 'Bagus';
              break;
            case 'Arborio':
              result = 'Sedang';
              break;
            case 'Basmati':
              result = 'Buruk';
              break;
            default:
              result = label;
          }
          
          setResult({ label: result, confidence: data.data.confidence });
        } else {
          setError(data.message || 'Terjadi kesalahan pada server');
        }
        setIsLoading(false);
      }, 500);

    } catch (err) {
      setError('Gagal terhubung ke API. Pastikan server backend berjalan.');
    } finally {
      setIsLoading(false);
    }
  };

  const getBadgeColor = (label) => {
  if (!label) return 'bg-slate-100 text-slate-800 border-slate-200';
  
  switch (label.toLowerCase()) {
    case 'bagus':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'sedang': 
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'buruk': 
      return 'bg-rose-100 text-rose-800 border-rose-200';
    default: 
      return 'bg-blue-100 text-blue-800 border-blue-200'; // Default warna biru modern untuk label lain
  }
};

  // const getBadgeColor = () => {
  //   return 'bg-indigo-50 text-indigo-700 border-indigo-200';
  // };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 antialiased font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-100">
        
        {/* Header UI */}
        <div className="bg-blue-600 p-6 text-white text-center">
          <h1 className="text-2xl font-bold tracking-tight">Rice Grading AI</h1>
          <p className="text-blue-100 text-xs mt-1">Sistem Cerdas Klasifikasi Kualitas Beras Berdasarkan Gambar</p>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          
          {/* Uploader Card */}
          <div className="flex flex-col items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-52 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer bg-slate-50/50 hover:bg-slate-50 transition-all duration-200">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="h-full w-full object-cover rounded-xl" />
              ) : (
                <div className="flex flex-col items-center justify-center p-5 text-center text-slate-500">
                  <svg className="w-12 h-12 mb-3 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"></path>
                  </svg>
                  <p className="text-sm font-semibold mb-1">Klik untuk unggah gambar beras</p>
                  <p className="text-xs text-slate-400">Mendukung format gambar biner</p>
                </div>
              )}
              <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
            </label>
          </div>

          {/* Action Button */}
          <button 
            onClick={handlePredict}
            disabled={!image || isLoading}
            className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all shadow-sm
              ${!image || isLoading 
                ? 'bg-slate-300 cursor-not-allowed shadow-none' 
                : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.99]'
              }`}
          >
            {isLoading ? 'Sedang Menganalisis...' : 'Mulai Prediksi'}
          </button>

          {/* === PROGRESS BAR SECTION === */}
          {isLoading && (
            <div className="mt-4 animate-fade-in">
              <div className="flex justify-between mb-1.5">
                <span className="text-xs font-semibold text-blue-600 animate-pulse">
                  Menganalisis Gambar...
                </span>
                <span className="text-xs font-bold text-blue-600">
                  {progress}%
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}
          {/* === END OF PROGRESS BAR === */}

          {/* Alert Error */}
          {error && (
            <div className="p-3.5 bg-rose-50 text-rose-700 text-sm rounded-xl border border-rose-100 text-center font-medium">
              {error}
            </div>
          )}

          {/* Result Section */}
          {result && result.label && (
            <div className="mt-4 p-5 bg-slate-50/80 rounded-xl border border-slate-200 text-center animate-fade-in">
              <p className="text-xs text-slate-400 font-semibold tracking-wide uppercase mb-2">
                Hasil Analisis Klasifikasi
              </p>
              
              {/* Membaca properti result.label sesuai respons asli server */}
              <div className={`inline-block px-5 py-1.5 rounded-full border text-lg font-bold shadow-xs ${getBadgeColor(result.label)}`}>
                {result.label.toUpperCase()}
              </div>
              
              <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-slate-100 shadow-xs mt-3.5">
                <span className="text-slate-500 text-xs font-medium">Confidence</span>
                <span className="font-bold text-blue-600 text-sm">
                  {result.confidence !== undefined ? (result.confidence * 100).toFixed(2) : 0}%
                </span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default App;