// Auth types
export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
}

export interface Session {
  id: string;
  userId: string;
  expiresAt: Date;
  createdAt: Date;
}

// In-memory storage for users and sessions
const users: Record<string, User> = {
  'user-1': {
    id: 'user-1',
    username: 'testuser',
    email: 'test@example.com',
    name: 'Test User'
  },
  'user-2': {
    id: 'user-2',
    username: 'adminuser',
    email: 'admin@example.com',
    name: 'Admin User'
  }
};

const sessions: Record<string, Session> = {};

// Helper to generate a unique session ID
const generateSessionId = (): string => {
  return 'sess_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 10);
};

// Create a new session for a user
export const createSession = (userId: string): Session => {
  // Check if user exists
  if (!users[userId]) {
    throw new Error('User not found');
  }
  
  // Create expiry date (24 hours from now)
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24);
  
  // Create new session
  const sessionId = generateSessionId();
  const session: Session = {
    id: sessionId,
    userId,
    expiresAt,
    createdAt: new Date()
  };
  
  // Store session
  sessions[sessionId] = session;
  
  return session;
};

// Get session by ID
export const getSession = (sessionId: string): Session | null => {
  const session = sessions[sessionId];
  
  if (!session) {
    return null;
  }
  
  // Check if session is expired
  if (new Date() > session.expiresAt) {
    // Remove expired session
    delete sessions[sessionId];
    return null;
  }
  
  return session;
};

// Validate credentials and log in
export const login = (username: string, password: string): { user: User; session: Session } | null => {
  // In a real app, you would check credentials against a database
  // For this dummy auth, we'll just check if the username exists and assume password is correct
  const user = Object.values(users).find(u => u.username === username);
  
  if (!user) {
    return null;
  }
  
  // Create session
  const session = createSession(user.id);
  
  return { user, session };
};

// Log out by destroying session
export const logout = (sessionId: string): boolean => {
  if (sessions[sessionId]) {
    delete sessions[sessionId];
    return true;
  }
  
  return false;
};

// Get user by session ID
export const getUserBySession = (sessionId: string): User | null => {
  const session = getSession(sessionId);
  
  if (!session) {
    return null;
  }
  
  return users[session.userId] || null;
};

// For demonstration purposes: get all active sessions
export const getActiveSessions = (): Session[] => {
  return Object.values(sessions).filter(session => new Date() <= session.expiresAt);
};

// Register a new user (in a real app, this would add to database)
export const registerUser = (username: string, email: string, name: string, password: string): User | null => {
  // Check if username already exists
  if (Object.values(users).some(u => u.username === username)) {
    return null;
  }
  
  const userId = `user-${Object.keys(users).length + 1}`;
  const newUser: User = {
    id: userId,
    username,
    email,
    name
  };
  
  // Add to users
  users[userId] = newUser;
  
  return newUser;
}; 