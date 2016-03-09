import {createAction} from '/client/lib/helpers'

export const sidebarToggle = createAction('SIDEBAR_TOGGLE', () => undefined)
export const sidebarOpen = createAction('SIDEBAR_OPEN')
export const sidebarClose = createAction('SIDEBAR_CLOSE')
export const sidebarOnRequestChange = createAction('SIDEBAR_UPDATE')
export const sidebarToggleMenu = createAction('SIDEBAR_MENU_TOGGLE', () => undefined)
