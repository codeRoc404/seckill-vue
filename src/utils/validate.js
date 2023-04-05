/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {Number} phone
 * @returns {Boolean}
 */
export function validUsername(phone) {
  if ((/^1[3456789]\d{9}$/.test(phone))) {
    return true
  }
}
