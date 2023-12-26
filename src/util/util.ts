import Vue from 'vue'
import axios from "@/api/axios";
import createLogger from "vuex/dist/logger";
export function debounce(func: () => void, delay: number, ctx: any) {
  let timeout: any
  return function() {
    clearTimeout(timeout)
    timeout = setTimeout(function() {
      func.apply(ctx)
    }, delay)
  }
}

export function countInterval(sd: any, ed: any) {
  let interval: number = (ed - sd) / 1000
  let continued = ''
  if (interval > 3600) {
    const hour = Math.floor(interval / 3600)
    continued += hour + ' hour '
    interval -= hour * 3600
  }
  if (interval > 60 && interval < 3600) {
    const min = Math.floor(interval / 60)
    continued += min + ' minute '
    interval -= min * 60
  }
  if (interval < 60 && interval > 0 ) {
    continued += Math.floor(interval) + ' second '
  }
  if (interval < 0){
    return ''
  }
  return continued
}

export function downloadFile(url: string){
  return new Promise((resolve, reject) => {
    // @ts-ignore
    axios.get(url, {responseType: 'blob'}).then(resp => {
      let headers = resp.headers
      if (headers['content-type'].indexOf('json') !== -1) {
        let fr = new window.FileReader()
        if (resp.data.error) {
          Vue.prototype.$error(resp.data.error)
        } else {
          Vue.prototype.$error('Invalid file format')
        }
        fr.onload = (event) => {
          // @ts-ignore
          let data = JSON.parse(event.target.result)
          if (data.error) {
            Vue.prototype.$error(data.data)
          } else {
            Vue.prototype.$error('Invalid file format')
          }
        }
        let b = new window.Blob([resp.data], {type: 'application/json'})
        fr.readAsText(b)
        return
      }
      let link = document.createElement('a')
      link.href = window.URL.createObjectURL(new window.Blob([resp.data], {type: headers['content-type']}))
      link.download = (headers['content-disposition'] || '').split('filename=')[1]
      document.body.appendChild(link)
      link.click()
      link.remove()
      resolve()
    }).catch((err) => {
      console.log(err)
      // @ts-ignore
      Vue.prototype.$Message.error("Cannot download")
    })
  })
}

export function breakLongWords (value: string, length = 16) {
  let re
  if (escape(value).indexOf('%u') === -1) {
    re = new RegExp('(.{' + length + '})', 'g')
  } else {
    re = new RegExp('(.{' + (length / 2 + 1) + '})', 'g')
  }
  return value.replace(re, '$1\n')
}
