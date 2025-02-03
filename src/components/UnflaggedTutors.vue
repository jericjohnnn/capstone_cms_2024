<template>
  <div class="flex flex-col">
    <div class="p-6">
      <div class="bg-white rounded-lg shadow-sm">
        <!-- Header Row -->
        <div class="flex font-semibold text-gray-700 bg-green-50 rounded-t-lg border border-green-200 py-3 px-4">
          <div class="w-12 text-center">ID</div>
          <div class="w-32 text-center">Full Name</div>
          <div class="w-16 text-center">Profile</div>
          <div class="w-36 text-center">Address</div>
          <div class="w-32 text-center">Contact</div>
          <div class="w-28 text-center">Birthdate</div>
          <div class="w-20 text-center">Gender</div>
          <div class="w-32 text-center">Course/Year</div>
          <div class="w-28 text-center">School ID</div>
          <div class="w-24 text-center">Rate</div>
          <div class="w-28 text-center">Status</div>
          <div class="w-32 text-center">Actions</div>
        </div>

        <!-- Scrollable Content -->
        <div class="overflow-y-auto max-h-[calc(100vh-16rem)]">
          <div v-for="tutor in filteredTutors"
               :key="tutor.id"
               class="flex items-center border-b border-gray-100 hover:bg-green-50 transition-colors py-2 px-4">
            <div class="w-12 text-center text-sm">{{ tutor.user_id }}</div>
            <div class="w-32 text-center text-sm font-medium">{{ tutor.first_name }} {{ tutor.last_name }}</div>
            <div class="w-16 text-center">
              <img :src="tutor.profile_image"
                   alt="Profile"
                   class="w-10 h-10 rounded-full mx-auto object-cover border-2 border-green-200" />
            </div>
            <div class="w-36 text-center text-sm">{{ tutor.address }}</div>
            <div class="w-32 text-center text-sm">{{ tutor.contact_number }}</div>
            <div class="w-28 text-center text-sm">{{ formatDate(tutor.birthdate) }}</div>
            <div class="w-20 text-center text-sm">{{ tutor.gender }}</div>
            <div class="w-32 text-center text-sm">{{ tutor.course }} {{ tutor.year }}</div>
            <div class="w-28 text-center text-sm">{{ tutor.school_id_number }}</div>
            <div class="w-24 text-center text-sm">₱{{ tutor.tutor_rate }}</div>
            <div class="w-28 text-center">
              <span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                {{ tutor.offense_status }}
              </span>
            </div>
            <div class="w-32 text-center space-x-2">
              <button class="bg-blue-500 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-blue-600 transition-colors">
                Edit
              </button>
              <button class="bg-red-500 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-red-600 transition-colors">
                Delete
              </button>
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

const tutors = ref([]); // Array to hold all tutors

const { searchQuery } = defineProps({ searchQuery: String });

const filteredTutors = computed(() => {
  return tutors.value.filter(tutor =>
    tutor.offense_status === 'Unflagged' &&
    (tutor.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tutor.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tutor.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tutor.contact_number.includes(searchQuery))
  );
});
// Fetch tutors function that gets all tutors and filters for accepted status
async function fetchTutors() {
  try {
    const response = await axiosInstance.get('/api/admin/all-tutors');
    tutors.value = response.data.all_tutors; // Set the fetched tutors data
  } catch (error) {
    console.error('Error fetching tutors:', error);
  }
}


// Update tutor status locally
function updateTutorStatus(tutorId, status) {
  const tutor = tutors.value.find(t => t.id === tutorId);
  if (tutor) {
    tutor.offense_status_status = status;
  }
}




// Format date for display
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString();
}

// Fetch tutors when the component is mounted
onMounted(fetchTutors);
</script>
