<template>
  <div class="p-4">
    <!-- Improved Navigation Tabs -->
    <div class="flex space-x-4 mb-6 border-b border-gray-200">
      <button
        @click="showListView"
        :class="[
          'px-4 py-2 text-sm font-medium transition-colors relative',
          currentView === 'list'
            ? 'text-blue-600 border-b-2 border-blue-600'
            : 'text-gray-500 hover:text-gray-700'
        ]"
      >
        Resolved Reports
      </button>
      <button
        v-if="currentView === 'details'"
        :class="[
          'px-4 py-2 text-sm font-medium transition-colors relative',
          currentView === 'details'
            ? 'text-blue-600 border-b-2 border-blue-600'
            : 'text-gray-500 hover:text-gray-700'
        ]"
      >
        Report Details
      </button>
    </div>

    <!-- Content Views -->
    <div v-if="currentView === 'list'">
      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center h-64">
        <div class="text-gray-600">Loading reports...</div>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredReports.length === 0" class="flex items-center justify-center h-64">
        <div class="text-gray-600">No resolved reports available.</div>
      </div>

      <!-- Reports List -->
      <div v-else class="space-y-4 mx-2 h-[calc(100vh-12rem)] overflow-y-auto pr-2">
        <div v-for="report in filteredReports"
             :key="report.id"
             class="bg-white p-4 rounded-lg shadow-sm border border-green-200 hover:shadow-md transition-shadow">
          <div class="flex items-center gap-x-4">
            <!-- Profile Section -->
            <div class="flex-shrink-0">
              <img :src="report.complainant_profile_image"
                   alt="Profile"
                   class="w-12 h-12 rounded-full object-cover border-2 border-gray-200" />
            </div>

            <!-- Content Section -->
            <div class="flex-grow">
              <span :class="{
                'px-2 py-1 rounded-full text-xs font-medium': true,
                'bg-blue-100 text-blue-700': report.complainant_user_type === 'Tutor',
                'bg-green-100 text-green-700': report.complainant_user_type === 'Student'
              }">
                {{ report.complainant_user_type }}
              </span>
              <h3 class="font-medium text-gray-900 mt-1">
                {{ report.complainant_name }}
                <span class="text-gray-600 font-normal">has filed a complaint</span>
              </h3>
            </div>

            <!-- Actions Section -->
            <div class="flex items-center gap-x-4">
              <span class="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                Resolved
              </span>
              <button
                @click="goToReportDetails(report)"
                class="bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-600 transition-colors"
              >
                View Report
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Refresh Button -->
      <div class="mt-6 flex justify-center">
        <button
          @click="fetchReports"
          class="bg-blue-500 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-blue-600 transition-colors flex items-center gap-x-2"
        >
          <span>Refresh Reports</span>
        </button>
      </div>
    </div>

    <!-- Report Details View -->
    <ReportDetails
      v-if="currentView === 'details'"
      :selectedReport="selectedReport"
      :updateReportStatus="updateReportStatus"
      :showListView="showListView"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axiosInstance from '@/axiosInstance'
import ReportDetails from './ReportDetails.vue'

const reports = ref([])
const loading = ref(true)
const currentView = ref('list')
const selectedReport = ref(null)

const props = defineProps({
  searchQuery: {
    type: String,
    default: ''
  }
})

const fetchReports = async () => {
  loading.value = true
  try {
    const response = await axiosInstance.get('/api/admin/all-reports')  // This should return all reports
    reports.value = response.data.complainant_report  // No need for pagination anymore
  } catch (error) {
    console.error('Error fetching reports:', error)
  } finally {
    loading.value = false
  }
}

const goToReportDetails = async (report) => {
  loading.value = true
  try {
    const response = await axiosInstance.get(`/api/admin/${report.id}`)
    selectedReport.value = response.data.report_data
    currentView.value = 'details'
  } catch (error) {
    console.error('Error fetching report details:', error)
  } finally {
    loading.value = false
  }
}

const updateReportStatus = async (reportId, reportStatus, offenseStatus) => {
  try {
    await axiosInstance.patch(`/api/admin/report-status/${reportId}`, {
      status: reportStatus,
      offense_status: offenseStatus
    })
    const report = reports.value.find(r => r.id === reportId)
    if (report) {
      report.report_status = reportStatus
      report.offender_offense_status = offenseStatus
    }

    if (selectedReport.value && selectedReport.value.report_id === reportId) {
      selectedReport.value.report_status = reportStatus
      selectedReport.value.offender_offense_status = offenseStatus
    }
  } catch (error) {
    console.error('Error updating report status:', error)
  }
}

const showListView = () => {
  currentView.value = 'list'
}

const filteredReports = computed(() => {
  // Only return reports with a "Pending" status
  return reports.value.filter(report => report.report_status === 'Resolved' &&
    (props.searchQuery === '' || report.complainant_name.toLowerCase().includes(props.searchQuery.toLowerCase()))
  )
})

onMounted(fetchReports)
</script>
