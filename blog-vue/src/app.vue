<template>
  <div id="test">
    {{ text }}
  </div>
</template>

<script>
export default {
  data () {
    return {
      text: 'success'
    }
  }
}
</script>

<style>
#test{
  color: red;
  font-size: 56px;
}
</style>
