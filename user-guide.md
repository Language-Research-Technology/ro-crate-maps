# User Guide for Schema Creation

This is a user guide for creating new schemas within `ro-crate-masp`. It uses a template directory as its basis.

## Copy template directory

Make a copy of the `profiles/template/` directory and save this under `profiles/` as well.
```
profiles/template
├── schema-crate
│   ├── ro-crate-metadata.json
│   └── schema-documentation.md
└── schema-text.md
```
Rename `template` to a descriptor for your schema.

## Update ro-crate-metadata.json

TODO

### @context

The RO-Crate Context requires `"https://w3id.org/ro/crate/1.2/context"`. The `@vocab` section indicates that the terms without prefixes used throughout the schema (`name`, `description`, `domainIncludes`, etc.) are from Schema.org (e.g. http://schema.org/name).

```
"@context": [
  "https://w3id.org/ro/crate/1.2/context",
  {
    "@vocab": "http://schema.org/"
  }
],
```

### @graph

The graph array contains the rest of the entities in the schema that are added as `{}` objects.

```
"@graph": [
  {
    "@id": "./",
    "@type": "Dataset",
    "name": "Template RO-Crate Schema",
    "description": "This is a template for an RO-Crate schema.",
    "author": {
      "@id": "#author"
    },
    "license": "GPL-3.0",
    "conformsTo": {
      "@id": "https://github.com/Language-Research-Technology/ro-crate-schema-tools/blob/main/profiles/sossplus-profile.md"
    },
    "hasResource": [
      {
        "@id": "#hasSpecializedSchema"
      }
    ],
    "hasPart": {
      "@id": "schema-documentation.md"
    }
  },
```

TODO
```
{
  "@id": "#author",
  "@type": "Organization",
  "name": "University of Queensland"
},
```
TODO
```
{
  "@id": "#hasSpecializedSchema",
  "@type": "ResourceDescriptor",
  "name": "Specialized Schema Terms",
  "hasRole": {
    "@id": "http://www.w3.org/ns/dx/prof/role/schema"
  },
  "hasPart": [
    {
      "@id": "template:ClassExample"
    },
    {
      "@id": "template:propertyExample"
    }
  ]
},
```
TODO
An example of the class and property formats are included. The `template` prefixes should be updated to your schema descriptor.
```
{
  "@id": "template:ClassExample",
  "@type": "rdfs:Class",
  "rdfs:label": "ClassExample",
  "rdfs:comment": "This is an example of a class and its format."
},
{
  "@id": "template:propertyExample",
  "@type": "rdf:Property",
  "rdfs:label": "propertyExample",
  "rdfs:comment": "This is an example of a property and its format.",
  "domainIncludes": {
    "@id": "template:ClassExample"
  },
  "rangeIncludes": {
    "@id": "schema:Text"
  }
}
```

## Update schema-text.md

The `schema-text.md` file allows you to provide more context and description of the schema, as well as defining the sections that will be populated in the output `schema-documentation.md` file. At a minimum, it should include a brief description of the schema, the material it is based on, and `${rules.all}`.

Complete list of the rules available to populate the document:
 - `${rules.all}`: Generate documentation for each Class and their expected Properties. This option will also create an _All Properties_ section with a summary of each property in the schema.
 - `${rules.allDefinedTermSets}`: Generate documentation for each entity with the type [DefinedTermSet](https://schema.org/DefinedTermSet).
 - `${rules.allItemLists}`: Generate documentation for each entity with the type [ItemList](https://schema.org/ItemList).

## Update package.json

Add a row for your schema in the `"scripts"` section of `package.json`, updating the `template` sections with your schema descriptor:
```
"build:template-schema": "node generate-soss-docs.js profiles/template/schema-crate/ro-crate-metadata.json profiles/template/schema-text.md profiles/template/schema-crate/schema-documentation.md",
```

## Generate documentation

To update the `schema-documentation.md` file, run the following command, replacing `template` with your schema descriptor:
```
npm run build:template-schema
```