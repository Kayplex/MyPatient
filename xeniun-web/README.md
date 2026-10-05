# Xeniun — sitio web corporativo

Rediseño de [xeniun.com](https://xeniun.com): sitio estático, bilingüe (ES/EN) y de alto rendimiento, con una escena 3D en tiempo real hecha con Three.js.

## Concepto

- **Identidad.** "Xeniun" suena a elemento químico (xenón + -ium). El sistema visual parte de esa idea: fondo grafito, una sola luz de acento (azul-violeta del xenón → cian iónico), tipografía Geist con titulares grandes y etiquetas monoespaciadas tipo ficha técnica.
- **3D con propósito.** Un núcleo de cristal ("Xeniun core") con órbitas recibe al visitante. Al hacer scroll, 15 000 partículas se transforman en un modelo distinto para cada área de práctica:

  | Sección | Modelo 3D |
  |---|---|
  | Hero | Núcleo de cristal + nube atómica |
  | 01 I+D+i | Doble hélice |
  | 02 Software & IA | Red neuronal |
  | 03 Eléctrica & Telecom | Campo de señal (ondas animadas) |
  | 04 Energía & Industria | Reactor toroidal |
  | 05 Consultoría | Retícula estructural |
  | Método / Sectores / Nosotros | Galaxia (fondo tenue) |
  | Contacto | Globo |

- **Tono ejecutivo.** Mensajes cortos orientados a resultados, el método explicado con la escala TRL (estándar de NASA / UE) y un formulario de contacto que califica al cliente por área.

## Estructura

```
index.html              Página (contenido en español, SEO, datos estructurados)
assets/css/main.css     Sistema de diseño y layout responsive
assets/js/main.js       Interfaz: idioma ES/EN, menú, animaciones, formulario
assets/js/scene.min.js  Escena 3D compilada (no editar a mano)
src/scene.js            Código fuente de la escena 3D
assets/fonts/           Geist y Geist Mono (alojadas localmente, licencia OFL)
assets/img/             Favicon e imagen para redes sociales (og-image.jpg)
robots.txt, sitemap.xml, site.webmanifest
```

## Verlo en local

```bash
npm install
npm run dev        # compila la escena y sirve en http://localhost:4173
```

Sin Node basta con cualquier servidor estático (`python3 -m http.server`). Abrir `index.html` con doble clic no funciona porque los módulos JS necesitan servirse por HTTP.

## Publicar

Es HTML/CSS/JS estático: se publica copiando la carpeta (sin `node_modules/` ni `src/`) a cualquier hosting.

- **Netlify / Vercel / Cloudflare Pages:** conectar el repositorio, carpeta de publicación `xeniun-web`, sin comando de build. Es la opción recomendada: HTTPS, CDN global y despliegue en cada commit.
- **Hosting actual (cPanel/FTP):** respaldar WordPress y subir el contenido de `xeniun-web/` a `public_html/`.
- **Mantener WordPress** (por ejemplo para un blog): mover WordPress a `blog.xeniun.com` o `/blog` y dejar este sitio como portada.

## Antes de publicar: datos por confirmar

Estos datos no se pudieron verificar contra la web actual y conviene revisarlos:

- [ ] Correo de contacto `info@xeniun.com` (en `index.html`: atributo `data-mailto` del formulario y enlaces `mailto:`).
- [ ] URL de LinkedIn `https://www.linkedin.com/company/xeniun`.
- [ ] Año de fundación **2017** (estadística en la sección Nosotros).
- [ ] Logotipo: el símbolo actual (X dentro de una celda de elemento) es provisional. Para usar el logo oficial, reemplazar el `<symbol id="mark">` de `index.html` y `assets/img/favicon.svg`.
- [ ] Sectores y servicios: ajustar las listas a la oferta real.
- [ ] Teléfono / WhatsApp y dirección exacta, si se quieren mostrar.

## Formulario de contacto

Por defecto el formulario abre el cliente de correo del visitante con el mensaje ya redactado (no necesita servidor). Para recibir los envíos directamente, poner la URL de un servicio como Formspree, Basin o un endpoint propio en el atributo `data-endpoint` del formulario: el sitio enviará un POST con JSON (`name`, `company`, `email`, `area`, `message`, `lang`).

## Editar textos

- **Español:** directamente en `index.html`.
- **Inglés:** en el objeto `EN` al inicio de `assets/js/main.js`, con las mismas claves `data-i18n` que en el HTML.

El idioma se detecta según el navegador y se recuerda la elección del visitante.

## Editar la escena 3D

`src/scene.js` define los modelos (funciones `atom`, `helix`, `neural`, `waves`, `torus`, `lattice`, `galaxy`, `globe`) y la tabla `KEYFRAMES`, que asigna a cada `data-scene` del HTML un modelo, una posición, una escala y una opacidad. Tras editarlo:

```bash
npm run build
```

## Rendimiento y accesibilidad

- Un solo `<canvas>` y una sola llamada de dibujo para las partículas. La resolución se reduce automáticamente en equipos lentos y la escena se pausa cuando la pestaña no está visible.
- Menos partículas en móvil. Si WebGL no está disponible, se muestra un fondo degradado.
- Se respeta `prefers-reduced-motion`. El sitio incluye enlace para saltar al contenido, foco visible, HTML semántico y navegación completa por teclado.
- SEO: título y descripción por idioma, Open Graph, datos estructurados `Organization`, `sitemap.xml` y `robots.txt`.
