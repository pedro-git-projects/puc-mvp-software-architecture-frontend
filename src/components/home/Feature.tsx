import {
  ListBulletIcon,
  HeartIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";

const features = [
  {
    name: "Pesquise álbuns e artistas",
    description:
      "Use a barra de pesquisa para encontrar álbuns e artistas específicos rapidamente.",
    href: "#",
    icon: MagnifyingGlassIcon,
  },
  {
    name: "Favorite álbuns",
    description:
      "Adicione álbuns à sua lista de favoritos para acessá-los facilmente sempre que quiser.",
    href: "#",
    icon: HeartIcon,
  },
  {
    name: "Acesse sua lista de favoritos",
    description:
      "Veja todos os álbuns que você adicionou aos favoritos em um só lugar.",
    href: "#",
    icon: ListBulletIcon,
  },
];

export default function Feature() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">
            Explore, Favorite, Relembre
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Tudo que você precisa para gerenciar seus álbuns favoritos
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Cadastre-se no site, pesquise álbuns e artistas, e adicione seus
            favoritos. Acesse e gerencie sua lista de favoritos facilmente.
            Conecte-se com amantes da música ao redor do mundo.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map(feature => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <feature.icon
                    className="h-5 w-5 flex-none text-indigo-600"
                    aria-hidden="true"
                  />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
