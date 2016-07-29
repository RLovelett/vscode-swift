import { SymbolKind, CompletionItemKind,
} from 'vscode-languageserver';

/**
 *  Bindings for SourceKit type definitions
 */
export declare namespace Swift {

    let Keyword: 'source.lang.swift.keyword';
    let DeclAssociatedtype: 'source.lang.swift.decl.associatedtype';
    let DeclClass: 'source.lang.swift.decl.class';
    let DeclEnum: 'source.lang.swift.decl.enum';
    let DeclEnumelement: 'source.lang.swift.decl.enumelement';
    let DeclGenericTypeParam: 'source.lang.swift.decl.generic_type_param';
    let DeclProtocol: 'source.lang.swift.decl.protocol';

    let DeclStruct: 'source.lang.swift.decl.struct';
    let DeclTypealias: 'source.lang.swift.decl.typealias';
    let DeclModule: 'source.lang.swift.decl.module';
    let DeclExtensionClass: 'source.lang.swift.decl.extension.class';
    let DeclFunctionConstructor: 'source.lang.swift.decl.function.constructor';
    let DeclFunctionFree: 'source.lang.swift.decl.function.free';
    let DeclFunctionSubscript: 'source.lang.swift.decl.function.subscript';

    let DeclFunctionOperatorInfix: 'source.lang.swift.decl.function.operator.infix';

    let DeclFunctionAccessorGetter: 'source.lang.swift.decl.function.accessor.getter';
    let DeclFunctionAccessorSetter: 'source.lang.swift.decl.function.accessor.setter';

    let DeclFunctionMethodClass: 'source.lang.swift.decl.function.method.class';
    let DeclFunctionMethodInstance: 'source.lang.swift.decl.function.method.instance';
    let DeclFunctionMethodStatic: 'source.lang.swift.decl.function.method.static';

    let DeclVarGlobal: 'source.lang.swift.decl.var.global';
    let DeclVarInstance: 'source.lang.swift.decl.var.instance';
    let DeclVarLocal: 'source.lang.swift.decl.var.local';

    let RefAssociatedtype: 'source.lang.swift.ref.associatedtype';
    let RefClass: 'source.lang.swift.ref.class';
    let RefEnum: 'source.lang.swift.ref.enum';
    let RefEnumelement: 'source.lang.swift.ref.enumelement';
    let RefGenericTypeParam: 'source.lang.swift.ref.generic_type_param';
    let RefProtocol: 'source.lang.swift.ref.protocol';
    let RefStruct: 'source.lang.swift.ref.struct';
    let RefTypealias: 'source.lang.swift.ref.typealias';

    let RefFunctionConstructor: 'source.lang.swift.ref.function.constructor';
    let RefFunctionFree: 'source.lang.swift.ref.function.free';
    let RefFunctionSubscript: 'source.lang.swift.ref.function.subscript';

    let RefFunctionMethodClass: 'source.lang.swift.ref.function.method.class';
    let RefFunctionMethodInstance: 'source.lang.swift.ref.function.method.instance';

    let RefFunctionOperatorInfix: 'source.lang.swift.ref.function.operator.infix';

    let RefVarGlobal: 'source.lang.swift.ref.var.global';
    let RefVarInstance: 'source.lang.swift.ref.var.instance';
    let RefVarLocal: 'source.lang.swift.ref.var.local';

    let SyntaxtypeArgument: 'source.lang.swift.syntaxtype.argument';
    let SyntaxtypeComment: 'source.lang.swift.syntaxtype.comment';
    let SyntaxtypeIdentifier: 'source.lang.swift.syntaxtype.identifier';
    let SyntaxtypeKeyword: 'source.lang.swift.syntaxtype.keyword';
    let SyntaxtypeNumber: 'source.lang.swift.syntaxtype.number';
    let SyntaxtypeParameter: 'source.lang.swift.syntaxtype.parameter';

    let SyntaxtypeAttributeBuiltin: 'source.lang.swift.syntaxtype.attribute.builtin';
}

export namespace Swift {

    /**
     * Maps SourceKit types to VSCode {SymbolKind}
     * FIXME: kinda limted
     *
     * @export
     * @param {SwiftType} swiftType
     * @returns {SymbolKind}
     */
    export function symbolKindForSwiftType(swiftType: String): SymbolKind {
        // not really easy to have an obvious completion kind per type.

        switch (swiftType) {
            // high confidence
            case Swift.DeclModule:
                return SymbolKind.Module;
            case Swift.DeclEnum:
            case Swift.DeclEnumelement:
            case Swift.RefEnum:
            case Swift.RefEnumelement:
                return SymbolKind.Enum;
            // medium confidence
            case Swift.DeclFunctionFree:
            case Swift.DeclFunctionSubscript:
            case Swift.DeclFunctionOperatorInfix:
            case Swift.RefFunctionFree:
            case Swift.RefFunctionSubscript:
            case Swift.RefFunctionOperatorInfix:
                return SymbolKind.Function;
            case Swift.DeclFunctionMethodClass:
            case Swift.DeclFunctionMethodStatic:
            case Swift.DeclFunctionMethodInstance:
                return SymbolKind.Method;
            case Swift.DeclFunctionConstructor:
            case Swift.RefFunctionConstructor:
                return SymbolKind.Constructor;
            case Swift.DeclFunctionAccessorGetter:
            case Swift.DeclFunctionAccessorSetter:
                return SymbolKind.Field;
            case Swift.DeclAssociatedtype:
            case Swift.DeclClass:
            case Swift.DeclStruct:
            case Swift.DeclExtensionClass:
            case Swift.RefClass:
            case Swift.RefStruct:
                return SymbolKind.Class;
            case Swift.RefFunctionMethodClass:
            case Swift.RefFunctionMethodInstance:
                return SymbolKind.Method;
            // low confidence
            case Swift.DeclVarGlobal:
            case Swift.DeclVarInstance:
            case Swift.DeclVarLocal:
            case Swift.RefVarGlobal:
            case Swift.RefVarInstance:
            case Swift.RefVarLocal:
                return SymbolKind.Variable;
            case Swift.SyntaxtypeArgument:
            case Swift.SyntaxtypeParameter:
                return SymbolKind.Field;
            case Swift.RefAssociatedtype:
            case Swift.DeclGenericTypeParam:
            case Swift.RefGenericTypeParam:
            case Swift.RefProtocol:
            case Swift.RefTypealias:
            case Swift.DeclProtocol:
            case Swift.DeclTypealias:
                return SymbolKind.Interface;

            // no super applicable types for these:
            case Swift.Keyword:
            case Swift.SyntaxtypeKeyword:
            case Swift.SyntaxtypeAttributeBuiltin:
            case Swift.SyntaxtypeComment:
            case Swift.SyntaxtypeIdentifier:
            case Swift.SyntaxtypeNumber:
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
    export function completionKindForSwiftType(swiftType: String): CompletionItemKind {
        // not really easy to have an obvious completion kind per type.
        switch (swiftType) {
            // high confidence
            case Swift.DeclModule:
                return CompletionItemKind.Module;
            case Swift.Keyword:
            case Swift.SyntaxtypeKeyword:
                return CompletionItemKind.Keyword;
            case Swift.SyntaxtypeAttributeBuiltin:
                return CompletionItemKind.Text;
            case Swift.DeclEnum:
            case Swift.DeclEnumelement:
            case Swift.RefEnum:
            case Swift.RefEnumelement:
                return CompletionItemKind.Enum;
            // medium confidence
            case Swift.DeclFunctionFree:
            case Swift.DeclFunctionSubscript:
            case Swift.DeclFunctionOperatorInfix:
            case Swift.RefFunctionFree:
            case Swift.RefFunctionSubscript:
            case Swift.RefFunctionOperatorInfix:
                return CompletionItemKind.Function;
            case Swift.DeclFunctionMethodClass:
            case Swift.DeclFunctionMethodStatic:
            case Swift.DeclFunctionMethodInstance:
                return CompletionItemKind.Method;
            case Swift.DeclFunctionConstructor:
            case Swift.RefFunctionConstructor:
                return CompletionItemKind.Constructor;
            case Swift.DeclFunctionAccessorGetter:
            case Swift.DeclFunctionAccessorSetter:
                return CompletionItemKind.Field;
            case Swift.DeclAssociatedtype:
            case Swift.DeclClass:
            case Swift.DeclStruct:
            case Swift.DeclExtensionClass:
            case Swift.RefClass:
            case Swift.RefStruct:
                return CompletionItemKind.Class;
            case Swift.RefFunctionMethodClass:
            case Swift.RefFunctionMethodInstance:
                return CompletionItemKind.Method;
            // low confidence
            case Swift.DeclVarGlobal:
            case Swift.DeclVarInstance:
            case Swift.DeclVarLocal:
            case Swift.RefVarGlobal:
            case Swift.RefVarInstance:
            case Swift.RefVarLocal:
                return CompletionItemKind.Variable;
            case Swift.SyntaxtypeArgument:
            case Swift.SyntaxtypeParameter:
                return CompletionItemKind.Field;
            case Swift.RefAssociatedtype:
            case Swift.DeclGenericTypeParam:
            case Swift.RefGenericTypeParam:
            case Swift.RefProtocol:
            case Swift.RefTypealias:
            case Swift.DeclProtocol:
            case Swift.DeclTypealias:
                return CompletionItemKind.Reference;
            case Swift.SyntaxtypeComment:
                return CompletionItemKind.Text;
            case Swift.SyntaxtypeIdentifier:
                return CompletionItemKind.Keyword;
            case Swift.SyntaxtypeNumber:
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
    kind: string,
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