<script setup>
import { reactive, watchEffect, ref } from 'vue';
import { useRouter } from 'vue-router';
import ItemApi from '../../api/ItemApi';
import InventoryApi from '../../api/InventoryApi';

const message = ref('');
const loading = ref(false);
const fetchData = ref(false);

const item = reactive({
    name: "",
    description: "",
    inventory_id: "",
    quantity: "",
    image: "",
    previewImage: null, 
});
const router = useRouter();
const inventory = ref([])
const props = defineProps({
  id: {
    required: true,
    type: String,
  },
});

const id = props.id;

const getInventory = async () => {
    const res = await InventoryApi.index();
    if (res.success) {
    inventory.value = res.data.data;
    }
};

const getItem = async (id) => {
    fetchData.value = true;
    const res = await ItemApi.show(id);
    if (res.success) {
        Object.assign(item, res.data.data);
        fetchData.value = false;
    }
};

const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "image") {
        const file = e.target.files[0];
        item.image = file;

        // Generate preview URL
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                item.previewImage = e.target.result; // Set the preview image
            };
            reader.readAsDataURL(file);
        } else {
            item.previewImage = null; // Clear the preview
        }
    } else {
        item[name] = value;
    }
};


const handleSubmit = async (e) => {
    e.preventDefault();
    id ? (item.id = id) : "";
    const formData = new FormData();
    Object.keys(item).forEach((key) => {
        formData.append(key, item[key]);
    });
    const res = await ItemApi.save(formData);
    if (res.success) {
        router.push('/item');
    }
};

watchEffect(() => {
    getInventory();
});

watchEffect(() => {
if (id) {
    getItem(id);
}
},[id]);

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
                            <h2 class="text-lg font-semibold text-gray-700 capitalize dark:text-white">{{id? 'Edit' : 'Add'}} Item</h2>
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
                    <div class=" mt-4 flex gap-6">
                        <div class="w-7/12 gap-4">
                            <div>
                                <label class="text-gray-700 dark:text-gray-200" htmlFor="name">Name</label>
                                <input id="name" type="text" class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" name="name"
                                 v-model="item.name" @change="handleChange" required/>
                            </div>

                            <div class="mt-2">
                                <label class="text-gray-700 dark:text-gray-200" htmlFor="description">Description</label>
                                <textarea id="description" type="text" class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" name="description"
                                v-model="item.description" @change="handleChange" />
                            </div>
                            <div class="mt-2">
                                <label class="text-gray-700 dark:text-gray-200">
                                    Image
                                </label>
                                <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                    <div class="space-y-1 text-center">
                                        <svg class="mx-auto h-12 w-12 text-gray-700 dark:text-gray-200" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <div class="flex text-sm text-gray-600">
                                            <label htmlFor="file-upload" class="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                                <span class="">Upload a file</span>
                                                <input id="file-upload" name="image" accept='image/*' type="file" class="sr-only" @change="handleChange" />
                                            </label>
                                            <p class="pl-1 text-gray-700 dark:text-gray-200">or drag and drop</p>
                                        </div>
                                        <p class="text-xs text-gray-700 dark:text-gray-200">
                                            PNG, JPG, GIF up to 10MB
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div v-if="item.previewImage || item.image" class="text-center mt-4">
                                <img
                                    :src="item.previewImage ? item.previewImage : item.image"
                                    alt="Image Preview"
                                    class="h-32 w-auto mx-auto"
                                />
                            </div>
                        </div>
                        <div class="w-5/12 gap-4">
                            <div>
                                <label class="text-gray-700 dark:text-gray-200" htmlFor="inventory_id">Inventory</label>
                                <select
                                    class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                                    id="inventory_id"
                                    name="inventory_id"
                                    v-model="item.inventory_id"
                                    @change="handleChange"
                                >
                                    <option value="">--Select Inventory--</option>
                                        <option v-for="(inventory) in inventory" :key="inventory.id" :value="inventory.id" > 
                                            {{inventory.name}}
                                        </option>
                                </select>
                            </div>
                            <div class=''>
                                <label class="text-gray-700 dark:text-gray-200" htmlFor="quantity">Quantity</label>
                                <input id="quantity" type="number" class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" name="quantity"
                                 v-model="item.quantity" @change="handleChange" />
                            </div>
                        </div>
                    </div>
                </form>
            </section>
            
        </div>
</template>