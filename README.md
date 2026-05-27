# InfraStatera — Site web

## Structure du projet

```
infrastatera/
├── index.html        ← Page principale
├── css/
│   └── style.css     ← Styles (variables CSS, responsive, dark mode)
└── README.md
```

## Lancer en local

Ouvrir `index.html` directement dans un navigateur, ou lancer un serveur local :

```bash
npx serve .
# ou
python3 -m http.server 8080
```

## Palette de couleurs

| Variable         | Valeur    | Usage                    |
|------------------|-----------|--------------------------|
| `--green`        | `#1D9E75` | Couleur principale       |
| `--green-mid`    | `#0F6E56` | Badges, accents          |
| `--green-bg`     | `#E1F5EE` | Fond des badges          |
| `--text-primary` | `#1a1a18` | Titres, corps            |
| `--text-secondary`| `#5f5e5a`| Descriptions             |

## Icônes

Utilise [Tabler Icons](https://tabler.io/icons) via CDN (outline uniquement).  
Exemple : `<i class="ti ti-device-analytics"></i>`

## Pour aller plus loin

- Ajouter une section **À propos** avec le parcours et les références
- Ajouter une section **Études de cas** ou **Références clients**
- Intégrer un **formulaire de contact** (Formspree, Netlify Forms…)
- Déployer sur **Netlify**, **Vercel**, ou **GitHub Pages** (drag & drop du dossier)
