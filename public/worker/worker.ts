//importScripts("../../static/libs/threejs/three.js")

self.addEventListener(
  'message',
  function (event) {
    if (event.data.cmd == 'loadData') {
      loadData(event.data.url, event.data.responseType)
    }
  },
  false,
)

const loadData = (url, responseType) => {
  const xhr = new XMLHttpRequest()
  xhr.open('GET', url)
  xhr.responseType = responseType
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
      if (xhr.status == 200 && xhr.response) {
        onLoad(xhr.response)
      } else {
        onError(xhr.response)
      }
    }
  }
  xhr.send()
}

const onLoad = (response) => {
  self.postMessage({
    msg: 'success',
    data: response,
  })
}

const onError = (response) => {
  self.postMessage({
    msg: 'error',
    data: response,
  })
}
