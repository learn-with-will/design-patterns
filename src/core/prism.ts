// Prism core + the languages the Design Patterns lessons use. `typescript` is
// the primary language for every pattern example; PrismJS builds TypeScript on
// top of JavaScript, so `prism-javascript` is imported first. `bash` covers the
// occasional shell command (project/setup), `json` covers small config snippets
// (e.g. tsconfig), and plain `text` fences (console output, UML sketches,
// directory trees) are left unhighlighted.
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/themes/prism-tomorrow.css';

export default Prism;
