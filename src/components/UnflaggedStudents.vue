<template>
  <div class="flex flex-col">
    <div class="p-6">
      <div class="bg-white rounded-lg shadow-sm">
        <!-- Header with green theme -->
        <div class="flex font-semibold text-gray-700 bg-green-50 rounded-t-lg border border-green-200 py-3 px-4">
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
               class="flex items-center border-b border-gray-100 hover:bg-green-50 transition-colors py-2 px-4">
            <div class="w-12 text-center text-sm">{{ student.user_id }}</div>
            <div class="w-32 text-center text-sm font-medium">{{ student.first_name }} {{ student.last_name }}</div>
            <div class="w-16 text-center">
              <img :src="student.profile_image"
                   alt="Profile"
                   class="w-10 h-10 rounded-full mx-auto object-cover border-2 border-green-200" />
            </div>
            <div class="w-36 text-center text-sm">{{ student.address }}</div>
            <div class="w-32 text-center text-sm">{{ student.contact_number }}</div>
            <div class="w-28 text-center text-sm">{{ formatDate(student.birthdate) }}</div>
            <div class="w-28 text-center">
              <span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                {{ student.offense_status }}
              </span>
            </div>
            <div class="w-32 text-center space-x-2">
              <button @click="editStudent(student.id)"
                      class="bg-blue-500 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-blue-600 transition-colors">
                Edit
              </button>
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

  <!-- Edit Student Modal -->
  <div v-if="isEditModalVisible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-black">Edit Student</h3>
      </div>

      <form @submit.prevent="submitEditForm" class="p-6">
        <!-- Profile Image -->
        <div class="flex items-center space-x-4 mb-6">
          <div class="relative w-20 h-20">
            <input
              type="file"
              ref="fileInput"
              @change="handleFileUpload"
              class="hidden"
              accept="image/*"
            />
            <div
              @click="openFilePicker"
              class="w-full h-full cursor-pointer relative group"
            >
              <img
                :src="currentProfileImage"
                class="w-full h-full rounded-full object-cover bg-gray-200"
                alt="Profile Image"
              />
              <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-full">
                <span class="text-white text-3xl opacity-0 group-hover:opacity-100">+</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Form Fields -->
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                v-model="editData.first_name"
                type="text"
                class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                v-model="editData.last_name"
                type="text"
                class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              v-model="editData.address"
              type="text"
              class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
            <input
              v-model="editData.contact_number"
              type="text"
              class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">School ID Number</label>
            <input
              v-model="editData.school_id_number"
              type="text"
              class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Grade Level</label>
            <select
              v-model="editData.grade_year"
              class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
            >
              <option value="">Select Grade Level</option>
              <option v-for="grade in 12" :key="grade" :value="grade">
                Grade {{ grade }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Birthdate</label>
            <input
              v-model="editData.birthdate"
              type="date"
              class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div class="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            @click="cancelEdit"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from 'vue';
import axiosInstance from '@/axiosInstance';
import defaultAvatar from '@/assets/default-avatar.svg';

const students = ref([]);
const { searchQuery } = defineProps({ searchQuery: String });

const isEditModalVisible = ref(false);
const fileInput = ref(null);
const selectedImage = ref(null);
const currentProfileImage = ref(defaultAvatar);
const editData = reactive({
  studentId: null,
  first_name: '',
  last_name: '',
  birthdate: '',
  address: '',
  contact_number: '',
  school_id_number: '',
  grade_year: ''
});

async function fetchStudents() {
  try {
    const response = await axiosInstance.get('/api/admin/all-students');
    students.value = response.data.all_students;
  } catch (error) {
    console.error('Error fetching students:', error);
  }
}

async function editStudent(studentId) {
  try {
    const student = students.value.find(s => s.id === studentId);
    if (student) {
      editData.studentId = studentId;
      Object.assign(editData, {
        first_name: student.first_name || '',
        last_name: student.last_name || '',
        birthdate: student.birthdate || '',
        address: student.address || '',
        contact_number: student.contact_number || '',
        school_id_number: student.school_id_number || '',
        grade_year: student.grade_year || ''
      });
      currentProfileImage.value = student.profile_image || defaultAvatar;
      isEditModalVisible.value = true;
    }
  } catch (error) {
    console.error('Error preparing edit form:', error);
  }
}

async function deleteStudent(studentUserId) {
  try {
    await axiosInstance.delete(`/api/delete-user/${studentUserId}`);
    await fetchStudents();
  } catch (error) {
    console.error('Error deleting student:', error);
  }
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString();
}

const filteredStudents = computed(() => {
  return students.value.filter(student =>
    student.offense_status === 'Unflagged' &&
    (student.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.contact_number.includes(searchQuery))
  );
});

const openFilePicker = () => {
  fileInput.value.click();
};

const handleFileUpload = e => {
  const file = e.target.files[0];
  if (file) {
    if (file.size > 5000000) {
      console.error('Image size should be less than 5MB');
      return;
    }
    selectedImage.value = file;
    currentProfileImage.value = URL.createObjectURL(file);
  }
};

const submitEditForm = async () => {
  const formData = new FormData();
  Object.entries(editData).forEach(([key, value]) => {
    if (value) formData.append(key, value);
  });

  if (selectedImage.value) {
    formData.append('profile_image', selectedImage.value);
  }

  try {
    const response = await axiosInstance.post(`/api/admin/edit-student-details/${editData.studentId}`, formData);
    const index = students.value.findIndex(s => s.id === editData.studentId);
    if (index !== -1) {
      students.value[index] = response.data.student;
    }
    isEditModalVisible.value = false;
  } catch (error) {
    console.error('Update failed:', error);
  }
};

const cancelEdit = () => {
  selectedImage.value = null;
  currentProfileImage.value = defaultAvatar;
  Object.assign(editData, {
    studentId: null,
    first_name: '',
    last_name: '',
    birthdate: '',
    address: '',
    contact_number: '',
    school_id_number: '',
    grade_year: ''
  });
  isEditModalVisible.value = false;
};

onMounted(fetchStudents);
</script>

<style scoped>
/* Add any necessary styling */
</style>
