import api from './api';

// Helper to get registered users stored locally for offline/demo testing
const getStoredUsers = () => {
  try {
    const data = localStorage.getItem('registered_users');
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

const saveUserLocally = (userObj) => {
  const users = getStoredUsers();
  const existingIndex = users.findIndex(u => u.email.toLowerCase() === userObj.email.toLowerCase());
  if (existingIndex >= 0) {
    users[existingIndex] = { ...users[existingIndex], ...userObj };
  } else {
    users.push(userObj);
  }
  localStorage.setItem('registered_users', JSON.stringify(users));
};

export const authService = {
  async login(email, password, role = 'GUEST') {
    if (!email || !password) {
      throw new Error('Incorrect password or username');
    }

    try {
      // Attempt backend API login first
      const response = await api.post('/auth/login', { email, password });
      if (response.data?.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
      }
      return response.data;
    } catch (error) {
      // If the backend API responded with an error, credentials were wrong
      if (error.response) {
        throw new Error('Incorrect password or username');
      }

      // If backend is offline, validate using stored local user credentials
      console.warn('Backend server offline or unreachable. Validating via local auth provider.');
      
      const storedUsers = getStoredUsers();
      const match = storedUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (match) {
        if (match.password !== password) {
          throw new Error('Incorrect password or username');
        }
        const mockToken = 'mock_jwt_token_' + Date.now();
        localStorage.setItem('accessToken', mockToken);
        return { accessToken: mockToken, user: match };
      }

      // If user hasn't registered locally yet, require minimum 6 character password
      if (password.length < 6) {
        throw new Error('Incorrect password or username');
      }

      // Save user record for future logins
      const newUserRecord = { email, password, role, name: email.split('@')[0] };
      saveUserLocally(newUserRecord);

      const mockToken = 'mock_jwt_token_' + Date.now();
      localStorage.setItem('accessToken', mockToken);
      return { accessToken: mockToken, user: newUserRecord };
    }
  },

  async signup(name, email, password) {
    if (!name || !email || !password) {
      throw new Error('All fields (name, email, password) are required.');
    }
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    try {
      const response = await api.post('/auth/signup', { name, email, password });
      saveUserLocally({ name, email, password, role: 'GUEST' });
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data?.message || 'Signup failed. Email may already be registered.');
      }
      saveUserLocally({ name, email, password, role: 'GUEST' });
      return { id: Date.now(), name, email, roles: ['GUEST'] };
    }
  },

  async signupAsHotelManager(name, email, password) {
    if (!name || !email || !password) {
      throw new Error('All fields (name, email, password) are required.');
    }
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    try {
      const response = await api.post('/auth/signup/hotelManager', { name, email, password });
      saveUserLocally({ name, email, password, role: 'HOTEL_MANAGER' });
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data?.message || 'Hotel Manager signup failed.');
      }
      saveUserLocally({ name, email, password, role: 'HOTEL_MANAGER' });
      return { id: Date.now(), name, email, roles: ['HOTEL_MANAGER'] };
    }
  },

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('currentUser');
  }
};
