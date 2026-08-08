export const PLANS = new Set(['free','pro-yearly','lifetime','team','agency','white-label']);
export const ACTIVE_STATUSES = new Set(['active']);

export function normalizeLicenseKey(value) {
  if (typeof value !== 'string') return '';
  return value.trim().toUpperCase().replace(/\s+/g, '');
}

export function isExpired(expiresAt, now = new Date()) {
  if (!expiresAt) return false;
  const t = Date.parse(expiresAt);
  return !Number.isFinite(t) || t <= now.getTime();
}

export function entitlementState(license, now = new Date()) {
  if (!license || !PLANS.has(license.plan)) return { valid:false, status:'invalid' };
  if (!ACTIVE_STATUSES.has(license.status)) return { valid:false, status:license.status || 'invalid' };
  if (isExpired(license.expiresAt, now)) return { valid:false, status:'expired' };
  return { valid:true, status:'active' };
}

export function canActivate({ license, activeInstallations, sameInstallation = false, now = new Date() }) {
  const entitlement = entitlementState(license, now);
  if (!entitlement.valid) return { allowed:false, reason:entitlement.status };
  const limit = Number.isInteger(license.maxActivations) && license.maxActivations >= 0 ? license.maxActivations : 0;
  const active = Math.max(0, Number(activeInstallations) || 0);
  if (sameInstallation) return { allowed:true, reason:'already-active', active, limit };
  if (active >= limit) return { allowed:false, reason:'activation-limit', active, limit };
  return { allowed:true, reason:'ok', active, limit };
}

export function safeEntitlementResponse({ license, features = [], activeInstallations = 0, now = new Date() }) {
  const state = entitlementState(license, now);
  return {
    valid: state.valid,
    productId: license?.productId || '',
    status: state.status,
    plan: PLANS.has(license?.plan) ? license.plan : 'free',
    expiresAt: license?.expiresAt || null,
    features: [...new Set(features.filter(x => typeof x === 'string' && /^[a-z0-9._-]{1,80}$/i.test(x)))].sort(),
    activation: {
      active: Math.max(0, Number(activeInstallations) || 0),
      limit: Number.isInteger(license?.maxActivations) && license.maxActivations >= 0 ? license.maxActivations : 0
    }
  };
}
