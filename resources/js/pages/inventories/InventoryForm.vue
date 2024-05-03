<script setup>
import { reactive, watchEffect, defineProps, ref } from 'vue';
import { useRouter } from 'vue-router';
import InventoryApi from '../../api/InventoryApi';

const router = useRouter();
const message = ref('');
const loading = ref(false);
const fetchData = ref(false);

const inventory = reactive({
  name: '',
  description: '',
});

const props = defineProps({
  id: {
    required: true,
    type: String,
  },
});
const id = props.id;

const getInventory = async (id) => {
  fetchData.value = true;
  const res = await InventoryApi.show(id);
  if (res.success) {
    Object.assign(inventory, res.data.data);
    fetchData.value = false;
  }
};

watchEffect(() => {
  if (id) {
    getInventory(id);
  }
}, [id]);

const handleSubmit = async (e) => {
  e.preventDefault();
  loading.value = true;
  id ? (inventory.id = id) : '';
  const res = await InventoryApi.save(inventory);
  if (res.success) {
    message.value = res.data.message;
    loading.value = false;
    router.push('/inventory');
  }
};

</script>

<template>
     <div>
        <div v-if="message" class="alert-message">
            <div class="bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-3" role="alert">
                <p class="font-bold">{{message}}</p>
            </div>
        </div>

        <div v-if="fetchData" class='m-auto'><p class='text-2xl text-bold text-center'>Loading...</p> </div>

        <section v-else class="max-w-7xl p-6 mx-auto">
        <form @submit.prevent="handleSubmit">
            <div class='grid grid-cols-2'>
                <div>
                      <h2 class="text-lg font-semibold text-gray-700 capitalize dark:text-white">{{id ? 'Edit' : 'Add'}} Inventory</h2>
                </div>
                <div class="flex justify-end">
                    <button type='submit' class="px-6 py-2 leading-5 text-white transition-colors duration-200 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600">
                      <div v-if="loading">
                        Submiting...
                      </div>
                      <div v-else>
                        Submit
                      </div>
                    </button>
                </div>
            </div>
                <div class="grid grid-cols-1 gap-6 mt-4 ">
                    <div class="">
                        <label class="text-gray-700 dark:text-gray-200" for="name">Name</label>
                        <input id="name" type="text" class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                        name="name" v-model="inventory.name" required/>
                    </div>
                    <div class="">
                        <label class="text-gray-700 dark:text-gray-200" for="">Description</label>
                        <textarea id="description" type="text" class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                        name="description" v-model="inventory.description" />
                    </div>
                </div>
            </form>
        </section>
    </div>
</template>