<template>
  <div class="common-header">
    <span @click="back()">
          <i class="back left"></i>
    </span>
    {{title}}
  </div>
</template>

<script>
export default {
  name: 'commonHeader',
  data () {
    return {

    }
  },
  props:['title'],
  methods:{
    back(){
      this.$router.go(-1)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
 .common-header{
   width: 100%;
   height: 44px;
   background-color: #2b2b2b;
   position: relative;
   color: #fff;
   font-size: 17px;
   line-height: 44px;
   text-align: center;
 }
  .common-header .left{
    left: 15px;
    top: 50%;
    margin-top: -10px;
  }

</style>
