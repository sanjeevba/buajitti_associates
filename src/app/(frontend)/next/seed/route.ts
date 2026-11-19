// The template demo seed deletes collections and media. Use the non-destructive CLI importer instead.
export async function POST(): Promise<Response> {
  return Response.json(
    { error: 'The demo seed is disabled. Import original content with pnpm seed:legacy.' },
    { status: 410 },
  )
}
