/**
 * Source of grammar files.
 */

import type { GrammarSource } from './types'

/**
 * All language grammar sources on github.com.
 *
 * To add one:
 * - Search `<lang> textmate` on GitHub
 * - Search `<lang>` on VS Code Marketplace
 * - Pick the most recently updated fork that contains the grammar
 * - Insert `[name, url]` to the list sorted by `name`
 *   - `name` should be the `name` key in the raw json/yaml/plist file
 *     - When the grammar provides an undesirable name (or no `name` key), for example `x86 and x86_64 Assembly` at
 *       https://github.com/13xforever/x86_64-assembly-vscode/blob/face834a56e416230c2d20939f9fa77c25344865/syntaxes/language-x86_64-assembly.tmLanguage#L13-L14
 *       specify the desired name, for example `asm`
 *   - `url` should be the github URL. Supported suffixes: ['json', 'yml', 'yaml', 'plist', 'cson']
 * - Run `pnpm update:grammars`, examine the changes
 */
export const sourcesVSCode: GrammarSource[] = [
  {
    name: 'bat',
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/bat/syntaxes/batchfile.tmLanguage.json',
    alias: ['batch'],
  },
  {
    name: 'clojure',
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/clojure/syntaxes/clojure.tmLanguage.json',
    alias: ['clj'],
  },
  {
    name: 'coffee',
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/coffeescript/syntaxes/coffeescript.tmLanguage.json',
    alias: ['coffeescript'],
  },
  {
    name: 'c',
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/cpp/syntaxes/c.tmLanguage.json',
  },
  {
    name: 'cpp-macro',
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/cpp/syntaxes/cpp.embedded.macro.tmLanguage.json',
  },
  {
    name: 'cpp',
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/cpp/syntaxes/cpp.tmLanguage.json',
    alias: ['c++'],
  },
  {
    name: 'csharp',
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/csharp/syntaxes/csharp.tmLanguage.json',
    alias: ['c#', 'cs'],
  },
  {
    name: 'css',
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/css/syntaxes/css.tmLanguage.json',
  },
  {
    name: 'dart',
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/dart/syntaxes/dart.tmLanguage.json',
  },
  {
    name: 'diff',
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/diff/syntaxes/diff.tmLanguage.json',
  },
  {
    name: 'docker',
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/docker/syntaxes/docker.tmLanguage.json',
    alias: ['dockerfile'],
  },
  {
    name: 'fsharp',
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/fsharp/syntaxes/fsharp.tmLanguage.json',
    alias: ['f#', 'fs'],
  },
  {
    name: 'git-commit',
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/git-base/syntaxes/git-commit.tmLanguage.json',
  },
  {
    name: 'git-rebase',
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/git-base/syntaxes/git-rebase.tmLanguage.json',
  },
  {
    name: 'go',
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/go/syntaxes/go.tmLanguage.json',
  },
  {
    name: 'groovy',
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/groovy/syntaxes/groovy.tmLanguage.json',
  },
  {
    name: 'handlebars',
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/handlebars/syntaxes/Handlebars.tmLanguage.json',
    alias: ['hbs'],
  },
  {
    name: 'hlsl',
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/hlsl/syntaxes/hlsl.tmLanguage.json',
  },
  {
    name: 'html',
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/html/syntaxes/html.tmLanguage.json',
  },
  {
    name: 'ini',
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/ini/syntaxes/ini.tmLanguage.json',
    alias: ['properties'],
    displayName: 'INI',
  },
  {
    name: 'java',
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/java/syntaxes/java.tmLanguage.json',
  },
  {
    name: 'javascript',
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/javascript/syntaxes/JavaScript.tmLanguage.json',
    alias: ['js'],
  },
  {
    name: 'jsx',
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/javascript/syntaxes/JavaScriptReact.tmLanguage.json',
    displayName: 'JSX',
  },
  {
    name: 'json',
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/json/syntaxes/JSON.tmLanguage.json',
  },
  {
    name: 'jsonc',
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/json/syntaxes/JSONC.tmLanguage.json',
  },
  {
    name: 'jsonl',
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/json/syntaxes/JSONL.tmLanguage.json',
  },
  {
    name: 'julia',
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/julia/syntaxes/julia.tmLanguage.json',
  },
  {
    name: 'bibtex',
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/latex/syntaxes/Bibtex.tmLanguage.json',
  },
  {
    name: 'latex',
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/latex/syntaxes/LaTeX.tmLanguage.json',
  },
  {
    name: 'tex',
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/latex/syntaxes/TeX.tmLanguage.json',
  },
  {
    name: 'less',
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/less/syntaxes/less.tmLanguage.json',
  },
  {
    name: 'lua',
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/lua/syntaxes/lua.tmLanguage.json',
  },
  {
    name: 'make',
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/make/syntaxes/make.tmLanguage.json',
    alias: ['makefile'],
  },
  {
    name: 'markdown',
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/markdown-basics/syntaxes/markdown.tmLanguage.json',
    alias: ['md'],
  },
  {
    name: 'objective-cpp',
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/objective-c/syntaxes/objective-c++.tmLanguage.json',
  },
  {
    name: 'objective-c',
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/objective-c/syntaxes/objective-c.tmLanguage.json',
    alias: ['objc'],
  },
  {
    name: 'perl',
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/perl/syntaxes/perl.tmLanguage.json',
  },
  {
    name: 'raku',
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/perl/syntaxes/perl6.tmLanguage.json',
    alias: ['perl6'],
  },
  {
    name: 'html',
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/php/syntaxes/html.tmLanguage.json',
  },
  {
    name: 'php',
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/php/syntaxes/php.tmLanguage.json',
  },
  {
    name: 'powershell',
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/powershell/syntaxes/powershell.tmLanguage.json',
    alias: ['ps', 'ps1'],
  },
  {
    name: 'pug',
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/pug/syntaxes/pug.tmLanguage.json',
    alias: ['jade'],
  },
  {
    name: 'python',
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/python/syntaxes/MagicPython.tmLanguage.json',
    alias: ['py'],
  },
  {
    name: 'r',
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/r/syntaxes/r.tmLanguage.json',
  },
  {
    name: 'rst',
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/restructuredtext/syntaxes/rst.tmLanguage.json',
  },
  {
    name: 'ruby',
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/ruby/syntaxes/ruby.tmLanguage.json',
    alias: ['rb'],
  },
  {
    name: 'rust',
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/rust/syntaxes/rust.tmLanguage.json',
    alias: ['rs'],
  },
  {
    name: 'scss',
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/scss/syntaxes/scss.tmLanguage.json',
  },
  {
    name: 'shaderlab',
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/shaderlab/syntaxes/shaderlab.tmLanguage.json',
    alias: ['shader'],
  },
  {
    name: 'shellscript',
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/shellscript/syntaxes/shell-unix-bash.tmLanguage.json',
    alias: ['bash', 'sh', 'shell', 'zsh'],
    displayName: 'Shell',
  },
  {
    name: 'sql',
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/sql/syntaxes/sql.tmLanguage.json',
  },
  {
    name: 'swift',
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/swift/syntaxes/swift.tmLanguage.json',
  },
  {
    name: 'typescript',
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/typescript-basics/syntaxes/TypeScript.tmLanguage.json',
    alias: ['ts'],
  },
  {
    name: 'tsx',
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/typescript-basics/syntaxes/TypeScriptReact.tmLanguage.json',
    displayName: 'TSX',
  },
  {
    name: 'jsdoc',
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/typescript-basics/syntaxes/jsdoc.js.injection.tmLanguage.json',
  },
  {
    name: 'jsdoc',
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/typescript-basics/syntaxes/jsdoc.ts.injection.tmLanguage.json',
  },
  {
    name: 'vb',
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/vb/syntaxes/asp-vb-net.tmlanguage.json',
    alias: ['cmd'],
  },
  {
    name: 'xml',
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/xml/syntaxes/xml.tmLanguage.json',
  },
  {
    name: 'xsl',
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/xml/syntaxes/xsl.tmLanguage.json',
  },
  {
    name: 'yaml',
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/yaml/syntaxes/yaml.tmLanguage.json',
    alias: ['yml'],
  },
]

export const sourcesCommunity: GrammarSource[] = [
  {
    name: 'abap',
    source: 'https://github.com/pvl/abap.tmbundle/blob/master/Syntaxes/ABAP.tmLanguage',
  },
  {
    name: 'ada',
    source: 'https://github.com/AdaCore/ada_language_server/blob/master/integration/vscode/ada/advanced/ada.tmLanguage.json',
  },
  {
    name: 'apache',
    source: 'https://github.com/colinta/ApacheConf.tmLanguage/blob/main/ApacheConf.tmLanguage',
  },
  {
    name: 'apex',
    source: 'https://github.com/forcedotcom/apex-tmLanguage/blob/main/grammars/apex.tmLanguage',
  },
  {
    name: 'apl',
    source: 'https://github.com/kimmolinna/vscode-apl-language/blob/master/syntaxes/apl.tmLanguage.json',
    displayName: 'APL',
  },
  {
    name: 'applescript',
    source: 'https://github.com/textmate/applescript.tmbundle/blob/master/Syntaxes/AppleScript.tmLanguage',
  },
  {
    name: 'actionscript-3',
    source: 'https://github.com/BowlerHatLLC/vscode-as3mxml/blob/main/distribution/src/assembly/syntaxes/AS3.tmLanguage',
    displayName: 'ActionScript',
  },
  {
    name: 'ara',
    source: 'https://github.com/ara-lang/highlighting/blob/main/syntaxes/ara.json',
  },
  {
    name: 'asm',
    source: 'https://github.com/13xforever/x86_64-assembly-vscode/blob/master/syntaxes/language-x86_64-assembly.tmLanguage',
    displayName: 'Assembly',
  },
  {
    name: 'astro',
    source: 'https://github.com/withastro/language-tools/blob/main/packages/vscode/syntaxes/astro.tmLanguage.src.yaml',
  },
  {
    name: 'awk',
    source: 'https://github.com/luggage66/vscode-awk/blob/master/syntaxes/awk.tmLanguage',
  },
  {
    name: 'ballerina',
    source: 'https://github.com/ballerina-platform/ballerina-grammar/blob/master/syntaxes/ballerina.tmLanguage',
  },
  {
    name: 'beancount',
    source: 'https://github.com/Lencerf/vscode-beancount/blob/master/syntaxes/beancount.tmLanguage',
  },
  {
    name: 'berry',
    source: 'https://github.com/berry-lang/berry/blob/master/tools/plugins/vscode/skiars.berry-1.1.0/syntaxes/berry.json',
    alias: [
      'be',
    ],
  },
  {
    name: 'bicep',
    source: 'https://github.com/Azure/bicep/blob/main/src/textmate/bicep.tmlanguage',
  },
  {
    name: 'blade',
    source: 'https://github.com/spatie/shiki-php/blob/main/languages/blade.tmLanguage.json',
  },
  {
    name: 'cadence',
    source: 'https://github.com/onflow/vscode-cadence/blob/master/extension/language/syntaxes/cadence.tmGrammar.json',
    alias: [
      'cdc',
    ],
  },
  {
    name: 'clarity',
    source: 'https://github.com/hirosystems/clarity.tmbundle/blob/main/Syntaxes/clarity.JSON-tmLanguage',
    displayName: 'Clarity',
  },
  {
    name: 'cmake',
    source: 'https://github.com/twxs/vs.language.cmake/blob/master/syntaxes/CMake.tmLanguage',
  },
  {
    name: 'cobol',
    source: 'https://github.com/spgennard/vscode_cobol/blob/main/syntaxes/COBOL.tmLanguage.json',
  },
  {
    name: 'codeql',
    source: 'https://github.com/github/vscode-codeql/blob/main/syntaxes/ql.tmLanguage.json',
    alias: [
      'ql',
    ],
    displayName: 'CodeQL',
  },
  {
    name: 'crystal',
    source: 'https://github.com/crystal-lang-tools/vscode-crystal-lang/blob/master/syntaxes/crystal.json',
  },
  {
    name: 'csharp',
    source: 'https://github.com/dotnet/csharp-tmLanguage/blob/main/grammars/csharp.tmLanguage',
    alias: [
      'c#',
      'cs',
    ],
  },
  {
    name: 'csv',
    source: 'https://github.com/mechatroner/vscode_rainbow_csv/blob/master/syntaxes/csv.tmLanguage.json',
  },
  {
    name: 'cue',
    source: 'https://github.com/cue-sh/vscode-cue/blob/master/syntaxes/cue.tmLanguage.json',
  },
  {
    name: 'cypher',
    source: 'https://github.com/adam-cowley/neo4j-vscode/blob/main/cypher/cypher.tmLanguage',
    alias: [
      'cql',
    ],
  },
  {
    name: 'd',
    source: 'https://github.com/Pure-D/code-d/blob/master/syntaxes/d.json',
  },
  {
    name: 'dart',
    source: 'https://github.com/Dart-Code/Dart-Code/blob/master/syntaxes/dart.json',
  },
  {
    name: 'dax',
    source: 'https://github.com/huyza/dax-language/blob/master/syntaxes/dax.grammer.json',
    displayName: 'DAX',
  },
  {
    name: 'dream-maker',
    source: 'https://github.com/gbasood/vscode-atomic-dreams/blob/master/syntaxes/dm.tmLanguage.json',
  },
  {
    name: 'elixir',
    source: 'https://github.com/elixir-editors/elixir-tmbundle/blob/master/Syntaxes/Elixir.tmLanguage',
  },
  {
    name: 'elm',
    source: 'https://github.com/elm-tooling/elm-language-client-vscode/blob/main/syntaxes/elm-syntax.json',
  },
  {
    name: 'erb',
    source: 'https://github.com/textmate/ruby.tmbundle/blob/master/Syntaxes/HTML%20(Ruby%20-%20ERB).tmLanguage',
    displayName: 'ERB',
  },
  {
    name: 'erlang',
    source: 'https://github.com/erlang-ls/grammar/blob/main/Erlang.plist',
    alias: [
      'erl',
    ],
  },
  {
    name: 'fish',
    source: 'https://github.com/bmalehorn/vscode-fish/blob/master/syntaxes/fish.tmLanguage.json',
    displayName: 'Fish',
  },
  {
    name: 'gdresource',
    source: 'https://github.com/godotengine/godot-vscode-plugin/blob/master/syntaxes/GDResource.tmLanguage.json',
    displayName: 'GDResource',
  },
  {
    name: 'gdscript',
    source: 'https://github.com/godotengine/godot-vscode-plugin/blob/master/syntaxes/GDScript.tmLanguage.json',
  },
  {
    name: 'gdshader',
    source: 'https://github.com/godotengine/godot-vscode-plugin/blob/master/syntaxes/GDShader.tmLanguage.json',
  },
  {
    name: 'gherkin',
    source: 'https://github.com/alexkrechik/VSCucumberAutoComplete/blob/master/gclient/syntaxes/feature.tmLanguage',
  },
  {
    name: 'glimmer-js',
    source: 'https://github.com/IgnaceMaes/glimmer-textmate-grammar/blob/main/glimmer-js.tmLanguage.json',
    alias: [
      'gjs',
    ],
  },
  {
    name: 'glimmer-ts',
    source: 'https://github.com/IgnaceMaes/glimmer-textmate-grammar/blob/main/glimmer-ts.tmLanguage.json',
    alias: [
      'gts',
    ],
  },
  {
    name: 'glsl',
    source: 'https://github.com/polym0rph/GLSL.tmbundle/blob/master/Syntaxes/GLSL.tmLanguage',
  },
  {
    name: 'gnuplot',
    source: 'https://github.com/MarioSchwalbe/vscode-gnuplot/blob/master/syntaxes/gnuplot.tmLanguage',
    displayName: 'Gnuplot',
  },
  {
    name: 'graphql',
    source: 'https://github.com/prisma-labs/vscode-graphql/blob/master/grammars/graphql.json',
    alias: [
      'gql',
    ],
  },
  {
    name: 'hack',
    source: 'https://github.com/slackhq/vscode-hack/blob/master/syntaxes/hack.json',
  },
  {
    name: 'haml',
    source: 'https://github.com/karuna/haml-vscode/blob/master/syntaxes/haml.json',
  },
  {
    name: 'haskell',
    source: 'https://github.com/octref/language-haskell/blob/master/syntaxes/haskell.json',
    alias: [
      'hs',
    ],
  },
  {
    name: 'hcl',
    source: 'https://github.com/hashicorp/syntax/blob/main/syntaxes/hcl.tmGrammar.json',
  },
  {
    name: 'hjson',
    source: 'https://github.com/hjson/textmate-hjson/blob/master/Syntaxes/Hjson.tmLanguage',
  },
  {
    name: 'imba',
    source: 'https://github.com/imba/vscode-imba/blob/master/syntaxes/imba.tmLanguage',
  },
  {
    name: 'jinja',
    source: 'https://github.com/samuelcolvin/jinjahtml-vscode/blob/main/syntaxes/jinja.tmLanguage.json',
  },
  {
    name: 'jinja-html',
    source: 'https://github.com/samuelcolvin/jinjahtml-vscode/blob/main/syntaxes/jinja-html.tmLanguage.json',
    displayName: 'Jinja',
  },
  {
    name: 'jison',
    source: 'https://github.com/cdibbs/language-jison/blob/master/grammars/jison.cson',
  },
  {
    name: 'json5',
    source: 'https://github.com/mrmlnc/vscode-json5/blob/master/syntaxes/json5.json',
  },
  {
    name: 'jsonnet',
    source: 'https://github.com/heptio/vscode-jsonnet/blob/master/syntaxes/jsonnet.tmLanguage.json',
  },
  {
    name: 'jssm',
    source: 'https://github.com/StoneCypher/sublime-jssm/blob/master/jssm.tmLanguage',
    alias: [
      'fsl',
    ],
  },
  {
    name: 'kotlin',
    source: 'https://github.com/fwcd/vscode-kotlin/blob/main/syntaxes/kotlin.tmLanguage.json',
    alias: [
      'kt',
      'kts',
    ],
  },
  {
    name: 'kusto',
    source: 'https://github.com/rosshamish/kuskus/blob/master/kusto-syntax-highlighting/syntaxes/kusto.tmLanguage.json',
    alias: [
      'kql',
    ],
  },
  {
    name: 'latex',
    source: 'https://github.com/James-Yu/LaTeX-Workshop/blob/master/syntax/LaTeX.tmLanguage.json',
  },
  {
    name: 'lisp',
    source: 'https://github.com/mattn/vscode-lisp/blob/master/syntaxes/Lisp.tmLanguage',
  },
  {
    name: 'liquid',
    source: 'https://github.com/Shopify/liquid-tm-grammar/blob/main/grammars/liquid.tmLanguage.json',
    displayName: 'Liquid',
  },
  {
    name: 'logo',
    source: 'https://github.com/textmate/logo.tmbundle/blob/master/Syntaxes/Logo.tmLanguage',
  },
  {
    name: 'marko',
    source: 'https://github.com/marko-js/marko-tmbundle/blob/master/Syntaxes/marko.tmLanguage',
  },
  {
    name: 'matlab',
    source: 'https://github.com/mathworks/MATLAB-Language-grammar/blob/40d9a0cd3b628f80cdcf948bbe1747a527ed5dd5/Matlab.tmbundle/Syntaxes/MATLAB.tmLanguage',
  },
  {
    name: 'mdc',
    source: 'https://github.com/nuxtlabs/vscode-mdc/blob/main/syntaxes/mdc.tmLanguage.json',
  },
  {
    name: 'mdx',
    source: 'https://github.com/wooorm/markdown-tm-language/blob/main/source.mdx.tmLanguage',
  },
  {
    name: 'mojo',
    source: 'https://github.com/modularml/mojo-syntax/blob/main/syntaxes/mojo.syntax.json',
    displayName: 'Mojo',
  },
  {
    name: 'narrat',
    source: 'https://github.com/liana-p/narrat-syntax-highlighting-vscode/blob/main/syntaxes/narrat.tmLanguage.yaml',
    alias: [
      'nar',
    ],
  },
  {
    name: 'nextflow',
    source: 'https://github.com/nextflow-io/vscode-language-nextflow/blob/master/syntaxes/nextflow.tmLanguage.json',
    alias: [
      'nf',
    ],
  },
  {
    name: 'nginx',
    source: 'https://github.com/hangxingliu/vscode-nginx-conf-hint/blob/main/src/syntax/nginx.tmLanguage',
    displayName: 'Nginx',
  },
  {
    name: 'nim',
    source: 'https://github.com/pragmagic/vscode-nim/blob/master/syntaxes/nim.json',
  },
  {
    name: 'nix',
    source: 'https://github.com/bbenoist/vscode-nix/blob/master/syntaxes/nix.tmLanguage',
  },
  {
    name: 'nushell',
    source: 'https://github.com/nushell/vscode-nushell-lang/blob/main/syntaxes/nushell.tmLanguage.json',
    alias: [
      'nu',
    ],
  },
  {
    name: 'ocaml',
    source: 'https://github.com/reasonml-editor/vscode-reasonml/blob/master/syntaxes/ocaml.json',
  },
  {
    name: 'pascal',
    source: 'https://github.com/alefragnani/vscode-language-pascal/blob/master/syntaxes/pascal.tmLanguage',
  },
  {
    name: 'plsql',
    source: 'https://github.com/zabel-xyz/plsql-language/blob/master/syntaxes/plsql.tmLanguage',
    displayName: 'PL/SQL',
  },
  {
    name: 'powerquery',
    source: 'https://github.com/microsoft/powerquery-language/blob/master/PowerQuery.tmLanguage.json',
    displayName: 'PowerQuery',
  },
  {
    name: 'prisma',
    source: 'https://github.com/prisma/language-tools/blob/main/packages/vscode/syntaxes/prisma.tmLanguage.json',
  },
  {
    name: 'prolog',
    source: 'https://github.com/arthwang/vsc-prolog/blob/master/syntaxes/prolog.swi.tmLanguage.json',
    displayName: 'Prolog',
  },
  {
    name: 'proto',
    source: 'https://github.com/zxh0/vscode-proto3/blob/master/syntaxes/proto3.tmLanguage.json',
  },
  {
    name: 'puppet',
    source: 'https://github.com/octref/puppet-vscode/blob/main/syntaxes/puppet.tmLanguage',
  },
  {
    name: 'purescript',
    source: 'https://github.com/nwolverson/vscode-language-purescript/blob/master/syntaxes/purescript.json',
  },
  {
    name: 'razor',
    source: 'https://github.com/dotnet/razor/blob/main/src/Razor/src/Microsoft.VisualStudio.RazorExtension/EmbeddedGrammars/aspnetcorerazor.tmLanguage.json',
  },
  {
    name: 'reg',
    source: 'https://github.com/mihai-vlc/reg-vscode/blob/master/syntaxes/reg.tmLanguage',
    displayName: 'Windows Registry Script',
  },
  {
    name: 'rel',
    source: 'https://github.com/relationalai-oss/rel_vscode/blob/master/syntaxes/rel.tmLanguage.json',
  },
  {
    name: 'riscv',
    source: 'https://github.com/zhuanhao-wu/vscode-riscv-support/blob/master/syntaxes/riscv.tmLanguage',
    displayName: 'RISC-V',
  },
  {
    name: 'sas',
    source: 'https://github.com/rpardee/sas/blob/master/syntaxes/sas.tmLanguage',
    displayName: 'SAS',
  },
  {
    name: 'sass',
    source: 'https://github.com/TheRealSyler/vscode-sass-indented/blob/master/syntaxes/sass.tmLanguage.json',
  },
  {
    name: 'scala',
    source: 'https://github.com/scala/vscode-scala-syntax/blob/main/syntaxes/Scala.tmLanguage.json',
  },
  {
    name: 'scheme',
    source: 'https://github.com/sjhuangx/vscode-scheme/blob/master/syntaxes/scheme.tmLanguage',
  },
  {
    name: 'shellsession',
    source: 'https://github.com/hronro/sublime-linguist-syntax/blob/master/syntaxes/ShellSession.tmLanguage',
    alias: [
      'console',
    ],
  },
  {
    name: 'smalltalk',
    source: 'https://github.com/leocamello/vscode-smalltalk/blob/master/syntaxes/smalltalk.tmLanguage.json',
  },
  {
    name: 'solidity',
    source: 'https://github.com/juanfranblanco/vscode-solidity/blob/master/syntaxes/solidity.json',
  },
  {
    name: 'sparql',
    source: 'https://github.com/stardog-union/stardog-vsc/blob/master/stardog-rdf-grammars/syntaxes/sparql.tmLanguage.json',
  },
  {
    name: 'splunk',
    source: 'https://github.com/arcsector/vscode-splunk-search-syntax/blob/master/syntaxes/splunk_search.tmLanguage',
    alias: [
      'spl',
    ],
  },
  {
    name: 'ssh-config',
    source: 'https://github.com/textmate/ssh-config.tmbundle/blob/master/Syntaxes/SSH-Config.tmLanguage',
  },
  {
    name: 'stata',
    source: 'https://github.com/kylebarron/language-stata/blob/vscode/grammars/stata.json',
  },
  {
    name: 'stylus',
    source: 'https://github.com/d4rkr00t/language-stylus/blob/master/syntaxes/stylus.json',
    alias: [
      'styl',
    ],
  },
  {
    name: 'svelte',
    source: 'https://github.com/sveltejs/language-tools/blob/master/packages/svelte-vscode/syntaxes/svelte.tmLanguage.src.yaml',
    displayName: 'Svelte',
  },
  {
    name: 'system-verilog',
    source: 'https://github.com/mshr-h/vscode-verilog-hdl-support/blob/main/syntaxes/systemverilog.tmLanguage.json',
  },
  {
    name: 'tasl',
    source: 'https://github.com/underlay/vscode-tasl/blob/main/syntaxes/tasl.tmLanguage.json',
    displayName: 'Tasl',
  },
  {
    name: 'tcl',
    source: 'https://github.com/sleutho/tcl/blob/master/syntaxes/tcl.tmLanguage',
  },
  {
    name: 'tex',
    source: 'https://github.com/James-Yu/LaTeX-Workshop/blob/master/syntax/TeX.tmLanguage.json',
  },
  {
    name: 'toml',
    source: 'https://github.com/textmate/toml.tmbundle/blob/master/Syntaxes/TOML.tmLanguage',
  },
  {
    name: 'turtle',
    source: 'https://github.com/stardog-union/stardog-vsc/blob/master/stardog-rdf-grammars/syntaxes/turtle.tmLanguage.json',
  },
  {
    name: 'twig',
    source: 'https://github.com/mblode/vscode-twig-language-2/blob/master/src/syntaxes/twig.tmLanguage',
    displayName: 'Twig',
  },
  {
    name: 'verilog',
    source: 'https://github.com/mshr-h/vscode-verilog-hdl-support/blob/main/syntaxes/verilog.tmLanguage.json',
  },
  {
    name: 'vhdl',
    source: 'https://github.com/jonasjj/awesome-vhdl/blob/master/syntaxes/vhdl.tmLanguage',
  },
  {
    name: 'viml',
    source: 'https://github.com/dunstontc/viml/blob/master/syntaxes/viml.tmLanguage.json',
    alias: [
      'vim',
      'vimscript',
    ],
    displayName: 'Vim Script',
  },
  {
    name: 'vue',
    source: 'https://github.com/vuejs/language-tools/blob/master/extensions/vscode/syntaxes/vue.tmLanguage.json',
  },
  {
    name: 'vue-html',
    source: 'https://github.com/vuejs/vetur/blob/master/syntaxes/vue-html.tmLanguage.json',
  },
  {
    name: 'vyper',
    source: 'https://github.com/tintinweb/vscode-vyper/blob/master/syntaxes/vyper.tmLanguage.json',
    alias: [
      'vy',
    ],
  },
  {
    name: 'postcss',
    source: 'https://github.com/vuejs/vetur/blob/master/syntaxes/vue-postcss.json',
  },
  {
    name: 'wasm',
    source: 'https://github.com/wasmerio/vscode-wasm/blob/master/syntaxes/wat.json',
    displayName: 'WebAssembly',
  },
  {
    name: 'wgsl',
    source: 'https://github.com/PolyMeilex/vscode-wgsl/blob/master/syntaxes/wgsl.tmLanguage.json',
  },
  {
    name: 'wenyan',
    source: 'https://github.com/wenyan-lang/highlight/blob/master/wenyan.tmLanguage.json',
    alias: [
      '文言',
    ],
    displayName: 'Wenyan',
  },
  {
    name: 'wolfram',
    source: 'https://github.com/WolframResearch/vscode-wolfram/blob/master/syntaxes/wolfram.tmLanguage.json',
    alias: [
      'wl',
    ],
  },
  {
    name: 'zenscript',
    source: 'https://github.com/CraftTweaker/ZenScript-tmLanguage/blob/master/zenscript.tmLanguage.json',
  },
  {
    name: 'v',
    source: 'https://github.com/vlang/vscode-vlang/blob/master/syntaxes/v.tmLanguage.json',
  },
  {
    name: 'zig',
    source: 'https://github.com/ziglang/vscode-zig/blob/master/syntaxes/zig.tmLanguage.json',
  },
]

/**
 * Grammars from VS Code marketplace
 * Some grammars have compilation step and do not include the built grammar on GitHub,
 * so pull from VS Code marketplace instead.
 */
export const sourcesMarketplace: GrammarSource[] = [
  {
    name: 'mermaid',
    source: 'marketplace:bpruitt-goddard.mermaid-markdown-syntax-highlighting',
  },
]

export const sources = [
  ...sourcesVSCode,
  ...sourcesCommunity,
  // ...sourcesMarketplace,
]
