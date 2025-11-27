---
title: Template Schema
---

# Template Schema

The template schema is used as a basis for creating new schemas.

<br>

## Types of entities (specializations of Classes) and expected Properties


### <a id="class-classexample"></a> Class: ClassExample

This is an example of a class and its format.

Instances of this type MAY be present in the crate.

| Min Count | Max Count |
| --------- | --------- |
| N/A | N/A |

| Property | Required | Description | Range | Value |
| -------- | -------- | ----------- | ----- | ----- |
| @type | Yes |  |  |  |
| <a href="#property-propertyexample">propertyExample</a> | No | This is an example of a property and its format. | schema:Text |  |

## All Properties

### <a id="property-propertyexample"></a> Property: propertyExample

ID: template:propertyExample

| Description | Range | Occurs in Domain(s) |
| ----------- | ----------- | ----------- |
| This is an example of a property and its format. | schema:Text | <a href="#class-classexample">ClassExample</a> |



