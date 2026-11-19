const assert = require('node:assert/strict');
const Module = require('node:module');
const { test, beforeEach } = require('node:test');

const PRICE_ID = 'price_test_bundle';
const PAID_ID = 'cs_test_a1B2c3D4e5F6g7H8i9J0';
const UNPAID_ID = 'cs_test_unpaidUnpaidUnpaid01';
const OTHER_PRODUCT_ID = 'cs_test_otherProductOther01';
const MISSING_ID = 'cs_test_missingMissingMiss01';

const sessions = {
  [PAID_ID]: { mode: 'payment', payment_status: 'paid', line_items: { data: [{ price: { id: PRICE_ID } }] } },
  [UNPAID_ID]: { mode: 'payment', payment_status: 'unpaid', line_items: { data: [{ price: { id: PRICE_ID } }] } },
  [OTHER_PRODUCT_ID]: { mode: 'payment', payment_status: 'paid', line_items: { data: [{ price: { id: 'price_other' } }] } },
};

let retrieveCalls;
const stripeMock = {
  checkout: {
    sessions: {
      retrieve: async (id) => {
        retrieveCalls.push(id);
        if (id === 'cs_test_stripeOutageStripe01') {
          throw new Error('network down');
        }
        const session = sessions[id];
        if (!session) {
          const error = new Error('No such checkout.session');
          error.code = 'resource_missing';
          throw error;
        }
        return session;
      },
    },
  },
};

const originalLoad = Module._load;
Module._load = function (request, ...args) {
  return request === 'stripe' ? () => stripeMock : originalLoad.call(this, request, ...args);
};
process.env.STRIPE_PRICE_ID = PRICE_ID;

const verifySession = require('../api/verify-session');
const generateDocument = require('../api/generate-document');

function createResponse() {
  return {
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; },
  };
}

async function call(handler, body, method = 'POST') {
  const res = createResponse();
  await handler({ method, body }, res);
  return res;
}

const formData = {
  businessName: 'Acme & Sons <script>alert(1)</script>',
  websiteUrl: 'https://acme.example',
  businessEmail: 'hello@acme.example',
  businessAddress: '1 High Street\nLondon',
  businessType: 'ecommerce',
  dataEmail: true,
  collectForm: true,
  tpAnalytics: true,
};

beforeEach(() => { retrieveCalls = []; });

test('verify-session reports paid only for a paid session of this product', async () => {
  assert.deepEqual((await call(verifySession, { session_id: PAID_ID })).body, { paid: true });
  assert.deepEqual((await call(verifySession, { session_id: UNPAID_ID })).body, { paid: false });
  assert.deepEqual((await call(verifySession, { session_id: OTHER_PRODUCT_ID })).body, { paid: false });
  assert.deepEqual((await call(verifySession, { session_id: MISSING_ID })).body, { paid: false });
});

test('verify-session rejects missing or malformed ids without calling Stripe', async () => {
  for (const body of [{}, { session_id: 'not-a-session' }, { session_id: 'pi_123456789012345' }, { session_id: 42 }]) {
    const res = await call(verifySession, body);
    assert.equal(res.statusCode, 400);
  }
  assert.equal((await call(verifySession, {}, 'GET')).statusCode, 405);
  assert.deepEqual(retrieveCalls, []);
});

test('verify-session returns a generic error when Stripe fails', async () => {
  const res = await call(verifySession, { session_id: 'cs_test_stripeOutageStripe01' });
  assert.equal(res.statusCode, 500);
  assert.deepEqual(res.body, { error: 'Unable to verify payment' });
});

test('generate-document returns no document without a session id', async () => {
  const res = await call(generateDocument, { formData });
  assert.equal(res.statusCode, 400);
  assert.equal(res.body.documents, undefined);
});

test('generate-document returns no document for an unpaid, wrong-product or unknown session', async () => {
  for (const id of [UNPAID_ID, OTHER_PRODUCT_ID, MISSING_ID]) {
    const res = await call(generateDocument, { session_id: id, formData });
    assert.equal(res.statusCode, 402);
    assert.equal(res.body.documents, undefined);
  }
});

test('generate-document accepts a JSON string body', async () => {
  const res = await call(generateDocument, JSON.stringify({ session_id: PAID_ID, formData }));
  assert.equal(res.statusCode, 200);
});

test('generate-document returns escaped documents for a paid session', async () => {
  const res = await call(generateDocument, { session_id: PAID_ID, formData });
  assert.equal(res.statusCode, 200);
  const { privacy, terms, cookies } = res.body.documents;
  assert.match(privacy, /<h1>Privacy Policy<\/h1>/);
  assert.match(terms, /<h1>Terms of Service<\/h1>/);
  assert.match(cookies, /<h1>Cookie Policy<\/h1>/);
  assert.match(privacy, /Acme &amp; Sons &lt;script&gt;alert\(1\)&lt;\/script&gt;/);
  assert.match(privacy, /1 High Street<br>London/);
  for (const html of [privacy, terms, cookies]) {
    assert.doesNotMatch(html, /<script/i);
  }
});
