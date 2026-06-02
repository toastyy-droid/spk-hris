export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN_HR: "ADMIN_HR",
  MANAGER: "MANAGER",
  KARYAWAN: "KARYAWAN",
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]

export interface RouteAccess {
  path: string
  roles: Role[]
}

export const routePermissions: RouteAccess[] = [
  { path: "/", roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN_HR, ROLES.MANAGER, ROLES.KARYAWAN] },
  { path: "/suppliers", roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN_HR, ROLES.MANAGER] },
  { path: "/criteria", roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN_HR, ROLES.MANAGER, ROLES.KARYAWAN] },
  { path: "/employees", roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN_HR, ROLES.MANAGER, ROLES.KARYAWAN] },
  { path: "/attendance", roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN_HR, ROLES.MANAGER, ROLES.KARYAWAN] },
  { path: "/performance", roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN_HR, ROLES.MANAGER, ROLES.KARYAWAN] },
  { path: "/departments", roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN_HR, ROLES.MANAGER] },
  { path: "/positions", roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN_HR, ROLES.MANAGER] },
  { path: "/skills", roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN_HR, ROLES.MANAGER] },
  { path: "/spk", roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN_HR, ROLES.MANAGER] },
]

export function hasAccess(role: string | null | undefined, path: string): boolean {
  if (!role) return false
  const entry = routePermissions.find((r) => r.path === path)
  if (!entry) return true
  return entry.roles.includes(role as Role)
}

export function canAccess(role: string | null | undefined, allowedRoles: string[]): boolean {
  if (!role) return false
  return allowedRoles.includes(role)
}
