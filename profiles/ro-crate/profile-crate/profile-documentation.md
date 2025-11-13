---
title: RO-Crate 1.1 Core Profile
---

This document in an experimental SoSS+ profile for RO-Crate 1.1 - for the core, mandated metadata only


A conformant RO-Crate:

- MUST be of type(s): http://schema.org/Dataset
- MUST include the following properties:
  * name
  * description
  * datePublished
  * license


## Defined Term Sets



## Classes and Properties

### <a id="_RO_Crate_Metadata_Descriptor"></a>RO-Crate Metadadata Descriptor



Specialization of: http://schema.org/CreativeWork

| Property | Required | Description | Range | Value |
| -------- | -------- | ----------- | ----- | ----- |
| <a id="_RO_Crate_Metadata_Descriptor_unnamed_yfy8l"></a>@id | Yes | The RO-Crate Metadata  | [Root Data Entity](#_Root_Data_Entity) | ro-crate-metadata.json |
| <a id="_RO_Crate_Metadata_Descriptor_unnamed_rcdvc"></a>about[?](http://schema.org/about) | Yes | This property on the RO-Crate Metadata Descriptor references the Root Data Entity. I a SoSS+ profile there may be Schemas present for more than one 'flavour' of Root Data Enitty with different @type arrays or `@conformsTo` references (or other specializations). In this example there is a single reference. | [Root Data Entity](#_Root_Data_Entity) |  |

### <a id="_Root_Data_Entity"></a>Root Data Entity

The Root Data Entity for an RO-Crate. This is the main entity of the RO-Crate and is the one that is referenced by the RO-Crate Metadata Descriptor.

Specialization of: http://schema.org/Dataset

| Property | Required | Description | Range | Value |
| -------- | -------- | ----------- | ----- | ----- |
| <a id="_Root_Data_Entity_unnamed_k49mm"></a>datePublished[?](http://schema.org/datePubished) | Yes | MUST be a string in ISO 8601 date format and SHOULD be specified to at least the precision of a day, MAY be a timestamp down to the millisecond. | schema:Date |  |
| <a id="_Root_Data_Entity_unnamed_tvs8t"></a>description[?](http://schema.org/description) | Yes | (In addition to the name) SHOULD further elaborate on the name to provide a summary of the context in which the dataset is important. | Text |  |
| <a id="_Root_Data_Entity_unnamed_avkjz"></a>license[?](http://schema.org/license) | Yes | SHOULD link to a Contextual Entity in the RO-Crate Metadata File with a name and description. MAY have a URI (eg for Creative Commons or Open Source licenses). MAY if necessary be a textual description of how the RO-Crate may be used | #class_CreativeWork, schema:URL, schema:Text |  |
| <a id="_Root_Data_Entity_unnamed_2mlms"></a>name[?](http://schema.org/name) | Yes | SHOULD identify the dataset to humans well enough to disambiguate it from other RO-Crates | Text |  |



## Provenance

This document was compiled using [generate-soss-docs.js](https://github.com/Language-Research-Technology/ro-crate-schema-tools/blob/sossplus/generate-soss-docs.js), based on [profiles/ro-crate/profile-text.md](https://github.com/Language-Research-Technology/ro-crate-schema-tools/blob/sossplus/profiles/ro-crate/profile-text.md) using a SoSS+ Schema defined in [profiles/ro-crate/profile-crate/ro-crate-metadata.json](https://github.com/Language-Research-Technology/ro-crate-schema-tools/blob/sossplus/profiles/ro-crate/profile-crate/ro-crate-metadata.json).
