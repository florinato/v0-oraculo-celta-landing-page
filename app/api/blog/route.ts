import { type NextRequest, NextResponse } from "next/server"
import { getAllBlogPosts, saveBlogPost, deleteBlogPost } from "@/lib/blog-storage"
import type { BlogPost } from "@/lib/blog-storage"
import { put } from "@vercel/blob"

function validateApiKey(request: NextRequest): boolean {
  const authHeader = request.headers.get("Authorization")
  const expectedToken = process.env.BLOG_API_SECRET

  console.log("[v0] Auth validation check:")
  console.log("[v0] - BLOG_API_SECRET is set:", !!expectedToken)
  console.log("[v0] - Auth header present:", !!authHeader)
  console.log("[v0] - Auth header format:", authHeader?.substring(0, 20) + "...")

  if (!expectedToken) {
    console.error("[v0] BLOG_API_SECRET environment variable is not set")
    return false
  }

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.error("[v0] Invalid or missing Authorization header")
    return false
  }

  const token = authHeader.substring(7) // Remove "Bearer " prefix
  const isValid = token === expectedToken

  console.log("[v0] Token validation result:", isValid)

  return isValid
}

async function uploadBase64Image(base64Data: string, filename: string): Promise<string> {
  // Extract the actual base64 data (remove data:image/...;base64, prefix if present)
  const base64Match = base64Data.match(/^data:image\/\w+;base64,(.+)$/)
  const base64String = base64Match ? base64Match[1] : base64Data

  // Convert base64 to buffer
  const buffer = Buffer.from(base64String, "base64")
  const blob = new Blob([buffer])
  const file = new File([blob], filename, { type: "image/jpeg" })

  // Upload to Vercel Blob
  const result = await put(`blog-images/${filename}`, file, {
    access: "public",
  })

  return result.url
}

// GET all blog posts
export async function GET() {
  try {
    const posts = await getAllBlogPosts()
    return NextResponse.json({ posts })
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 })
  }
}

// POST create new blog post
export async function POST(request: NextRequest) {
  console.log("[v0] POST request received to /api/blog")

  if (!validateApiKey(request)) {
    console.error("[v0] Unauthorized access attempt")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  console.log("[v0] Authorization successful")

  try {
    const post: BlogPost = await request.json()
    console.log("[v0] Post data received:", { title: post.title, slug: post.slug })

    // Validate required fields
    if (!post.title || !post.slug || !post.content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (post.imageUrl && (post.imageUrl.startsWith("data:image") || post.imageUrl.length > 500)) {
      try {
        const imageFilename = `${post.slug}-${Date.now()}.jpg`
        console.log("[v0] Uploading image to Blob:", imageFilename)
        post.imageUrl = await uploadBase64Image(post.imageUrl, imageFilename)
        console.log("[v0] Image uploaded successfully:", post.imageUrl)
      } catch (error) {
        console.error("[v0] Error uploading image:", error)
        // Continue without image if upload fails
        post.imageUrl = ""
      }
    }

    // Add timestamps
    const now = new Date().toISOString()
    post.createdAt = post.createdAt || now
    post.updatedAt = now

    const result = await saveBlogPost(post)
    console.log("[v0] Blog post saved successfully:", result.url)

    return NextResponse.json({ success: true, url: result.url, imageUrl: post.imageUrl })
  } catch (error) {
    console.error("[v0] Error creating blog post:", error)
    return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 })
  }
}

// DELETE blog post
export async function DELETE(request: NextRequest) {
  if (!validateApiKey(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { slug } = await request.json()

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 })
    }

    await deleteBlogPost(slug)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting blog post:", error)
    return NextResponse.json({ error: "Failed to delete blog post" }, { status: 500 })
  }
}
