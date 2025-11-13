````markdown
# 🖼️ Project : ZenithComp Image Processing

## Image Similarity Search

โปรเจกต์ **Web Application** สำหรับการค้นหารูปภาพที่คล้ายกัน (Image Similarity Search)  
สร้างขึ้นโดยใช้ **React (Vite)** สำหรับ Frontend และ **Python (FastAPI)** สำหรับ Backend

ผู้ใช้สามารถอัปโหลดรูปภาพต้นฉบับ จากนั้นระบบจะทำการประมวลผลรูปภาพนั้นเพื่อค้นหารายการรูปภาพอื่นๆ  
ในฐานข้อมูลที่มีความคล้ายคลึง และแสดงผลลัพธ์เป็นรายการรูปภาพที่คล้ายกันพร้อมเปอร์เซ็นต์ความเหมือน

---

## ✨ Features

- **Image Upload:** รองรับการอัปโหลดไฟล์รูปภาพ (PNG, JPG, SVG, ฯลฯ)  
  ผ่านการลากและวาง (Drag 'n' Drop) หรือการคลิกเพื่อเลือกไฟล์  
- **Image Preview:** แสดงรูปภาพตัวอย่าง (thumbnail) ของไฟล์ที่อัปโหลดก่อนทำการค้นหา  
- **Similarity Search:** ส่งรูปภาพไปยัง Backend (FastAPI) เพื่อประมวลผลและค้นหารูปภาพที่คล้ายกัน  
- **Results Display:** แสดงผลลัพธ์เป็นตาราง (Grid) พร้อมแถบสี (เขียว, ส้ม, แดง) เพื่อบ่งบอกระดับความคล้าย  
- **Filtering:** (จากตัวอย่าง UI) มีปุ่มสำหรับกรองผลลัพธ์ เช่น ทั้งหมด, สี, ขนาด, รูปร่าง  

---

## 🛠️ Tech Stack

### 🖥️ Frontend
- React 18 (UI Library)  
- Vite (Build Tool)  
- TypeScript  
- Axios (สำหรับเชื่อมต่อ API)  
- react-dropzone (สำหรับจัดการการอัปโหลดไฟล์)  
- lucide-react (สำหรับ Icons)

### 💾 Backend
- Python 3.11+  
- FastAPI (Web Framework)  
- Uvicorn (ASGI Server)  
- Pillow, scikit-image, OpenCV (หรือ Library อื่นๆ สำหรับ Image Processing ที่ใช้ใน `app/services/image_processor.py`)

---

## 📁 Project Structure

```plaintext
image-processing/
├── README.md            
├── backend/
│   ├── app/
│   │   ├── api/          # (ไฟล์ API endpoints และ routes)
│   │   │   └── routes/
│   │   │       ├── similarity.py
│   │   │       └── upload.py
│   │   ├── core/         # (Config, settings)
│   │   ├── services/     # (ส่วนประมวลผลรูปภาพหลัก)
│   │   │   └── image_processor.py
│   │   └── main.py       # (FastAPI app หลัก)
│   ├── requirements.txt  # (Python dependencies)
│   └── venv/             # (Virtual environment)
└── frontend/
    ├── public/           # (Static assets)
    ├── src/
    │   ├── components/   # (React components)
    │   │   ├── Layout/
    │   │   ├── Results/
    │   │   └── Upload/
    │   │       └── FileUpload.tsx
    │   ├── services/     # (ไฟล์เชื่อมต่อ API - api.ts)
    │   ├── types/        # (TypeScript type definitions)
    │   ├── App.tsx       # (Main App component)
    │   ├── main.tsx      # (React entry point)
    │   └── index.css
    ├── package.json      # (Frontend dependencies)
    └── vite.config.ts    # (Vite config)
````

---

## 🚀 Getting Started

### Prerequisites

* Node.js (v18+ recommended)
* Python (v3.11+ recommended) & pip
* Git (สำหรับ clone)

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/image-processing.git
cd image-processing
```

---

### 2. Backend Setup (FastAPI)

ทำใน **Terminal แรก**

```bash
# 1. เข้าไปที่โฟลเดอร์ backend
cd backend

# 2. สร้าง Virtual Environment
# (macOS/Linux)
python3 -m venv venv
# (Windows)
python -m venv venv

# 3. เปิดใช้งาน Virtual Environment
# (macOS/Linux)
source venv/bin/activate
# (Windows - Command Prompt)
.env\Scriptsctivate
# (Windows - PowerShell)
.env\Scripts\Activate.ps1

# 4. ติดตั้ง Python dependencies
pip install -r requirements.txt
```

---

### 3. Frontend Setup (React + Vite)

ทำใน **Terminal ที่สอง**
(หรือ `cd ../frontend` จาก Terminal แรก)

```bash
# 1. เข้าไปที่โฟลเดอร์ frontend
cd frontend

# 2. ติดตั้ง Node.js dependencies
npm install
```

---

## 🏃 How to Run (Development Mode)

เปิด Terminal 2 หน้าต่างและรันเซิร์ฟเวอร์ทั้งสองส่วน

### Terminal 1: Start Backend

```bash
# 1. ตรวจสอบว่าอยู่ในโฟลเดอร์ backend
cd backend

# 2. ตรวจสอบว่า Virtual Environment ถูกเปิดใช้งานแล้ว
source venv/bin/activate

# 3. รัน Uvicorn server
uvicorn app.main:app --reload --port 8000
```

ℹ️ **Backend API:** [http://localhost:8000](http://localhost:8000)

---

### Terminal 2: Start Frontend

```bash
# 1. ตรวจสอบว่าอยู่ในโฟลเดอร์ frontend
cd frontend

# 2. รัน Vite dev server
npm run dev
```

ℹ️ **Frontend App:** [http://localhost:5173](http://localhost:5173) (หรือ Port อื่นตามที่ Vite แจ้งใน Terminal)

เมื่อรันเซิร์ฟเวอร์ทั้งสองแล้ว
สามารถเปิดเบราว์เซอร์ที่ `http://localhost:5173` เพื่อใช้งานได้เลยครับ 🚀

---

## 🔌 API Endpoints (Quick Overview)
```
server config : 'http://localhost:8000/docs#/'
```

| Method   | Endpoint                     | Description                                           | File            |
| -------- | ---------------------------- | ----------------------------------------------------- | --------------- |
| **POST** | `/api/upload`                | ใช้อัปโหลดไฟล์รูปภาพเพื่อเริ่มการประมวลผล             | `upload.py`     |
| **GET**  | `/api/similarity/{image_id}` | ใช้ดึงข้อมูลรูปภาพที่คล้ายคลึงกันหลังจากประมวลผลเสร็จ | `similarity.py` |

---

## 📜 License

© 2025 ZenithComp Ai Development Team

