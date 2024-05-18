import { ref } from 'vue';
import AuthApi from '../api/AuthApi';

// const user = ref(null);
const error = ref(null);
const isAuthenticated = ref(localStorage.getItem('users') ? true : false);
const user = ref(localStorage.getItem('users') || '');

const setAuth = (authUser) => {
    user.value = authUser;
    isAuthenticated.value = true;
    localStorage.setItem('users', authUser);
    // token.value = authToken;
    // localStorage.setItem('token', authToken);
    // axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
};
  
const clearAuth = () => {
    user.value = null;
    isAuthenticated.value = false;
    // token.value = '';
    // localStorage.removeItem('token');
    // delete axios.defaults.headers.common['Authorization'];
};

const login = async (credentials) => {
    try {
        const res = await AuthApi.login(credentials);
        if (res.success) {
            setAuth(res.data.data);
            error.value = null;
            return { success: true, message: res.data.message };
        } else {
            error.value = res.errors.message;
            return { success: false, message: res.errors.message };
        }
    } catch (err) {
        error.value = 'An error occurred while logging in.';
        return { success: false, message: 'An error occurred while logging in.' };
    }
};

// const logout = async () => {
//     // Add your logout logic here, if any.
//     user.value = null;
// };


const useAuth = () => {
    return {
        user,
        isAuthenticated,
        error,
        login,
        // logout,
    };
};

export default useAuth;
