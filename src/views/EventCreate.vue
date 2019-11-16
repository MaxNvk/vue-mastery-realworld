<template>
  <div>
    <h1>Create an Event, {{ user.name }}</h1>
    <p>This event was created by {{ user.id }}</p>
    <p>There are {{ catLength }} categories</p>
    <p>{{ getToDoById(2) }}</p>
    <ul>
      <li v-for="(cat, id) in categories" :key="id">{{ cat }}</li>
    </ul>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters(['getToDoById', 'catLength']),
    ...mapState(['user', 'categories'])
  }
};
</script>
