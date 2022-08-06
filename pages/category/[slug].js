import Layout from "@components/layout";
import Container from "@components/container";
import { useRouter } from "next/router";
import client, { getClient, usePreviewSubscription } from "@lib/sanity";
import { postquery, configQuery, pathquery, categoryquery, singlequery, singlecategoryquery } from "@lib/groq";
import PostList from "@components/postlist";

export default function Post(props) {
  const { postdata, siteconfig, preview, categorydata } = props;

  const router = useRouter();

  const { data: posts } = usePreviewSubscription(postquery, {
    initialData: postdata,
    enabled: preview || router.query.preview !== undefined
  });

  const { data: siteConfig } = usePreviewSubscription(configQuery, {
    initialData: siteconfig,
    enabled: preview || router.query.preview !== undefined
  });

  const { data: category } = usePreviewSubscription(configQuery, {
    initialData: categorydata,
    enabled: preview || router.query.preview !== undefined
  });
  let postsFiltered = []

  if (posts) {
    postsFiltered = posts.filter((e) => {
      if (e.categories) {
        return e.categories.filter(e => {
          return e.slug.current === category.slug.current
        }).length
      } else {
        return 0
      }
    })
  }


  return (
    <>
      {posts && siteConfig && (
        <Layout {...siteConfig}>
          <Container>
            <h1 className="text-3xl font-semibold tracking-tight text-center lg:leading-snug text-brand-primary lg:text-4xl dark:text-white">
              { category.title }
            </h1>
            <div className="text-center">
              <p className="mt-2 text-lg">
                { category.description }
              </p>
            </div>
            <div className="grid gap-10 mt-10 lg:gap-10 md:grid-cols-2 xl:grid-cols-3 ">
              {postsFiltered.map(post => (
                <PostList
                  key={post._id}
                  post={post}
                  aspect="square"
                />
              ))}
            </div>
          </Container>
        </Layout>
      )}
    </>
  );
}

export async function getStaticProps({ params, preview = false }) {
  const post = await getClient(preview).fetch(postquery);
  const config = await getClient(preview).fetch(configQuery);
  const category = await getClient(preview).fetch(singlecategoryquery, {
    slug: params.slug
  });

  if (!category) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      postdata: post,
      categorydata: category,
      siteconfig: { ...config },
      preview
    },
    revalidate: 10
  };
}

export async function getStaticPaths() {
  const allPosts = await client.fetch(pathquery);
  return {
    paths:
      allPosts?.map(page => ({
        params: {
          slug: page.slug
        }
      })) || [],
    fallback: true
  };
}
