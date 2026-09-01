import * as crypto from 'crypto';
import * as admin from 'firebase-admin';
import { setGlobalOptions } from 'firebase-functions/v2';
import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import Razorpay from 'razorpay';

admin.initializeApp();
setGlobalOptions({ region: 'asia-south1' });

const razorpayKeyId = defineSecret('RAZORPAY_KEY_ID');
const razorpayKeySecret = defineSecret('RAZORPAY_KEY_SECRET');

// Pro unlock is a one-time purchase: ₹299, in paise.
const PRO_UNLOCK_AMOUNT_PAISE = 29900;
const PRO_UNLOCK_CURRENCY = 'INR';

export const createRazorpayOrder = onCall(
  { secrets: [razorpayKeyId, razorpayKeySecret] },
  async (request) => {
    if (!request.auth) throw new HttpsError('unauthenticated', 'Sign in required.');

    const instance = new Razorpay({
      key_id: razorpayKeyId.value(),
      key_secret: razorpayKeySecret.value(),
    });

    const order = await instance.orders.create({
      amount: PRO_UNLOCK_AMOUNT_PAISE,
      currency: PRO_UNLOCK_CURRENCY,
      receipt: `pro_${request.auth.uid}_${Date.now()}`,
      notes: { uid: request.auth.uid, product: 'pro_unlock' },
    });

    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: razorpayKeyId.value(),
    };
  }
);

export const verifyRazorpayPayment = onCall(
  { secrets: [razorpayKeyId, razorpayKeySecret] },
  async (request) => {
    if (!request.auth) throw new HttpsError('unauthenticated', 'Sign in required.');

    const { orderId, paymentId, signature } = (request.data ?? {}) as {
      orderId?: string;
      paymentId?: string;
      signature?: string;
    };
    if (!orderId || !paymentId || !signature) {
      throw new HttpsError('invalid-argument', 'Missing payment details.');
    }

    const expectedSignature = crypto
      .createHmac('sha256', razorpayKeySecret.value())
      .update(`${orderId}|${paymentId}`)
      .digest('hex');
    if (expectedSignature !== signature) {
      throw new HttpsError('permission-denied', 'Payment signature verification failed.');
    }

    // The signature alone doesn't bind the payment to this caller — without this
    // check, someone could replay another user's genuine orderId/paymentId/signature
    // triple (e.g. observed over the network) to unlock their own account for free.
    const instance = new Razorpay({
      key_id: razorpayKeyId.value(),
      key_secret: razorpayKeySecret.value(),
    });
    const order = await instance.orders.fetch(orderId);
    if (order.notes?.uid !== request.auth.uid || order.notes?.product !== 'pro_unlock') {
      throw new HttpsError('permission-denied', 'This order does not belong to you.');
    }
    if (order.amount !== PRO_UNLOCK_AMOUNT_PAISE || order.currency !== PRO_UNLOCK_CURRENCY) {
      throw new HttpsError('failed-precondition', 'Unexpected order amount.');
    }

    const db = admin.firestore();
    const paymentRef = db.doc(`payments/${paymentId}`);

    await db.runTransaction(async (tx) => {
      const existing = await tx.get(paymentRef);
      if (existing.exists) {
        // Already processed (e.g. duplicate client retry) — nothing further to do.
        return;
      }
      tx.set(paymentRef, {
        uid: request.auth!.uid,
        orderId,
        amount: order.amount,
        currency: order.currency,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      tx.set(
        db.doc(`users/${request.auth!.uid}`),
        { proUnlocked: true, proUnlockedAt: admin.firestore.FieldValue.serverTimestamp() },
        { merge: true }
      );
    });

    return { ok: true };
  }
);
