# Commercial license model

This document defines product packaging only. It does not implement or pretend to implement payment, identity, entitlement verification or AppSumo redemption.

## Plans

### Free
- Local core tools.
- No account required when the feature can remain device-only.
- No remote entitlement check.

### Pro Yearly
- Future server-verified entitlement.
- Product-specific premium features and support policy.
- Renewal and grace-period behavior must be enforced server-side.

### Lifetime
- Perpetual access to the purchased core feature set for the commercial lifetime of that product.
- Metered third-party AI/API costs must not be represented as unlimited unless financially provisioned.
- Device/activation limits are enforced by the future License API.

### Team / Agency / White-label
- Separate commercial contracts.
- Seat/device limits, redistribution rights and branding rights must be explicit.
- Source-code rights are not implied by an end-user license.

## Future License API contract

Minimum entitlement fields:
- product_id
- license_id
- plan
- status
- customer_id
- issued_at
- expires_at nullable
- max_activations
- active_activations
- feature_flags
- marketplace_source
- external_order_reference

Secrets, signing material and payment webhooks must remain server-side.
