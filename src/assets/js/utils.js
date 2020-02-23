// 这个文件用于存放一些自定义工具函数
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min +1) + min)
}

// 打乱数组
export function shuffle(arr) {
  let _arr = arr.slice()
  for (let i=0; i< _arr.length; i++){
    let j = getRandomInt(0, i)
    let t = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = t
  }
  return _arr
}

// 实现一个节流函数
export function debounce(func, delay) {
  let timer


  return function (...args) {
    if(timer){
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args )
    }, delay)
  }
}
