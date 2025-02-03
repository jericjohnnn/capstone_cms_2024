<template>
  <div class="flex flex-col">
    <div class="mb-6">
      <!-- Main Table Container -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <!-- Header Row -->
        <div class="flex font-semibold text-gray-700 bg-red-50 justify-between py-3 px-4 border-b">
          <div class="w-10 text-center">ID</div>
          <div class="w-28 text-center">Name</div>
          <div class="w-16 text-center">Profile</div>
          <div class="w-32 text-center">Address</div>
          <div class="w-36 text-center">Contact</div>
          <div class="w-28 text-center">Birthdate</div>
          <div class="w-20 text-center">Gender</div>
          <div class="w-32 text-center">Course</div>
          <div class="w-28 text-center">School ID</div>
          <div class="w-20 text-center">Rate</div>
          <div class="w-28 text-center">Contact Status</div>
          <div class="w-28 text-center">Status</div>
        </div>

        <!-- Scrollable Content -->
        <div class="overflow-y-auto max-h-[calc(100vh-16rem)]">
          <div v-for="tutor in filteredTutors"
               :key="tutor.id"
               class="flex items-center text-gray-600 justify-between py-3 px-4 hover:bg-red-50/50 transition-colors border-b last:border-b-0">
            <div class="w-10 text-center font-medium text-gray-700">{{ tutor.user_id }}</div>
            <div class="w-28 text-center font-medium">{{ tutor.first_name }} {{ tutor.last_name }}</div>
            <div class="w-16 text-center">
              <img :src="tutor.profile_image || defaultAvatar"
                   :onerror="handleImageError"
                   alt="Profile"
                   class="w-8 h-8 rounded-full mx-auto object-cover border-2 border-gray-200" />
            </div>
            <div class="w-36 text-center">{{ tutor.address }}</div>
            <div class="w-32 text-center">{{ tutor.contact_number }}</div>
            <div class="w-28 text-center">{{ formatDate(tutor.birthdate) }}</div>
            <div class="w-20 text-center">{{ tutor.gender }}</div>
            <div class="w-32 text-center">{{ tutor.course }} {{ tutor.year }}</div>
            <div class="w-28 text-center">{{ tutor.school_id_number }}</div>
            <div class="w-20 text-center font-medium">₱{{ tutor.tutor_rate }}</div>
            <div class="w-28 text-center">
              <button
                @click="toggleContactedStatus(tutor)"
                :class="[
                  'transition-all duration-200 px-3 py-1 rounded-full text-sm font-medium',
                  tutor.contacted_status
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                ]"
              >
                {{ tutor.contacted_status ? 'Contacted' : 'Not Contacted' }}
              </button>
            </div>
            <div class="w-28 text-center">
              <span class="bg-red-100 text-red-700 px-2 py-1 rounded-full text-sm font-medium">
                {{ tutor.approval_status }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axiosInstance from '@/axiosInstance';
import defaultAvatar from '@/assets/default-avatar.svg'

const tutors = ref([]); // Array to hold all tutors
const { searchQuery } = defineProps({ searchQuery: String });

const filteredTutors = computed(() => {
  return tutors.value.filter(tutor =>
    tutor.approval_status === 'Rejected' &&
    (tutor.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tutor.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tutor.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tutor.contact_number.includes(searchQuery))
  );
});

// Fetch tutors function that gets all tutors and filters for rejected status
async function fetchTutors() {
  try {
    const response = await axiosInstance.get('/api/admin/all-tutors');
    tutors.value = response.data.all_tutors; // Set the fetched tutors data
  } catch (error) {
    console.error('Error fetching tutors:', error);
  }
}

// Reactivate a tutor's rejection status
async function reactivateTutor(tutorId) {
  try {
    await axiosInstance.patch(`/api/admin/approval-status/${tutorId}`, {
      approval_status: 'Pending', // Change status back to "Pending"
    });
    updateTutorStatus(tutorId, 'Pending');
  } catch (error) {
    console.error('Error reactivating tutor:', error);
  }
}

// Update tutor status locally
function updateTutorStatus(tutorId, status) {
  const tutor = tutors.value.find(t => t.id === tutorId);
  if (tutor) {
    tutor.approval_status = status;
  }
}

// Toggle contacted status
async function toggleContactedStatus(tutor) {
  try {
    const newStatus = !tutor.contacted_status;
    await axiosInstance.patch(`/api/admin/contacted-status/${tutor.id}`, {
      contacted_status: newStatus,
    });
    tutor.contacted_status = newStatus;
  } catch (error) {
    console.error('Error updating contacted status:', error);
  }
}

// Format date for display
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString();
}

// Fetch tutors when the component is mounted
onMounted(fetchTutors);
</script>
