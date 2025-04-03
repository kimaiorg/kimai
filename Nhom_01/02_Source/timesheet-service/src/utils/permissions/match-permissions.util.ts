export function matchPermissions(
  userPermissions: string[],
  requiredPermissions: string[],
): boolean {
  return requiredPermissions.every((requiredPermission) =>
    userPermissions.includes(requiredPermission),
  );
}
