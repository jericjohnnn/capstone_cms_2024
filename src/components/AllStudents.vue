<template>
  <div class="flex flex-col">
    <div class="mb-6">
      <!-- Main Table Container -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <!-- Header Row -->
        <div class="flex font-semibold text-gray-700 bg-gray-50 justify-between py-3 px-4 border-b">
          <div class="w-10 text-center">ID</div>
          <div class="w-28 text-center">Name</div>
          <div class="w-16 text-center">Profile</div>
          <div class="w-32 text-center">Address</div>
          <div class="w-36 text-center">Contact</div>
          <div class="w-28 text-center">Birthdate</div>
          <div class="w-28 text-center">Offense Status</div>
          <div class="w-24 text-center">Actions</div>
        </div>

        <!-- Scrollable Content -->
        <div class="overflow-y-auto max-h-[calc(100vh-16rem)]">
          <div v-for="student in filteredStudents"
               :key="student.user_id"
               class="flex items-center text-gray-600 justify-between py-3 px-4 hover:bg-gray-50 transition-colors border-b last:border-b-0">
            <div class="w-10 text-center font-medium text-gray-700">{{ student.user_id }}</div>
            <div class="w-28 text-center font-medium">{{ student.first_name }} {{ student.last_name }}</div>
            <div class="w-16 text-center">
              <img :src="student.profile_image || defaultAvatar"
                   alt="Profile"
                   class="w-8 h-8 rounded-full mx-auto object-cover border-2 border-gray-200" />
            </div>
            <div class="w-32 text-center">{{ student.address }}</div>
            <div class="w-36 text-center">{{ student.contact_number }}</div>
            <div class="w-28 text-center">{{ formatDate(student.birthdate) }}</div>
            <div class="w-28 text-center">
              <span :class="{
                'px-2 py-1 rounded-full text-sm font-medium': true,
                'bg-green-100 text-green-700': student.offense_status === 'None',
                'bg-yellow-100 text-yellow-700': student.offense_status === 'Warning',
                'bg-red-100 text-red-700': student.offense_status === 'Banned'
              }">
                {{ student.offense_status }}
              </span>
            </div>
            <div class="w-24 text-center">
              <div class="space-y-1">
                <button @click="editStudent(student.id)"
                        class="w-full bg-blue-500 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-blue-600 transition-colors">
                  Edit
                </button>
                <button @click="deleteStudent(student.id)"
                        class="w-full bg-red-500 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-red-600 transition-colors">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axiosInstance from '@/axiosInstance';
import defaultAvatar from '@/assets/default-avatar.svg'

const students = ref([]);

const { searchQuery } = defineProps({ searchQuery: String });

// Fetch students function that gets all student data
async function fetchStudents() {
  try {
    const response = await axiosInstance.get('/api/admin/all-students');
    students.value = response.data.all_students;
  } catch (error) {
    console.error('Error fetching students:', error);
  }
}

// Edit student function
async function editStudent(studentId) {
  // Implement edit functionality
  console.log('Edit student:', studentId);
}

// Delete student function
async function deleteStudent(studentId) {
  try {
    await axiosInstance.delete(`/api/admin/delete-student/${studentId}`);
    students.value = students.value.filter(s => s.id !== studentId);
  } catch (error) {
    console.error('Error deleting student:', error);
  }
}

// Helper function to format the birthdate
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString();
}

// Computed property to get the filtered students based on search query
const filteredStudents = computed(() => {
  return students.value.filter(student =>
    student.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.contact_number.includes(searchQuery)
  );
});

// Fetch students when the component mounts
onMounted(fetchStudents);
</script>

<style scoped>
/* Add any necessary styling */
</style>
