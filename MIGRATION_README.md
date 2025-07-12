# Database Migration: Frontend to Backend API

This document outlines the migration of all database operations from direct Firebase calls in the frontend to a centralized backend API that handles all database operations. This provides better security, centralized business logic, and easier maintenance.

## Overview

The ACM website has been migrated from using direct Firebase SDK calls in the frontend to a centralized backend API that handles all database operations. This provides better security, centralized business logic, and easier maintenance.

## Changes Made

### Backend (`acm_backend/`)

#### New API Endpoints

**Events API:**
- `GET /api/events/upcoming` - Fetch upcoming events
- `GET /api/events/past` - Fetch past events  
- `POST /api/events` - Create new event
- `POST /api/events/:eventId/rsvp` - RSVP for an event

**Users API:**
- `GET /api/users/:uid` - Get user data
- `PATCH /api/users/:uid` - Update user preferences
- `POST /deleteUser` - Delete user (existing endpoint)

**Bookings API:**
- `GET /api/users/:uid/bookings` - Get user bookings
- `DELETE /api/bookings/:bookingId` - Delete booking

**Admin API:**
- `GET /api/admin/members` - Get all members
- `GET /api/admin/events/past` - Get past events for admin
- `POST /api/admin/events/:eventId/attendance` - Upload attendance
- `DELETE /api/admin/members/:uid` - Remove member

#### Key Features

- **Timestamp Conversion**: Automatic conversion between Firestore Timestamps and JavaScript Date objects
- **Error Handling**: Comprehensive error handling with meaningful error messages
- **Data Validation**: Input validation for all endpoints
- **Batch Operations**: Efficient handling of bulk operations like attendance uploads

### Frontend (`acm_website/`)

#### Updated Files

1. **`src/api.ts`** - New centralized API client with all database operations
2. **`src/pages/EventsPage.tsx`** - Migrated from direct Firebase calls to API calls
3. **`src/pages/AdminPage.tsx`** - Migrated admin operations to use API
4. **`src/pages/ProfilePage.tsx`** - Migrated user profile operations to use API

#### Removed Dependencies

- Removed direct Firebase SDK usage from frontend components
- Removed Firebase dependency from root `package.json`
- Kept Firebase Auth for authentication (still needed for user login/logout)

#### API Client Features

- **Centralized Error Handling**: All API calls use a common error handling function
- **Type Safety**: TypeScript interfaces for all API responses
- **Automatic JSON Parsing**: Responses are automatically parsed as JSON
- **Consistent Error Messages**: Standardized error message format

## Migration Details

### Events Operations

**Before (Direct Firebase):**
```typescript
const db = getFirestore();
const eventsQuery = query(collection(db, "events"), where("start", ">=", Timestamp.now()));
const eventsSnapshot = await getDocs(eventsQuery);
```

**After (API):**
```typescript
import { getUpcomingEvents } from '../api';
const events = await getUpcomingEvents();
```

### User Operations

**Before (Direct Firebase):**
```typescript
const userDoc = await getDoc(doc(db, "users", user.uid));
const userData = userDoc.data();
```

**After (API):**
```typescript
import { getUserData } from '../api';
const userData = await getUserData(user.uid);
```

### Admin Operations

**Before (Direct Firebase):**
```typescript
await addDoc(collection(db, "events"), eventData);
```

**After (API):**
```typescript
import { createEvent } from '../api';
await createEvent(eventData);
```

## Benefits of Migration

1. **Security**: Database credentials and business logic are now centralized in the backend
2. **Maintainability**: All database operations are in one place, making updates easier
3. **Performance**: Backend can implement caching and optimization strategies
4. **Scalability**: Easier to add new features and modify existing ones
5. **Error Handling**: Centralized error handling and logging
6. **Data Validation**: Server-side validation ensures data integrity

## Environment Variables

### Backend (`.env`)
```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_PRIVATE_KEY=your-private-key
PORT=3001
```

### Frontend (`.env`)
```
VITE_API_BASE_URL=http://localhost:3001
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

## Running the Application

1. **Start Backend:**
   ```bash
   cd acm_backend
   npm install
   npm start
   ```

2. **Start Frontend:**
   ```bash
   cd acm_website
   npm install
   npm run dev
   ```

## Testing the Migration

1. **Events Page**: Verify that upcoming and past events load correctly
2. **RSVP Functionality**: Test event registration for logged-in users
3. **Admin Page**: Test event creation, member management, and attendance upload
4. **Profile Page**: Test user data loading, preferences updates, and booking management

## Future Enhancements

1. **Authentication Middleware**: Add JWT-based authentication for API endpoints
2. **Rate Limiting**: Implement rate limiting for API endpoints
3. **Caching**: Add Redis caching for frequently accessed data
4. **Logging**: Implement comprehensive logging for debugging and monitoring
5. **API Documentation**: Add OpenAPI/Swagger documentation for the API

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure the backend CORS configuration allows requests from the frontend
2. **Environment Variables**: Verify all required environment variables are set
3. **Firebase Permissions**: Ensure the Firebase service account has proper permissions
4. **Port Conflicts**: Make sure port 3001 is available for the backend

### Debugging

- Check browser network tab for API request/response details
- Check backend console logs for server-side errors
- Verify Firebase Admin SDK initialization in backend
- Test API endpoints directly using tools like Postman or curl

## Rollback Plan

If issues arise, the original Firebase SDK code can be restored by:

1. Reverting the changes to the frontend files
2. Re-adding the Firebase dependency to `package.json`
3. Restoring the original Firebase imports and calls

However, the backend API can remain as an alternative implementation for future use.