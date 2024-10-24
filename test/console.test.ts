import { expect } from 'chai';
import Console from '../lib/extend/console';

describe('Console', () => {
  let consoleInstance: Console;

  beforeEach(() => {
    consoleInstance = new Console();
  });

  it('debería registrar y obtener un plugin correctamente', () => {
    const mockFn = () => {};
    const pluginName = 'testPlugin';

    consoleInstance.register(pluginName, mockFn);
    const retrievedPlugin = consoleInstance.get(pluginName);

    expect(retrievedPlugin).to.equal(mockFn);
  });

  it('debería devolver undefined para un plugin no registrado', () => {
    const pluginName = 'nonExistentPlugin';

    const retrievedPlugin = consoleInstance.get(pluginName);

    expect(retrievedPlugin).to.be.undefined;
  });
});
