# OpenMusic API

OpenMusic API adalah aplikasi backend untuk pengelolaan musik digital yang dibangun menggunakan **Node.js** dan framework **Hapi.js**. Aplikasi ini menyediakan fitur pengelolaan lagu, album, playlist, autentikasi pengguna, kolaborasi, serta ekspor playlist menggunakan *message broker* dan *caching*.

---

## 📌 Prasyarat & Tools

Pastikan perangkat Anda telah terpasang:

* **Node.js** (Disarankan versi LTS, min v14.x)
* **npm** (Bundled with Node.js)
* **PostgreSQL**
* **Redis**
* **RabbitMQ**
* **Git**
* **Postman** *(opsional untuk testing API)*

---

## 📁 Struktur Proyek

```
project-root
├── migrations/           # File migrasi database
├── src/
│   ├── api/              # Plugin Hapi, Routes, Handler
│   ├── services/         # Logika bisnis (Postgres, Redis, RabbitMQ, Storage)
│   ├── validator/        # Validasi schema dengan Joi
│   ├── tokenize/         # JWT Access & Refresh Token
│   ├── consumer/         # Worker Consumer RabbitMQ
│   └── exceptions/       # Custom error handling
```

---

## 🚀 Instalasi & Setup

### Clone & Install

```bash
npm install
```

### Konfigurasi Database PostgreSQL

```sql
CREATE USER developer WITH ENCRYPTED PASSWORD 'supersecretpassword';
CREATE DATABASE openmusic;
GRANT ALL PRIVILEGES ON DATABASE openmusic TO developer;
```

Jalankan migrasi database:

```bash
npm run migrate up
```

### Konfigurasi Environment Variables

Buat file `.env` di root project, isi:

```ini
HOST=localhost
PORT=5000

PGUSER=developer
PGHOST=localhost
PGPASSWORD=supersecretpassword
PGDATABASE=openmusic
PGPORT=5432

ACCESS_TOKEN_KEY=rahasia_access_token_yang_panjang
REFRESH_TOKEN_KEY=rahasia_refresh_token_yang_panjang
ACCESS_TOKEN_AGE=1800

RABBITMQ_SERVER=amqp://localhost
REDIS_SERVER=127.0.0.1

SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=email_anda@gmail.com
SMTP_PASSWORD=app_password_anda
```

> Pastikan Redis & RabbitMQ sudah berjalan sebelum menjalankan aplikasi.

---

## ▶️ Menjalankan Aplikasi

### Terminal 1 – API Hapi Server

```bash
npm run start
```

Mode development dengan nodemon:

```bash
npm run dev
```

### Terminal 2 – Consumer Worker

```bash
npm run consumer
```

---

## 📡 API Endpoints (Ringkasan)

### **Authentications**

| Method | Endpoint         | Deskripsi            |
| ------ | ---------------- | -------------------- |
| POST   | /authentications | Login                |
| PUT    | /authentications | Refresh Access Token |
| DELETE | /authentications | Logout               |

### **Users**

| Method | Endpoint |
| POST | /users |

### **Albums**

* POST /albums
* GET /albums/{id}
* PUT /albums/{id}
* DELETE /albums/{id}
* POST /albums/{id}/covers
* POST /albums/{id}/likes
* GET /albums/{id}/likes
* DELETE /albums/{id}/likes

### **Songs**

* POST /songs
* GET /songs
* GET /songs/{id}
* PUT /songs/{id}
* DELETE /songs/{id}

### **Playlists**

* POST /playlists
* GET /playlists
* DELETE /playlists/{id}
* POST /playlists/{id}/songs
* GET /playlists/{id}/songs
* DELETE /playlists/{id}/songs
* GET /playlists/{id}/activities

### **Collaborations**

* POST /collaborations
* DELETE /collaborations

### **Exports**

* POST /export/playlists/{playlistId}

---

## 💡 Fitur Tambahan

* Upload cover album (Lokasi penyimpanan lokal)
* Redis caching untuk endpoint GET Likes
* RabbitMQ message broker untuk proses ekspor playlist
* Email export menggunakan Nodemailer dengan attachment JSON

---

## 🔧 Troubleshooting

| Error                         | Solusi                                           |
| ----------------------------- | ------------------------------------------------ |
| ECONNREFUSED                  | Service PostgreSQL/Redis/RabbitMQ belum berjalan |
| relation "..." does not exist | Jalankan `npm run migrate up`                    |
| Client authentication failed  | Cek konfigurasi `.env`                           |
| Email tidak masuk             | Gunakan Gmail App Password & cek folder Spam     |

---

## 📃 License

Project ini dikembangkan untuk kebutuhan pembelajaran dan portofolio.

---

👍 *Silakan gunakan, modifikasi, dan kembangkan sesuai kebutuhan!*
