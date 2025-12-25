"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Tag } from "lucide-react"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"
import type { BlogPost } from "@/lib/blog-storage"

export default function BlogPostPage() {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    if (params.slug) {
      fetchPost(params.slug as string)
    }
  }, [params.slug])

  const fetchPost = async (slug: string) => {
    try {
      const response = await fetch(`/api/blog/${slug}`)
      const data = await response.json()
      setPost(data.post || null)
    } catch (error) {
      console.error("Error fetching blog post:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Cargando artículo...</p>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Artículo no encontrado</p>
          <Button onClick={() => router.push("/blog")}>Volver al blog</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/blog")}
              className="text-foreground hover:text-primary"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al blog
            </Button>
            <h1 className="text-2xl font-serif text-primary font-bold">Blog del Oráculo</h1>
          </div>
        </div>
      </header>

      <main className="pt-20 pb-16">
        <article className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto">
            {post.imageUrl && (
              <div className="relative w-full h-96 mb-8 rounded-xl overflow-hidden border-2 border-primary/20">
                <Image src={post.imageUrl || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
              </div>
            )}

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(post.createdAt).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              {post.category && (
                <div className="flex items-center gap-1">
                  <Tag className="w-4 h-4" />
                  {post.category}
                </div>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-serif text-balance mb-6">{post.title}</h1>

            {post.excerpt && <p className="text-xl text-muted-foreground mb-8 text-pretty">{post.excerpt}</p>}

            <div
              className="prose-gold prose prose-lg dark:prose-invert max-w-none 
                         prose-headings:font-serif prose-headings:text-primary 
                         prose-a:text-primary hover:prose-a:text-primary/80
                         prose-p:text-foreground prose-li:text-foreground
                         prose-strong:text-primary prose-em:text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </article>
      </main>
    </div>
  )
}
