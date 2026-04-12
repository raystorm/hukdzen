# **Amplify Backend Development Guide**

This guide explains **how to safely extend the Amplify backend**, following the project's domain‑oriented architecture and the constraints of Amplify Gen2's build order.  
It encodes the invariants that keep the backend stable, predictable, and maintainable.

**For architectural reference on what domains exist, see [Domain Reference Guide](../domains.md).**

---

# **1. Core Principles**

## **1.1 Domain Ownership**
A **domain** is a top‑level folder under `amplify/` that owns a single AWS resource category and its configuration.

**Note:** For domain types and current domain inventory, see [Domain Reference Guide](../domains.md).

Each domain contains:

- `resource.ts` — the resource definition
- `backend.ts` — configuration (IAM, env vars, policies)
- `monitoring.ts` — optional alarms

This keeps boundaries clear, logic discoverable, and configuration close to the resource it affects.

---

## **1.2 Purity of the Data Backend**
The Data backend is synthesized **before** any other resources exist.  
During this phase:

- schema is loaded  
- tables are generated  
- resolvers are created  
- **no other resources (except Auth) exist yet**

Therefore, `amplify/data/resource.ts` must remain pure:

- schema only
- optional custom resolvers
- **no wiring**
- **no Lambda references**
- **no IAM**
- **no environment variables**

This purity is required by Amplify's build order
and ensures the GraphQL API remains stable and predictable.

---

## **1.3 Lambda Self‑Containment**
Lambdas are **self‑contained, portable, and independently runnable**.  
Each Lambda defines:

- its own data source
- its own IAM policies
- its own environment variables
- its own configuration
- its own monitoring (optional)  
- its own runtime code  
- its own tests  

Nothing outside the Lambda folder wires or configures it.  
This keeps Lambdas independent, testable, replaceable, and free of cross‑domain coupling.

---

# **2. Amplify Build Order (Foundational)**

Amplify Gen2 is **not** a dependency graph.  
It is a **build‑order pipeline**.

Understanding this ordering explains *why* the rules above exist.

Amplify builds in this sequence:

### **2.1 Data Backend (GraphQL API)**
- Schema is loaded
- Tables are generated
- Resolvers are created
- **No other resources (except Auth) exist yet**

### **2.2 Functions (Lambdas)**
- Lambdas are synthesized
- IAM roles are created
- Environment variables are attached
- Lambda data sources are defined

### **2.3 Root Backend (Wiring)**
- Relationships are wired
- Resolvers are attached to Lambdas
- Permissions are finalized

This ordering creates the following invariants:

- **Resolvers cannot be wired inside `amplify/data`**
- **Lambdas must define their own data sources**
- **Resolver wiring must happen in `amplify/backend.ts`**
- **The Data backend must remain pure**

This is the "physics" of Amplify.  
Everything else in this guide follows from these constraints.

---

# **3. Lambdas (Layout + How to Add One)**

**For Lambda domain types and current Lambda inventory, see [Lambda Domains](../domains/lambda-domains.md).**

A Lambda lives under:

```
amplify/functions/<name>/
```

or, for data‑scoped Lambdas:

```
amplify/functions/data/<name>/
```

Each Lambda is **self‑contained** and structured as:

```text
infra/
  resource.ts      ← Lambda definition
  backend.ts       ← Lambda configuration (IAM, env vars, data sources)
  monitoring.ts    ← Optional alarms and resource monitoring

src/
  <functionName>.ts ← Lambda runtime code
  __tests__/...    ← Unit tests

tsconfig.json
package.json
jest.config.js
```

### **Meaning of the structure**

- **infra/** owns everything required for the Lambda to *exist*  
  - definition  
  - IAM  
  - environment  
  - data sources  
  - monitoring  
  - configuration  

- **src/** owns everything required for the Lambda to *run*  
  - handler  
  - helpers  
  - tests  

This structure ensures each Lambda owns everything it needs to exist, run, and be monitored — without depending on other domains.

---

## **3.1 Create the Lambda**

```ts
// amplify/functions/myFunction/infra/resource.ts
import { defineFunction } from '@aws-amplify/backend';

export const myFunction = defineFunction({
  entry: '../src/<functionName>.ts',
});
```

---

## **3.2 Configure the Lambda**

This file:

- attaches IAM policies
- sets environment variables
- defines the Lambda's data source (if used by GraphQL)

```ts
// amplify/functions/myFunction/infra/backend.ts
export function configureMyFunction(backend) {
  const fn = backend.myFunction.resources.lambda;

  fn.addEnvironment('TABLE_NAME', backend.data.resources.tables.MyTable.tableName);
}
```

---

## **3.3 Register the Lambda in the root backend**

```ts
export const backend = defineBackend({
  myFunction,
  // ...
});
```

---

## **3.4 Wire the resolver (if GraphQL)**

```ts
backend.data.addResolver('Query.getThing', backend.myFunction);
```

---

# **4. Adding a New GraphQL Model**

## **4.1 Update the schema**
`amplify/data/schema.graphql`

## **4.2 Regenerate the client (frontend)**
`npm run codegen`

## **4.3 Add resolvers (if needed)**
`amplify/data/resolvers/`

## **4.4 Wire resolvers in the root backend**
Never inside `amplify/data`.

---

# **5. Adding a New Domain**

A domain is a folder under `amplify/` with:

- `resource.ts`
- `backend.ts`
- `monitoring.ts` (optional)

Follow the same pattern as existing domains.

---

# **6. Naming Conventions**

- Domain folders: lowercase (`auth`, `data`, `storage`, `search`)
- Lambda folders: **camelCase** (`boxUserHydrator`)
- Resource exports: camelCase (`boxUserHydrator`)
- Monitoring files: `monitoring.ts`
- Configuration files: `backend.ts`

---

# **7. Checklist for Adding Anything**

- Add resource
- Add configuration
- Add monitoring (optional)
- Register in root backend
- Wire resolvers (if needed)
- Deploy sandbox
- Update frontend (if GraphQL)
- Commit

---

# **8. Common Pitfalls**

- Wiring resolvers inside `amplify/data`
- Forgetting to register a resource in `backend.ts`
- Referencing `backend.<domain>` after flattening
- Adding IAM policies in the wrong file

---

# **9. Philosophy**

This backend is designed to be:

- intention‑revealing
- domain‑oriented
- stable under change
- explicit about boundaries
- honest about Amplify's constraints
- **transparent**
- **discoverable**

Every rule in this guide exists to protect those values.

---

# **10. See Also**

- [Domain Reference Guide](../domains.md) - What domains exist and their types
- [Lambda Domains](../domains/lambda-domains.md) - Lambda domain types and inventory
- [Backend Domains](../domains/backend-domains.md) - Backend domain types and inventory
- [Architecture Overview](../architecture.md) - Full system architecture

---
