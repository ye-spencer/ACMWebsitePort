# Implementation Guide: Updating Components to Use AppContext

## Quick Start Checklist

### ✅ Completed
- [x] Created `AppContext` with centralized state management
- [x] Updated `App.tsx` to use `AppProvider` and removed prop drilling
- [x] Refactored `Navbar.tsx` to use context
- [x] Updated `LoginPage.tsx` to use context
- [x] Updated `ProfilePage.tsx` to use context  
- [x] Updated `HomePage.tsx` to use context

### 🔄 Remaining Components to Update

#### 1. **AboutPage.tsx**
```typescript
// Remove this interface
interface AboutPageProps {
  navigateTo: (page: string, errorMessage?: string) => void;
  error?: string;
}

// Replace with
const AboutPage: React.FC = () => {
  const { navigateTo, error } = useApp();
  // Rest of component logic
};
```

#### 2. **EventsPage.tsx**
```typescript
// Remove this interface
interface EventsPageProps {
  navigateTo: (page: string, errorMessage?: string) => void;
  error?: string;
}

// Replace with
const EventsPage: React.FC = () => {
  const { navigateTo, error } = useApp();
  // Rest of component logic
};
```

#### 3. **CreditsPage.tsx**
```typescript
// Remove this interface
interface CreditsPageProps {
  navigateTo: (page: string, errorMessage?: string) => void;
  error?: string;
}

// Replace with
const CreditsPage: React.FC = () => {
  const { navigateTo, error } = useApp();
  // Rest of component logic
};
```

#### 4. **BookingPage.tsx**
```typescript
// Remove this interface
interface BookingPageProps {
  navigateTo: (page: string, errorMessage?: string) => void;
  error?: string;
}

// Replace with
const BookingPage: React.FC = () => {
  const { user, navigateTo, error, isLoggedIn } = useApp();
  
  // If this page requires authentication, add:
  useEffect(() => {
    if (!isLoggedIn) {
      navigateTo('login', 'Please log in to book the lounge');
    }
  }, [isLoggedIn, navigateTo]);
  
  // Rest of component logic
};
```

#### 5. **AdminPage.tsx**
```typescript
// Remove this interface
interface AdminPageProps {
  navigateTo: (page: string, errorMessage?: string) => void;
  error?: string;
}

// Replace with
const AdminPage: React.FC = () => {
  const { user, navigateTo, error, isAdmin } = useApp();
  
  // Add admin check
  useEffect(() => {
    if (!isAdmin) {
      navigateTo('home', 'Admin access required');
    }
  }, [isAdmin, navigateTo]);
  
  // Rest of component logic
};
```

## Standard Migration Pattern

### For Each Component:

1. **Add Import**
```typescript
import { useApp } from '../contexts/AppContext';
```

2. **Remove Props Interface**
```typescript
// Remove interfaces like this:
interface ComponentProps {
  navigateTo: (page: string, errorMessage?: string) => void;
  error?: string;
}
```

3. **Update Component Declaration**
```typescript
// Change from:
const Component: React.FC<ComponentProps> = ({ navigateTo, error }) => {

// To:
const Component: React.FC = () => {
  const { navigateTo, error } = useApp();
```

4. **Remove Local Auth State Management**
```typescript
// Remove code like this:
const [isLoggedIn, setIsLoggedIn] = useState(false);
useEffect(() => {
  onAuthStateChanged(auth, (user) => {
    setIsLoggedIn(!!user);
  });
}, []);

// Use context instead:
const { isLoggedIn } = useApp();
```

## Testing the Implementation

### 1. **Run the Application**
```bash
cd acm_website
npm start
```

### 2. **Test Authentication Flow**
- Navigate to login page
- Verify navbar updates when logged in/out
- Check profile page redirects properly
- Test admin page access

### 3. **Test Error Handling**
- Verify errors display consistently
- Test error clearing on navigation
- Check error messages appear in all relevant components

### 4. **Test Navigation**
- Verify all navigation works without prop drilling
- Test deep-linking to pages
- Check protected routes redirect properly

## Common Issues & Solutions

### Issue 1: TypeScript Errors
```typescript
// If you get context errors, make sure:
import { useApp } from '../contexts/AppContext';

// And that the component is wrapped in AppProvider
```

### Issue 2: Auth State Not Updating
```typescript
// Make sure you're using the context user, not managing local state:
const { user, isLoggedIn } = useApp();

// Instead of:
const [user, setUser] = useState(null);
```

### Issue 3: Navigation Not Working
```typescript
// Make sure you're using context navigation:
const { navigateTo } = useApp();

// Instead of:
const navigate = useNavigate();
```

## Performance Optimization

### 1. **Memoize Context Values**
If you experience performance issues, the context provider can be optimized:
```typescript
const value = useMemo(() => ({
  user,
  isLoggedIn,
  isAdmin,
  authLoading,
  error,
  setError,
  clearError,
  navigateTo,
  isLoading,
  setIsLoading,
}), [user, isLoggedIn, isAdmin, authLoading, error, navigateTo, isLoading]);
```

### 2. **Split Context if Needed**
For very large applications, consider splitting into multiple contexts:
```typescript
// AuthContext for authentication
// NavigationContext for navigation
// ErrorContext for error handling
```

## Final Validation

After updating all components, verify:
- [ ] No component receives `navigateTo` or `error` props
- [ ] All components use `useApp()` hook
- [ ] Single `onAuthStateChanged` listener (in AppContext only)
- [ ] No duplicate auth state management
- [ ] All navigation works correctly
- [ ] Error handling works consistently
- [ ] Application performance is maintained/improved

## Next Steps

1. **Update remaining components** using the patterns above
2. **Remove unused prop interfaces** from all components
3. **Test thoroughly** in all browsers
4. **Update any tests** to mock the context instead of props
5. **Consider state persistence** for better UX
6. **Add loading states** for better feedback

This implementation provides a solid foundation for scalable state management while eliminating the prop drilling and authentication duplication issues.