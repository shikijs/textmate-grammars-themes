import type { GrammarSource } from './scripts/grammars/types'

export const sourcesVSCode: GrammarSource[] = [
  {
    name: 'bat',
    aliases: ['batch'],
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/bat/syntaxes/batchfile.tmLanguage.json',
  },
  {
    name: 'clojure',
    aliases: ['clj'],
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/clojure/syntaxes/clojure.tmLanguage.json',
  },
  {
    name: 'coffee',
    aliases: ['coffeescript'],
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/coffeescript/syntaxes/coffeescript.tmLanguage.json',
  },
  {
    name: 'c',
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/cpp/syntaxes/c.tmLanguage.json',
  },
  {
    name: 'cpp',
    aliases: ['c++'],
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/cpp/syntaxes/cpp.tmLanguage.json',
  },
  {
    name: 'csharp',
    aliases: ['c#', 'cs'],
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/csharp/syntaxes/csharp.tmLanguage.json',
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
    aliases: ['dockerfile'],
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/docker/syntaxes/docker.tmLanguage.json',
  },
  {
    name: 'fsharp',
    displayName: 'F#',
    aliases: ['f#', 'fs'],
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/fsharp/syntaxes/fsharp.tmLanguage.json',
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
    aliases: ['hbs'],
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/handlebars/syntaxes/Handlebars.tmLanguage.json',
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
    displayName: 'INI',
    aliases: ['properties'],
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/ini/syntaxes/ini.tmLanguage.json',
  },
  {
    name: 'java',
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/java/syntaxes/java.tmLanguage.json',
  },
  {
    name: 'javascript',
    displayName: 'JavaScript',
    aliases: ['js'],
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/javascript/syntaxes/JavaScript.tmLanguage.json',
  },
  {
    name: 'jsx',
    displayName: 'JSX',
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/javascript/syntaxes/JavaScriptReact.tmLanguage.json',
  },
  {
    name: 'json',
    displayName: 'JSON',
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
    aliases: ['makefile'],
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/make/syntaxes/make.tmLanguage.json',
  },
  {
    name: 'markdown',
    aliases: ['md'],
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/markdown-basics/syntaxes/markdown.tmLanguage.json',
  },
  {
    name: 'objective-cpp',
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/objective-c/syntaxes/objective-c++.tmLanguage.json',
  },
  {
    name: 'objective-c',
    aliases: ['objc'],
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/objective-c/syntaxes/objective-c.tmLanguage.json',
  },
  {
    name: 'perl',
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/perl/syntaxes/perl.tmLanguage.json',
  },
  {
    name: 'raku',
    displayName: 'Raku',
    aliases: ['perl6'],
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/perl/syntaxes/perl6.tmLanguage.json',
  },
  {
    name: 'php',
    displayName: 'PHP',
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/php/syntaxes/php.tmLanguage.json',
  },
  {
    name: 'powershell',
    aliases: ['ps', 'ps1'],
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/powershell/syntaxes/powershell.tmLanguage.json',
  },
  {
    name: 'pug',
    aliases: ['jade'],
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/pug/syntaxes/pug.tmLanguage.json',
  },
  {
    name: 'python',
    displayName: 'Python',
    aliases: ['py'],
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/python/syntaxes/MagicPython.tmLanguage.json',
  },
  {
    name: 'r',
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/r/syntaxes/r.tmLanguage.json',
  },
  {
    name: 'rst',
    displayName: 'reStructuredText',
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/restructuredtext/syntaxes/rst.tmLanguage.json',
  },
  {
    name: 'ruby',
    aliases: ['rb'],
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/ruby/syntaxes/ruby.tmLanguage.json',
  },
  {
    name: 'rust',
    aliases: ['rs'],
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/rust/syntaxes/rust.tmLanguage.json',
  },
  {
    name: 'scss',
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/scss/syntaxes/scss.tmLanguage.json',
  },
  {
    name: 'shaderlab',
    aliases: ['shader'],
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/shaderlab/syntaxes/shaderlab.tmLanguage.json',
  },
  {
    name: 'shellscript',
    displayName: 'Shell',
    aliases: ['bash', 'sh', 'shell', 'zsh'],
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/shellscript/syntaxes/shell-unix-bash.tmLanguage.json',
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
    aliases: ['ts'],
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/typescript-basics/syntaxes/TypeScript.tmLanguage.json',
  },
  {
    name: 'tsx',
    displayName: 'TSX',
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/typescript-basics/syntaxes/TypeScriptReact.tmLanguage.json',
  },
  {
    name: 'vb',
    displayName: 'Visual Basic',
    aliases: ['cmd'],
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/vb/syntaxes/asp-vb-net.tmlanguage.json',
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
    aliases: ['yml'],
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/yaml/syntaxes/yaml.tmLanguage.json',
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
    displayName: 'APL',
    source: 'https://github.com/kimmolinna/vscode-apl-language/blob/master/syntaxes/apl.tmLanguage.json',
  },
  {
    name: 'applescript',
    source: 'https://github.com/textmate/applescript.tmbundle/blob/master/Syntaxes/AppleScript.tmLanguage',
  },
  {
    name: 'actionscript-3',
    displayName: 'ActionScript',
    source: 'https://github.com/BowlerHatLLC/vscode-as3mxml/blob/main/distribution/src/assembly/syntaxes/AS3.tmLanguage',
  },
  {
    name: 'ara',
    source: 'https://github.com/ara-lang/highlighting/blob/main/syntaxes/ara.json',
  },
  {
    name: 'asm',
    displayName: 'Assembly',
    source: 'https://github.com/13xforever/x86_64-assembly-vscode/blob/master/syntaxes/language-x86_64-assembly.tmLanguage',
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
    aliases: [
      'be',
    ],
    source: 'https://github.com/berry-lang/berry/blob/master/tools/plugins/vscode/skiars.berry-1.1.0/syntaxes/berry.json',
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
    displayName: 'Cadence',
    aliases: [
      'cdc',
    ],
    source: 'https://github.com/onflow/vscode-cadence/blob/master/extension/language/syntaxes/cadence.tmGrammar.json',
  },
  {
    name: 'clarity',
    displayName: 'Clarity',
    source: 'https://github.com/hirosystems/clarity.tmbundle/blob/main/Syntaxes/clarity.JSON-tmLanguage',
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
    displayName: 'CodeQL',
    aliases: ['ql'],
    source: 'https://github.com/github/vscode-codeql/blob/main/syntaxes/ql.tmLanguage.json',
  },
  {
    name: 'crystal',
    source: 'https://github.com/crystal-lang-tools/vscode-crystal-lang/blob/master/syntaxes/crystal.json',
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
    aliases: ['cql'],
    source: 'https://github.com/adam-cowley/neo4j-vscode/blob/main/cypher/cypher.tmLanguage',
  },
  {
    name: 'd',
    source: 'https://github.com/Pure-D/code-d/blob/master/syntaxes/d.json',
  },
  {
    name: 'dax',
    displayName: 'DAX',
    source: 'https://github.com/huyza/dax-language/blob/master/syntaxes/dax.grammer.json',
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
    displayName: 'ERB',
    source: 'https://github.com/textmate/ruby.tmbundle/blob/master/Syntaxes/HTML%20(Ruby%20-%20ERB).tmLanguage',
  },
  {
    name: 'erlang',
    aliases: ['erl'],
    source: 'https://github.com/erlang-ls/grammar/blob/main/Erlang.plist',
  },
  {
    name: 'fish',
    displayName: 'Fish',
    source: 'https://github.com/bmalehorn/vscode-fish/blob/master/syntaxes/fish.tmLanguage.json',
  },
  {
    name: 'gdresource',
    displayName: 'GDResource',
    source: 'https://github.com/godotengine/godot-vscode-plugin/blob/master/syntaxes/GDResource.tmLanguage.json',
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
    aliases: ['gjs'],
    source: 'https://github.com/IgnaceMaes/glimmer-textmate-grammar/blob/main/glimmer-js.tmLanguage.json',
  },
  {
    name: 'glimmer-ts',
    aliases: ['gts'],
    source: 'https://github.com/IgnaceMaes/glimmer-textmate-grammar/blob/main/glimmer-ts.tmLanguage.json',
  },
  {
    name: 'glsl',
    source: 'https://github.com/polym0rph/GLSL.tmbundle/blob/master/Syntaxes/GLSL.tmLanguage',
  },
  {
    name: 'gnuplot',
    displayName: 'Gnuplot',
    source: 'https://github.com/MarioSchwalbe/vscode-gnuplot/blob/master/syntaxes/gnuplot.tmLanguage',
  },
  {
    name: 'graphql',
    aliases: ['gql',
    ],
    source: 'https://github.com/prisma-labs/vscode-graphql/blob/master/grammars/graphql.json',
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
    aliases: ['hs',
    ],
    source: 'https://github.com/octref/language-haskell/blob/master/syntaxes/haskell.json',
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
    source: 'https://github.com/imba/imba/blob/master/packages/vscode-imba/syntaxes/imba.tmLanguage.json',
  },
  {
    name: 'jinja',
    displayName: 'Jinja',
    source: 'https://github.com/samuelcolvin/jinjahtml-vscode/blob/main/syntaxes/jinja.tmLanguage.json',
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
    aliases: ['fsl'],
    source: 'https://github.com/StoneCypher/sublime-jssm/blob/master/jssm.tmLanguage',
  },
  {
    name: 'kotlin',
    aliases: ['kt', 'kts'],
    source: 'https://github.com/fwcd/vscode-kotlin/blob/main/syntaxes/kotlin.tmLanguage.json',
  },
  {
    name: 'kusto',
    aliases: ['kql'],
    source: 'https://github.com/rosshamish/kuskus/blob/master/kusto-syntax-highlighting/syntaxes/kusto.tmLanguage.json',
  },
  {
    name: 'lisp',
    source: 'https://github.com/mattn/vscode-lisp/blob/master/syntaxes/Lisp.tmLanguage',
  },
  {
    name: 'liquid',
    displayName: 'Liquid',
    source: 'https://github.com/Shopify/liquid-tm-grammar/blob/main/grammars/liquid.tmLanguage.json',
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
    displayName: 'Mojo',
    source: 'https://github.com/modularml/mojo-syntax/blob/main/syntaxes/mojo.syntax.json',
  },
  {
    name: 'narrat',
    aliases: ['nar'],
    source: 'https://github.com/liana-p/narrat-syntax-highlighting-vscode/blob/main/syntaxes/narrat.tmLanguage.yaml',
  },
  {
    name: 'nextflow',
    aliases: ['nf'],
    source: 'https://github.com/nextflow-io/vscode-language-nextflow/blob/master/syntaxes/nextflow.tmLanguage.json',
  },
  {
    name: 'nginx',
    displayName: 'Nginx',
    source: 'https://github.com/hangxingliu/vscode-nginx-conf-hint/blob/main/src/syntax/nginx.tmLanguage',
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
    aliases: ['nu'],
    source: 'https://github.com/nushell/vscode-nushell-lang/blob/main/syntaxes/nushell.tmLanguage.json',
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
    displayName: 'PL/SQL',
    source: 'https://github.com/zabel-xyz/plsql-language/blob/master/syntaxes/plsql.tmLanguage',
  },
  {
    name: 'powerquery',
    displayName: 'PowerQuery',
    source: 'https://github.com/microsoft/powerquery-language/blob/master/PowerQuery.tmLanguage.json',
  },
  {
    name: 'prisma',
    source: 'https://github.com/prisma/language-tools/blob/main/packages/vscode/syntaxes/prisma.tmLanguage.json',
  },
  {
    name: 'prolog',
    displayName: 'Prolog',
    source: 'https://github.com/arthwang/vsc-prolog/blob/master/syntaxes/prolog.swi.tmLanguage.json',
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
    displayName: 'Windows Registry Script',
    source: 'https://github.com/mihai-vlc/reg-vscode/blob/master/syntaxes/reg.tmLanguage',
  },
  {
    name: 'rel',
    source: 'https://github.com/relationalai-oss/rel_vscode/blob/master/syntaxes/rel.tmLanguage.json',
  },
  {
    name: 'riscv',
    displayName: 'RISC-V',
    source: 'https://github.com/zhuanhao-wu/vscode-riscv-support/blob/master/syntaxes/riscv.tmLanguage',
  },
  {
    name: 'sas',
    displayName: 'SAS',
    source: 'https://github.com/rpardee/sas/blob/master/syntaxes/sas.tmLanguage',
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
    aliases: ['console'],
    source: 'https://github.com/hronro/sublime-linguist-syntax/blob/master/syntaxes/ShellSession.tmLanguage',
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
    aliases: ['spl'],
    source: 'https://github.com/arcsector/vscode-splunk-search-syntax/blob/master/syntaxes/splunk_search.tmLanguage',
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
    aliases: ['styl'],
    source: 'https://github.com/d4rkr00t/language-stylus/blob/master/syntaxes/stylus.json',
  },
  {
    name: 'svelte',
    displayName: 'Svelte',
    source: 'https://github.com/sveltejs/language-tools/blob/master/packages/svelte-vscode/syntaxes/svelte.tmLanguage.src.yaml',
  },
  {
    name: 'system-verilog',
    source: 'https://github.com/mshr-h/vscode-verilog-hdl-support/blob/main/syntaxes/systemverilog.tmLanguage.json',
  },
  {
    name: 'tasl',
    displayName: 'Tasl',
    source: 'https://github.com/underlay/vscode-tasl/blob/main/syntaxes/tasl.tmLanguage.json',
  },
  {
    name: 'tcl',
    source: 'https://github.com/sleutho/tcl/blob/master/syntaxes/tcl.tmLanguage',
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
    displayName: 'Twig',
    source: 'https://github.com/mblode/vscode-twig-language-2/blob/master/src/syntaxes/twig.tmLanguage',
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
    displayName: 'Vim Script',
    aliases: ['vim', 'vimscript'],
    source: 'https://github.com/dunstontc/viml/blob/master/syntaxes/viml.tmLanguage.json',
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
    aliases: ['vy'],
    source: 'https://github.com/tintinweb/vscode-vyper/blob/master/syntaxes/vyper.tmLanguage.json',
  },
  {
    name: 'postcss',
    source: 'https://github.com/vuejs/vetur/blob/master/syntaxes/vue-postcss.json',
  },
  {
    name: 'wasm',
    displayName: 'WebAssembly',
    source: 'https://github.com/wasmerio/vscode-wasm/blob/master/syntaxes/wat.json',
  },
  {
    name: 'wgsl',
    source: 'https://github.com/PolyMeilex/vscode-wgsl/blob/master/syntaxes/wgsl.tmLanguage.json',
  },
  {
    name: 'wenyan',
    displayName: 'Wenyan',
    aliases: ['文言'],
    source: 'https://github.com/wenyan-lang/highlight/blob/master/wenyan.tmLanguage.json',
  },
  {
    name: 'wolfram',
    aliases: ['wl'],
    source: 'https://github.com/WolframResearch/vscode-wolfram/blob/master/syntaxes/wolfram.tmLanguage.json',
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
  {
    name: 'http',
    displayName: 'HTTP',
    source: 'https://github.com/Huachao/vscode-restclient/blob/master/syntaxes/http.tmLanguage.json',
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
    displayName: 'Mermaid',
    source: 'https://github.com/bpruitt-goddard/vscode-mermaid-syntax-highlight/blob/master/syntaxes/mermaid.tmLanguage.yaml',
    marketplace: {
      name: 'bpruitt-goddard.mermaid-markdown-syntax-highlighting',
      grammar: 'mermaid',
    },
  },
]

/**
 * Injections are sub-grammars that are embedded in other grammars.
 *
 * Use `embeddedIn` to specify the grammars that the injection is embedded in.
 */
export const sourcesInjections: GrammarSource[] = [
  {
    name: 'cpp-macro',
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/cpp/syntaxes/cpp.embedded.macro.tmLanguage.json',
    embeddedIn: ['cpp'],
  },
  {
    name: 'jinja-html',
    source: 'https://github.com/samuelcolvin/jinjahtml-vscode/blob/main/syntaxes/jinja-html.tmLanguage.json',
    embeddedIn: ['jinja'],
  },
  {
    name: 'vue-directives',
    source: 'https://github.com/vuejs/language-tools/blob/master/extensions/vscode/syntaxes/vue-directives.json',
    embeddedIn: ['vue'],
    injectTo: [
      'source.vue',
      'text.html.markdown',
      'text.html.derivative',
      'text.pug',
    ],
  },
  {
    name: 'vue-interpolations',
    source: 'https://github.com/vuejs/language-tools/blob/master/extensions/vscode/syntaxes/vue-interpolations.json',
    embeddedIn: ['vue'],
    injectTo: [
      'source.vue',
      'text.html.markdown',
      'text.html.derivative',
      'text.pug',
    ],
  },
  {
    name: 'vue-sfc-style-variable-injection',
    source: 'https://github.com/vuejs/language-tools/blob/master/extensions/vscode/syntaxes/vue-sfc-style-variable-injection.json',
    embeddedIn: ['vue'],
    injectTo: [
      'source.vue',
    ],
  },
  {
    name: 'markdown-vue',
    source: 'https://github.com/vuejs/language-tools/blob/master/extensions/vscode/syntaxes/markdown-vue.json',
    embeddedIn: ['vue'],
    injectTo: [
      'text.html.markdown',
    ],
  },
]

export const sources = [
  ...sourcesVSCode,
  ...sourcesCommunity,
  ...sourcesMarketplace,
  ...sourcesInjections,
]
