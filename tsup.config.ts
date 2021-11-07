import fg from 'fast-glob';
import type { Options } from 'tsup';

export const tsup: Options = {
  splitting: false,
  sourcemap: false,
  clean: true,
  entryPoints: [
    'src/index.ts',
    ...fg.sync(['src/mpl/**.ts']),
  ],
}
