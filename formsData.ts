// Store all your form configurations here
// Each form should have: fileName (path to PDF in public folder), fields array, and metadata

export interface FieldSection {
  id: string;
  name: string;
  collapsed?: boolean;
  order: number;
}

export interface FormTemplate {
  id: string;
  title: string;
  description: string;
  fileName: string; // Path to PDF in public folder, e.g., "/forms/application.pdf"
  fields: any[]; // FormField array
  sections?: FieldSection[]; // Named sections for grouping fields
  createdAt: string;
  category?: string;
}

export const formsData: FormTemplate[] = [
{
  "id": "e9c2d3b3-db18-43a4-9286-544366ce11eb",
  "title": "EDIT_THIS_TITLE",
  "description": "EDIT_THIS_DESCRIPTION",
  "fileName": "/forms/tofes-116.pdf",
  "fields": [
    {
      "id": "7d7c32ed-2ca8-4261-bc26-5da050023ce5",
      "page": 1,
      "x": 38.69314541960282,
      "y": 8.012675418741512,
      "width": 9.341327650506031,
      "height": 1.4322916666666679,
      "name": "Tax Year",
      "value": "2026",
      "previewText": "",
      "type": "number",
      "fontSize": 14,
      "letterSpacing": 8.5,
      "options": [],
      "borderWidth": 0,
      "padding": 2,
      "hidden": true,
      "maxLength": 4
    },
    {
      "id": "fc8a09ec-fc54-4a5f-8d22-4f591b328574",
      "page": 1,
      "x": 73.4785393978219,
      "y": 16.36911498415573,
      "width": 16.598684737347853,
      "height": 2.489814395654142,
      "name": "ID number",
      "value": "211855952",
      "previewText": "",
      "type": "number",
      "fontSize": 12,
      "letterSpacing": 4.5,
      "options": [],
      "borderWidth": 0,
      "padding": 2,
      "hidden": true,
      "maxLength": 9
    },
    {
      "id": "7ff25393-6607-485b-8127-c9ada06babcd",
      "page": 1,
      "x": 46.96083239910314,
      "y": 16.553375396106837,
      "width": 25.99195227418322,
      "height": 1.6302271955636023,
      "name": "Family Name",
      "value": "MOHAMED",
      "previewText": "",
      "type": "text",
      "fontSize": 12,
      "letterSpacing": 0,
      "options": [],
      "borderWidth": 0,
      "padding": 2,
      "textAlign": "center"
    },
    {
      "id": "d91d2945-3381-4e5f-bc16-cd5e91fbcc23",
      "page": 1,
      "x": 20.233674327354258,
      "y": 16.565223234495246,
      "width": 25.912125640614995,
      "height": 1.676380715255771,
      "name": "First Name",
      "value": "AL ASAM",
      "previewText": "",
      "type": "text",
      "fontSize": 12,
      "letterSpacing": 0,
      "options": [],
      "borderWidth": 0,
      "padding": 2,
      "textAlign": "center"
    },
    {
      "id": "e3332608-4aa0-40de-ba7b-3f695c0e20f0",
      "page": 1,
      "x": 4.804612427930813,
      "y": 16.749660479855137,
      "width": 14.454876681614351,
      "height": 1.8383601177003177,
      "name": "Date of birth",
      "value": "30/11/2025",
      "previewText": "DD/MM/YYYY",
      "type": "date",
      "fontSize": 11,
      "letterSpacing": 3.5,
      "options": [],
      "borderWidth": 0,
      "padding": 2,
      "dateFormat": "DD/MM/YYYY",
      "hidden": true
    },
    {
      "id": "852ae0ef-c724-4e49-85ae-b0489a9bdc8e",
      "page": 1,
      "x": 78.35972533632287,
      "y": 22.922737947034857,
      "width": 11.953475336322882,
      "height": 2.879378395201453,
      "name": "Gender",
      "value": "Male",
      "previewText": "",
      "type": "radio",
      "fontSize": 12,
      "letterSpacing": 0,
      "options": [
        {
          "id": "e90c41ef-bd31-4d8c-80d3-333df359ca92",
          "x": 86.34238869314542,
          "y": 23.338473291081936,
          "width": 5,
          "height": 2.879378395201453,
          "value": "Male"
        },
        {
          "id": "9f852eea-cf4a-426d-9304-19412e87cd14",
          "x": 80.92468770019217,
          "y": 23.157042213671343,
          "width": 5,
          "height": 2.879378395201453,
          "value": "Female"
        }
      ],
      "borderWidth": 0,
      "padding": 2
    },
    {
      "id": "cf85e4a4-3b24-49f6-b68b-f8d7b3d4362f",
      "page": 1,
      "x": 4.181706684747926,
      "y": 53.186844553450605,
      "width": 88.32013800255265,
      "height": 22.74188092016238,
      "name": "Field 7",
      "value": "[[\"asdf\",\"asdf\"],[\"asdf2\",\"asdf2\"]]",
      "previewText": "",
      "type": "table",
      "fontSize": 12,
      "letterSpacing": 0,
      "options": [],
      "borderWidth": 0,
      "padding": 2,
      "maxRows": 3,
      "filledRows": 2,
      "showHeaders": true,
      "cellPadding": 2,
      "cellGap": 0,
      "columns": [
        {
          "id": "d618ede1-4a70-45fa-9441-fc5408868b8c",
          "header": "Col 1",
          "type": "text",
          "width": 50
        },
        {
          "id": "6c3229e7-914e-4fca-851d-eac18e27763a",
          "header": "Col 2",
          "type": "text",
          "width": 50
        }
      ]
    },
    {
      "id": "467e7878-fa37-470b-961b-69451044ead1",
      "page": 1,
      "x": 4.9153438098276965,
      "y": 67.72614315516464,
      "width": 88.32013800255265,
      "height": 5,
      "name": "Field 7 Row 1",
      "value": "",
      "previewText": "",
      "type": "table-row",
      "fontSize": 12,
      "letterSpacing": 0,
      "parentFieldId": "cf85e4a4-3b24-49f6-b68b-f8d7b3d4362f",
      "rowIndex": 0,
      "cells": [
        {
          "id": "ca840dac-a529-4b85-afeb-e04309b4ddd3",
          "type": "text",
          "header": "Col 1",
          "x": 0,
          "y": 0,
          "width": 50,
          "height": 100
        },
        {
          "id": "3743f49d-03ec-42d4-a854-3ae0fba68e51",
          "type": "text",
          "header": "Col 2",
          "x": 50,
          "y": 0,
          "width": 50,
          "height": 100
        }
      ]
    },
    {
      "id": "a9ca4d0c-1d1a-46ed-bf90-0dd14a2883d7",
      "page": 1,
      "x": 4.181706684747926,
      "y": 62.186844553450605,
      "width": 88.32013800255265,
      "height": 5,
      "name": "Field 7 Row 2",
      "value": "",
      "previewText": "",
      "type": "table-row",
      "fontSize": 12,
      "letterSpacing": 0,
      "parentFieldId": "cf85e4a4-3b24-49f6-b68b-f8d7b3d4362f",
      "rowIndex": 1,
      "cells": [
        {
          "id": "5559d160-d5e4-4da8-bb79-7c694f42edca",
          "type": "text",
          "header": "Col 1",
          "x": 0,
          "y": 0,
          "width": 50,
          "height": 100
        },
        {
          "id": "d5888c85-586a-4659-8434-73a863099c09",
          "type": "text",
          "header": "Col 2",
          "x": 50,
          "y": 0,
          "width": 50,
          "height": 100
        }
      ]
    },
    {
      "id": "c4b3e916-44c7-4f48-8e9a-8bbee8f73dc0",
      "page": 1,
      "x": 37.01053010890455,
      "y": 27.72394182888185,
      "width": 26.316513853299163,
      "height": 3.430214463558169,
      "name": "Field 10",
      "value": "Option 2",
      "previewText": "",
      "type": "radio",
      "fontSize": 12,
      "letterSpacing": 0,
      "options": [
        {
          "id": "bdd3b81c-c542-471c-be26-59cc87939071",
          "x": 37.01053010890455,
          "y": 27.72394182888185,
          "width": 5,
          "height": 3,
          "value": "Option 1"
        },
        {
          "id": "02da8efc-65a4-418d-b2e5-149992d92dc6",
          "x": 44.90761130685458,
          "y": 27.937910253508377,
          "width": 5,
          "height": 3,
          "value": "Option 2"
        }
      ],
      "borderWidth": 0,
      "padding": 2
    },
    {
      "id": "5f2b0276-e055-4a8f-8486-292e246dd412",
      "page": 1,
      "x": 49.90761130685458,
      "y": 32.93791025350838,
      "width": 20,
      "height": 3,
      "name": "Nested: Option 2",
      "value": "sdfg",
      "previewText": "",
      "type": "text",
      "fontSize": 12,
      "letterSpacing": 0,
      "options": [],
      "parentFieldId": "c4b3e916-44c7-4f48-8e9a-8bbee8f73dc0",
      "parentOptionId": "02da8efc-65a4-418d-b2e5-149992d92dc6"
    }
  ],
  "createdAt": "2025-11-25T16:47:27.857Z",
  "category": "EDIT_THIS_CATEGORY"
},
];
