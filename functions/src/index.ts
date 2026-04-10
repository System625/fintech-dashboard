import { onRequest } from 'firebase-functions/v2/https';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import * as crypto from 'crypto';
import * as https from 'https';

initializeApp();
const db = getFirestore();

// ─── Signature Verification ───────────────────────────────────────────────────

function verifySignature(rawBody: string, signature: string, secret: string): boolean {
  const expected = crypto.createHmac('sha512', secret).update(rawBody).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

// ─── Paystack API: verify a transaction reference ────────────────────────────

function fetchPaystack(path: string, secretKey: string): Promise<PaystackApiResponse> {
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
        res.on('data', (chunk: string) => (body += chunk));
        res.on('end', () => {
          try {
            resolve(JSON.parse(body) as PaystackApiResponse);
          } catch {
            reject(new Error('Failed to parse Paystack API response'));
          }
        });
      })
      .on('error', reject);
  });
}

interface PaystackApiResponse {
  status: boolean;
  data: Record<string, unknown>;
}

// ─── Firestore helpers ────────────────────────────────────────────────────────

async function getUidByCustomerCode(customerCode: string): Promise<string | null> {
  if (!customerCode) return null;
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

export const paystackWebhook = onRequest(
  { secrets: ['PAYSTACK_SECRET_KEY'] },
  async (req, res) => {
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
    const rawBody = (req as unknown as { rawBody: Buffer }).rawBody?.toString('utf8')
      ?? JSON.stringify(req.body);

    const signature = req.headers['x-paystack-signature'] as string | undefined;
    if (!signature || !verifySignature(rawBody, signature, secret)) {
      console.warn('Invalid or missing Paystack webhook signature');
      res.status(401).send('Unauthorized');
      return;
    }

    const eventType: string = req.body.event;
    const data: Record<string, unknown> = req.body.data;
    const customerCode = (data.customer as Record<string, string> | undefined)?.customer_code;

    console.log(`Paystack webhook: ${eventType}`);

    try {
      switch (eventType) {
        // ── charge.success ──────────────────────────────────────────────────
        // Fired immediately after a successful charge. We verify the transaction
        // independently before activating Pro to prevent replay attacks.
        case 'charge.success': {
          const reference = data.reference as string;
          const verification = await fetchPaystack(
            `/transaction/verify/${encodeURIComponent(reference)}`,
            secret
          );

          if (!verification.status || (verification.data as { status: string }).status !== 'success') {
            console.warn('Transaction verification failed:', reference);
            break;
          }

          // uid is passed in metadata when opening checkout
          const uid = (data.metadata as { uid?: string } | undefined)?.uid;
          if (!uid) {
            console.warn('No uid in metadata for charge.success. Reference:', reference);
            break;
          }

          await db.doc(`users/${uid}`).update({
            'subscription.tier': 'pro',
            'subscription.status': 'active',
            'subscription.paystackCustomerCode': customerCode ?? null,
            'subscription.updatedAt': FieldValue.serverTimestamp(),
          });

          console.log(`Pro activated for uid: ${uid}`);
          break;
        }

        // ── subscription.create ─────────────────────────────────────────────
        // Fired when Paystack creates the recurring subscription object.
        // Records the subscription code and renewal date.
        case 'subscription.create': {
          const uid = await getUidByCustomerCode(customerCode ?? '');
          if (!uid) break;

          const nextPaymentDate = data.next_payment_date as string | undefined;

          await db.doc(`users/${uid}`).update({
            'subscription.tier': 'pro',
            'subscription.status': 'active',
            'subscription.paystackSubscriptionCode': data.subscription_code ?? null,
            'subscription.paystackCustomerCode': customerCode ?? null,
            ...(nextPaymentDate
              ? { 'subscription.currentPeriodEnd': new Date(nextPaymentDate).toISOString() }
              : {}),
            'subscription.updatedAt': FieldValue.serverTimestamp(),
          });

          console.log(`Subscription created for uid: ${uid}`);
          break;
        }

        // ── subscription.disable ────────────────────────────────────────────
        // Fired when a subscription is cancelled (by user or non-payment).
        case 'subscription.disable': {
          const uid = await getUidByCustomerCode(customerCode ?? '');
          if (!uid) break;

          await db.doc(`users/${uid}`).update({
            'subscription.tier': 'free',
            'subscription.status': 'cancelled',
            'subscription.paystackSubscriptionCode': null,
            'subscription.currentPeriodEnd': null,
            'subscription.updatedAt': FieldValue.serverTimestamp(),
          });

          console.log(`Subscription cancelled for uid: ${uid}`);
          break;
        }

        // ── invoice.payment_failed ──────────────────────────────────────────
        // Fired on a failed renewal charge. Marks account as past_due.
        // The subscription stays active briefly — Paystack retries before disabling.
        case 'invoice.payment_failed': {
          const uid = await getUidByCustomerCode(customerCode ?? '');
          if (!uid) break;

          await db.doc(`users/${uid}`).update({
            'subscription.status': 'past_due',
            'subscription.updatedAt': FieldValue.serverTimestamp(),
          });

          console.log(`Payment failed (past_due) for uid: ${uid}`);
          break;
        }

        default:
          console.log(`Unhandled Paystack event: ${eventType}`);
      }
    } catch (err) {
      console.error('Webhook handler error:', err);
      // Still return 200 so Paystack doesn't retry a permanent failure
      res.status(200).send('OK');
      return;
    }

    res.status(200).send('OK');
  }
);
