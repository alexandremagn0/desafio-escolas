<script>
export default {
  name: 'App',
  metaInfo: {
    title: 'Sistema de Gestão Escolar',
    titleTemplate: '%s - Sistema de Gestão Escolar'
  }
}
</script>

<template>
  <router-view />
</template>

<style>
/* Estilos globais */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  line-height: 1.6;
  color: #2d3748;
}
</style>
