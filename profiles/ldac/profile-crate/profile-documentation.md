---
title: Language Data Commons RO-Crate Profile
---


This document is a DRAFT RO-Crate profile for Language Data resources. The
profile specifies the contents of RO-Crate Metadata Documents for language
resources and gives guidance on how to structure language data collections both
at the RO-Crate package level and in a repository containing multiple packages.

This profile assumes that the principles and standards set out in the Arkisto
platform, or similar compatible approaches are being used.

The core metadata vocabularies for this profile are:

- RO-Crate recommendations for data packaging and basic discoverability metadata
  which is mostly Schema.org terms with a handful of additions. Following
  RO-Crate practice, basic metadata terms such as "who, what, where" and
  bibliographic-style descriptions are chosen from schema.org (in preference to
  other vocabularies such as Dublin Core or FOAF) where possible with domain-specific
  vocabularies used for things which are not common across domains
  (such as types of language).

- An updated version of the Open Language Archives Community (OLAC) vocabularies
  [http://www.language-archives.org](http://www.language-archives.org);
  originally expressed as XML schemas. The new vocabulary is under development
  here:
  [https://purl.archive.org/language-data-commons/terms](https://purl.archive.org/textcommons/terms)

# Audience

This document is primarily for use by tool developers, data scientists
and metadata specialists developing scripts or systems for user
communities. It is not intended for use by non-specialists.

Just as we would not expect repository users to type in Dublin Core
metadata in XML format by hand we do not expect our users to have to
deal directly with the JSON-LD presented here, this document is for tool
developers to build systems that crosswalk data from existing systems,
or allow for user-friendly data entry.

# About this profile

This profile covers various kinds of crate metadata:

- **Structural** RO-Crate metadata - how the root dataset links to files, and
  the abstract structure of nested collections (e.g. collections/corpora or other
  curated datasets) and objects of study; linguistic Items, Sessions or Texts).
  This profile assumes that a repository (for example, an OCFL storage root,
  with an API for accessing it) exists and that it can at a minimum support 
  (a)  listing all items of the repository and returning their RO-Crate metadata, and 
  (b) retrieving an item given its ID.

- **Types of language data** - is this resource a dialogue? A written text? A
  transcript or other annotation - which file has which kind of data in it? What
  is inside CSV and other structured files? The vocabulary used for
  language-specific data is the
  [Language Data Commons vocabulary](http://purl.archive.org/language-data-commons/terms)
  which is being developed alongside this profile. The vocabulary is described
  here: <http://purl.archive.org/language-data-commons/terms>

- **Contextual metadata** - how to link people who had speaking,
  authoring, collection roles, places, subjects.

# Structural metadata

The structural elements of a Language Data Commons RO-Crate are:

- A Collection / Object hierarchy to allow language data to be
  grouped - for example, a corpus with sub-corpora, or collections of
  items (objects) from a particular region.

- Dataset and File entities (as per RO-Crate). Files may be referenced
  locally or via URI - e.g. from an API. If an RO-Crate contains files
  they MUST be linked to the root dataset using `hasPart`
  relationships as per the RO-Crate specification.

NOTE: The terms Collection and Object
are encoded in RO-Crate metadata using RepositoryCollection and
RepositoryObject types respectively. These in turn are re-named versions
of the Portland Common Data Model types,
[pcdm:Collection](https://pcdm.org/2016/04/18/models#Collection)
and
[pcdm:Object](https://pcdm.org/2016/04/18/models#Object).

A conformant RO-Crate:



![](media/structure.svg)

A collection such as a corpus may be stored in a repository or
transmitted either as:

- A **distributed** collection: a set of individual RO-Crates which
  reference separate collection records with ONE Object and one
  Collection per crate

- A **bundled** single crate which contains all the Collection and
  Object data.

Distributed Collections may reference member collections or Objects in
hasMember property but should not include descriptions of Objects that
are stored elsewhere in the repository.

Objects are placed in a Collection using the `memberOf` property (`pcdm:memberOf`), which is required. The reverse may also be encoded using the `hasMember` property on a Collection.

The following diagram shows how these relationships are encoded in a single "bundled" RO-Crate.

![](media/bundled-crate.svg)

The next diagram shows how distributed crates (with one RO-Crate per Object and Collection) are linked.

![](media/distributed-crates.svg)

Which linking strategy is used is an implementation choice for
repository developers.


## When to choose collection-as-crate ("bundled") vs collection-in-multiple crates ("distributed")

- Choose to use a single bundled crate for a collection when all of these conditions are true:

  - The collection is final and is expected to be stable, i.e. there is
    negligible chance of having to withdraw any of its contents or
    files

  - The collection and all its files can easily be transferred in a
    single transaction - say 20Gb total

  - All the material in the corpus shares the same license for reuse

- Split a collection into fragmented RepositoryCollection and
  RepositoryObject crates - with one crate per repository object
  when any of these conditions are true:

  - The collection is not yet stable

    -   New items are being added or changed.

    -   There is a chance that some data may have to be taken down or withdrawn at the request of participants.

  - The total size of the collection will present challenges for
    data transfer.

  - There is more than one data reuse license applicable.

## Collection (#Collection)

A collection is a group of related Objects. Examples of collections
include corpora, and sub-corpora, as well as aggregations of cultural
objects such as PARADISEC collections which bring together items
collected in a region or on a session with informants. This follows the
Alveo usage:

> Items \[*Objects* in this model\] are grouped into collections which might
> correspond to curated corpora such as ACE or informal collections such as a
> sample of documents from the AustLit archive
> ([http://www.austlit.edu.au/](http://www.austlit.edu.au/)).

When an RO-Crate is used to package a collection which is part of
another Collection it has a memberOf property which references a
resolvable ID (within the context of a repository or service) of the
parent Collection. The Collection may also list its members in a hasMember
property, but this is not required.

The root dataset must have at least these \@type values: \["Dataset",
"RepositoryCollection"\]

### A RepositoryCollection:



## Objects (#Object)

An Object is a single unit linked to tightly related files, for example -
a dialogue or session in a speech study, or a work (document) in a written
corpus. This is based on the use of the term _Item_ in Alveo:

>The data model that we have developed for the storage of language
>resources is built around the concept of an item which corresponds
>(loosely) to a record of a single communication event. An item is
>often associated with a single text, audio or video resource but could
>include a number of resources, for example, the different channels of
>audio recording or an audio recording and associated textual
>transcript. Items are grouped into collections which might correspond
>to curated corpora such as ACE or informal collections such as a
>sample of documents from the AustLit archive
>(<http://www.austlit.edu.au/>).
><https://www.researchonline.mq.edu.au/vital/access/services/Download/mq:37347/DS01>

The definition of an object is necessarily loose and needs to reflect
what data owners have chosen to do with their collections in the past.

If an RO-Crate contains a single Object the Root Dataset would have a
`@type` property of ["Dataset", "RepositoryObject"] with a
conformsTo property pointing to the language-data-commons Object profile
(this document).

If an RO-Crate contains an entire collection then each Object has a
`@type` property of ["Dataset", "RepositoryObject"] and a conformsTo
property referencing this document. For example:

Objects SHOULD have files (which may be included in an RO-Crate for the
object, or as part of a collection crate).

In this example the Object in question is an interview from a speech
corpus with three files - the diagram shows the relationships between
the object and its files (and the contextual metadata of a Person who
takes the role of the speaker/informant (discussed in more detail
below).

![](media/object-structure.svg)

There are a number of terms that can be used to characterise resources -
these use the schema.org mechanism of DefinedTerm and DefinedTermSet.

### A RepositoryObject:



## Files

There are three important types of files (or references to other
works) that may be included - `PrimaryMaterial` - which is a recording or
original text, or a citation of or proxy for it, `DerivedMaterial` which
has been generated or sampled from primary material by a process such as format
conversion or digitization, and `Annotation`, which contains one or more types of
analysis of the `PrimaryMaterial` or `DerivedMaterial`.

### PrimaryMaterial

`PrimaryMaterial` MAY be a video or audio file if it is available or MAY be a ContextualEntity referencing a primary text such as a book.


#### A [File, PrimaryMaterial]:



### DerivedMaterial

DerivedMaterial is a non-analytical derivation from PrimaryMaterial for example downsampled video or excerpted text.





#### a [File, DerivedMaterial]:



### Annotation

An annotation is a description or analysis of other material. More than one type of annotation may be present in a file.

#### a [File, Annotation]:



#### Describing the columns in CSV or other tabular data Annotation

CSV or similar tabular files are often used to represent transcribed
speech or sign language data, sometimes also with time codes. To enable
automated location of which column is which, use a [frictionless Table
Schema](https://specs.frictionlessdata.io/table-schema/) described by a File entity in the crate. 

For example:
${exampleEntities('art', ['art_schema.json'])}


### Language

#### A [Language] entity:



## Places



The place in which data was collected may be indicated using the `contentLocation` property. 


${exampleEntities('paradisec-item-NT1-001', ['./', 'https://www.ethnologue.com/country/VU', '#Vanuatu'])}



# Identifiers

Identifiers for Objects and Collections MUST be URIs.

Internally, identifiers for all entities that do not have their own URIs
MAY use the Archive and Packaging identifier scheme ([ARCP]) - which allows for a DNS-like namespacing of
identifiers. For example, for the Sydney Speaks corpus the top-level
collection would have the ID:

    arcp://name,http://www.dynamicsoflanguage.edu.au/sydney-speaks/corpus/

A sub-corpus (collection) would have an ID like:

    arcp://name,http://www.dynamicsoflanguage.edu.au/sydney-speaks/corpus/collection/SSP

An object:

    arcp://name,http://www.dynamicsoflanguage.edu.au/sydney-speaks/corpus/object/331

A person:

    arcp://name,http://www.dynamicsoflanguage.edu.au/sydney-speaks/corpus/person/54


## How to record people's contributions

Some corpora express ages and other demographics of participants - this
presents a data modelling challenge, as age and some other variables change
over time so if the same person appears over time then we need to have a
base Person with DoB etc and then time-based instances of the person
with an age, social status, gender etc *at that time*.

There are three levels at which contributions to an object can be
modelled:

1.  Include one or more Person items as context in a crate and reference
    them with properties such as schema:creator or the
    language-data-commons contribution properties such as [ldac:compiler]
    or [ldac:depositor]. The \@id of the person MUST be a URI and SHOULD
    be re-used where the same person appears in multiple objects in a
    collection or repository.

2.  For longitudinal studies where it is important to record changing
    demographic information for a Person, or where precision is
    required in listing contributions to a work use
    [ldac:PersonSnapshot].

3.  If it is important to record lots of contributions to a work (e.g. in
    analysis of a joint work) use schema:Action. If more precision is
    required in describing the provenance of items - e.g. this work on
    [The Declaration of Rights of Man and of the
    Citizen](https://www.uts.edu.au/about/faculty-design-architecture-and-building/staff-showcase/writing-rights)
    (Lorber-Kasunic & Sweetapple).

    NOTE: if this approach is used special care will have to be taken in
    developing user interfaces and/or training communities to use this way
    of modelling metadata - the user need not see the underlying
    structure. This profile does not give advice about how to do this as
    we have not seen a use case that requires it.

## Collection events such as "Sessions"

Where data is collected from participants in a speech study with
elicitation tasks such as "sessions" (see this [IMDI
document]](https://www.mpi.nl/ISLE/documents/draft/ISLE_MetaData_2.5.pdf))
or field interviews this can be recorded in metadata via the
CollectionEvent class.

The indirection in this conforms-to relationship is to allow multiple
objects to have a conformsTo property which indicates that they conform
to the _same_ schema while having a local copy of the schema, as per
RO-Crate best practice of having all local context to use a data
packages in the package where possible.

# References

Himmelmann, Nikolaus P. 2012. Linguistic data types and the interface
between language documentation and description. _Language documentation
& conservation_. University of Hawai'i Press 6. 187--207.

Paterson, Hugh Joseph. 2021. _Language Archive Records: Interoperability
of Referencing Practices and Metadata Models_. United States \-- North
Dakota: The University of North Dakota M.A.
[https://www.proquest.com/docview/2550236802/abstract/22686A0E508D4E5CPQ/1](https://www.proquest.com/docview/2550236802/abstract/22686A0E508D4E5CPQ/1)
(3 May 2022).

# EXAMPLES

[https://www.mpi.nl/ISLE/documents/docs_frame.html](https://www.mpi.nl/ISLE/documents/docs_frame.html)




[ldac:PersonSnapshot]: https://purl.archive.org/language-data-commons/terms#PersonSnapshot
[ldac:depositor]: https://purl.archive.org/language-data-commons/terms#depositor
[ldac:compiler]: https://purl.archive.org/language-data-commons/terms#compiler

# Classes and Properties

## Defined Term Sets

### <a id="defined-term-set-accesstypes"></a>Defined Term Set: AccessTypes

ID: ldac:AccessTypes

Set of defined terms for ldac:access

| Term | Description |
| ---- | ----------- |
### <a id="defined-term-authorizedaccess"></a>Defined Term: AuthorizedAccess <a href="https://w3id.org/ldac/terms#AuthorizedAccess" target="_blank" rel="noopener">ⓘ</a>
ID: ldac:AuthorizedAccess

Indicates that a DataReuseLicense requires some kind of authorization step, from SelfAuthorization (click-through) to processes that require a data steward to grant permission.

### <a id="defined-term-openaccess"></a>Defined Term: OpenAccess <a href="https://w3id.org/ldac/terms#OpenAccess" target="_blank" rel="noopener">ⓘ</a>
ID: ldac:OpenAccess

Data covered by this license may be accessed as long as the license is served alongside it, and does not require any specific authorization step.


### <a id="defined-term-set-annotationtypeterms"></a>Defined Term Set: AnnotationTypeTerms

ID: ldac:AnnotationTypeTerms

Set of defined terms for ldac:annotationType

| Term | Description |
| ---- | ----------- |
### <a id="defined-term-gestural"></a>Defined Term: Gestural <a href="https://w3id.org/ldac/terms#Gestural" target="_blank" rel="noopener">ⓘ</a>
ID: ldac:Gestural

The resource describes the gestural content of the resource it annotates.

### <a id="defined-term-orthographic"></a>Defined Term: Orthographic <a href="https://w3id.org/ldac/terms#Orthographic" target="_blank" rel="noopener">ⓘ</a>
ID: ldac:Orthographic

The resource contains annotations using orthography (a writing system) as opposed to a coded representation such as a phonetic transcription.

### <a id="defined-term-partofspeech"></a>Defined Term: PartOfSpeech <a href="https://w3id.org/ldac/terms#PartOfSpeech" target="_blank" rel="noopener">ⓘ</a>
ID: ldac:PartOfSpeech

An annotation that assigns lexical elements of language to classes on the basis of their distributional properties (for sign languages, the term 'sign class' is appropriate).

### <a id="defined-term-phonemic"></a>Defined Term: Phonemic <a href="https://w3id.org/ldac/terms#Phonemic" target="_blank" rel="noopener">ⓘ</a>
ID: ldac:Phonemic

An annotation that represents speech in terms of the sound contrasts made in a language.

### <a id="defined-term-phonetic"></a>Defined Term: Phonetic <a href="https://w3id.org/ldac/terms#Phonetic" target="_blank" rel="noopener">ⓘ</a>
ID: ldac:Phonetic

A representation of speech in terms of the sounds produced, typically using the International Phonetic Alphabet.

### <a id="defined-term-phonological"></a>Defined Term: Phonological <a href="https://w3id.org/ldac/terms#Phonological" target="_blank" rel="noopener">ⓘ</a>
ID: ldac:Phonological

An annotation that includes information about the sound system of a language, such as the contrasts between sounds which make up the sound system and the locally conditioned realisations of sounds which characterise speech in the language.

### <a id="defined-term-prosodic"></a>Defined Term: Prosodic <a href="https://w3id.org/ldac/terms#Prosodic" target="_blank" rel="noopener">ⓘ</a>
ID: ldac:Prosodic

An annotation that provides a symbolic record of intonation, stress, tone or other suprasegmental features, which is expressed independently of regular phonetic transcription.

### <a id="defined-term-semantic"></a>Defined Term: Semantic <a href="https://w3id.org/ldac/terms#Semantic" target="_blank" rel="noopener">ⓘ</a>
ID: ldac:Semantic

The resource includes annotation or analysis concerning the encoding of meaning.

### <a id="defined-term-syntactic"></a>Defined Term: Syntactic <a href="https://w3id.org/ldac/terms#Syntactic" target="_blank" rel="noopener">ⓘ</a>
ID: ldac:Syntactic

The resource contains annotation or analysis describing the combinatorial patterns of words in another resource.

### <a id="defined-term-transcription"></a>Defined Term: Transcription <a href="https://w3id.org/ldac/terms#Transcription" target="_blank" rel="noopener">ⓘ</a>
ID: ldac:Transcription

The resource contains a transcription, which is a written representation (orthographic or coded) of an audio or visual signal.

### <a id="defined-term-translation"></a>Defined Term: Translation <a href="https://w3id.org/ldac/terms#Translation" target="_blank" rel="noopener">ⓘ</a>
ID: ldac:Translation

This is a translation of a resource in another language.


### <a id="defined-term-set-authorizationworkflows"></a>Defined Term Set: AuthorizationWorkflows

ID: ldac:AuthorizationWorkflows

Set of defined terms for ldac:authorizationWorkflow

| Term | Description |
| ---- | ----------- |
### <a id="defined-term-accesscontrollist"></a>Defined Term: AccessControlList <a href="https://w3id.org/ldac/terms#AccessControlList" target="_blank" rel="noopener">ⓘ</a>
ID: ldac:AccessControlList

License grants access to data based on a list of approved users, specified using the property accessControlList.

### <a id="defined-term-agreetoterms"></a>Defined Term: AgreeToTerms <a href="https://w3id.org/ldac/terms#AgreeToTerms" target="_blank" rel="noopener">ⓘ</a>
ID: ldac:AgreeToTerms

A user is expected to explicitly agree to a set of license terms, this may be combined with AccessControlList - to note that even if a user has been pre-approved for a license they must agree to license terms.

### <a id="defined-term-authorizationbyapplication"></a>Defined Term: AuthorizationByApplication <a href="https://w3id.org/ldac/terms#AuthorizationByApplication" target="_blank" rel="noopener">ⓘ</a>
ID: ldac:AuthorizationByApplication

Users may apply for a license via some workflow, such as a form, with the decision being made by a DataSteward or their delegate about whether to grant the license.

### <a id="defined-term-authorizationbyinvitation"></a>Defined Term: AuthorizationByInvitation <a href="https://w3id.org/ldac/terms#AuthorizationByInvitation" target="_blank" rel="noopener">ⓘ</a>
ID: ldac:AuthorizationByInvitation

A data steward or administrator is expected to use an access control system to invite users, for example, participants, collaborators or students.

### <a id="defined-term-selfauthorization"></a>Defined Term: SelfAuthorization <a href="https://w3id.org/ldac/terms#SelfAuthorization" target="_blank" rel="noopener">ⓘ</a>
ID: ldac:SelfAuthorization

A user can be authorised to access data by clicking that they agree to a license, or filling out a form to check their understanding, which can be validated by a machine and does not require human intervention.


### <a id="defined-term-set-collectioneventtypeterms"></a>Defined Term Set: CollectionEventTypeTerms

ID: ldac:CollectionEventTypeTerms

Set of defined terms for ldac:collectionEventType

| Term | Description |
| ---- | ----------- |
### <a id="defined-term-session"></a>Defined Term: Session <a href="https://w3id.org/ldac/terms#Session" target="_blank" rel="noopener">ⓘ</a>
ID: ldac:Session

A collection event that is a recording or elicitation session with participants.


### <a id="defined-term-set-collectionprotocoltypeterms"></a>Defined Term Set: CollectionProtocolTypeTerms

ID: ldac:CollectionProtocolTypeTerms

Set of defined terms for ldac:collectionProtocolType

| Term | Description |
| ---- | ----------- |
### <a id="defined-term-elicitationtask"></a>Defined Term: ElicitationTask <a href="https://w3id.org/ldac/terms#ElicitationTask" target="_blank" rel="noopener">ⓘ</a>
ID: ldac:ElicitationTask

The collection protocol includes a task-based prompt to participants.

### <a id="defined-term-materialselectioncriteria"></a>Defined Term: MaterialSelectionCriteria <a href="https://w3id.org/ldac/terms#MaterialSelectionCriteria" target="_blank" rel="noopener">ⓘ</a>
ID: ldac:MaterialSelectionCriteria

A description of the criteria used to select texts in a collection.


### <a id="defined-term-set-communicationmodeterms"></a>Defined Term Set: CommunicationModeTerms

ID: ldac:CommunicationModeTerms

Set of defined terms for ldac:communicationMode

| Term | Description |
| ---- | ----------- |
### <a id="defined-term-coded"></a>Defined Term: Coded <a href="https://w3id.org/ldac/terms#Coded" target="_blank" rel="noopener">ⓘ</a>
ID: ldac:Coded

The resource contains an analysis or annotations represented by a code (such as the International Phonetic Alphabet).

### <a id="defined-term-gesture"></a>Defined Term: Gesture <a href="https://w3id.org/ldac/terms#Gesture" target="_blank" rel="noopener">ⓘ</a>
ID: ldac:Gesture

The resource contains non-linguistic gestural communication (i.e. not sign language).

### <a id="defined-term-signedlanguage"></a>Defined Term: SignedLanguage <a href="https://w3id.org/ldac/terms#SignedLanguage" target="_blank" rel="noopener">ⓘ</a>
ID: ldac:SignedLanguage

The resource contains data for which the medium of interaction was signing.

### <a id="defined-term-song"></a>Defined Term: Song <a href="https://w3id.org/ldac/terms#Song" target="_blank" rel="noopener">ⓘ</a>
ID: ldac:Song

The resource contains data for which the medium of interaction was song.

### <a id="defined-term-spokenlanguage"></a>Defined Term: SpokenLanguage <a href="https://w3id.org/ldac/terms#SpokenLanguage" target="_blank" rel="noopener">ⓘ</a>
ID: ldac:SpokenLanguage

The resource contains data for which the medium of interaction was speech.

### <a id="defined-term-whistledlanguage"></a>Defined Term: WhistledLanguage <a href="https://w3id.org/ldac/terms#WhistledLanguage" target="_blank" rel="noopener">ⓘ</a>
ID: ldac:WhistledLanguage

The resource contains data for which the medium of interaction was whistling.

### <a id="defined-term-writtenlanguage"></a>Defined Term: WrittenLanguage <a href="https://w3id.org/ldac/terms#WrittenLanguage" target="_blank" rel="noopener">ⓘ</a>
ID: ldac:WrittenLanguage

The resource contains data for which the medium of interaction was writing.


### <a id="defined-term-set-indextypes"></a>Defined Term Set: IndexTypes

ID: ldac:IndexTypes

Set of defined terms for ldac:openAccessIndex

| Term | Description |
| ---- | ----------- |
### <a id="defined-term-fulltext"></a>Defined Term: FullText <a href="https://w3id.org/ldac/terms#FullText" target="_blank" rel="noopener">ⓘ</a>
ID: ldac:FullText

A text index that makes the full text of a data resource findable via a search interface.


### <a id="defined-term-set-linguisticgenreterms"></a>Defined Term Set: LinguisticGenreTerms

ID: ldac:LinguisticGenreTerms

Set of defined terms for ldac:linguisticGenre

| Term | Description |
| ---- | ----------- |
### <a id="defined-term-dialogue"></a>Defined Term: Dialogue <a href="https://w3id.org/ldac/terms#Dialogue" target="_blank" rel="noopener">ⓘ</a>
ID: ldac:Dialogue

An interactive discourse with two or more participants. Examples of dialogues include conversations, interviews, correspondence, consultations, greetings and leave-takings.

### <a id="defined-term-drama"></a>Defined Term: Drama <a href="https://w3id.org/ldac/terms#Drama" target="_blank" rel="noopener">ⓘ</a>
ID: ldac:Drama

A planned, creative rendition of discourse with two or more participants intended for presentation to an audience.

### <a id="defined-term-formulaic"></a>Defined Term: Formulaic <a href="https://w3id.org/ldac/terms#Formulaic" target="_blank" rel="noopener">ⓘ</a>
ID: ldac:Formulaic

The resource is a ritually or conventionally structured discourse.

### <a id="defined-term-informational"></a>Defined Term: Informational <a href="https://w3id.org/ldac/terms#Informational" target="_blank" rel="noopener">ⓘ</a>
ID: ldac:Informational

Discourse whose primary purpose is to inform the audience about the natural or social world.

### <a id="defined-term-interview"></a>Defined Term: Interview <a href="https://w3id.org/ldac/terms#Interview" target="_blank" rel="noopener">ⓘ</a>
ID: ldac:Interview

The resource is a conversation where one or more speakers are directing the conversation.

### <a id="defined-term-lexicon"></a>Defined Term: Lexicon <a href="https://w3id.org/ldac/terms#Lexicon" target="_blank" rel="noopener">ⓘ</a>
ID: ldac:Lexicon

The resource includes a systematic listing of lexical items.

### <a id="defined-term-ludic"></a>Defined Term: Ludic <a href="https://w3id.org/ldac/terms#Ludic" target="_blank" rel="noopener">ⓘ</a>
ID: ldac:Ludic

Language whose primary function is to be part of play, or a style of speech that involves a creative manipulation of the structures of the language. Examples of ludic discourse are play languages, jokes, secret languages, and speech disguises.

### <a id="defined-term-narrative"></a>Defined Term: Narrative <a href="https://w3id.org/ldac/terms#Narrative" target="_blank" rel="noopener">ⓘ</a>
ID: ldac:Narrative

A discourse, monologic or co-constructed, which represents temporally organised events. Types of narratives include historical, traditional, and personal narratives, myths, folktales, fables, and humorous stories.

### <a id="defined-term-oratory"></a>Defined Term: Oratory <a href="https://w3id.org/ldac/terms#Oratory" target="_blank" rel="noopener">ⓘ</a>
ID: ldac:Oratory

The art of public speaking, or of speaking eloquently according to rules or conventions. Examples of oratory include sermons, lectures, political speeches, and invocations.

### <a id="defined-term-procedural"></a>Defined Term: Procedural <a href="https://w3id.org/ldac/terms#Procedural" target="_blank" rel="noopener">ⓘ</a>
ID: ldac:Procedural

An explanation or description of a method, process, or situation having ordered steps.

### <a id="defined-term-report"></a>Defined Term: Report <a href="https://w3id.org/ldac/terms#Report" target="_blank" rel="noopener">ⓘ</a>
ID: ldac:Report

A factual account of some event or circumstance.

### <a id="defined-term-thesaurus"></a>Defined Term: Thesaurus <a href="https://w3id.org/ldac/terms#Thesaurus" target="_blank" rel="noopener">ⓘ</a>
ID: ldac:Thesaurus

The resource contains a list or data structure consisting of words or concepts arranged according to sense.


### <a id="defined-term-set-materialtypes"></a>Defined Term Set: MaterialTypes

ID: ldac:MaterialTypes

Set of defined terms for ldac:materialType

| Term | Description |
| ---- | ----------- |
### <a id="defined-term-annotation"></a>Defined Term: Annotation <a href="https://w3id.org/ldac/terms#Annotation" target="_blank" rel="noopener">ⓘ</a>
ID: ldac:Annotation

The resource includes material that adds information to some other linguistic record.

### <a id="defined-term-derivedmaterial"></a>Defined Term: DerivedMaterial <a href="https://w3id.org/ldac/terms#DerivedMaterial" target="_blank" rel="noopener">ⓘ</a>
ID: ldac:DerivedMaterial

This is derived from another source, such as a Primary Material, via some process, e.g. a downsampled video or a sample or an abstract of a resource that is not an annotation (an analysis or description).

### <a id="defined-term-primarymaterial"></a>Defined Term: PrimaryMaterial <a href="https://w3id.org/ldac/terms#PrimaryMaterial" target="_blank" rel="noopener">ⓘ</a>
ID: ldac:PrimaryMaterial

The object of study, such as a literary work, film, or recording of natural discourse.


### <a id="defined-term-set-writtenlanguagetypeterms"></a>Defined Term Set: WrittenLanguageTypeTerms

ID: ldac:WrittenLanguageTypeTerms

Set of defined terms for ldac:writtenLanguageFormat

| Term | Description |
| ---- | ----------- |
### <a id="defined-term-handwritten"></a>Defined Term: Handwritten <a href="https://w3id.org/ldac/terms#Handwritten" target="_blank" rel="noopener">ⓘ</a>
ID: ldac:Handwritten

The resource was written using a writing implement such as a pen, pencil, brush or computer stylus (except where the digital handwriting is converted to standard text).

### <a id="defined-term-typeset"></a>Defined Term: Typeset <a href="https://w3id.org/ldac/terms#Typeset" target="_blank" rel="noopener">ⓘ</a>
ID: ldac:Typeset

The resource has been formatted for printing or display.

### <a id="defined-term-typewritten"></a>Defined Term: Typewritten <a href="https://w3id.org/ldac/terms#Typewritten" target="_blank" rel="noopener">ⓘ</a>
ID: ldac:Typewritten

The resource contains text produced on a typewriter.






## Types of entities (specializations of Classes) and expected Properties


### <a id="class-collectionevent"></a> Class: CollectionEvent



Instances of this type MAY be present in the crate.

| Min Count | Max Count |
| --------- | --------- |
| N/A | N/A |

| Property | Required | Description | Range | Value |
| -------- | -------- | ----------- | ----- | ----- |
| @type | Yes |  |  | https://w3id.org/ldac/terms#CollectionEvent |
| <a href="#property-ldac-collectioneventtype">ldac:collectionEventType <a href="#property-ldac-collectioneventtype" target="_blank" rel="noopener">ⓘ</a></a> | No | A kind of CollectionEvent characterised by some specific procedures, e.g. a psycholinguistic experiment. | <a href="#class-collectioneventtypeterms">CollectionEventTypeTerms</a> |  |


### <a id="class-creativework"></a> Class: CreativeWork



Instances of this type MAY be present in the crate.

| Min Count | Max Count |
| --------- | --------- |
| N/A | N/A |

| Property | Required | Description | Range | Value |
| -------- | -------- | ----------- | ----- | ----- |
| @type | Yes |  |  | http://schema.org/CreativeWork |
| <a href="#property-author">author <a href="#property-author" target="_blank" rel="noopener">ⓘ</a></a> | No | The person or organisation responsible for creating this work. Authors should be identified using URIs such as ORCiD or ROR. | Text, <a href="#class-person">Person</a>, <a href="#class-organization">Organization</a> |  |
| <a href="#property-isbn">isbn <a href="#property-isbn" target="_blank" rel="noopener">ⓘ</a></a> | No | The ISBN for this work, if applicable. | Text |  |
| <a href="#property-issn">issn <a href="#property-issn" target="_blank" rel="noopener">ⓘ</a></a> | No | The ISSN for this publication. | Text |  |
| <a href="#property-ldac-annotationtype">ldac:annotationType <a href="#property-ldac-annotationtype" target="_blank" rel="noopener">ⓘ</a></a> | No | The type of an Annotation resource. | <a href="#class-annotationtypeterms">AnnotationTypeTerms</a> |  |
| <a href="#property-ldac-channels">ldac:channels <a href="#property-ldac-channels" target="_blank" rel="noopener">ⓘ</a></a> | No | The number of audio channels this resource contains (e.g. 1, 2, 5.1). | Text |  |
| <a href="#property-ldac-communicationmode">ldac:communicationMode <a href="#property-ldac-communicationmode" target="_blank" rel="noopener">ⓘ</a></a> | No | The mode (spoken, written, signed etc.) of this resource. There may be more than one value for this property. | <a href="#class-communicationmodeterms">CommunicationModeTerms</a> |  |
| <a href="#property-ldac-indexabletext">ldac:indexableText <a href="#property-ldac-indexabletext" target="_blank" rel="noopener">ⓘ</a></a> | No | One or more target File(s) that together contain the full text of an item – each file should indicate its language. | #class_MediaObject |  |
| <a href="#property-ldac-isdeidentified">ldac:isDeIdentified <a href="#property-ldac-isdeidentified" target="_blank" rel="noopener">ⓘ</a></a> | No | The data in this item has had potentially identifying information removed, which may include replacing names with pseudonyms. | Boolean |  |
| <a href="#property-ldac-linguisticgenre">ldac:linguisticGenre <a href="#property-ldac-linguisticgenre" target="_blank" rel="noopener">ⓘ</a></a> | No | A linguistic classification of the genre of this resource. | <a href="#class-linguisticgenreterms">LinguisticGenreTerms</a> |  |
| <a href="#property-ldac-material">ldac:material <a href="#property-ldac-material" target="_blank" rel="noopener">ⓘ</a></a> | No | Description of the original media, e.g. audio cassette tapes, participant questionnaires, field notes. | Text |  |
| <a href="#property-ldac-openaccessindex">ldac:openAccessIndex <a href="#property-ldac-openaccessindex" target="_blank" rel="noopener">ⓘ</a></a> | No | One or more public index types allowed by a license, e.g. FullText indexing may be allowed for discovery even when an item is not. | <a href="#class-indextypes">IndexTypes</a> |  |
| <a href="#property-ldac-register">ldac:register <a href="#property-ldac-register" target="_blank" rel="noopener">ⓘ</a></a> | No | The type of register (any of the varieties of a language that a speaker uses in a particular social context [Merriam-Webster]) of the contents of a language resource. | Text |  |
| <a href="#property-ldac-writtenlanguageformat">ldac:writtenLanguageFormat <a href="#property-ldac-writtenlanguageformat" target="_blank" rel="noopener">ⓘ</a></a> | No | The format of the resource resulting from the way the text was produced (handwritten, typeset, typewritten). | <a href="#class-writtenlanguagetypeterms">WrittenLanguageTypeTerms</a> |  |
| <a href="#property-publisher">publisher <a href="#property-publisher" target="_blank" rel="noopener">ⓘ</a></a> | No | The organisation that published this work. | Text, <a href="#class-organization">Organization</a> |  |
| <a href="#property-recipient">recipient <a href="#property-recipient" target="_blank" rel="noopener">ⓘ</a></a> | No | The person or organisation responsible for creating this work. Authors should be identified using URIs such as ORCiD or ROR. | Text, <a href="#class-person">Person</a>, <a href="#class-organization">Organization</a> |  |


### <a id="class-datadepositlicense"></a> Class: DataDepositLicense



Instances of this type MAY be present in the crate.

| Min Count | Max Count |
| --------- | --------- |
| N/A | N/A |

| Property | Required | Description | Range | Value |
| -------- | -------- | ----------- | ----- | ----- |
| @type | Yes |  |  | https://w3id.org/ldac/terms#DataDepositLicense |
*No properties defined for this class*



### <a id="class-datalicense"></a> Class: DataLicense



Instances of this type MAY be present in the crate.

| Min Count | Max Count |
| --------- | --------- |
| N/A | N/A |

| Property | Required | Description | Range | Value |
| -------- | -------- | ----------- | ----- | ----- |
| @type | Yes |  |  | https://w3id.org/ldac/terms#DataLicense |
| <a href="#property-ldac-reviewdate">ldac:reviewDate <a href="#property-ldac-reviewdate" target="_blank" rel="noopener">ⓘ</a></a> | No | The date that this license should be reviewed. | Text |  |


### <a id="class-datareuselicense"></a> Class: DataReuseLicense



Instances of this type MAY be present in the crate.

| Min Count | Max Count |
| --------- | --------- |
| N/A | N/A |

| Property | Required | Description | Range | Value |
| -------- | -------- | ----------- | ----- | ----- |
| @type | Yes |  |  | https://w3id.org/ldac/terms#DataReuseLicense |
| <a href="#property-ldac-access">ldac:access <a href="#property-ldac-access" target="_blank" rel="noopener">ⓘ</a></a> | No | Whether this is an open or restricted access license. | <a href="#class-accesstypes">AccessTypes</a> |  |
| <a href="#property-ldac-accesscontrollist">ldac:accessControlList <a href="#property-ldac-accesscontrollist" target="_blank" rel="noopener">ⓘ</a></a> | No | When a license has an authorizationWorkflow property with a value of the DefinedTerm AccessControlList this property has a URI value that points to a list of userIDs. | URL |  |
| <a href="#property-ldac-authorizationworkflow">ldac:authorizationWorkflow <a href="#property-ldac-authorizationworkflow" target="_blank" rel="noopener">ⓘ</a></a> | No | By what process a user is granted authorization to a license. | <a href="#class-authorizationworkflows">AuthorizationWorkflows</a> |  |


### <a id="class-dataset"></a> Class: Dataset



Instances of this type MAY be present in the crate.

| Min Count | Max Count |
| --------- | --------- |
| N/A | N/A |

| Property | Required | Description | Range | Value |
| -------- | -------- | ----------- | ----- | ----- |
| @type | Yes |  |  | http://schema.org/Dataset |
| <a href="#property-accountableperson">accountablePerson <a href="#property-accountableperson" target="_blank" rel="noopener">ⓘ</a></a> | Yes | The person or organisation who is the data steward for this resource. | <a href="#class-person">Person</a>, <a href="#class-organization">Organization</a> |  |
| <a href="#property-author">author <a href="#property-author" target="_blank" rel="noopener">ⓘ</a></a> | Yes | The person or organisation responsible for creating this collection of data. Authors should be identified using URIs such as ORCiD or ROR. | <a href="#class-person">Person</a>, <a href="#class-organization">Organization</a> |  |
| <a href="#property-dct-rightsholder">dct:rightsHolder <a href="#property-dct-rightsholder" target="_blank" rel="noopener">ⓘ</a></a> | Yes | The person or organisation owning or managing rights over the resource. | Text, <a href="#class-person">Person</a>, <a href="#class-organization">Organization</a> |  |
| <a href="#property-publisher">publisher <a href="#property-publisher" target="_blank" rel="noopener">ⓘ</a></a> | Yes | The organisation responsible for releasing this dataset. | <a href="#class-organization">Organization</a> |  |
| <a href="#property-citation">citation <a href="#property-citation" target="_blank" rel="noopener">ⓘ</a></a> | No | Associated publications. | <a href="#class-creativework">CreativeWork</a> |  |
| <a href="#property-credittext">creditText <a href="#property-credittext" target="_blank" rel="noopener">ⓘ</a></a> | No | A free text bibliographic citation for this material, e.g. 'Cite as: Musgrave (2023). Title of work. DOI'. | Text |  |
| <a href="#property-funder">funder <a href="#property-funder" target="_blank" rel="noopener">ⓘ</a></a> | No | The organisation(s) responsible for funding the creation or collection of this dataset. | <a href="#class-organization">Organization</a> |  |
| <a href="#property-haspart">hasPart <a href="#property-haspart" target="_blank" rel="noopener">ⓘ</a></a> | No | An item or CreativeWork that is part of this item, or CreativeWork (in some sense). | <a href="#class-creativework">CreativeWork</a>, <a href="#class-file">File</a>, <a href="#class-dataset">Dataset</a> |  |
| <a href="#property-isaccessibleforfree">isAccessibleForFree <a href="#property-isaccessibleforfree" target="_blank" rel="noopener">ⓘ</a></a> | No | This is available under an Open Access license. | Boolean |  |
| <a href="#property-isbasedon">isBasedOn <a href="#property-isbasedon" target="_blank" rel="noopener">ⓘ</a></a> | No | Link to or description of an original resource. | Text, URL, <a href="#class-creativework">CreativeWork</a>, <a href="#class-dataset">Dataset</a>, <a href="#class-file">File</a> |  |
| <a href="#property-ispartof">isPartOf <a href="#property-ispartof" target="_blank" rel="noopener">ⓘ</a></a> | No | An item or CreativeWork that this item, or CreativeWork (in some sense), is part of. | URL, <a href="#class-creativework">CreativeWork</a> |  |
| <a href="#property-ldac-annotationof">ldac:annotationOf <a href="#property-ldac-annotationof" target="_blank" rel="noopener">ⓘ</a></a> | No | This resource contains some kind of description that adds information to the resource it references. | #class_PrimaryMaterial |  |
| <a href="#property-ldac-annotator">ldac:annotator <a href="#property-ldac-annotator" target="_blank" rel="noopener">ⓘ</a></a> | No | The participant produced an annotation of this or a related resource. | <a href="#class-person">Person</a>, <a href="#class-organization">Organization</a> |  |
| <a href="#property-ldac-compiler">ldac:compiler <a href="#property-ldac-compiler" target="_blank" rel="noopener">ⓘ</a></a> | No | The participant is responsible for collecting the sub-parts of the resource together. | <a href="#class-person">Person</a>, <a href="#class-organization">Organization</a> |  |
| <a href="#property-ldac-consultant">ldac:consultant <a href="#property-ldac-consultant" target="_blank" rel="noopener">ⓘ</a></a> | No | The participant contributes expertise to the creation of a work, for example by contributing knowledge of their native language. | <a href="#class-person">Person</a>, <a href="#class-organization">Organization</a> |  |
| <a href="#property-ldac-datainputter">ldac:dataInputter <a href="#property-ldac-datainputter" target="_blank" rel="noopener">ⓘ</a></a> | No | The participant responsible for entering, re-typing, and/or structuring the data contained in the resource. | <a href="#class-person">Person</a>, <a href="#class-organization">Organization</a> |  |
| <a href="#property-ldac-depositor">ldac:depositor <a href="#property-ldac-depositor" target="_blank" rel="noopener">ⓘ</a></a> | No | The participant responsible for depositing the resource in an archive. | <a href="#class-person">Person</a>, <a href="#class-organization">Organization</a> |  |
| <a href="#property-ldac-developer">ldac:developer <a href="#property-ldac-developer" target="_blank" rel="noopener">ⓘ</a></a> | No | The participant developed the methodology or tools (including software) that constitute the resource, or that were used to create the resource. | <a href="#class-person">Person</a>, <a href="#class-organization">Organization</a> |  |
| <a href="#property-ldac-doi">ldac:doi <a href="#property-ldac-doi" target="_blank" rel="noopener">ⓘ</a></a> | No | A Digital Object Identifier, e.g. https://doi.org/10.1000/182. | Text |  |
| <a href="#property-ldac-editor">ldac:editor <a href="#property-ldac-editor" target="_blank" rel="noopener">ⓘ</a></a> | No | The participant reviewed, corrected, and/or tested the resource. | <a href="#class-person">Person</a>, <a href="#class-organization">Organization</a> |  |
| <a href="#property-ldac-hascollectionprotocol">ldac:hasCollectionProtocol <a href="#property-ldac-hascollectionprotocol" target="_blank" rel="noopener">ⓘ</a></a> | No | A link to a CollectionProtocol object with (at least) a summary of how resources were selected or elicited for this collection/sub-collection. | <a href="#class-ldac-collectionprotocol">ldac:CollectionProtocol</a> |  |
| <a href="#property-ldac-illustrator">ldac:illustrator <a href="#property-ldac-illustrator" target="_blank" rel="noopener">ⓘ</a></a> | No | The participant contributed drawings or other illustrations to the resource. | <a href="#class-person">Person</a>, <a href="#class-organization">Organization</a> |  |
| <a href="#property-ldac-interpreter">ldac:interpreter <a href="#property-ldac-interpreter" target="_blank" rel="noopener">ⓘ</a></a> | No | The contributor renders the discourse recorded in the resource into another language in real time, or the contributor explains the discourse recorded in the resource. | <a href="#class-person">Person</a>, <a href="#class-organization">Organization</a> |  |
| <a href="#property-ldac-interviewee">ldac:interviewee <a href="#property-ldac-interviewee" target="_blank" rel="noopener">ⓘ</a></a> | No | The participant was a respondent in an interview. | <a href="#class-person">Person</a>, <a href="#class-organization">Organization</a> |  |
| <a href="#property-ldac-interviewer">ldac:interviewer <a href="#property-ldac-interviewer" target="_blank" rel="noopener">ⓘ</a></a> | No | The participant conducted an interview that forms part of the resource. | <a href="#class-person">Person</a>, <a href="#class-organization">Organization</a> |  |
| <a href="#property-ldac-participant">ldac:participant <a href="#property-ldac-participant" target="_blank" rel="noopener">ⓘ</a></a> | No | The participant was present during the creation of the resource, but did not contribute substantially to its content. | <a href="#class-person">Person</a>, <a href="#class-organization">Organization</a> |  |
| <a href="#property-ldac-performer">ldac:performer <a href="#property-ldac-performer" target="_blank" rel="noopener">ⓘ</a></a> | No | The participant performed some portion of a recorded, filmed, or transcribed resource. It is recommended that this term be used only for creative participants whose role is not better indicated by a more specific term, such as 'speaker', 'signer', or 'singer'. | <a href="#class-person">Person</a>, <a href="#class-organization">Organization</a> |  |
| <a href="#property-ldac-photographer">ldac:photographer <a href="#property-ldac-photographer" target="_blank" rel="noopener">ⓘ</a></a> | No | The participant took the photograph, or shot the film, that appears in or constitutes the resource. | <a href="#class-person">Person</a>, <a href="#class-organization">Organization</a> |  |
| <a href="#property-ldac-recorder">ldac:recorder <a href="#property-ldac-recorder" target="_blank" rel="noopener">ⓘ</a></a> | No | The participant operated the recording machinery used to create the resource. | <a href="#class-person">Person</a>, <a href="#class-organization">Organization</a> |  |
| <a href="#property-ldac-researcher">ldac:researcher <a href="#property-ldac-researcher" target="_blank" rel="noopener">ⓘ</a></a> | No | The resource was created as part of the participant's research, or the research presents interim or final results from the participant's research. | <a href="#class-person">Person</a>, <a href="#class-organization">Organization</a> |  |
| <a href="#property-ldac-researchparticipant">ldac:researchParticipant <a href="#property-ldac-researchparticipant" target="_blank" rel="noopener">ⓘ</a></a> | No | The participant acted as a research subject or responded to a questionnaire, the results of which study form the basis of the resource. | <a href="#class-person">Person</a>, <a href="#class-organization">Organization</a> |  |
| <a href="#property-ldac-responder">ldac:responder <a href="#property-ldac-responder" target="_blank" rel="noopener">ⓘ</a></a> | No | The participant was an interlocutor in some sort of discourse event, but only reacted to the contributions of others. | <a href="#class-person">Person</a>, <a href="#class-organization">Organization</a> |  |
| <a href="#property-ldac-signer">ldac:signer <a href="#property-ldac-signer" target="_blank" rel="noopener">ⓘ</a></a> | No | The contributor was a principal signer in a resource that consists of a recording, a film, or a transcription of a recorded resource. Signers are those whose gestures predominate in a recorded or filmed resource. (The resource may be a transcription of that recording). | <a href="#class-person">Person</a>, <a href="#class-organization">Organization</a> |  |
| <a href="#property-ldac-singer">ldac:singer <a href="#property-ldac-singer" target="_blank" rel="noopener">ⓘ</a></a> | No | The participant sang, either individually or as part of a group, in a resource that consists of a recording, a film, or a transcription of a recorded resource. | <a href="#class-person">Person</a>, <a href="#class-organization">Organization</a> |  |
| <a href="#property-ldac-speaker">ldac:speaker <a href="#property-ldac-speaker" target="_blank" rel="noopener">ⓘ</a></a> | No | The contributor was a principal speaker in a resource that consists of a recording, a film, or a transcription of a recorded resource. Speakers are those whose voices predominate in a recorded or filmed resource. (The resource may be a transcription of that recording). | <a href="#class-person">Person</a>, <a href="#class-organization">Organization</a> |  |
| <a href="#property-ldac-sponsor">ldac:sponsor <a href="#property-ldac-sponsor" target="_blank" rel="noopener">ⓘ</a></a> | No | The participant contributed financial support to the creation of the resource. | <a href="#class-person">Person</a>, <a href="#class-organization">Organization</a> |  |
| <a href="#property-ldac-transcriber">ldac:transcriber <a href="#property-ldac-transcriber" target="_blank" rel="noopener">ⓘ</a></a> | No | The participant produced a transcription of this or a related resource. | <a href="#class-person">Person</a>, <a href="#class-organization">Organization</a> |  |
| <a href="#property-ldac-translator">ldac:translator <a href="#property-ldac-translator" target="_blank" rel="noopener">ⓘ</a></a> | No | The participant produced a translation of this or a related resource. | <a href="#class-person">Person</a>, <a href="#class-organization">Organization</a> |  |
| <a href="#property-pcdm-hasmember">pcdm:hasMember <a href="#property-pcdm-hasmember" target="_blank" rel="noopener">ⓘ</a></a> | No | The sub-collections, if any, associated with this collection. | <a href="#class-repositorycollection">RepositoryCollection</a>, <a href="#class-repositoryobject">RepositoryObject</a> |  |
| <a href="#property-pcdm-memberof">pcdm:memberOf <a href="#property-pcdm-memberof" target="_blank" rel="noopener">ⓘ</a></a> | No | Links from a Repository Object or Collection to a containing Repository Object or Collection. | <a href="#class-repositorycollection">RepositoryCollection</a> |  |
| <a href="#property-spatialcoverage">spatialCoverage <a href="#property-spatialcoverage" target="_blank" rel="noopener">ⓘ</a></a> | No | The place(s) that are the focus of the content. It is a sub-property of contentLocation intended primarily for more technical and detailed materials. For example, with a dataset, it indicates areas that the dataset describes: a dataset Cape York languages would have spatialCoverage which was the place: the outline of the Cape. | <a href="#class-place">Place</a> |  |
| <a href="#property-temporalcoverage">temporalCoverage <a href="#property-temporalcoverage" target="_blank" rel="noopener">ⓘ</a></a> | No | The range of years of creation for items in this dataset using a slash, e.g. 1900/1945. If there are sub-collections with different coverages put this on the sub-collections not the top-level. | DateTime, Text |  |
| <a href="#property-usageinfo">usageInfo <a href="#property-usageinfo" target="_blank" rel="noopener">ⓘ</a></a> | No | Additional information on licensing options for using the data, e.g. 'Contact the Data Steward to discuss license terms'. | Text |  |


### <a id="class-dct-collection"></a> Class: dct:Collection



Instances of this type MAY be present in the crate.

| Min Count | Max Count |
| --------- | --------- |
| N/A | N/A |

| Property | Required | Description | Range | Value |
| -------- | -------- | ----------- | ----- | ----- |
| @type | Yes |  |  | http://purl.org/dc/terms/Collection |
*No properties defined for this class*



### <a id="class-dct-dataset"></a> Class: dct:Dataset



Instances of this type MAY be present in the crate.

| Min Count | Max Count |
| --------- | --------- |
| N/A | N/A |

| Property | Required | Description | Range | Value |
| -------- | -------- | ----------- | ----- | ----- |
| @type | Yes |  |  | http://purl.org/dc/terms/Dataset |
*No properties defined for this class*



### <a id="class-dct-event"></a> Class: dct:Event



Instances of this type MAY be present in the crate.

| Min Count | Max Count |
| --------- | --------- |
| N/A | N/A |

| Property | Required | Description | Range | Value |
| -------- | -------- | ----------- | ----- | ----- |
| @type | Yes |  |  | http://purl.org/dc/terms/Event |
*No properties defined for this class*



### <a id="class-dct-image"></a> Class: dct:Image



Instances of this type MAY be present in the crate.

| Min Count | Max Count |
| --------- | --------- |
| N/A | N/A |

| Property | Required | Description | Range | Value |
| -------- | -------- | ----------- | ----- | ----- |
| @type | Yes |  |  | http://purl.org/dc/terms/Image |
*No properties defined for this class*



### <a id="class-dct-interactiveresource"></a> Class: dct:InteractiveResource



Instances of this type MAY be present in the crate.

| Min Count | Max Count |
| --------- | --------- |
| N/A | N/A |

| Property | Required | Description | Range | Value |
| -------- | -------- | ----------- | ----- | ----- |
| @type | Yes |  |  | http://purl.org/dc/terms/InteractiveResource |
*No properties defined for this class*



### <a id="class-dct-movingimage"></a> Class: dct:MovingImage



Instances of this type MAY be present in the crate.

| Min Count | Max Count |
| --------- | --------- |
| N/A | N/A |

| Property | Required | Description | Range | Value |
| -------- | -------- | ----------- | ----- | ----- |
| @type | Yes |  |  | http://purl.org/dc/terms/MovingImage |
*No properties defined for this class*



### <a id="class-dct-physicalobject"></a> Class: dct:PhysicalObject



Instances of this type MAY be present in the crate.

| Min Count | Max Count |
| --------- | --------- |
| N/A | N/A |

| Property | Required | Description | Range | Value |
| -------- | -------- | ----------- | ----- | ----- |
| @type | Yes |  |  | http://purl.org/dc/terms/PhysicalObject |
*No properties defined for this class*



### <a id="class-dct-service"></a> Class: dct:Service



Instances of this type MAY be present in the crate.

| Min Count | Max Count |
| --------- | --------- |
| N/A | N/A |

| Property | Required | Description | Range | Value |
| -------- | -------- | ----------- | ----- | ----- |
| @type | Yes |  |  | http://purl.org/dc/terms/Service |
*No properties defined for this class*



### <a id="class-dct-software"></a> Class: dct:Software



Instances of this type MAY be present in the crate.

| Min Count | Max Count |
| --------- | --------- |
| N/A | N/A |

| Property | Required | Description | Range | Value |
| -------- | -------- | ----------- | ----- | ----- |
| @type | Yes |  |  | http://purl.org/dc/terms/Software |
*No properties defined for this class*



### <a id="class-dct-sound"></a> Class: dct:Sound



Instances of this type MAY be present in the crate.

| Min Count | Max Count |
| --------- | --------- |
| N/A | N/A |

| Property | Required | Description | Range | Value |
| -------- | -------- | ----------- | ----- | ----- |
| @type | Yes |  |  | http://purl.org/dc/terms/Sound |
*No properties defined for this class*



### <a id="class-dct-stillimage"></a> Class: dct:StillImage



Instances of this type MAY be present in the crate.

| Min Count | Max Count |
| --------- | --------- |
| N/A | N/A |

| Property | Required | Description | Range | Value |
| -------- | -------- | ----------- | ----- | ----- |
| @type | Yes |  |  | http://purl.org/dc/terms/StillImage |
*No properties defined for this class*



### <a id="class-dct-text"></a> Class: dct:Text



Instances of this type MAY be present in the crate.

| Min Count | Max Count |
| --------- | --------- |
| N/A | N/A |

| Property | Required | Description | Range | Value |
| -------- | -------- | ----------- | ----- | ----- |
| @type | Yes |  |  | http://purl.org/dc/terms/Text |
*No properties defined for this class*



### <a id="class-file"></a> Class: File



Instances of this type MAY be present in the crate.

| Min Count | Max Count |
| --------- | --------- |
| N/A | N/A |

| Property | Required | Description | Range | Value |
| -------- | -------- | ----------- | ----- | ----- |
| @type | Yes |  |  | http://schema.org/MediaObject |
| <a href="#property-contentsize">contentSize <a href="#property-contentsize" target="_blank" rel="noopener">ⓘ</a></a> | No | File size in (mega/kilo)bytes. | Text |  |
| <a href="#property-encodingformat">encodingFormat <a href="#property-encodingformat" target="_blank" rel="noopener">ⓘ</a></a> | No | The media type typically expressed using a MIME format. | Text, #class_WebPage, #class_Standard |  |
| <a href="#property-haspart">hasPart <a href="#property-haspart" target="_blank" rel="noopener">ⓘ</a></a> | No | An item or CreativeWork that is part of this item, or CreativeWork (in some sense). | <a href="#class-creativework">CreativeWork</a>, <a href="#class-file">File</a> |  |
| <a href="#property-ldac-derivationof">ldac:derivationOf <a href="#property-ldac-derivationof" target="_blank" rel="noopener">ⓘ</a></a> | No | This property references another resource from which the current resource is derived, e.g. downsampling audio or video files, or extracting text from a PDF. | #class_Annotation, #class_PrimaryMaterial |  |
| <a href="#property-ldac-hasderivation">ldac:hasDerivation <a href="#property-ldac-hasderivation" target="_blank" rel="noopener">ⓘ</a></a> | No | This property references another resource that is derived from it, such as a downsampled audio or video file, or text extracted from a PDF. | #class_DerivedMaterial |  |
| <a href="#property-ldac-materialtype">ldac:materialType <a href="#property-ldac-materialtype" target="_blank" rel="noopener">ⓘ</a></a> | No | Indicates whether the material in a file is the original (primary) source or is derived from it or describes it via annotation. | <a href="#class-materialtypes">MaterialTypes</a> |  |


### <a id="class-geometry"></a> Class: Geometry



Instances of this type MAY be present in the crate.

| Min Count | Max Count |
| --------- | --------- |
| N/A | N/A |

| Property | Required | Description | Range | Value |
| -------- | -------- | ----------- | ----- | ----- |
| @type | Yes |  |  | http://www.opengis.net/ont/geosparql#Geometry |
| <a href="#property-geosparql-aswkt">geosparql:asWKT <a href="#property-geosparql-aswkt" target="_blank" rel="noopener">ⓘ</a></a> | No | The WKT serialisation of the geometry. | Text |  |


### <a id="class-language"></a> Class: Language



Instances of this type MAY be present in the crate.

| Min Count | Max Count |
| --------- | --------- |
| N/A | N/A |

| Property | Required | Description | Range | Value |
| -------- | -------- | ----------- | ----- | ----- |
| @type | Yes |  |  | http://schema.org/Language |
*No properties defined for this class*



### <a id="class-ldac-collectionprotocol"></a> Class: ldac:CollectionProtocol



Instances of this type MAY be present in the crate.

| Min Count | Max Count |
| --------- | --------- |
| N/A | N/A |

| Property | Required | Description | Range | Value |
| -------- | -------- | ----------- | ----- | ----- |
| @type | Yes |  |  | https://w3id.org/ldac/terms#CollectionProtocol |
| <a href="#property-ldac-collectionprotocoltype">ldac:collectionProtocolType <a href="#property-ldac-collectionprotocoltype" target="_blank" rel="noopener">ⓘ</a></a> | No | A description of the process used to collect or collate data, such as prompts given to participants, or how texts are selected for inclusion in a collection. | <a href="#class-collectionprotocoltypeterms">CollectionProtocolTypeTerms</a> |  |


### <a id="class-organization"></a> Class: Organization



Instances of this type MAY be present in the crate.

| Min Count | Max Count |
| --------- | --------- |
| N/A | N/A |

| Property | Required | Description | Range | Value |
| -------- | -------- | ----------- | ----- | ----- |
| @type | Yes |  |  | http://schema.org/Organization |
| <a href="#property-location">location <a href="#property-location" target="_blank" rel="noopener">ⓘ</a></a> | No | A location for the organisation, e.g. a city for a publisher. | Text |  |


### <a id="class-person"></a> Class: Person



Instances of this type MAY be present in the crate.

| Min Count | Max Count |
| --------- | --------- |
| N/A | N/A |

| Property | Required | Description | Range | Value |
| -------- | -------- | ----------- | ----- | ----- |
| @type | Yes |  |  | http://schema.org/Person |
| <a href="#property-affiliation">affiliation <a href="#property-affiliation" target="_blank" rel="noopener">ⓘ</a></a> | No | The organisation that this person is affiliated with. For example, a university or school. | <a href="#class-organization">Organization</a> |  |
| <a href="#property-ldac-age">ldac:age <a href="#property-ldac-age" target="_blank" rel="noopener">ⓘ</a></a> | No | The age of a person. If an age is specified, a specializationOf pointing to a 'canonical' ageless version of that Person can also be included. | Text |  |


### <a id="class-place"></a> Class: Place



Instances of this type MAY be present in the crate.

| Min Count | Max Count |
| --------- | --------- |
| N/A | N/A |

| Property | Required | Description | Range | Value |
| -------- | -------- | ----------- | ----- | ----- |
| @type | Yes |  |  | http://schema.org/Place |
| <a href="#property-address">address <a href="#property-address" target="_blank" rel="noopener">ⓘ</a></a> | No | The physical address of the place. | Text |  |
| <a href="#property-geo">geo <a href="#property-geo" target="_blank" rel="noopener">ⓘ</a></a> | No | The geographic coordinates of the place. | <a href="#class-geometry">Geometry</a> |  |


### <a id="class-repositorycollection"></a> Class: RepositoryCollection



Instances of this type MAY be present in the crate.

| Min Count | Max Count |
| --------- | --------- |
| N/A | N/A |

| Property | Required | Description | Range | Value |
| -------- | -------- | ----------- | ----- | ----- |
| @type | Yes |  |  | http://pcdm.org/models#Collection |
| <a href="#property-inlanguage">inLanguage <a href="#property-inlanguage" target="_blank" rel="noopener">ⓘ</a></a> | Yes | The language in which the resource is written. | <a href="#class-language">Language</a> |  |
| <a href="#property-conformsto">conformsTo <a href="#property-conformsto" target="_blank" rel="noopener">ⓘ</a></a> | No | A link to the language data commons RO-Crate profile for collections. | <a href="#class-values-for-conformsto">Values for conformsTo</a> |  |
| <a href="#property-contentlocation">contentLocation <a href="#property-contentlocation" target="_blank" rel="noopener">ⓘ</a></a> | No | The location depicted or described in the content. For example, the location in a photograph or painting. | <a href="#class-place">Place</a> |  |
| <a href="#property-datecreated">dateCreated <a href="#property-datecreated" target="_blank" rel="noopener">ⓘ</a></a> | No | The (earliest) date the data in this dataset were created. | Date |  |
| <a href="#property-holdingarchive">holdingArchive <a href="#property-holdingarchive" target="_blank" rel="noopener">ⓘ</a></a> | No | Organisation where the original of this work or collection is housed. | <a href="#class-organization">Organization</a>, Text |  |
| <a href="#property-ldac-datefreetext">ldac:dateFreeText <a href="#property-ldac-datefreetext" target="_blank" rel="noopener">ⓘ</a></a> | No | Date information which cannot be put in one of the standard date formats, e.g. 'mid-1970s', or it is not clear, for example, if it is a creation or publication date. | Text |  |
| <a href="#property-ldac-itemlocation">ldac:itemLocation <a href="#property-ldac-itemlocation" target="_blank" rel="noopener">ⓘ</a></a> | No | Current location of the item, e.g. where a set of audio tapes are stored. | <a href="#class-place">Place</a>, <a href="#class-organization">Organization</a> |  |
| <a href="#property-ldac-subjectlanguage">ldac:subjectLanguage <a href="#property-ldac-subjectlanguage" target="_blank" rel="noopener">ⓘ</a></a> | No | The languages that the materials in the collection are about (not the language that it is in). | <a href="#class-language">Language</a> |  |


### <a id="class-repositoryobject"></a> Class: RepositoryObject



Instances of this type MAY be present in the crate.

| Min Count | Max Count |
| --------- | --------- |
| N/A | N/A |

| Property | Required | Description | Range | Value |
| -------- | -------- | ----------- | ----- | ----- |
| @type | Yes |  |  | http://pcdm.org/models#Object |
| <a href="#property-conformsto">conformsTo <a href="#property-conformsto" target="_blank" rel="noopener">ⓘ</a></a> | No | A link to the language data commons RO-Crate profile for collections. | Text |  |
| <a href="#property-creator">creator <a href="#property-creator" target="_blank" rel="noopener">ⓘ</a></a> | No | The creator/author of this CreativeWork. This is the same as the Author property for CreativeWork. | <a href="#class-person">Person</a> |  |
| <a href="#property-datecreated">dateCreated <a href="#property-datecreated" target="_blank" rel="noopener">ⓘ</a></a> | No | The date on which the CreativeWork was created or the item was added to a DataFeed. | Text |  |
| <a href="#property-description">description <a href="#property-description" target="_blank" rel="noopener">ⓘ</a></a> | No | A description of the item. | Text |  |
| <a href="#property-identifier">identifier <a href="#property-identifier" target="_blank" rel="noopener">ⓘ</a></a> | No | The identifier property represents any kind of identifier for any kind of [[Thing]], such as ISBNs, GTIN codes, UUIDs etc. Schema.org provides dedicated properties for representing many of these, either as textual strings or as URL (URI) links. See [background notes](/docs/datamodel.html#identifierBg) for more details.  | #class_PropertyValue, Text, URL |  |
| <a href="#property-ldac-hasannotation">ldac:hasAnnotation <a href="#property-ldac-hasannotation" target="_blank" rel="noopener">ⓘ</a></a> | No | This resource is referenced by another resource that adds information to it such as a translation, transcription or other analysis. | #class_Annotation |  |
| <a href="#property-license">license <a href="#property-license" target="_blank" rel="noopener">ⓘ</a></a> | No | A license document that applies to this content, typically indicated by URL. | <a href="#class-datareuselicense">DataReuseLicense</a> |  |
| <a href="#property-temporalcoverage">temporalCoverage <a href="#property-temporalcoverage" target="_blank" rel="noopener">ⓘ</a></a> | No | The temporalCoverage of a CreativeWork indicates the period that the content applies to, i.e. that it describes, either as a DateTime or as a textual string indicating a time period in [ISO 8601 time interval format](https://en.wikipedia.org/wiki/ISO_8601#Time_intervals). In the case of a Dataset it will typically indicate the relevant time period in a precise notation (e.g. for a 2011 census dataset, the year 2011 would be written "2011/2012"). Other forms of content, e.g. ScholarlyArticle, Book, TVSeries or TVEpisode, may indicate their temporalCoverage in broader terms - textually or via well-known URL. Written works such as books may sometimes have precise temporal coverage too, e.g. a work set in 1939 - 1945 can be indicated in ISO 8601 interval format format via "1939/1945". Open-ended date ranges can be written with ".." in place of the end date. For example, "2015-11/.." indicates a range beginning in November 2015 and with no specified final date. This is tentative and might be updated in future when ISO 8601 is officially updated. | Text |  |


### <a id="class-ro-crate-metadata-descriptor"></a> Class: RO-Crate Metadata Descriptor

An RO-Crate @graph must contain an entity of Type @CreativeWork which is known as the RO-Crate Metadata descriptor.

At least 1 instances of this type MUST be present in the crate.

 A maximum of 1 instances of this type  MAY be present in the crate.

| Min Count | Max Count |
| --------- | --------- |
| 1 | 1 |

| Property | Required | Description | Range | Value |
| -------- | -------- | ----------- | ----- | ----- |
| @type | Yes |  |  | http://schema.org/CreativeWork |
| <a href="#property-id">@id</a> | Yes | The RO-Crate Metadata file identifier | <a href="#class-root-data-entity">Root Data Entity</a> | ro-crate-metadata.json |
| <a href="#property-about">about <a href="#property-about" target="_blank" rel="noopener">ⓘ</a></a> | Yes | This property on the RO-Crate Metadata Descriptor references the Root Data Entity. In a SoSS+ profile there may be Schemas present for more than one 'flavour' of Root Data Entity with different @type arrays or `@conformsTo` references (or other specializations). | <a href="#class-root-data-entity">Root Data Entity</a> |  |


### <a id="class-root-data-entity"></a> Class: Root Data Entity

The Root Data Entity for an RO-Crate. This is the main entity of the RO-Crate and is the one that is referenced by the RO-Crate Metadata Descriptor. In this profile, it is a Dataset and RepositoryCollection.

At least 1 instances of this type MUST be present in the crate.

 A maximum of 1 instances of this type  MAY be present in the crate.

| Min Count | Max Count |
| --------- | --------- |
| 1 | 1 |

| Property | Required | Description | Range | Value |
| -------- | -------- | ----------- | ----- | ----- |
| @type | Yes |  |  | http://schema.org/Dataset, http://pcdm.org/models#Collection |
| <a href="#property-datepublished">datePublished <a href="#property-datepublished" target="_blank" rel="noopener">ⓘ</a></a> | Yes | A date that this collection was published. This should be the date that the collection was first made available. | Date |  |
| <a href="#property-description">description <a href="#property-description" target="_blank" rel="noopener">ⓘ</a></a> | Yes | An abstract of the collection. Include as much detail as possible about the motivation and use of the collection. | Text |  |
| <a href="#property-license">license <a href="#property-license" target="_blank" rel="noopener">ⓘ</a></a> | Yes | A license document that applies to this content, typically indicated by URL. | <a href="#class-datareuselicense">DataReuseLicense</a>, URL, Text |  |
| <a href="#property-name">name <a href="#property-name" target="_blank" rel="noopener">ⓘ</a></a> | Yes | The name of this data collection. | Text |  |

## All Properties

### <a id="property-id"></a> Property: @id

ID: #RO-Crate_Metadata_Descriptor.id

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| The RO-Crate Metadata file identifier | <a href="#class-root-data-entity">Root Data Entity</a> | <a href="#class-ro-crate-metadata-descriptor">RO-Crate Metadata Descriptor</a> |
### <a id="property-about"></a> Property: about <a href="http://schema.org/about" target="_blank" rel="noopener">ⓘ</a>

ID: #RO-Crate_Metadata_Descriptor.about

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| This property on the RO-Crate Metadata Descriptor references the Root Data Entity. In a SoSS+ profile there may be Schemas present for more than one 'flavour' of Root Data Entity with different @type arrays or `@conformsTo` references (or other specializations). | <a href="#class-root-data-entity">Root Data Entity</a> | <a href="#class-ro-crate-metadata-descriptor">RO-Crate Metadata Descriptor</a> |
### <a id="property-accountableperson"></a> Property: accountablePerson <a href="http://schema.org/accountablePerson" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_accountablePerson_Dataset

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| The person or organisation who is the data steward for this resource. | <a href="#class-person">Person</a>, <a href="#class-organization">Organization</a> | <a href="#class-dataset">Dataset</a> |
### <a id="property-address"></a> Property: address <a href="http://schema.org/address" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_address_Place

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| The physical address of the place. | Text | <a href="#class-place">Place</a> |
### <a id="property-affiliation"></a> Property: affiliation <a href="http://schema.org/affiliation" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_affiliation_Person

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| The organisation that this person is affiliated with. For example, a university or school. | <a href="#class-organization">Organization</a> | <a href="#class-person">Person</a> |
### <a id="property-author"></a> Property: author <a href="http://schema.org/author" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_author_CreativeWork

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| The person or organisation responsible for creating this work. Authors should be identified using URIs such as ORCiD or ROR. | Text, <a href="#class-person">Person</a>, <a href="#class-organization">Organization</a> | <a href="#class-creativework">CreativeWork</a> |
### <a id="property-author"></a> Property: author <a href="http://schema.org/author" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_author_Dataset

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| The person or organisation responsible for creating this collection of data. Authors should be identified using URIs such as ORCiD or ROR. | <a href="#class-person">Person</a>, <a href="#class-organization">Organization</a> | <a href="#class-dataset">Dataset</a> |
### <a id="property-citation"></a> Property: citation <a href="http://schema.org/citation" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_citation_Dataset

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| Associated publications. | <a href="#class-creativework">CreativeWork</a> | <a href="#class-dataset">Dataset</a> |
### <a id="property-conformsto"></a> Property: conformsTo <a href="http://purl.org/dc/terms/conformsTo" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_conformsTo_RepositoryCollection

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| A link to the language data commons RO-Crate profile for collections. | <a href="#class-values-for-conformsto">Values for conformsTo</a> | <a href="#class-repositorycollection">RepositoryCollection</a> |
### <a id="property-conformsto"></a> Property: conformsTo <a href="http://purl.org/dc/terms/conformsTo" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_conformsTo_RepositoryObject

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| A link to the language data commons RO-Crate profile for collections. | Text | <a href="#class-repositoryobject">RepositoryObject</a> |
### <a id="property-contentlocation"></a> Property: contentLocation <a href="http://schema.org/contentLocation" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_contentLocation_RepositoryCollection

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| The location depicted or described in the content. For example, the location in a photograph or painting. | <a href="#class-place">Place</a> | <a href="#class-repositorycollection">RepositoryCollection</a> |
### <a id="property-contentsize"></a> Property: contentSize <a href="http://schema.org/contentSize" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_contentSize_File

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| File size in (mega/kilo)bytes. | Text | <a href="#class-file">File</a> |
### <a id="property-creator"></a> Property: creator <a href="http://schema.org/creator" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_creator_RepositoryObject

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| The creator/author of this CreativeWork. This is the same as the Author property for CreativeWork. | <a href="#class-person">Person</a> | <a href="#class-repositoryobject">RepositoryObject</a> |
### <a id="property-credittext"></a> Property: creditText <a href="http://schema.org/creditText" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_creditText_Dataset

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| A free text bibliographic citation for this material, e.g. 'Cite as: Musgrave (2023). Title of work. DOI'. | Text | <a href="#class-dataset">Dataset</a> |
### <a id="property-datecreated"></a> Property: dateCreated <a href="http://schema.org/dateCreated" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_dateCreated_RepositoryCollection

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| The (earliest) date the data in this dataset were created. | Date | <a href="#class-repositorycollection">RepositoryCollection</a> |
### <a id="property-datecreated"></a> Property: dateCreated <a href="http://schema.org/dateCreated" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_dateCreated_RepositoryObject

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| The date on which the CreativeWork was created or the item was added to a DataFeed. | Text | <a href="#class-repositoryobject">RepositoryObject</a> |
### <a id="property-datepublished"></a> Property: datePublished <a href="http://schema.org/datePublished" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_datePublished_Dataset

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| A date that this collection was published. This should be the date that the collection was first made available. | Date | <a href="#class-root-data-entity">Root Data Entity</a> |
### <a id="property-dct-rightsholder"></a> Property: dct:rightsHolder <a href="http://purl.org/dc/terms/rightsHolder" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_dct:rightsHolder_Dataset

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| The person or organisation owning or managing rights over the resource. | Text, <a href="#class-person">Person</a>, <a href="#class-organization">Organization</a> | <a href="#class-dataset">Dataset</a> |
### <a id="property-description"></a> Property: description <a href="http://schema.org/description" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_description_Dataset

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| An abstract of the collection. Include as much detail as possible about the motivation and use of the collection. | Text | <a href="#class-root-data-entity">Root Data Entity</a> |
### <a id="property-description"></a> Property: description <a href="http://schema.org/description" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_description_RepositoryObject

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| A description of the item. | Text | <a href="#class-repositoryobject">RepositoryObject</a> |
### <a id="property-encodingformat"></a> Property: encodingFormat <a href="http://schema.org/encodingFormat" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_encodingFormat_File

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| The media type typically expressed using a MIME format. | Text, #class_WebPage, #class_Standard | <a href="#class-file">File</a> |
### <a id="property-funder"></a> Property: funder <a href="http://schema.org/funder" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_funder_Dataset

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| The organisation(s) responsible for funding the creation or collection of this dataset. | <a href="#class-organization">Organization</a> | <a href="#class-dataset">Dataset</a> |
### <a id="property-geo"></a> Property: geo <a href="http://schema.org/geo" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_geo_Place

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| The geographic coordinates of the place. | <a href="#class-geometry">Geometry</a> | <a href="#class-place">Place</a> |
### <a id="property-geosparql-aswkt"></a> Property: geosparql:asWKT <a href="http://www.opengis.net/ont/geosparql#asWKT" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_geosparql:asWKT_Geometry

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| The WKT serialisation of the geometry. | Text | <a href="#class-geometry">Geometry</a> |
### <a id="property-haspart"></a> Property: hasPart <a href="http://schema.org/hasPart" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_hasPart_Dataset

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| An item or CreativeWork that is part of this item, or CreativeWork (in some sense). | <a href="#class-creativework">CreativeWork</a>, <a href="#class-file">File</a>, <a href="#class-dataset">Dataset</a> | <a href="#class-dataset">Dataset</a> |
### <a id="property-haspart"></a> Property: hasPart <a href="http://schema.org/hasPart" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_hasPart_File

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| An item or CreativeWork that is part of this item, or CreativeWork (in some sense). | <a href="#class-creativework">CreativeWork</a>, <a href="#class-file">File</a> | <a href="#class-file">File</a> |
### <a id="property-holdingarchive"></a> Property: holdingArchive <a href="http://schema.org/holdingArchive" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_holdingArchive_RepositoryCollection

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| Organisation where the original of this work or collection is housed. | <a href="#class-organization">Organization</a>, Text | <a href="#class-repositorycollection">RepositoryCollection</a> |
### <a id="property-identifier"></a> Property: identifier <a href="http://schema.org/identifier" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_identifier_RepositoryObject

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| The identifier property represents any kind of identifier for any kind of [[Thing]], such as ISBNs, GTIN codes, UUIDs etc. Schema.org provides dedicated properties for representing many of these, either as textual strings or as URL (URI) links. See [background notes](/docs/datamodel.html#identifierBg) for more details.  | #class_PropertyValue, Text, URL | <a href="#class-repositoryobject">RepositoryObject</a> |
### <a id="property-inlanguage"></a> Property: inLanguage <a href="http://schema.org/inLanguage" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_inLanguage_RepositoryCollection

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| The language in which the resource is written. | <a href="#class-language">Language</a> | <a href="#class-repositorycollection">RepositoryCollection</a> |
### <a id="property-isaccessibleforfree"></a> Property: isAccessibleForFree <a href="http://schema.org/isAccessibleForFree" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_isAccessibleForFree_Dataset

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| This is available under an Open Access license. | Boolean | <a href="#class-dataset">Dataset</a> |
### <a id="property-isbasedon"></a> Property: isBasedOn <a href="http://schema.org/isBasedOn" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_isBasedOn_Dataset

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| Link to or description of an original resource. | Text, URL, <a href="#class-creativework">CreativeWork</a>, <a href="#class-dataset">Dataset</a>, <a href="#class-file">File</a> | <a href="#class-dataset">Dataset</a> |
### <a id="property-isbn"></a> Property: isbn <a href="http://schema.org/isbn" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_isbn_CreativeWork

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| The ISBN for this work, if applicable. | Text | <a href="#class-creativework">CreativeWork</a> |
### <a id="property-ispartof"></a> Property: isPartOf <a href="http://schema.org/isPartOf" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_isPartOf_Dataset

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| An item or CreativeWork that this item, or CreativeWork (in some sense), is part of. | URL, <a href="#class-creativework">CreativeWork</a> | <a href="#class-dataset">Dataset</a> |
### <a id="property-issn"></a> Property: issn <a href="http://schema.org/issn" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_issn_CreativeWork

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| The ISSN for this publication. | Text | <a href="#class-creativework">CreativeWork</a> |
### <a id="property-ldac-access"></a> Property: ldac:access <a href="https://w3id.org/ldac/terms#access" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_ldac:access_DataReuseLicense

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| Whether this is an open or restricted access license. | <a href="#class-accesstypes">AccessTypes</a> | <a href="#class-datareuselicense">DataReuseLicense</a> |
### <a id="property-ldac-accesscontrollist"></a> Property: ldac:accessControlList <a href="https://w3id.org/ldac/terms#accessControlList" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_ldac:accessControlList_DataReuseLicense

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| When a license has an authorizationWorkflow property with a value of the DefinedTerm AccessControlList this property has a URI value that points to a list of userIDs. | URL | <a href="#class-datareuselicense">DataReuseLicense</a> |
### <a id="property-ldac-age"></a> Property: ldac:age <a href="https://w3id.org/ldac/terms#age" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_ldac:age_Person

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| The age of a person. If an age is specified, a specializationOf pointing to a 'canonical' ageless version of that Person can also be included. | Text | <a href="#class-person">Person</a> |
### <a id="property-ldac-annotationof"></a> Property: ldac:annotationOf <a href="https://w3id.org/ldac/terms#annotationOf" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_ldac:annotationOf_Dataset

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| This resource contains some kind of description that adds information to the resource it references. | #class_PrimaryMaterial | <a href="#class-dataset">Dataset</a> |
### <a id="property-ldac-annotationtype"></a> Property: ldac:annotationType <a href="https://w3id.org/ldac/terms#annotationType" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_ldac:annotationType_CreativeWork

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| The type of an Annotation resource. | <a href="#class-annotationtypeterms">AnnotationTypeTerms</a> | <a href="#class-creativework">CreativeWork</a> |
### <a id="property-ldac-annotator"></a> Property: ldac:annotator <a href="https://w3id.org/ldac/terms#annotator" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_ldac:annotator_Dataset

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| The participant produced an annotation of this or a related resource. | <a href="#class-person">Person</a>, <a href="#class-organization">Organization</a> | <a href="#class-dataset">Dataset</a> |
### <a id="property-ldac-authorizationworkflow"></a> Property: ldac:authorizationWorkflow <a href="https://w3id.org/ldac/terms#authorizationWorkflow" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_ldac:authorizationWorkflow_DataReuseLicense

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| By what process a user is granted authorization to a license. | <a href="#class-authorizationworkflows">AuthorizationWorkflows</a> | <a href="#class-datareuselicense">DataReuseLicense</a> |
### <a id="property-ldac-channels"></a> Property: ldac:channels <a href="https://w3id.org/ldac/terms#channels" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_ldac:channels_CreativeWork

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| The number of audio channels this resource contains (e.g. 1, 2, 5.1). | Text | <a href="#class-creativework">CreativeWork</a> |
### <a id="property-ldac-collectioneventtype"></a> Property: ldac:collectionEventType <a href="https://w3id.org/ldac/terms#collectionEventType" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_ldac:collectionEventType_CollectionEvent

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| A kind of CollectionEvent characterised by some specific procedures, e.g. a psycholinguistic experiment. | <a href="#class-collectioneventtypeterms">CollectionEventTypeTerms</a> | <a href="#class-collectionevent">CollectionEvent</a> |
### <a id="property-ldac-collectionprotocoltype"></a> Property: ldac:collectionProtocolType <a href="https://w3id.org/ldac/terms#collectionProtocolType" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_ldac:collectionProtocolType_ldac:CollectionProtocol

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| A description of the process used to collect or collate data, such as prompts given to participants, or how texts are selected for inclusion in a collection. | <a href="#class-collectionprotocoltypeterms">CollectionProtocolTypeTerms</a> | <a href="#class-ldac-collectionprotocol">ldac:CollectionProtocol</a> |
### <a id="property-ldac-communicationmode"></a> Property: ldac:communicationMode <a href="https://w3id.org/ldac/terms#communicationMode" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_ldac:communicationMode_CreativeWork

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| The mode (spoken, written, signed etc.) of this resource. There may be more than one value for this property. | <a href="#class-communicationmodeterms">CommunicationModeTerms</a> | <a href="#class-creativework">CreativeWork</a> |
### <a id="property-ldac-compiler"></a> Property: ldac:compiler <a href="https://w3id.org/ldac/terms#compiler" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_ldac:compiler_Dataset

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| The participant is responsible for collecting the sub-parts of the resource together. | <a href="#class-person">Person</a>, <a href="#class-organization">Organization</a> | <a href="#class-dataset">Dataset</a> |
### <a id="property-ldac-consultant"></a> Property: ldac:consultant <a href="https://w3id.org/ldac/terms#consultant" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_ldac:consultant_Dataset

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| The participant contributes expertise to the creation of a work, for example by contributing knowledge of their native language. | <a href="#class-person">Person</a>, <a href="#class-organization">Organization</a> | <a href="#class-dataset">Dataset</a> |
### <a id="property-ldac-datainputter"></a> Property: ldac:dataInputter <a href="https://w3id.org/ldac/terms#dataInputter" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_ldac:dataInputter_Dataset

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| The participant responsible for entering, re-typing, and/or structuring the data contained in the resource. | <a href="#class-person">Person</a>, <a href="#class-organization">Organization</a> | <a href="#class-dataset">Dataset</a> |
### <a id="property-ldac-datefreetext"></a> Property: ldac:dateFreeText <a href="https://w3id.org/ldac/terms#dateFreeText" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_ldac:dateFreeText_RepositoryCollection

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| Date information which cannot be put in one of the standard date formats, e.g. 'mid-1970s', or it is not clear, for example, if it is a creation or publication date. | Text | <a href="#class-repositorycollection">RepositoryCollection</a> |
### <a id="property-ldac-depositor"></a> Property: ldac:depositor <a href="https://w3id.org/ldac/terms#depositor" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_ldac:depositor_Dataset

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| The participant responsible for depositing the resource in an archive. | <a href="#class-person">Person</a>, <a href="#class-organization">Organization</a> | <a href="#class-dataset">Dataset</a> |
### <a id="property-ldac-derivationof"></a> Property: ldac:derivationOf <a href="https://w3id.org/ldac/terms#derivationOf" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_ldac:derivationOf_File

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| This property references another resource from which the current resource is derived, e.g. downsampling audio or video files, or extracting text from a PDF. | #class_Annotation, #class_PrimaryMaterial | <a href="#class-file">File</a> |
### <a id="property-ldac-developer"></a> Property: ldac:developer <a href="https://w3id.org/ldac/terms#developer" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_ldac:developer_Dataset

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| The participant developed the methodology or tools (including software) that constitute the resource, or that were used to create the resource. | <a href="#class-person">Person</a>, <a href="#class-organization">Organization</a> | <a href="#class-dataset">Dataset</a> |
### <a id="property-ldac-doi"></a> Property: ldac:doi <a href="https://w3id.org/ldac/terms#doi" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_ldac:doi_Dataset

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| A Digital Object Identifier, e.g. https://doi.org/10.1000/182. | Text | <a href="#class-dataset">Dataset</a> |
### <a id="property-ldac-editor"></a> Property: ldac:editor <a href="https://w3id.org/ldac/terms#editor" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_ldac:editor_Dataset

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| The participant reviewed, corrected, and/or tested the resource. | <a href="#class-person">Person</a>, <a href="#class-organization">Organization</a> | <a href="#class-dataset">Dataset</a> |
### <a id="property-ldac-hasannotation"></a> Property: ldac:hasAnnotation <a href="https://w3id.org/ldac/terms#hasAnnotation" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_ldac:hasAnnotation_RepositoryObject

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| This resource is referenced by another resource that adds information to it such as a translation, transcription or other analysis. | #class_Annotation | <a href="#class-repositoryobject">RepositoryObject</a> |
### <a id="property-ldac-hascollectionprotocol"></a> Property: ldac:hasCollectionProtocol <a href="https://w3id.org/ldac/terms#hasCollectionProtocol" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_ldac:hasCollectionProtocol_Dataset

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| A link to a CollectionProtocol object with (at least) a summary of how resources were selected or elicited for this collection/sub-collection. | <a href="#class-ldac-collectionprotocol">ldac:CollectionProtocol</a> | <a href="#class-dataset">Dataset</a> |
### <a id="property-ldac-hasderivation"></a> Property: ldac:hasDerivation <a href="https://w3id.org/ldac/terms#hasDerivation" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_ldac:hasDerivation_File

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| This property references another resource that is derived from it, such as a downsampled audio or video file, or text extracted from a PDF. | #class_DerivedMaterial | <a href="#class-file">File</a> |
### <a id="property-ldac-illustrator"></a> Property: ldac:illustrator <a href="https://w3id.org/ldac/terms#illustrator" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_ldac:illustrator_Dataset

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| The participant contributed drawings or other illustrations to the resource. | <a href="#class-person">Person</a>, <a href="#class-organization">Organization</a> | <a href="#class-dataset">Dataset</a> |
### <a id="property-ldac-indexabletext"></a> Property: ldac:indexableText <a href="https://w3id.org/ldac/terms#indexableText" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_ldac:indexableText_CreativeWork

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| One or more target File(s) that together contain the full text of an item – each file should indicate its language. | #class_MediaObject | <a href="#class-creativework">CreativeWork</a> |
### <a id="property-ldac-interpreter"></a> Property: ldac:interpreter <a href="https://w3id.org/ldac/terms#interpreter" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_ldac:interpreter_Dataset

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| The contributor renders the discourse recorded in the resource into another language in real time, or the contributor explains the discourse recorded in the resource. | <a href="#class-person">Person</a>, <a href="#class-organization">Organization</a> | <a href="#class-dataset">Dataset</a> |
### <a id="property-ldac-interviewee"></a> Property: ldac:interviewee <a href="https://w3id.org/ldac/terms#interviewee" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_ldac:interviewee_Dataset

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| The participant was a respondent in an interview. | <a href="#class-person">Person</a>, <a href="#class-organization">Organization</a> | <a href="#class-dataset">Dataset</a> |
### <a id="property-ldac-interviewer"></a> Property: ldac:interviewer <a href="https://w3id.org/ldac/terms#interviewer" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_ldac:interviewer_Dataset

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| The participant conducted an interview that forms part of the resource. | <a href="#class-person">Person</a>, <a href="#class-organization">Organization</a> | <a href="#class-dataset">Dataset</a> |
### <a id="property-ldac-isdeidentified"></a> Property: ldac:isDeIdentified <a href="https://w3id.org/ldac/terms#isDeIdentified" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_ldac:isDeIdentified_CreativeWork

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| The data in this item has had potentially identifying information removed, which may include replacing names with pseudonyms. | Boolean | <a href="#class-creativework">CreativeWork</a> |
### <a id="property-ldac-itemlocation"></a> Property: ldac:itemLocation <a href="https://w3id.org/ldac/terms#itemLocation" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_ldac:itemLocation_RepositoryCollection

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| Current location of the item, e.g. where a set of audio tapes are stored. | <a href="#class-place">Place</a>, <a href="#class-organization">Organization</a> | <a href="#class-repositorycollection">RepositoryCollection</a> |
### <a id="property-ldac-linguisticgenre"></a> Property: ldac:linguisticGenre <a href="https://w3id.org/ldac/terms#linguisticGenre" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_ldac:linguisticGenre_CreativeWork

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| A linguistic classification of the genre of this resource. | <a href="#class-linguisticgenreterms">LinguisticGenreTerms</a> | <a href="#class-creativework">CreativeWork</a> |
### <a id="property-ldac-material"></a> Property: ldac:material <a href="https://w3id.org/ldac/terms#material" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_ldac:material_CreativeWork

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| Description of the original media, e.g. audio cassette tapes, participant questionnaires, field notes. | Text | <a href="#class-creativework">CreativeWork</a> |
### <a id="property-ldac-materialtype"></a> Property: ldac:materialType <a href="https://w3id.org/ldac/terms#materialType" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_ldac:materialType_File

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| Indicates whether the material in a file is the original (primary) source or is derived from it or describes it via annotation. | <a href="#class-materialtypes">MaterialTypes</a> | <a href="#class-file">File</a> |
### <a id="property-ldac-openaccessindex"></a> Property: ldac:openAccessIndex <a href="https://w3id.org/ldac/terms#openAccessIndex" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_ldac:openAccessIndex_CreativeWork

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| One or more public index types allowed by a license, e.g. FullText indexing may be allowed for discovery even when an item is not. | <a href="#class-indextypes">IndexTypes</a> | <a href="#class-creativework">CreativeWork</a> |
### <a id="property-ldac-participant"></a> Property: ldac:participant <a href="https://w3id.org/ldac/terms#participant" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_ldac:participant_Dataset

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| The participant was present during the creation of the resource, but did not contribute substantially to its content. | <a href="#class-person">Person</a>, <a href="#class-organization">Organization</a> | <a href="#class-dataset">Dataset</a> |
### <a id="property-ldac-performer"></a> Property: ldac:performer <a href="https://w3id.org/ldac/terms#performer" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_ldac:performer_Dataset

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| The participant performed some portion of a recorded, filmed, or transcribed resource. It is recommended that this term be used only for creative participants whose role is not better indicated by a more specific term, such as 'speaker', 'signer', or 'singer'. | <a href="#class-person">Person</a>, <a href="#class-organization">Organization</a> | <a href="#class-dataset">Dataset</a> |
### <a id="property-ldac-photographer"></a> Property: ldac:photographer <a href="https://w3id.org/ldac/terms#photographer" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_ldac:photographer_Dataset

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| The participant took the photograph, or shot the film, that appears in or constitutes the resource. | <a href="#class-person">Person</a>, <a href="#class-organization">Organization</a> | <a href="#class-dataset">Dataset</a> |
### <a id="property-ldac-recorder"></a> Property: ldac:recorder <a href="https://w3id.org/ldac/terms#recorder" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_ldac:recorder_Dataset

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| The participant operated the recording machinery used to create the resource. | <a href="#class-person">Person</a>, <a href="#class-organization">Organization</a> | <a href="#class-dataset">Dataset</a> |
### <a id="property-ldac-register"></a> Property: ldac:register <a href="https://w3id.org/ldac/terms#register" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_ldac:register_CreativeWork

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| The type of register (any of the varieties of a language that a speaker uses in a particular social context [Merriam-Webster]) of the contents of a language resource. | Text | <a href="#class-creativework">CreativeWork</a> |
### <a id="property-ldac-researcher"></a> Property: ldac:researcher <a href="https://w3id.org/ldac/terms#researcher" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_ldac:researcher_Dataset

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| The resource was created as part of the participant's research, or the research presents interim or final results from the participant's research. | <a href="#class-person">Person</a>, <a href="#class-organization">Organization</a> | <a href="#class-dataset">Dataset</a> |
### <a id="property-ldac-researchparticipant"></a> Property: ldac:researchParticipant <a href="https://w3id.org/ldac/terms#researchParticipant" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_ldac:researchParticipant_Dataset

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| The participant acted as a research subject or responded to a questionnaire, the results of which study form the basis of the resource. | <a href="#class-person">Person</a>, <a href="#class-organization">Organization</a> | <a href="#class-dataset">Dataset</a> |
### <a id="property-ldac-responder"></a> Property: ldac:responder <a href="https://w3id.org/ldac/terms#responder" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_ldac:responder_Dataset

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| The participant was an interlocutor in some sort of discourse event, but only reacted to the contributions of others. | <a href="#class-person">Person</a>, <a href="#class-organization">Organization</a> | <a href="#class-dataset">Dataset</a> |
### <a id="property-ldac-reviewdate"></a> Property: ldac:reviewDate <a href="https://w3id.org/ldac/terms#reviewDate" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_ldac:reviewDate_DataLicense

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| The date that this license should be reviewed. | Text | <a href="#class-datalicense">DataLicense</a> |
### <a id="property-ldac-signer"></a> Property: ldac:signer <a href="https://w3id.org/ldac/terms#signer" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_ldac:signer_Dataset

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| The contributor was a principal signer in a resource that consists of a recording, a film, or a transcription of a recorded resource. Signers are those whose gestures predominate in a recorded or filmed resource. (The resource may be a transcription of that recording). | <a href="#class-person">Person</a>, <a href="#class-organization">Organization</a> | <a href="#class-dataset">Dataset</a> |
### <a id="property-ldac-singer"></a> Property: ldac:singer <a href="https://w3id.org/ldac/terms#singer" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_ldac:singer_Dataset

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| The participant sang, either individually or as part of a group, in a resource that consists of a recording, a film, or a transcription of a recorded resource. | <a href="#class-person">Person</a>, <a href="#class-organization">Organization</a> | <a href="#class-dataset">Dataset</a> |
### <a id="property-ldac-speaker"></a> Property: ldac:speaker <a href="https://w3id.org/ldac/terms#speaker" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_ldac:speaker_Dataset

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| The contributor was a principal speaker in a resource that consists of a recording, a film, or a transcription of a recorded resource. Speakers are those whose voices predominate in a recorded or filmed resource. (The resource may be a transcription of that recording). | <a href="#class-person">Person</a>, <a href="#class-organization">Organization</a> | <a href="#class-dataset">Dataset</a> |
### <a id="property-ldac-sponsor"></a> Property: ldac:sponsor <a href="https://w3id.org/ldac/terms#sponsor" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_ldac:sponsor_Dataset

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| The participant contributed financial support to the creation of the resource. | <a href="#class-person">Person</a>, <a href="#class-organization">Organization</a> | <a href="#class-dataset">Dataset</a> |
### <a id="property-ldac-subjectlanguage"></a> Property: ldac:subjectLanguage <a href="https://w3id.org/ldac/terms#subjectLanguage" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_ldac:subjectLanguage_RepositoryCollection

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| The languages that the materials in the collection are about (not the language that it is in). | <a href="#class-language">Language</a> | <a href="#class-repositorycollection">RepositoryCollection</a> |
### <a id="property-ldac-transcriber"></a> Property: ldac:transcriber <a href="https://w3id.org/ldac/terms#transcriber" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_ldac:transcriber_Dataset

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| The participant produced a transcription of this or a related resource. | <a href="#class-person">Person</a>, <a href="#class-organization">Organization</a> | <a href="#class-dataset">Dataset</a> |
### <a id="property-ldac-translator"></a> Property: ldac:translator <a href="https://w3id.org/ldac/terms#translator" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_ldac:translator_Dataset

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| The participant produced a translation of this or a related resource. | <a href="#class-person">Person</a>, <a href="#class-organization">Organization</a> | <a href="#class-dataset">Dataset</a> |
### <a id="property-ldac-writtenlanguageformat"></a> Property: ldac:writtenLanguageFormat <a href="https://w3id.org/ldac/terms#writtenLanguageFormat" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_ldac:writtenLanguageFormat_CreativeWork

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| The format of the resource resulting from the way the text was produced (handwritten, typeset, typewritten). | <a href="#class-writtenlanguagetypeterms">WrittenLanguageTypeTerms</a> | <a href="#class-creativework">CreativeWork</a> |
### <a id="property-license"></a> Property: license <a href="http://schema.org/license" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_license_Dataset

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| A license document that applies to this content, typically indicated by URL. | <a href="#class-datareuselicense">DataReuseLicense</a>, URL, Text | <a href="#class-root-data-entity">Root Data Entity</a> |
### <a id="property-license"></a> Property: license <a href="http://schema.org/license" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_license_RepositoryObject

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| A license document that applies to this content, typically indicated by URL. | <a href="#class-datareuselicense">DataReuseLicense</a> | <a href="#class-repositoryobject">RepositoryObject</a> |
### <a id="property-location"></a> Property: location <a href="http://schema.org/location" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_location_Organization

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| A location for the organisation, e.g. a city for a publisher. | Text | <a href="#class-organization">Organization</a> |
### <a id="property-name"></a> Property: name <a href="http://schema.org/name" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_name_Dataset

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| The name of this data collection. | Text | <a href="#class-root-data-entity">Root Data Entity</a> |
### <a id="property-pcdm-hasmember"></a> Property: pcdm:hasMember <a href="http://pcdm.org/models#hasMember" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_pcdm:hasMember_Dataset

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| The sub-collections, if any, associated with this collection. | <a href="#class-repositorycollection">RepositoryCollection</a>, <a href="#class-repositoryobject">RepositoryObject</a> | <a href="#class-dataset">Dataset</a> |
### <a id="property-pcdm-memberof"></a> Property: pcdm:memberOf <a href="http://pcdm.org/models#memberOf" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_pcdm:memberOf_Dataset

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| Links from a Repository Object or Collection to a containing Repository Object or Collection. | <a href="#class-repositorycollection">RepositoryCollection</a> | <a href="#class-dataset">Dataset</a> |
### <a id="property-publisher"></a> Property: publisher <a href="http://schema.org/publisher" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_publisher_CreativeWork

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| The organisation that published this work. | Text, <a href="#class-organization">Organization</a> | <a href="#class-creativework">CreativeWork</a> |
### <a id="property-publisher"></a> Property: publisher <a href="http://schema.org/publisher" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_publisher_Dataset

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| The organisation responsible for releasing this dataset. | <a href="#class-organization">Organization</a> | <a href="#class-dataset">Dataset</a> |
### <a id="property-recipient"></a> Property: recipient <a href="http://schema.org/recipient" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_recipient_CreativeWork

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| The person or organisation responsible for creating this work. Authors should be identified using URIs such as ORCiD or ROR. | Text, <a href="#class-person">Person</a>, <a href="#class-organization">Organization</a> | <a href="#class-creativework">CreativeWork</a> |
### <a id="property-spatialcoverage"></a> Property: spatialCoverage <a href="http://schema.org/spatialCoverage" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_spatialCoverage_Dataset

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| The place(s) that are the focus of the content. It is a sub-property of contentLocation intended primarily for more technical and detailed materials. For example, with a dataset, it indicates areas that the dataset describes: a dataset Cape York languages would have spatialCoverage which was the place: the outline of the Cape. | <a href="#class-place">Place</a> | <a href="#class-dataset">Dataset</a> |
### <a id="property-temporalcoverage"></a> Property: temporalCoverage <a href="http://schema.org/temporalCoverage" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_temporalCoverage_Dataset

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| The range of years of creation for items in this dataset using a slash, e.g. 1900/1945. If there are sub-collections with different coverages put this on the sub-collections not the top-level. | DateTime, Text | <a href="#class-dataset">Dataset</a> |
### <a id="property-temporalcoverage"></a> Property: temporalCoverage <a href="http://schema.org/temporalCoverage" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_temporalCoverage_RepositoryObject

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| The temporalCoverage of a CreativeWork indicates the period that the content applies to, i.e. that it describes, either as a DateTime or as a textual string indicating a time period in [ISO 8601 time interval format](https://en.wikipedia.org/wiki/ISO_8601#Time_intervals). In the case of a Dataset it will typically indicate the relevant time period in a precise notation (e.g. for a 2011 census dataset, the year 2011 would be written "2011/2012"). Other forms of content, e.g. ScholarlyArticle, Book, TVSeries or TVEpisode, may indicate their temporalCoverage in broader terms - textually or via well-known URL. Written works such as books may sometimes have precise temporal coverage too, e.g. a work set in 1939 - 1945 can be indicated in ISO 8601 interval format format via "1939/1945". Open-ended date ranges can be written with ".." in place of the end date. For example, "2015-11/.." indicates a range beginning in November 2015 and with no specified final date. This is tentative and might be updated in future when ISO 8601 is officially updated. | Text | <a href="#class-repositoryobject">RepositoryObject</a> |
### <a id="property-usageinfo"></a> Property: usageInfo <a href="http://schema.org/usageInfo" target="_blank" rel="noopener">ⓘ</a>

ID: #prop_usageInfo_Dataset

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| Additional information on licensing options for using the data, e.g. 'Contact the Data Steward to discuss license terms'. | Text | <a href="#class-dataset">Dataset</a> |

