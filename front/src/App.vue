<template>
  <div class="h-screen w-screen m-0 flex items-center">
    <div class="h-4/5 w-3/5">
      <table class="w-full">
        <thead class="bg-gray-300">
          <tr>
            <th>Code Insee</th>
            <th>City</th>
            <th>Population</th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="bg-white even:bg-gray-100 text-sm py-2 cursor-pointer hover:scale-105"
            v-for="(city, index) in cities"
            :key="index"
            @click="citySelectionned = city"
          >
            <td>{{ city.insee }}</td>
            <td>{{ city.name }}</td>
            <td>{{ city.population }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div
      class="h-4/5 w-2/5 flex flex-wrap justify-around items-center"
      v-if="forecastOfCitySelectionned[0].probarain !== ''"
    >
      <div
        class="w-40 h-40 bg-red100 border shadow m-2 text-sm"
        v-for="(forecast, index) in forecastOfCitySelectionned"
        :key="index"
      >
        <p>Probabilité de pluie : {{ forecast.probarain }}</p>
        <p>Min : {{ forecast.tmin }}</p>
        <p>Max : {{ forecast.tmax }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import axios from 'axios';

const cities = ref();
onMounted(async () => {
  const response = await axios.get('http://localhost:4000/cities');
  cities.value = response.data;
});

const citySelectionned = ref();
const forecastOfCitySelectionned = ref([
  {
    probarain: '',
    tmin: '',
    tmax: '',
  },
]);
watch(citySelectionned, () => {
  const { insee } = citySelectionned.value;
  axios.get(`http://localhost:4000/cities/${insee}/forecast`).then((result) => {
    forecastOfCitySelectionned.value = result.data.slice(0, 4);
  });
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
