# API de Blog - Oráculo Celta

Documentación completa de la API REST para gestionar artículos del blog.

## Base URL

\`\`\`
/api/blog
\`\`\`

## Autenticación

Los endpoints POST y DELETE requieren autenticación mediante API Key.

Header requerido:
\`\`\`
Authorization: Bearer <BLOG_API_SECRET>
\`\`\`

La API valida el token contra la variable de entorno BLOG_API_SECRET. Si no coincide, retorna 401 Unauthorized.

## Endpoints

### 1. Obtener todos los posts

GET /api/blog

Obtiene una lista de todos los artículos del blog ordenados por fecha de creación.

Autenticación: No requerida

Response 200 OK:
\`\`\`json
{
  "posts": [
    {
      "id": "1",
      "title": "El Significado de los Arcanos Mayores",
      "slug": "significado-arcanos-mayores",
      "excerpt": "Descubre el profundo significado...",
      "content": "<h1>Introducción</h1><p>Los Arcanos Mayores...</p>",
      "imageUrl": "https://blob.vercel-storage.com/blog-images/arcanos.jpg",
      "category": "Tarot",
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z"
    }
  ]
}
\`\`\`

### 2. Crear un nuevo post

POST /api/blog

Crea un nuevo artículo en el blog.

Autenticación: Requerida (Bearer token)

Request Body:
\`\`\`json
{
  "title": "La Cruz Céltica en el Tarot",
  "slug": "cruz-celtica-tarot",
  "excerpt": "Una guía completa sobre la tirada de la Cruz Céltica",
  "content": "<h1>La Cruz Céltica</h1><p>Contenido en HTML...</p>",
  "imageUrl": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
  "category": "Tiradas"
}
\`\`\`

Campos Requeridos:
- title (string): Título del artículo
- slug (string): URL amigable única
- content (string): Contenido en formato HTML

Campos Opcionales:
- id (string): Identificador único
- excerpt (string): Resumen breve
- imageUrl (string): URL de imagen O imagen en Base64
- category (string): Categoría del artículo

Gestión Automática de Imágenes:
Si imageUrl contiene Base64, se detecta automáticamente, se sube a Vercel Blob y se reemplaza con la URL pública.

Response 200 OK:
\`\`\`json
{
  "success": true,
  "url": "https://blob.vercel-storage.com/blog-posts/slug.json",
  "imageUrl": "https://blob.vercel-storage.com/blog-images/slug.jpg"
}
\`\`\`

### 3. Eliminar un post

DELETE /api/blog

Elimina un artículo del blog por su slug.

Autenticación: Requerida (Bearer token)

Request Body:
\`\`\`json
{
  "slug": "cruz-celtica-tarot"
}
\`\`\`

Response 200 OK:
\`\`\`json
{
  "success": true
}
\`\`\`

## Tipos de Datos

\`\`\`typescript
interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string  // HTML nativo
  imageUrl: string
  category: string
  createdAt: string
  updatedAt: string
}
\`\`\`

## Ejemplo Python (SEO Copilot)

\`\`\`python
import requests
import base64

# Crear post con imagen Base64
with open('imagen.jpg', 'rb') as f:
    image_base64 = base64.b64encode(f.read()).decode('utf-8')

new_post = {
    "title": "Los Arcanos Menores",
    "slug": "arcanos-menores",
    "content": "<h1>Título</h1><p>Contenido HTML...</p>",
    "imageUrl": f"data:image/jpeg;base64,{image_base64}",
    "category": "Tarot"
}

response = requests.post(
    'https://tu-dominio.vercel.app/api/blog',
    headers={
        'Authorization': 'Bearer tu_token_secreto',
        'Content-Type': 'application/json'
    },
    json=new_post
)

print(response.json())
\`\`\`

## Variables de Entorno

Configura en Vercel:
\`\`\`
BLOG_API_SECRET=tu_token_secreto
BLOB_READ_WRITE_TOKEN=tu_token_blob
\`\`\`

## Notas Importantes

1. POST y DELETE requieren Authorization Bearer token
2. El campo content acepta HTML puro, no Markdown
3. Las imágenes Base64 se suben automáticamente a Blob
4. El slug debe ser único
5. El HTML renderizado hereda la estética dorada del Oráculo

## Rutas Públicas

- /blog - Lista de posts con grid elegante
- /blog/[slug] - Página individual del artículo
