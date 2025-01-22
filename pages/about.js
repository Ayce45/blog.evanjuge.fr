import Container from "@components/container";
import Layout from "@components/layout";
import { authorsquery, configQuery } from "@lib/groq";
import { getClient } from "@lib/sanity";
import GetImage from "@utils/getImage";
import Image from "next/image";
import Link from "next/link";
import { NextSeo } from "next-seo";

export default function About({ authors, siteconfig }) {

  const description = `Médaillé d’excellence international et champion de France en web développement, je suis actuellement développeur fullstack chez Digitaleo.`

  const ogimage = siteconfig?.openGraphImage
  ? GetImage(siteconfig?.openGraphImage).src
  : defaultOG.src;

  return (
    <Layout {...siteconfig}>
      <NextSeo
        title={`À propos - ${siteconfig.title}`}
        description={description}
        canonical={`${siteconfig?.url}/post/about`}
        openGraph={{
          url: `${siteconfig?.url}/post/about`,
          title: `À propos - ${siteconfig.title}`,
          description,
          images: [
            {
              url: ogimage,
              width: 800,
              height: 600,
              alt: ""
            }
          ],
          site_name: siteconfig.title
        }}
        twitter={{
          cardType: "summary_large_image"
        }}
      />
      <Container>
        <h1 className="mt-2 mb-3 text-3xl font-semibold tracking-tight text-center lg:leading-snug text-brand-primary lg:text-4xl dark:text-white">
          À propos
        </h1>

        <div className="grid grid-cols-3 gap-5 mt-6 mb-16 md:mt-16 md:mb-32 md:gap-16">
          {authors.slice(0, 3).map(author => {
            const { width, height, ...imgprops } = GetImage(
              author?.image
            );
            return (
              <div
                key={author._id}
                className="relative overflow-hidden rounded-md aspect-square odd:translate-y-10 odd:md:translate-y-16 col-start-2">
                <Image
                  {...imgprops}
                  alt={author.name || " "}
                  layout="fill"
                  objectFit="cover"
                  sizes="(max-width: 320px) 100vw, 320px"
                />
              </div>
            );
          })}
        </div>

        <div className="mx-auto prose text-center dark:prose-invert mt-14">
          <p>
            {description}
          </p>
          <p>
            <Link href="/contact">Prenez contact avec moi</Link>
          </p>
        </div>
      </Container>
    </Layout>
  );
}

export async function getStaticProps({ params, preview = false }) {
  //console.log(params);
  const authors = await getClient(preview).fetch(authorsquery);
  const config = await getClient(preview).fetch(configQuery);
  return {
    props: {
      authors: authors,
      siteconfig: { ...config },
      preview
    },
    revalidate: 100
  };
}
