<template>
  <div class="flex flex-col">
    <div class="p-6">
      <div class="bg-white rounded-lg shadow-sm">
        <!-- Header with yellow theme -->
        <div class="flex font-semibold text-gray-700 bg-yellow-50 rounded-t-lg border border-yellow-200 py-3 px-4">
          <div class="w-10 text-center">ID</div>
          <div class="w-28 text-center">Full Name</div>
          <div class="w-16 text-center">Profile Image</div>
          <div class="w-32 text-center">Address</div>
          <div class="w-32 text-center">Contact Number</div>
          <div class="w-28 text-center">Birthdate</div>
          <div class="w-28 text-center">Offense Status</div>
          <div class="w-20 text-center">Actions</div>
        </div>

        <!-- Scrollable Content -->
        <div class="overflow-y-auto max-h-[calc(100vh-16rem)]">
          <div v-for="student in filteredStudents"
               :key="student.user_id"
               class="flex items-center border-b border-gray-100 hover:bg-yellow-50 transition-colors py-2 px-4">
            <div class="w-10 text-center text-sm">{{ student.user_id }}</div>
            <div class="w-28 text-center text-sm font-medium">{{ student.first_name }} {{ student.last_name }}</div>
            <div class="w-16 text-center">
              <img :src="student.profile_image"
                   alt="Profile"
                   class="w-10 h-10 rounded-full mx-auto object-cover border-2 border-yellow-200" />
            </div>
            <div class="w-32 text-center text-sm">{{ student.address }}</div>
            <div class="w-32 text-center text-sm">{{ student.contact_number }}</div>
            <div class="w-28 text-center text-sm">{{ formatDate(student.birthdate) }}</div>
            <div class="w-28 text-center">
              <span class="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">
                {{ student.offense_status }}
              </span>
            </div>
            <div class="w-20 text-center space-x-2">
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
  return students.value.filter(student => student.offense_status === 'Warned' &&
    (student.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.contact_number.includes(searchQuery))
  );
});

// Delete student function
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
