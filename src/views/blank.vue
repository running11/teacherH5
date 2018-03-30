<template>
  <section class="b-main">
    <div class="blank">
      <img src="../assets/img/comingsoon.png" class="blank-img">
    </div>
  </section>
</template>

<script>
  export default {
    name: "white",
    mounted(){
      // window.addEventListener('touchstart',function(e){e.preventDefault();});
      // window.addEventListener('touchmove',function(e){e.preventDefault();});
    },
  }
</script>

<style scoped>
.b-main{
  width: 100%;
  height: 100%;
  background-color: #fff;
}
.blank{
  padding-top: 50px;
  text-align: center;
  font-family: PingFangSC-Light;
  font-size: 17px;
  color: #AAAAAA;
  line-height: 21px;
}
.blank-img{
  width: 90%;
  height: 100%;
}
</style>
