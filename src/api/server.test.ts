import assert from 'assert'
import { server } from './server'

// TODO: Split per feature
describe('Server (integration)', () => {
  test('Accessing non-existing project creates a demo list', async () => {
    const query = `query GetProgress($progressId: ID) {
            progress(id: $progressId) {
              displayName
              id
              phases {
                status
                displayName
                tasks {
                  displayName
                }
              }
            }
          }
          `
    const { body } = await server.executeOperation({
      query,
      variables: { progressId: '2' },
    })
    assert(body.kind === 'single')
    expect(body.singleResult.data).toMatchInlineSnapshot(`
{
  "progress": {
    "displayName": "My startup progress",
    "id": "2",
    "phases": [
      {
        "displayName": "Foundation",
        "status": "OPEN",
        "tasks": [
          {
            "displayName": "Set up virtual office",
          },
          {
            "displayName": "Set mission & vision",
          },
          {
            "displayName": "Select business name",
          },
          {
            "displayName": "Buy domains",
          },
        ],
      },
      {
        "displayName": "Discovery",
        "status": "BLOCKED",
        "tasks": [
          {
            "displayName": "Create roadmap",
          },
          {
            "displayName": "Competitor analyses",
          },
        ],
      },
      {
        "displayName": "Delivery",
        "status": "BLOCKED",
        "tasks": [
          {
            "displayName": "Release marketing website",
          },
          {
            "displayName": "Release MVP",
          },
        ],
      },
    ],
  },
}
`)
  })
})
