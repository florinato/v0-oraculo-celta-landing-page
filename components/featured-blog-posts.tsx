"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Tag, BookOpen, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import type { BlogPost } from "@/lib/blog-storage"

export function FeaturedBlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/blog")
      const data = await response.json()
      // Get only the 3 most recent posts
      setPosts((data.posts || []).slice(0, 3))
    } catch (error) {
      console.error("Error fetching blog posts:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="text-center text-muted-foreground">Cargando artículos...</div>
      </section>
    )
  }

  if (posts.length === 0) {
    return null
  }

  return (
    <section className="py-16 border-t border-primary/10">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <BookOpen className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-serif text-balance mb-3">
              Aprende los <span className="text-primary">secretos del Tarot</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Descubre la sabiduría ancestral y profundiza en el conocimiento del tarot celta
            </p>
          </div>

          {/* Blog Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Card
                key={post.slug || post.id}
                className="bg-card/80 backdrop-blur-sm border border-primary/20 hover:border-primary/40 
                         hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 
                         cursor-pointer group overflow-hidden"
                onClick={() => router.push(`/blog/${post.slug}`)}
              >
                {post.imageUrl && (
                  <div className="relative w-full h-40 overflow-hidden">
                    <Image
                      src={post.imageUrl || "/placeholder.svg"}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                  </div>
                )}
                <CardHeader className="space-y-2 pb-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.createdAt).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "short",
                      })}
                    </div>
                    {post.category && (
                      <div className="flex items-center gap-1 px-2 py-0.5 bg-primary/10 rounded-full">
                        <Tag className="w-3 h-3" />
                        <span className="text-primary font-medium">{post.category}</span>
                      </div>
                    )}
                  </div>
                  <CardTitle className="text-lg font-serif group-hover:text-primary transition-colors leading-tight line-clamp-2">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-sm line-clamp-2 mb-3">{post.excerpt}</CardDescription>
                  <span className="text-primary text-sm font-medium group-hover:underline">
                    Leer artículo
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA to full blog */}
          <div className="text-center mt-10">
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push("/blog")}
              className="border-primary/40 hover:bg-primary/10 hover:border-primary transition-all duration-300 group"
            >
              <span>Ver todos los artículos</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
