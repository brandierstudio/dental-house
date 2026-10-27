import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DENTAL_SERVICES,
  PATIENT_REVIEWS,
  GALLERY_ITEMS,
  CLINIC_INFO,
  filterServices,
  filterReviews,
  filterGallery,
  validatePakistaniPhone,
  validateAppointmentInput,
  createAppointmentRecord,
  getClinicOpenStatus,
} from './clinicLogic';

test('CLINIC_INFO contains exact Dental House Saddar Karachi address and phone', () => {
  assert.equal(CLINIC_INFO.name, 'Dental House');
  assert.ok(CLINIC_INFO.address.includes('Shop #19'));
  assert.ok(CLINIC_INFO.address.includes('Daud Pota Road'));
  assert.ok(CLINIC_INFO.address.includes('Bohri Bazar'));
  assert.ok(CLINIC_INFO.address.includes('Saddar, Karachi'));
  assert.equal(CLINIC_INFO.phoneRaw, '03442730018');
});

test('filterServices filters by category and search query accurately', () => {
  const all = filterServices(DENTAL_SERVICES, 'All');
  assert.equal(all.length, 6);

  const ortho = filterServices(DENTAL_SERVICES, 'Orthodontics & Braces');
  assert.equal(ortho.length, 1);
  assert.equal(ortho[0].id, 'ortho-braces');

  const queryMatch = filterServices(DENTAL_SERVICES, 'All', 'zirconia');
  assert.equal(queryMatch.length, 1);
  assert.equal(queryMatch[0].id, 'dental-implants');
});

test('filterReviews filters by topic and minimum rating', () => {
  const all = filterReviews(PATIENT_REVIEWS, 'All');
  assert.equal(all.length, 5);

  const orthoReviews = filterReviews(PATIENT_REVIEWS, 'Orthodontics & Braces');
  assert.ok(orthoReviews.length >= 2);

  const fiveStarOnly = filterReviews(PATIENT_REVIEWS, 'All', 5.0);
  assert.equal(fiveStarOnly.length, 4);
});

test('filterGallery filters clinic rooms properly', () => {
  const all = filterGallery(GALLERY_ITEMS, 'All');
  assert.equal(all.length, 6);

  const entrance = filterGallery(GALLERY_ITEMS, 'Entrance & Bohri Bazar');
  assert.equal(entrance.length, 1);
  assert.equal(entrance[0].id, 'gal-1');
});

test('validatePakistaniPhone validates local and +92 phone formats', () => {
  assert.equal(validatePakistaniPhone('03442730018'), true);
  assert.equal(validatePakistaniPhone('0344 2730018'), true);
  assert.equal(validatePakistaniPhone('+92 344 2730018'), true);
  assert.equal(validatePakistaniPhone('021-35678901'), true);
  assert.equal(validatePakistaniPhone('12345'), false);
  assert.equal(validatePakistaniPhone('invalid-phone'), false);
});

test('validateAppointmentInput rejects empty or invalid fields and accepts valid input', () => {
  const invalidResult = validateAppointmentInput({
    patientName: 'A',
    phone: '123',
    preferredDate: '',
    timeWindow: '3:00 PM – 5:00 PM',
    serviceId: '',
    contactMethod: 'Phone Call',
    notes: '',
  });
  assert.equal(invalidResult.valid, false);
  assert.ok(invalidResult.errors.patientName);
  assert.ok(invalidResult.errors.phone);
  assert.ok(invalidResult.errors.preferredDate);
  assert.ok(invalidResult.errors.serviceId);

  const validResult = validateAppointmentInput({
    patientName: 'Anas Khan',
    phone: '0344 2730018',
    preferredDate: '2026-10-29',
    timeWindow: '5:00 PM – 7:00 PM (Evening Session)',
    serviceId: 'ortho-braces',
    contactMethod: 'WhatsApp',
    notes: 'Braces consultation',
  });
  assert.equal(validResult.valid, true);
  assert.equal(Object.keys(validResult.errors).length, 0);
});

test('createAppointmentRecord builds deterministic reference code and fee', () => {
  const record = createAppointmentRecord({
    patientName: 'Anas Khan',
    phone: '03442730018',
    preferredDate: '2026-10-29',
    timeWindow: '5:00 PM – 7:00 PM',
    serviceId: 'dental-implants',
    contactMethod: 'WhatsApp',
    notes: 'Missing molar',
  });
  assert.ok(record.referenceCode.startsWith('DH-'));
  assert.equal(record.clinicPhone, '0344 2730018');
  assert.ok(record.estimatedFee.includes('PKR'));
});

test('getClinicOpenStatus computes open/closed status for PKT hours', () => {
  const openTime = new Date('2026-10-27T09:00:00Z');
  const openStatus = getClinicOpenStatus(openTime);
  assert.equal(openStatus.isOpen, true);

  const sundayTime = new Date('2026-10-25T09:00:00Z');
  const sundayStatus = getClinicOpenStatus(sundayTime);
  assert.equal(sundayStatus.isOpen, false);
});
