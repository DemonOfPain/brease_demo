export async function GET() {
  const data = 'GET api/teams/[team]/sites/[site]/enviroments'

  return Response.json({ data })
}
