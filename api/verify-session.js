const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { isValidSessionId, isSessionPaid, readJsonBody } = require('./_lib/payment');

/**
 * POST { session_id } -> { paid: boolean }
 * Confirms with Stripe that a Checkout Session was paid for this product.
 */
module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { session_id: sessionId } = readJsonBody(req);
  if (!isValidSessionId(sessionId)) {
    return res.status(400).json({ error: 'Invalid request' });
  }

  try {
    const paid = await isSessionPaid(stripe, sessionId);
    return res.status(200).json({ paid });
  } catch (error) {
    console.error('Payment verification failed:', error);
    return res.status(500).json({ error: 'Unable to verify payment' });
  }
};
