<template>
  <div v-if="selectedReport" class="py-4 mx-2 bg-white shadow-md rounded-lg">
    <div class="flex flex-col sm:flex-row gap-6">
      <!-- Left section for Complainant and Offender details -->
      <div class="bg-gray-50 rounded-lg w-full sm:w-[400px] p-6 space-y-6">
        <!-- Complainant Section -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-gray-800 border-b pb-2">Complainant Details</h3>
          <div class="flex items-center space-x-4">
            <img :src="selectedReport.complainant_profile_image || defaultAvatar"
                 alt="Complainant Profile"
                 class="w-16 h-16 rounded-full object-cover border-2 border-gray-200" />
            <div class="space-y-1">
              <p class="font-medium text-gray-800">{{ selectedReport.complainant_name }}</p>
              <span :class="{
                'px-2 py-1 rounded-full text-xs font-medium': true,
                'bg-blue-100 text-blue-700': selectedReport.complainant_user_type === 'Tutor',
                'bg-green-100 text-green-700': selectedReport.complainant_user_type === 'Student'
              }">
                {{ selectedReport.complainant_user_type }}
              </span>
            </div>
          </div>
        </div>

        <!-- Offender Section -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-gray-800 border-b pb-2">Offender Details</h3>
          <div class="flex items-center space-x-4">
            <img :src="selectedReport.offender_profile_image || defaultAvatar"
                 alt="Offender Profile"
                 class="w-16 h-16 rounded-full object-cover border-2 border-gray-200" />
            <div class="space-y-1">
              <p class="font-medium text-gray-800">{{ selectedReport.offender_name }}</p>
              <span :class="{
                'px-2 py-1 rounded-full text-xs font-medium': true,
                'bg-blue-100 text-blue-700': selectedReport.offender_user_type === 'Tutor',
                'bg-green-100 text-green-700': selectedReport.offender_user_type === 'Student'
              }">
                {{ selectedReport.offender_user_type }}
              </span>
            </div>
          </div>
          <div class="space-y-2 mt-4 text-sm">
            <p class="flex items-center space-x-2">
              <span class="font-medium text-gray-700">Offense Status:</span>
              <span :class="{
                'px-2 py-1 rounded-full text-xs font-medium': true,
                'bg-green-100 text-green-700': selectedReport.offender_offense_status === 'None',
                'bg-yellow-100 text-yellow-700': selectedReport.offender_offense_status === 'Warning',
                'bg-red-100 text-red-700': selectedReport.offender_offense_status === 'Banned'
              }">
                {{ selectedReport.offender_offense_status }}
              </span>
            </p>
            <p><span class="font-medium text-gray-700">Contact:</span> {{ selectedReport.offender_contact_number }}</p>
            <p><span class="font-medium text-gray-700">Address:</span> {{ selectedReport.offender_address }}</p>
          </div>
        </div>

        <!-- Report Status and Actions -->
        <div class="space-y-4">
          <div class="flex items-center justify-between border-t pt-4">
            <span class="font-medium text-gray-700">Report Status:</span>
            <span :class="{
              'px-3 py-1 rounded-full text-sm font-medium': true,
              'bg-yellow-100 text-yellow-700': selectedReport.report_status === 'Pending',
              'bg-green-100 text-green-700': selectedReport.report_status === 'Resolved',
              'bg-red-100 text-red-700': selectedReport.report_status === 'Rejected'
            }">
              {{ selectedReport.report_status }}
            </span>
          </div>

          <div v-if="selectedReport.report_status === 'Pending'" class="grid grid-cols-3 gap-3">
            <button @click="updateReportStatus(selectedReport.report_id, 'Resolved', 'Warning')"
                    class="bg-yellow-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-yellow-600 transition-colors">
              Warn
            </button>
            <button @click="updateReportStatus(selectedReport.report_id, 'Resolved', 'Penalized')"
                    class="bg-orange-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-orange-600 transition-colors">
              Penalize
            </button>
            <button @click="updateReportStatus(selectedReport.report_id, 'Resolved', 'Banned')"
                    class="bg-red-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-600 transition-colors">
              Ban
            </button>
          </div>
        </div>
      </div>

      <!-- Right section for Report message and title -->
      <div class="flex-1 p-6 space-y-6">
        <div class="space-y-4">
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-lg font-semibold text-gray-800 mb-2">Subject</h3>
            <p class="text-gray-700">{{ selectedReport.report_title }}</p>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-lg font-semibold text-gray-800 mb-2">Message</h3>
            <p class="text-gray-700 whitespace-pre-wrap">{{ selectedReport.report_message }}</p>
          </div>
        </div>
        <div class="flex justify-end pt-4">
          <button @click="showListView"
                  class="bg-gray-500 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-gray-600 transition-colors">
            Back to List
          </button>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="flex items-center justify-center h-64">
    <div class="text-gray-600">Loading report details...</div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import defaultAvatar from '@/assets/default-avatar.svg'

const props = defineProps({
  selectedReport: {
    type: Object,
    required: true
  },
  updateReportStatus: {
    type: Function,
    required: true
  },
  showListView: {
    type: Function,
    required: true
  }
})
</script>

<style scoped>
/* Add custom styles if needed */
</style>
