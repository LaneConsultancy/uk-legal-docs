const assert = require('node:assert/strict');
const Module = require('node:module');
const { test } = require('node:test');

test('checkout return URLs ignore request headers', async (t) => {
  let checkoutOptions;
  const stripe = {
    checkout: {
      sessions: {
        create: async (options) => {
          checkoutOptions = options;
          return { url: 'https://checkout.stripe.test/session' };
        },
      },
    },
  };
  const originalLoad = Module._load;
  t.mock.method(Module, '_load', function (request, ...args) {
    return request === 'stripe'
      ? () => stripe
      : originalLoad.call(this, request, ...args);
  });

  const handler = require('../api/create-checkout-session');
  const response = {
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
    },
  };

  await handler({
    method: 'POST',
    headers: {
      origin: 'https://evil.example',
      referer: 'https://also-evil.example/phishing/',
      host: 'attacker.example',
    },
  }, response);

  assert.equal(response.statusCode, 200);
  assert.equal(
    checkoutOptions.success_url,
    'https://getlegaldocs.co.uk/?payment=success&session_id={CHECKOUT_SESSION_ID}',
  );
  assert.equal(
    checkoutOptions.cancel_url,
    'https://getlegaldocs.co.uk/?payment=cancelled',
  );
});

test('checkout errors do not leak Stripe error details', async (t) => {
  const stripe = {
    checkout: {
      sessions: {
        create: async () => { throw new Error('No such price: price_secret_internal'); },
      },
    },
  };
  const originalLoad = Module._load;
  t.mock.method(Module, '_load', function (request, ...args) {
    return request === 'stripe' ? () => stripe : originalLoad.call(this, request, ...args);
  });
  t.mock.method(console, 'error', () => {});

  delete require.cache[require.resolve('../api/create-checkout-session')];
  const handler = require('../api/create-checkout-session');
  const response = {
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; },
  };
  await handler({ method: 'POST', headers: {} }, response);

  assert.equal(response.statusCode, 500);
  assert.deepEqual(response.body, { error: 'Unable to start checkout' });
});
