<template>
  <section>
    <router-view/>
  </section>
</template>

<script>
  export default {
    name: "home"
  }
</script>

<style scoped>

  .nav{
    height: 44px;
    width: 100%;
    background-color: rgba(43,43,43,0.90);
    line-height: 44px;
    position: relative;
  }
  .nav li{
    font-size: 17px;
    color: #fff;
    letter-spacing: -0.41px;
    float: left;
  }
  .nav li a{
    color: #fff;
    display: inline-block;
    height: 39px;
  }
  .left{
    text-align: right;
    width: 49%;
    margin-right: 1%;
  }
  .right{
    width: 47%;
    margin-left: 3%;
  }
  .router-link-active{
    border-bottom: 2px #f8e71c solid;
  }
</style>
