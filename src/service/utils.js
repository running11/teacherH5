export  const changeFormat=(duration)=>{
  if(duration/60>=10){
    if(duration%60>=10){

      return parseInt(duration/60) +':'+ parseInt(duration%60)
    }else{
      return parseInt(duration/60) +':0'+ parseInt(duration%60)
    }
  }else{
    if(duration%60>=10){
      return '0'+ parseInt(duration/60) + ':' + parseInt(duration%60)
    }else{
      return '0'+ parseInt(duration/60) + ':0' + parseInt(duration%60)
    }
  }
}


