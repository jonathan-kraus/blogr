import React from "react"
import { GetServerSideProps } from "next"
import ReactMarkdown from "react-markdown"
import Layout from "../../components/Layout"
import { PostProps } from "../../components/Post"
import prisma from '../../lib/prisma';
import { env } from "process"
//import { type NextRequest, NextResponse } from "next/server"

export const dynamic = 'force-dynamic';
import { Resend } from 'resend';

const resend = new Resend('re_Tb5DYv3r_L8sAWrfbHGm46eNzkbxyxymo');

resend.emails.send({
  from: 'onboarding@resend.dev',
  to: 'jonathanckraus@gmail.com',
  subject: 'Jello World',
  html: '<p>Congrats on sending your <strong>second email</strong>!</p>'
});
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const post = await prisma.post.findUnique({
    where: {
      id: String(params?.id),
    },
    include: {

      author: {
        select: { name: true },
      },
  },
  });

  return {
    props: post,
  };
};
function MyButton() {
  return (
      <button>A{env.MY_SECRET}B</button>
  );
}
let My_sc = 123;
function goToNext() {
  console.log("GTN");
  console.log(My_sc);
  My_sc += 1;
  return (
      <p>{My_sc}</p>
  );
}

const Post: React.FC<PostProps> = (props) => {
  let title = props.title
  let My_sd = 123
  console.log(props.createdj)
  if (!props.published) {
    title = `${title} (Draft)`
  }

  return (
    <Layout>
      <div>
        <h2>{title}</h2>
        <p>Author {props?.author?.name || "Unknown author"}</p>
        <p>Date {props?.createdj || "Unknown date"}</p>
        <p><MyButton /></p>
        <p>{My_sd}</p>
        <button id="nextButton" onClick={goToNext}>{My_sc}</button>
        <ReactMarkdown children={props.content} />
      </div>
      
      <style jsx>{`
        .page {
          background: white;
          padding: 2rem;
        }

        .actions {
          margin-top: 2rem;
        }

        button {
          background: #ececec;
          border: 0;
          border-radius: 0.125rem;
          padding: 1rem 2rem;
        }

        button + button {
          margin-left: 1rem;
        }
      `}</style>
    </Layout>
  )
}

export default Post
