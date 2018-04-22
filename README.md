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

![Struct Def](https://i.giphy.com/26gJAJzxzZDsVEs24.gif)

Do the same for your own custom types. Including documentation comments.

![Struct Docs](https://i.giphy.com/l0HlzNmlfLl7fyc0g.gif)

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

# Debug and Development

The extension itself relies on a language server to interact with it. [This server has been developed to work with Visual Studio Code](https://github.com/RLovelett/langserver-swift).

An example workflow for interactively debugging the language server while using it with the Visual Stuio Code client is provided in this section. The instructions are devided into two sections. The first section explains how to generate and configure an Xcode project for debugging. The second section explains how to configure the Visual Studio Code plugin to use the debug executable.

## Xcode (e.g., [langserver-swift](https://github.com/RLovelett/langserver-swift))

In the directory containing the clone of the language server use SwiftPM to generate an Xcode project.

```
% git clone https://github.com/RLovelett/langserver-swift.git
% cd langserver-swift
% swift package generate-xcodeproj --xcconfig-overrides settings.xcconfig
```

Since the language server client, e.g., VSCode, will actually launch the language server LLDB needs to be told to wait for the application to launch. This can be configured in Xcode after opening the generated project in Xcode. See the screenshot below.

<img width="997" alt="screen shot 2017-02-22 at 8 55 57 am" src="https://cloud.githubusercontent.com/assets/335572/23214552/1b0afce2-f8dd-11e6-8812-370ad148ee73.png">

The next step is to build the executable and launch LLDB. Both of these steps can be performed by going to "Product > Run" or the keyboard shortcut ⌘R. After building completes, Xcode should report something like "Waiting to attach to LanguageServer : LanguageServer".

<img width="844" alt="screen shot 2017-02-22 at 9 40 33 am" src="https://cloud.githubusercontent.com/assets/335572/23216177/0b0fc6a0-f8e3-11e6-9f0c-a5d71a01933a.png">

One final step is to determine the `TARGET_BUILD_DIR`. This is used to tell the VSCode extension in the next section where the debug language server is located.

From a terminal whose current working directory contains the Xcode project previously generated by SwiftPM you can get this information from `xcodebuild`.

```
% xcodebuild -project langserver-swift.xcodeproj -target "LanguageServer" -showBuildSettings | grep "TARGET_BUILD_DIR"
   TARGET_BUILD_DIR = /Users/ryan/Library/Developer/Xcode/DerivedData/langserver-swift-gellhgzzpradfqbgjnbtkvzjqymv/Build/Products/Debug
```

Take note of this value it will be used later.

# VSCode (e.g., [vscode-swift](https://github.com/RLovelett/vscode-swift))

Open the directory containing the clone of the Visual Studio Code extension in Visual Studio Code.

```
% git clone https://github.com/RLovelett/vscode-swift.git
% code .
```

Start the TypeScript compiler or the build task (e.g., ⇧⌘B or Tasks: Run Build Task).

Now open `src/extension.ts` and provide the value of `TARGET_BUILD_DIR` for the debug executable. The change should be similar to the patch that follows.

```
diff --git a/src/extension.ts b/src/extension.ts
index b5ad751..7970ae1 100644
--- a/src/extension.ts
+++ b/src/extension.ts
@@ -13,7 +13,7 @@ export function activate(context: ExtensionContext) {
         .get("languageServerPath", "/usr/local/bin/LanguageServer");

     let run: Executable = { command: executableCommand };
-    let debug: Executable = run;
+    let debug: Executable = { command: "${TARGET_BUILD_DIR}/LanguageServer" };
     let serverOptions: ServerOptions = {
         run: run,
         debug: debug
```

**NOTE:** Make sure the `${TARGET_BUILD_DIR}` is populated with the value you generated in the Xcode section. It is not an environment variable so that will not be evaluated.

Once this is complete you should be able to open the VSCode debugger and and select `Launch Extension`. This should start both the language server (Xcode/Swift) and the extension (VScode/TypeScript) in debug mode.

# Caveats

1. As noted above you might not be able to capture all the commands upon the language server initially starting up. The current hypothesis is that it takes a little bit of time for LLDB (the Swift debugger) to actually attach to the running process so a few instructions are missed.

One recommendation is to put a break-point in [`handle.swift`](https://github.com/RLovelett/langserver-swift/blob/251641da96ac1e0ae90f0ead3aa2f210fcb2c599/Sources/LanguageServer/Functions/handle.swift#L17) as this is likely where the server is getting into to trouble.

2. Messages are logged to the `Console.app` using the `me.lovelett.langserver-swift` sub-system. One place to look the raw language server JSON-RPC messages is there.

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
