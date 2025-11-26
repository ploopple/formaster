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
  "id": "1f71d6a3-adaf-4a67-bde7-a72658234ef5",
  "title": "EDIT_THIS_TITLE",
  "description": "EDIT_THIS_DESCRIPTION",
  "fileName": "/forms/tofes-101.pdf",
  "fields": [
    {
      "id": "e46a0822-621e-4165-8a09-6fccec57ea1f",
      "page": 1,
      "x": 37.268666241225276,
      "y": 9.788001804239963,
      "width": 11.96504068283344,
      "height": 2.227284900766799,
      "name": "Tax Year",
      "value": "2026",
      "previewText": "",
      "type": "number",
      "fontSize": 14,
      "letterSpacing": 9,
      "options": [],
      "borderWidth": 0,
      "padding": 2,
      "maxLength": 4,
      "color": "#000000"
    },
    {
      "id": "9cf42279-3985-4526-a757-365838251de9",
      "page": 1,
      "x": 52.878210753031276,
      "y": 26.04818589309878,
      "width": 20.71783264199106,
      "height": 1.9446676251691493,
      "name": "Family Name",
      "value": "AL ASAM",
      "previewText": "",
      "type": "text",
      "fontSize": 12,
      "letterSpacing": 0,
      "options": [],
      "borderWidth": 0,
      "padding": 2,
      "textAlign": "center",
      "sectionId": "221a277c-63e7-4a0e-9bce-72ebb60a329a"
    },
    {
      "id": "782e5037-1b2f-46ac-82a3-e8f4f5425fd0",
      "page": 1,
      "x": 35.395062220804085,
      "y": 26.086596470455568,
      "width": 17.40936104020421,
      "height": 1.9295148285972097,
      "name": "First Name",
      "value": "Mohamed",
      "previewText": "",
      "type": "text",
      "fontSize": 12,
      "letterSpacing": 0,
      "options": [],
      "borderWidth": 0,
      "padding": 2,
      "textAlign": "center",
      "sectionId": "221a277c-63e7-4a0e-9bce-72ebb60a329a"
    },
    {
      "id": "88788452-0328-4388-8668-3cda4b92e7bd",
      "page": 1,
      "x": 20.075183471601786,
      "y": 26.38700947225981,
      "width": 15.244595564773451,
      "height": 1.767591339648174,
      "name": "Date of Birth",
      "value": "30/11/2025",
      "previewText": "DD/MM/YYYY",
      "type": "date",
      "fontSize": 13,
      "letterSpacing": 4,
      "options": [],
      "borderWidth": 0,
      "padding": 2,
      "dateFormat": "DD/MM/YYYY",
      "dateHideSeparator": true,
      "hidden": true,
      "sectionId": "221a277c-63e7-4a0e-9bce-72ebb60a329a"
    },
    {
      "id": "5c974c78-97d5-414f-aae7-cdc442fde4cd",
      "page": 1,
      "x": 0,
      "y": 0,
      "width": 0,
      "height": 0,
      "name": "Do you have an ID?",
      "value": "No",
      "previewText": "",
      "type": "radio",
      "fontSize": 12,
      "letterSpacing": 0,
      "options": [
        {
          "id": "6c84a1ae-5885-483e-84b9-537c00d94798",
          "x": 93.20681437460114,
          "y": 25.11452695083446,
          "width": 3.9094906668793925,
          "height": 3,
          "value": "Yes"
        },
        {
          "id": "ff7ec086-5380-4fd9-9b3b-63d9418fbb30",
          "x": 93.6198747606892,
          "y": 29.92606844835363,
          "width": 3.9094906668793925,
          "height": 3,
          "value": "No"
        }
      ],
      "borderWidth": 0,
      "padding": 2,
      "markStyle": "none"
    },
    {
      "id": "6468222f-ca48-48de-9b10-ec166dd81248",
      "page": 1,
      "x": 74.15443522654755,
      "y": 26.432115471357694,
      "width": 17.337168953414167,
      "height": 1.7476037437979253,
      "name": "ID number",
      "value": "888888888",
      "previewText": "",
      "type": "number",
      "fontSize": 12,
      "letterSpacing": 4.5,
      "options": [],
      "parentFieldId": "5c974c78-97d5-414f-aae7-cdc442fde4cd",
      "parentOptionId": "6c84a1ae-5885-483e-84b9-537c00d94798",
      "maxLength": 9
    },
    {
      "id": "52c4c8be-aafa-4183-b6a2-8a00f1eb945e",
      "page": 1,
      "x": 66.24122527121888,
      "y": 29.544429409111412,
      "width": 25.169362236758136,
      "height": 2.2913424672981506,
      "name": "Passport Number",
      "value": "0000000000000",
      "previewText": "",
      "type": "number",
      "fontSize": 12,
      "letterSpacing": 4.8,
      "options": [],
      "parentFieldId": "5c974c78-97d5-414f-aae7-cdc442fde4cd",
      "parentOptionId": "ff7ec086-5380-4fd9-9b3b-63d9418fbb30",
      "maxLength": 13
    }
  ],
  "sections": [
    {
      "id": "221a277c-63e7-4a0e-9bce-72ebb60a329a",
      "name": "Personal Informations",
      "collapsed": false,
      "order": 0
    }
  ],
  "createdAt": "2025-11-26T08:16:02.288Z",
  "category": "EDIT_THIS_CATEGORY"
}
];
