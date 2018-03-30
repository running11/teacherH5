<script>
  export default {
    components: {},
    data: () => ({
    }),
    props: {
      messages:{
        isShow: '',
        title: '',
        tips: '',
    }},
    methods: {
      cancelFollow() {
        this.messages.isShow = false
        this.$emit('ensure', true)
      }
    },
  }
</script>

<template>
  <div class="prompt-dialog" v-show="messages.isShow">
    <div class="prompt">
      <p>{{messages.title}}</p>
      <p>{{messages.tips}}</p>
      <div>
        <span @click="messages.isShow = false">取消</span>
        <span @click="cancelFollow">确定</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped="">
   @mixin area($width, $height) {
      width: $width;
     height: $height;
   }
    .prompt-dialog {
     @include area(100%, 100%);
      background-color: rgba(0,0,0,0.7);
      position: fixed;
      display: flex;
      justify-content: center;
      color: #fff;
      top: 0;
      .prompt {
        background: #2B2B2B;
        border: 2px solid #BBAB71;
        border-radius: 10px;
        font-size: 17px;
        margin-top: 40%;
        font-family: PingFangSC-Light;
        font-weight: lighter;
        @include area(90%, 23%);
        text-align: center;
        p {
          &:first-of-type {
            font-size: 20px;
            margin: 7% auto 8%;
          }
          &:last-of-type {
            margin-bottom: 7%;
          }
        }
        div {
          display: flex;
          justify-content: space-around;
          padding: 0 5%;
          span {
            color: #F8E71C;
          }
        }
      }
    }
</style>
