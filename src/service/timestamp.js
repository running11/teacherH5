export const timestampToTime = (timestamp) => {
  let date = new Date(timestamp * 1000)
  let sysDate = new Date()
  let Y = date.getFullYear
  let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)
  let D = date.getDate()
  let h = date.getHours()
  let m = date.getMinutes()
  if(Y == sysDate.getFullYear() && M == sysDate.getMonth() && D == sysDate.getDay())
  { return h +':'+ m }
  else if(Y == sysDate.getFullYear){
    return `${M}/${D}`
  } else {
    return `${Y}/${M}/${D}`
  }
}

