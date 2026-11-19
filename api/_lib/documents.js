/**
 * Legal document generators (privacy policy, terms of service, cookie policy).
 *
 * Lives server-side so the paid output is never shipped to the browser before
 * payment is verified. The `_lib` folder is ignored by Vercel's function
 * router and is not served statically.
 *
 * Every user-supplied string is HTML-escaped before it is interpolated, because
 * the generated HTML is injected into the page with innerHTML.
 */

const MAX_SHORT_FIELD_LENGTH = 300;
const MAX_ADDRESS_LENGTH = 600;
const MAX_DESCRIPTION_LENGTH = 2000;
const BUSINESS_TYPES = ['service', 'ecommerce', 'saas', 'content', 'marketplace', 'other'];
const YES_NO_FIELDS = ['hasAccounts', 'hasUgc', 'sendMarketing'];
const TARGET_MINORS_VALUES = ['no', 'possible', 'yes'];
const BOOLEAN_FIELDS = [
  'dataName', 'dataEmail', 'dataPhone', 'dataAddress', 'dataPayment', 'dataAccount', 'dataUsage',
  'collectForm', 'collectCheckout', 'collectNewsletter', 'collectAccount', 'collectAuto',
  'tpAnalytics', 'tpPayment', 'tpEmail', 'tpCrm', 'tpHosting', 'tpAds', 'tpSocial', 'tpChat',
];

/**
 * Escapes a value for safe interpolation into HTML text or attribute content.
 * @param {unknown} value
 * @returns {string}
 */
function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Escapes a multi-line address and turns line breaks into <br> tags.
 * @param {unknown} address
 * @returns {string}
 */
function formatAddress(address) {
  return esc(address).replace(/\r?\n/g, '<br>');
}

function cleanString(value, maxLength) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

/**
 * Builds a trusted form-data object from untrusted request input: strings are
 * length-limited, flags are strict booleans, enums are whitelisted, and the
 * date is generated here rather than accepted from the client.
 * @param {unknown} raw
 * @returns {object}
 */
function sanitizeFormData(raw) {
  const input = raw && typeof raw === 'object' ? raw : {};
  const clean = {
    businessName: cleanString(input.businessName, MAX_SHORT_FIELD_LENGTH),
    websiteUrl: cleanString(input.websiteUrl, MAX_SHORT_FIELD_LENGTH),
    businessEmail: cleanString(input.businessEmail, MAX_SHORT_FIELD_LENGTH),
    businessAddress: cleanString(input.businessAddress, MAX_ADDRESS_LENGTH),
    businessType: BUSINESS_TYPES.includes(input.businessType) ? input.businessType : '',
    businessDescription: cleanString(input.businessDescription, MAX_DESCRIPTION_LENGTH),
    customerType: ['b2b', 'both'].includes(input.customerType) ? input.customerType : 'b2c',
    date: new Date().toLocaleDateString('en-GB', {
      day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/London',
    }),
  };
  for (const field of BOOLEAN_FIELDS) {
    clean[field] = input[field] === true;
  }
  for (const field of YES_NO_FIELDS) {
    clean[field] = input[field] === 'yes' ? 'yes' : 'no';
  }
  clean.targetMinors = TARGET_MINORS_VALUES.includes(input.targetMinors) ? input.targetMinors : 'no';
  return clean;
}

function generatePrivacyPolicy(formData) {
  let dataTypes = [];
  if (formData.dataName) dataTypes.push('name');
  if (formData.dataEmail) dataTypes.push('email address');
  if (formData.dataPhone) dataTypes.push('telephone number');
  if (formData.dataAddress) dataTypes.push('postal address');
  if (formData.dataPayment) dataTypes.push('payment and billing information');
  if (formData.dataAccount) dataTypes.push('account login credentials');
  if (formData.dataUsage) dataTypes.push('website usage data and browsing behaviour');

  let collectionMethods = [];
  if (formData.collectForm) collectionMethods.push('contact and enquiry forms');
  if (formData.collectCheckout) collectionMethods.push('checkout or booking processes');
  if (formData.collectNewsletter) collectionMethods.push('newsletter signup forms');
  if (formData.collectAccount) collectionMethods.push('account registration');
  if (formData.collectAuto) collectionMethods.push('automated technologies such as cookies and analytics');

  let thirdParties = [];
  if (formData.tpAnalytics) thirdParties.push('Analytics providers (such as Google Analytics) to help us understand how our website is used');
  if (formData.tpPayment) thirdParties.push('Payment processors (such as Stripe or PayPal) to securely handle transactions');
  if (formData.tpEmail) thirdParties.push('Email marketing platforms to send you communications you have opted into');
  if (formData.tpCrm) thirdParties.push('Customer relationship management systems to manage our customer communications');
  if (formData.tpHosting) thirdParties.push('Cloud hosting providers who store our website and data securely');
  if (formData.tpAds) thirdParties.push('Advertising networks to deliver relevant advertisements');
  if (formData.tpSocial) thirdParties.push('Social media platforms when you interact with social features on our site');
  if (formData.tpChat) thirdParties.push('Live chat providers to offer customer support');

  return `
    <h1>Privacy Policy</h1>
    <p class="last-updated">Last updated: ${esc(formData.date)}</p>
    
    <h2>1. Introduction</h2>
    <p>${esc(formData.businessName)} ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, and protect your personal data when you visit our website at ${esc(formData.websiteUrl)} or use our services.</p>
    <p>We are the data controller responsible for your personal data. If you have any questions about this policy or our data practices, please contact us at ${esc(formData.businessEmail)}.</p>
    <p>This policy complies with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.</p>
    
    <h2>2. Information We Collect</h2>
    <p>We may collect and process the following types of personal data:</p>
    <ul>
      ${dataTypes.map(d => `<li>${d.charAt(0).toUpperCase() + d.slice(1)}</li>`).join('')}
    </ul>
    
    <h2>3. How We Collect Your Data</h2>
    <p>We collect personal data through the following methods:</p>
    <ul>
      ${collectionMethods.map(m => `<li>${m.charAt(0).toUpperCase() + m.slice(1)}</li>`).join('')}
    </ul>
    
    <h2>4. How We Use Your Data</h2>
    <p>We use your personal data for the following purposes:</p>
    <ul>
      <li>To provide and improve our products and services</li>
      <li>To respond to your enquiries and provide customer support</li>
      <li>To process transactions and send related information</li>
      ${formData.sendMarketing === 'yes' ? '<li>To send marketing communications where you have consented</li>' : ''}
      <li>To comply with legal obligations</li>
      <li>To protect our legitimate business interests</li>
    </ul>
    
    <h2>5. Legal Basis for Processing</h2>
    <p>Under UK GDPR, we must have a lawful basis for processing your personal data. We rely on the following:</p>
    <ul>
      <li><strong>Consent:</strong> Where you have given clear consent for us to process your data for a specific purpose</li>
      <li><strong>Contract:</strong> Where processing is necessary to perform a contract with you or take steps before entering a contract</li>
      <li><strong>Legal obligation:</strong> Where we must process data to comply with the law</li>
      <li><strong>Legitimate interests:</strong> Where processing is necessary for our legitimate business interests, provided these do not override your rights</li>
    </ul>
    
    <h2>6. Data Sharing</h2>
    <p>We may share your personal data with trusted third parties who assist us in operating our business:</p>
    <ul>
      ${thirdParties.map(tp => `<li>${tp}</li>`).join('')}
    </ul>
    <p>We require all third parties to respect the security of your personal data and treat it in accordance with the law. We do not sell your personal data to any third parties.</p>
    
    <h2>7. International Transfers</h2>
    <p>Some of our third-party service providers may be located outside the UK. Where we transfer your data internationally, we ensure appropriate safeguards are in place, such as Standard Contractual Clauses approved by the ICO, to protect your data.</p>
    
    <h2>8. Data Security</h2>
    <p>We have implemented appropriate technical and organisational measures to protect your personal data against unauthorised access, alteration, disclosure, or destruction. These measures include encryption, secure servers, and access controls.</p>
    
    <h2>9. Data Retention</h2>
    <p>We will only retain your personal data for as long as necessary to fulfil the purposes for which it was collected, including to satisfy legal, accounting, or reporting requirements. When your data is no longer needed, we will securely delete or anonymise it.</p>
    
    <h2>10. Your Rights</h2>
    <p>Under UK GDPR, you have the following rights:</p>
    <ul>
      <li><strong>Right of access:</strong> Request a copy of the personal data we hold about you</li>
      <li><strong>Right to rectification:</strong> Request correction of inaccurate or incomplete data</li>
      <li><strong>Right to erasure:</strong> Request deletion of your personal data in certain circumstances</li>
      <li><strong>Right to restrict processing:</strong> Request that we limit how we use your data</li>
      <li><strong>Right to data portability:</strong> Request transfer of your data to another service provider</li>
      <li><strong>Right to object:</strong> Object to processing based on legitimate interests or for direct marketing</li>
      <li><strong>Right to withdraw consent:</strong> Withdraw consent at any time where we rely on consent to process your data</li>
    </ul>
    <p>To exercise any of these rights, please contact us at ${esc(formData.businessEmail)}. We will respond to your request within one month.</p>
    
    <h2>11. Cookies</h2>
    <p>Our website uses cookies to improve your experience. For detailed information about the cookies we use, please see our Cookie Policy.</p>
    
    ${formData.targetMinors !== 'no' ? `
    <h2>12. Children's Privacy</h2>
    <p>We take the privacy of children seriously. If you are under 13 years old, please ask your parent or guardian before providing any personal data. If we become aware that we have collected personal data from a child without appropriate consent, we will take steps to delete that information.</p>
    ` : ''}
    
    <h2>${formData.targetMinors !== 'no' ? '13' : '12'}. Changes to This Policy</h2>
    <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically.</p>
    
    <h2>${formData.targetMinors !== 'no' ? '14' : '13'}. Complaints</h2>
    <p>If you have concerns about how we handle your personal data, please contact us first at ${esc(formData.businessEmail)}. You also have the right to lodge a complaint with the Information Commissioner's Office (ICO) at <a href="https://ico.org.uk/make-a-complaint/">ico.org.uk/make-a-complaint</a> or by calling 0303 123 1113.</p>
    
    <h2>${formData.targetMinors !== 'no' ? '15' : '14'}. Contact Us</h2>
    <p>For any questions about this Privacy Policy or our data practices, please contact:</p>
    <p>
      ${esc(formData.businessName)}<br>
      ${formatAddress(formData.businessAddress)}<br>
      Email: ${esc(formData.businessEmail)}
    </p>
  `;
}

function generateTermsOfService(formData) {
  const isEcommerce = formData.businessType === 'ecommerce';
  const isSaas = formData.businessType === 'saas';

  return `
    <h1>Terms of Service</h1>
    <p class="last-updated">Last updated: ${esc(formData.date)}</p>
    
    <h2>1. Introduction</h2>
    <p>These Terms of Service ("Terms") govern your use of the website ${esc(formData.websiteUrl)} and any services provided by ${esc(formData.businessName)} ("we", "us", or "our").</p>
    <p>By accessing our website or using our services, you agree to be bound by these Terms. If you do not agree with any part of these Terms, you must not use our website or services.</p>
    
    <h2>2. About Us</h2>
    <p>${esc(formData.businessName)}<br>
    ${formatAddress(formData.businessAddress)}<br>
    Contact: ${esc(formData.businessEmail)}</p>
    
    <h2>3. Use of Our Website</h2>
    <p>You may use our website for lawful purposes only. You must not:</p>
    <ul>
      <li>Use our website in any way that breaches applicable laws or regulations</li>
      <li>Use our website in any way that is fraudulent or harmful</li>
      <li>Attempt to gain unauthorised access to our systems or networks</li>
      <li>Transmit any harmful code, viruses, or malicious software</li>
      <li>Collect or harvest any information from our website without permission</li>
      <li>Interfere with the proper functioning of our website</li>
    </ul>
    
    ${formData.hasAccounts === 'yes' ? `
    <h2>4. User Accounts</h2>
    <p>If you create an account on our website, you are responsible for:</p>
    <ul>
      <li>Maintaining the confidentiality of your account credentials</li>
      <li>All activities that occur under your account</li>
      <li>Notifying us immediately of any unauthorised use of your account</li>
    </ul>
    <p>We reserve the right to suspend or terminate accounts that violate these Terms or for any other reason at our discretion.</p>
    ` : ''}
    
    ${formData.hasUgc === 'yes' ? `
    <h2>${formData.hasAccounts === 'yes' ? '5' : '4'}. User Content</h2>
    <p>If you submit content to our website (including comments, reviews, or uploads), you:</p>
    <ul>
      <li>Retain ownership of your content but grant us a licence to use, display, and distribute it</li>
      <li>Confirm that your content does not infringe any third party's rights</li>
      <li>Accept that we may remove content that violates these Terms or for any other reason</li>
    </ul>
    <p>You must not submit content that is unlawful, defamatory, threatening, abusive, obscene, or otherwise objectionable.</p>
    ` : ''}
    
    <h2>${formData.hasAccounts === 'yes' && formData.hasUgc === 'yes' ? '6' : formData.hasAccounts === 'yes' || formData.hasUgc === 'yes' ? '5' : '4'}. Intellectual Property</h2>
    <p>All content on our website, including text, images, logos, and software, is the property of ${esc(formData.businessName)} or our licensors and is protected by copyright, trademark, and other intellectual property laws.</p>
    <p>You may not reproduce, distribute, or create derivative works from our content without our express written permission.</p>
    
    ${isEcommerce ? `
    <h2>Orders and Payments</h2>
    <p>All orders placed through our website are subject to acceptance. We reserve the right to refuse or cancel orders at our discretion.</p>
    <p>Prices are displayed in GBP and include VAT where applicable. We reserve the right to change prices at any time without notice.</p>
    <p>Payment must be made at the time of order using the payment methods available on our website.</p>
    
    <h2>Delivery</h2>
    <p>We will deliver products to the address you provide. Delivery times are estimates only and we are not liable for delays beyond our control.</p>
    <p>Risk of loss or damage passes to you upon delivery.</p>
    
    <h2>Returns and Refunds</h2>
    <p>Under the Consumer Contracts Regulations 2013, you have 14 days from delivery to cancel your order for a full refund, except for certain items excluded by law.</p>
    <p>To cancel, please contact us at ${esc(formData.businessEmail)}. You must return the goods in their original condition at your own cost.</p>
    <p>We will process refunds within 14 days of receiving the returned goods.</p>
    ` : ''}
    
    ${isSaas ? `
    <h2>Subscription Services</h2>
    <p>Access to our software or services may require a paid subscription. By subscribing, you agree to pay the applicable fees and authorise us to charge your payment method on a recurring basis.</p>
    <p>You may cancel your subscription at any time. Cancellation will take effect at the end of your current billing period.</p>
    <p>We reserve the right to modify pricing with reasonable notice. Continued use after price changes constitutes acceptance of the new pricing.</p>
    ` : ''}
    
    <h2>Limitation of Liability</h2>
    <p>To the fullest extent permitted by law:</p>
    <ul>
      <li>We provide our website and services "as is" without warranties of any kind</li>
      <li>We are not liable for any indirect, consequential, or incidental damages arising from your use of our website or services</li>
      <li>Our total liability to you shall not exceed the amount you paid to us in the 12 months preceding the claim</li>
    </ul>
    <p>Nothing in these Terms excludes or limits our liability for death or personal injury caused by our negligence, fraud, or any liability that cannot be excluded by law.</p>
    
    <h2>Indemnification</h2>
    <p>You agree to indemnify and hold harmless ${esc(formData.businessName)} and our officers, directors, employees, and agents from any claims, damages, or expenses arising from your breach of these Terms or your use of our website or services.</p>
    
    <h2>Governing Law</h2>
    <p>These Terms are governed by the laws of England and Wales. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts of England and Wales.</p>
  `;
}

function generateCookiePolicy(formData) {
  return `
    <h1>Cookie Policy</h1>
    <p class="last-updated">Last updated: ${esc(formData.date)}</p>
    
    <h2>1. What Are Cookies?</h2>
    <p>Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and to provide information to the owners of the site.</p>
    
    <h2>2. How We Use Cookies</h2>
    <p>We use cookies for the following purposes:</p>
    <ul>
      <li><strong>Essential Cookies:</strong> These are necessary for the website to function properly (e.g., shopping cart, secure login).</li>
      <li><strong>Performance/Analytics Cookies:</strong> These allow us to recognise and count the number of visitors and see how visitors move around our website. This helps us improve the way our website works.</li>
      <li><strong>Functionality Cookies:</strong> These help us recognise you when you return to our website so we can verify your preferences (e.g., language or region).</li>
      ${formData.tpAds ? '<li><strong>Targeting/Advertising Cookies:</strong> These record your visit to our website, the pages you have visited, and the links you have followed. We may use this information to make our website and the advertising displayed on it more relevant to your interests.</li>' : ''}
    </ul>
    
    <h2>3. Third-Party Cookies</h2>
    <p>In addition to our own cookies, we may also use various third-parties cookies to report usage statistics of the Service, deliver advertisements on and through the Service, and so on.</p>
    
    <h2>4. Managing Cookies</h2>
    <p>Most web browsers allow some control of most cookies through the browser settings. To find out more about cookies, including how to see what cookies have been set and how to manage and delete them, visit <a href="https://www.allaboutcookies.org">www.allaboutcookies.org</a>.</p>
    <p>Please note that if you disable cookies, some features of our website may not function properly.</p>
    
    <h2>5. Contact Us</h2>
    <p>If you have any questions about our use of cookies, please contact us at ${esc(formData.businessEmail)}.</p>
  `;
}

/**
 * Generates all three documents from untrusted form data.
 * @param {unknown} rawFormData
 * @returns {{privacy: string, terms: string, cookies: string}}
 */
function generateDocuments(rawFormData) {
  const formData = sanitizeFormData(rawFormData);
  return {
    privacy: generatePrivacyPolicy(formData),
    terms: generateTermsOfService(formData),
    cookies: generateCookiePolicy(formData),
  };
}

module.exports = { generateDocuments, sanitizeFormData, esc };
