# Reparadito Booking Backend

Backend API para el sistema de reservas de Reparadito con integración de pagos, notificaciones por email y Slack.

## 🚀 Tecnologías

- **Node.js** - Runtime environment
- **Express** - Framework web
- **TypeScript** - Tipado estático
- **MongoDB** - Base de datos
- **Mongoose** - ODM para MongoDB
- **Mercado Pago** - Procesamiento de pagos
- **Nodemailer** - Envío de correos
- **Zod** - Validación de datos

## 📋 Prerrequisitos

- Node.js 18+
- MongoDB
- Variables de entorno configuradas

## 🛠️ Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd reparadito-backend

# Instalar dependencias
npm install

# O con yarn
yarn install
```

## ⚙️ Configuración

Crear un archivo `.env` con las siguientes variables:

```env
# Servidor
PORT=3000

# Base de datos
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/reparadito

# AWS
AWS_REGION=us-west-1

# Slack
SLACK_WEBHOOK=https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK

# Email
MAIL_FROM=noreply@yourdomain.com

# Mercado Pago
MP_ACCESS_TOKEN=YOUR_MERCADO_PAGO_ACCESS_TOKEN
```

## 🏃‍♂️ Ejecución

```bash
# Modo desarrollo
npm run dev

# Construir para producción
npm run build

# Iniciar en producción
npm start
```

## 📁 Estructura del Proyecto

```
src/
├── app.ts              # Configuración principal de Express
├── server.ts           # Punto de entrada del servidor
├── config/             # Configuraciones
│   ├── env.ts          # Variables de entorno
│   └── db.ts           # Configuración de base de datos
├── models/             # Modelos de datos
│   └── Booking.ts      # Modelo de reservas
├── routes/             # Rutas de la API
│   └── bookings.ts     # CRUD de reservas
├── services/           # Servicios externos
│   ├── mailer.ts       # Servicio de email
│   ├── slack.ts        # Servicio de Slack
│   └── payments.ts     # Servicio de pagos
└── validators/         # Validaciones
    └── booking.schema.ts # Validación de reservas
```

## 🔗 Endpoints

### Reservas

- `GET /api/bookings` - Obtener todas las reservas
- `POST /api/bookings` - Crear una nueva reserva
- `GET /api/bookings/:id` - Obtener una reserva específica
- `PUT /api/bookings/:id` - Actualizar una reserva
- `DELETE /api/bookings/:id` - Eliminar una reserva

## 📝 Modelo de Datos

### Booking

```typescript
interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  service: string;
  date: Date;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}
```

## 🔧 Servicios Integrados

### 💳 Pagos con Mercado Pago
- Procesamiento automático de pagos
- Reembolsos
- Cálculo de montos por servicio

### 📧 Notificaciones por Email
- Confirmación de reservas
- Cancelaciones
- Recordatorios

### 💬 Notificaciones Slack
- Nuevas reservas
- Cancelaciones
- Problemas de pago

## 🚦 Desarrollo

```bash
# Iniciar en modo desarrollo con recarga automática
npm run dev

# Verificar tipos de TypeScript
npx tsc --noEmit

# Formatear código (si se configura Prettier)
npx prettier --write .
```

## 📦 Scripts Disponibles

- `npm run dev` - Iniciar servidor en desarrollo
- `npm run build` - Compilar TypeScript
- `npm start` - Iniciar servidor en producción

## 🤝 Contribución

1. Fork del repositorio
2. Crear feature branch (`git checkout -b feature/amazing-feature`)
3. Commit cambios (`git commit -m 'Add amazing feature'`)
4. Push al branch (`git push origin feature/amazing-feature`)
5. Abrir Pull Request

## 📄 Licencia

Todos los derechos reservados. Este proyecto es software propietario y confidencial. UNLICENSED - No se permite el uso, copia, modificación o distribución sin autorización expresa del autor.

© 2026 Reparadito / Ruben Bautista Mendoza
