"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Tag } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import type { BlogPost } from "@/lib/blog-storage"

export default function BlogPage() {
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
      setPosts(data.posts || [])
    } catch (error) {
      console.error("Error fetching blog posts:", error)
    } finally {
      setIsLoading(false)
    }
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
              onClick={() => router.push("/")}
              className="text-foreground hover:text-primary"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            <h1 className="text-2xl font-serif text-primary font-bold">Blog del Oráculo</h1>
          </div>
        </div>
      </header>

      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="flex justify-center mb-6">
                <Calendar className="w-12 h-12 text-primary animate-pulse" />
              </div>
              <h2 className="text-4xl md:text-5xl font-serif text-balance mb-4 text-primary">Sabiduría Ancestral</h2>
              <p className="text-lg text-muted-foreground text-pretty">
                Descubre los secretos del tarot, la astrología y el misticismo
              </p>
            </div>

            {isLoading ? (
              <div className="text-center text-muted-foreground">Cargando artículos...</div>
            ) : posts.length === 0 ? (
              <div className="text-center">
                <Card className="bg-card/50 border-primary/20">
                  <CardContent className="py-12">
                    <p className="text-muted-foreground">
                      Próximamente encontrarás aquí artículos sobre tarot, astrología y misticismo.
                    </p>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <Card
                    key={post.slug || post.id}
                    className="bg-card border-2 border-primary/20 hover:border-primary/40 
                             hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 
                             cursor-pointer group overflow-hidden"
                    onClick={() => router.push(`/blog/${post.slug}`)}
                  >
                    {post.imageUrl && (
                      <div className="relative w-full h-48 overflow-hidden">
                        <Image
                          src={post.imageUrl || "/placeholder.svg"}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                      </div>
                    )}
                    {!post.imageUrl && <div className="px-6 pt-4"></div>}
                    <CardHeader className="space-y-3">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(post.createdAt).toLocaleDateString("es-ES", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                        {post.category && (
                          <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 rounded-full">
                            <Tag className="w-3 h-3" />
                            <span className="text-primary font-medium">{post.category}</span>
                          </div>
                        )}
                      </div>
                      <CardTitle className="text-xl font-serif group-hover:text-primary transition-colors leading-tight">
                        {post.title}
                      </CardTitle>
                      <CardDescription className="text-sm line-clamp-3">{post.excerpt}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        variant="ghost"
                        className="text-primary hover:text-primary/80 hover:bg-primary/10 w-full justify-start px-0"
                      >
                        Leer más →
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
