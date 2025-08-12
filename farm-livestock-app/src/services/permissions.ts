import type { UserProfile } from "../types";

export function canCreateOrUpdate(profile?: UserProfile | null) {
  if (!profile) return false;
  return profile.role === "manager" || profile.role === "worker";
}

export function canDelete(profile?: UserProfile | null) {
  if (!profile) return false;
  return profile.role === "manager";
}

export function isReadOnly(profile?: UserProfile | null) {
  if (!profile) return true;
  return profile.role === "viewer";
}