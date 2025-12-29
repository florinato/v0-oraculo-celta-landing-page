import { put, list, del } from "@vercel/blob"

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  imageUrl: string
  category: string
  createdAt: string
  updatedAt: string
}

const BLOG_PREFIX = "blog-posts/"

export async function saveBlogPost(post: BlogPost): Promise<{ url: string }> {
  const filename = `${BLOG_PREFIX}${post.slug}.json`
  const blob = new Blob([JSON.stringify(post)], { type: "application/json" })
  const file = new File([blob], filename, { type: "application/json" })

  const result = await put(filename, file, {
    access: "public",
  })

  return { url: result.url }
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    const { blobs } = await list({ prefix: BLOG_PREFIX })

    const posts = await Promise.all(
      blobs.map(async (blob) => {
        const response = await fetch(blob.url)
        const post: BlogPost = await response.json()
        return post
      }),
    )

    // Sort by createdAt descending
    return posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return []
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const decodedSlug = decodeURIComponent(slug)

    const { blobs } = await list({ prefix: BLOG_PREFIX })

    // Buscar el blob que coincida con el slug
    const matchingBlob = blobs.find((blob) => {
      const blobSlug = blob.pathname.replace(BLOG_PREFIX, "").replace(".json", "")
      // Comparar con el slug decodificado
      return blobSlug === decodedSlug
    })

    if (!matchingBlob) {
      console.log("[v0] No se encontró blob para slug:", decodedSlug)
      console.log(
        "[v0] Blobs disponibles:",
        blobs.map((b) => b.pathname),
      )
      return null
    }

    const response = await fetch(matchingBlob.url)
    const post: BlogPost = await response.json()
    return post
  } catch (error) {
    console.error("[v0] Error fetching blog post:", error)
    return null
  }
}

export async function deleteBlogPost(slug: string): Promise<void> {
  const filename = `${BLOG_PREFIX}${slug}.json`
  const { blobs } = await list({ prefix: filename })

  if (blobs.length > 0) {
    await del(blobs[0].url)
  }
}
