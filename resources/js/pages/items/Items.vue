<script setup>
import { ref, watchEffect } from 'vue';
import ItemApi from '../../api/ItemApi';
import { Icon } from '@iconify/vue';

const items = ref([]);
const message = ref('');
const getItem = async () => {
    const res = await ItemApi.index();
    if (res.success) {
        items.value = res.data.data;     
    }
}

watchEffect(() => {
    getItem();
})

const itemDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this item?");

    if (confirmDelete) {
    const res = await ItemApi.delete(id);
        if(res.success){
            message.value = res.data.message;
            getItem();
        }
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
          <div class="max-w-7xl mx-auto mt-5">
          <div class="flex justify-between ">
                <div class="text-lg text-gray-500">
                    <h1>All Items</h1>
                </div>
                <div>
                    <RouterLink  to='/inventory' class="mr-2 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow mb-4">
                        Inventory                    
                    </RouterLink>
                    <RouterLink  to='/add-item' class="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow mb-4">
                        Add
                    </RouterLink>
                </div>
            </div>
              <div class="flex flex-col mt-2">
                  <div class="overflow-x-auto shadow-md sm:rounded-lg">
                      <div class="inline-block min-w-full align-middle">
                          <div class="overflow-hidden ">
                              <table class="min-w-full divide-y divide-gray-200 table-fixed dark:divide-gray-700">
                                  <thead class="bg-gray-100 dark:bg-gray-700">
                                      <tr>
                                          <th scope="col" class="p-4">
                                              <div class="flex items-center">
                                                  <input id="checkbox-all" type="checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                                  <label for="checkbox-all" class="sr-only">checkbox</label>
                                              </div>
                                          </th>
                                          <th scope="col" class="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400">
                                              Name
                                          </th>
                                          <th scope="col" class="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400">
                                              Inventory
                                          </th>
                                          <th scope="col" class="p-4">
                                              <span class="sr-only">Actions</span>
                                          </th>
                                      </tr>
                                  </thead>
                                  <tbody class="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                      <tr v-for="(item) in items" :key="item.id" class="hover:bg-gray-100 dark:hover:bg-gray-700">
                                          <td class="p-4 w-4">
                                              <div class="flex items-center">
                                                  <input id="checkbox-table-1" type="checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                                  <label for="checkbox-table-1" class="sr-only">checkbox</label>
                                              </div>
                                          </td>
                                          <td class="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            <div class="flex items-center">
                                                <img :src="item.image" class="h-14 w-20 object-fill rounded" />
                                                <span class='ml-2'>{{item.name}}</span>
                                            </div>
                                          </td>
                                          <td class="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white"> {{item?.inventory?.name}} </td>
                                          <td class="py-8 px-6 text-sm font-medium float-right whitespace-nowrap flex my-auto">
                                              <RouterLink :to="{ name: 'edit-item', params: { id: item.id }}" class="text-blue-600 dark:text-blue-500 hover:underline text-2xl"><Icon icon="ic:round-edit" /></RouterLink>
                                              <button @click.prevent="itemDelete(item.id)" class="ml-2 text-blue-600 dark:text-blue-500 hover:underline text-2xl"><Icon icon="ic:baseline-delete" /></button>
                                          </td>
                                      </tr>
                                  </tbody>
                              </table>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
</template>