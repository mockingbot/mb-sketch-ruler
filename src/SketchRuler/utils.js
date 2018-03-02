export const throttle = (fn, wait = 17) => {
  let last, timer
  return (...args) => {
    const now = +new Date()
    const next = last + wait
    if (last && (now < next)) {
      clearTimeout(timer)
      timer = setTimeout(() => {
        last = +new Date()
        fn(...args)
      }, next - now)
    } else {
      last = now
      fn(...args)
    }
  }
}

// export const dedounce = () => {}
