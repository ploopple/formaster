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
  "id": "0faf9470-6dd7-470f-b75b-d1b40fd296f1",
  "title": "EDIT_THIS_TITLE",
  "description": "EDIT_THIS_DESCRIPTION",
  "fileName": "/forms/tofes-101.pdf",
  "fields": [
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
      "id": "94928b80-768c-4601-b456-318468792e95",
      "page": 1,
      "x": 5.360561582641991,
      "y": 26.477221470455568,
      "width": 15.16043793873644,
      "height": 1.6598584799278304,
      "name": "Immigration Date",
      "value": "25/11/2025",
      "previewText": "DD/MM/YYYY",
      "type": "date",
      "fontSize": 12,
      "letterSpacing": 4.5,
      "options": [],
      "parentFieldId": "43adc68b-7645-400f-950e-81e648d662e3",
      "parentOptionId": "6d232fc4-3114-4098-b685-29c857021775",
      "dateFormat": "DD/MM/YYYY",
      "dateHideSeparator": true,
      "hidden": true
    },
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
      "textAlign": "center"
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
      "textAlign": "center"
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
      "hidden": true
    },
    {
      "id": "43adc68b-7645-400f-950e-81e648d662e3",
      "page": 1,
      "x": 4.915842373962986,
      "y": 26.286578146143434,
      "width": 14.979608726866624,
      "height": 1.916476375732973,
      "name": "Are you an immigrant?",
      "value": "Yes",
      "previewText": "",
      "type": "radio",
      "fontSize": 12,
      "letterSpacing": 0,
      "options": [
        {
          "id": "6d232fc4-3114-4098-b685-29c857021775",
          "x": 0,
          "y": 22.902923432566528,
          "width": 5,
          "height": 1.916476375732973,
          "value": "Yes"
        },
        {
          "id": "99ac94ac-b29b-4d4e-89d4-9a26f5f817a6",
          "x": 0,
          "y": 28.13839084348218,
          "width": 5,
          "height": 1.916476375732973,
          "value": "No"
        }
      ],
      "borderWidth": 0,
      "padding": 2,
      "markStyle": "none"
    },
    {
      "id": "31bfc862-6f12-467e-a84d-090f86b94322",
      "page": 1,
      "x": 38.655422383535424,
      "y": 29.318899413622013,
      "width": 27.338764358647097,
      "height": 1.3896524018944483,
      "name": "Street Address",
      "value": "Shhona 37",
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
      "id": "f68d234c-e1ba-4b43-a22d-5eac2e4c6b57",
      "page": 1,
      "x": 34.07785577536694,
      "y": 29.157328315290933,
      "width": 4.369914645820039,
      "height": 1.6104251240414982,
      "name": "Street address number",
      "value": "8888",
      "previewText": "",
      "type": "number",
      "fontSize": 11,
      "letterSpacing": 0,
      "options": [],
      "borderWidth": 0,
      "padding": 2,
      "hidden": true,
      "textAlign": "center"
    },
    {
      "id": "c80b6b8b-b291-4dff-8b5c-d272302345e7",
      "page": 1,
      "x": 18.29879945756222,
      "y": 28.326567433468654,
      "width": 15.862565810465856,
      "height": 2.029769959404601,
      "name": "City",
      "value": "Tel Sheva",
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
      "id": "f0de98b7-10c5-45a5-a8d0-ea08df712781",
      "page": 1,
      "x": 4.850031908104659,
      "y": 28.642309427153812,
      "width": 13.207711790044671,
      "height": 2.6041666666666643,
      "name": "ZIP Code",
      "value": "8888888",
      "previewText": "",
      "type": "number",
      "fontSize": 12,
      "letterSpacing": 5,
      "options": [],
      "borderWidth": 0,
      "padding": 2,
      "maxLength": 7,
      "hidden": true
    },
    {
      "id": "4c7ec6fd-0838-4909-a6b8-fe981cf36563",
      "page": 1,
      "x": 93.29929802169751,
      "y": 34.14524131709518,
      "width": 3.9870173899170283,
      "height": 4.679747406405049,
      "name": "Gender",
      "value": "Female",
      "previewText": "",
      "type": "radio",
      "fontSize": 12,
      "letterSpacing": 0,
      "options": [
        {
          "id": "52dae449-2bb6-470a-aa72-0cde097b4f37",
          "x": 87.66951180599872,
          "y": 32.302766971132165,
          "width": 3.9870173899170283,
          "height": 3,
          "value": "Male"
        },
        {
          "id": "68e7a6f0-d6cf-4de2-8868-983e03052efc",
          "x": 87.62264677728143,
          "y": 33.83214225304466,
          "width": 3.9870173899170283,
          "height": 3,
          "value": "Female"
        }
      ],
      "borderWidth": 0,
      "padding": 2
    },
    {
      "id": "2977b150-5e7d-4fe8-a31b-d0c2a20e5e1b",
      "page": 1,
      "x": 55.50265236119974,
      "y": 31.949495376635088,
      "width": 28.82996968730057,
      "height": 4.222168188994143,
      "name": "marital status",
      "value": "Divorced",
      "previewText": "",
      "type": "radio",
      "fontSize": 12,
      "letterSpacing": 0,
      "options": [
        {
          "id": "d2f1f1d1-04ae-40a5-9883-6513aa36e880",
          "x": 80.38199984045947,
          "y": 31.98473443843031,
          "width": 5,
          "height": 3,
          "value": "Single"
        },
        {
          "id": "a0e6a8cd-3d53-4fdc-9894-9b8505091562",
          "x": 70.5971801212508,
          "y": 32.0430550857014,
          "width": 5,
          "height": 3,
          "value": "married"
        },
        {
          "id": "72c94d86-6a96-4e2a-a7ad-b1f3367f471b",
          "x": 72.58111638481174,
          "y": 33.70263870094722,
          "width": 5,
          "height": 3,
          "value": "Separated"
        },
        {
          "id": "005bc2d2-b435-4508-bd19-8ba5fc1080b0",
          "x": 80.48226108806638,
          "y": 33.554106055480375,
          "width": 5,
          "height": 3,
          "value": "Widowed"
        },
        {
          "id": "70c1048c-258c-41d8-a49d-2b5a25a50bb9",
          "x": 59.246819160816855,
          "y": 31.958128946774917,
          "width": 5,
          "height": 3,
          "value": "Divorced"
        }
      ],
      "borderWidth": 0,
      "padding": 2
    }
  ],
  "createdAt": "2025-11-26T08:41:37.396Z",
  "category": "EDIT_THIS_CATEGORY"
}
];
