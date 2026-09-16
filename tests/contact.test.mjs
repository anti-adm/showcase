import test from 'node:test';
import assert from 'node:assert/strict';
import {validateContact, CONTACT_LIMITS} from '../src/lib/contact-validation.ts';
import {createContactLimiter} from '../src/lib/contact-rate-limit.ts';
import {readFileSync} from 'node:fs';

const valid = {name: 'Анна', email: 'anna@example.org', message: 'Здравствуйте! Хочу узнать о продукции.'};
test('Contact validation handles untrusted JSON without throwing', () => {
  for (const input of [null, false, 1, [], 'test', {}, {...valid, name: 23}, {...valid, email: {}}, {...valid, message: []}]) assert.equal(validateContact(input).ok, false);
});
test('Contact validation normalizes text and preserves Unicode and line breaks', () => {
  const result = validateContact({...valid, name: ' Анна ', message: ' Первая строка\nIkkinchi qator '});
  assert.equal(result.ok, true); assert.equal(result.data.name, 'Анна'); assert.equal(result.data.message, 'Первая строка\nIkkinchi qator');
});
test('Contact validation rejects empty, oversized and injected fields', () => {
  for (const input of [{...valid, name: ' '}, {...valid, email: 'invalid'}, {...valid, email: 'a@b.com\r\nBcc: x@y.com'}, {...valid, name: 'name\r\nsubject'}, {...valid, name: 'a'.repeat(CONTACT_LIMITS.name + 1)}, {...valid, message: 'a'.repeat(CONTACT_LIMITS.message + 1)}]) assert.equal(validateContact(input).ok, false);
});
test('Rate limit isolates clients, expires and bounds memory', () => {
  const consume = createContactLimiter(2, 10000, 2);
  assert.equal(consume('a', 0), 0); assert.equal(consume('a', 1), 0); assert.equal(consume('a', 1000), 9);
  assert.equal(consume('b', 1000), 0); assert.equal(consume('c', 1000), 60);
  assert.equal(consume('a', 10000), 0); assert.equal(consume('c', 11000), 0);
});
function keys(value, prefix = '') {return Object.entries(value).flatMap(([key, item]) => typeof item === 'object' ? keys(item, `${prefix}${key}.`) : `${prefix}${key}`).sort();}
test('Every locale has the same translation keys and no blank translations', () => {
  const messages = ['uz', 'ru', 'en'].map(locale => JSON.parse(readFileSync(new URL(`../messages/${locale}.json`, import.meta.url))));
  for (const message of messages) {assert.deepEqual(keys(message), keys(messages[0])); assert.ok(!JSON.stringify(message).includes(':""'));}
});
