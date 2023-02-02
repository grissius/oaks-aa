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

## Requirements check

Entities:
 - Task: Individual check item
 - Phase: Task group
 - Progress: Startup progress list (for multi-tenancy).

For the sake of simplicity of the setup, new progress is auto-created with the default values when requested. Updating the check-list items is not possible through API at this point.

### Functional Requirements
- **Every phase can have an unlimited amount of tasks.**
  - The API is ready for large tasks in each phase, content is paginated.
- **If the startup accomplishes all tasks in the phase, it’s marked as done and unlocks the next phase.**
  - This is done on the database level. Client knows about state of the phase (if it's unlocked or not).
- **Tasks cannot be marked as completed unless all tasks in the previous phase were completed.**
  - This is handled in the service layer
- **Propose and implement a solution how to reopen (undo) a task.**
  - Implemented, trivial thanks to the previous step

### Non-Functional Requirements
- **Pay attention to code structure and architecture. Do not use any frameworks and libraries that provide out-of-box application architecture and file/data structure e.g. NestJS, TypeORM.**
  - Hexagonal architecture used (ISP, separated domain), vertical layering. Splitting the API into features is a `TODO`.
- **Create a public repository and publish your code.**
  - Available here https://github.com/grissius/oaks-aa
- **Write a few unit tests (no need to cover all the code).**
  - Repository test + API test implemented
- **Create a CI/CD pipeline that would run when somebody opens a PR and would prevent merging the PR until tests pass. Create a small PR to demonstrate it and keep the PR open.**
  - Example run here: https://github.com/grissius/oaks-aa/actions/runs/4077789589/jobs/7027232754
- **(Optional, bonus) Deploy your code to a cloud service provider (free and with minimum set up) and make sure the API is public and accessible. Send us a link.**
  - Skipped

### Requirements - Backend (recommended)
- **Implement a GraphQL API using Node.js, TypeScript**
  - Done, relevant technologies from stack used
- **Store the progress in memory (not database)**
  - Done
- **Design a database schema to store the data (no need to implement)**
  - See bellow


### Database

![](https://www.plantuml.com/plantuml/png/ZP0zReSm3CNtdC8Nu09C_wbBbzu0cSIYQJuSsKOgGjozeQ2kPOjUtdi_soyr55jBTffYRIXOO4QV5k6r1i-P1KomQl-YQexdB_86XffWTm0nZF3ntXyXQikuJHKBZM3qRLtqN5eceswQcJDXxMBxHANf3BwTGPP0CYNQHeWTSBYRSVaUG9hm8gJwfFAs_jjwkDyDZ-6Qmlq5Xs6_fHVLqE_s0m00)

Assuming there is only a couple of phases per startup, the phase completeness could be done on the query level (draft):

```sql
SELECT
  id, ...
  EXISTS(
      SELECT 1
      FROM task t
      WHERE t.id = id
      LIMIT 1
  )
FROM phase
WHERE phase.progress_id = :progress_id
```