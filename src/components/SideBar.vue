<template>
  <div class="w-52 h-screen border-r-2 bg-white shadow-sm">
    <div class="flex justify-center py-6 border-b">
      <h1 class="text-4xl font-bold font-serif text-indigo-700">Tudlo</h1>
    </div>
    <div class="flex flex-col items-center py-6">
      <ul class="w-full space-y-2 px-3">
        <li v-for="(link, index) in navLinks" :key="index">
          <router-link
            :to="link.path"
            class="block px-4 py-3 rounded-lg transition-all duration-200 text-gray-600 hover:bg-indigo-50 hover:text-indigo-700"
            active-class="bg-indigo-100 text-indigo-700 font-medium shadow-sm"
          >
            {{ link.name }}
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
const navLinks = [
  { path: '/admin/tutorApplication', name: 'Tutor Application' },
  { path: '/admin/activeTutors', name: 'Active Tutors' },
  { path: '/admin/activeStudents', name: 'Active Students' },
  { path: '/admin/reports', name: 'User Reports' },
];
</script>

<style scoped>
/* Optional: Add a min-width for extra stability */
.w-52 {
  min-width: 13rem;
}
</style>
