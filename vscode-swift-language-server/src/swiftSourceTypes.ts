import 	{ SymbolKind, CompletionItemKind,
} from 'vscode-languageserver';

/**
 *  Bindings for SourceKit type definitions
 */
export enum Swift {
    Keyword, 'source.lang.swift.keyword',
};
export enum Decl {
    Associatedtype, 'source.lang.swift.decl.associatedtype',
    Class, 'source.lang.swift.decl.class',
    Enum, 'source.lang.swift.decl.enum',
    Enumelement, 'source.lang.swift.decl.enumelement',
    GenericTypeParam, 'source.lang.swift.decl.generic_type_param',
    Protocol, 'source.lang.swift.decl.protocol',
    Struct, 'source.lang.swift.decl.struct',
    Typealias, 'source.lang.swift.decl.typealias',
    Module, 'source.lang.swift.decl.module',
};
export enum DeclExtension {
    Class, 'source.lang.swift.decl.extension.class',
};
export enum DeclFunction {
    Constructor, 'source.lang.swift.decl.function.constructor',
    Free, 'source.lang.swift.decl.function.free',
    Subscript, 'source.lang.swift.decl.function.subscript',
};
export enum DeclFunctionOperator {
    Infix, 'source.lang.swift.decl.function.operator.infix',
};
export enum DeclFunctionAccessor {
    Getter, 'source.lang.swift.decl.function.accessor.getter',
    Setter, 'source.lang.swift.decl.function.accessor.setter',
};
export enum DeclFunctionMethod {
    Class, 'source.lang.swift.decl.function.method.class',
    Instance, 'source.lang.swift.decl.function.method.instance',
    Static, 'source.lang.swift.decl.function.method.static',
};
export enum DeclVar {
    Global, 'source.lang.swift.decl.var.global',
    Instance, 'source.lang.swift.decl.var.instance',
    Local, 'source.lang.swift.decl.var.local',
};
export enum Ref {
    Associatedtype, 'source.lang.swift.ref.associatedtype',
    Class, 'source.lang.swift.ref.class',
    Enum, 'source.lang.swift.ref.enum',
    Enumelement, 'source.lang.swift.ref.enumelement',
    GenericTypeParam, 'source.lang.swift.ref.generic_type_param',
    Protocol, 'source.lang.swift.ref.protocol',
    Struct, 'source.lang.swift.ref.struct',
    Typealias, 'source.lang.swift.ref.typealias',
};
export enum RefFunction {
    Constructor, 'source.lang.swift.ref.function.constructor',
    Free, 'source.lang.swift.ref.function.free',
    Subscript, 'source.lang.swift.ref.function.subscript',
};
export enum RefFunctionMethod {
    Class, 'source.lang.swift.ref.function.method.class',
    Instance, 'source.lang.swift.ref.function.method.instance',
};
export enum RefFunctionOperator {
    Infix, 'source.lang.swift.ref.function.operator.infix'
};
export enum RefVar {
    Global, 'source.lang.swift.ref.var.global',
    Instance, 'source.lang.swift.ref.var.instance',
    Local, 'source.lang.swift.ref.var.local',
};
export enum Syntaxtype {
    Argument, 'source.lang.swift.syntaxtype.argument',
    Comment, 'source.lang.swift.syntaxtype.comment',
    Identifier, 'source.lang.swift.syntaxtype.identifier',
    Keyword, 'source.lang.swift.syntaxtype.keyword',
    Number, 'source.lang.swift.syntaxtype.number',
    Parameter, 'source.lang.swift.syntaxtype.parameter',
};
export enum SyntaxtypeAttribute {
    Builtin, 'source.lang.swift.syntaxtype.attribute.builtin',
};

export type SwiftType =
    Swift |
    Decl |
    DeclExtension |
    DeclFunction |
    DeclFunctionOperator |
    DeclFunctionAccessor |
    DeclFunctionMethod |
    DeclVar |
    Ref |
    RefFunction |
    RefFunctionMethod |
    RefFunctionOperator |
    RefVar |
    Syntaxtype |
    SyntaxtypeAttribute;

/**
 * Maps SourceKit types to VSCode {SymbolKind}
 * FIXME: kinda limted
 *
 * @export
 * @param {SwiftType} swiftType
 * @returns {SymbolKind}
 */
export function symbolKindForSwiftType(swiftType: SwiftType): SymbolKind {
    // not really easy to have an obvious completion kind per type.
    switch (swiftType) {
// high confidence
        case Decl.Module:
            return SymbolKind.Module;
        case Decl.Enum:
        case Decl.Enumelement:
        case Ref.Enum:
        case Ref.Enumelement:
            return SymbolKind.Enum;
// medium confidence
        case DeclFunction.Free:
        case DeclFunction.Subscript:
        case DeclFunctionOperator.Infix:
        case RefFunction.Free:
        case RefFunction.Subscript:
        case RefFunctionOperator.Infix:
            return SymbolKind.Function;
        case DeclFunctionMethod.Class:
        case DeclFunctionMethod.Static:
        case DeclFunctionMethod.Instance:
            return SymbolKind.Method;
        case DeclFunction.Constructor:
        case RefFunction.Constructor:
            return SymbolKind.Constructor;
        case DeclFunctionAccessor.Getter:
        case DeclFunctionAccessor.Setter:
            return SymbolKind.Field;
        case Decl.Associatedtype:
        case Decl.Class:
        case Decl.Struct:
        case DeclExtension.Class:
        case Ref.Class:
        case Ref.Struct:
            return SymbolKind.Class;
        case RefFunctionMethod.Class:
        case RefFunctionMethod.Instance:
            return SymbolKind.Method;
// low confidence
        case DeclVar.Global:
        case DeclVar.Instance:
        case DeclVar.Local:
        case RefVar.Global:
        case RefVar.Instance:
        case RefVar.Local:
            return SymbolKind.Variable;
        case Syntaxtype.Argument:
        case Syntaxtype.Parameter:
            return SymbolKind.Field;
        case Ref.Associatedtype:
        case Decl.GenericTypeParam:
        case Ref.GenericTypeParam:
        case Ref.Protocol:
        case Ref.Typealias:
        case Decl.Protocol:
        case Decl.Typealias:
            return SymbolKind.Interface;

// no super applicable types for these:
        case Swift.Keyword:
        case Syntaxtype.Keyword:
        case SyntaxtypeAttribute.Builtin:
        case Syntaxtype.Comment:
        case Syntaxtype.Identifier:
        case Syntaxtype.Number:
            console.log("no match for " + swiftType);
    };
    return SymbolKind.Variable;
};

/**
 * Maps SourceKit types to VSCode {CompletionItemKind}
 * FIXME: kinda limted
 *
 * @export
 * @param {SwiftType} swiftType
 * @returns {CompletionItemKind}
 */
export function completionKindForSwiftType(swiftType: SwiftType): CompletionItemKind {
    // not really easy to have an obvious completion kind per type.
    switch (swiftType) {
// high confidence
        case Decl.Module:
            return CompletionItemKind.Module;
        case Swift.Keyword:
        case Syntaxtype.Keyword:
            return CompletionItemKind.Keyword;
        case SyntaxtypeAttribute.Builtin:
            return CompletionItemKind.Text;
        case Decl.Enum:
        case Decl.Enumelement:
        case Ref.Enum:
        case Ref.Enumelement:
            return CompletionItemKind.Enum;
// medium confidence
        case DeclFunction.Free:
        case DeclFunction.Subscript:
        case DeclFunctionOperator.Infix:
        case RefFunction.Free:
        case RefFunction.Subscript:
        case RefFunctionOperator.Infix:
            return CompletionItemKind.Function;
        case DeclFunctionMethod.Class:
        case DeclFunctionMethod.Static:
        case DeclFunctionMethod.Instance:
            return CompletionItemKind.Method;
        case DeclFunction.Constructor:
        case RefFunction.Constructor:
            return CompletionItemKind.Constructor;
        case DeclFunctionAccessor.Getter:
        case DeclFunctionAccessor.Setter:
            return CompletionItemKind.Field;
        case Decl.Associatedtype:
        case Decl.Class:
        case Decl.Struct:
        case DeclExtension.Class:
        case Ref.Class:
        case Ref.Struct:
            return CompletionItemKind.Class;
        case RefFunctionMethod.Class:
        case RefFunctionMethod.Instance:
            return CompletionItemKind.Method;
// low confidence
        case DeclVar.Global:
        case DeclVar.Instance:
        case DeclVar.Local:
        case RefVar.Global:
        case RefVar.Instance:
        case RefVar.Local:
            return CompletionItemKind.Variable;
        case Syntaxtype.Argument:
        case Syntaxtype.Parameter:
            return CompletionItemKind.Field;
        case Ref.Associatedtype:
        case Decl.GenericTypeParam:
        case Ref.GenericTypeParam:
        case Ref.Protocol:
        case Ref.Typealias:
        case Decl.Protocol:
        case Decl.Typealias:
            return CompletionItemKind.Reference;
        case Syntaxtype.Comment:
            return CompletionItemKind.Text;
        case Syntaxtype.Identifier:
            return CompletionItemKind.Keyword;
        case Syntaxtype.Number:
            return CompletionItemKind.Value;

    };
    return CompletionItemKind.Variable;
};

/**
 *
 * Wrapper around sourcekitten output items.
 * @export
 * @interface SwiftCompletionSuggestion
 */
export interface SwiftCompletionSuggestion {
	/**
	 * @type {string}
	 */
	name: string,
	/**
	 * @type {string}
	 */
	descriptionKey: string,
	/**
	 * @type {string}
	 */
	sourcetext: string,
	/**
	 * @type {SwiftType}
	 */
	kind: SwiftType,
	/**
	 * @type {string}
	 */
	typeName: string,
	/**
	 * @type {string}
	 */
	moduleName: string,
	/**
	 * @type {string}
	 */
	associatedUSRs: string,
	/**
	 * @type {string}
	 */
	context: string,
	/**
	 * @type {string}
	 */
	docBrief: string,
};