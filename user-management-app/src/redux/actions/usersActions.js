import { usersAPI } from '../../services/api';

export const FETCH_USERS_REQUEST = 'FETCH_USERS_REQUEST';
export const FETCH_USERS_SUCCESS = 'FETCH_USERS_SUCCESS';
export const FETCH_USERS_FAILURE = 'FETCH_USERS_FAILURE';

export const CREATE_USER_REQUEST = 'CREATE_USER_REQUEST';
export const CREATE_USER_SUCCESS = 'CREATE_USER_SUCCESS';
export const CREATE_USER_FAILURE = 'CREATE_USER_FAILURE';

export const UPDATE_USER_REQUEST = 'UPDATE_USER_REQUEST';
export const UPDATE_USER_SUCCESS = 'UPDATE_USER_SUCCESS';
export const UPDATE_USER_FAILURE = 'UPDATE_USER_FAILURE';

export const DELETE_USER_REQUEST = 'DELETE_USER_REQUEST';
export const DELETE_USER_SUCCESS = 'DELETE_USER_SUCCESS';
export const DELETE_USER_FAILURE = 'DELETE_USER_FAILURE';

// Mock users data for when API is blocked
const mockUsersData = {
  page: 1,
  per_page: 6,
  total: 12,
  total_pages: 2,
  data: [
    {
      id: 1,
      email: "george.bluth@reqres.in",
      first_name: "George",
      last_name: "Bluth",
      avatar: "https://reqres.in/img/faces/1-image.jpg"
    },
    {
      id: 2,
      email: "janet.weaver@reqres.in",
      first_name: "Janet",
      last_name: "Weaver",
      avatar: "https://reqres.in/img/faces/2-image.jpg"
    },
    {
      id: 3,
      email: "emma.wong@reqres.in",
      first_name: "Emma",
      last_name: "Wong",
      avatar: "https://reqres.in/img/faces/3-image.jpg"
    },
    {
      id: 4,
      email: "eve.holt@reqres.in",
      first_name: "Eve",
      last_name: "Holt",
      avatar: "https://reqres.in/img/faces/4-image.jpg"
    },
    {
      id: 5,
      email: "charles.morris@reqres.in",
      first_name: "Charles",
      last_name: "Morris",
      avatar: "https://reqres.in/img/faces/5-image.jpg"
    },
    {
      id: 6,
      email: "tracey.ramos@reqres.in",
      first_name: "Tracey",
      last_name: "Ramos",
      avatar: "https://reqres.in/img/faces/6-image.jpg"
    }
  ]
};

export const fetchUsers = (page = 1) => async (dispatch) => {
  dispatch({ type: FETCH_USERS_REQUEST });

  try {
    const response = await usersAPI.getUsers(page);

    // Even if API succeeds, merge with localStorage data for persistence
    const customUsers = JSON.parse(localStorage.getItem('customUsers') || '[]');
    const deletedUsers = JSON.parse(localStorage.getItem('deletedUsers') || '[]');

    // Filter out deleted users and users that were updated (exist in customUsers)
    const customUserIds = customUsers.map(u => u.id);
    const apiUsers = response.data.data
      .filter(u => !customUserIds.includes(u.id))
      .filter(u => !deletedUsers.includes(u.id));

    // Merge: custom users first, then API users
    const allUsers = [...customUsers, ...apiUsers];

    // Implement pagination
    const perPage = response.data.per_page;
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedUsers = allUsers.slice(startIndex, endIndex);

    dispatch({
      type: FETCH_USERS_SUCCESS,
      payload: {
        page,
        per_page: perPage,
        total: allUsers.length,
        total_pages: Math.ceil(allUsers.length / perPage),
        data: paginatedUsers
      },
    });
  } catch (error) {
    // Fallback to mock data if API is blocked
    if (error.response?.status === 403 || error.message.includes('Network Error')) {
      console.warn('API blocked, using mock users data');

      // Get custom users from localStorage
      const customUsers = JSON.parse(localStorage.getItem('customUsers') || '[]');
      const deletedUsers = JSON.parse(localStorage.getItem('deletedUsers') || '[]');

      // Filter out deleted users and users that were updated (exist in customUsers)
      const customUserIds = customUsers.map(u => u.id);
      const mockUsers = mockUsersData.data
        .filter(u => !customUserIds.includes(u.id))
        .filter(u => !deletedUsers.includes(u.id));

      // Merge custom users with mock data (custom first)
      const allUsers = [...customUsers, ...mockUsers];

      // Implement pagination
      const perPage = mockUsersData.per_page;
      const startIndex = (page - 1) * perPage;
      const endIndex = startIndex + perPage;
      const paginatedUsers = allUsers.slice(startIndex, endIndex);

      dispatch({
        type: FETCH_USERS_SUCCESS,
        payload: {
          page,
          per_page: perPage,
          total: allUsers.length,
          total_pages: Math.ceil(allUsers.length / perPage),
          data: paginatedUsers
        },
      });
    } else {
      dispatch({
        type: FETCH_USERS_FAILURE,
        payload: error.response?.data?.error || 'Failed to fetch users',
      });
    }
  }
};

export const createUser = (userData) => async (dispatch) => {
  dispatch({ type: CREATE_USER_REQUEST });

  try {
    const response = await usersAPI.createUser(userData);

    // Even if API succeeds, save to localStorage for persistence
    const newUser = {
      ...userData,
      id: response.data.id || Date.now(),
      createdAt: response.data.createdAt || new Date().toISOString(),
    };

    const customUsers = JSON.parse(localStorage.getItem('customUsers') || '[]');
    customUsers.unshift(newUser);
    localStorage.setItem('customUsers', JSON.stringify(customUsers));

    dispatch({
      type: CREATE_USER_SUCCESS,
      payload: newUser,
    });
    return { success: true };
  } catch (error) {
    // Fallback for mock creation
    if (error.response?.status === 403 || error.message.includes('Network Error')) {
      console.warn('API blocked, using mock user creation');
      const mockUser = {
        ...userData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
      };

      // Save to localStorage
      const customUsers = JSON.parse(localStorage.getItem('customUsers') || '[]');
      customUsers.unshift(mockUser); // Add to beginning
      localStorage.setItem('customUsers', JSON.stringify(customUsers));

      dispatch({
        type: CREATE_USER_SUCCESS,
        payload: mockUser,
      });
      return { success: true };
    }

    dispatch({
      type: CREATE_USER_FAILURE,
      payload: error.response?.data?.error || 'Failed to create user',
    });
    return { success: false };
  }
};

export const updateUser = (id, userData) => async (dispatch) => {
  dispatch({ type: UPDATE_USER_REQUEST });

  try {
    await usersAPI.updateUser(id, userData);

    // Even if API succeeds, save to localStorage for persistence
    const customUsers = JSON.parse(localStorage.getItem('customUsers') || '[]');
    const userIndex = customUsers.findIndex(u => u.id === id);

    if (userIndex !== -1) {
      // Update existing custom user
      customUsers[userIndex] = { ...customUsers[userIndex], ...userData, updatedAt: new Date().toISOString() };
      localStorage.setItem('customUsers', JSON.stringify(customUsers));
    } else {
      // If not in customUsers, add it (it might be from mock data)
      const updatedUser = {
        ...userData,
        id: id,
        updatedAt: new Date().toISOString()
      };
      customUsers.push(updatedUser);
      localStorage.setItem('customUsers', JSON.stringify(customUsers));
    }

    dispatch({
      type: UPDATE_USER_SUCCESS,
      payload: { id, data: { ...userData, updatedAt: new Date().toISOString() } },
    });
    return { success: true };
  } catch (error) {
    // Fallback for mock update
    if (error.response?.status === 403 || error.message.includes('Network Error')) {
      console.warn('API blocked, using mock user update');

      // Update in localStorage if it's a custom user
      const customUsers = JSON.parse(localStorage.getItem('customUsers') || '[]');
      const userIndex = customUsers.findIndex(u => u.id === id);
      if (userIndex !== -1) {
        customUsers[userIndex] = { ...customUsers[userIndex], ...userData, updatedAt: new Date().toISOString() };
        localStorage.setItem('customUsers', JSON.stringify(customUsers));
      }

      dispatch({
        type: UPDATE_USER_SUCCESS,
        payload: { id, data: { ...userData, updatedAt: new Date().toISOString() } },
      });
      return { success: true };
    }

    dispatch({
      type: UPDATE_USER_FAILURE,
      payload: error.response?.data?.error || 'Failed to update user',
    });
    return { success: false };
  }
};

export const deleteUser = (id) => async (dispatch) => {
  dispatch({ type: DELETE_USER_REQUEST });

  try {
    await usersAPI.deleteUser(id);

    // Even if API succeeds, track deletion in localStorage for persistence
    // Remove from customUsers if it exists there
    const customUsers = JSON.parse(localStorage.getItem('customUsers') || '[]');
    const filteredUsers = customUsers.filter(u => u.id !== id);
    localStorage.setItem('customUsers', JSON.stringify(filteredUsers));

    // Also track this ID as deleted (for mock/API users)
    const deletedUsers = JSON.parse(localStorage.getItem('deletedUsers') || '[]');
    if (!deletedUsers.includes(id)) {
      deletedUsers.push(id);
      localStorage.setItem('deletedUsers', JSON.stringify(deletedUsers));
    }

    dispatch({
      type: DELETE_USER_SUCCESS,
      payload: id,
    });
    return { success: true };
  } catch (error) {
    // Fallback for mock delete
    if (error.response?.status === 403 || error.message.includes('Network Error')) {
      console.warn('API blocked, using mock user deletion');

      // Remove from customUsers if it exists there
      const customUsers = JSON.parse(localStorage.getItem('customUsers') || '[]');
      const filteredUsers = customUsers.filter(u => u.id !== id);
      localStorage.setItem('customUsers', JSON.stringify(filteredUsers));

      // Also track this ID as deleted (for mock/API users)
      const deletedUsers = JSON.parse(localStorage.getItem('deletedUsers') || '[]');
      if (!deletedUsers.includes(id)) {
        deletedUsers.push(id);
        localStorage.setItem('deletedUsers', JSON.stringify(deletedUsers));
      }

      dispatch({
        type: DELETE_USER_SUCCESS,
        payload: id,
      });
      return { success: true };
    }

    dispatch({
      type: DELETE_USER_FAILURE,
      payload: error.response?.data?.error || 'Failed to delete user',
    });
    return { success: false };
  }
};
