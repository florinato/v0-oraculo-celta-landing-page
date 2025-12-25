import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("Authorization")
  const expectedToken = process.env.BLOG_API_SECRET

  return NextResponse.json({
    hasAuthHeader: !!authHeader,
    authHeaderFormat: authHeader ? authHeader.substring(0, 20) + "..." : "none",
    hasEnvVariable: !!expectedToken,
    envVariableFormat: expectedToken ? expectedToken.substring(0, 20) + "..." : "none",
    tokenLengths: {
      received: authHeader ? authHeader.substring(7).length : 0,
      expected: expectedToken ? expectedToken.length : 0,
    },
  })
}
