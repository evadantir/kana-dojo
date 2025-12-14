import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { Language, getOppositeLanguage } from '../types';

// Arbitrary for Language type
const languageArb = fc.constantFrom<Language>('en', 'ja');

describe('Translator Property Tests', () => {
  /**
   * **Feature: japanese-translator, Property 2: Language auto-swap**
   * For any source language selection, the target language should automatically
   * be set to the opposite language (en → ja, ja → en).
   * **Validates: Requirements 2.2**
   */
  describe('Property 2: Language auto-swap', () => {
    it('getOppositeLanguage always returns the opposite language', () => {
      fc.assert(
        fc.property(languageArb, (sourceLang: Language) => {
          const targetLang = getOppositeLanguage(sourceLang);

          // Target should be different from source
          expect(targetLang).not.toBe(sourceLang);

          // en -> ja, ja -> en
          if (sourceLang === 'en') {
            expect(targetLang).toBe('ja');
          } else {
            expect(targetLang).toBe('en');
          }
        }),
        { numRuns: 100 }
      );
    });

    it('getOppositeLanguage is an involution (applying twice returns original)', () => {
      fc.assert(
        fc.property(languageArb, (lang: Language) => {
          const opposite = getOppositeLanguage(lang);
          const backToOriginal = getOppositeLanguage(opposite);
          expect(backToOriginal).toBe(lang);
        }),
        { numRuns: 100 }
      );
    });

    it('getOppositeLanguage always returns a valid Language type', () => {
      fc.assert(
        fc.property(languageArb, (lang: Language) => {
          const result = getOppositeLanguage(lang);
          expect(['en', 'ja']).toContain(result);
        }),
        { numRuns: 100 }
      );
    });
  });
});
