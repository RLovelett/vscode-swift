# Swift for Visual Studio Code

This extension adds rich language support for the Swift language to VS Code. These features are provided by the Swift framework itself through [SourceKit](https://github.com/apple/swift/tree/master/tools/SourceKit) and [a Swift Language Server](https://github.com/RLovelett/langserver-swift) implementation.

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

This extension requires Swift to be installed on your system. [It also requires a Swift language server be installed as well.](https://github.com/RLovelett/langserver-swift)
By default the extension looks for the language server to be installed at `/usr/local/bin/LanguageServer` (though this behavior is configurable).

### Swift

* Swift Open Source `swift-DEVELOPMENT-SNAPSHOT-2016-12-01-a` toolchain (**Minimum REQUIRED for latest release**)

### macOS

* macOS 10.11.6 (*El Capitan*) or higher
* Xcode Version 8.2 beta (8C30a) or higher using one of the above toolchains (*Recommended*)

### Linux

* [Coming Soon?](https://github.com/apple/swift/pull/5903)

#### A few remarks about Linux support

The language server that drives this extension depends on [SourceKit](https://github.com/apple/swift/tree/master/tools/SourceKit) to be available with the Swift toolchain.
Unfortunately, at this time that means that Linux support is not really possible because [SourceKit is not built by default on Linux](https://github.com/apple/swift/pull/5903).

[Of course it is _possible_ to build SourceKit for Linux](https://github.com/apple/swift/pull/5903). However, doing so is beyond the scope of this project.

All of the dependencies of the language server, at least ostensibly, support Linux. So there should be little preventing Linux support beyond SourceKit being available on the platform.

I want to stress: **I hope this will not be the long-term answer/solution**. In fact running on Linux was the whole reason why I started this extension.

## Extension Settings

* `LanguageServer` path

## Known Issues

- Does not run on Linux

## Release Notes

For detailed release notes see: [Releases](https://github.com/RLovelett/vscode-swift/releases)

### 0.1.0

* Swift 3.1 (via previews)
* [Swift native language server implementation](https://github.com/RLovelett/langserver-swift)

### 0.0.5

* Completions use snippet formatting for placeholders, allows the cursor to tab between placeholders
* Completions index against all swift files in the workspace
* Bug fixes

### 0.0.3

* Allow configuring sourceKitten install location

### 0.0.2

Preview release of the extension
