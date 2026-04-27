# Internza Authentication Flow Documentation

## Overview

Production-grade cookie-based authentication implementation using JWT tokens with automatic refresh rotation.

## Architecture

### Backend (NestJS)

#### 1. Cookie-Based Token Storage
- **Access Token**: Stored in httpOnly cookie (1 hour expiry)
- **Refresh Token**: Stored in httpOnly cookie (7 days expiry)
- **Tokens**: Never returned in response body (security best practice)

#### 2. Auth Controller Changes
- `POST /auth/student/signup`: Sets cookies, returns only user data
- `POST /auth/signin`: Sets cookies, returns only user data
- `POST /auth/refresh`: Reads cookie, sets new cookies, returns user data
- `POST /auth/logout`: Clears cookies server-side
- `GET /auth/me`: Returns current user from JWT payload

#### 3. JWT Strategy Update
- Extracts token from cookie first, falls back to Authorization header
- Maintains backward compatibility with Bearer token auth

### Frontend (Next.js)

#### 1. API Client (`lib/api-client.ts`)
**Features:**
- Automatic token refresh on 401 errors
- Centralized error handling
- Cookie-based authentication (credentials: 'include')
- Request queuing during refresh (prevents duplicate refresh calls)

**Key Functions:**
```typescript
api.get<T>(endpoint)
api.post<T>(endpoint, data)
api.put<T>(endpoint, data)
api.delete<T>(endpoint)
```

**Token Refresh Flow:**
1. Request fails with 401
2. Check if already refreshing (isRefreshing flag)
3. If refreshing, queue request (subscribe to refresh completion)
4. If not refreshing, call /auth/refresh
5. Retry original request with new token
6. If refresh fails, redirect to login

#### 2. Auth Store (`stores/authStore.ts`)
**Changes:**
- Removed localStorage persistence (security)
- Added `checkSession()` method for session restore
- Added async `logout()` that calls backend
- Initial state: `isLoading: true` (session check in progress)

**State:**
```typescript
{
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  userRole: UserRole | null
  permissions: Permission[]
}
```

**Methods:**
- `login(user)`: Store user in memory
- `logout()`: Call backend logout, clear state
- `checkSession()`: Call /auth/me to restore session
- `setUser(user)`: Update user state

#### 3. Protected Route Component (`components/auth/ProtectedRoute.tsx`)
**Behavior:**
- Shows loading spinner while checking session
- Redirects to login if not authenticated
- Redirects to role-specific dashboard if wrong role
- Renders children if authenticated with correct role

**Usage:**
```tsx
<ProtectedRoute allowedRoles={['student']}>
  <StudentDashboard />
</ProtectedRoute>
```

#### 4. Session Provider (`components/auth/SessionProvider.tsx`)
**Purpose:** Calls `checkSession()` on app mount to restore session from cookies

**Placement:** Wrapped around all children in `app/layout.tsx`

## Flow Diagrams

### Student Signup Flow

```
User fills signup form
    ↓
Frontend: POST /auth/student/signup
    ↓
Backend: Create user + student profile
    ↓
Backend: Generate JWT tokens
    ↓
Backend: Set httpOnly cookies (accessToken, refreshToken)
    ↓
Backend: Return { user } (no tokens)
    ↓
Frontend: Store user in Zustand (memory only)
    ↓
Frontend: Redirect to /dashboard
```

### Login Flow

```
User fills login form
    ↓
Frontend: POST /auth/signin
    ↓
Backend: Validate credentials
    ↓
Backend: Generate JWT tokens
    ↓
Backend: Set httpOnly cookies
    ↓
Backend: Return { user }
    ↓
Frontend: Store user in Zustand
    ↓
Frontend: Redirect based on role:
  - student → /dashboard
  - reviewer → /reviewer/dashboard
  - super_admin → /admin/dashboard
```

### Session Restore Flow (Page Refresh)

```
User refreshes page
    ↓
SessionProvider mounts
    ↓
AuthStore: checkSession() called
    ↓
Frontend: GET /auth/me
    ↓
Backend: Validate JWT from cookie
    ↓
Backend: Return { user }
    ↓
Frontend: Update Zustand state
    ↓
User remains logged in
```

### Token Refresh Flow

```
User makes API request
    ↓
API Client: Send request with cookies
    ↓
Backend: Returns 401 (access token expired)
    ↓
API Client: Check if already refreshing
    ↓
If not refreshing: POST /auth/refresh
    ↓
Backend: Validate refresh token from cookie
    ↓
Backend: Generate new access token
    ↓
Backend: Set new cookies
    ↓
Backend: Return { user }
    ↓
API Client: Retry original request
    ↓
Request succeeds with new token
```

### Logout Flow

```
User clicks logout
    ↓
Frontend: AuthStore.logout()
    ↓
Frontend: POST /auth/logout
    ↓
Backend: Clear cookies server-side
    ↓
Frontend: Clear Zustand state
    ↓
Frontend: Redirect to /login
```

## Security Features

### 1. HttpOnly Cookies
- Tokens inaccessible to JavaScript (XSS protection)
- Automatic CSRF protection via sameSite attribute
- Secure flag in production (HTTPS only)

### 2. No Token Storage in Frontend
- Tokens never in localStorage
- Tokens never in sessionStorage
- Tokens never in React state
- Only stored in httpOnly cookies

### 3. Automatic Token Rotation
- Access tokens expire quickly (1 hour)
- Refresh tokens last longer (7 days)
- Automatic refresh on 401 errors
- Single refresh endpoint prevents race conditions

### 4. Role-Based Routing
- Protected routes check user role
- Automatic redirect to correct dashboard
- Role-based access control in API

## Environment Variables

### Backend (.env)
```env
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
NODE_ENV=production
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3002/api/v1
```

## API Endpoints

### Public Endpoints
- `POST /api/v1/auth/student/signup` - Student registration
- `POST /api/v1/auth/signin` - Login for all roles
- `POST /api/v1/auth/refresh` - Refresh access token

### Protected Endpoints
- `POST /api/v1/auth/logout` - Logout (requires auth)
- `GET /api/v1/auth/me` - Get current user (requires auth)

## Testing the Flow

### 1. Student Signup
```bash
# Backend should be running on port 3002
# Frontend should be running on port 3000

1. Navigate to http://localhost:3000/signup
2. Fill form: fullName, email, university, graduationYear, password
3. Submit
4. Should redirect to /dashboard
5. Check browser DevTools → Application → Cookies
6. Verify accessToken and refreshToken cookies exist (httpOnly)
```

### 2. Login
```bash
1. Navigate to http://localhost:3000/login
2. Enter email and password
3. Submit
4. Should redirect to role-specific dashboard
5. Check cookies are set
```

### 3. Session Restore
```bash
1. Login as student
2. Refresh page (F5)
3. Should remain logged in
4. Check DevTools Network tab for /auth/me call
```

### 4. Token Refresh
```bash
1. Login as student
2. Wait for access token to expire (or expire manually in backend)
3. Make any protected API request
4. Should see /auth/refresh call in Network tab
5. Original request should succeed after refresh
```

### 5. Logout
```bash
1. Login as student
2. Click logout
3. Should redirect to /login
4. Cookies should be cleared
5. Zustand state should be cleared
```

## Troubleshooting

### Issue: Cookies not being set
**Solution:**
- Check CORS configuration in backend
- Verify `credentials: 'include'` in API client
- Ensure cookie-parser middleware is enabled in main.ts

### Issue: Session not restoring on refresh
**Solution:**
- Verify SessionProvider is in layout.tsx
- Check checkSession() is being called
- Verify /auth/me endpoint works in browser DevTools

### Issue: Token refresh not working
**Solution:**
- Check refresh token cookie exists
- Verify /auth/refresh endpoint works
- Check API client refresh logic
- Look for duplicate refresh calls (isRefreshing flag)

### Issue: 401 on all requests
**Solution:**
- Verify cookies are being sent (check Network tab)
- Check JWT strategy extracts from cookie
- Verify token is not expired
- Check backend CORS credentials setting

## Production Deployment

### Backend Changes Required
1. Set `NODE_ENV=production`
2. Set `secure: true` for cookies (HTTPS required)
3. Use strong JWT secrets
4. Configure proper CORS origins

### Frontend Changes Required
1. Set `NEXT_PUBLIC_API_URL` to production URL
2. Ensure HTTPS is enabled
3. Configure proper domain for cookies

## Future Enhancements

1. **Refresh Token Storage in Database**
   - Store refresh tokens in database
   - Implement token revocation
   - Add device tracking

2. **Remember Me Functionality**
   - Longer-lived refresh tokens
   - Persistent sessions

3. **Multi-Factor Authentication**
   - 2FA for admin accounts
   - TOTP support

4. **Social Login**
   - Google OAuth
   - GitHub OAuth

5. **Email Verification**
   - Verify email on signup
   - Email confirmation flow
