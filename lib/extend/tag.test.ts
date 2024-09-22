import { trimBody } from '../extend/tag';

// Prueba para la función trimBody
describe('trimBody', () => {
  // Prueba para verificar si se eliminan los saltos de línea al principio y al final
  it('should remove leading and trailing newlines', () => {
    const body = () => '\nHello World\n\n';
    const result = trimBody(body);
    expect(result).toBe('Hello World');
  });

  // Prueba para una entrada sin saltos de línea
  it('should return the same string when no newlines are present', () => {
    const body = () => 'NoNewlinesHere';
    const result = trimBody(body);
    expect(result).toBe('NoNewlinesHere');
  });

  // Prueba para verificar múltiples saltos de línea
  it('should handle multiple leading and trailing newlines', () => {
    const body = () => '\n\n\nMultiple\nNewlines\n\n\n';
    const result = trimBody(body);
    expect(result).toBe('Multiple\nNewlines');
  });

  // Prueba para una cadena vacía
  it('should return an empty string if body is empty', () => {
    const body = () => '';
    const result = trimBody(body);
    expect(result).toBe('');
  });
});
