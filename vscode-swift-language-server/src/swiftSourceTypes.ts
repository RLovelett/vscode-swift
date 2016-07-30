import { SymbolKind, CompletionItemKind,
} from 'vscode-languageserver';

/**
 *  Bindings for SourceKit type definitions
 */
export enum SwiftType {

    Keyword = <any>'source.lang.swift.keyword',
    DeclAssociatedtype = <any>'source.lang.swift.decl.associatedtype',
    DeclClass = <any>'source.lang.swift.decl.class',
    DeclEnum = <any>'source.lang.swift.decl.enum',
    DeclEnumelement = <any>'source.lang.swift.decl.enumelement',
    DeclGenericTypeParam = <any>'source.lang.swift.decl.generic_type_param',
    DeclProtocol = <any>'source.lang.swift.decl.protocol',

    DeclStruct = <any>'source.lang.swift.decl.struct',
    DeclTypealias = <any>'source.lang.swift.decl.typealias',
    DeclModule = <any>'source.lang.swift.decl.module',
    DeclExtensionClass = <any>'source.lang.swift.decl.extension.class',
    DeclFunctionConstructor = <any>'source.lang.swift.decl.function.constructor',
    DeclFunctionFree = <any>'source.lang.swift.decl.function.free',
    DeclFunctionSubscript = <any>'source.lang.swift.decl.function.subscript',

    DeclFunctionOperatorInfix = <any>'source.lang.swift.decl.function.operator.infix',

    DeclFunctionAccessorGetter = <any>'source.lang.swift.decl.function.accessor.getter',
    DeclFunctionAccessorSetter = <any>'source.lang.swift.decl.function.accessor.setter',

    DeclFunctionMethodClass = <any>'source.lang.swift.decl.function.method.class',
    DeclFunctionMethodInstance = <any>'source.lang.swift.decl.function.method.instance',
    DeclFunctionMethodStatic = <any>'source.lang.swift.decl.function.method.static',

    DeclVarGlobal = <any>'source.lang.swift.decl.var.global',
    DeclVarInstance = <any>'source.lang.swift.decl.var.instance',
    DeclVarLocal = <any>'source.lang.swift.decl.var.local',

    RefAssociatedtype = <any>'source.lang.swift.ref.associatedtype',
    RefClass = <any>'source.lang.swift.ref.class',
    RefEnum = <any>'source.lang.swift.ref.enum',
    RefEnumelement = <any>'source.lang.swift.ref.enumelement',
    RefGenericTypeParam = <any>'source.lang.swift.ref.generic_type_param',
    RefProtocol = <any>'source.lang.swift.ref.protocol',
    RefStruct = <any>'source.lang.swift.ref.struct',
    RefTypealias = <any>'source.lang.swift.ref.typealias',

    RefFunctionConstructor = <any>'source.lang.swift.ref.function.constructor',
    RefFunctionFree = <any>'source.lang.swift.ref.function.free',
    RefFunctionSubscript = <any>'source.lang.swift.ref.function.subscript',

    RefFunctionMethodClass = <any>'source.lang.swift.ref.function.method.class',
    RefFunctionMethodInstance = <any>'source.lang.swift.ref.function.method.instance',

    RefFunctionOperatorInfix = <any>'source.lang.swift.ref.function.operator.infix',

    RefVarGlobal = <any>'source.lang.swift.ref.var.global',
    RefVarInstance = <any>'source.lang.swift.ref.var.instance',
    RefVarLocal = <any>'source.lang.swift.ref.var.local',

    SyntaxtypeArgument = <any>'source.lang.swift.syntaxtype.argument',
    SyntaxtypeComment = <any>'source.lang.swift.syntaxtype.comment',
    SyntaxtypeIdentifier = <any>'source.lang.swift.syntaxtype.identifier',
    SyntaxtypeKeyword = <any>'source.lang.swift.syntaxtype.keyword',
    SyntaxtypeNumber = <any>'source.lang.swift.syntaxtype.number',
    SyntaxtypeParameter = <any>'source.lang.swift.syntaxtype.parameter',

    SyntaxtypeAttributeBuiltin = <any>'source.lang.swift.syntaxtype.attribute.builtin',
}

export namespace SwiftType {

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
            case SwiftType.DeclModule:
                return SymbolKind.Module;
            case SwiftType.DeclEnum:
            case SwiftType.DeclEnumelement:
            case SwiftType.RefEnum:
            case SwiftType.RefEnumelement:
                return SymbolKind.Enum;
            // medium confidence
            case SwiftType.DeclFunctionFree:
            case SwiftType.DeclFunctionSubscript:
            case SwiftType.DeclFunctionOperatorInfix:
            case SwiftType.RefFunctionFree:
            case SwiftType.RefFunctionSubscript:
            case SwiftType.RefFunctionOperatorInfix:
                return SymbolKind.Function;
            case SwiftType.DeclFunctionMethodClass:
            case SwiftType.DeclFunctionMethodStatic:
            case SwiftType.DeclFunctionMethodInstance:
                return SymbolKind.Method;
            case SwiftType.DeclFunctionConstructor:
            case SwiftType.RefFunctionConstructor:
                return SymbolKind.Constructor;
            case SwiftType.DeclFunctionAccessorGetter:
            case SwiftType.DeclFunctionAccessorSetter:
                return SymbolKind.Field;
            case SwiftType.DeclAssociatedtype:
            case SwiftType.DeclClass:
            case SwiftType.DeclStruct:
            case SwiftType.DeclExtensionClass:
            case SwiftType.RefClass:
            case SwiftType.RefStruct:
                return SymbolKind.Class;
            case SwiftType.RefFunctionMethodClass:
            case SwiftType.RefFunctionMethodInstance:
                return SymbolKind.Method;
            // low confidence
            case SwiftType.DeclVarGlobal:
            case SwiftType.DeclVarInstance:
            case SwiftType.DeclVarLocal:
            case SwiftType.RefVarGlobal:
            case SwiftType.RefVarInstance:
            case SwiftType.RefVarLocal:
                return SymbolKind.Variable;
            case SwiftType.SyntaxtypeArgument:
            case SwiftType.SyntaxtypeParameter:
                return SymbolKind.Field;
            case SwiftType.RefAssociatedtype:
            case SwiftType.DeclGenericTypeParam:
            case SwiftType.RefGenericTypeParam:
            case SwiftType.RefProtocol:
            case SwiftType.RefTypealias:
            case SwiftType.DeclProtocol:
            case SwiftType.DeclTypealias:
                return SymbolKind.Interface;

            // no super applicable types for these:
            case SwiftType.Keyword:
            case SwiftType.SyntaxtypeKeyword:
            case SwiftType.SyntaxtypeAttributeBuiltin:
            case SwiftType.SyntaxtypeComment:
            case SwiftType.SyntaxtypeIdentifier:
            case SwiftType.SyntaxtypeNumber:
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
            case SwiftType.DeclModule:
                return CompletionItemKind.Module;
            case SwiftType.Keyword:
            case SwiftType.SyntaxtypeKeyword:
                return CompletionItemKind.Keyword;
            case SwiftType.SyntaxtypeAttributeBuiltin:
                return CompletionItemKind.Text;
            case SwiftType.DeclEnum:
            case SwiftType.DeclEnumelement:
            case SwiftType.RefEnum:
            case SwiftType.RefEnumelement:
                return CompletionItemKind.Enum;
            // medium confidence
            case SwiftType.DeclFunctionFree:
            case SwiftType.DeclFunctionSubscript:
            case SwiftType.DeclFunctionOperatorInfix:
            case SwiftType.RefFunctionFree:
            case SwiftType.RefFunctionSubscript:
            case SwiftType.RefFunctionOperatorInfix:
                return CompletionItemKind.Function;
            case SwiftType.DeclFunctionMethodClass:
            case SwiftType.DeclFunctionMethodStatic:
            case SwiftType.DeclFunctionMethodInstance:
                return CompletionItemKind.Method;
            case SwiftType.DeclFunctionConstructor:
            case SwiftType.RefFunctionConstructor:
                return CompletionItemKind.Constructor;
            case SwiftType.DeclFunctionAccessorGetter:
            case SwiftType.DeclFunctionAccessorSetter:
                return CompletionItemKind.Field;
            case SwiftType.DeclAssociatedtype:
            case SwiftType.DeclClass:
            case SwiftType.DeclStruct:
            case SwiftType.DeclExtensionClass:
            case SwiftType.RefClass:
            case SwiftType.RefStruct:
                return CompletionItemKind.Class;
            case SwiftType.RefFunctionMethodClass:
            case SwiftType.RefFunctionMethodInstance:
                return CompletionItemKind.Method;
            // low confidence
            case SwiftType.DeclVarGlobal:
            case SwiftType.DeclVarInstance:
            case SwiftType.DeclVarLocal:
            case SwiftType.RefVarGlobal:
            case SwiftType.RefVarInstance:
            case SwiftType.RefVarLocal:
                return CompletionItemKind.Variable;
            case SwiftType.SyntaxtypeArgument:
            case SwiftType.SyntaxtypeParameter:
                return CompletionItemKind.Field;
            case SwiftType.RefAssociatedtype:
            case SwiftType.DeclGenericTypeParam:
            case SwiftType.RefGenericTypeParam:
            case SwiftType.RefProtocol:
            case SwiftType.RefTypealias:
            case SwiftType.DeclProtocol:
            case SwiftType.DeclTypealias:
                return CompletionItemKind.Reference;
            case SwiftType.SyntaxtypeComment:
                return CompletionItemKind.Text;
            case SwiftType.SyntaxtypeIdentifier:
                return CompletionItemKind.Keyword;
            case SwiftType.SyntaxtypeNumber:
                return CompletionItemKind.Value;
            default:
                console.log("un registered type" + swiftType);

        };
        return CompletionItemKind.Variable;
    };
};
/**
 *
 * Wrapper around sourcekitten output items.
 * @export
 * @interface SwiftCompletionSuggestion
 * ```json
 * {
    "descriptionKey" : "sendfile(Int32, Int32, off_t, UnsafeMutablePointer<off_t>!, UnsafeMutablePointer<sf_hdtr>!, Int32)",
    "associatedUSRs" : "c:@F@sendfile",
    "kind" : "source.lang.swift.decl.function.free",
    "sourcetext" : "sendfile(<#T##Int32#>, <#T##Int32#>, <#T##off_t#>, <#T##UnsafeMutablePointer<off_t>!#>, <#T##UnsafeMutablePointer<sf_hdtr>!#>, <#T##Int32#>)",
    "context" : "source.codecompletion.context.othermodule",
    "typeName" : "Int32",
    "moduleName" : "Darwin.POSIX.sys.socket",
    "name" : "sendfile()"
    }
 * ```
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