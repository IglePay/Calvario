import { NextResponse } from "next/server"

export function middleware(request) {
    const token = request.cookies.get("jwt")?.value
    const url = request.nextUrl.clone()

    if (!token && url.pathname.startsWith("/control")) {
        url.pathname = "/"
        return NextResponse.redirect(url)
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/control/:path*"],
}
