"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.paystackWebhook = void 0;
const https_1 = require("firebase-functions/v2/https");
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
const crypto = __importStar(require("crypto"));
const https = __importStar(require("https"));
(0, app_1.initializeApp)();
const db = (0, firestore_1.getFirestore)();
// ─── Signature Verification ───────────────────────────────────────────────────
function verifySignature(rawBody, signature, secret) {
    const expected = crypto.createHmac('sha512', secret).update(rawBody).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}
// ─── Paystack API: verify a transaction reference ────────────────────────────
function fetchPaystack(path, secretKey) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.paystack.co',
            path,
            method: 'GET',
            headers: { Authorization: `Bearer ${secretKey}` },
        };
        https
            .get(options, (res) => {
            let body = '';
            res.on('data', (chunk) => (body += chunk));
            res.on('end', () => {
                try {
                    resolve(JSON.parse(body));
                }
                catch (_a) {
                    reject(new Error('Failed to parse Paystack API response'));
                }
            });
        })
            .on('error', reject);
    });
}
// ─── Firestore helpers ────────────────────────────────────────────────────────
async function getUidByCustomerCode(customerCode) {
    if (!customerCode)
        return null;
    const snap = await db
        .collection('users')
        .where('subscription.paystackCustomerCode', '==', customerCode)
        .limit(1)
        .get();
    if (snap.empty) {
        console.warn(`No user found for Paystack customer code: ${customerCode}`);
        return null;
    }
    return snap.docs[0].id;
}
// ─── Webhook handler ──────────────────────────────────────────────────────────
exports.paystackWebhook = (0, https_1.onRequest)({ secrets: ['PAYSTACK_SECRET_KEY'] }, async (req, res) => {
    var _a, _b, _c, _d, _e;
    if (req.method !== 'POST') {
        res.status(405).send('Method Not Allowed');
        return;
    }
    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) {
        console.error('PAYSTACK_SECRET_KEY secret is not configured');
        res.status(500).send('Server configuration error');
        return;
    }
    // Firebase Functions provides req.rawBody as a Buffer
    const rawBody = (_b = (_a = req.rawBody) === null || _a === void 0 ? void 0 : _a.toString('utf8')) !== null && _b !== void 0 ? _b : JSON.stringify(req.body);
    const signature = req.headers['x-paystack-signature'];
    if (!signature || !verifySignature(rawBody, signature, secret)) {
        console.warn('Invalid or missing Paystack webhook signature');
        res.status(401).send('Unauthorized');
        return;
    }
    const eventType = req.body.event;
    const data = req.body.data;
    const customerCode = (_c = data.customer) === null || _c === void 0 ? void 0 : _c.customer_code;
    console.log(`Paystack webhook: ${eventType}`);
    try {
        switch (eventType) {
            // ── charge.success ──────────────────────────────────────────────────
            // Fired immediately after a successful charge. We verify the transaction
            // independently before activating Pro to prevent replay attacks.
            case 'charge.success': {
                const reference = data.reference;
                const verification = await fetchPaystack(`/transaction/verify/${encodeURIComponent(reference)}`, secret);
                if (!verification.status || verification.data.status !== 'success') {
                    console.warn('Transaction verification failed:', reference);
                    break;
                }
                // uid is passed in metadata when opening checkout
                const uid = (_d = data.metadata) === null || _d === void 0 ? void 0 : _d.uid;
                if (!uid) {
                    console.warn('No uid in metadata for charge.success. Reference:', reference);
                    break;
                }
                await db.doc(`users/${uid}`).update({
                    'subscription.tier': 'pro',
                    'subscription.status': 'active',
                    'subscription.paystackCustomerCode': customerCode !== null && customerCode !== void 0 ? customerCode : null,
                    'subscription.updatedAt': firestore_1.FieldValue.serverTimestamp(),
                });
                console.log(`Pro activated for uid: ${uid}`);
                break;
            }
            // ── subscription.create ─────────────────────────────────────────────
            // Fired when Paystack creates the recurring subscription object.
            // Records the subscription code and renewal date.
            case 'subscription.create': {
                const uid = await getUidByCustomerCode(customerCode !== null && customerCode !== void 0 ? customerCode : '');
                if (!uid)
                    break;
                const nextPaymentDate = data.next_payment_date;
                await db.doc(`users/${uid}`).update(Object.assign(Object.assign({ 'subscription.tier': 'pro', 'subscription.status': 'active', 'subscription.paystackSubscriptionCode': (_e = data.subscription_code) !== null && _e !== void 0 ? _e : null, 'subscription.paystackCustomerCode': customerCode !== null && customerCode !== void 0 ? customerCode : null }, (nextPaymentDate
                    ? { 'subscription.currentPeriodEnd': new Date(nextPaymentDate).toISOString() }
                    : {})), { 'subscription.updatedAt': firestore_1.FieldValue.serverTimestamp() }));
                console.log(`Subscription created for uid: ${uid}`);
                break;
            }
            // ── subscription.disable ────────────────────────────────────────────
            // Fired when a subscription is cancelled (by user or non-payment).
            case 'subscription.disable': {
                const uid = await getUidByCustomerCode(customerCode !== null && customerCode !== void 0 ? customerCode : '');
                if (!uid)
                    break;
                await db.doc(`users/${uid}`).update({
                    'subscription.tier': 'free',
                    'subscription.status': 'cancelled',
                    'subscription.paystackSubscriptionCode': null,
                    'subscription.currentPeriodEnd': null,
                    'subscription.updatedAt': firestore_1.FieldValue.serverTimestamp(),
                });
                console.log(`Subscription cancelled for uid: ${uid}`);
                break;
            }
            // ── invoice.payment_failed ──────────────────────────────────────────
            // Fired on a failed renewal charge. Marks account as past_due.
            // The subscription stays active briefly — Paystack retries before disabling.
            case 'invoice.payment_failed': {
                const uid = await getUidByCustomerCode(customerCode !== null && customerCode !== void 0 ? customerCode : '');
                if (!uid)
                    break;
                await db.doc(`users/${uid}`).update({
                    'subscription.status': 'past_due',
                    'subscription.updatedAt': firestore_1.FieldValue.serverTimestamp(),
                });
                console.log(`Payment failed (past_due) for uid: ${uid}`);
                break;
            }
            default:
                console.log(`Unhandled Paystack event: ${eventType}`);
        }
    }
    catch (err) {
        console.error('Webhook handler error:', err);
        // Still return 200 so Paystack doesn't retry a permanent failure
        res.status(200).send('OK');
        return;
    }
    res.status(200).send('OK');
});
//# sourceMappingURL=index.js.map