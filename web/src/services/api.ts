import axios from 'axios'

export const backendUrl =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3333'
    : 'https://gsb2-agenda.herokuapp.com'

export const backendAuthUrl = (function () {
  const backendUrlObject = new URL(backendUrl)
  const siteUrlObject = new URL(
    window.location.protocol + '//' +
    window.location.host
  )

  siteUrlObject.pathname = '/logInRedirect'

  backendUrlObject.pathname = '/authUrl'
  backendUrlObject.searchParams.set('redirect', siteUrlObject.href)

  return backendUrlObject.href
}())

const api = axios.create({
  baseURL: backendUrl
})

export default api
