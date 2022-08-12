import groq from 'groq'
import { getClient } from "@lib/sanity";

export default function SiteMap() {
  return <div>loading</div>
}

export async function getServerSideProps({ res }) {
    const baseUrl = {
        development: "http://localhost:3000",
        production: "https://blog.evanjuge.fr",
      }[process.env.NODE_ENV];

  const postsquery = groq`{
      "posts": *[_type == 'post']{slug, _updatedAt},
    }`
  const postsdatas = await getClient().fetch(postsquery)
  const posts = postsdatas.posts.map(post => {
    const slug =
      post.slug.current === '/' ? '/' : `/post/${post.slug.current}`
    return `
      <loc>${baseUrl}${slug}</loc>
      <changefreq>never</changefreq>
      <lastmod>${post._updatedAt}</lastmod>
      <priority>0.7</priority>
    `
  })

    const categoryquery = groq`{
      "category": *[_type == 'category']{slug},
    }`
  const categorydatas = await getClient().fetch(categoryquery)
  const categories = categorydatas.category.map(post => {
    const slug =
      post.slug.current === '/' ? '/' : `/category/${post.slug.current}`
    return `
      <loc>${baseUrl}${slug}</loc>
      <changefreq>monthly</changefreq>
      <priority>0.7</priority>
    `
  })

  const staticPages = ['about', 'archive', 'contact']
  .map((name) => {
    return `
        <loc>${baseUrl}/${name}</loc>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    `
  });

  const indexPage = `
    <loc>${baseUrl}/</loc>
    <changefreq>monthly</changefreq>
    <priority>1</priority>
    `

  const sitemapDatas = [indexPage, ...staticPages, ...categories, ...posts,]
  const createSitemap = () => `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${sitemapDatas
          .map(each => {
            return `<url>
                      ${each}
                    </url>
                  `
          })
          .join('')}
    </urlset>
    `
  res.setHeader('Content-Type', 'text/xml')
  res.write(createSitemap())
  res.end()
  return {
    props: {},
  }
}