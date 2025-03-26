import { AdminMenuProps } from './admin_menu_props.js'

export interface AdminProps {
  readonly menuProps: AdminMenuProps[]
  readonly adminTitle: string
  readonly layout: string
  readonly logoutPath: string
}
