<script setup>
import { reactive, provide, ref } from 'vue';
import { useRouter } from 'vue-router';
import useAuth from '../../composables/UseAuth';

const message = ref('');
const loading = ref(false);

const login = reactive({
    email: "",
    password: "",
});

const router = useRouter();
const { error, login: authLogin } = useAuth();

const handleSubmit = async (e) => {
    e.preventDefault();
    loading.value = true;
    const res = await authLogin(login);
    if (res.success) {
        message.value = message; 
        router.push('/inventory');
    }else if (res.errors){
        error.value = res.errors.message;
    }
    loading.value = false;
};

</script>


<template>
     <div>
        <div v-if="message" class="alert-message">
            <div class="bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-3" role="alert">
                <p class="font-bold">{{message}}</p>
            </div>
        </div>
        <div v-if="error" class="alert-message">
            <div class="bg-red-100 border-t border-b border-blue-500 text-blue-700 px-4 py-3" role="alert">
                <p class="font-bold">{{error}}</p>
            </div>
        </div>
        <div class="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
            <div class="relative py-3 sm:max-w-xl sm:mx-auto">
                <div
                    class="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl">
                </div>
                <div class="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
                    <div class="max-w-md mx-auto">
                        <div>
                            <h1 class="text-2xl font-semibold">Login Form with Floating Labels</h1>
                        </div>
                        <div class="divide-y divide-gray-200">
                            <form @submit.prevent="handleSubmit" class="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                                <div class="relative">
                                    <input v-model="login.email" autoComplete="off" id="email" name="email" type="text" class="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="Email address"  required/>
                                    <label htmlFor="email" class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Email Address</label>
                                </div>
                                <div class="relative">
                                    <input v-model="login.password" autoComplete="off" id="password" name="password" type="password" class="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="Password"  required/>
                                    <label htmlFor="password" class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Password</label>
                                </div>
                                <div class='flex justify-between'>
                                    <div class="relative">
                                        <button class="bg-blue-500 text-white rounded-md px-2 py-1">
                                            <div v-if="loading">
                                                Submiting...
                                            </div>
                                            <div v-else>
                                                Submit
                                            </div>
                                        </button>
                                    </div>
                                    <RouterLink  to='/register' class="text-blue-500">Register</RouterLink>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>