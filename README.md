# Rice Quality Prediction — Frontend
**ID TIM: PJK-GU103**

Antarmuka web untuk sistem klasifikasi kualitas beras berbasis AI.  
Dibangun dengan **React + Vite**, terhubung ke inference API berbasis Flask.

---

## Tentang Proyek

Frontend ini merupakan bagian dari proyek capstone **Rice Quality Prediction** yang memungkinkan pengguna mengunggah gambar beras dan mendapatkan hasil klasifikasi kualitas secara real-time berdasarkan standar **SNI 6128:2020**.



---

## Teknologi

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## Setup & Menjalankan

**Requirements:** Node.js 18+

**1. Clone repository**
```bash
git clone https://github.com/pijak-team/pijak-capstone-rice-grading-frontend.git
cd pijak-capstone-rice-grading-frontend
```

**2. Install dependencies**
```bash
npm install
```

**3. Setup environment**
```bash
cp .env.example .env
```

Isi `.env`:
```env
VITE_API_URL=https://pijak.arykurnia.my.id/api/v1
```

**4. Jalankan development server**
```bash
npm run dev
```

Aplikasi berjalan di `http://localhost:5173`

---

## Build untuk Production

```bash
npm run build
```

Output build tersedia di folder `dist/`.

---