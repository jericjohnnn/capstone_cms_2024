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
          <span
            :class="[
              'ml-2 px-2 py-0.5 rounded-full text-xs',
              currentTab === tab.value ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
            ]"
          >
            {{ tab.count || 0 }}
          </span>
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
import AllStudents from '@/components/AllStudents.vue'
import UnflaggedStudents from '@/components/UnflaggedStudents.vue'
import WarnedStudents from '@/components/WarnedStudents.vue'
import PenalizedStudents from '@/components/PenalizedStudents.vue'
import BannedStudents from '@/components/BannedStudents.vue'
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
      return UnflaggedStudents
    case 'Warned':
      return WarnedStudents
    case 'Penalized':
      return PenalizedStudents
    case 'Banned':
      return BannedStudents
    default:
      return AllStudents
  }
})
</script>
