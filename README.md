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

5. **Perfil**:
   - Navegue até a seção de perfil.
   - Aqui você pode ver o seu email registrado.
   - Você também pode optar por deletar sua conta.

A ideia inicial do projeto era permitir que os usuários avaliassem cada álbum com uma nota de 1 a 5. No entanto, devido às altas demandas do meu trabalho, estou próximo da entrega de uma aplicação na qual sou o único desenvolvedor, e aos critérios de avaliação, optei por lançar uma versão simplificada do projeto que atende aos requisitos de avaliação. Planejo implementar as funcionalidades adicionais em uma fase futura.

Apesar das funcionalidades práticas serem limitadas nesta versão, foi realizada a integração com duas APIs externas de terceiros, uma API desenvolvida especificamente para o projeto e uma rota de server actions do Next.js.

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
| `/api/search?album=${album}`                                                                            | `SearchInput`         | Next.js Server Action     | GET    | Buscar informações de álbuns de um artista específico com base no nome do álbum fornecido pelo usuário.                                                             |

- "Uso de uma API externa pública e que ofereça um serviço não pago. Apresentar na documentação a componente principal a API externa que será utilizada, deixando claro informações como: licença de uso (se aplicável), cadastro (se necessário) e rotas que foram utilizados."

Como visto na tabela acima foram utilizadas duas APIs externas, **Music Brainz** e **Cover Art Archive**. Aqui estão os componentes:


```tsx
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const album = searchParams.get("album");

  if (!album) {
    return NextResponse.json(
      { error: "Nome do álbum é obrigatório" },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(
      `https://musicbrainz.org/ws/2/release/?query=release:${album}&fmt=json`,
      {
        headers: {
          "User-Agent": "Songboxd/1.0 (pedro.coding.contact@gmail.com)",
        },
      },
    );
    const data: MusicBrainzResponse = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data }, { status: response.status });
    }

    return NextResponse.json(data.releases);
  } catch (error) {
    return NextResponse.json(
      { error: "Falha ao buscar dados do MusicBrainz" },
      { status: 500 },
    );
  }
}
```

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
      const coverArtUrl = `https://coverartarchive.org/release/${releaseId}/front`;
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
export default function AlbumCard({ release }: AlbumCardProps) {
  const [coverArtUrl, setCoverArtUrl] = useState<string | null>(null);
  const [coverArtError, setCoverArtError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCoverArt = async () => {
      try {
        const response = await fetch(
          `https://coverartarchive.org/release/${release.id}/front-250`,
        );
        if (response.ok) {
          setCoverArtUrl(response.url);
        } else {
          setCoverArtError(true);
        }
      } catch (error) {
        setCoverArtError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCoverArt();
  }, [release.id]);

  return (
    <div className="border rounded-lg p-4 shadow-md mb-4">
      {loading ? (
        <div className="w-full h-64 flex items-center justify-center bg-gray-200 text-gray-600 rounded-md mb-4 animate-pulse">
          <div className="text-center">Carregando...</div>
        </div>
      ) : coverArtError ? (
        <div className="w-full h-64 flex items-center justify-center bg-gray-200 text-gray-600 rounded-md mb-4">
          Capa Não Encontrada
        </div>
      ) : (
        coverArtUrl && (
          <img
            src={coverArtUrl}
            alt={`${release.title} cover art`}
            className="w-full h-64 object-cover rounded-md mb-4"
            onError={() => setCoverArtError(true)}
          />
        )
      )}
      <h2 className="text-xl font-bold">{release.title}</h2>
      <p className="text-gray-600">
        Artista:{" "}
        {release["artist-credit"] && release["artist-credit"].length > 0
          ? release["artist-credit"][0].name
          : "Artista Desconhecido"}
      </p>
      <p className="text-gray-600">Data de lançamento: {release.date}</p>
      <p className="text-gray-600">País: {release.country}</p>
      {release["label-info"] && release["label-info"].length > 0 && (
        <p className="text-gray-600">
          Gravadora: {release["label-info"][0].label.name}
        </p>
      )}
    </div>
  );
}
```


- "Será permitido a utilização de bibliotecas ou frameworks baseadas em Javascript, como o React, Next, e outras; Será permitido também o uso de bibliotecas de componentes, como o Material UI, Bootstrap, e outras" 

A aplicação é desenvolvida com NextJS 14 e Tailwind.

- "É fortemente recomendado produzir uma imagem (fluxograma) ilustrando a arquitetura da aplicação desenvolvida."

![Diagrama do Projeto](./diagram.png)
