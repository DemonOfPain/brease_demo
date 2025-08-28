export async function GET() {
  const data = 'GET api/teams/[team]/sites/[site]/enviroments/[enviroment]'

  return Response.json({ data })
}
