---
title: RO-Crate 1.1 Core Profile
---

This document in an experimental RO-Crate Machine Actionable Profile for RO-Crate 1.1 - for the core, mandated metadata only. 



# The RO-Crate Root Data Entity





## Types of entities (specializations of Classes) and expected Properties


### <a id="class-ro-crate-metadadata-descriptor"></a> Class: RO-Crate Metadadata Descriptor



At least 1 instances of this type MUST be present in the crate.

 A maximum of 1 instances of this type  MAY be present in the crate.

| Min Count | Max Count |
| --------- | --------- |
| 1 | 1 |

| Property | Required | Description | Range | Value |
| -------- | -------- | ----------- | ----- | ----- |
| @type | Yes |  |  | http://schema.org/CreativeWork |
| <a href="#property-id">@id</a> | Yes | The RO-Crate Metadata  |  | ro-crate-metadata.json |
| <a href="#property-about-root-data-entity">about (Root Data Entity) <a href="#property-about-root-data-entity" target="_blank" rel="noopener">ⓘ</a></a> | Yes | This property on the RO-Crate Metadata Descriptor references the Root Data Entity. I a SoSS+ profile there may be Schemas present for more than one 'flavour' of Root Data Enitty with different @type arrays or `@conformsTo` references (or other specializations). In this example there is a single reference. | <a href="#class-root-data-entity">Root Data Entity</a> |  |


### <a id="class-root-data-entity"></a> Class: Root Data Entity

The Root Data Entity for an RO-Crate. This is the main entity of the RO-Crate and is the one that is referenced by the RO-Crate Metadata Descriptor.

Instances of this type SHOULD be present in the crate.

 A maximum of 1 instances of this type  MAY be present in the crate.

| Min Count | Max Count |
| --------- | --------- |
| 0 | 1 |

| Property | Required | Description | Range | Value |
| -------- | -------- | ----------- | ----- | ----- |
| @type | Yes |  |  | http://schema.org/Dataset |
| <a href="#property-datepublished">datePublished <a href="#property-datepublished" target="_blank" rel="noopener">ⓘ</a></a> | Yes | MUST be a string in ISO 8601 date format and SHOULD be specified to at least the precision of a day, MAY be a timestamp down to the millisecond. | schema:Date |  |
| <a href="#property-description">description <a href="#property-description" target="_blank" rel="noopener">ⓘ</a></a> | Yes | (In addition to the name) SHOULD further elaborate on the name to provide a summary of the context in which the dataset is important. | Text |  |
| <a href="#property-license">license <a href="#property-license" target="_blank" rel="noopener">ⓘ</a></a> | Yes | SHOULD link to a Contextual Entity in the RO-Crate Metadata File with a name and description. MAY have a URI (eg for Creative Commons or Open Source licenses). MAY if necessary be a textual description of how the RO-Crate may be used | <a href="#class-license-creative-work">License (Creative Work)</a>, schema:URL, schema:Text |  |
| <a href="#property-name">name <a href="#property-name" target="_blank" rel="noopener">ⓘ</a></a> | Yes | SHOULD identify the dataset to humans well enough to disambiguate it from other RO-Crates | Text |  |


### <a id="class-license-creative-work"></a> Class: License (Creative Work)

A license included as a Creative Work - with at least a name and description

Instances of this type MAY be present in the crate.

| Min Count | Max Count |
| --------- | --------- |
| N/A | N/A |

| Property | Required | Description | Range | Value |
| -------- | -------- | ----------- | ----- | ----- |
| @type | Yes |  |  | http://schema.org/CreativeWork |
*No properties defined for this class*


## All Properties

### <a id="property-id"></a> Property: @id

ID: #RO-Crate_Metadata_Descriptor.id

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| The RO-Crate Metadata  |  | <a href="#class-ro-crate-metadadata-descriptor">RO-Crate Metadadata Descriptor</a> |
### <a id="property-about-root-data-entity"></a> Property: about (Root Data Entity) <a href="http://schema.org/about" target="_blank" rel="noopener">ⓘ</a>

ID: #RO-Crate_Metadata_Descriptor.about

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| This property on the RO-Crate Metadata Descriptor references the Root Data Entity. I a SoSS+ profile there may be Schemas present for more than one 'flavour' of Root Data Enitty with different @type arrays or `@conformsTo` references (or other specializations). In this example there is a single reference. | <a href="#class-root-data-entity">Root Data Entity</a> | <a href="#class-ro-crate-metadadata-descriptor">RO-Crate Metadadata Descriptor</a> |
### <a id="property-datepublished"></a> Property: datePublished <a href="http://schema.org/datePubished" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_datePublised_Dataset

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| MUST be a string in ISO 8601 date format and SHOULD be specified to at least the precision of a day, MAY be a timestamp down to the millisecond. | schema:Date | <a href="#class-root-data-entity">Root Data Entity</a> |
### <a id="property-description"></a> Property: description <a href="http://schema.org/description" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_description_Dataset

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| (In addition to the name) SHOULD further elaborate on the name to provide a summary of the context in which the dataset is important. | Text | <a href="#class-root-data-entity">Root Data Entity</a> |
### <a id="property-license"></a> Property: license <a href="http://schema.org/license" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_license_Dataset

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| SHOULD link to a Contextual Entity in the RO-Crate Metadata File with a name and description. MAY have a URI (eg for Creative Commons or Open Source licenses). MAY if necessary be a textual description of how the RO-Crate may be used | <a href="#class-license-creative-work">License (Creative Work)</a>, schema:URL, schema:Text | <a href="#class-root-data-entity">Root Data Entity</a> |
### <a id="property-name"></a> Property: name <a href="http://schema.org/name" target="_blank" rel="noopener">ⓘ</a>

ID: http://schema.org/name

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| SHOULD identify the dataset to humans well enough to disambiguate it from other RO-Crates | Text | <a href="#class-root-data-entity">Root Data Entity</a> |


## Defined Term Sets




## Provenance

This document was compiled using [generate-soss-docs.js](https://github.com/Language-Research-Technology/ro-crate-schema-tools/blob/main/generate-soss-docs.js), based on [profiles/ro-crate/profile-text.md](https://github.com/Language-Research-Technology/ro-crate-schema-tools/blob/main/profiles/ro-crate/profile-text.md) using a SoSS+ Schema defined in [profiles/ro-crate/profile-crate/ro-crate-metadata.json](https://github.com/Language-Research-Technology/ro-crate-schema-tools/blob/main/profiles/ro-crate/profile-crate/ro-crate-metadata.json).
