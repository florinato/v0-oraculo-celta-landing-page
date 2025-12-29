import type { Metadata } from "next"
import { getBlogPostBySlug } from "@/lib/blog-storage"
import BlogPostClient from "./blog-post-client"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)

  if (!post) {
    return {
      title: "Artículo no encontrado",
      description: "El artículo que buscas no existe.",
    }
  }

  return {
    title: post.title,
    description: post.excerpt || `Lee ${post.title} en el blog del Oráculo de Elara`,
    openGraph: {
      title: post.title,
      description: post.excerpt || `Lee ${post.title} en el blog del Oráculo de Elara`,
      type: "article",
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt || post.createdAt,
      url: `https://tarotcelta.es/blog/${post.slug}`,
      images: post.imageUrl
        ? [
            {
              url: post.imageUrl,
              width: 1200,
              height: 630,
              alt: post.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt || `Lee ${post.title} en el blog del Oráculo de Elara`,
      images: post.imageUrl ? [post.imageUrl] : undefined,
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  return <BlogPostClient slug={slug} />
}
