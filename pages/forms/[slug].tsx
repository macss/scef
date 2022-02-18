import React from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import path from 'path';
import { promises as fs } from 'fs';
import slugify from '@lib/utils/slugify';
import routes from 'routes';

export const getStaticPaths: GetStaticPaths = async () => {
  const directory = path.join(process.cwd(), 'lib','forms')
  const filenames = await fs.readdir(directory)

  const paths = filenames.map(filename => ({ params: { slug: slugify(filename.replace(/.tsx/, '')) } }))

  return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps<Record<string, any>, { slug: string }> = async (context) => {
  const { slug } = context.params ?? { slug: '' }

  return {
    props: { slug }
  }
}

const ShowForm = ({ slug }: { slug: string }) => {
  const Route = routes.find(el => el.slug === slug)

  if (!Route)
    return <></>

  return <Route.component />;
};

export default ShowForm;
