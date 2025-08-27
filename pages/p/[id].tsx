import React from "react"
import { GetServerSideProps } from "next"
import ReactMarkdown from "react-markdown"
import Layout from "../../components/Layout"
import { PostProps } from "../../components/Post"
import prisma from '../../lib/prisma';
import { env } from "process"
//import { type NextRequest, NextResponse } from "next/server"
//--------------------
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Sample user data with realistic names and emails
const userData = [
  { name: "Alice Johnson", email: "alice.johnson@example.com" },
  { name: "Bob Smith", email: "bob.smith@example.com" },
  { name: "Carol Davis", email: "carol.davis@example.com" },
  { name: "David Wilson", email: "david.wilson@example.com" },
  { name: "Emma Brown", email: "emma.brown@example.com" },
  { name: "Frank Miller", email: "frank.miller@example.com" },
  { name: "Grace Lee", email: "grace.lee@example.com" },
  { name: "Henry Taylor", email: "henry.taylor@example.com" },
  { name: "Ivy Chen", email: "ivy.chen@example.com" },
  { name: "Jack Anderson", email: "jack.anderson@example.com" },
  { name: "Kate Martinez", email: "kate.martinez@example.com" },
  { name: "Liam Garcia", email: "liam.garcia@example.com" },
  { name: "Maya Patel", email: "maya.patel@example.com" },
  { name: "Noah Rodriguez", email: "noah.rodriguez@example.com" },
  { name: "Olivia Thompson", email: "olivia.thompson@example.com" },
  { name: "Paul White", email: "paul.white@example.com" },
  { name: "Quinn Jackson", email: "quinn.jackson@example.com" },
  { name: "Rachel Green", email: "rachel.green@example.com" },
  { name: "Sam Kim", email: "sam.kim@example.com" },
  { name: "Tina Lopez", email: "tina.lopez@example.com" },
]

async function seedUsers() {
  console.log("[v0] Starting user database seeding...")

  try {
    // Clear existing users (optional - remove if you want to keep existing data)
    console.log("[v0] NOT REALLY Clearing existing users...")
    //await prisma.user.deleteMany({})

    // Create users
    console.log("[v0] Creating users...")
    const createdUsers = []

    for (const user of userData) {
      try {
        const createdUser = await prisma.user.create({
          data: {
            name: user.name,
            email: user.email,
          },
        })
        createdUsers.push(createdUser)
        console.log(`[v0] Created user: ${createdUser.name} (${createdUser.email})`)
      } catch (error) {
        if (error.code === "P2002") {
          console.log(`[v0] User with email ${user.email} already exists, skipping...`)
        } else {
          console.error(`[v0] Error creating user ${user.name}:`, error.message)
        }
      }
    }

    console.log(`[v0] Successfully seeded ${createdUsers.length} users!`)

    // Display summary
    const totalUsers = await prisma.user.count()
    console.log(`[v0] Total users in database: ${totalUsers}`)
  } catch (error) {
    console.error("[v0] Error during seeding:", error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the seeding function
seedUsers()
  .then(() => {
    console.log("[v0] User seeding completed successfully!")
    process.exit(0)
  })
  .catch((error) => {
    console.error("[v0] User seeding failed:", error)
    process.exit(1)
  })

//--------------------
export const dynamic = 'force-dynamic';
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
