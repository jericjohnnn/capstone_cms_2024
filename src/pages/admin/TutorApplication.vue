<template>
  <div class="flex flex-row min-h-screen bg-gray-50">
    <SideBar />

    <div class="flex flex-col flex-grow">
      <Header @update:search="updateSearchQuery" />

      <div class="px-6 py-4 border-b bg-white">
        <div class="flex space-x-6 text-lg">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            @click="currentTab = tab.value"
            :class="[
              'px-4 py-2 transition-all duration-200',
              currentTab === tab.value
                ? 'text-indigo-700 border-b-2 border-indigo-700 font-medium'
                : 'text-gray-600 hover:text-indigo-600'
            ]"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <div class="p-6">
        <component
          :is="currentComponent"
          :current-tab="currentTab"
          :search-query="searchQuery"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

import AllApplicants from '@/components/AllApplicants.vue';
import SideBar from '@/components/SideBar.vue';
import PendingTutors from '@/components/PendingTutors.vue';
import AcceptedTutors from '@/components/AcceptedTutors.vue';
import RejectedTutors from '@/components/RejectedTutors.vue';
import Header from '@/components/Header.vue';

const currentTab = ref('all');
const searchQuery = ref('');

const tabs = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Accepted', value: 'Accepted' },
  { label: 'Rejected', value: 'Rejected' },
];

// Update search query
const updateSearchQuery = (newQuery) => {
  searchQuery.value = newQuery;
}

// Dynamically set the component to load based on the selected tab
const currentComponent = computed(() => {
  switch (currentTab.value) {
    case 'Pending':
      return PendingTutors;
    case 'Accepted':
      return AcceptedTutors;
    case 'Rejected':
      return RejectedTutors;
    default:
      return AllApplicants;
  }
});
</script>
