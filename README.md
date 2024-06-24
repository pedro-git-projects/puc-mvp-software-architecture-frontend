# Projeto MPV em Arquitetura de Software (Songboxd)

Este é o frontend do MVP em Arquitetura de Software para a pós-graduação em engenharia de software da PUC-RJ desenvolvido com Next.js. A aplicação consome uma API própria de persistência hospedada [aqui](https://github.com/pedro-git-projects/puc-mvp-software-architecture-persistence) e as APIs públicas e gratuitas [Music Brainz](https://musicbrainz.org/doc/MusicBrainz_API) e [Cover Art Archive](https://musicbrainz.org/doc/Cover_Art_Archive/API).

## Tabela de Conteúdos

1. [Pré-requisitos](#pré-requisitos)
2. [Estrutura do Projeto](#estrutura-do-projeto)
3. [Configuração](#configuração)
4. [Desenvolvimento](#desenvolvimento)
5. [Uso](#uso)
6. [Dockerfile](#dockerfile)
7. [docker-compose.yml](#docker-composeyml)
8. [Critérios Avaliativos](#critérios-avaliativos)
9. [Vídeo](#vídeo)

## Pré-requisitos

Antes de começar, você precisará ter as seguintes ferramentas instaladas em sua máquina:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Estrutura do Projeto

- `Dockerfile`: Define a imagem Docker para a aplicação.
- `docker-compose.yml`: Define os serviços Docker para desenvolvimento.
- `docker-compose.prod.yml`: Define os serviços Docker para produção.
- `.dockerignore`: Arquivos e diretórios a serem ignorados pelo Docker.

## Configuração

1. Clone o repositório:

   ```bash
   git clone https://github.com/pedro-git-projects/puc-mvp-software-architecture-frontend.git
   cd puc-mvp-software-architecture-frontend
   ```

## Desenvolvimento

Para rodar a aplicação em modo de desenvolvimento, use o Docker Compose:

1. Construa a imagem Docker:

   ```bash
   docker-compose build
   ```

2. Inicie a aplicação:

   ```bash
   docker-compose up
   ```

A aplicação estará disponível em [http://localhost:3000](http://localhost:3000).

Lembre-se de ter subido também a outra API que faz parte do projeto, hospedada [aqui](https://github.com/pedro-git-projects/puc-mvp-software-architecture-persistence)

## Uso

1. **Abrir a Aplicação**:
   - Inicie a aplicação no seu navegador.

2. **Cadastro**:
   - Clique no botão para se cadastrar.
   - Preencha o formulário de criação de conta com seus dados.
   - Clique em "Criar Conta".

3. **Login**:
   - Após criar a conta, faça login usando suas credenciais.
   
4. **Barra de Pesquisa**:
   - Após fazer login, você terá acesso à barra de pesquisa do site.
   - Digite o nome de um álbum ou artista na barra de pesquisa.
   - Clique na lupa para realizar a pesquisa.
   - Você verá uma lista dos álbuns relacionados à sua pesquisa.

5. **Salvando e removendo favoritos**
    - Clique no coração em outline no card para adicionar um álbum aos favoritos.
    - Clique em um coração sólido no card para remover um álbum dos favoritos.

6. **Viusualizado a lista de favoritos**
    - Clique em "favoritos" na navbar para navegar até /favoritos 
    - Uma lista com todos os seus items favoritados será renderizada.

7. **Perfil**:
   - Navegue até a seção de perfil.
   - Aqui você pode ver o seu email registrado.
   - Você também pode optar por deletar sua conta.

No trabalho, é possível buscar álbuns através do nome, artista ou músicas, assim como favoritar álbuns. As informações dos álbuns são buscadas do MusicBrainz, enquanto as capas dos álbuns são obtidas do Cover Art Archive, que depende do ID fornecido pelo MusicBrainz. Autenticação e autorização também foram implementadas através de tokens.

## Dockerfile

O `Dockerfile` utilizado para a construção da imagem Docker:

```Dockerfile
# Stage 1: Base
FROM node:22-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Stage 2: Build
FROM base AS build
RUN npm run build

# Stage 3: Production
FROM node:18-alpine AS production
WORKDIR /app
COPY --from=build /app ./
EXPOSE 3000
CMD ["npm", "start"]

# Stage 4: Development
FROM base AS development
WORKDIR /app
EXPOSE 3000
CMD ["npm", "run", "dev"]
```

## docker-compose.yml

Arquivo `docker-compose.yml` para desenvolvimento:

```yaml
services:
  nextjs-app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - '3000:3000'
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      NODE_ENV: development
    command: ["npm", "run", "dev"]
```

## Critérios Avaliativos

- "A interface do usuário deve fazer chamadas a pelo menos 5 rotas diferentes."



| Rota                                                                                                    | Componente            | Serviço                   | Método | Propósito                                                                                               |
|---------------------------------------------------------------------------------------------------------|-----------------------|---------------------------|--------|---------------------------------------------------------------------------------------------------------|
| `https://musicbrainz.org/ws/2/release?query=artist:${artist}%20AND%20release:${album}&fmt=json`         | `AlbumSearch`         | MusicBrainz               | GET    | Buscar informações de álbuns de um artista específico. No caso é utilizada para pegar o ID que pode ser usado para buscar a arte do álbum em uma segunda API.                                     |
| `https://coverartarchive.org/release/${releaseId}/front`                                                | `AlbumCover`          | Cover Art Archive         | GET    | Obter a url da imagem da capa de um lançamento específico.                                                      |
| `https://musicbrainz.org/ws/2/release?query=artist:${query.artist}%20AND%20release:${query.album}&fmt=json` | `SearchResults`       | MusicBrainz               | GET    | Buscar informações de álbuns de um artista específico com base em uma consulta do usuário. |
| `http://localhost:8000/token`                                                                           | `AuthProvider`        | Servidor desenvolvido por mim | POST   | Obter o token de autenticação para login do usuário.                                                     |
| `http://localhost:8000/users/`                                                                          | `SignupForm`         | Servidor desenvolvido por mim | POST    | Criar um novo usuário.                                                             |
| `http://localhost:8000/users/me`                                                                        | `Profile`             | Servidor desenvolvido por mim | DELETE | Deletar a conta do usuário logado.                                                            |
| `http://localhost:8000/users/me/`                                                                       | `Profile`             | Servidor desenvolvido por mim | GET    | Obter o perfil do usuário logado.                                                             |
| `http://localhost:8000/users/me/favorites`                                                              | `Favorites`           | Servidor desenvolvido por mim | GET    | Obter a lista de álbuns favoritos do usuário logado.                                                             |
| `http://localhost:8000/users/me/favorites`                                                              | `FavoriteAlbumCard`   | Servidor desenvolvido por mim | POST   | Adicionar um álbum à lista de favoritos do usuário logado.                                                             |
| `http://localhost:8000/users/me/favorites/${release.album_id}`                                          | `FavoriteAlbumCard`   | Servidor desenvolvido por mim | DELETE | Remover um álbum da lista de favoritos do usuário logado.                                                             |
| `/api/search?album=${album}`                                                                            | `SearchInput`         | Next.js Server Action     | GET    | Buscar informações de álbuns de um artista específico com base no nome do álbum fornecido pelo usuário.                                                             |


- "Uso de uma API externa pública e que ofereça um serviço não pago. Apresentar na documentação a componente principal a API externa que será utilizada, deixando claro informações como: licença de uso (se aplicável), cadastro (se necessário) e rotas que foram utilizados."

Como visto na tabela acima foram utilizadas duas APIs externas, **Music Brainz** e **Cover Art Archive**. Aqui estão os componentes:

```tsx
export const fetchAlbumData = async (artist: string, album: string) => {
  const response = await fetch(
    `https://musicbrainz.org/ws/2/release?query=artist:${artist}%20AND%20release:${album}&fmt=json`,
  );
  const data = await response.json();
  if (data.releases && data.releases.length > 0) {
    const releaseId = data.releases[0].id;
    const coverArtUrl = `https://coverartarchive.org/release/${releaseId}/front`;
    return {
      name: data.releases[0].title,
      artist: data.releases[0]["artist-credit"][0].name,
      coverArtUrl,
    };
  }
  return null;
};
```

```tsx
export const fetchAlbums = async (queries: Query[]): Promise<Album[]> => {
  const albums = [];
  for (const query of queries) {
    const response = await fetch(
      `https://musicbrainz.org/ws/2/release?query=artist:${query.artist}%20AND%20release:${query.album}&fmt=json`,
    );
    const data = await response.json();
    if (data.releases && data.releases.length > 0) {
      const releaseId = data.releases[0].id;
      const coverArtUrl = `https://coverartarchive.org/release/${releaseId}/front-250`;
      albums.push({
        name: data.releases[0].title,
        artist: data.releases[0]["artist-credit"][0].name,
        coverArtUrl,
      });
    }
  }
  return albums;
};
```

```tsx
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://localhost:8000/users/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Falha ao criar conta");
      }

      setSuccess("Conta criada com sucesso");
    } catch (error: any) {
      console.error("Signup failed:", error);
      setError(error.message || "Falha ao criar conta");
    }
  };

```

```tsx
export async function deleteUserAccount() {
  const token = localStorage.getItem("token");
  const response = await fetch("http://localhost:8000/users/me", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete user account");
  }

  return response.json();
}
```

```tsx
export async function fetchUserProfile() {
  const token = localStorage.getItem("token");
  const response = await fetch("http://localhost:8000/users/me/", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user profile");
  }

  return response.json();
}
```

```
  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      alert("Você precisa estar logado para salvar nos favoritos");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const url = isFavorite
        ? `http://localhost:8000/users/me/favorites/${release.id}`
        : "http://localhost:8000/users/me/favorites";
      const method = isFavorite ? "DELETE" : "POST";
      const body = !isFavorite
        ? JSON.stringify({
            album_id: release.id,
            album_name: release.title || release.album_name,
            artist_name: release["artist-credit"]
              ? release["artist-credit"][0].name
              : release.artist_name,
            cover_art_url: coverArtUrl,
          })
        : null;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body,
      });

      if (response.ok) {
        setIsFavorite(!isFavorite);
      } else {
        console.error("Error toggling favorite:", response.statusText);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };
```

```tsx
export default function ResultsPage() {
  const { isAuthenticated } = useAuth();
  const [releases, setReleases] = useState<Release[]>(() => {
    try {
      const item = window.sessionStorage.getItem("searchResults");
      return item ? JSON.parse(item) : [];
    } catch (error) {
      console.error(error);
      return [];
    }
  });
  const [favorites, setFavorites] = useState<PythonRelease[]>([]);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);

    if (isAuthenticated) {
      const fetchFavorites = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(
            "http://localhost:8000/users/me/favorites",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          if (response.ok) {
            const data = await response.json();
            setFavorites(data);
          } else {
            console.error("Error fetching favorites:", response.statusText);
          }
        } catch (error) {
          console.error("Error fetching favorites:", error);
        }
      };

      fetchFavorites();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const handleStorageUpdate = () => {
      try {
        const item = window.sessionStorage.getItem("searchResults");
        setReleases(item ? JSON.parse(item) : []);
      } catch (error) {
        console.error(error);
      }
    };

    window.addEventListener("storageUpdate", handleStorageUpdate);
    return () => {
      window.removeEventListener("storageUpdate", handleStorageUpdate);
    };
  }, []);

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-8 w-full max-w-6xl">
          {Array.from({ length: 8 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Resultados
          </h2>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            Clique no coração para favoritar ou remover dos favoritos.
          </p>
        </div>
        <div className="mx-auto mt-10 max-w-2xl border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none">
          {releases.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8 lg:gap-8 w-full">
              {releases.map((release: Release) => (
                <AlbumCard
                  key={release.id}
                  release={release}
                  favorites={favorites}
                />
              ))}
            </div>
          ) : (
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Nenhum resultado encontrado para o termo pesquisado.
            </h2>
          )}
        </div>
      </div>
    </div>
  );
}
```

```tsx
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries: number = 3,
): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) {
        return response;
      }
      console.warn(`Attempt ${i + 1} failed: ${response.statusText}`);
    } catch (error) {
      console.warn(`Attempt ${i + 1} error: ${error}`);
      if (i === retries - 1) {
        throw error;
      }
    }
  }
  throw new Error("All retry attempts failed");
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const album = searchParams.get("album");

  if (!album) {
    console.error("Album name is required");
    return NextResponse.json(
      { error: "Nome do álbum é obrigatório" },
      { status: 400 },
    );
  }

  try {
    const response = await fetchWithRetry(
      `https://musicbrainz.org/ws/2/release/?query=release:${album}&fmt=json`,
      {
        headers: {
          "User-Agent": "Songboxd/1.0 (pedro.coding.contact@gmail.com)",
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Error fetching from MusicBrainz:", data);
      return NextResponse.json({ error: data }, { status: response.status });
    }

    return NextResponse.json(data.releases);
  } catch (error) {
    console.error("Internal server error:", error);
    return NextResponse.json(
      { error: "Falha ao buscar dados do MusicBrainz" },
      { status: 500 },
    );
  }
}
```


- "Será permitido a utilização de bibliotecas ou frameworks baseadas em Javascript, como o React, Next, e outras; Será permitido também o uso de bibliotecas de componentes, como o Material UI, Bootstrap, e outras" 

A aplicação é desenvolvida com NextJS 14 e Tailwind.

- "É fortemente recomendado produzir uma imagem (fluxograma) ilustrando a arquitetura da aplicação desenvolvida."

![Diagrama do Projeto](./diagram.png)


## Vídeo

Para a conveniência dos professores uma demonstração em vídeo foi colocada no [YouTube](https://youtu.be/HKRCr_5HPz4)
