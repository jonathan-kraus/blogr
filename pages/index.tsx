import React from "react"
import { GetStaticProps } from "next"
import Layout from "../components/Layout"
import Post, { PostProps } from "../components/Post"
import prisma from '../lib/prisma';
import { PrismaClient } from "@prisma/client"

const prismac = new PrismaClient()

// Sample user data with realistic names and emails
const userData = [
  { id: "1101", created_at: "2025-08-13T18:13:09.503+00:00", name: "Alice Johnson",
    email: "alice.johnson@example.com", updated_at: "2025-08-13T18:13:09.503+00:00" },
  { id: "1102", created_at: "2025-08-13T18:13:09.503+00:00", name: "Bob Smith",
    email: "bob.smith@example.com", updated_at: "2025-08-13T18:13:09.503+00:00" },
{ id: "1103", created_at: "2025-08-13T18:13:09.503+00:00", name: "Carol Davis",
    email: "carol.davis@example.com", updated_at: "2025-08-13T18:13:09.503+00:00" },
  { id: "1104", created_at: "2025-08-13T18:13:09.503+00:00", name: "David Wilson",
    email: "david.wilson@example.com", updated_at: "2025-08-13T18:13:09.503+00:00" },
  { id: "1105", created_at: "2025-08-13T18:13:09.503+00:00", name: "Emma Brown",
    email: "emma.brown@example.com", updated_at: "2025-08-13T18:13:09.503+00:00" },
  { id: "1106", created_at: "2025-08-13T18:13:09.503+00:00", name: "Frank Miller",
    email: "frank.miller@example.com", updated_at: "2025-08-13T18:13:09.503+00:00" },
  { id: "1107", created_at: "2025-08-13T18:13:09.503+00:00", name: "Grace Lee",
    email: "grace.lee@example.com", updated_at: "2025-08-13T18:13:09.503+00:00" },
  { id: "1108", created_at: "2025-08-13T18:13:09.503+00:00", name: "Henry Taylor",
    email: "henry.taylor@example.com", updated_at: "2025-08-13T18:13:09.503+00:00" },
  { id: "1109", created_at: "2025-08-13T18:13:09.503+00:00", name: "Ivy Chen",
    email: "ivy.chen@example.com", updated_at: "2025-08-13T18:13:09.503+00:00" },
  { id: "1110", created_at: "2025-08-13T18:13:09.503+00:00", name: "Jack Anderson",
    email: "jack.anderson@example.com", updated_at: "2025-08-13T18:13:09.503+00:00" },
  { id: "1111", created_at: "2025-08-13T18:13:09.503+00:00", name: "Kate Martinez",
    email: "kate.martinez@example.com", updated_at: "2025-08-13T18:13:09.503+00:00" },

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
            created_at: user.created_at,
            name: user.name,
            email: user.email,
            updated_at: user.updated_at,
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
