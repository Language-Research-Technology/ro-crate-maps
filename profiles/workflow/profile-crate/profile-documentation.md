---
title: Workflow RO-Crate profile 1.0 -- EXPERIMENTAL RO-Crate Schema Profile
---
<!--  https://signposting.org/FAIR/  markup --->

<link href="https://w3id.org/workflowhub/workflow-ro-crate/1.0" rel="cite-as" /> 

<link href="https://www.researchobject.org/ro-crate/1.2-DRAFT/profiles" rel="type"  />
<link href="http://purl.org/dc/terms/Standard" rel="type"  />
<link href="https://schema.org/CreativeWork" rel="type"  />

<link href="https://spdx.org/licenses/BSD-3-Clause" rel="license"  />

<link href="https://orcid.org/0000-0002-0048-3300" rel="author"  />
<link href="https://orcid.org/0000-0003-3156-2105" rel="author"  />
<link href="https://orcid.org/0000-0003-2130-0865" rel="author"  />
<link href="https://orcid.org/0000-0001-9842-9718" rel="author"  />

<link href="ro-crate-metadata.json" rel="describedby" type='application/ld+json; profile="https://w3id.org/ro/crate"' />
<link href="ro-crate-metadata.jsonld" rel="describedby" type='application/ld+json; profile="https://w3id.org/ro/crate"'  />
<link href="ro-crate-preview.html" rel="describedby" type='text/html'  />

<!-- repeat of hasPart in RO-Crate -->
<link href="index.html" rel="item"  />
<link href="licenses/" rel="item" />
<link href="languages/" rel="item" />
<link href="example/" rel="item" />
<link href="https://w3id.org/ro/crate/1.1/context" rel="item" />
<link href="https://pypi.org/project/rocrate/" rel="item" />
<link href="https://github.com/inab/WfExS-backend/" rel="item" />
<link href="https://www.nationalarchives.gov.uk/PRONOM/x-fmt/263" rel="item" />
<link href="https://workflowhub.eu/" rel="item" />
<link href="https://bioschemas.org/ComputationalWorkflow" rel="item" />
<link href="https://bioschemas.org/FormalParameter" rel="item" />
<link href="http://schema.org/HowTo" rel="item" />
<link href="http://schema.org/ImageObject" rel="item" />
<link href="https://github.com/KockataEPich/CheckMyCrate/blob/master/CheckMyCrate/profile_library/ro_crate_1.1_basic.json" rel="item" />


NOTE: This document is an attempt by Peter (PT) Sefton to see if this profile can be expressed in Schema.org Style Schema terms using *RO-Crate Schema* (AKA SoSS+)
![Workflow RO-Crate]({{ '/assets/img/ro-crate-workflow.svg' | relative_url }}){: height="300px" width="300px"}

* Authors:
  - Finn Bacall <https://orcid.org/0000-0002-0048-3300>
  - Alan R Williams <https://orcid.org/0000-0003-3156-2105>
  - Stuart Owen <https://orcid.org/0000-0003-2130-0865>
  - Stian Soiland-Reyes <https://orcid.org/0000-0001-9842-9718>
* Title: Workflow RO-Crate profile 1.0
* Publisher: [WorkflowHub community](https://w3id.org/workflowhub/)
* Permalink: <https://w3id.org/workflowhub/workflow-ro-crate/1.0> (this version)  
  <https://w3id.org/workflowhub/workflow-ro-crate/> (latest version)
* Version: [1.0.3](https://github.com/workflowhub-eu/about/releases/tag/workflow-ro-crate-1.0.3)
* [Profile Crate `ro-crate-metadata.json`](ro-crate-metadata.json)
  - [Profile Crate preview](ro-crate-preview.html)
* [Example RO-Crate `ro-crate-metadata.json`](example/ro-crate-metadata.json)
  - [Example RO-Crate profile preview](example/ro-crate-preview.html)

Please leave any suggestions and comments here: <https://github.com/seek4science/seek/issues/183>

_Workflow RO-Crates_ are a specialization of [_RO-Crate_](https://researchobject.github.io/ro-crate/) for packaging an executable workflow with all necessary documentation. It extends the more general [Bioschemas ComputationalWorkflow profile](https://bioschemas.org/profiles/ComputationalWorkflow/1.0-RELEASE). 

WorkflowHub uses _Workflow RO-Crates_ as an exchange format for users to upload a packaged workflow. 

## Extension profiles

Several extensions of Workflow RO-Crate exists:

* [Workflow Testing RO-Crate](https://lifemonitor.eu/workflow_testing_ro_crate) defines test infrastructure recognized by [LifeMonitor](https://lifemonitor.eu/)
* The [Workflow Run Crate](https://w3id.org/ro/wfrun) profiles extends Workflow RO-Crate to describe *workflow run provenance*, documenting execution of a workflow. 
* [Five Safes RO-Crate](https://w3id.org/5s-crate/) refers to Workflow RO-Crate for the purpose of workflow execution in a distributed trusted research environment (TRE)

 
## Concepts

This section uses terminology from the [RO-Crate 1.1 specification](https://w3id.org/ro/crate/1.1).

### Context

The _Crate_ JSON-LD MUST be valid according to [RO-Crate 1.1](https://w3id.org/ro/crate/1.1) and SHOULD use the RO-Crate 1.1 `@context` <https://w3id.org/ro/crate/1.1/context>




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
| <a href="#property-about">about <a href="#property-about" target="_blank" rel="noopener">ⓘ</a></a> | Yes | This property on the RO-Crate Metadata Descriptor references the Root Data Entity. | <a href="#class-root-data-entity">Root Data Entity</a> |  |


### <a id="class-root-data-entity"></a> Class: Root Data Entity

The Root Data Entity for an RO-Crate. This is the main entity of the RO-Crate and is the one that is referenced by the RO-Crate Metadata Descriptor.

At least 1 instances of this type MUST be present in the crate.

 A maximum of 1 instances of this type  MAY be present in the crate.

| Min Count | Max Count |
| --------- | --------- |
| 1 | 1 |

| Property | Required | Description | Range | Value |
| -------- | -------- | ----------- | ----- | ----- |
| @type | Yes |  |  | http://schema.org/Dataset |
| <a href="#property-conformsto">conformsTo</a> | Yes | The RO-Crate conforms to this profile. This is a link to to the profile entity | <a href="#class-profile-item-list">Profile Item List</a> |  |
| <a href="#property-datepublished">datePublished <a href="#property-datepublished" target="_blank" rel="noopener">ⓘ</a></a> | Yes | MUST be a string in ISO 8601 date format and SHOULD be specified to at least the precision of a day, MAY be a timestamp down to the millisecond. | schema:Date |  |
| <a href="#property-description">description <a href="#property-description" target="_blank" rel="noopener">ⓘ</a></a> | Yes | (In addition to the name) SHOULD further elaborate on the name to provide a summary of the context in which the dataset is important. | Text |  |
| <a href="#property-license">license <a href="#property-license" target="_blank" rel="noopener">ⓘ</a></a> | Yes | TODO: Deal with the supplied list of licenses (string values) SHOULD link to a Contextual Entity in the RO-Crate Metadata File with a name and description. MAY have a URI (eg for Creative Commons or Open Source licenses). MAY if necessary be a textual description of how the RO-Crate may be used | #class_CreativeWork, schema:URL, schema:Text |  |
| <a href="#property-mainentity">mainEntity <a href="#property-mainentity" target="_blank" rel="noopener">ⓘ</a></a> | Yes | Links the Root Data Entity to the Main Workflow. The RO-Crate MUST contain exactly one Main Workflow. | <a href="#class-main-workflow">Main Workflow</a> |  |
| <a href="#property-name">name <a href="#property-name" target="_blank" rel="noopener">ⓘ</a></a> | Yes | SHOULD identify the dataset to humans well enough to disambiguate it from other RO-Crates | Text |  |


### <a id="class-main-workflow"></a> Class: Main Workflow

The Main Workflow is the primary workflow of the RO-Crate. It represents the computational process that is described by the RO-Crate.

At least 1 instances of this type MUST be present in the crate.

| Min Count | Max Count |
| --------- | --------- |
| 1 | N/A |

| Property | Required | Description | Range | Value |
| -------- | -------- | ----------- | ----- | ----- |
| @type | Yes |  |  | http://schema.org/MediaObject, http://schema.org/SoftwareSourceCode, https://bioschemas.org/ComputationalWorkflow |
| <a href="#property-programminglanguage">programmingLanguage <a href="#property-programminglanguage" target="_blank" rel="noopener">ⓘ</a></a> | Yes | The programming language used to implement the Main Workflow. This is a string that should be a valid programming language name. | <a href="#class-programming-languages">Programming Languages</a> |  |
| <a href="#property-image">image <a href="#property-image" target="_blank" rel="noopener">ⓘ</a></a> | No | If _Main Workflow Diagram_ is present, the _Main Workflow_ MUST refer to it via `image`. | <a href="#class-main-workflow-diagram">Main Workflow Diagram</a> |  |
| <a href="#property-subjectof">subjectOf <a href="#property-subjectof" target="_blank" rel="noopener">ⓘ</a></a> | No | Main Workflow to a workflow description. The RO-Crate MUST contain exactly one Main Workflow Description. | <a href="#class-main-workflow-description">Main Workflow Description</a> |  |


### <a id="class-main-workflow-description"></a> Class: Main Workflow Description

The _Crate_ COULD contain a data entity of type `[File, SoftwareSourceCode, HowTo]` as the _Main Workflow CWL Description_.

Instances of this type MAY be present in the crate.

 A maximum of 1 instances of this type  MAY be present in the crate.

| Min Count | Max Count |
| --------- | --------- |
| N/A | 1 |

| Property | Required | Description | Range | Value |
| -------- | -------- | ----------- | ----- | ----- |
| @type | Yes |  |  | http://schema.org/MediaObject, http://schema.org/SoftwareSourceCode, http://schema.org/HowTo |
| <a href="#property-programminglanguage">programmingLanguage <a href="#property-programminglanguage" target="_blank" rel="noopener">ⓘ</a></a> | Yes | The programming language used to implement the Main Workflow. This is a string that should be a valid programming language name. | <a href="#class-common-workflow-language">Common Workflow Language</a> |  |


### <a id="class-readme-file"></a> Class: README File



Instances of this type SHOULD be present in the crate.

 A maximum of 1 instances of this type  MAY be present in the crate.

| Min Count | Max Count |
| --------- | --------- |
| 0 | 1 |

| Property | Required | Description | Range | Value |
| -------- | -------- | ----------- | ----- | ----- |
| @type | Yes |  |  | http://schema.org/CreativeWork, http://schema.org/MediaObject |
| <a href="#property-id">@id</a> | Yes | README file must have @id of `README.md`. |  | README.md |
| <a href="#property-about">about <a href="#property-about" target="_blank" rel="noopener">ⓘ</a></a> | Yes | The README.md file SHOULD have an about property referencing the Root Data Entity. | <a href="#class-root-data-entity">Root Data Entity</a> |  |
| <a href="#property-encodingformat">encodingFormat <a href="#property-encodingformat" target="_blank" rel="noopener">ⓘ</a></a> | Yes | Readme file must have an encodingFormat of `text/markdown`. |  | text/markdown |


### <a id="class-test-directory"></a> Class: Test Directory



Instances of this type SHOULD be present in the crate.

 A maximum of 1 instances of this type  MAY be present in the crate.

| Min Count | Max Count |
| --------- | --------- |
| 0 | 1 |

| Property | Required | Description | Range | Value |
| -------- | -------- | ----------- | ----- | ----- |
| @type | Yes |  |  | http://schema.org/Dataset |
| <a href="#property-id">@id</a> | Yes | The RO-Crate Metadata  |  | test/ |


### <a id="class-examples-directory"></a> Class: Examples Directory



Instances of this type SHOULD be present in the crate.

 A maximum of 1 instances of this type  MAY be present in the crate.

| Min Count | Max Count |
| --------- | --------- |
| 0 | 1 |

| Property | Required | Description | Range | Value |
| -------- | -------- | ----------- | ----- | ----- |
| @type | Yes |  |  | http://schema.org/Dataset |
| <a href="#property-id">@id</a> | Yes | The RO-Crate Metadata  |  | examples/ |


### <a id="class-main-workflow-diagram"></a> Class: Main Workflow Diagram



Instances of this type MAY be present in the crate.

| Min Count | Max Count |
| --------- | --------- |
| N/A | N/A |

| Property | Required | Description | Range | Value |
| -------- | -------- | ----------- | ----- | ----- |
| @type | Yes |  |  | http://schema.org/ImageObject, http://schema.org/MediaObject |
*No properties defined for this class*


## All Properties

### <a id="property-id"></a> Property: @id

ID: #RO-Crate_Metadata_Descriptor.id

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| The RO-Crate Metadata  |  | <a href="#class-ro-crate-metadadata-descriptor">RO-Crate Metadadata Descriptor</a> |
### <a id="property-id"></a> Property: @id

ID: #property_CreativeWork_README.id

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| README file must have @id of `README.md`. |  | <a href="#class-readme-file">README File</a> |
### <a id="property-id"></a> Property: @id

ID: #property_Dataset_Test_Directory.id

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| The RO-Crate Metadata  |  | <a href="#class-test-directory">Test Directory</a> |
### <a id="property-id"></a> Property: @id

ID: #property_Dataset_Examples_Directory.id

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| The RO-Crate Metadata  |  | <a href="#class-examples-directory">Examples Directory</a> |
### <a id="property-about"></a> Property: about <a href="http://schema.org/about" target="_blank" rel="noopener">ⓘ</a>

ID: #RO-Crate_Metadata_Descriptor.about

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| This property on the RO-Crate Metadata Descriptor references the Root Data Entity. | <a href="#class-root-data-entity">Root Data Entity</a> | <a href="#class-ro-crate-metadadata-descriptor">RO-Crate Metadadata Descriptor</a> |
### <a id="property-about"></a> Property: about <a href="http://schema.org/about" target="_blank" rel="noopener">ⓘ</a>

ID: #property_CreativeWork_README.about

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| The README.md file SHOULD have an about property referencing the Root Data Entity. | <a href="#class-root-data-entity">Root Data Entity</a> | <a href="#class-readme-file">README File</a> |
### <a id="property-conformsto"></a> Property: conformsTo

ID: #prop_conformsTo_Root_Data_Entity

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| The RO-Crate conforms to this profile. This is a link to to the profile entity | <a href="#class-profile-item-list">Profile Item List</a> | <a href="#class-root-data-entity">Root Data Entity</a> |
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
### <a id="property-encodingformat"></a> Property: encodingFormat <a href="http://schema.org/encodingFormat" target="_blank" rel="noopener">ⓘ</a>

ID: #property_CreativeWork_README.encodingFormat

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| Readme file must have an encodingFormat of `text/markdown`. |  | <a href="#class-readme-file">README File</a> |
### <a id="property-image"></a> Property: image <a href="http://schema.org/image" target="_blank" rel="noopener">ⓘ</a>

ID: #Property_MainWorkflow_image

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| If _Main Workflow Diagram_ is present, the _Main Workflow_ MUST refer to it via `image`. | <a href="#class-main-workflow-diagram">Main Workflow Diagram</a> | <a href="#class-main-workflow">Main Workflow</a> |
### <a id="property-license"></a> Property: license <a href="http://schema.org/license" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_license_Dataset

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| TODO: Deal with the supplied list of licenses (string values) SHOULD link to a Contextual Entity in the RO-Crate Metadata File with a name and description. MAY have a URI (eg for Creative Commons or Open Source licenses). MAY if necessary be a textual description of how the RO-Crate may be used | #class_CreativeWork, schema:URL, schema:Text | <a href="#class-root-data-entity">Root Data Entity</a> |
### <a id="property-mainentity"></a> Property: mainEntity <a href="http://schema.org/mainEntity" target="_blank" rel="noopener">ⓘ</a>

ID: #Property_mainEntity_Workflow

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| Links the Root Data Entity to the Main Workflow. The RO-Crate MUST contain exactly one Main Workflow. | <a href="#class-main-workflow">Main Workflow</a> | <a href="#class-root-data-entity">Root Data Entity</a> |
### <a id="property-name"></a> Property: name <a href="http://schema.org/name" target="_blank" rel="noopener">ⓘ</a>

ID: http://schema.org/name

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| SHOULD identify the dataset to humans well enough to disambiguate it from other RO-Crates | Text | <a href="#class-root-data-entity">Root Data Entity</a> |
### <a id="property-programminglanguage"></a> Property: programmingLanguage <a href="http://schema.org/programmingLanguage" target="_blank" rel="noopener">ⓘ</a>

ID: #Property_programmingLanguage_Workflow

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| The programming language used to implement the Main Workflow. This is a string that should be a valid programming language name. | <a href="#class-programming-languages">Programming Languages</a> | <a href="#class-main-workflow">Main Workflow</a> |
### <a id="property-programminglanguage"></a> Property: programmingLanguage <a href="http://schema.org/programmingLanguage" target="_blank" rel="noopener">ⓘ</a>

ID: #Property_programmingLanguage_WorkflowDescription

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| The programming language used to implement the Main Workflow. This is a string that should be a valid programming language name. | <a href="#class-common-workflow-language">Common Workflow Language</a> | <a href="#class-main-workflow-description">Main Workflow Description</a> |
### <a id="property-subjectof"></a> Property: subjectOf <a href="http://schema.org/subjectOf" target="_blank" rel="noopener">ⓘ</a>

ID: #Property_MainWorkflow_subjectOf

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| Main Workflow to a workflow description. The RO-Crate MUST contain exactly one Main Workflow Description. | <a href="#class-main-workflow-description">Main Workflow Description</a> | <a href="#class-main-workflow">Main Workflow</a> |



## Item Lists

### <a id="item-list-profile-item-list"></a>Item List: Profile Item List

A list of valid profile values for this RO-Crate Profile

-  [Workflow RO-Crate Profile (experimental)](#https-w3id-org-workflowhub-workflow-ro-crate-1-0)
 <hr/>

### <a id="https://w3id.org/workflowhub/workflow-ro-crate/1.0"></a><a id="https-w3id-org-workflowhub-workflow-ro-crate-1-0"></a><pre>
 {
  "@id": "https://w3id.org/workflowhub/workflow-ro-crate/1.0",
  "@type": [
    "CreativeWork",
    "Profile"
  ],
  "name": "Workflow RO-Crate Profile (experimental)",
  "version": "0.4.0",
  "description": "This is a profile for RO-Crates that are used to describe workflows -- NOTE have moved the conformsTo to the ROOT Data Entity  as per RO-Crate 1.2"
}
</pre>

ID: https://w3id.org/workflowhub/workflow-ro-crate/1.0

### <a id="item-list-programming-languages"></a>Item List: Programming Languages

A list of programming languages that can be used to implement the Main Workflow

-  [Common Workflow Language](#https-w3id-org-workflowhub-workflow-ro-crate-cwl)
 -  [Galaxy](#https-w3id-org-workflowhub-workflow-ro-crate-galaxy)
 -  [KNIME](#https-w3id-org-workflowhub-workflow-ro-crate-knime)
 -  [Nextflow](#https-w3id-org-workflowhub-workflow-ro-crate-nextflow)
 -  [Snakemake](#https-w3id-org-workflowhub-workflow-ro-crate-snakemake)
 <hr/>

### <a id="https://w3id.org/workflowhub/workflow-ro-crate#cwl"></a><a id="https-w3id-org-workflowhub-workflow-ro-crate-cwl"></a><pre>
 {
  "@id": "https://w3id.org/workflowhub/workflow-ro-crate#cwl",
  "@type": "ComputerLanguage",
  "name": "Common Workflow Language",
  "alternateName": "CWL",
  "identifier": {
    "@id": "https://w3id.org/cwl/v1.2/"
  },
  "url": {
    "@id": "https://www.commonwl.org/"
  }
}
</pre>

ID: https://w3id.org/workflowhub/workflow-ro-crate#cwl

### <a id="https://w3id.org/workflowhub/workflow-ro-crate#galaxy"></a><a id="https-w3id-org-workflowhub-workflow-ro-crate-galaxy"></a><pre>
 {
  "@id": "https://w3id.org/workflowhub/workflow-ro-crate#galaxy",
  "@type": "ComputerLanguage",
  "name": "Galaxy",
  "identifier": {
    "@id": "https://galaxyproject.org/"
  },
  "url": {
    "@id": "https://galaxyproject.org/"
  }
}
</pre>

ID: https://w3id.org/workflowhub/workflow-ro-crate#galaxy

### <a id="https://w3id.org/workflowhub/workflow-ro-crate#knime"></a><a id="https-w3id-org-workflowhub-workflow-ro-crate-knime"></a><pre>
 {
  "@id": "https://w3id.org/workflowhub/workflow-ro-crate#knime",
  "@type": "ComputerLanguage",
  "name": "KNIME",
  "identifier": {
    "@id": "https://www.knime.com/"
  },
  "url": {
    "@id": "https://www.knime.com/"
  }
}
</pre>

ID: https://w3id.org/workflowhub/workflow-ro-crate#knime

### <a id="https://w3id.org/workflowhub/workflow-ro-crate#nextflow"></a><a id="https-w3id-org-workflowhub-workflow-ro-crate-nextflow"></a><pre>
 {
  "@id": "https://w3id.org/workflowhub/workflow-ro-crate#nextflow",
  "@type": "ComputerLanguage",
  "name": "Nextflow",
  "identifier": {
    "@id": "https://www.nextflow.io/"
  },
  "url": {
    "@id": "https://www.nextflow.io/"
  }
}
</pre>

ID: https://w3id.org/workflowhub/workflow-ro-crate#nextflow

### <a id="https://w3id.org/workflowhub/workflow-ro-crate#snakemake"></a><a id="https-w3id-org-workflowhub-workflow-ro-crate-snakemake"></a><pre>
 {
  "@id": "https://w3id.org/workflowhub/workflow-ro-crate#snakemake",
  "@type": "ComputerLanguage",
  "name": "Snakemake",
  "identifier": {
    "@id": "https://doi.org/10.1093/bioinformatics/bts480"
  },
  "url": {
    "@id": "https://snakemake.readthedocs.io"
  }
}
</pre>

ID: https://w3id.org/workflowhub/workflow-ro-crate#snakemake

### <a id="item-list-common-workflow-language"></a>Item List: Common Workflow Language

A list containing only the Common Workflow Language (CWL) as a programming language for the WWorkflow Description.

-  [Common Workflow Language](#https-w3id-org-workflowhub-workflow-ro-crate-cwl)
 <hr/>

### <a id="https://w3id.org/workflowhub/workflow-ro-crate#cwl"></a><a id="https-w3id-org-workflowhub-workflow-ro-crate-cwl"></a><pre>
 {
  "@id": "https://w3id.org/workflowhub/workflow-ro-crate#cwl",
  "@type": "ComputerLanguage",
  "name": "Common Workflow Language",
  "alternateName": "CWL",
  "identifier": {
    "@id": "https://w3id.org/cwl/v1.2/"
  },
  "url": {
    "@id": "https://www.commonwl.org/"
  }
}
</pre>

ID: https://w3id.org/workflowhub/workflow-ro-crate#cwl



<a id="example-1-example-workflow"></a>

## Example-1: Example: Workflow


### <a id="artifact-an-example-workflow-ro-crate"></a> Artifact: An example workflow RO-Crate

<pre>
 {
  "@id": "#WorkflowExample",
  "@type": "LearningResource",
  "name": "An example workflow RO-Crate",
  "mainEntity": {
    "@id": "./"
  },
  "hasPart": [
    {
      "@id": "./"
    },
    {
      "@id": "https://w3id.org/workflowhub/workflow-ro-crate/1.0"
    },
    {
      "@id": "example_workflow.cwl"
    },
    {
      "@id": "diagram.svg"
    },
    {
      "@id": "README.md"
    }
  ]
}
</pre>


#### <a id="example-1"></a>Example-1: ./

<pre>
 {
  "@id": "./",
  "@type": "Dataset",
  "name": "Example Workflow",
  "conformsTo": {
    "@id": "https://w3id.org/workflowhub/workflow-ro-crate/1.0"
  },
  "description": "An example workflow RO-Crate",
  "license": "Apache-2.0",
  "datePublished": "2025-10-15",
  "mainEntity": {
    "@id": "example_workflow.cwl"
  },
  "hasPart": [
    {
      "@id": "example_workflow.cwl"
    },
    {
      "@id": "diagram.svg"
    },
    {
      "@id": "README.md"
    },
    {
      "@id": "profile-documentation.md"
    }
  ]
}
</pre>


#### <a id="example-1-https-w3id-org-workflowhub-workflow-ro-crate-1-0"></a>Example-1: https://w3id.org/workflowhub/workflow-ro-crate/1.0

<pre>
 {
  "@id": "https://w3id.org/workflowhub/workflow-ro-crate/1.0",
  "@type": [
    "CreativeWork",
    "Profile"
  ],
  "name": "Workflow RO-Crate Profile (experimental)",
  "version": "0.4.0",
  "description": "This is a profile for RO-Crates that are used to describe workflows -- NOTE have moved the conformsTo to the ROOT Data Entity  as per RO-Crate 1.2"
}
</pre>


#### <a id="example-1-example-workflow-cwl"></a>Example-1: example_workflow.cwl

<pre>
 {
  "@id": "example_workflow.cwl",
  "@type": [
    "File",
    "SoftwareSourceCode",
    "ComputationalWorkflow"
  ],
  "programmingLanguage": {
    "@id": "https://w3id.org/workflowhub/workflow-ro-crate#cwl"
  },
  "name": "Example Workflow",
  "image": {
    "@id": "diagram.svg"
  }
}
</pre>


#### <a id="example-1-diagram-svg"></a>Example-1: diagram.svg

<pre>
 {
  "@id": "diagram.svg",
  "name": "Example Workflow Diagram",
  "@type": [
    "File",
    "ImageObject"
  ]
}
</pre>


#### <a id="example-1-readme-md"></a>Example-1: README.md

<pre>
 {
  "@id": "README.md",
  "@type": "File",
  "about": "./",
  "encodingFormat": "text/markdown"
}
</pre>



## Provenance

This document was compiled using [generate-soss-docs.js](https://github.com/Language-Research-Technology/ro-crate-schema-tools/blob/main/generate-soss-docs.js), based on [profiles/workflow/profile-text.md](https://github.com/Language-Research-Technology/ro-crate-schema-tools/blob/main/profiles/workflow/profile-text.md) using a SoSS+ Schema defined in [profiles/workflow/profile-crate/ro-crate-metadata.json](https://github.com/Language-Research-Technology/ro-crate-schema-tools/blob/main/profiles/workflow/profile-crate/ro-crate-metadata.json).


<!--

## ORIGINAL TEXT BELOW -- WITH NOTES

### Metadata File Descriptor

The [Metadata File Descriptor](https://www.researchobject.org/ro-crate/1.1/root-data-entity.html#ro-crate-metadata-file-descriptor) `conformsTo` SHOULD be an array that contains at least <https://w3id.org/ro/crate/1.1> and <https://w3id.org/workflowhub/workflow-ro-crate/1.0>



### Main Workflow

The _Crate_ MUST contain a data entity of type `["File", "SoftwareSourceCode", "ComputationalWorkflow"]` as the _Main Workflow_. 

The _Crate_ MUST refer to the _Main Workflow_ via `mainEntity`. 

The _Main Workflow_ MUST refer to its type via `programmingLanguage`.


**Tip**: See [RO-Crate specification on Workflows and Scripts](https://www.researchobject.org/ro-crate/1.1/workflows.html) for details.



### Main Workflow CWL Description

The _Crate_ COULD contain a data entity of type `["File", "SoftwareSourceCode", "HowTo"]` as the _Main Workflow CWL Description_. 

A _Main Workflow CWL Description_ SHOULD have `https://w3id.org/workflowhub/workflow-ro-crate#cwl` as its `programmingLanguage` with a corresponding [contextual entity](#cwl).

If _Main Workflow CWL Description_ is present, the _Main Workflow_ MUST refer to it the via `subjectOf`.

### Main Workflow Diagram

The _Crate_ COULD contain a _Main Workflow Diagram_, indicated as a data entity of type `["File", "ImageObject"]`.

If  _Main Workflow Diagram_ is present, the _Main Workflow_ MUST refer to it via `image`.

### Crate

The _Crate_ MUST specify a `license`. The license is assumed to apply to any content of the crate, unless overriden by `license` on individual `File` entities.

The _Crate_ SHOULD contain a File `README.md` at the root level. If present, it SHOULD be `about` the _Crate_ `./` and SHOULD have `text/markdown` as its `encodingFormat`.

The _Crate_ COULD contain a Dataset (directory) data entity of type `["Dataset"]` with identifier `test/` to hold tests.

The _Crate_ COULD contain a Dataset (directory) data entity of type `["Dataset"]` with identifier `examples/` to hold examples.

### Bioschemas Computational Workflow profile

The `ComputationalWorkflow` description of the _Main Workflow_ SHOULD comply with [Bioschemas ComputationalWorkflow profile](https://bioschemas.org/profiles/ComputationalWorkflow/1.0-RELEASE) version 1.0 or later.  

Conformance with the Bioschemas profile SHOULD be indicated with a `conformsTo` on the _Main Workflow_ entity.

**Tip**: See [RO-Crate 1.1: Complying with Bioschemas Computational Workflow profile](https://www.researchobject.org/ro-crate/1.1/workflows.html#complying-with-bioschemas-computational-workflow-profile)

## WorkflowHub-specific Features/Requirements

### File Format

The Workflow RO-Crate MUST be zipped, and SHOULD have the file extension `.crate.zip` to be recognized by WorkflowHub. 

The `ro-crate-metadata.json` file SHOULD be directly in the root of the zip archive, so that the whole Zip becomes the _RO-Crate Root_.

### Extracted Metadata

WorkflowHub will extract and expose the following properties from the Crate entity (`./`) in `ro-crate-metadata.json`:

* `name` - This will be shown as the title of the workflow.
* `description` - This will be shown as the description of the workflow. 
If it is not present, but a `README.md` file is available in the root of the crate, that will be rendered instead.
* `author` - These will be shown as "creators" of the workflow.
* `license` - See below.
* `keywords` - These will be shown as "tags", and can be filtered over.

If the _Main Workflow CWL Description_ is present it will be parsed and the inputs, outputs and steps will be listed on the workflow's page in the Hub.

If the _Main Workflow Diagram_ is present, it will also be rendered on the page.

### Supported Workflow Types

WorkflowHub currently supports CWL, Galaxy, KNIME and Nextflow workflow types.

To ensure compatibility, please include one of the following in the RO-Crate metadata, and refer to it from the _Main Workflow_'s `programmingLanguage`.

#### CWL
```json
{
  "@id": "https://w3id.org/workflowhub/workflow-ro-crate#cwl",
  "@type": "ComputerLanguage",
  "name": "Common Workflow Language",
  "alternateName": "CWL",
  "identifier": {
    "@id": "https://w3id.org/cwl/v1.2/"
  },
  "url": {
    "@id": "https://www.commonwl.org/"
  }
}
```

#### Galaxy
```json
{
  "@id": "https://w3id.org/workflowhub/workflow-ro-crate#galaxy",
  "@type": "ComputerLanguage",
  "name": "Galaxy",
  "identifier": {
    "@id": "https://galaxyproject.org/"
  },
  "url": {
    "@id": "https://galaxyproject.org/"
  }
}
```
#### KNIME
```json
{
  "@id": "https://w3id.org/workflowhub/workflow-ro-crate#knime",
  "@type": "ComputerLanguage",
  "name": "KNIME",
  "identifier": {
    "@id": "https://www.knime.com/"
  },
  "url": {
    "@id": "https://www.knime.com/"
  }
}
```
#### Nextflow
```json
{
  "@id": "https://w3id.org/workflowhub/workflow-ro-crate#nextflow",
  "@type": "ComputerLanguage",
  "name": "Nextflow",
  "identifier": {
    "@id": "https://www.nextflow.io/"
  },
  "url": {
    "@id": "https://www.nextflow.io/"
  }
}
```
#### Snakemake
```json
{
  "@id": "https://w3id.org/workflowhub/workflow-ro-crate#snakemake",
  "@type": "ComputerLanguage",
  "name": "Snakemake",
  "identifier": {
    "@id": "https://doi.org/10.1093/bioinformatics/bts480"
  },
  "url": {
    "@id": "https://snakemake.readthedocs.io"
  }
}
```

### Supported Licenses

Although the Crate's `license` field should be a URL, WorkflowHub currently accepts a string of one of the following values (on the left):

* `AFL-3.0` - [Academic Free License 3.0](https://opensource.org/licenses/AFL-3.0)
* `APL-1.0` - [Adaptive Public License 1.0](https://opensource.org/licenses/APL-1.0)
* `Apache-1.1` - [Apache Software License 1.1](https://opensource.org/licenses/Apache-1.1)
* `Apache-2.0` - [Apache Software License 2.0](https://opensource.org/licenses/Apache-2.0)
* `APSL-2.0` - [Apple Public Source License 2.0](https://opensource.org/licenses/APSL-2.0)
* `Artistic-2.0` - [Artistic License 2.0](https://opensource.org/licenses/Artistic-2.0)
* `AAL` - [Attribution Assurance Licenses](https://opensource.org/licenses/AAL)
* `BSD-2-Clause` - [BSD 2-Clause "Simplified" or "FreeBSD" License (BSD-2-Clause)](https://opensource.org/licenses/BSD-2-Clause)
* `BSD-3-Clause` - [BSD 3-Clause "New" or "Revised" License (BSD-3-Clause)](https://opensource.org/licenses/BSD-3-Clause)
* `BitTorrent-1.1` - [BitTorrent Open Source License 1.1](https://spdx.org/licenses/BitTorrent-1.1)
* `BSL-1.0` - [Boost Software License 1.0](https://opensource.org/licenses/BSL-1.0)
* `CC0-1.0` - [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/)
* `CNRI-Python` - [CNRI Python License](https://opensource.org/licenses/CNRI-Python)
* `CUA-OPL-1.0` - [CUA Office Public License 1.0](https://opensource.org/licenses/CUA-OPL-1.0)
* `CECILL-2.1` - [CeCILL License 2.1](https://opensource.org/licenses/CECILL-2.1)
* `CDDL-1.0` - [Common Development and Distribution License 1.0](https://opensource.org/licenses/CDDL-1.0)
* `CPAL-1.0` - [Common Public Attribution License 1.0](https://opensource.org/licenses/CPAL-1.0)
* `CATOSL-1.1` - [Computer Associates Trusted Open Source License 1.1 (CATOSL-1.1)](https://opensource.org/licenses/CATOSL-1.1)
* `EUDatagrid` - [EU DataGrid Software License](https://opensource.org/licenses/EUDatagrid)
* `EPL-1.0` - [Eclipse Public License 1.0](https://opensource.org/licenses/EPL-1.0)
* `ECL-2.0` - [Educational Community License 2.0](https://opensource.org/licenses/ECL-2.0)
* `EFL-2.0` - [Eiffel Forum License 2.0](https://opensource.org/licenses/EFL-2.0)
* `Entessa` - [Entessa Public License](https://opensource.org/licenses/Entessa)
* `EUPL-1.1` - [European Union Public License 1.1](https://opensource.org/licenses/EUPL-1.1)
* `Fair` - [Fair License](https://opensource.org/licenses/Fair)
* `Frameworx-1.0` - [Frameworx License 1.0](https://opensource.org/licenses/Frameworx-1.0)
* `AGPL-3.0` - [GNU Affero General Public License v3](https://opensource.org/licenses/AGPL-3.0)
* `GPL-2.0` - [GNU General Public License 2.0](https://opensource.org/licenses/GPL-2.0)
* `GPL-3.0` - [GNU General Public License 3.0](https://opensource.org/licenses/GPL-3.0)
* `LGPL-2.1` - [GNU Lesser General Public License 2.1](https://opensource.org/licenses/LGPL-2.1)
* `LGPL-3.0` - [GNU Lesser General Public License 3.0](https://opensource.org/licenses/LGPL-3.0)
* `HPND` - [Historical Permission Notice and Disclaimer](https://opensource.org/licenses/HPND)
* `IPL-1.0` - [IBM Public License 1.0](https://opensource.org/licenses/IPL-1.0)
* `IPA` - [IPA Font License](https://opensource.org/licenses/IPA)
* `ISC` - [ISC License](https://opensource.org/licenses/ISC)
* `Intel` - [Intel Open Source License](https://opensource.org/licenses/Intel)
* `LPPL-1.3c` - [LaTeX Project Public License 1.3c](https://opensource.org/licenses/LPPL-1.3c)
* `LPL-1.0` - [Lucent Public License ("Plan9") 1.0](https://opensource.org/licenses/LPL-1.0)
* `LPL-1.02` - [Lucent Public License 1.02](https://opensource.org/licenses/LPL-1.02)
* `MIT` - [MIT License](https://opensource.org/licenses/MIT)
* `mitre` - [MITRE Collaborative Virtual Workspace License (CVW License)](https://opensource.org/licenses/CVW)
* `MS-PL` - [Microsoft Public License](https://opensource.org/licenses/MS-PL)
* `MS-RL` - [Microsoft Reciprocal License](https://opensource.org/licenses/MS-RL)
* `MirOS` - [MirOS Licence](https://opensource.org/licenses/MirOS)
* `Motosoto` - [Motosoto License](https://opensource.org/licenses/Motosoto)
* `MPL-1.0` - [Mozilla Public License 1.0](https://opensource.org/licenses/MPL-1.0)
* `MPL-1.1` - [Mozilla Public License 1.1](https://opensource.org/licenses/MPL-1.1)
* `MPL-2.0` - [Mozilla Public License 2.0](https://opensource.org/licenses/MPL-2.0)
* `Multics` - [Multics License](https://opensource.org/licenses/Multics)
* `NASA-1.3` - [NASA Open Source Agreement 1.3](https://opensource.org/licenses/NASA-1.3)
* `NTP` - [NTP License](https://opensource.org/licenses/NTP)
* `Naumen` - [Naumen Public License](https://opensource.org/licenses/Naumen)
* `NGPL` - [Nethack General Public License](https://opensource.org/licenses/NGPL)
* `Nokia` - [Nokia Open Source License](https://opensource.org/licenses/Nokia)
* `NPOSL-3.0` - [Non-Profit Open Software License 3.0](https://opensource.org/licenses/NPOSL-3.0)
* `OCLC-2.0` - [OCLC Research Public License 2.0](https://opensource.org/licenses/OCLC-2.0)
* `OFL-1.1` - [Open Font License 1.1](https://opensource.org/licenses/OFL-1.1)
* `OGL-UK-1.0` - [Open Government Licence 1.0 (United Kingdom)](https://www.nationalarchives.gov.uk/doc/open-government-licence/version/1/)
* `OGL-UK-2.0` - [Open Government Licence 2.0 (United Kingdom)](https://www.nationalarchives.gov.uk/doc/open-government-licence/version/2/)
* `OGL-UK-3.0` - [Open Government Licence 3.0 (United Kingdom)](https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/)
* `OGTSL` - [Open Group Test Suite License](https://opensource.org/licenses/OGTSL)
* `OSL-3.0` - [Open Software License 3.0](https://opensource.org/licenses/OSL-3.0)
* `PHP-3.0` - [PHP License 3.0](https://opensource.org/licenses/PHP-3.0)
* `PostgreSQL` - [PostgreSQL License](https://opensource.org/licenses/PostgreSQL)
* `Python-2.0` - [Python License 2.0](https://opensource.org/licenses/Python-2.0)
* `QPL-1.0` - [Q Public License 1.0](https://opensource.org/licenses/QPL-1.0)
* `RPSL-1.0` - [RealNetworks Public Source License 1.0](https://opensource.org/licenses/RPSL-1.0)
* `RPL-1.5` - [Reciprocal Public License 1.5](https://opensource.org/licenses/RPL-1.5)
* `RSCPL` - [Ricoh Source Code Public License](https://opensource.org/licenses/RSCPL)
* `SimPL-2.0` - [Simple Public License 2.0](https://opensource.org/licenses/SimPL-2.0)
* `Sleepycat` - [Sleepycat License](https://opensource.org/licenses/Sleepycat)
* `SISSL` - [Sun Industry Standards Source License 1.1](https://opensource.org/licenses/SISSL)
* `SPL-1.0` - [Sun Public License 1.0](https://opensource.org/licenses/SPL-1.0)
* `Watcom-1.0` - [Sybase Open Watcom Public License 1.0](https://opensource.org/licenses/Watcom-1.0)
* `NCSA` - [University of Illinois/NCSA Open Source License](https://opensource.org/licenses/NCSA)
* `Unlicense` - [Unlicense](https://unlicense.org/)
* `VSL-1.0` - [Vovida Software License 1.0](https://opensource.org/licenses/VSL-1.0)
* `W3C` - [W3C License](https://opensource.org/licenses/W3C)
* `Xnet` - [X.Net License](https://opensource.org/licenses/Xnet)
* `ZPL-2.0` - [Zope Public License 2.0](https://opensource.org/licenses/ZPL-2.0)
* `WXwindows` - [wxWindows Library License](https://opensource.org/licenses/WXwindows)
* `Zlib` - [zlib/libpng license](https://opensource.org/licenses/Zlib)
* `notspecified` - [No license - no permission to use unless the owner grants a licence](https://choosealicense.com/no-permission/)

### ro-crate-metadata.json Example

A minimal example of _Workflow RO-Crate_ metadata, containing a CWL workflow, an SVG diagram of that workflow and a README file.

```json
{
  "@context": "https://w3id.org/ro/crate/1.1/context",
  "@graph": [
    {
      "@id": "ro-crate-metadata.json",
      "@type": "CreativeWork",
      "about": {
        "@id": "./"
      },
      "conformsTo": [
        { "@id": "https://w3id.org/ro/crate/1.1"},
        { "@id": "https://w3id.org/workflowhub/workflow-ro-crate/1.0"}
      ]
    },
    {
      "@id": "ro-crate-preview.html",
      "@type": "CreativeWork",
      "about": {
        "@id": "./"
      }
    },
    {
      "@id": "./",
      "@type": "Dataset",
      "name": "Example Workflow",
      "description": "An example workflow RO-Crate",
      "license": "Apache-2.0",
      "mainEntity": {
        "@id": "example_workflow.cwl"
      },
      "hasPart": [
        {
          "@id": "example_workflow.cwl"
        },
        {
          "@id": "diagram.svg"
        },
        {
          "@id": "README.md"
        }
      ]
    },
    {
      "@id": "example_workflow.cwl",
      "@type": [
        "File",
        "SoftwareSourceCode",
        "HowTo"
      ],
      "programmingLanguage": {
        "@id": "https://w3id.org/workflowhub/workflow-ro-crate#cwl"
      },
      "name": "Example Workflow",
      "image": {
        "@id": "diagram.svg"
      }
    },
    {
      "@id": "diagram.svg",
      "name": "Example Workflow Diagram",
      "@type": [
        "File",
        "ImageObject"
      ]
    },
    {
      "@id": "README.md",
      "@type": "File",
      "about": "./",
      "encodingFormat": "text/markdown"
    },
    {
      "@id": "https://w3id.org/workflowhub/workflow-ro-crate#cwl",
      "@type": "ComputerLanguage",
      "name": "Common Workflow Language",
      "alternateName": "CWL",
      "identifier": "https://w3id.org/cwl/v1.2/",
      "url": "https://www.commonwl.org/"
    }
  ]
}
```

-->
