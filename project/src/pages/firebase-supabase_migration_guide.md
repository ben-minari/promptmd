Based on my analysis of the codebase, I can now provide a comprehensive migration guide for adapting your web app to be compatible with this Chrome extension's Firebase backend. Here's the detailed migration plan:

# Migration Guide: Supabase to Firebase

## 1. Firebase Configuration

The codebase already has Firebase set up with the following structure:

### Environment Variables Required
PLASMO_PUBLIC_FIREBASE_API_KEY=AIzaSyBWr0dD9U9fWzJ3tjNh2sSnl6K7t6V3OTg
PLASMO_PUBLIC_FIREBASE_AUTH_DOMAIN=promptmd-28c39.firebaseapp.com
PLASMO_PUBLIC_FIREBASE_PROJECT_ID=promptmd-28c39
PLASMO_PUBLIC_FIREBASE_STORAGE_BUCKET=promptmd-28c39.firebasestorage.app
PLASMO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=725964297899
PLASMO_PUBLIC_FIREBASE_APP_ID=1:725964297899:web:37e0f8f4654735a92b49ee
PLASMO_PUBLIC_MEASUREMENT_ID=G-TEB4LZ4TEW

FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-fbsvc@promptmd-28c39.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCp6b2g5WTDrYSs\nqpjx6BJXTNYaERrINAHnviwSSMoI7kfBbE0cEPFAs9qa83BsgHbGVHE56pzlY10p\nb61rndOBGHu6OvuQlsg4VnWh72D/swNoJMeF7+fvQ7Hul+mFSb9wBJWSAYHciT1H\nM5f2GE5rKMuKhlZX4H2dnWUx2JTv/ildrWG7Az63IPNfT3aOJBLFw+XbkEjW341Y\nfUa5nPvwj02UK48d0gOramBYz+hkH1NZ13IFncfxJD6EAlex8zMU0VDxUB7Usxqr\ngHzcDzHqMkzSavOqD/wURFMKqqnzefeAYvNMWCFn3QJGX6DbSreCCLd89ZP0qokR\nJu7y7E01AgMBAAECggEAAaJ4ixA56HIGaTzY7NbdOk7IbobEmbF6ZTbcqK5flzdn\npFI86ay2DXfNfhkid0DDI8RTNInvyXsrvcbPxc3GZ6MLKa8AlZMFyRj31798UOlx\nenKEIuM8eX5Ou2tluT0M5PB+WeG+1JbTaphx+VGhi4Fgd+wz73N+8eG+Q/z/7dEh\npGEIG3BPPiCwJZi+yLfbMs5i7+Q42gxM8PUiZ9LLxCK6tBl0V9tWSv/u0/BBm8wO\n9RFm7YT1uJZ447BIXQ1CPy8nUFiZS2DXjZYb6jSlbJjIPcaPxol4bKAjQ0B53v1I\n7u/n+15KjME9pNMKbaJVI91Wifr293yiHkx+N2XjMQKBgQDSeY8xwk2gwnDeihcI\nmyRYPLDO01TuiQl4yTqmd98mmaTRfJQSSou7XK7pnGYgQon0RxE2a7bNvEWMFTrN\n7m1opcjuXj28vF4VDn0ZXB/x1mUIoISLcVKqo/x16UgsSe0d8wRLlmDGPQtzLgSg\nTdkbvaLkDJHcItKAkL+OWEt1aQKBgQDOqjBC3SIn09PnPgTpmWm8S+7a08os7B/7\nR/jI4GqPu9DEbzq71gslDKlDOQeBDgbAq+dTYrprd/0ohXJ0T8FbAKJFIz8xLZfX\nWvfQ/87rHnpMsrDKcKvf6kRBQsj2eCeT1BVmbpj880clGHvJqvpUBfrggXDvdw5l\n6lTln0Fj7QKBgQCa81MwVtO/nmZp70+1zkGblFK2cW79jXWjrsG2/FkUmdh1QTnh\nnW/xp/I9mh61cUcOx6MsZXBXVlv9HUQFh5qUiDi9BDR/Vk4NQnVmziPWbvhCuana\n3rr1VXTveabgtCwU+GwZGcR1LUvYp/BP8//6JEpficF4R0qhy+66ZNZowQKBgQC1\ntj6pC/a0PjTb5lQ7cYDe54UlM4NY7GVSdH3zYh9QMjvl/EcQUauK8A8D5GkMuGCH\nmJ7VWsG/LMmTj4KLcnT4px4G3G77trMD0CCFy+cMJMg0GAoKdfcp8roBB8/bptpl\nyNzoK+aowt+TZmuxbnyc1IU6UZYTeANY6SmsnNLKIQKBgEnM9DoSjqK9M9p7qJqD\nw/G11Z6qWHvg4d8i1d7vmX91rEn05xKHqZnLeiNNxlyl6VcXxS4tZcGX0DFmCHSy\nAc3GgWyObGPu+xlorpzZifvaZMgc59TzPdi/f4+bdx2GUG6+TuSg3G/0mjZNbOo2\nNZobtX5oObxo++/J7IHqzLlv\n-----END PRIVATE KEY-----\n"

PLASMO_PUBLIC_GOOGLE_CLIENT_ID_DEV=725964297899-rne9qvn8ecd3kn9mo555vhi5442384kc.apps.googleusercontent.com
PLASMO_PUBLIC_GOOGLE_CLIENT_ID_PROD=725964297899-ph030pbskpcmrqvaemsmo93pp6an3keo.apps.googleusercontent.com

### Firebase Initialization
The Firebase app is initialized in `src/utils/firebase.ts` with Google Authentication provider.

## 2. Data Models

### Tools Collection
```typescript
interface Tool {
  id?: string
  type: "prompt" | "mcp" | "custom_gpt"
  status: "draft" | "published"
  title: string
  description: string
  content: string
  tags: {
    specialty: string[]
    useCase: string[]
    userType: string[]
    appModel: string[]
  }
  authorId: string
  organizationId?: string
  version: number
  createdAt: Timestamp
  updatedAt: Timestamp
  saveCount: number
  ratingAvg: number
  ratingCount: number
  isSaved?: boolean
  sources?: Array<{
    type: "url" | "user" | "text" | string
    value: string
    label?: string
  }>
}
```

### Ratings Collection
```typescript
interface Rating {
  id?: string
  toolId: string
  userId: string
  value: number
  comment?: string
  createdAt: Timestamp
}
```

## 3. Security Rules

The Firestore security rules are defined in `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Tools collection
    match /tools/{toolId} {
      allow read: if resource.data.status == "published";
      allow read, write: if isOwner(resource.data.authorId) 
        && resource.data.status == "draft";
      allow update: if isOwner(resource.data.authorId) 
        && resource.data.status == "published";
    }

    // User's saved tools
    match /users/{userId}/savedTools/{toolId} {
      allow read, write: if isOwner(userId);
    }

    // Ratings collection
    match /ratings/{ratingId} {
      allow read: if true;
      allow create: if isAuthenticated() 
        && request.resource.data.userId == request.auth.uid;
      allow update, delete: if isOwner(resource.data.userId);
    }

    // Users collection
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow write: if isOwner(userId);
    }
  }
}
```

## 4. Migration Steps

### Step 1: Authentication Migration
1. Replace Supabase auth with Firebase auth:
   - Use Google Authentication provider
   - Implement `signInWithGoogle()` method
   - Set up auth state listener using `onAuthStateChanged`
   - Store auth tokens in Chrome storage

### Step 2: Data Structure Migration
1. Create Firestore collections matching the schema above
2. Migrate your existing data to match the new schema:
   - Tools collection with the specified fields
   - Ratings collection
   - User's saved tools as subcollections

### Step 3: Service Layer Migration
1. Replace Supabase queries with Firestore queries:
   - Use the existing `toolsService` and `ratingsService` as reference
   - Implement real-time listeners using `onSnapshot`
   - Update CRUD operations to use Firestore methods

### Step 4: UI Components Migration
1. Update components to use Firebase hooks:
   - `useAuth` for authentication
   - `useFirestore` for data access
   - Implement real-time updates using Firestore listeners

## 5. Key Differences to Consider

1. **Real-time Updates**: 
   - Supabase uses subscriptions
   - Firebase uses `onSnapshot` listeners

2. **Query Structure**:
   - Supabase uses SQL-like queries
   - Firebase uses collection/document path and query constraints

3. **Security Rules**:
   - Supabase uses Row Level Security (RLS)
   - Firebase uses declarative security rules

4. **Data Structure**:
   - Supabase uses tables and relationships
   - Firebase uses collections and documents with subcollections

## 6. Testing Checklist

1. Authentication flow
   - Google sign-in
   - Auth state persistence
   - Token management

2. Data operations
   - CRUD operations for tools
   - Rating system
   - Saved tools functionality

3. Real-time updates
   - Tool updates
   - Rating changes
   - Saved tools synchronization

4. Security rules
   - Access control
   - Data validation
   - User permissions

## 7. Additional Considerations

1. **Multi-client Support**:
   - The codebase is designed for multi-client usage
   - Consider implementing organization-level access control
   - Use subcollections for user-specific data

2. **Performance**:
   - Implement pagination for large collections
   - Use batch operations for multiple writes
   - Consider caching strategies

3. **Error Handling**:
   - Implement proper error boundaries
   - Handle offline scenarios
   - Provide user feedback for operations

Would you like me to elaborate on any specific part of this migration guide or provide more detailed implementation steps for a particular component?
