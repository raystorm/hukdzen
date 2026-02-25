/**
 * Adds input/output type metadata to a GraphQL query string.
 * This is a pure type cast — it does not validate or modify the query.
 */
export type GeneratedQuery<InputType, OutputType> = string & {
   __generatedQueryInput: InputType;
   __generatedQueryOutput: OutputType;
};
