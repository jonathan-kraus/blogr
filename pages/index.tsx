import React from "react"
import { GetStaticProps } from "next"
import Layout from "../components/Layout"
import Post, { PostProps } from "../components/Post"
import prisma from '../lib/prisma';
import { PrismaClient } from "@prisma/client"

const prismac = new PrismaClient()

// Sample user data with realistic names and emails
const userData = [
  { id: "1116", created_at: "2025-08-29T09:53:09.503+00:00", name: "Liam Garcia",
    email: "liam.garcia@example.com", updated_at: "2025-08-29T09:53:09.503+00:00" },
  { id: "1117", created_at: "2025-08-29T09:53:09.503+00:00", name: "Maya Patel",
    email: "maya.patel@example.com", updated_at: "2025-08-29T09:53:09.503+00:00" },
  { id: "1118", created_at: "2025-08-29T09:53:09.503+00:00", name: "Noah Rodriguez",
    email: "noah.rodriguez@example.com", updated_at: "2025-08-29T09:53:09.503+00:00" },
  { id: "1119", created_at: "2025-08-29T09:53:09.503+00:00", name: "Olivia Thompson",
    email: "olivia.thompson@example.com", updated_at: "2025-08-29T09:53:09.503+00:00" },
  { id: "1120", created_at: "2025-08-29T09:53:09.503+00:00", name: "Paul White",
    email: "paul.white@example.com", updated_at: "2025-08-29T09:53:09.503+00:00" },
  { id: "1121", created_at: "2025-08-29T09:53:09.503+00:00", name: "Quinn Jackson",
    email: "quinn.jackson@example.com", updated_at: "2025-08-29T09:53:09.503+00:00" },
  { id: "1122", created_at: "2025-08-29T09:53:09.503+00:00", name: "Rachel Green",
    email: "rachel.green@example.com", updated_at: "2025-08-29T09:53:09.503+00:00" },
  { id: "1123", created_at: "2025-08-29T09:53:09.503+00:00", name: "Sam Kim",
    email: "sam.kim@example.com", updated_at: "2025-08-29T09:53:09.503+00:00" },
  { id: "1124", created_at: "2025-08-29T09:53:09.503+00:00", name: "Tina Lopez",
    email: "tina.lopez@example.com", updated_at: "2025-08-29T09:53:09.503+00:00" },
  

]

async function seedUsers() {
  console.log("[v0] Starting user database seeding...")

  try {
    // Clear existing users (optional - remove if you want to keep existing data)
    //console.log("[v0] Clearing existing users...")
    //await prismac.user.deleteMany({})

    // Create users
    console.log("[v0] Creating users...")
    const createdUsers = []

    for (const user of userData) {
      try {
        const createdUser = await prismac.user.create({
          data: {
            id: user.id,
            createdAt: user.created_at,
            name: user.name,
            email: user.email,
            updatedAt: user.updated_at,
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
    const totalUsers = await prismac.user.count()
    console.log(`[v0] Total users in database: ${totalUsers}`)
  } catch (error) {
    console.error("[v0] Error during seeding:", error)
    throw error
  } finally {
    await prismac.$disconnect()
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

 export const getStaticProps: GetStaticProps = async () => {
  const feed = await prisma.post.findMany({
    where: { published: true },
    include: {
      author: { 
        select: { name: true },
      },
    },
  });
  return {
    props: { feed },
    revalidate: 11,
  };
};

type Props = {
  feed: PostProps[]
}
export const revalidate = 60 // revalidate every 60 seconds
const Blog: React.FC<Props> = (props) => {
  return (
    <Layout>
      <div className="page">
        <h1>Public Feed</h1>
        <main>
          {props.feed.map((post) => (
            <div key={post.id} className="post">
              <Post post={post} />
            </div>
          ))}
        </main>
      </div>
      <style jsx>{`
        .post {
          background: blue;
          transition: box-shadow 0.1s ease-in;
        }

        .post:hover {
          box-shadow: 1px 1px 3px #aaa;
        }

        .post + .post {
          margin-top: 2rem;
        }
      `}</style>
    </Layout>
  )
}

export default Blog
