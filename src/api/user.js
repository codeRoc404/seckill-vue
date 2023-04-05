import request from '@/utils/request'
import md5 from 'js-md5'
const salt = '1a2b3c4d'

export function login(info) {
  const phone = info.username
  let password = info.password
  if (password !== '') {
    password = md5('' + salt.charAt(0) + salt.charAt(2) + password + salt.charAt(5) + salt.charAt(4))
  }
  return request({
    url: '/user/login',
    method: 'post',
    data: {
      phone: phone,
      password: password
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
