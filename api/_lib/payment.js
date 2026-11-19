/**
 * Server-side Stripe payment verification shared by the API endpoints.
 */

const SESSION_ID_PATTERN = /^cs_(test|live)_[A-Za-z0-9]{10,200}$/;

/**
 * @param {unknown} sessionId
 * @returns {boolean} true when the value has the shape of a Checkout Session id.
 */
function isValidSessionId(sessionId) {
  return typeof sessionId === 'string' && SESSION_ID_PATTERN.test(sessionId);
}

/**
 * Returns true only when the Checkout Session exists, is a one-off payment,
 * has been paid, and was for this product's price.
 *
 * Network or Stripe outages throw, so callers can tell "not paid" apart from
 * "could not check".
 *
 * @param {import('stripe').Stripe} stripe
 * @param {string} sessionId A value that already passed isValidSessionId().
 * @returns {Promise<boolean>}
 */
async function isSessionPaid(stripe, sessionId) {
  const expectedPriceId = process.env.STRIPE_PRICE_ID;
  if (!expectedPriceId) {
    // Fail closed: without a configured price we cannot tell products apart.
    throw new Error('STRIPE_PRICE_ID is not configured');
  }

  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ['line_items'] });
  } catch (error) {
    if (error && error.code === 'resource_missing') {
      return false;
    }
    throw error;
  }

  if (!session || session.mode !== 'payment' || session.payment_status !== 'paid') {
    return false;
  }

  const lineItems = (session.line_items && session.line_items.data) || [];
  return lineItems.some((item) => item.price && item.price.id === expectedPriceId);
}

/**
 * Reads a JSON request body whether the platform pre-parsed it or not.
 * @param {{body?: unknown}} req
 * @returns {object}
 */
function readJsonBody(req) {
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }
  if (typeof req.body === 'string') {
    try {
      const parsed = JSON.parse(req.body);
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
      return {};
    }
  }
  return {};
}

module.exports = { isValidSessionId, isSessionPaid, readJsonBody };
