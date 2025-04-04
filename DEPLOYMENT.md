# คู่มือการ Deploy ระบบ Utility Monitoring

คู่มือนี้อธิบายขั้นตอนการ deploy ระบบ Utility Monitoring แบบแยกส่วน โดยใช้:
- **Vercel** สำหรับ Frontend
- **Render** สำหรับ Backend API
- **Supabase** หรือ **MongoDB Atlas** สำหรับฐานข้อมูล

## 1. การ Deploy ฐานข้อมูล

โปรดดูรายละเอียดการตั้งค่าฐานข้อมูลในไฟล์ [DATABASE-SETUP.md](DATABASE-SETUP.md)

## 2. การ Deploy Backend บน Render

### 2.1 เตรียมความพร้อม

1. สมัครบัญชี Render ที่ [render.com](https://render.com/)
2. เชื่อมต่อกับ GitHub repository ของคุณ
3. ตรวจสอบว่า backend มีไฟล์ `Dockerfile` ที่ถูกต้อง

### 2.2 สร้าง Web Service

1. เข้าสู่ Dashboard ของ Render
2. คลิก "New" > "Web Service"
3. เลือก Repository ของคุณ (หรือ fork จาก GitHub)
4. กำหนดชื่อ service (เช่น "utility-backend")
5. เลือก Runtime เป็น "Docker"
6. ระบุ Root Directory เป็น "backend"
7. ตั้งค่า Environment Variables ดังนี้:
   - `DB_HOST`: (ค่า Host จากฐานข้อมูลที่คุณใช้)
   - `DB_PORT`: (ค่า Port จากฐานข้อมูลที่คุณใช้)
   - `DB_NAME`: (ชื่อฐานข้อมูล)
   - `DB_USER`: (ชื่อผู้ใช้ฐานข้อมูล)
   - `DB_PASSWORD`: (รหัสผ่านฐานข้อมูล)
   - `JWT_SECRET`: (คีย์สำหรับ JWT tokens - ควรเป็นค่าที่ซับซ้อนและเป็นความลับ)
   - `ENVIRONMENT`: "production"
   - `PORT`: "5001"
   
   หรือหากใช้ MongoDB:
   - `MONGODB_URI`: (connection string จาก MongoDB Atlas)

8. ตั้งค่า Health Check Path เป็น "/api/health"
9. คลิก "Create Web Service"

### 2.3 หลังจาก Deploy

1. รอให้ Render build และ deploy service (อาจใช้เวลา 5-10 นาที)
2. หลังจาก deploy สำเร็จ Render จะให้ URL สำหรับ service ของคุณ (เช่น https://utility-backend.onrender.com)
3. จดบันทึก URL นี้ไว้เพื่อใช้ในการ deploy frontend

## 3. การ Deploy Frontend บน Vercel

### 3.1 เตรียมความพร้อม

1. สมัครบัญชี Vercel ที่ [vercel.com](https://vercel.com/)
2. เชื่อมต่อกับ GitHub repository ของคุณ
3. ตรวจสอบว่า frontend มีไฟล์ `vercel.json` ที่ถูกต้อง
4. ตรวจสอบว่ามีไฟล์ `.env.production` ที่ตั้งค่า API URL ชี้ไปยัง backend

### 3.2 Deploy Project

1. เข้าสู่ Dashboard ของ Vercel
2. คลิก "Add New" > "Project"
3. เลือก Repository ของคุณ (หรือ fork จาก GitHub)
4. ในส่วน "Configure Project":
   - กำหนด Root Directory เป็น "frontend"
   - ตั้งค่า Environment Variables:
     - `VITE_API_URL`: URL ของ backend ที่ deploy บน Render (เช่น https://utility-backend.onrender.com/api)

5. คลิก "Deploy"

### 3.3 หลังจาก Deploy

1. รอให้ Vercel build และ deploy (ปกติใช้เวลาไม่นาน)
2. หลังจาก deploy สำเร็จ Vercel จะให้ URL ของแอปพลิเคชัน (เช่น https://utility-monitoring.vercel.app)
3. คลิกที่ URL เพื่อเข้าใช้งานแอปพลิเคชัน

## 4. การเชื่อมโยงและทดสอบ

### 4.1 ตรวจสอบการเชื่อมต่อ

1. เข้าสู่แอปพลิเคชันผ่าน URL ที่ได้จาก Vercel
2. ลองเข้าสู่ระบบด้วยบัญชีตัวอย่าง:
   - Username: `admin`
   - Password: `admin`
3. ตรวจสอบว่าสามารถดูข้อมูลที่มาจากฐานข้อมูลได้
4. ทดสอบฟีเจอร์ต่างๆ เช่น การดูแดชบอร์ด, การส่งข้อมูล, การดูแผนที่

### 4.2 การแก้ไขปัญหา

#### Frontend (Vercel)

1. หากมีปัญหาเกี่ยวกับการเชื่อมต่อ API:
   - ตรวจสอบค่า VITE_API_URL ว่าชี้ไปยัง backend URL ที่ถูกต้อง
   - ตรวจสอบการตั้งค่า CORS ใน backend

2. ตรวจสอบ build logs บน Vercel หากเกิด error ระหว่างการ deploy:
   - ไปที่ Vercel Dashboard > โปรเจคของคุณ > Deployments > คลิกที่ deployment ล่าสุด > Build Logs

#### Backend (Render)

1. หากมีปัญหาเกี่ยวกับการเชื่อมต่อฐานข้อมูล:
   - ตรวจสอบตัวแปรสภาพแวดล้อมที่ตั้งค่าบน Render
   - ตรวจสอบว่า IP ของ Render ได้รับอนุญาตให้เข้าถึงฐานข้อมูล

2. ตรวจสอบ logs บน Render:
   - ไปที่ Render Dashboard > เลือก service ของคุณ > Logs

## 5. การตั้งค่า Custom Domain (ถ้าต้องการ)

### 5.1 Custom Domain สำหรับ Frontend (Vercel)

1. ไปที่ Vercel Dashboard > โปรเจคของคุณ > Settings > Domains
2. คลิก "Add" และป้อนโดเมนของคุณ
3. ทำตามคำแนะนำเพื่อตั้งค่า DNS records

### 5.2 Custom Domain สำหรับ Backend (Render)

1. ไปที่ Render Dashboard > เลือก service ของคุณ > Settings > Custom Domains
2. คลิก "Add Custom Domain" และป้อนโดเมนของคุณ
3. ทำตามคำแนะนำเพื่อตั้งค่า DNS records

## 6. การดูแลรักษาและอัปเดต

### 6.1 การอัปเดตแอปพลิเคชัน

1. เมื่อคุณ push การเปลี่ยนแปลงไปยัง GitHub repository:
   - Vercel จะทำการ re-deploy frontend โดยอัตโนมัติ
   - Render จะทำการ re-deploy backend โดยอัตโนมัติ

2. หากต้องการปิดการ deploy อัตโนมัติ:
   - Vercel: ไปที่ Settings > Git > Deploy Hooks
   - Render: ไปที่ Settings > Build & Deploy > Auto-Deploy

### 6.2 การตรวจสอบประสิทธิภาพ

1. Vercel มีเครื่องมือวิเคราะห์ประสิทธิภาพในส่วน "Analytics"
2. Render มีการตรวจสอบทรัพยากรในส่วน "Metrics"

## 7. เคล็ดลับและข้อแนะนำ

1. **การจัดการความลับ**: ไม่ควรเก็บความลับ (เช่น รหัสผ่าน, คีย์ API) ใน repository แต่ควรใช้ Environment Variables
2. **การทำ CI/CD**: ทั้ง Vercel และ Render มีการ deploy อัตโนมัติเมื่อมีการ push ไปยัง repository
3. **การทำ Backup ฐานข้อมูล**: ใช้ฟีเจอร์ Backup ของ Supabase หรือ MongoDB Atlas เพื่อสำรองข้อมูล
4. **การ Scale**: ทั้ง Render และ Vercel มีแพลนที่สูงขึ้นหากต้องการประสิทธิภาพที่ดีขึ้น

## 8. ค่าใช้จ่ายและข้อจำกัด

1. **Vercel (Free Plan)**:
   - ข้อจำกัด: 100GB Bandwidth/เดือน
   - ไม่ถูก Sleep เมื่อไม่มีการใช้งาน

2. **Render (Free Plan)**:
   - ข้อจำกัด: 750 ชั่วโมงการใช้งาน/เดือน
   - Web Services จะถูก Sleep หลังจากไม่มีการใช้งาน 15 นาที

3. **Supabase (Free Plan)**:
   - ข้อจำกัด: 500MB storage, Unlimited API requests

4. **MongoDB Atlas (Free Tier)**:
   - ข้อจำกัด: 512MB storage

หากมีคำถามหรือปัญหาในการ deploy กรุณาดูเอกสารเพิ่มเติมของแต่ละบริการหรือสอบถามใน Issues ของ GitHub repository 