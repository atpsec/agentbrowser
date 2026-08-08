import assert from 'node:assert/strict';
import { normalizeLicenseKey, entitlementState, canActivate, safeEntitlementResponse } from './entitlement-rules.mjs';

assert.equal(normalizeLicenseKey(' aip-abc 123 '),'AIP-ABC123');
const active={productId:'pdf-toolbox',plan:'lifetime',status:'active',maxActivations:2,expiresAt:null};
assert.deepEqual(entitlementState(active),{valid:true,status:'active'});
assert.equal(entitlementState({...active,status:'revoked'}).valid,false);
assert.equal(entitlementState({...active,expiresAt:'2020-01-01T00:00:00Z'}).status,'expired');
assert.equal(canActivate({license:active,activeInstallations:0}).allowed,true);
assert.equal(canActivate({license:active,activeInstallations:2}).reason,'activation-limit');
assert.equal(canActivate({license:active,activeInstallations:2,sameInstallation:true}).allowed,true);
const response=safeEntitlementResponse({license:active,features:['merge','split','merge','bad feature!'],activeInstallations:1});
assert.equal(response.valid,true);
assert.deepEqual(response.features,['merge','split']);
assert.deepEqual(response.activation,{active:1,limit:2});
console.log('License entitlement rules passed');
