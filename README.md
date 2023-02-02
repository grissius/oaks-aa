# Startup progress checklist

GraphQL API for managing checklists for startup progression

## Getting started

 - `npm ci` Install locked dependencies (see node version in `.nvmrc`)
 - `npm run build` Build TS, static TS check
 - `npm start` Runs build server (requires `build`)
 - `npm run dev` Runs source directly via `ts-node`

Once the server is running you can either visit http://localhost:4000/ to open playground or test API with curl:

```sh
curl --request POST \
    --header 'content-type: application/json' \
    --url http://localhost:4000/ \
    --data '{"query":"query progress($progressId: ID, $limit: Int) {\n  progress(id: $progressId) {\n    displayName\n    id\n    phases {\n      displayName\n      id\n      status\n      tasks(limit: $limit) {\n        completed\n        displayName\n        id\n      }\n    }\n  }\n}","variables":{"progressId":"my-startup","limit":10}}'
```
```json
{
  "data": {
    "progress": {
      "displayName": "My startup progress",
      "id": "my-startup",
      "phases": [
        {
          "displayName": "Foundation",
          "id": "c52e7495-be49-4d60-81e4-9cb0fded8810",
          "status": "OPEN",
          "tasks": [
            {
              "completed": false,
              "displayName": "Set up virtual office",
              "id": "f05bc933-c73a-4491-b43c-0c31910755f7"
            },
            { "completed": false, "displayName": "Set mission & vision", "id": "e53d3dc8-6ea3-4961-b615-c7d81892cd77" },
            { "completed": false, "displayName": "Select business name", "id": "a4eb0b5d-f74a-45e3-bb26-a44399eb10db" },
            { "completed": false, "displayName": "Buy domains", "id": "e144773f-e2fd-471e-bf8f-eb0332b41c0c" }
          ]
        },
        {
          "displayName": "Discovery",
          "id": "1430a811-c88e-4884-88bd-b14b67fa9766",
          "status": "BLOCKED",
          "tasks": [
            { "completed": false, "displayName": "Create roadmap", "id": "4ce36052-200c-4e9e-aff9-c45eec700e58" },
            { "completed": false, "displayName": "Competitor analyses", "id": "09b4baac-e7e3-4239-a737-393a1a269763" }
          ]
        },
        {
          "displayName": "Delivery",
          "id": "72f6e9b4-0796-4a34-9346-9ee52caf5794",
          "status": "BLOCKED",
          "tasks": [
            {
              "completed": false,
              "displayName": "Release marketing website",
              "id": "e34a4bcd-6599-4d76-b073-7be24089ec33"
            },
            { "completed": false, "displayName": "Release MVP", "id": "04e8ed16-d9c3-4138-bd36-ffa58d5d4a79" }
          ]
        }
      ]
    }
  }
}
```