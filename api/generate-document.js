const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { isValidSessionId, isSessionPaid, readJsonBody } = require('./_lib/payment');
const { generateDocuments } = require('./_lib/documents');

/**
 * POST { session_id, formData } -> { documents: { privacy, terms, cookies } }
 * Only generates documents after Stripe confirms the session was paid.
 */
module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { session_id: sessionId, formData } = readJsonBody(req);
  if (!isValidSessionId(sessionId)) {
    return res.status(400).json({ error: 'Invalid request' });
  }

  try {
    const paid = await isSessionPaid(stripe, sessionId);
    if (!paid) {
      return res.status(402).json({ error: 'Payment required' });
    }
    return res.status(200).json({ documents: generateDocuments(formData) });
  } catch (error) {
    console.error('Document generation failed:', error);
    return res.status(500).json({ error: 'Unable to generate documents' });
  }
};
