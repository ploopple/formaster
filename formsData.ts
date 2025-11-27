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
  "id": "29e9d573-5542-4667-8e84-14d4025015b6",
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
      "maxLength": 9,
      "additionalPositions": [
        {
          "page": 2,
          "x": 15.95405232929164,
          "y": 1.8493459630130809,
          "width": 17.337168953414167,
          "height": 1.3531799729364005,
          "letterSpacing": 2
        }
      ]
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
      "value": "2025",
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
      "maxLength": 13,
      "additionalPositions": [
        {
          "page": 2,
          "x": 16.209317166560304,
          "y": 1.3531799729364005,
          "width": 25.169362236758136,
          "height": 2.2913424672981506,
          "letterSpacing": 0,
          "fontSize": 10
        }
      ]
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
      "value": "married",
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
    },
    {
      "id": "6089204b-600e-4d30-b73c-789ab56613ec",
      "page": 1,
      "x": 75.5971801212508,
      "y": 37.0430550857014,
      "width": 20,
      "height": 3,
      "name": "does spouse have ID?",
      "value": "No",
      "previewText": "",
      "type": "radio",
      "fontSize": 12,
      "letterSpacing": 0,
      "options": [
        {
          "id": "a1bf67ac-0b1e-4377-b16d-1935373868f5",
          "x": 75.5971801212508,
          "y": 37.0430550857014,
          "width": 5,
          "height": 3,
          "value": "yes"
        },
        {
          "id": "17c205a0-48dc-401f-88b3-249edc990456",
          "x": 75.5971801212508,
          "y": 37.0430550857014,
          "width": 5,
          "height": 3,
          "value": "No"
        }
      ],
      "parentFieldId": "2977b150-5e7d-4fe8-a31b-d0c2a20e5e1b",
      "parentOptionId": "a0e6a8cd-3d53-4fdc-9894-9b8505091562",
      "markStyle": "none"
    },
    {
      "id": "658425b2-b615-4ab6-a473-be24d2a4bbad",
      "page": 1,
      "x": 70.64454371410338,
      "y": 82.53236429622771,
      "width": 17.029478206945427,
      "height": 1.9260260025062657,
      "name": "spouse ID",
      "value": "888888888",
      "previewText": "",
      "type": "number",
      "fontSize": 12,
      "letterSpacing": 4.5,
      "options": [],
      "parentFieldId": "6089204b-600e-4d30-b73c-789ab56613ec",
      "parentOptionId": "a1bf67ac-0b1e-4377-b16d-1935373868f5",
      "maxLength": 9,
      "textAlign": "center"
    },
    {
      "id": "d0bb1e69-3fa0-4eed-b372-cfaa16733dee",
      "page": 1,
      "x": 71.09125717932355,
      "y": 85.63974211577658,
      "width": 19.607990786676115,
      "height": 1.9540256892230574,
      "name": "spuse passport",
      "value": "8888888888888",
      "previewText": "",
      "type": "number",
      "fontSize": 12,
      "letterSpacing": 2.3,
      "options": [],
      "parentFieldId": "6089204b-600e-4d30-b73c-789ab56613ec",
      "parentOptionId": "17c205a0-48dc-401f-88b3-249edc990456",
      "maxLength": 13,
      "textAlign": "left",
      "hidden": true
    },
    {
      "id": "df6023dc-4d98-4b84-8b78-1ce82d40e747",
      "page": 1,
      "x": 53.014966895341416,
      "y": 82.44576708389717,
      "width": 20.43400007977026,
      "height": 1.946704442940911,
      "name": "spuse last name",
      "value": "wife",
      "previewText": "",
      "type": "text",
      "fontSize": 12,
      "letterSpacing": 0,
      "options": [],
      "parentFieldId": "2977b150-5e7d-4fe8-a31b-d0c2a20e5e1b",
      "parentOptionId": "a0e6a8cd-3d53-4fdc-9894-9b8505091562",
      "textAlign": "center"
    },
    {
      "id": "883cd8aa-e6e5-401c-b4fc-393c0e579009",
      "page": 1,
      "x": 35.381002712188895,
      "y": 82.45158152909336,
      "width": 17.32919192724952,
      "height": 1.916575045105999,
      "name": "spouse first name",
      "value": "sdfg",
      "previewText": "",
      "type": "text",
      "fontSize": 12,
      "letterSpacing": 0,
      "options": [],
      "parentFieldId": "2977b150-5e7d-4fe8-a31b-d0c2a20e5e1b",
      "parentOptionId": "a0e6a8cd-3d53-4fdc-9894-9b8505091562",
      "textAlign": "center"
    },
    {
      "id": "7cc45361-13d6-4ec3-9657-856de4567c91",
      "page": 1,
      "x": 20.29355456285897,
      "y": 82.80128693053675,
      "width": 15.108337986598595,
      "height": 1.6203907307171854,
      "name": "spouse date of birth",
      "value": "30/11/2025",
      "previewText": "DD/MM/YYYY",
      "type": "date",
      "fontSize": 12,
      "letterSpacing": 5,
      "options": [],
      "parentFieldId": "2977b150-5e7d-4fe8-a31b-d0c2a20e5e1b",
      "parentOptionId": "a0e6a8cd-3d53-4fdc-9894-9b8505091562",
      "dateFormat": "DD/MM/YYYY",
      "dateHideSeparator": true,
      "hidden": true
    },
    {
      "id": "a7952b49-7890-4e92-8310-36fc3a8c84d5",
      "page": 1,
      "x": 75.5971801212508,
      "y": 37.0430550857014,
      "width": 20,
      "height": 3,
      "name": "is spuse an immigrant?",
      "value": "yes",
      "previewText": "",
      "type": "radio",
      "fontSize": 12,
      "letterSpacing": 0,
      "options": [
        {
          "id": "f5263e1a-0325-4c14-b545-b5828d6458d5",
          "x": 75.5971801212508,
          "y": 37.0430550857014,
          "width": 5,
          "height": 3,
          "value": "yes"
        },
        {
          "id": "79225587-de82-40a3-81a9-8f1df8f6e538",
          "x": 75.5971801212508,
          "y": 37.0430550857014,
          "width": 5,
          "height": 3,
          "value": "no"
        }
      ],
      "parentFieldId": "2977b150-5e7d-4fe8-a31b-d0c2a20e5e1b",
      "parentOptionId": "a0e6a8cd-3d53-4fdc-9894-9b8505091562",
      "markStyle": "none"
    },
    {
      "id": "7b8b37cc-8cd5-4633-ac49-25d277af37cc",
      "page": 1,
      "x": 5.360561582641991,
      "y": 82.60339140730716,
      "width": 14.971980695596681,
      "height": 1.9186893888137122,
      "name": "spouse immigration date",
      "value": "30/11/2025",
      "previewText": "DD/MM/YYYY",
      "type": "date",
      "fontSize": 12,
      "letterSpacing": 4.5,
      "options": [],
      "parentFieldId": "a7952b49-7890-4e92-8310-36fc3a8c84d5",
      "parentOptionId": "f5263e1a-0325-4c14-b545-b5828d6458d5",
      "dateFormat": "DD/MM/YYYY",
      "dateHideSeparator": true,
      "hidden": true
    },
    {
      "id": "2d560c9b-dc95-48bd-aeb9-d6ae201220d8",
      "page": 1,
      "x": 75.5971801212508,
      "y": 37.0430550857014,
      "width": 20,
      "height": 3,
      "name": "does spouse have an income?",
      "value": "yes",
      "previewText": "",
      "type": "radio",
      "fontSize": 12,
      "letterSpacing": 0,
      "options": [
        {
          "id": "e48d33d9-7ac3-465c-b9f3-1d9d39247e6b",
          "x": 45.82068642310146,
          "y": 84.12261783942265,
          "width": 5,
          "height": 3,
          "value": "yes"
        },
        {
          "id": "e4401983-441f-4b3e-813b-507ee0f882db",
          "x": 67.23526244416081,
          "y": 84.11733198015337,
          "width": 5,
          "height": 3,
          "value": "no"
        }
      ],
      "parentFieldId": "2977b150-5e7d-4fe8-a31b-d0c2a20e5e1b",
      "parentOptionId": "a0e6a8cd-3d53-4fdc-9894-9b8505091562"
    },
    {
      "id": "5591cc53-a085-45ca-8f3e-cd6d8e7ce254",
      "page": 1,
      "x": 50.82068642310146,
      "y": 89.12261783942265,
      "width": 20,
      "height": 3,
      "name": "spuse income type",
      "value": "job/busniss/allownce",
      "previewText": "",
      "type": "radio",
      "fontSize": 12,
      "letterSpacing": 0,
      "options": [
        {
          "id": "35a0278d-ef6a-450c-a8de-b270100a1e09",
          "x": 25.094029195915756,
          "y": 84.36411112990528,
          "width": 5,
          "height": 3,
          "value": "job/busniss/allownce"
        },
        {
          "id": "31c302b4-0045-4db7-881e-5af8eb9c8fa0",
          "x": 11.708080727504786,
          "y": 84.2916948579161,
          "width": 5,
          "height": 3,
          "value": "other income"
        }
      ],
      "parentFieldId": "2d560c9b-dc95-48bd-aeb9-d6ae201220d8",
      "parentOptionId": "e48d33d9-7ac3-465c-b9f3-1d9d39247e6b"
    },
    {
      "id": "452e894c-f90a-4560-b46a-76ec959f7f30",
      "page": 1,
      "x": 47.653507897255906,
      "y": 31.92617152260938,
      "width": 7.655452297383526,
      "height": 4.229744587280109,
      "name": "living in israel?",
      "value": "no",
      "previewText": "",
      "type": "radio",
      "fontSize": 12,
      "letterSpacing": 0,
      "options": [
        {
          "id": "537e1e67-a231-4754-a139-6800a583550d",
          "x": 50.07578174856414,
          "y": 32.19240263447226,
          "width": 5,
          "height": 3,
          "value": "yes"
        },
        {
          "id": "e86b4599-8171-4855-8ed2-4970d1b70b5f",
          "x": 50.250777760051065,
          "y": 33.840181164016684,
          "width": 4.764927010210593,
          "height": 3.0667780221019396,
          "value": "no"
        }
      ],
      "borderWidth": 0,
      "padding": 2
    },
    {
      "id": "d2059596-c801-4a2f-94d2-3472a3741569",
      "page": 1,
      "x": 22.758954211869813,
      "y": 31.909432968256652,
      "width": 24.4697770421187,
      "height": 4.257935836716285,
      "name": "Are you a member of a Kibbutz or Cooperative Moshav?",
      "value": "No. You are not a member of a kibbutz or cooperative moshav",
      "previewText": "",
      "type": "radio",
      "fontSize": 12,
      "letterSpacing": 0,
      "options": [
        {
          "id": "bb4faf7c-0fc5-4baf-816a-e120d1d7b773",
          "x": 43.611648452456926,
          "y": 32.063427668301756,
          "width": 5,
          "height": 3,
          "value": "No. You are not a member of a kibbutz or cooperative moshav"
        },
        {
          "id": "7342bef8-d69b-44a4-a5a0-6093f52596e3",
          "x": 43.53013321633695,
          "y": 33.81586621137799,
          "width": 5,
          "height": 3,
          "value": "Yes. My income from this employer is not transferred to the kibbutz"
        },
        {
          "id": "37d244e3-66ee-472e-b490-0f4f623b8f43",
          "x": 39.73770540842374,
          "y": 32.22834647750338,
          "width": 5,
          "height": 3,
          "value": "Yes. My income from this employer is transferred to the kibbutz"
        }
      ],
      "borderWidth": 0,
      "padding": 2
    },
    {
      "id": "b94fd952-d35d-4705-a8c4-ce3ed194c053",
      "page": 1,
      "x": 5.004836072112317,
      "y": 31.728480385938205,
      "width": 17.70426172622846,
      "height": 4.427788114569239,
      "name": "Are you a member of a healthcare provider?",
      "value": "yes",
      "previewText": "",
      "type": "radio",
      "fontSize": 12,
      "letterSpacing": 0,
      "options": [
        {
          "id": "11be068a-01b9-460f-b25a-08c5559ec31d",
          "x": 19.01897535098915,
          "y": 33.6086605280221,
          "width": 5,
          "height": 3,
          "value": "yes"
        },
        {
          "id": "66a0b08b-98ef-4ded-ad04-64167929bf34",
          "x": 18.688178047223996,
          "y": 32.022021770692376,
          "width": 5,
          "height": 3,
          "value": "no"
        }
      ],
      "borderWidth": 0,
      "padding": 2
    },
    {
      "id": "e4e10fc5-d6de-463f-913b-97a1fdbd69c3",
      "page": 1,
      "x": 4.907267070835993,
      "y": 34.24271696690347,
      "width": 7.024868379068282,
      "height": 1.659153698691926,
      "name": "Select your healthcare provider",
      "value": "meuhadet",
      "previewText": "Select...",
      "type": "select",
      "fontSize": 9,
      "letterSpacing": 0,
      "options": [
        {
          "id": "b11144cd-2885-415d-a1f8-c715c941646a",
          "x": 10.004836072112317,
          "y": 36.728480385938205,
          "width": 0,
          "height": 0,
          "value": "Clalit"
        },
        {
          "id": "99ba6da5-93e3-4007-8783-27ed2ef26c9c",
          "x": 10.004836072112317,
          "y": 36.728480385938205,
          "width": 0,
          "height": 0,
          "value": "Macabit"
        },
        {
          "id": "0c694802-d3b0-4731-b663-71a77688cb9d",
          "x": 15.004836072112317,
          "y": 36.728480385938205,
          "width": 0,
          "height": 0,
          "value": "meuhadet"
        },
        {
          "id": "055feb12-db4b-406b-af28-393c46a08a19",
          "x": 20.00483607211232,
          "y": 36.728480385938205,
          "width": 0,
          "height": 0,
          "value": "Luimet"
        }
      ],
      "parentFieldId": "b94fd952-d35d-4705-a8c4-ce3ed194c053",
      "parentOptionId": "11be068a-01b9-460f-b25a-08c5559ec31d",
      "hidden": true
    },
    {
      "id": "5a2d574d-ee1b-4dd6-9964-3c3adfa5af56",
      "page": 1,
      "x": 60.73159301212508,
      "y": 37.26030830655165,
      "width": 30.060924537332475,
      "height": 1.6090155615696844,
      "name": "email",
      "value": "asdfasdf@asdfgfgsdfg.sadfa",
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
      "id": "4b8d8216-9d90-4186-886f-f1204d7d51be",
      "page": 1,
      "x": 37.077217613273774,
      "y": 36.67117726657646,
      "width": 18.657267070835985,
      "height": 1.881765899864682,
      "name": "phone number",
      "value": "000000000",
      "previewText": "",
      "type": "number",
      "fontSize": 12,
      "letterSpacing": 3,
      "options": [],
      "borderWidth": 0,
      "padding": 2,
      "maxLength": 9
    },
    {
      "id": "0823963d-e806-4088-957e-45bfe05cb73d",
      "page": 1,
      "x": 7.211231652839821,
      "y": 36.67117726657646,
      "width": 20.765694798978938,
      "height": 1.8193927604871547,
      "name": "mobile phone number",
      "value": "0000000000",
      "previewText": "",
      "type": "number",
      "fontSize": 12,
      "letterSpacing": 4,
      "options": [],
      "borderWidth": 0,
      "padding": 2,
      "maxLength": 10
    },
    {
      "id": "187d4351-8ff2-4a68-afa6-2ecc20b2b9af",
      "page": 1,
      "x": 94.8259014039566,
      "y": 42.66272627882555,
      "width": 2.7216616145500865,
      "height": 4.035577356788458,
      "name": "Do you have children",
      "value": "yes",
      "previewText": "",
      "type": "radio",
      "fontSize": 12,
      "letterSpacing": 0,
      "options": [
        {
          "id": "2ea868eb-9508-43d3-adf3-7b24f154c0f2",
          "x": 94.8259014039566,
          "y": 42.66272627882555,
          "width": 2.7216616145500865,
          "height": 3,
          "value": "yes"
        },
        {
          "id": "2b53dffa-20a6-49c4-8b68-2abced79dfd3",
          "x": 94.8259014039566,
          "y": 42.66272627882555,
          "width": 2.7216616145500865,
          "height": 3,
          "value": "no"
        }
      ],
      "borderWidth": 0,
      "padding": 2,
      "markStyle": "none"
    },
    {
      "id": "6e446a67-58c4-4337-bde4-20f86c6fa82c",
      "page": 1,
      "x": 42.946264757498405,
      "y": 43.46223011283548,
      "width": 47.824615108487556,
      "height": 35.70167315065404,
      "name": "Children",
      "value": "[]",
      "previewText": "",
      "type": "table",
      "fontSize": 12,
      "letterSpacing": 0,
      "options": [],
      "parentFieldId": "187d4351-8ff2-4a68-afa6-2ecc20b2b9af",
      "parentOptionId": "2ea868eb-9508-43d3-adf3-7b24f154c0f2",
      "maxRows": 13,
      "filledRows": 1,
      "showHeaders": true,
      "cellPadding": 2,
      "cellGap": 0,
      "columns": [
        {
          "id": "4393154c-fa12-4b06-a2a6-754197c3034d",
          "name": "Date of birth",
          "type": "date",
          "width": 32,
          "dateFormat": "DD/MM/YYYY",
          "dateHideSeparator": true,
          "letterSpacing": 4.5
        },
        {
          "id": "7da51773-8f7f-4a0d-a7d5-a0b4acf47508",
          "name": "ID number",
          "type": "number",
          "width": 35,
          "letterSpacing": 3
        },
        {
          "id": "f822e7ff-cde6-4f78-9854-b84a4b8ff1f9",
          "name": "Name",
          "type": "text",
          "width": 25,
          "fontSize": 10,
          "textAlign": "center",
          "options": [
            {
              "id": "bff8ae37-49e7-4ddf-b4b8-05a42f96ace4",
              "x": 0,
              "y": 0,
              "width": 0,
              "height": 0,
              "value": "Option 1"
            },
            {
              "id": "54cf0667-6bf1-43cf-9c80-550ba7efb5bf",
              "x": 0,
              "y": 0,
              "width": 0,
              "height": 0,
              "value": "Option 2"
            }
          ]
        },
        {
          "id": "86c6b424-9e84-4deb-ae4c-8e0d8fd494de",
          "name": "2",
          "type": "checkbox",
          "width": 4,
          "fontSize": 12,
          "textAlign": "center",
          "options": [
            {
              "id": "5d746b5e-9ac8-4e28-908c-5bfb22c0018f",
              "x": 0,
              "y": 0,
              "width": 0,
              "height": 0,
              "value": "Option 1"
            },
            {
              "id": "dc1030dd-e2ee-473e-9d67-09e33ff426be",
              "x": 0,
              "y": 0,
              "width": 0,
              "height": 0,
              "value": "Option 2"
            }
          ]
        },
        {
          "id": "ef17a798-4c31-41f2-879e-5b7dc4f82a19",
          "name": "1",
          "type": "checkbox",
          "width": 4,
          "fontSize": 12,
          "textAlign": "center",
          "options": [
            {
              "id": "844d5832-1cb3-4950-80f1-7cd904f3e8c5",
              "x": 0,
              "y": 0,
              "width": 0,
              "height": 0,
              "value": "yes"
            }
          ],
          "markStyle": "checkmark"
        }
      ]
    },
    {
      "id": "42ba31d4-f2d4-4e76-9ab2-c4bf8b6b6ab3",
      "page": 1,
      "x": 43.197042517549455,
      "y": 45.04941155171685,
      "width": 47.824615108487556,
      "height": 2.797206247180875,
      "name": "Nested: yes Row 1",
      "value": "",
      "previewText": "",
      "type": "table-row",
      "fontSize": 12,
      "letterSpacing": 0,
      "parentFieldId": "6e446a67-58c4-4337-bde4-20f86c6fa82c",
      "rowIndex": 0
    },
    {
      "id": "8a188266-18bb-4153-8ce5-868e35a0ab2c",
      "page": 1,
      "x": 42.946264757498405,
      "y": 47.846617798897725,
      "width": 47.824615108487556,
      "height": 2.5896481732070367,
      "name": "Nested: yes Row 2",
      "value": "",
      "previewText": "",
      "type": "table-row",
      "fontSize": 12,
      "letterSpacing": 0,
      "parentFieldId": "6e446a67-58c4-4337-bde4-20f86c6fa82c",
      "rowIndex": 1
    },
    {
      "id": "fd443ddf-faba-41ac-bc1a-1e82b497670b",
      "page": 1,
      "x": 42.946264757498405,
      "y": 50.43626597210476,
      "width": 47.824615108487556,
      "height": 2.579428845286423,
      "name": "Nested: yes Row 3",
      "value": "",
      "previewText": "",
      "type": "table-row",
      "fontSize": 12,
      "letterSpacing": 0,
      "parentFieldId": "6e446a67-58c4-4337-bde4-20f86c6fa82c",
      "rowIndex": 2
    },
    {
      "id": "f4e91b1a-6702-4a75-986d-838b3607d6b8",
      "page": 1,
      "x": 42.946264757498405,
      "y": 53.015694817391186,
      "width": 47.824615108487556,
      "height": 2.509479307622914,
      "name": "Nested: yes Row 4",
      "value": "",
      "previewText": "",
      "type": "table-row",
      "fontSize": 12,
      "letterSpacing": 0,
      "parentFieldId": "6e446a67-58c4-4337-bde4-20f86c6fa82c",
      "rowIndex": 3
    },
    {
      "id": "2b854b50-209a-414c-97af-27ad5d434053",
      "page": 1,
      "x": 42.946264757498405,
      "y": 55.5251741250141,
      "width": 47.824615108487556,
      "height": 2.7515716621560666,
      "name": "Nested: yes Row 5",
      "value": "",
      "previewText": "",
      "type": "table-row",
      "fontSize": 12,
      "letterSpacing": 0,
      "parentFieldId": "6e446a67-58c4-4337-bde4-20f86c6fa82c",
      "rowIndex": 4
    },
    {
      "id": "9e147738-082f-45be-a529-4e7122b792c5",
      "page": 1,
      "x": 42.946264757498405,
      "y": 58.276745787170164,
      "width": 47.824615108487556,
      "height": 2.4532730040595396,
      "name": "Nested: yes Row 6",
      "value": "",
      "previewText": "",
      "type": "table-row",
      "fontSize": 12,
      "letterSpacing": 0,
      "parentFieldId": "6e446a67-58c4-4337-bde4-20f86c6fa82c",
      "rowIndex": 5
    },
    {
      "id": "7585805c-d7f3-4c42-bec0-37c127361080",
      "page": 1,
      "x": 42.946264757498405,
      "y": 60.7300187912297,
      "width": 47.824615108487556,
      "height": 2.624534844384303,
      "name": "Nested: yes Row 7",
      "value": "",
      "previewText": "",
      "type": "table-row",
      "fontSize": 12,
      "letterSpacing": 0,
      "parentFieldId": "6e446a67-58c4-4337-bde4-20f86c6fa82c",
      "rowIndex": 6
    },
    {
      "id": "db82c094-1662-41e2-9b08-e7bde758b3a8",
      "page": 1,
      "x": 42.946264757498405,
      "y": 63.354553635614,
      "width": 47.824615108487556,
      "height": 2.4860453315290933,
      "name": "Nested: yes Row 8",
      "value": "",
      "previewText": "",
      "type": "table-row",
      "fontSize": 12,
      "letterSpacing": 0,
      "parentFieldId": "6e446a67-58c4-4337-bde4-20f86c6fa82c",
      "rowIndex": 7
    },
    {
      "id": "9757a13e-da41-4ce8-8610-a0fa614bfa96",
      "page": 1,
      "x": 42.946264757498405,
      "y": 65.8405989671431,
      "width": 47.824615108487556,
      "height": 2.7041751240414977,
      "name": "Nested: yes Row 9",
      "value": "",
      "previewText": "",
      "type": "table-row",
      "fontSize": 12,
      "letterSpacing": 0,
      "parentFieldId": "6e446a67-58c4-4337-bde4-20f86c6fa82c",
      "rowIndex": 8
    },
    {
      "id": "c13edcd5-9a1b-4211-bf2f-16773d22055e",
      "page": 1,
      "x": 42.946264757498405,
      "y": 68.54477409118459,
      "width": 47.824615108487556,
      "height": 2.6530784844384305,
      "name": "Nested: yes Row 10",
      "value": "",
      "previewText": "",
      "type": "table-row",
      "fontSize": 12,
      "letterSpacing": 0,
      "parentFieldId": "6e446a67-58c4-4337-bde4-20f86c6fa82c",
      "rowIndex": 9
    },
    {
      "id": "8bc96997-e01a-4f57-b30e-6198c407cf9b",
      "page": 1,
      "x": 42.946264757498405,
      "y": 71.19785257562302,
      "width": 47.824615108487556,
      "height": 2.5529995489400092,
      "name": "Nested: yes Row 11",
      "value": "",
      "previewText": "",
      "type": "table-row",
      "fontSize": 12,
      "letterSpacing": 0,
      "parentFieldId": "6e446a67-58c4-4337-bde4-20f86c6fa82c",
      "rowIndex": 10
    },
    {
      "id": "44d3d45e-233a-40fa-ad46-4f1f3c706910",
      "page": 1,
      "x": 42.946264757498405,
      "y": 73.75085212456302,
      "width": 47.824615108487556,
      "height": 2.6002198917456023,
      "name": "Nested: yes Row 12",
      "value": "",
      "previewText": "",
      "type": "table-row",
      "fontSize": 12,
      "letterSpacing": 0,
      "parentFieldId": "6e446a67-58c4-4337-bde4-20f86c6fa82c",
      "rowIndex": 11
    },
    {
      "id": "98e6e2c9-a86d-4e15-80e3-bb3da590461e",
      "page": 1,
      "x": 42.946264757498405,
      "y": 76.35107201630862,
      "width": 47.824615108487556,
      "height": 2.53220850248083,
      "name": "Nested: yes Row 13",
      "value": "",
      "previewText": "",
      "type": "table-row",
      "fontSize": 12,
      "letterSpacing": 0,
      "parentFieldId": "6e446a67-58c4-4337-bde4-20f86c6fa82c",
      "rowIndex": 12
    },
    {
      "id": "5a154326-f708-4447-91d0-6b99a299b064",
      "page": 1,
      "x": 4.593426036682616,
      "y": 39.94979428331102,
      "width": 37.838292464114836,
      "height": 11.779523675310038,
      "name": "Details of my incomes from this employer",
      "value": "Monthly salary",
      "previewText": "",
      "type": "radio",
      "fontSize": 12,
      "letterSpacing": 0,
      "options": [
        {
          "id": "46bfe083-d172-441e-849e-49fd288dff9c",
          "x": 38.42266472129724,
          "y": 41.39118058887905,
          "width": 5,
          "height": 3,
          "value": "Monthly salary"
        },
        {
          "id": "f628208d-ae77-463a-9010-13d805fa12a9",
          "x": 38.224972080836714,
          "y": 42.84954802752217,
          "width": 5,
          "height": 3,
          "value": "Salary for additional employment"
        },
        {
          "id": "46632cf5-40ce-4afa-8b52-975d80a4c634",
          "x": 38.447221372119486,
          "y": 44.31297221298583,
          "width": 5,
          "height": 3,
          "value": "Partial salary"
        },
        {
          "id": "a74151cf-9a95-4144-bec2-2e8d8985cfe5",
          "x": 38.41865120911453,
          "y": 45.62758687463997,
          "width": 5,
          "height": 3,
          "value": "Wage (Daily rate of pay)"
        }
      ],
      "borderWidth": 0,
      "padding": 2,
      "markStyle": "checkmark"
    },
    {
      "id": "ec5e4af6-98ca-4287-b6cd-5763366d7ce6",
      "page": 1,
      "x": 14.541437810063783,
      "y": 48.88222754151003,
      "width": 13.674920269312548,
      "height": 1.5527098997493738,
      "name": "If you have also Allowance/Scholarship",
      "value": "",
      "previewText": "",
      "type": "checkbox",
      "fontSize": 12,
      "letterSpacing": 0,
      "options": [
        {
          "id": "bc5cddba-374d-4221-b07b-bb140187220f",
          "x": 38.188784549964566,
          "y": 47.467166451284456,
          "width": 5.325290131112687,
          "height": 2.428336466165414,
          "value": "Allowance"
        },
        {
          "id": "1320241a-dcdb-47a8-bb7f-fd8663cc03fe",
          "x": 38.21370038979447,
          "y": 48.83464765429199,
          "width": 5.426337703756201,
          "height": 2.3453164160401005,
          "value": "Scholarship"
        }
      ],
      "borderWidth": 0,
      "padding": 2
    },
    {
      "id": "2ef095a7-3ca7-4cae-b282-bda4d16323bd",
      "page": 1,
      "x": 5.3218884120171674,
      "y": 44.32301153612629,
      "width": 15.190115343347639,
      "height": 2.5142778536733417,
      "name": "Date of beginning of work in the tax year",
      "value": "02/12/2025",
      "previewText": "DD/MM/YYYY",
      "type": "date",
      "fontSize": 12,
      "letterSpacing": 4.5,
      "options": [],
      "borderWidth": 0,
      "padding": 2,
      "dateFormat": "DD/MM/YYYY",
      "dateHideSeparator": true,
      "hidden": true
    },
    {
      "id": "555b3795-b5eb-4b6f-ac3c-6c62cebcfc87",
      "page": 1,
      "x": 4.807404674537333,
      "y": 52.331779731196434,
      "width": 37.78343371091257,
      "height": 26.903966508795676,
      "name": "Do you have other incomes?",
      "value": "I have other incomes as follows",
      "previewText": "",
      "type": "radio",
      "fontSize": 12,
      "letterSpacing": 0,
      "options": [
        {
          "id": "cc6d4605-2336-480e-9a83-e12f05cdfc33",
          "x": 38.091546346522016,
          "y": 52.785658847118846,
          "width": 5,
          "height": 3,
          "value": "I have no other income including scholarships"
        },
        {
          "id": "c15e06a4-73d9-446a-840e-530add632441",
          "x": 38.13641711869815,
          "y": 55.7533164362032,
          "width": 5,
          "height": 3,
          "value": "I have other incomes as follows"
        }
      ],
      "borderWidth": 0,
      "padding": 2
    },
    {
      "id": "bf578394-cbc2-4fd6-a6e9-37cd17c43f6a",
      "page": 1,
      "x": 43.13641711869815,
      "y": 60.7533164362032,
      "width": 20,
      "height": 3,
      "name": "Types of income",
      "value": "Option 1,Option 2,Option 3,Option 4,Option 5,Option 6,Monthly salary,Salary for additional employment,Partial salary,Wage (Daily rate of pay),Allowance,Scholarship",
      "previewText": "",
      "type": "checkbox",
      "fontSize": 12,
      "letterSpacing": 0,
      "options": [
        {
          "id": "266f46bb-5f6d-4054-b42b-ced2c5e39e75",
          "x": 38.03436104020422,
          "y": 57.24544402979814,
          "width": 5,
          "height": 3,
          "value": "Monthly salary"
        },
        {
          "id": "9c3d38fe-cfcd-48b0-8ff4-dab41f689d3a",
          "x": 38.06153278557754,
          "y": 58.53114119939669,
          "width": 5,
          "height": 3,
          "value": "Salary for additional employment"
        },
        {
          "id": "0a0cebd3-b853-4e2e-a4f6-74a0d2b92545",
          "x": 37.990138401403954,
          "y": 59.81067153318109,
          "width": 5,
          "height": 3,
          "value": "Partial salary"
        },
        {
          "id": "fe0b9b99-9fca-4fb0-a055-ba96577f74bb",
          "x": 18.271079291640078,
          "y": 57.21901473345172,
          "width": 5,
          "height": 3,
          "value": "Wage (Daily rate of pay)"
        },
        {
          "id": "21f9bc9a-9f0f-4d21-ad9c-c2fcd14fb39d",
          "x": 18.257019783024884,
          "y": 58.575542417258674,
          "width": 5,
          "height": 3,
          "value": "Allowance"
        },
        {
          "id": "658e5f97-1420-4622-9058-d04303dc5f1c",
          "x": 18.286335354179958,
          "y": 59.80626665045669,
          "width": 5,
          "height": 3,
          "value": "Scholarship"
        }
      ],
      "parentFieldId": "555b3795-b5eb-4b6f-ac3c-6c62cebcfc87",
      "parentOptionId": "c15e06a4-73d9-446a-840e-530add632441"
    },
    {
      "id": "6df48cdf-0e9d-4e6e-b366-6a46db577c6b",
      "page": 1,
      "x": 43.13641711869815,
      "y": 60.7533164362032,
      "width": 20,
      "height": 3,
      "name": "Receives tax credits at other income ",
      "value": "I receive tax credits and tax bracket against another income, therefore I'm not entitled to them against this income",
      "previewText": "",
      "type": "radio",
      "fontSize": 12,
      "letterSpacing": 0,
      "options": [
        {
          "id": "c4a4fdc7-12f6-47b7-aac9-a3865baeccff",
          "x": 37.992980216975106,
          "y": 62.66891183539129,
          "width": 5,
          "height": 3,
          "value": "I request to receive tax credits and tax bracket for this income (section D). I do not receive them against any other income."
        },
        {
          "id": "dbfef74a-fc70-4022-9654-9fd81d20fc76",
          "x": 37.94511805998723,
          "y": 65.43588296755188,
          "width": 5,
          "height": 3,
          "value": "I receive tax credits and tax bracket against another income, therefore I'm not entitled to them against this income"
        }
      ],
      "parentFieldId": "555b3795-b5eb-4b6f-ac3c-6c62cebcfc87",
      "parentOptionId": "c15e06a4-73d9-446a-840e-530add632441"
    },
    {
      "id": "28bce723-c8bb-4803-8935-06050207060e",
      "page": 1,
      "x": 43.13641711869815,
      "y": 60.7533164362032,
      "width": 20,
      "height": 3,
      "name": "Contributions at other incomes ",
      "value": "No payments are made on my behalf to a Study fund from anther income, or all the employer contributions made to a Study fund from another income are attached to my other income,No payments are made on my behalf to a Study fund from anther income, or all the employer contributions made to a Study fund from another income are attached to my other income,No payments are made on my behalf to a Study fund from anther income, or all the employer contributions made to a Study fund from another income are attached to my other income,No payments are made on my behalf to a Study fund from anther income, or all the employer contributions made to a Study fund from another income are attached to my other income,No payments are made on my behalf to a Study fund from anther income, or all the employer contributions made to a Study fund from another income are attached to my other income,No payments are made on my behalf to a Study fund from anther income, or all the employer contributions made to a Study fund from another income are attached to my other income,No payments are made on my behalf to a Study fund from anther income, or all the employer contributions made to a Study fund from another income are attached to my other income,No payments are made on my behalf to a Study fund from anther income, or all the employer contributions made to a Study fund from another income are attached to my other income,No payments are made on my behalf to a Study fund from anther income, or all the employer contributions made to a Study fund from another income are attached to my other income,No payments are made on my behalf to a Study fund from anther income, or all the employer contributions made to a Study fund from another income are attached to my other income,No payments are made on my behalf to a Study fund from anther income, or all the employer contributions made to a Study fund from another income are attached to my other income,No payments are made on my behalf to a Study fund from anther income, or all the employer contributions made to a Study fund from another income are attached to my other income,No payments are made on my behalf to a Study fund from anther income, or all the employer contributions made to a Study fund from another income are attached to my other income,No payments are made on my behalf to a Study fund from anther income, or all the employer contributions made to a Study fund from another income are attached to my other income,No payments are made on my behalf to a Study fund from anther income, or all the employer contributions made to a Study fund from another income are attached to my other income,No payments are made on my behalf to pension / loss of working capacity insurance / severance pay from another income, or all the employer contributions to pension / loss of working capacity insurance / severance pay from my other income are attached to my other income.,No payments are made on my behalf to a Study fund from anther income, or all the employer contributions made to a Study fund from another income are attached to my other income,No payments are made on my behalf to a Study fund from anther income, or all the employer contributions made to a Study fund from another income are attached to my other income,No payments are made on my behalf to a Study fund from anther income, or all the employer contributions made to a Study fund from another income are attached to my other income,No payments are made on my behalf to a Study fund from anther income, or all the employer contributions made to a Study fund from another income are attached to my other income,No payments are made on my behalf to pension / loss of working capacity insurance / severance pay from another income, or all the employer contributions to pension / loss of working capacity insurance / severance pay from my other income are attached to my other income.,No payments are made on my behalf to a Study fund from anther income, or all the employer contributions made to a Study fund from another income are attached to my other income,No payments are made on my behalf to pension / loss of working capacity insurance / severance pay from another income, or all the employer contributions to pension / loss of working capacity insurance / severance pay from my other income are attached to my other income.,No payments are made on my behalf to pension / loss of working capacity insurance / severance pay from another income, or all the employer contributions to pension / loss of working capacity insurance / severance pay from my other income are attached to my other income.,No payments are made on my behalf to a Study fund from anther income, or all the employer contributions made to a Study fund from another income are attached to my other income,No payments are made on my behalf to a Study fund from anther income, or all the employer contributions made to a Study fund from another income are attached to my other income,No payments are made on my behalf to pension / loss of working capacity insurance / severance pay from another income, or all the employer contributions to pension / loss of working capacity insurance / severance pay from my other income are attached to my other income.,No payments are made on my behalf to a Study fund from anther income, or all the employer contributions made to a Study fund from another income are attached to my other income,No payments are made on my behalf to a Study fund from anther income, or all the employer contributions made to a Study fund from another income are attached to my other income,No payments are made on my behalf to a Study fund from anther income, or all the employer contributions made to a Study fund from another income are attached to my other income|||No payments are made on my behalf to a Study fund from anther income, or all the employer contributions made to a Study fund from another income are attached to my other income|||No payments are made on my behalf to pension / loss of working capacity insurance / severance pay from another income, or all the employer contributions to pension / loss of working capacity insurance / severance pay from my other income are attached to my other income.",
      "previewText": "",
      "type": "checkbox",
      "fontSize": 12,
      "letterSpacing": 0,
      "options": [
        {
          "id": "004a15ce-e01c-4e8f-85cc-93d036805ba8",
          "x": 37.88053424537897,
          "y": 68.32045388615315,
          "width": 5,
          "height": 3,
          "value": "No payments are made on my behalf to a Study fund from anther income, or all the employer contributions made to a Study fund from another income are attached to my other income"
        },
        {
          "id": "0f2343ec-2a53-4c57-ad33-672f922b833a",
          "x": 37.85897108189701,
          "y": 72.45036504731432,
          "width": 5,
          "height": 3,
          "value": "No payments are made on my behalf to pension / loss of working capacity insurance / severance pay from another income, or all the employer contributions to pension / loss of working capacity insurance / severance pay from my other income are attached to my other income."
        }
      ],
      "parentFieldId": "555b3795-b5eb-4b6f-ac3c-6c62cebcfc87",
      "parentOptionId": "c15e06a4-73d9-446a-840e-530add632441"
    },
    {
      "id": "0047181e-043a-4f9d-9949-b7b6e615ffc2",
      "page": 2,
      "x": 85.9733966177409,
      "y": 5.738631658420726,
      "width": 1.51413927887684,
      "height": 1.1302929070816425,
      "name": "Do you live in Israel?",
      "value": "Option 1",
      "previewText": "",
      "type": "checkbox",
      "fontSize": 12,
      "letterSpacing": 0,
      "options": [
        {
          "id": "c3ba12c4-d266-4428-aab1-94a7551d50e1",
          "x": 84.91843490746648,
          "y": 4.613272219990412,
          "width": 3.9361638481174266,
          "height": 2.7750761163734787,
          "value": "Option 1"
        }
      ],
      "borderWidth": 0,
      "padding": 2
    },
    {
      "id": "30fe436b-7984-4021-be1f-b72b786db9eb",
      "page": 2,
      "x": 4.806656828334397,
      "y": 7.235234612863667,
      "width": 85.68198588066369,
      "height": 4.288065234551197,
      "name": "Are you",
      "value": "Option 2|||Option 1|||100% disabled or permanently blind|||In addition, I receive a monthly compensation in accordance with Disabled Law (compensation and rehabilitation) or the Compensation for Victims of Hostile Acts Law",
      "previewText": "",
      "type": "checkbox",
      "fontSize": 12,
      "letterSpacing": 0,
      "options": [
        {
          "id": "e4cd9bf8-0d54-4272-aa5b-aa811dc02d37",
          "x": 84.21745373324825,
          "y": 6.338576685484326,
          "width": 5,
          "height": 3,
          "value": "100% disabled or permanently blind"
        },
        {
          "id": "457f2379-2a63-454a-b9ee-85850229438f",
          "x": 84.13095285577538,
          "y": 8.986263593468086,
          "width": 5,
          "height": 3,
          "value": "In addition, I receive a monthly compensation in accordance with Disabled Law (compensation and rehabilitation) or the Compensation for Victims of Hostile Acts Law"
        }
      ],
      "borderWidth": 0,
      "padding": 2
    }
  ],
  "createdAt": "2025-11-27T17:10:07.600Z",
  "category": "EDIT_THIS_CATEGORY"
}
];
