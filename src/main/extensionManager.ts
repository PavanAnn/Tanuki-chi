import path from 'path';

type ExtensionModule = {
  search: (...args: any[]) => Promise<any>;
};

export function getExtension(extensionId: string): ExtensionModule {
  const extPath = path.resolve(__dirname, '../extensions', extensionId);
  const mod = require(extPath);
  return {
    search: mod.search,
  };
}
