import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
export const runtime = "nodejs"
export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json()
    if (!name || !email || !password) {
      return NextResponse.json({
        error: "Email or password or name are required",
      },
        {
          status: 403
        })
    }
    await connectDB().then(() => {
      console.log("MONGO CONNECTED")
    })
    const existedUser = await User.findOne({ email })
    console.log(existedUser)
    if (existedUser) {
      return NextResponse.json({
        error: "User already exists",
      },
        {
          status: 400
        })
    }

    await User.create({
      name,
      email,
      password
    })

    return NextResponse.json({
      message: "User Created Successfully"
    }, {
      status: 200
    })

  } catch (error: any) {

    return NextResponse.json({
      error: error.message
    }, {
      status: 500
    })
  }
}
