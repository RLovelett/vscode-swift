# Swift for Visual Studio Code

This extension adds rich language support for the Swift language to VS Code. These features are provided by the Swift framework itself through [SourceKit](https://github.com/apple/swift/tree/master/tools/SourceKit) and [SourceKitten](https://github.com/jpsim/SourceKitten).

Currently the extension provides rudimentary support for:

- Completion lists
- Symbol resolution

Future support for:

- Document Highlights: highlights all 'equal' symbols in a Swift document.
- Hover: provides hover information for a symbol selected in a Swift document.
- Signature Help: provides signature help for a symbol selected in a Swift document.
- Find References: find all project-wide references for a symbol selected in a Swift document.
- List Workspace Symbols: list all project-wide symbols.
- CodeLens: compute CodeLens statistics for a given Swift document.
- Rename: project-wide rename of a symbol.
- Debugger
- [Swift Package Manger](https://swift.org/package-manager/)

## Features

### Completion Lists

Use completion lists to find out about available standard library types and function signatures.

![Struct Def](http://i.giphy.com/26gJAJzxzZDsVEs24.gif)

Do the same for your own custom types. Including documentation comments.

![Struct Docs](http://i.giphy.com/l0HlzNmlfLl7fyc0g.gif)

## Requirements

This extension requires Swift to be installed on your system. More specifically it requires [SourceKit](https://github.com/apple/swift/tree/master/tools/SourceKit) and [SourceKitten](https://github.com/jpsim/SourceKitten) to be available as well.

[Currently, SourceKit and by extension SourceKitten, do not compile on Linux.](https://github.com/jpsim/SourceKitten/pull/223) This limits the extension to only work on macOS. This is not expected to be the long-term solution. In fact running on Linux was the whole reason why I started this extension.

The extension expects [`v0.13.0` of SourceKitten](https://github.com/jpsim/SourceKitten/releases/tag/0.13.0) to be installed at `/usr/local/bin/sourcekitten`.

With [homebrew]() this can easily be achieved by running `brew install sourcekitten`.

## Extension Settings

* `sourcekitten` path

## Known Issues

- Does not run on Linux

## Release Notes
For detailed release notes see: [Releases](https://github.com/RLovelett/vscode-swift/releases)

### 0.0.5

* Completions use snippet formatting for placeholders, allows the cursor to tab between placeholders
* Completions index against all swift files in the workspace
* Bug fixes

### 0.0.3

* Allow configuring sourceKitten install location

### 0.0.2

Preview release of the extension
