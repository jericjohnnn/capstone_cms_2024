<template>
  <div class="flex flex-row">
    <SideBar />
    <div class="flex flex-col flex-grow">
      <Header @update:search="updateSearchQuery"/>
      <!-- Improved Tab Navigation -->
      <div class="flex items-center space-x-1 mb-6 ml-6 border-b border-gray-200">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          @click="currentTab = tab.value"
          :class="[
            'px-4 py-2 text-sm font-medium rounded-t-lg transition-colors',
            currentTab === tab.value
              ? 'bg-white text-blue-600 border-t border-l border-r border-gray-200'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          ]"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Conditional Rendering of Tab Components -->
      <div class="px-6">
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
import { ref, computed } from 'vue'
import SideBar from '@/components/SideBar.vue'
import AllTutors from '@/components/AllTutors.vue'
import UnflaggedTutors from '@/components/UnflaggedTutors.vue'
import WarnedTutors from '@/components/WarnedTutors.vue'
import PenalizedTutors from '@/components/PenalizedTutors.vue'
import BannedTutors from '@/components/BannedTutors.vue'
import Header from '@/components/Header.vue'

const currentTab = ref('all')
const searchQuery = ref('')

// Tab configuration
const tabs = [
  { label: 'All', value: 'all' },
  { label: 'Unflagged', value: 'Unflagged' },
  { label: 'Warned', value: 'Warned' },
  { label: 'Penalized', value: 'Penalized' },
  { label: 'Banned', value: 'Banned' }
]

// Update search query
const updateSearchQuery = (newQuery) => {
  searchQuery.value = newQuery
}

// Dynamically set the component based on selected tab
const currentComponent = computed(() => {
  switch (currentTab.value) {
    case 'Unflagged':
      return UnflaggedTutors
    case 'Warned':
      return WarnedTutors
    case 'Penalized':
      return PenalizedTutors
    case 'Banned':
      return BannedTutors
    default:
      return AllTutors
  }
})
</script>
