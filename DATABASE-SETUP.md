# การตั้งค่าฐานข้อมูลสำหรับระบบ Utility Monitoring

คู่มือนี้อธิบายวิธีการตั้งค่าฐานข้อมูลสำหรับระบบ Utility Monitoring โดยมีทางเลือก 2 แบบ: Supabase (PostgreSQL) และ MongoDB Atlas

## 1. การตั้งค่า Supabase (PostgreSQL)

### 1.1 สมัครบัญชีและสร้างโปรเจค

1. เข้าไปที่ [Supabase](https://supabase.com/) และสมัครบัญชี
2. หลังจากเข้าสู่ระบบ คลิก "New Project"
3. กรอกชื่อโปรเจค เลือก Region ที่ใกล้กับผู้ใช้งาน และตั้งรหัสผ่าน
4. รอสักครู่เพื่อให้ Supabase สร้างโปรเจคและฐานข้อมูล

### 1.2 นำเข้าสคีมาฐานข้อมูล

1. ไปที่แท็บ "SQL Editor" ใน Supabase Dashboard
2. คลิก "New Query"
3. คัดลอกเนื้อหาจากไฟล์ `database/schema.sql` ไปวางในหน้าต่าง SQL Editor
4. คลิก "Run" เพื่อสร้างตารางและข้อมูลตัวอย่าง

### 1.3 รับข้อมูลการเชื่อมต่อ

1. ไปที่แท็บ "Project Settings" > "Database"
2. ในส่วนของ "Connection Info" คุณจะเห็นข้อมูลต่อไปนี้:
   - Host: `[YOUR-PROJECT-ID].supabase.co`
   - Database name: `postgres`
   - Port: `5432`
   - User: `postgres`
   - Password: (รหัสผ่านที่คุณตั้งตอนสร้างโปรเจค)

3. บันทึกค่าเหล่านี้เพื่อใช้ในการตั้งค่า backend ที่จะ deploy บน Render

## 2. การตั้งค่า MongoDB Atlas

### 2.1 สมัครบัญชีและสร้าง Cluster

1. เข้าไปที่ [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) และสมัครบัญชี
2. หลังจากเข้าสู่ระบบ คลิก "Build a Database"
3. เลือก "Shared" (Free) ในหน้า "Select a Path"
4. เลือก Cloud Provider และ Region ที่เหมาะสม
5. คลิก "Create Cluster" และรอสักครู่เพื่อให้ cluster สร้างเสร็จ

### 2.2 ตั้งค่าการเข้าถึงและสร้างฐานข้อมูล

1. คลิก "Database Access" ในเมนูด้านซ้าย และคลิก "Add New Database User"
2. ตั้งชื่อผู้ใช้และรหัสผ่าน (จดบันทึกไว้ใช้ภายหลัง)
3. ตั้งค่า Database User Privileges เป็น "Read and Write to Any Database"
4. คลิก "Network Access" ในเมนูด้านซ้าย และคลิก "Add IP Address"
5. เลือก "Allow Access from Anywhere" หรือระบุ IP ที่เฉพาะเจาะจง
6. คลิก "Databases" ในเมนูด้านซ้าย และคลิก "Browse Collections" บน cluster ของคุณ
7. คลิก "Add My Own Data" เพื่อสร้างฐานข้อมูลใหม่
8. ตั้งชื่อฐานข้อมูล (เช่น "utility_monitoring") และชื่อ collection แรก (เช่น "users")

### 2.3 นำเข้าข้อมูลตัวอย่าง

1. คลิก "Collections" และคลิกปุ่ม "+" เพื่อสร้าง collections ตามต้องการ (users, clients, sites, utilityReadings, zones, alerts)
2. เปิด MongoDB Compass บนเครื่องของคุณและเชื่อมต่อกับ cluster โดยใช้ connection string
3. คัดลอกและรันสคริปต์จากไฟล์ `database/mongodb-schema.js` ในเครื่องมือ MongoDB Shell หรือ Compass

หรือคุณสามารถสร้าง collections ผ่าน API ของแอปพลิเคชัน:

1. ในโค้ด backend คุณสามารถสร้างและเชื่อมต่อกับ MongoDB โดยตรง
2. อัปเดตโค้ดในส่วนของการเชื่อมต่อฐานข้อมูลให้ใช้ MongoDB แทน PostgreSQL
3. เพิ่มโค้ดสำหรับการ seed ข้อมูลตัวอย่างลงในฐานข้อมูล

### 2.4 รับข้อมูลการเชื่อมต่อ

1. คลิก "Database" ในเมนูด้านซ้าย
2. คลิก "Connect" บน cluster ของคุณ
3. เลือก "Connect your application"
4. เลือก Driver และ Version ที่เหมาะสม
5. คัดลอก connection string และจดบันทึกไว้

## 3. การปรับแต่งแอปพลิเคชันเพื่อใช้กับฐานข้อมูลที่เลือก

### 3.1 การใช้งานกับ Supabase (PostgreSQL)

1. ในไฟล์ `.env` หรือตัวแปรสภาพแวดล้อมบน Render ให้ตั้งค่าดังนี้:
   ```
   DB_HOST=your-project-id.supabase.co
   DB_PORT=5432
   DB_NAME=postgres
   DB_USER=postgres
   DB_PASSWORD=your-database-password
   ```

2. ตรวจสอบว่า backend ของคุณใช้ PostgreSQL driver ที่ถูกต้อง:
   ```go
   import (
     "database/sql"
     _ "github.com/lib/pq" // PostgreSQL driver
   )
   ```

### 3.2 การใช้งานกับ MongoDB Atlas

1. ในไฟล์ `.env` หรือตัวแปรสภาพแวดล้อมบน Render ให้ตั้งค่าดังนี้:
   ```
   MONGODB_URI=mongodb+srv://username:password@your-cluster.mongodb.net/utility_monitoring?retryWrites=true&w=majority
   ```

2. ตรวจสอบว่า backend ของคุณใช้ MongoDB driver ที่ถูกต้อง:
   ```go
   import (
     "go.mongodb.org/mongo-driver/mongo"
     "go.mongodb.org/mongo-driver/mongo/options"
   )
   ```

3. ปรับแก้โค้ดการเชื่อมต่อฐานข้อมูลให้ใช้ MongoDB แทน PostgreSQL

### หมายเหตุ

- ในการ Deploy บน Render คุณจะตั้งค่าตัวแปรสภาพแวดล้อมเหล่านี้ในแท็บ Environment
- สำหรับโปรเจคต้นแบบนี้ backend มีการออกแบบให้ใช้กับ PostgreSQL แต่สามารถปรับให้ใช้กับ MongoDB ได้โดยการแก้ไขโค้ด
- หากต้องการใช้ MongoDB แทน PostgreSQL คุณจะต้องปรับโค้ด models และ database connection 