<template>
  <div class="flex flex-col">
    <div class="p-6">
      <div class="bg-white rounded-lg shadow-sm">
        <!-- Header with orange theme -->
        <div class="flex font-semibold text-gray-700 bg-orange-50 rounded-t-lg border border-orange-200 py-3 px-4">
          <div class="w-12 text-center">ID</div>
          <div class="w-32 text-center">Full Name</div>
          <div class="w-16 text-center">Profile</div>
          <div class="w-36 text-center">Address</div>
          <div class="w-32 text-center">Contact</div>
          <div class="w-28 text-center">Birthdate</div>
          <div class="w-28 text-center">Status</div>
          <div class="w-32 text-center">Actions</div>
        </div>

        <!-- Scrollable Content -->
        <div class="overflow-y-auto max-h-[calc(100vh-16rem)]">
          <div v-for="student in filteredStudents"
               :key="student.user_id"
               class="flex items-center border-b border-gray-100 hover:bg-orange-50 transition-colors py-2 px-4">
            <div class="w-12 text-center text-sm">{{ student.user_id }}</div>
            <div class="w-32 text-center text-sm font-medium">{{ student.first_name }} {{ student.last_name }}</div>
            <div class="w-16 text-center">
              <img :src="student.profile_image"
                   alt="Profile"
                   class="w-10 h-10 rounded-full mx-auto object-cover border-2 border-orange-200" />
            </div>
            <div class="w-36 text-center text-sm">{{ student.address }}</div>
            <div class="w-32 text-center text-sm">{{ student.contact_number }}</div>
            <div class="w-28 text-center text-sm">{{ formatDate(student.birthdate) }}</div>
            <div class="w-28 text-center">
              <span class="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-700">
                {{ student.offense_status }}
              </span>
            </div>
            <div class="w-32 text-center space-x-2">
              <button @click="deleteStudent(student.user_id)"
                      class="bg-red-500 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-red-600 transition-colors">
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
import { ref, onMounted, computed } from 'vue';
import axiosInstance from '@/axiosInstance'; // Use the axios instance

const students = ref([]);  // Initialize as an empty array
const { searchQuery } = defineProps({ searchQuery: String });
// Fetch students function that gets all student data
async function fetchStudents() {
  try {
    const response = await axiosInstance.get('/api/admin/all-students'); // Use axiosInstance for the API call
    students.value = response.data.all_students; // Set the fetched students data
  } catch (error) {
    console.error('Error fetching students:', error); // Log any errors
  }
}

// Helper function to format the birthdate
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString(); // Formats the date to a readable format
}

const filteredStudents = computed(() => {
  return students.value.filter(student => student.offense_status === 'Penalized' &&
    (student.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.contact_number.includes(searchQuery))
  );
});

async function deleteStudent(studentId) {
  try {
    await axiosInstance.delete(`/api/delete-user/${studentId}`);
    await fetchStudents();
  } catch (error) {
    console.error('Error deleting student:', error);
  }
}

// Fetch students when the component mounts
onMounted(fetchStudents);
</script>

<style scoped>
/* Add any necessary styling */
</style>
